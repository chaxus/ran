/**
 * `ranuts/stream` — streaming model responses, without a vendor.
 *
 * Three layers, each usable alone:
 *
 * 1. {@link parseEventStream} turns bytes into Server-Sent Events. Transport only.
 * 2. {@link StreamChunk} is the provider-neutral vocabulary one response streams in.
 * 3. {@link createStreamAccumulator} folds those chunks into renderable blocks.
 * 4. {@link estimateTokens} and {@link planCompaction} decide when a history stops fitting.
 *
 * Mapping a vendor's event onto {@link StreamChunk} stays with the caller — that mapping
 * is the only vendor-specific part, and baking one provider's wire format in here would
 * make the other two layers unusable for anyone else. {@link mapEventStream} is the seam.
 *
 * Runtime: browser and node. No DOM — a stream can be folded in a test or on a server.
 *
 * @module ranuts/stream
 */
export type {
  ContentBlock,
  ContentBlockType,
  FinishReason,
  ReasoningBlock,
  StreamChunk,
  TextBlock,
  TokenUsage,
  ToolCallBlock,
} from './types.ts';
export type { ByteSource, ServerSentEvent } from './sse.ts';
export { mapEventStream, parseEventStream } from './sse.ts';
export type { StreamAccumulator, StreamSnapshot } from './accumulator.ts';
export { createStreamAccumulator } from './accumulator.ts';
export type { CompactionLimits, CompactionPlan } from './budget.ts';
export { addUsage, estimateTokens, planCompaction } from './budget.ts';
