/**
 * What a conversation costs, and where it can be cut when it stops fitting.
 *
 * `ranuts/stream` owns the arithmetic — estimating a string, folding usage reports, deciding
 * how many leading entries no longer fit. What lives here is the part that is about *these*
 * messages: how to weigh one, and which cut points the wire format allows.
 */
import { estimateTokens, planCompaction } from 'ranuts/stream';
import type { CompactionPlan } from 'ranuts/stream';
import type { StoredMessage } from '@/client/chat-types';

/**
 * Per-message overhead the wire format adds: the role, the delimiters, the envelope.
 *
 * Roughly what every OpenAI-compatible tokenizer charges for a message's structure. Ignoring
 * it makes a hundred short turns look free when they are not.
 */
const MESSAGE_OVERHEAD = 4;

/**
 * How many trailing messages compaction never touches.
 *
 * The recent turns are what the conversation is currently about; summarizing them is how a
 * client starts answering a question nobody asked. Eight covers roughly the last three
 * exchanges, including their tool calls and results.
 */
export const KEEP_RECENT = 8;

/** Estimated size of the summary that replaces a compacted prefix, in tokens. */
export const SUMMARY_TOKENS = 400;

/**
 * Estimates what one message costs.
 *
 * An image is charged as a flat figure rather than measured: the real cost depends on the
 * model's tiling of its dimensions, which a data URL does not tell us without decoding it.
 * The flat figure is high enough that a conversation full of screenshots compacts early
 * rather than late.
 *
 * @param message The message.
 * @returns Its estimated tokens.
 */
export function messageTokens(message: StoredMessage): number {
  let tokens = MESSAGE_OVERHEAD;
  const content = message.content;
  if (typeof content === 'string') tokens += estimateTokens(content);
  else {
    for (const part of content) {
      tokens += part.type === 'text' ? estimateTokens(part.text) : IMAGE_TOKENS;
    }
  }
  // The arguments the model wrote travel back on every subsequent request, and a call with
  // a long argument is not free just because nobody reads it.
  if (message.role === 'assistant') {
    for (const call of message.tool_calls ?? []) {
      tokens += MESSAGE_OVERHEAD + estimateTokens(call.function.name) + estimateTokens(call.function.arguments);
    }
  }
  return tokens;
}

/** What one image is charged, absent the model's own tiling rules. */
const IMAGE_TOKENS = 800;

/** Estimated tokens the next request will carry. */
export function contextTokens(messages: readonly StoredMessage[]): number {
  return messages.reduce((sum, message) => sum + messageTokens(message), 0);
}

/**
 * Moves a proposed cut to a point the wire format allows.
 *
 * A provider rejects a `role: 'tool'` message whose `tool_call_id` names no call in the
 * assistant message before it. A cut that lands between an assistant message and its results
 * produces exactly that, so the boundary moves *forward* — past the orphaned results — until
 * the kept history starts with something that can stand alone.
 *
 * Forward rather than backward: moving back would keep the assistant message and drop
 * nothing, which is how a compaction loop fails to make progress and runs every turn.
 *
 * @param messages The history.
 * @param cut The proposed number of leading messages to compact.
 * @returns A cut that leaves a sendable history.
 */
export function safeBoundary(messages: readonly StoredMessage[], cut: number): number {
  let boundary = Math.min(cut, messages.length);
  while (boundary < messages.length && messages[boundary]?.role === 'tool') boundary += 1;
  return boundary;
}

/** What to do about a history before sending it. */
export interface BudgetDecision extends CompactionPlan {
  /** Estimated tokens the history currently carries. */
  used: number;
}

/**
 * Decides whether a history has to be compacted before the next request.
 *
 * @param messages The history, in order.
 * @param limit The model's context window, or zero when the server did not report one.
 * @returns The size, the cut, and whether the result will fit. A limit of zero means
 *   nothing is known, so nothing is compacted — acting on an invented window would drop a
 *   conversation nobody needed to lose.
 */
export function decideBudget(messages: readonly StoredMessage[], limit: number): BudgetDecision {
  const sizes = messages.map(messageTokens);
  const used = sizes.reduce((sum, size) => sum + size, 0);
  if (limit === 0) return { used, compact: 0, projected: used, fits: true };

  const plan = planCompaction(sizes, { limit, keepRecent: KEEP_RECENT, summaryTokens: SUMMARY_TOKENS });
  return { ...plan, used, compact: safeBoundary(messages, plan.compact) };
}
