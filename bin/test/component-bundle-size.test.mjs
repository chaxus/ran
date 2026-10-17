import assert from 'node:assert/strict';
import test from 'node:test';
import { gzipSync } from 'node:zlib';
import { initialJavaScriptSize, assertComponentBundleBudget } from '../component-bundle-size.mjs';

test('initial load counts shared static chunks once, including cycles, excluding lazy chunks and assets', () => {
  const chunk = (fileName, code, imports = [], extra = {}) => ({ type: 'chunk', fileName, code, imports, ...extra });
  const entry = chunk('entry.js', '你好', ['shared.js', 'other.js'], {
    name: 'consumer',
    isEntry: true,
    dynamicImports: ['lazy.js'],
  });
  const shared = chunk('shared.js', 'shared', ['entry.js']);
  const other = chunk('other.js', 'other', ['shared.js']);
  const output = [
    entry,
    shared,
    other,
    chunk('lazy.js', 'x'.repeat(1000)),
    { type: 'asset', fileName: 'style.css', source: 'css' },
  ];
  assert.deepEqual(initialJavaScriptSize(output), {
    bytes: 17,
    gzipBytes: [entry, shared, other].reduce((sum, item) => sum + gzipSync(item.code).length, 0),
    chunks: 3,
  });
});

test('an empty or externalized consumer cannot pass by measuring zero bytes', () => {
  assert.throws(() => initialJavaScriptSize([]), /Missing consumer entry/);
  assert.throws(
    () =>
      initialJavaScriptSize([
        { type: 'chunk', fileName: 'entry.js', name: 'consumer', isEntry: true, imports: [], code: '' },
      ]),
    /registration was removed/,
  );
  assert.throws(
    () =>
      initialJavaScriptSize([
        { type: 'chunk', fileName: 'entry.js', name: 'consumer', isEntry: true, imports: ['ranui/button'], code: '' },
      ]),
    /Unbundled initial JavaScript/,
  );
});

test('budgets independently reject raw or compressed growth and missing entries', () => {
  const budgets = { button: { bytes: 100, gzipBytes: 50 } };
  assertComponentBundleBudget('button', { bytes: 100, gzipBytes: 50 }, budgets);
  assert.throws(() => assertComponentBundleBudget('button', { bytes: 101, gzipBytes: 50 }, budgets), /bytes.*budget/);
  assert.throws(
    () => assertComponentBundleBudget('button', { bytes: 100, gzipBytes: 51 }, budgets),
    /gzipBytes.*budget/,
  );
  assert.throws(() => assertComponentBundleBudget('missing', {}, budgets), /Missing component budget/);
});
