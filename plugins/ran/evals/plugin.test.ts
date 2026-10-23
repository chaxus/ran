import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const read = (p: string) => JSON.parse(readFileSync(path.join(root, p), 'utf8'));
test('the portable marketplace discovers the same versioned ran plugin as Claude', () => {
  const market = read('.agents/plugins/marketplace.json');
  const entry = market.plugins.find((p: { name: string; source: { path: string } }) => p.name === 'ran');
  assert.ok(entry);
  assert.equal(market.plugins.length, 1);
  const claudeMarket = read('.claude-plugin/marketplace.json');
  assert.equal(claudeMarket.plugins.length, 1);
  assert.equal(claudeMarket.plugins[0].name, entry.name);
  assert.equal(claudeMarket.plugins[0].source, entry.source.path);
  const folder = path.resolve(root, entry.source.path);
  const portable = JSON.parse(readFileSync(path.join(folder, 'plugin.json'), 'utf8'));
  const claude = JSON.parse(readFileSync(path.join(folder, '.claude-plugin/plugin.json'), 'utf8'));
  assert.equal(portable.name, entry.name);
  assert.equal(portable.version, claude.version);
  assert.equal(portable.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
  for (const skill of ['design', 'ranui', 'ranuts'])
    assert.ok(existsSync(path.join(folder, `skills/${skill}/SKILL.md`)));
  assert.equal(portable.name, claude.name);
  assert.ok(portable.extensions['com.openai'].interface.defaultPrompt.length);
});
