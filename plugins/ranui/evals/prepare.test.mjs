import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { treeHash } from './hash.mjs';
import { join } from 'node:path';

test('prepare creates paired source-only runs with identical tasks and pinned guidance', () => {
  const root = mkdtempSync(join(tmpdir(), 'ranui-prepare-'));
  try {
    const result = spawnSync(
      process.execPath,
      [
        new URL('./prepare.mjs', import.meta.url).pathname,
        '--out',
        root,
        '--guidance-ref',
        'HEAD',
        '--label',
        'baseline',
      ],
      { encoding: 'utf8' },
    );
    assert.equal(result.status, 0, result.stderr);
    const manifest = JSON.parse(readFileSync(join(root, 'baseline', 'manifest.json')));
    assert.equal(manifest.scenarios.length, 6);
    assert.equal(manifest.guidanceRef, 'HEAD');
    assert.ok(manifest.fixtureHash);
    const freshness = manifest.scenarios.find((x) => x.id === '05-freshness');
    assert.equal(freshness.surfaceHash, treeHash(join(root, 'baseline', '05-freshness', 'surface')));
    assert.ok(freshness.priorEvidenceHash);
    assert.notEqual(freshness.initialSurfaceHash, freshness.surfaceHash);
    const paired = spawnSync(
      process.execPath,
      [
        new URL('./prepare.mjs', import.meta.url).pathname,
        '--out',
        root,
        '--guidance-ref',
        'working-tree',
        '--label',
        'candidate',
      ],
      { encoding: 'utf8' },
    );
    assert.equal(paired.status, 0, paired.stderr);
    const candidate = JSON.parse(readFileSync(join(root, 'candidate', 'manifest.json')));
    assert.equal(candidate.fixtureHash, manifest.fixtureHash);
    assert.equal(candidate.toolsHash, manifest.toolsHash);
    assert.equal(candidate.rubricHash, manifest.rubricHash);
    assert.deepEqual(
      candidate.scenarios.map((x) => [x.id, x.promptHash, x.surfaceHash]),
      manifest.scenarios.map((x) => [x.id, x.promptHash, x.surfaceHash]),
    );
    assert.ok(readFileSync(join(root, 'baseline', '01-text', 'TASK.md'), 'utf8').includes('surface/'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('an invalid baseline ref fails instead of silently producing empty guidance', () => {
  const root = mkdtempSync(join(tmpdir(), 'ranui-invalid-ref-'));
  try {
    const result = spawnSync(
      process.execPath,
      [
        new URL('./prepare.mjs', import.meta.url).pathname,
        '--out',
        root,
        '--guidance-ref',
        'refs/heads/does-not-exist-ranui-eval',
        '--label',
        'baseline',
      ],
      { encoding: 'utf8' },
    );
    assert.notEqual(result.status, 0, 'invalid ref must not create an apparently valid evaluation');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
