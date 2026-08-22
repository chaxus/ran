import type { ConversationNodeView, ToolCallView, ToolCardStatus, ToolResultView } from 'ranui';
import type { StreamSnapshot } from 'ranuts/stream';
import { TOOLS, parseToolArgs } from '@/client/tools/index';

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
  | { type: 'turn/start'; id: string; role: TurnRole; text: string }
  | { type: 'turn/text'; id: string; text: string }
  | { type: 'turn/end'; id: string }
  | { type: 'turn/error'; id: string; message: string }
  // Sent for a row that has recorded alternatives, so the row can offer to switch between
  // them. Separate from `turn/start` because branch state is a fact about the stored
  // conversation, and a live row being streamed has no idea whether it will gain one.
  | { type: 'turn/branch'; id: string; current: number; total: number }
  | { type: 'reasoning/start'; id: string }
  | { type: 'reasoning/text'; id: string; text: string }
  // A tool call opens as soon as its name is known and its arguments are still arriving, so
  // the reader sees `抓取网页` before the URL rather than a blank pause the length of the
  // model writing JSON.
  | { type: 'tool/start'; id: string; name: string }
  | { type: 'tool/args'; id: string; args: string }
  | { type: 'tool/result'; id: string; output: string; failed: boolean };

/**
 * Who a row belongs to.
 *
 * `system` is compaction's summary standing in for the turns it folded away. It is a row
 * rather than a silent replacement because a history that quietly shrinks is a history the
 * reader cannot trust — they reload and their conversation is shorter than they left it.
 */
export type TurnRole = 'user' | 'assistant' | 'system';

interface TurnState {
  role: TurnRole;
  text: string;
  streaming: boolean;
  error: string | null;
  /** Position in the stored history, or null for a row that stands for no stored message. */
  index: number | null;
  /** 1-based position among this point's recorded alternatives, and how many there are. */
  branch: { current: number; total: number } | null;
}

interface ReasoningState {
  text: string;
  streaming: boolean;
}

interface ToolState {
  name: string;
  /** Raw JSON text, which is only a value once the call is complete. */
  args: string;
  output: string | null;
  failed: boolean;
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
    if (
      event.type === 'turn/text' ||
      event.type === 'turn/end' ||
      event.type === 'turn/error' ||
      event.type === 'turn/branch'
    ) {
      return { id: event.id, role: 'update' };
    }
    return null;
  },
  start: (event) => ({
    role: event.type === 'turn/start' ? event.role : 'assistant',
    text: event.type === 'turn/start' ? event.text : '',
    streaming: event.type === 'turn/start' && event.role === 'assistant',
    error: null,
    index: messageIndex(event.id),
    branch: null,
  }),
  update: (state, event) => {
    if (event.type === 'turn/text') return { ...state, text: state.text + event.text };
    if (event.type === 'turn/end') return { ...state, streaming: false };
    if (event.type === 'turn/error') return { ...state, streaming: false, error: event.message };
    if (event.type === 'turn/branch') return { ...state, branch: { current: event.current, total: event.total } };
    return state;
  },
  // A burst of tokens repaints once per frame; opening, closing and failing are discrete
  // facts, and waiting a frame for them only adds latency.
  publication: (event) => (event.type === 'turn/text' ? 'animation-frame' : 'immediate'),
  mount: (node) => {
    // The compaction marker is a different thing wearing the same node kind: a boundary
    // notice, not something anyone said. It gets a row, not a message.
    if (node.state.role === 'system') return compactionRow();

    const row = document.createElement('div');
    row.className = `turn turn-${node.state.role}`;
    // No card. A message needs no box: a user turn is identified by the bubble it sits in
    // and the side it sits on, and an assistant turn is the answer — drawing a frame around
    // the answer puts a second thing on screen competing with it.
    //
    // A user's message is text, not markdown. They typed it; rendering it as markdown turns
    // their asterisks into emphasis and lets a stray backtick eat the rest of the line.
    // It is also the only shape that works: `r-markdown` declares `contain: inline-size` and
    // so has no intrinsic width, which collapses a bubble that sizes to its own content.
    const body = document.createElement('div');
    body.className = node.state.role === 'user' ? 'turn-bubble' : 'turn-answer';
    if (node.state.role !== 'user') body.appendChild(document.createElement('r-markdown'));
    row.append(body, actionBar(node.state.index));
    return row;
  },
  patch: (element, node) => {
    const { text, error, streaming, role } = node.state;
    if (role === 'system') {
      patchCompaction(element, node.state);
      return;
    }
    const body = element.querySelector('.turn-bubble, .turn-answer') as HTMLElement | null;
    if (body === null) return;
    const shown = error === null ? text : `${text}\n\n⚠️ ${error}`;
    if (role === 'user') body.textContent = shown;
    else {
      const markdown = body.querySelector('r-markdown') as ContentElement | null;
      if (markdown === null) return;
      markdown.content = shown;
      // Streaming mode closes half-written markdown; a finished message has none to close,
      // and guessing at it would be inventing syntax the model did not send.
      markdown.setAttribute('mode', streaming ? 'streaming' : 'static');
    }
    patchActions(element, node.state);
  },
};

/**
 * Builds the compaction marker.
 *
 * One dim line with the summary folded behind it. A summary is not conversation — nobody
 * said it — and giving it the weight of a message puts the machine's bookkeeping in the
 * middle of what two parties actually exchanged. The line is there because a history that
 * silently changes size is one the reader cannot trust; the body is there because they
 * should be able to check what was kept.
 *
 * @returns The row.
 */
function compactionRow(): HTMLElement {
  const row = document.createElement('div');
  row.className = 'turn turn-system';
  const disclosure = document.createElement('r-disclosure-row');
  disclosure.setAttribute('expandable', '');
  disclosure.setAttribute('title', '早期对话已压缩');
  disclosure.appendChild(document.createElement('r-markdown'));
  row.appendChild(disclosure);
  return row;
}

/**
 * Writes the summary into a compaction marker.
 *
 * @param element The row.
 * @param state The row's state.
 */
function patchCompaction(element: HTMLElement, state: TurnState): void {
  const markdown = element.querySelector('r-markdown') as ContentElement | null;
  if (markdown !== null) markdown.content = state.text;
  // The collapsed line carries the summary's first line, so the marker says what was kept
  // without being opened.
  element.querySelector('r-disclosure-row')?.setAttribute('summary', state.text.split('\n', 1)[0] ?? '');
}

/**
 * Styles for the conversation rows, adopted into `r-conversation`'s shadow root.
 *
 * A real stylesheet imported as text rather than a template literal in this file. The rows
 * are built into a shadow tree a page stylesheet cannot reach, so the CSS has to travel as
 * a string — but a template literal ends at the first backtick, and a CSS comment that
 * mentions a property in backticks is exactly that. It failed that way once. A file also
 * gets formatted, highlighted and linted like the CSS it is.
 */
export { default as TURN_ACTION_CSS } from '@/client/assets/turn.css?inline';

// ── Row actions ────────────────────────────────────────────────────────────

/** What a row's buttons ask the conversation to do. */
export type TurnAction = 'edit' | 'regenerate' | 'previous' | 'next';

/** `turnaction` event detail. */
export interface TurnActionDetail {
  action: TurnAction;
  /** Index of the message the row stands for. */
  index: number;
}

/**
 * Recovers the message index a node id names.
 *
 * @param id The node id.
 * @returns The index, or null for a row that stands for no stored message — the halt notice
 *   a capped tool loop leaves behind is one, and it has nothing to edit or regenerate.
 */
function messageIndex(id: string): number | null {
  const match = /^m(\d+)$/.exec(id);
  return match === null ? null : Number(match[1]);
}

/** Buttons a row can show, in the order they appear. */
const ACTION_LABELS: { action: TurnAction; label: string }[] = [
  { action: 'previous', label: '‹' },
  { action: 'next', label: '›' },
  { action: 'edit', label: '编辑' },
  { action: 'regenerate', label: '重新生成' },
];

/**
 * Builds the action bar every row carries.
 *
 * Built once at mount and shown or hidden in `patch` rather than rebuilt: a button that is
 * recreated on every token loses focus mid-stream, and these sit under a message that
 * streams for seconds.
 *
 * Each button announces itself with a composed {@link TURN_ACTION_EVENT}. It has to: rows
 * are mounted into `r-conversation`'s **closed** shadow root, so a listener on the page
 * cannot see the button in `composedPath()` and has no way to work out what was clicked. A
 * custom event carries its own detail across the boundary intact.
 *
 * @param index Position of the message this row stands for, fixed for the row's whole life.
 * @returns The bar, with every button present and hidden.
 */
function actionBar(index: number | null): HTMLElement {
  const bar = document.createElement('div');
  bar.className = 'turn-actions';
  bar.append(
    ...ACTION_LABELS.map(({ action, label }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `turn-action turn-action-${action}`;
      button.dataset.action = action;
      button.textContent = label;
      button.hidden = true;
      button.addEventListener('click', () => {
        if (index === null) return;
        const detail: TurnActionDetail = { action, index };
        button.dispatchEvent(new CustomEvent(TURN_ACTION_EVENT, { detail, bubbles: true, composed: true }));
      });
      return button;
    }),
  );
  const count = document.createElement('span');
  count.className = 'turn-branch-count';
  count.hidden = true;
  bar.appendChild(count);
  return bar;
}

/**
 * Shows the actions this row can offer.
 *
 * @param element The row.
 * @param state The row's current state.
 */
function patchActions(element: HTMLElement, state: TurnState): void {
  const bar = element.querySelector('.turn-actions') as HTMLElement | null;
  if (bar === null) return;
  const { index, role, streaming, branch } = state;
  // Nothing is offered while the answer is still arriving: every one of these cuts the
  // history, and cutting it out from under a request in flight is how a half-written answer
  // lands in a conversation it no longer belongs to.
  const usable = index !== null && !streaming;

  const show: Record<TurnAction, boolean> = {
    edit: usable && role === 'user',
    regenerate: usable && role === 'assistant',
    previous: usable && branch !== null && branch.current > 1,
    next: usable && branch !== null && branch.current < branch.total,
  };
  for (const button of bar.querySelectorAll<HTMLElement>('.turn-action')) {
    const action = button.dataset.action as TurnAction;
    button.hidden = !show[action];
    button.setAttribute('aria-label', ARIA_LABELS[action]);
  }
  const count = bar.querySelector('.turn-branch-count') as HTMLElement | null;
  if (count === null) return;
  count.hidden = !usable || branch === null;
  count.textContent = branch === null ? '' : `${branch.current}/${branch.total}`;
  bar.hidden = !usable || (!show.edit && !show.regenerate && branch === null);
}

/** Accessible names; `‹` and `›` are not names a screen reader can read out. */
const ARIA_LABELS: Record<TurnAction, string> = {
  previous: '上一个回答',
  next: '下一个回答',
  edit: '编辑这条消息并重新发送',
  regenerate: '重新生成这个回答',
};

/** Event a row's action button fires. Detail is a {@link TurnActionDetail}. */
export const TURN_ACTION_EVENT = 'turnaction';
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

/** `r-tool-card`, as far as this file needs it. */
type ToolCardElement = HTMLElement & {
  call: ToolCallView | null;
  result: ToolResultView | null;
  status: ToolCardStatus;
};

/**
 * Fallback card for a tool this build does not have.
 *
 * A conversation stored when a tool existed is replayed after it was renamed or removed, and
 * the call is still part of what was said. Showing the name and the raw arguments is worse
 * than the real card and far better than a hole in the transcript.
 *
 * @param state The call as it was recorded.
 * @returns A generic pending card.
 */
function unknownToolCall(state: ToolState): ToolCallView {
  return { card: 'generic', title: state.name, input: state.args === '' ? undefined : { 参数: state.args } };
}

/**
 * One tool call, rendered from the intent its tool declares.
 *
 * The views are recomputed from `state` on every patch rather than stored: they are pure
 * functions of the arguments by contract, so recomputing costs nothing and keeps a replayed
 * card identical to the live one. It also means a card is never left showing a view built
 * from arguments that have since been revised by a later delta.
 */
export const toolView: ConversationNodeView<ChatEvent, ToolState> = {
  kind: 'tool',
  match: (event) => {
    if (event.type === 'tool/start') return { id: event.id, role: 'start' };
    if (event.type === 'tool/args' || event.type === 'tool/result') return { id: event.id, role: 'update' };
    return null;
  },
  start: (event) => ({
    name: event.type === 'tool/start' ? event.name : '',
    args: '',
    output: null,
    failed: false,
  }),
  update: (state, event) => {
    // Replacement, not concatenation: the accumulator already folded the deltas, and this
    // carries the whole arguments text as it currently stands.
    if (event.type === 'tool/args') return { ...state, args: event.args };
    if (event.type === 'tool/result') return { ...state, output: event.output, failed: event.failed };
    return state;
  },
  // Arguments arrive as a burst of tokens; a result is one discrete fact.
  publication: (event) => (event.type === 'tool/args' ? 'animation-frame' : 'immediate'),
  mount: () => document.createElement('r-tool-card'),
  patch: (element, node) => {
    const card = element as ToolCardElement;
    const { name, args, output, failed } = node.state;
    const tool = TOOLS.get(name);
    const parsed = parseToolArgs(args);

    card.call = tool === undefined ? unknownToolCall(node.state) : tool.call(parsed);
    if (output === null) {
      card.result = null;
      card.status = 'running';
      return;
    }
    card.result = tool === undefined || failed ? { card: 'generic', content: output } : tool.result(parsed, output);
    card.status = failed ? 'error' : 'success';
  },
};

/** How much of a response has already been turned into events. */
export interface EmittedSoFar {
  text: number;
  reasoning: number;
  /** Per tool call, in block order: whether its node is open and how much of its arguments went out. */
  tools: { started: boolean; args: number }[];
}

/** Nothing emitted yet. */
export const NOTHING_EMITTED: EmittedSoFar = { text: 0, reasoning: 0, tools: [] };

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

  const calls = snapshot.blocks.filter((block) => block.type === 'tool-call');
  const tools = calls.map((call, ordinal) => {
    const before = emitted.tools[ordinal] ?? { started: false, args: 0 };
    // Opened on the name, not on the block: a tool call's first delta carries the id and the
    // name, and a card titled with an empty string would be on screen for the whole time the
    // model spends writing the arguments.
    if (!before.started && call.name === '') return before;
    if (!before.started) events.push({ type: 'tool/start', id: toolNodeId(id, ordinal), name: call.name });
    // Whole text rather than the tail: `arguments` is JSON that only means anything complete,
    // and the card re-parses it on every patch.
    if (call.arguments.length !== before.args) {
      events.push({ type: 'tool/args', id: toolNodeId(id, ordinal), args: call.arguments });
    }
    return { started: true, args: call.arguments.length };
  });

  return { events, emitted: { text: text.length, reasoning: reasoning.length, tools } };
}

/**
 * Names the conversation node of one tool call.
 *
 * Derived rather than taken from the provider's call id so that a replay, which has the ids
 * but rebuilds the turn from scratch, produces the same nodes in the same order.
 *
 * @param turnId The turn the call belongs to.
 * @param ordinal Its position among that turn's calls.
 * @returns The node id.
 */
export function toolNodeId(turnId: string, ordinal: number): string {
  return `${turnId}-tool-${ordinal}`;
}
