import assert from 'node:assert';
import { describe, it } from 'vitest';
import { clearBr } from '@/utils';

describe('clearBr(string)', function () {
  it('returns "" for empty / default input', function () {
    assert.strictEqual(clearBr(''), '');
    assert.strictEqual(clearBr(), '');
  });

  it('strips whitespace and newlines', function () {
    assert.strictEqual(clearBr('a\n b\tc'), 'abc');
    assert.strictEqual(clearBr('hello world'), 'helloworld');
  });

  it('removes html tags', function () {
    assert.strictEqual(clearBr('<b>bold</b>'), 'bold');
    assert.strictEqual(clearBr('<div class="x">y</div>'), 'y');
  });

  it('handles nested / overlapping angle brackets without leaving a tag behind', function () {
    assert.strictEqual(clearBr('<<b>>'), '');
    assert.strictEqual(clearBr('<a<b<c>>>x'), 'x');
  });

  it('keeps an unmatched ">" at depth 0', function () {
    assert.strictEqual(clearBr('keep > this'), 'keep>this');
  });

  it('runs in linear time on adversarial input (ReDoS guard)', function () {
    const big = '<'.repeat(200_000) + 'a>'.repeat(200_000);
    const start = process.hrtime.bigint();
    clearBr(big);
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    assert.ok(ms < 500, `clearBr took ${ms}ms, expected < 500ms`);
  });
});
