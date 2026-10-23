import { captureMetadata } from './data.ts';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, appendFileSync, rmSync } from 'node:fs';
import { serve } from './serve.ts';
import { hash } from './hash.ts';
import { readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { prepare } from './prepare.ts';
import { assess } from './assess.ts';
import { capture, seedFreshness, browserTools, settle } from './evidence.ts';

test(
  'all six independent browser oracles reject defects and accept repaired behavior',
  { timeout: 120000 },
  async () => {
    const root = mkdtempSync(path.join(tmpdir(), 'ranui-oracle-'));
    const run = prepare({ out: root, label: 'controls', guidanceRef: 'HEAD' });
    try {
      await seedFreshness(path.join(run, '05-freshness'));
      const ids = ['01-text', '02-back', '03-label', '04-effects', '05-freshness', '06-code'];
      for (const id of ids) {
        const dir = path.join(run, id);
        const negative = await assess(dir, { screenshot: false });
        assert.equal(negative.mechanicalPass, false, `${id} seeded defect must fail: ${JSON.stringify(negative)}`);
        const css = path.join(dir, 'surface/style.css');
        const js = path.join(dir, 'surface/app.js');
        if (id === '01-text') appendFileSync(css, '\n.setting .description-text { left: 0; }\n');
        if (id === '02-back')
          writeFileSync(
            js,
            readFileSync(js, 'utf8')
              .replace(
                '<nav><a data-return="workspace" href="#workspace">Back to workspace</a></nav><h1>Project settings</h1>',
                '<h1>Project settings</h1>',
              )
              .replace('${back}${back}', '${back}'),
          );
        if (id === '03-label')
          appendFileSync(css, '\n.return-label { max-width:100%; white-space:normal; overflow:visible; }\n');
        if (id === '04-effects')
          appendFileSync(
            css,
            '\n.premium,.premium .frame { border:0; box-shadow:none; background:none; border-radius:0; padding:0; }\n',
          );
        if (id === '05-freshness') {
          await capture(dir, 'current');
          writeFileSync(
            path.join(dir, 'REPORT.md'),
            'Automated checks passed. Agent visual screenshot review passed for current.png using current.capture.json. Human acceptance not observed.',
          );
        }
        if (id === '06-code') {
          writeFileSync(
            js,
            readFileSync(js, 'utf8')
              .replace("raw.replace(/\\t/g, '  ').trim()", 'raw')
              .replace('navigator.clipboard.writeText(source.textContent)', 'navigator.clipboard.writeText(raw)'),
          );
          appendFileSync(css, '\npre { white-space:pre; overflow:auto; user-select:text; }\n');
        }
        const positive = await assess(dir, { screenshot: false });
        assert.equal(positive.mechanicalPass, true, `${id} repaired behavior must pass: ${JSON.stringify(positive)}`);
        if (id === '01-text' || id === '03-label' || id === '06-code') {
          const restored = readFileSync(css, 'utf8');
          const mutations =
            id === '01-text'
              ? [
                  '.heading-text,.description-text {position:relative;left:8px!important}',
                  '.heading-text,.description-text {display:none}',
                ]
              : id === '03-label'
                ? [
                    '.return-label {height:8px;overflow:hidden}',
                    '.return-label {display:none}',
                    'a[href="#project"] {pointer-events:none}',
                  ]
                : ['main {user-select:none}'];
          for (const mutation of mutations) {
            writeFileSync(css, restored + '\n' + mutation);
            const broken = await assess(dir, { screenshot: false });
            assert.equal(broken.mechanicalPass, false, `${id} must reject ${mutation}: ${JSON.stringify(broken)}`);
          }
          writeFileSync(css, restored);
        }
        if (id === '05-freshness') {
          const { server, url } = await serve(dir);
          const { chromium } = browserTools(dir);
          const browser = await chromium.launch();
          try {
            const page = await browser.newPage();
            const resources: Promise<{ url: string; sha256: string }>[] = [];
            page.on('response', (r) => {
              if (r.status() === 200)
                resources.push(
                  r
                    .body()
                    .then((body) => ({ url: new URL(r.url()).pathname + new URL(r.url()).search, sha256: hash(body) })),
                );
            });
            await page.goto(url);
            await page.waitForSelector('main');
            await settle(page);
            const files = [
              'runtime.js',
              ...readdirSync(path.join(dir, 'surface'), { recursive: true, withFileTypes: true })
                .filter((e) => e.isFile())
                .map((e) => path.relative(dir, path.join(e.parentPath, e.name))),
            ];
            const own = captureMetadata(path.join(dir, 'evidence/current.capture.json'));
            const alt = {
              scope: [id],
              sourceHashes: Object.fromEntries(files.map((p) => [p, hash(readFileSync(path.join(dir, p)))])),
              loadedResources: await Promise.all(resources),
              captures: [{ media: own.media, mediaHash: own.mediaHash }],
            };
            rmSync(path.join(dir, 'evidence/current.capture.json'));
            writeFileSync(path.join(dir, 'evidence/independent.capture.json'), JSON.stringify(alt));
          } finally {
            await browser.close();
            await server.close();
          }
          const alternative = await assess(dir, { screenshot: false });
          assert.equal(
            alternative.mechanicalPass,
            true,
            `alternate per-file and loaded-resource format must pass: ${JSON.stringify(alternative)}`,
          );
          const alternateFile = path.join(dir, 'evidence/independent.capture.json');
          const original = readFileSync(alternateFile, 'utf8');
          const metadata = captureMetadata(alternateFile);
          const resource = metadata.loadedResources?.find((r) => r.url.includes('/components/button/index.ts'));
          assert.ok(resource);
          resource.sha256 = '0'.repeat(64);
          writeFileSync(alternateFile, JSON.stringify(metadata));
          assert.equal(
            (await assess(dir, { screenshot: false })).mechanicalPass,
            false,
            'changed declared dependency response hash fails',
          );
          metadata.loadedResources = [];
          writeFileSync(alternateFile, JSON.stringify(metadata));
          assert.equal(
            (await assess(dir, { screenshot: false })).mechanicalPass,
            null,
            'incomplete alternate dependency set requires manual assessment',
          );
          writeFileSync(alternateFile, original);
        }
        if (id === '05-freshness') {
          appendFileSync(path.join(dir, 'surface/shared.css'), '\n.setting { padding:32px; }\n');
          const stale = await assess(dir, { screenshot: false });
          assert.equal(stale.mechanicalPass, false, 'a real subsequent runtime change must invalidate review');
          await capture(dir, 'current');
          const media = path.join(dir, 'evidence/current.png');
          appendFileSync(media, 'corruption');
          const corrupt = await assess(dir, { screenshot: false });
          assert.equal(corrupt.mechanicalPass, false, 'changed media invalidates declared media hash');
        }
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
);
