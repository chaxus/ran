import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compareToBaseline, localPaths } from '../verify-local-paths.ts';

test('finds machine paths and leaves documentation placeholders alone', () => {
  assert.deepEqual(localPaths('cd /Users/ada/code && ls /home/grace/x C:\\Users\\lin\\a /private/var/folders/xy'), [
    '/Users/ada',
    '/home/grace',
    'C:\\Users\\lin',
    '/private/var/folders/xy',
  ]);
  assert.deepEqual(localPaths("truncate('/Users/me/code/app') and /Users/someone/work"), []);
});

test('a new file or a higher count fails; a lower count asks for the baseline to be lowered', () => {
  const { failures, improved } = compareToBaseline(
    { 'a.json': 3, 'new.md': 1, 'b.json': 1 },
    { 'a.json': 2, 'b.json': 4, 'gone.json': 1 },
  );
  assert.deepEqual(failures, ['a.json: 3 local path(s), 2 recorded', 'new.md: 1 local path(s), 0 recorded']);
  assert.deepEqual(improved, ['b.json: 1 < 4', 'gone.json: 0 < 1']);
});
