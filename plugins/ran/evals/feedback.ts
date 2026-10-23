declare global {
  interface Window {
    __copyProbe: { value?: string; finish?: (success: boolean) => Promise<void> };
  }
}
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { serve } from './serve.ts';
import { browserTools, runtimeHash, settle } from './evidence.ts';
import { hash } from './hash.ts';
import { fileURLToPath } from 'node:url';

// Observe the interleaving; a reviewer judges whether visible feedback identifies its snapshot.
// This supplements (and does not rewrite) the frozen six-case rubric.
export async function probeCopyFeedback(dir: string, { capture = false } = {}) {
  const { chromium } = browserTools(dir);
  const { server, url } = await serve(dir);
  const browser = await chromium.launch();
  const results = [];
  try {
    const context = await browser.newContext({
      viewport: { width: 760, height: 640 },
      permissions: ['clipboard-read', 'clipboard-write'],
    });
    const page = await context.newPage();
    for (const outcome of ['success', 'failure']) {
      await page.goto(url);
      await settle(page);
      await page.evaluate(() => {
        const write = navigator.clipboard.writeText.bind(navigator.clipboard);
        window.__copyProbe = {};
        navigator.clipboard.writeText = (value) =>
          new Promise<void>((resolve, reject) => {
            window.__copyProbe.value = value;
            window.__copyProbe.finish = async (success) => {
              if (success) {
                await write(value);
                resolve();
              } else reject(new Error('Controlled clipboard rejection'));
            };
          });
      });
      const initial = await page.locator('code').textContent();
      await page.getByRole('button', { name: 'Copy code', exact: true }).click();
      await page.getByRole('button', { name: 'Receive update', exact: true }).click();
      const current = await page.locator('code').textContent();
      await page.evaluate(
        (success) =>
          (() => {
            const finish = window.__copyProbe.finish;
            if (!finish) throw new Error('Copy has not started');
            return finish(success);
          })(),
        outcome === 'success',
      );
      await settle(page);
      const visibleStatuses = await page
        .locator('[role="status"], [role="alert"]')
        .evaluateAll((els) =>
          els
            .filter((e) => e.getBoundingClientRect().width && e.getBoundingClientRect().height)
            .map((e) => e.textContent),
        );
      const written = await page.evaluate(() => window.__copyProbe.value);
      const clipboard = outcome === 'success' ? await page.evaluate(() => navigator.clipboard.readText()) : null;
      const record: {
        outcome: string;
        sourceChanged: boolean;
        writeCapturedInitialSnapshot: boolean;
        clipboardMatchesInitial: boolean | null;
        clipboardMatchesCurrent: boolean | null;
        visibleStatuses: string[];
        media?: { file: string; sha256: string };
      } = {
        outcome,
        sourceChanged: initial !== current,
        writeCapturedInitialSnapshot: written === initial,
        clipboardMatchesInitial: outcome === 'success' ? clipboard === initial : null,
        clipboardMatchesCurrent: outcome === 'success' ? clipboard === current : null,
        visibleStatuses,
      };
      if (capture) {
        const file = `feedback-${outcome}.png`;
        mkdirSync(path.join(dir, 'evidence'), { recursive: true });
        await page.screenshot({ path: path.join(dir, 'evidence', file) });
        record.media = { file, sha256: hash(readFileSync(path.join(dir, 'evidence', file))) };
      }
      results.push(record);
    }
    return { runtimeHash: runtimeHash(dir), browser: browser.version(), viewport: [760, 640], results };
  } finally {
    await browser.close();
    await server.close();
  }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = path.resolve(process.argv[2]);
  const result = await probeCopyFeedback(dir, { capture: true });
  writeFileSync(path.join(dir, 'evidence/feedback-probe.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
}
