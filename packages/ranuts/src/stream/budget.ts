/**
 * Counting what a conversation costs, and deciding what to drop when it stops fitting.
 *
 * A chat client that never does this works for a week and then stops working: every turn
 * carries the whole history, so the request grows monotonically until the provider refuses
 * it. The refusal arrives as a wall — the conversation someone was having simply stops.
 *
 * Two pieces, deliberately separate:
 *
 * - **{@link estimateTokens}** answers "how big is this text" without a tokenizer. It is an
 *   estimate and named as one. A real tokenizer is a per-model dependency measured in
 *   megabytes, and this is used to decide *when to act*, not to bill anyone.
 * - **{@link planCompaction}** answers "what has to go" given sizes and a ceiling. It knows
 *   nothing about messages, models, or summaries — it takes a list of sizes and returns how
 *   many leading entries no longer fit. What replaces them is the caller's business.
 *
 * @module ranuts/stream
 */
import type { TokenUsage } from './types.ts';

/**
 * Characters per token for text that is mostly Latin script.
 *
 * The usual rule of thumb across GPT-style BPE vocabularies. It is wrong for any specific
 * string and close enough across a conversation, which is the scale it is used at.
 */
const LATIN_CHARS_PER_TOKEN = 4;

/**
 * Ranges where one character is roughly one token: CJK, Hangul, kana, and the fullwidth
 * forms. A BPE vocabulary trained mostly on Latin script rarely merges these, so counting
 * them at the Latin rate underestimates a Chinese conversation by about four times — which
 * is the difference between compacting in time and compacting after the provider refuses.
 */
const DENSE = /[　-〿぀-ヿ㐀-䶿一-鿿豈-﫿＀-￯가-힯]/u;

/**
 * Estimates how many tokens a string costs.
 *
 * Deliberately not a tokenizer. Every model's is different, shipping one is megabytes, and
 * the number is used to decide when to compact rather than to charge anyone. It is
 * calibrated to be roughly right per script rather than exactly right for one model.
 *
 * @param text The text to measure.
 * @returns An estimated token count, never below one for a non-empty string.
 */
export function estimateTokens(text: string): number {
  if (text === '') return 0;
  let dense = 0;
  let rest = 0;
  // Iterated by code point, so an emoji or a rare CJK ideograph outside the BMP counts once
  // rather than as its two surrogate halves.
  for (const character of text) {
    if (DENSE.test(character)) dense += 1;
    else rest += 1;
  }
  return Math.max(1, dense + Math.ceil(rest / LATIN_CHARS_PER_TOKEN));
}

/**
 * Adds two usage reports.
 *
 * Every field is optional and providers differ in which they send, so an absent field on
 * either side is zero rather than a reason to drop the field: a running total that lost
 * `outputTokens` the moment one response omitted it would be worse than no total.
 *
 * @param total The running total.
 * @param next The report to add.
 * @returns A new total.
 */
export function addUsage(total: TokenUsage | undefined, next: TokenUsage | undefined): TokenUsage {
  const sum = (a: number | undefined, b: number | undefined): number | undefined =>
    a === undefined && b === undefined ? undefined : (a ?? 0) + (b ?? 0);
  return {
    inputTokens: sum(total?.inputTokens, next?.inputTokens),
    outputTokens: sum(total?.outputTokens, next?.outputTokens),
    reasoningTokens: sum(total?.reasoningTokens, next?.reasoningTokens),
    cachedInputTokens: sum(total?.cachedInputTokens, next?.cachedInputTokens),
    totalTokens: sum(total?.totalTokens, next?.totalTokens),
  };
}

/** What a compaction has to fit under, and what it may not touch. */
export interface CompactionLimits {
  /** Token ceiling the next request must fit under, including everything the caller adds. */
  limit: number;
  /**
   * How many trailing entries are never compacted.
   *
   * The recent turns are what the conversation is currently about; summarizing them is how
   * a client starts answering the wrong question. Zero is legal and means the caller
   * accepts that.
   */
  keepRecent: number;
  /**
   * Estimated size of whatever replaces the compacted entries.
   *
   * Required, not defaulted: a summary is not free, and a plan that assumed it was can
   * return "this fits" for a request that does not.
   */
  summaryTokens: number;
}

/** What to do with a history that has grown. */
export interface CompactionPlan {
  /** How many leading entries to replace with one summary; zero means nothing to do. */
  compact: number;
  /** Estimated tokens the request will cost once the plan is applied. */
  projected: number;
  /**
   * Whether {@link CompactionPlan.projected} is under the limit.
   *
   * False means the kept entries alone exceed it — a single message longer than the whole
   * context window, most often. The caller has to decide, and there is nothing this
   * function can silently do that would not lose the user's own words.
   */
  fits: boolean;
}

/**
 * Decides how much of a history no longer fits.
 *
 * Leading entries only. A conversation is a sequence, and dropping from the middle leaves
 * the model reading an exchange with a hole in it; dropping from the front is what a summary
 * can stand in for.
 *
 * @param sizes Estimated tokens per entry, in conversation order.
 * @param limits The ceiling, the protected tail, and the summary's own cost.
 * @returns How many leading entries to compact, and whether the result fits.
 */
export function planCompaction(sizes: readonly number[], limits: CompactionLimits): CompactionPlan {
  const { limit, keepRecent, summaryTokens } = limits;
  const total = sizes.reduce((sum, size) => sum + size, 0);
  if (total <= limit) return { compact: 0, projected: total, fits: true };

  // Never below zero, and never so far that it would compact the protected tail.
  const compactable = Math.max(0, sizes.length - keepRecent);
  let compact = 0;
  let dropped = 0;
  while (compact < compactable && summaryTokens + total - dropped > limit) {
    dropped += sizes[compact] ?? 0;
    compact += 1;
  }

  // A history that only ever grew by one turn can still need nothing compacted: the loop
  // exits immediately when the first entry alone brings it under.
  if (compact === 0) return { compact: 0, projected: total, fits: total <= limit };
  const projected = summaryTokens + total - dropped;
  return { compact, projected, fits: projected <= limit };
}
