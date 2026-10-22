import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { prepare } from './prepare.mjs';
import { probeCopyFeedback } from './feedback.mjs';

test(
  'copy feedback controls expose stale completion across an intervening source update',
  { timeout: 45000 },
  async () => {
    const root = mkdtempSync(path.join(tmpdir(), 'ranui-copy-feedback-'));
    try {
      const run = prepare({ out: root, label: 'feedback-controls', guidanceRef: 'HEAD' });
      const dir = path.join(run, '06-code');
      const file = path.join(dir, 'surface/app.js');
      const original = readFileSync(file, 'utf8');
      const naive = original
        .replace("raw.replace(/\\t/g, '  ').trim()", 'raw')
        .replace(
          "document.querySelector('#copy').onclick = () => navigator.clipboard.writeText(source.textContent);",
          `const status = document.createElement('span');
         status.setAttribute('role', 'status'); app.querySelector('section').append(status);
         let revision = 0;
         document.querySelector('#copy').onclick = async () => {
           const snapshot = revision;
           try { await navigator.clipboard.writeText(raw); status.textContent = 'Copied'; }
           catch { status.textContent = 'Copy failed'; }
         };`,
        )
        .replace('raw += streamPayload;', "revision++; status.textContent = ''; raw += streamPayload;");
      assert.notEqual(naive, original);
      writeFileSync(file, naive);
      const stale = await probeCopyFeedback(dir);
      assert.deepEqual(
        stale.results.map((r) => r.visibleStatuses),
        [['Copied'], ['Copy failed']],
      );
      assert.equal(stale.results[0].sourceChanged, true);
      assert.equal(stale.results[0].clipboardMatchesInitial, true);
      assert.equal(stale.results[0].clipboardMatchesCurrent, false);
      const guarded = naive
        .replace("status.textContent = 'Copied';", "if (snapshot === revision) status.textContent = 'Copied';")
        .replace(
          "status.textContent = 'Copy failed';",
          "if (snapshot === revision) status.textContent = 'Copy failed';",
        );
      writeFileSync(file, guarded);
      const current = await probeCopyFeedback(dir);
      assert.deepEqual(
        current.results.map((r) => r.visibleStatuses),
        [[], []],
      );
      assert.equal(current.results[0].writeCapturedInitialSnapshot, true);
      assert.equal(current.results[0].clipboardMatchesInitial, true);
      assert.equal(current.results[0].clipboardMatchesCurrent, false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
);
