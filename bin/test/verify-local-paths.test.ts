import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compareToBaseline, localPaths } from '../verify-local-paths.ts';

test('finds machine paths and leaves documentation placeholders alone', () => {
  // Built at run time so this file does not itself contain the paths it is about.
  const [users, home, windows, temp] = ['/Users/', '/home/', 'C:\\Users\\', '/private/var/folders/'];
  const text = `cd ${users}ada/code && ls ${home}grace/x ${windows}lin\\a ${temp}xy`;
  assert.deepEqual(localPaths(text), [`${users}ada`, `${home}grace`, `${windows}lin`, `${temp}xy`]);
  assert.deepEqual(localPaths(`truncate('${users}me/code/app') and ${users}someone/work`), []);
});

test('a new file or a higher count fails; a lower count asks for the baseline to be lowered', () => {
  const { failures, improved } = compareToBaseline(
    { 'a.json': 3, 'new.md': 1, 'b.json': 1 },
    { 'a.json': 2, 'b.json': 4, 'gone.json': 1 },
  );
  assert.deepEqual(failures, ['a.json: 3 local path(s), 2 recorded', 'new.md: 1 local path(s), 0 recorded']);
  assert.deepEqual(improved, ['b.json: 1 < 4', 'gone.json: 0 < 1']);
});
