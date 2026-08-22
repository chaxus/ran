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
  // Compaction's replacement for a prefix it folded away. A system message because that is
  // what every provider reads as context rather than as something someone said.
  | { role: 'system'; content: string }
  | { role: 'user'; content: MessageContent }
  | { role: 'assistant'; content: MessageContent; tool_calls?: WireToolCall[] }
  | { role: 'tool'; content: string; tool_call_id: string; name: string };
