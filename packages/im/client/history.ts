/**
 * Where a conversation can be cut, and what a cut invalidates.
 *
 * Editing a message, regenerating an answer and switching between alternatives are one
 * operation with three entry points: the conversation diverges at some index, and everything
 * after it is no longer part of it. What differs is where the divergence falls — and getting
 * that wrong sends the model a history it cannot answer.
 */
import type { Branch, StoredMessage } from '@/client/chat-types';

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
