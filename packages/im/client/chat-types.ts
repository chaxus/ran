/**
 * The message shapes shared by the composer, the store and the request body.
 *
 * Their own module because `client.ts` imports the store and the store needs these: putting
 * them in `client.ts` would make the store import the entry point that imports the store.
 */

/** One part of a multimodal message. */
export type ContentPart = { type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } };

/**
 * What a message carries.
 *
 * A plain string for a text-only turn — the form every provider accepts — and parts only
 * once there is something besides text.
 */
export type MessageContent = string | ContentPart[];

/**
 * One tool call as the wire format carries it, in a request and in a stored history.
 *
 * The field names are the provider's, not this app's: these travel back to the model
 * verbatim on the next request, and renaming them here would mean renaming them again on
 * the way out.
 */
export interface WireToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

/**
 * One turn, as it is stored and as the provider expects it.
 *
 * `tool_calls` and `tool_call_id` are not optional decoration: a provider rejects a
 * `role: 'tool'` message whose id names no call in the assistant message before it, so a
 * history that dropped either field cannot be sent at all. That is why they are stored
 * rather than reconstructed — a reloaded conversation has to be resumable.
 */
export type StoredMessage =
  | { role: 'user'; content: MessageContent }
  | { role: 'assistant'; content: MessageContent; tool_calls?: WireToolCall[] }
  | { role: 'tool'; content: string; tool_call_id: string; name: string };

/**
 * Alternative answers recorded at one point in a conversation.
 *
 * A tail rather than a single message: an answer can be several messages — the model calls
 * a tool, reads the result, and answers — and switching between alternatives has to swap all
 * of them together or the tool results stop matching the calls above them.
 *
 * Alternatives at a point are dropped when the history is cut at or before it. A branch
 * whose starting point no longer exists is not a choice; it is a record of a conversation
 * that was replaced.
 */
export interface Branch {
  /** Index in `messages` where every recorded tail begins. */
  at: number;
  /** Each entry is the whole history from {@link Branch.at} onward. */
  tails: StoredMessage[][];
  /** Which entry is currently spliced into `messages`. */
  active: number;
}

/**
 * One point where the conversation was folded for the model's benefit.
 *
 * **The log is not what is sent.** A conversation log only ever grows; compaction is a fact
 * about assembling the next request, not a licence to delete what was said. Storing the
 * boundary instead of splicing the array is the whole difference between a client that runs
 * out of context gracefully and one that destroys its user's history to stay under a limit.
 *
 * `at` is an index into the log: assembling a request means the summary, then everything
 * from `at` onward. Rendering means the whole log, with a marker drawn at `at`.
 */
export interface Compaction {
  /** First log message the model still sees in full. */
  at: number;
  /** What stands in for everything before {@link Compaction.at}. */
  summary: string;
}

/**
 * A message as the provider's request body wants it.
 *
 * A superset of {@link StoredMessage}: every stored message is one of these, plus the
 * `system` message a compaction contributes, which was never said by anyone and so is not
 * part of the log.
 */
export interface WireMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: MessageContent;
  tool_calls?: WireToolCall[];
  tool_call_id?: string;
  name?: string;
}
