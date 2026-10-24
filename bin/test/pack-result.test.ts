import assert from 'node:assert/strict';
import { test } from 'node:test';
import { packedFilename } from '../pack-result.ts';

const archive = { name: 'ranuts', filename: 'ranuts-0.5.1.tgz' };
test('reads npm 10/11 single-archive output', () => {
  assert.equal(packedFilename([archive]), archive.filename);
});
test('reads npm 12 package-keyed single-archive output', () => {
  assert.equal(packedFilename({ ranuts: archive }), archive.filename);
});
for (const [name, value] of [
  ['empty array', []],
  ['empty object', {}],
  ['multiple array archives', [archive, archive]],
  ['multiple keyed archives', { ranuts: archive, ranui: { filename: 'ranui-0.5.1.tgz' } }],
  ['error response', { error: { code: 'EPACK' } }],
  ['invalid filename', [{ filename: 123 }]],
  ['null output', null],
] as const) {
  test(`rejects ${name} instead of extracting an arbitrary archive`, () => {
    assert.throws(() => packedFilename(value));
  });
}
