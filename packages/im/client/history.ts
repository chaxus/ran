/**
 * Where a conversation can be cut, and what a cut invalidates.
 *
 * Editing a message, regenerating an answer and switching between alternatives are one
 * operation with three entry points: the conversation diverges at some index, and everything
 * after it is no longer part of it. What differs is where the divergence falls — and getting
 * that wrong sends the model a history it cannot answer.
 */
import type { Branch, Compaction, StoredMessage, WireMessage } from '@/client/chat-types';

/**
 * Finds where the model's reply to a user message begins.
 *
 * Regenerating an answer means re-running everything the model did in response, and with
 * tools that is several messages: the call, its results, and the answer that read them.
 * Cutting at the answer alone would re-send a history whose last entries are tool results
 * with nothing left to answer, which no provider accepts.
 *
 * @param messages The history, in order.
 * @param index Any message inside the reply.
 * @returns The index just after the nearest preceding user message, or 0 when there is none —
 *   a conversation that opens with a compaction summary has a reply with no question above it.
 */
export function replyStart(messages: readonly StoredMessage[], index: number): number {
  for (let at = Math.min(index, messages.length - 1); at >= 0; at -= 1) {
    if (messages[at]?.role === 'user') return at + 1;
  }
  return 0;
}

/**
 * Drops the alternatives a cut invalidates.
 *
 * An alternative recorded at or after the cut describes a conversation that no longer exists;
 * offering it would be offering a choice between two dead tails.
 *
 * @param branches The recorded alternatives.
 * @param index First message being dropped.
 * @returns The alternatives that survive, in order.
 */
export function survivingBranches(branches: readonly Branch[], index: number): Branch[] {
  return branches.filter((branch) => branch.at < index);
}

/**
 * The compaction currently in force, if any.
 *
 * The last one: each compaction folds everything before its boundary, so a later one
 * subsumes every earlier one. The earlier ones stay recorded because the log still contains
 * the messages they folded, and the transcript still draws a marker at each.
 *
 * @param compactions Every recorded boundary, in order.
 * @returns The one that governs the next request, or null when the log is sent whole.
 */
export function activeCompaction(compactions: readonly Compaction[]): Compaction | null {
  return compactions.length === 0 ? null : (compactions[compactions.length - 1] ?? null);
}

/**
 * Assembles what the model is sent.
 *
 * This is the only place the log becomes a request, and the only place a compaction has any
 * effect. Everything else — the transcript, the token meter's `spent`, paging — reads the
 * log, which is why compaction can shrink a request without shortening anyone's history.
 *
 * @param messages The log.
 * @param compactions Recorded boundaries.
 * @returns The messages to send, oldest first.
 */
export function requestMessages(messages: readonly StoredMessage[], compactions: readonly Compaction[]): WireMessage[] {
  const active = activeCompaction(compactions);
  const kept = active === null ? [...messages] : messages.slice(active.at);
  const body = kept as WireMessage[];
  // A system message, because that is what every provider reads as context rather than as
  // something someone said.
  return active === null ? body : [{ role: 'system', content: active.summary }, ...body];
}

/**
 * Drops the compaction boundaries a cut invalidates.
 *
 * A boundary at or after the cut points into messages that no longer exist, and one whose
 * `at` runs past the end of the log would fold the whole conversation away.
 *
 * @param compactions Recorded boundaries.
 * @param index First message being dropped.
 * @returns The boundaries that survive, in order.
 */
export function survivingCompactions(compactions: readonly Compaction[], index: number): Compaction[] {
  return compactions.filter((entry) => entry.at <= index);
}
