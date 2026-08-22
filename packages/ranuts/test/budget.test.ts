import { describe, expect, it } from 'vitest';
import { addUsage, estimateTokens, planCompaction } from '@/stream/index.ts';

describe('estimateTokens', () => {
  it('counts Latin text at roughly four characters a token', () => {
    expect(estimateTokens('a'.repeat(400))).toBe(100);
  });

  it('counts CJK at roughly one character a token', () => {
    // A BPE vocabulary trained mostly on Latin script rarely merges these. Counting them at
    // the Latin rate underestimates a Chinese conversation about fourfold, which is the
    // difference between compacting in time and compacting after the provider refuses.
    expect(estimateTokens('春江潮水连海平')).toBe(7);
  });

  it('counts a mixed string by script rather than by whichever it starts with', () => {
    expect(estimateTokens(`春江${'a'.repeat(8)}`)).toBe(4);
  });

  it('counts an astral character once, not as two surrogates', () => {
    // Iterating by code unit would charge two tokens for one emoji.
    expect(estimateTokens('😀')).toBe(1);
  });

  it('is zero for empty and never zero for anything else', () => {
    expect(estimateTokens('')).toBe(0);
    expect(estimateTokens(' ')).toBe(1);
  });
});

describe('addUsage', () => {
  it('adds the fields both sides report', () => {
    expect(addUsage({ inputTokens: 3, outputTokens: 4 }, { inputTokens: 5, outputTokens: 6 })).toMatchObject({
      inputTokens: 8,
      outputTokens: 10,
    });
  });

  it('keeps a field one side omitted rather than dropping it', () => {
    // Providers differ in what they send. A running total that lost outputTokens the moment
    // one response omitted it would be worse than no total.
    expect(addUsage({ outputTokens: 7 }, { inputTokens: 2 })).toMatchObject({ inputTokens: 2, outputTokens: 7 });
  });

  it('reports a field neither side has as absent, not as zero', () => {
    expect(addUsage({ inputTokens: 1 }, { inputTokens: 1 }).reasoningTokens).toBeUndefined();
  });

  it('treats an absent total as the empty one, so a fold can start from nothing', () => {
    expect(addUsage(undefined, { inputTokens: 4 })).toMatchObject({ inputTokens: 4 });
    expect(addUsage(undefined, undefined)).toEqual({
      inputTokens: undefined,
      outputTokens: undefined,
      reasoningTokens: undefined,
      cachedInputTokens: undefined,
      totalTokens: undefined,
    });
  });
});

describe('planCompaction', () => {
  const limits = { limit: 100, keepRecent: 2, summaryTokens: 10 };

  it('does nothing while the history fits', () => {
    expect(planCompaction([10, 20, 30], limits)).toEqual({ compact: 0, projected: 60, fits: true });
  });

  it('drops leading entries until the rest fits, counting the summary', () => {
    // 60+50+30+20 = 160. Dropping 60 leaves 10+100 = 110, still over; dropping 50 too
    // leaves 10+50 = 60.
    expect(planCompaction([60, 50, 30, 20], limits)).toEqual({ compact: 2, projected: 60, fits: true });
  });

  it('never touches the protected tail', () => {
    // The recent turns are what the conversation is currently about; summarizing them is
    // how a client starts answering the wrong question.
    const plan = planCompaction([10, 200, 300], limits);
    expect(plan.compact).toBe(1);
    expect(plan.fits).toBe(false);
  });

  it('reports that it cannot fit rather than compacting the tail anyway', () => {
    // One message longer than the whole window. There is nothing to do here that does not
    // lose the user's own words, so the caller decides.
    expect(planCompaction([500], limits)).toMatchObject({ compact: 0, fits: false });
  });

  it('counts the summary it will add, not just what it removes', () => {
    // Without counting it, this returns "fits" for a request that does not.
    expect(planCompaction([95, 10, 10], { limit: 100, keepRecent: 2, summaryTokens: 90 })).toMatchObject({
      compact: 1,
      projected: 110,
      fits: false,
    });
  });

  it('handles an empty history and a tail longer than the history', () => {
    expect(planCompaction([], limits)).toEqual({ compact: 0, projected: 0, fits: true });
    expect(planCompaction([500, 500], { limit: 10, keepRecent: 9, summaryTokens: 1 })).toMatchObject({ compact: 0 });
  });
});
