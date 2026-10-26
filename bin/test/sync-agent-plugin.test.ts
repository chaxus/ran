import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { markdownFiles, syncAgentPlugin, verifyLocalLinks } from '../sync-agent-plugin.ts';
const repo = fileURLToPath(new URL('../../', import.meta.url));

test('the installed plugin has a closed offline Markdown reference graph without repository files', () => {
  const isolated = mkdtempSync(path.join(tmpdir(), 'ran-plugin-portable-'));
  try {
    cpSync(path.join(repo, 'plugins/ran'), path.join(isolated, 'ran'), { recursive: true });
    const skills = path.join(isolated, 'ran/skills');
    verifyLocalLinks(skills, markdownFiles(skills));
    assert.deepEqual(
      ['design', 'ranui', 'ranuts'].map(
        (name) => readFileSync(path.join(skills, name, 'SKILL.md'), 'utf8').match(/^name: (.+)$/m)?.[1],
      ),
      ['design', 'ranui', 'ranuts'],
    );
  } finally {
    rmSync(isolated, { recursive: true, force: true });
  }
});

test('generation is deterministic and detects changed source, tampered output and removed sources', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'ran-plugin-generation-'));
  try {
    mkdirSync(path.join(root, 'design'));
    writeFileSync(path.join(root, 'LICENSE'), 'MIT License\n');
    writeFileSync(path.join(root, 'design/README.md'), '[Motion](MOTION.md)\n');
    writeFileSync(path.join(root, 'design/MOTION.md'), '# Motion\n');
    syncAgentPlugin(root);
    const manifest = path.join(root, 'plugins/ran/skills/design/references/manifest.json');
    const first = readFileSync(manifest, 'utf8');
    syncAgentPlugin(root);
    assert.equal(readFileSync(manifest, 'utf8'), first);
    syncAgentPlugin(root, true);
    assert.equal(readFileSync(path.join(root, 'plugins/ran/LICENSE'), 'utf8'), 'MIT License\n');
    writeFileSync(path.join(root, 'plugins/ran/LICENSE'), 'tampered\n');
    assert.throws(() => syncAgentPlugin(root, true), /Stale plugin LICENSE/);
    syncAgentPlugin(root);
    writeFileSync(path.join(root, 'design/MOTION.md'), '# Motion\nChanged source\n');
    assert.throws(() => syncAgentPlugin(root, true), /Stale agent reference/);
    syncAgentPlugin(root);
    writeFileSync(path.join(root, 'plugins/ran/skills/design/references/MOTION.md'), 'tampered');
    assert.throws(() => syncAgentPlugin(root, true), /Stale agent reference/);
    syncAgentPlugin(root);
    rmSync(path.join(root, 'design/MOTION.md'));
    writeFileSync(path.join(root, 'design/README.md'), '# Design\n');
    assert.throws(() => syncAgentPlugin(root, true), /Stale agent reference/);
    syncAgentPlugin(root);
    syncAgentPlugin(root, true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('generic references reject unresolved repository dependencies', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'ran-plugin-closure-'));
  try {
    mkdirSync(path.join(root, 'design'));
    writeFileSync(path.join(root, 'design/README.md'), '[API](../packages/ranui/API.md)');
    assert.throws(() => syncAgentPlugin(root), /Unresolved portable reference/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
