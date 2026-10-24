import assert from 'node:assert/strict';
import { object, text } from '../../../bin/tooling-json.ts';

/** npm 12 keys pack results by package name; npm 10/11 return an array. */
export function packedFilename(value: unknown): string {
  const results = Array.isArray(value) ? value : Object.values(object(value, 'npm pack result'));
  assert.equal(results.length, 1, 'npm pack must return one archive');
  return text(object(results[0], 'packed archive').filename, 'packed filename');
}
