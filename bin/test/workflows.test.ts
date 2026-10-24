import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const workflowsDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../.github/workflows');
const workflows = readdirSync(workflowsDir)
  .filter((name) => /\.ya?ml$/.test(name))
  .map((name) => ({ name, text: readFileSync(join(workflowsDir, name), 'utf8') }));

// Under pull_request_target, github.ref is the base branch, so a group keyed on it puts
// every open PR in one group and cancel-in-progress lets one PR cancel another's checks.
test('pull_request_target workflows group concurrency by pull request', () => {
  const targets = workflows.filter(({ text }) => /^\s*pull_request_target:/m.test(text));
  assert.ok(targets.length > 0, 'expected at least one pull_request_target workflow');
  for (const { name, text } of targets) {
    const group = /^concurrency:\s*\n\s+group:\s*(.+)$/m.exec(text)?.[1];
    if (!group) continue;
    assert.match(group, /github\.event\.pull_request\.number/, `${name}: concurrency group ${group}`);
  }
});
