import type { ConversationNodeView } from 'ranui';
import type { StreamSnapshot } from 'ranuts/stream';

/**
 * What the conversation is built from.
 *
 * These are the app's own events, not `StreamChunk`s. The stream vocabulary describes one
 * model response; a conversation is made of turns, some of which the user wrote. Feeding
 * chunks straight into the projection would leave every view re-deriving whose turn it is.
 *
 * A turn opens when it has something to show, not when the request starts. That is what
 * puts reasoning above the answer it belongs to: nodes are ordered by the event that
 * started them, and reasoning arrives first.
 */
export type ChatEvent =
  | { type: 'turn/start'; id: string; role: 'user' | 'assistant'; text: string }
  | { type: 'turn/text'; id: string; text: string }
  | { type: 'turn/end'; id: string }
  | { type: 'turn/error'; id: string; message: string }
  | { type: 'reasoning/start'; id: string }
  | { type: 'reasoning/text'; id: string; text: string };

interface TurnState {
  role: 'user' | 'assistant';
  text: string;
  streaming: boolean;
  error: string | null;
}

interface ReasoningState {
  text: string;
  streaming: boolean;
}

/** An element that takes its content through a `content` property. */
type ContentElement = HTMLElement & { content: string };

/** `r-reasoning`, as far as this file needs it. */
type ReasoningElement = HTMLElement & { content: string; streaming: boolean; label: string };

/** One row per message, whoever wrote it. */
export const turnView: ConversationNodeView<ChatEvent, TurnState> = {
  kind: 'turn',
  match: (event) => {
    if (event.type === 'turn/start') return { id: event.id, role: 'start' };
    if (event.type === 'turn/text' || event.type === 'turn/end' || event.type === 'turn/error') {
      return { id: event.id, role: 'update' };
    }
    return null;
  },
  start: (event) => ({
    role: event.type === 'turn/start' ? event.role : 'assistant',
    text: event.type === 'turn/start' ? event.text : '',
    streaming: event.type === 'turn/start' && event.role === 'assistant',
    error: null,
  }),
  update: (state, event) => {
    if (event.type === 'turn/text') return { ...state, text: state.text + event.text };
    if (event.type === 'turn/end') return { ...state, streaming: false };
    if (event.type === 'turn/error') return { ...state, streaming: false, error: event.message };
    return state;
  },
  // A burst of tokens repaints once per frame; opening, closing and failing are discrete
  // facts, and waiting a frame for them only adds latency.
  publication: (event) => (event.type === 'turn/text' ? 'animation-frame' : 'immediate'),
  mount: (node) => {
    // A row is mounted into the conversation's shadow tree, where a page stylesheet cannot
    // reach it — so it has to be an element that styles itself.
    const card = document.createElement('r-card');
    card.setAttribute('title', node.state.role === 'user' ? '你' : '助手');
    card.appendChild(document.createElement('r-markdown'));
    return card;
  },
  patch: (element, node) => {
    const markdown = element.querySelector('r-markdown') as ContentElement | null;
    if (markdown === null) return;
    const { text, error, streaming } = node.state;
    markdown.content = error === null ? text : `${text}\n\n⚠️ ${error}`;
    // Streaming mode closes half-written markdown; a finished message has none to close,
    // and guessing at it would be inventing syntax the model did not send.
    markdown.setAttribute('mode', streaming ? 'streaming' : 'static');
  },
};

/**
 * Reasoning, in its own row above the answer.
 *
 * Separate from the turn because `ranuts/stream` already keeps `reasoning-delta` apart from
 * `text-delta`: a model that exposes its thinking bills it differently, and a reader wants
 * it out of the way once the answer arrives — which `r-reasoning` does on its own.
 */
export const reasoningView: ConversationNodeView<ChatEvent, ReasoningState> = {
  kind: 'reasoning',
  match: (event) => {
    if (event.type === 'reasoning/start') return { id: event.id, role: 'start' };
    if (event.type === 'reasoning/text' || event.type === 'turn/end') return { id: event.id, role: 'update' };
    return null;
  },
  start: () => ({ text: '', streaming: true }),
  update: (state, event) => {
    if (event.type === 'reasoning/text') return { ...state, text: state.text + event.text };
    if (event.type === 'turn/end') return { ...state, streaming: false };
    return state;
  },
  publication: (event) => (event.type === 'reasoning/text' ? 'animation-frame' : 'immediate'),
  mount: () => {
    const reasoning = document.createElement('r-reasoning') as ReasoningElement;
    reasoning.label = '思考过程';
    return reasoning;
  },
  patch: (element, node) => {
    const reasoning = element as ReasoningElement;
    reasoning.content = node.state.text;
    reasoning.streaming = node.state.streaming;
  },
};

/** How much of a response has already been turned into events. */
export interface EmittedSoFar {
  text: number;
  reasoning: number;
}

/**
 * Reports what a snapshot grew by, as conversation events.
 *
 * The accumulator already owns ordering and interleaving, so this only has to report the
 * new tail — which is what an append-only projection wants, and what keeps a repaint
 * proportional to the tokens that arrived rather than the answer's length.
 *
 * @param id The turn these belong to.
 * @param snapshot The latest snapshot.
 * @param emitted How much has already been emitted.
 * @returns The new events, and the counts to pass in next time.
 */
export function eventsFromSnapshot(
  id: string,
  snapshot: StreamSnapshot,
  emitted: EmittedSoFar,
): { events: ChatEvent[]; emitted: EmittedSoFar } {
  const join = (type: 'text' | 'reasoning'): string =>
    snapshot.blocks.reduce((out, block) => (block.type === type ? out + block.text : out), '');

  const reasoning = join('reasoning');
  const text = join('text');
  const events: ChatEvent[] = [];

  // Reasoning first, and its node opens on the first delta rather than with the request, so
  // a model that reports none leaves no empty block behind.
  if (reasoning.length > emitted.reasoning) {
    if (emitted.reasoning === 0) events.push({ type: 'reasoning/start', id });
    events.push({ type: 'reasoning/text', id, text: reasoning.slice(emitted.reasoning) });
  }
  if (text.length > emitted.text) {
    if (emitted.text === 0) events.push({ type: 'turn/start', id, role: 'assistant', text: '' });
    events.push({ type: 'turn/text', id, text: text.slice(emitted.text) });
  }

  return { events, emitted: { text: text.length, reasoning: reasoning.length } };
}
