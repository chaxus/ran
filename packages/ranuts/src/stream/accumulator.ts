/**
 * Folds a {@link StreamChunk} sequence into the blocks it describes.
 *
 * A renderer wants "the current text", not "every delta since the start", and rebuilding
 * that by concatenating in the view is where streaming UIs leak: the view ends up owning
 * ordering, interleaving, and the block-end/delta reconciliation. This owns all three, so
 * a view reads a snapshot and renders it.
 */
import type { ContentBlock, ContentBlockType, FinishReason, StreamChunk, TokenUsage } from './types.ts';

/** Immutable view of everything received so far. */
export interface StreamSnapshot {
  /** Completed and in-progress blocks, in `index` order. */
  readonly blocks: readonly ContentBlock[];
  /** Latest usage report, once one has arrived. */
  readonly usage: TokenUsage | undefined;
  /** Terminal reason, once `finish` has arrived. */
  readonly finishReason: FinishReason | undefined;
  /** True once `finish` has arrived. */
  readonly done: boolean;
}

/** Stateful fold over one response's chunks. */
export interface StreamAccumulator {
  /**
   * Applies one chunk.
   *
   * A delta for an unseen `index` opens its block, because several providers omit
   * `block-start` entirely. A `block-end` replaces whatever was accumulated at that index:
   * the assembled block the provider sent is authoritative.
   *
   * @param chunk The chunk to fold in.
   */
  push(chunk: StreamChunk): void;
  /** @returns An immutable view of the current state. */
  snapshot(): StreamSnapshot;
  /** @returns Every text block concatenated, in index order. */
  text(): string;
  /** @returns Every reasoning block concatenated, in index order. */
  reasoning(): string;
  /** @returns Completed tool calls, in index order. */
  toolCalls(): readonly Extract<ContentBlock, { type: 'tool-call' }>[];
  /** Discards all state so the instance can fold another response. */
  reset(): void;
}

/**
 * Creates an empty block of the given type.
 *
 * @param type Block discriminator.
 * @returns A zero-valued block of that type.
 */
function emptyBlock(type: ContentBlockType): ContentBlock {
  if (type === 'text') return { type: 'text', text: '' };
  if (type === 'reasoning') return { type: 'reasoning', text: '' };
  return { type: 'tool-call', id: '', name: '', arguments: '' };
}

/**
 * Creates a fold over one streamed response.
 *
 * @returns A fresh accumulator with no state.
 */
export function createStreamAccumulator(): StreamAccumulator {
  let blocks = new Map<number, ContentBlock>();
  let usage: TokenUsage | undefined;
  let finishReason: FinishReason | undefined;

  const at = (index: number, type: ContentBlockType): ContentBlock => {
    const existing = blocks.get(index);
    // A type mismatch means the provider reused an index for a different block; the newer
    // declaration wins, since the older one can no longer receive deltas.
    if (existing !== undefined && existing.type === type) return existing;
    const created = emptyBlock(type);
    blocks.set(index, created);
    return created;
  };

  const ordered = (): ContentBlock[] => [...blocks.entries()].sort(([a], [b]) => a - b).map(([, block]) => block);

  return {
    push(chunk) {
      switch (chunk.type) {
        case 'block-start':
          at(chunk.index, chunk.blockType);
          return;
        case 'text-delta': {
          const block = at(chunk.index, 'text') as Extract<ContentBlock, { type: 'text' }>;
          block.text += chunk.text;
          return;
        }
        case 'reasoning-delta': {
          const block = at(chunk.index, 'reasoning') as Extract<ContentBlock, { type: 'reasoning' }>;
          block.text += chunk.text;
          return;
        }
        case 'tool-call-delta': {
          const block = at(chunk.index, 'tool-call') as Extract<ContentBlock, { type: 'tool-call' }>;
          // The id and name arrive once, usually on the first delta; later deltas repeat
          // or omit them, and an omission must not blank what is already known.
          if (chunk.id !== '') block.id = chunk.id;
          if (chunk.name !== undefined && chunk.name !== '') block.name = chunk.name;
          block.arguments += chunk.argumentsDelta;
          return;
        }
        case 'block-end':
          blocks.set(chunk.index, { ...chunk.block });
          return;
        case 'usage':
          usage = chunk.usage;
          return;
        case 'finish':
          finishReason = chunk.reason;
          return;
      }
    },

    snapshot() {
      return Object.freeze({
        blocks: Object.freeze(ordered().map((block) => Object.freeze({ ...block }))),
        usage: usage === undefined ? undefined : Object.freeze({ ...usage }),
        finishReason,
        done: finishReason !== undefined,
      });
    },

    text() {
      return ordered().reduce((out, block) => (block.type === 'text' ? out + block.text : out), '');
    },

    reasoning() {
      return ordered().reduce((out, block) => (block.type === 'reasoning' ? out + block.text : out), '');
    },

    toolCalls() {
      return ordered().filter(
        (block): block is Extract<ContentBlock, { type: 'tool-call' }> => block.type === 'tool-call',
      );
    },

    reset() {
      blocks = new Map();
      usage = undefined;
      finishReason = undefined;
    },
  };
}
