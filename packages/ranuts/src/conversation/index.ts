/**
 * `ranuts/conversation` — project an append-only event log into renderable nodes.
 *
 * Pairs with `ranuts/stream`, which produces the events, and with `createBottomFollower`
 * from `ranuts/utils`, which keeps the resulting view pinned to its floor. No DOM here:
 * the projection is testable, and server-renderable, on its own.
 *
 * @module ranuts/conversation
 */
export type {
  ConversationMatch,
  ConversationNode,
  ConversationNodeDefinition,
  ConversationPublication,
  ConversationReader,
} from './types.ts';
export type { ConversationEngine, ConversationEngineOptions, FrameScheduler } from './engine.ts';
export { createConversationEngine } from './engine.ts';
