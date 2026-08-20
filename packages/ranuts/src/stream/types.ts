/**
 * Provider-neutral vocabulary for one streamed model response.
 *
 * Every mainstream chat completion API streams the same four things — assistant text,
 * separately-billed reasoning text, tool calls, and a token count — but each names them
 * differently and interleaves them differently. Normalizing to one union at the edge means
 * a renderer, an accumulator, and a test fixture never learn a vendor's wire format.
 *
 * The union is the contract; the shape below is what makes it usable:
 *
 * - **`index` correlates interleaved deltas.** Reasoning and text can arrive interleaved,
 *   and a response can open several tool calls at once. Consumers group by `index` rather
 *   than assuming a delta belongs to whatever arrived last.
 * - **`block-end` carries the assembled block.** A consumer that accumulated the deltas
 *   itself can adopt or verify it; a consumer that only wants finished blocks can ignore
 *   every delta.
 * - **Tool arguments stay raw JSON text.** `argumentsDelta` is never parsed mid-stream:
 *   half a JSON document is not a value, and pretending otherwise is where streaming tool
 *   calls usually break.
 * - **`finish` terminates.** `usage` arrives before it, and nothing follows it. A consumer
 *   can treat `finish` as the point where its state is complete.
 *
 * @module ranuts/stream
 */

/** Discriminator for the content a block accumulates. */
export type ContentBlockType = 'text' | 'reasoning' | 'tool-call';

/** Assistant prose addressed to the user. */
export interface TextBlock {
  type: 'text';
  text: string;
}

/**
 * Model reasoning, when the provider exposes it. Kept separate from {@link TextBlock}
 * because it is billed, displayed, and retained differently — a UI usually collapses it,
 * and it is normally dropped from the history sent back on the next request.
 */
export interface ReasoningBlock {
  type: 'reasoning';
  text: string;
}

/** One tool invocation requested by the model. */
export interface ToolCallBlock {
  type: 'tool-call';
  /** Provider-assigned call id, echoed back with the result. */
  id: string;
  /** Tool name; empty until the provider has sent it. */
  name: string;
  /** Raw JSON text of the arguments — deliberately unparsed. */
  arguments: string;
}

/** One completed unit of assistant output. */
export type ContentBlock = TextBlock | ReasoningBlock | ToolCallBlock;

/**
 * Why the response ended.
 *
 * `tool-calls` is not a failure: the model finished its turn by asking for tools, and the
 * caller is expected to run them and continue. `aborted` means the consumer stopped the
 * stream, which is why it is distinct from `error`.
 */
export type FinishReason = 'stop' | 'length' | 'tool-calls' | 'content-filter' | 'error' | 'aborted';

/** Token counts reported for one response. Every field is optional: providers differ. */
export interface TokenUsage {
  inputTokens?: number;
  outputTokens?: number;
  /** Reasoning tokens, where the provider bills them separately from output. */
  reasoningTokens?: number;
  /** Input tokens served from a provider-side cache, where reported. */
  cachedInputTokens?: number;
  totalTokens?: number;
}

/**
 * One normalized event from a streamed response.
 *
 * `block-start` is optional in practice — several providers begin a block with its first
 * delta — so consumers must tolerate a delta for an index they have not seen.
 * {@link createStreamAccumulator} does.
 */
export type StreamChunk =
  | { type: 'block-start'; index: number; blockType: ContentBlockType }
  | { type: 'text-delta'; index: number; text: string }
  | { type: 'reasoning-delta'; index: number; text: string }
  | { type: 'tool-call-delta'; index: number; id: string; name?: string; argumentsDelta: string }
  | { type: 'block-end'; index: number; block: ContentBlock }
  | { type: 'usage'; usage: TokenUsage }
  | { type: 'finish'; reason: FinishReason };
