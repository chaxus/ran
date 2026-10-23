import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { directorySize, assertSizeBudgets } from '../package-size.ts';

test('size measurement counts nested files but never follows dependency links', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'ran-size-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'nested'));
  await writeFile(join(root, 'one'), 'hello');
  await writeFile(join(root, 'nested', 'two'), '你好');
  await symlink(root, join(root, 'nested', 'loop'), 'junction');
  assert.deepEqual(await directorySize(root), { bytes: 11, files: 2 });
});

test('size gates reject installation growth, archive growth and missing packages', () => {
  const budgets = { installationBytes: 100, packages: { a: { archiveBytes: 10, unpackedBytes: 30 } } };
  const report = { installation: { bytes: 100 }, packages: [{ name: 'a', archiveBytes: 10, unpackedBytes: 30 }] };
  assertSizeBudgets(report, budgets);
  assert.throws(() => assertSizeBudgets({ ...report, installation: { bytes: 101 } }, budgets), /installation/);
  for (const key of ['archiveBytes', 'unpackedBytes']) {
    assert.throws(
      () => assertSizeBudgets({ ...report, packages: [{ ...report.packages[0], [key]: 100 }] }, budgets),
      /budget/,
    );
  }
  assert.throws(() => assertSizeBudgets({ ...report, packages: [] }, budgets), /all release/);
});
