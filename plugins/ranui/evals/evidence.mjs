import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { hash, treeHash } from './hash.mjs';
import { serve } from './serve.mjs';
export function browserTools(dir) {
  const { repo } = JSON.parse(readFileSync(path.join(dir, 'run.json')));
  return createRequire(path.join(repo, 'packages/ranui/package.json'))('@playwright/test');
}
export function runtimeHash(dir) {
  const { repo } = JSON.parse(readFileSync(path.join(dir, 'run.json')));
  return hash(
    [
      treeHash(path.join(dir, 'surface')),
      hash(readFileSync(path.join(dir, 'runtime.js'))),
      ...['components/button', 'utils', 'theme'].map((p) => treeHash(path.join(repo, 'packages/ranui', p))),
      ...['base.less', 'style.ts'].map((p) => hash(readFileSync(path.join(repo, 'packages/ranui', p)))),
      treeHash(path.join(repo, 'packages/ranui/fonts')),
      ...['packages/ranuts/dist', 'packages/ranview/dist', 'packages/ranview/src'].map((p) =>
        existsSync(path.join(repo, p)) ? treeHash(path.join(repo, p)) : 'missing:' + p,
      ),
      ...['packages/ranuts/package.json', 'packages/ranview/package.json', 'pnpm-lock.yaml'].map((p) =>
        hash(readFileSync(path.join(repo, p))),
      ),
    ].join('\n'),
  );
}
export async function settle(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}
export async function runtimeState(page, browser) {
  return {
    ...(await page.evaluate(() => ({
      viewport: { width: innerWidth, height: innerHeight },
      route: location.pathname + location.hash,
      theme:
        document.documentElement.getAttribute('data-theme') ||
        document.documentElement.className ||
        getComputedStyle(document.documentElement).colorScheme,
      locale: document.documentElement.lang || navigator.language,
    }))),
    engine: 'chromium',
    engineVersion: browser.version(),
  };
}
export async function capture(dir, name = 'final', viewport) {
  const scenario = JSON.parse(readFileSync(path.join(dir, 'run.json'))).scenario;
  viewport ||= { width: scenario === '03-label' ? 320 : 760, height: 640 };
  const { chromium } = browserTools(dir);
  const { server, url } = await serve(dir);
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport });
    await page.goto(url);
    await page.waitForFunction(() => !!customElements.get('r-button') && !!document.querySelector('main'));
    await settle(page);
    const evidence = path.join(dir, 'evidence');
    mkdirSync(evidence, { recursive: true });
    const media = path.join(evidence, `${name}.png`);
    await page.screenshot({ path: media, fullPage: true });
    const data = {
      schema: 1,
      capturedAt: new Date().toISOString(),
      runtimeHash: runtimeHash(dir),
      media: `${name}.png`,
      mediaHash: hash(readFileSync(media)),
      scope: [JSON.parse(readFileSync(path.join(dir, 'run.json'))).scenario],
      state: await runtimeState(page, browser),
      runtimeInputs: [
        'surface/**',
        'runtime.js',
        'ranui/components/button/**',
        'ranui/utils/**',
        'ranui/theme/**',
        'ranui/base.less',
        'ranui/style.ts',
        'ranui/fonts/**',
        'ranuts/dist/**',
        'ranview/dist/**',
        'ranview/src/**',
        'ranuts/package.json',
        'ranview/package.json',
        'pnpm-lock.yaml',
      ],
    };
    writeFileSync(path.join(evidence, `${name}.capture.json`), JSON.stringify(data, null, 2));
    return data;
  } finally {
    await browser.close();
    await server.close();
  }
}
export async function seedFreshness(dir) {
  const style = path.join(dir, 'surface/shared.css');
  const prior = await capture(dir, 'prior');
  writeFileSync(
    path.join(dir, 'evidence/prior-review.json'),
    JSON.stringify(
      {
        capture: 'prior.capture.json',
        runtimeHash: prior.runtimeHash,
        mediaHash: prior.mediaHash,
        scope: prior.scope,
        automated: 'passed',
        agentVisualReview: 'passed',
        humanDecision: 'not-observed',
      },
      null,
      2,
    ),
  );
  writeFileSync(
    style,
    readFileSync(style, 'utf8') + '\n/* Shared style follow-up after prior review. */\n.setting { padding: 24px; }\n',
  );
}
