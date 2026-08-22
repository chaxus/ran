import 'ranui/card';
import 'ranui/conversation';
import 'ranui/input';
import 'ranui/button';
import 'ranui/markdown';
import 'ranui/reasoning';
import 'ranui/theme-switch';
import 'ranui/attachments';
import 'ranui/icon';
import 'ranui/voice-button';
import 'ranui/tool-card';
import message from 'ranui/message';
import { initTheme } from 'ranui/theme';
import { formatRelative, readFileAsDataURL } from 'ranuts/utils';
import { openSessionStore, titleFrom } from '@/client/sessions';
import type { Session, SessionStore, StoredMessage } from '@/client/sessions';
import type { Attachment, AttachmentRejection } from 'ranui';
import { streamDialog } from '@/client/lib/eventSource';
import type { DialogStream } from '@/client/lib/eventSource';
import { NOTHING_EMITTED, eventsFromSnapshot, reasoningView, toolNodeId, toolView, turnView } from '@/client/chat';
import type { ChatEvent, EmittedSoFar } from '@/client/chat';
import { parseToolArgs, runTool, toolsForRequest } from '@/client/tools/index';
import type { WireToolCall } from '@/client/chat-types';

/** `<r-conversation>`, as far as this file needs it. */
type ConversationElement = HTMLElement & {
  register: (view: unknown) => void;
  push: (event: ChatEvent) => void;
  reset: () => void;
};

import type { ContentPart, MessageContent } from '@/client/chat-types';

const chat = document.querySelector('#chat') as ConversationElement;
const composer = document.querySelector('#composer') as HTMLFormElement;
const question = document.querySelector('#question') as HTMLElement & { value: string };
const send = document.querySelector('#send') as HTMLElement & { disabled: boolean };
const stop = document.querySelector('#stop') as HTMLElement & { disabled: boolean };
const notice = document.querySelector('#notice') as HTMLElement;
const mic = document.querySelector('#mic') as HTMLElement & { listening: boolean; stop: () => void };

const attachments = document.querySelector('#attachments') as HTMLElement & {
  attachments: readonly Attachment[];
  add: (files: Iterable<File>) => Attachment[];
  clear: () => void;
};
const picker = document.querySelector('#picker') as HTMLInputElement;
const attach = document.querySelector('#attach') as HTMLElement;
const drop = document.querySelector('#drop') as HTMLElement;
const sessionList = document.querySelector('#sessions-list') as HTMLElement;
const newSession = document.querySelector('#new-session') as HTMLElement;

const DEMO_NOTICE =
  '演示模式：未配置 API key，回答来自内置示例。设置 IM_API_KEY（可选 IM_BASE_URL、IM_MODEL）后重启即可对接真实模型。';

// Every view registers before the first push; the projection is built once, and the
// element throws rather than silently missing events a later registration never saw.
chat.register(turnView);
chat.register(reasoningView);
chat.register(toolView);

let store: SessionStore;
let current: Session;
let inFlight: DialogStream | null = null;
let turn = 0;
/** Reported once per page, not once per failed write, so a full disk does not become a wall. */
let storageWarned = false;

/**
 * Reflects whether a request is running into the two buttons that depend on it.
 *
 * @param running Whether a request is in flight.
 */
function setRunning(running: boolean): void {
  send.disabled = running;
  stop.disabled = !running;
}

/**
 * Shows the one-line notice above the conversation.
 *
 * @param text What to say; an empty string hides it.
 */
function setNotice(text: string): void {
  notice.textContent = text;
  notice.hidden = text === '';
}

/**
 * How many provider round trips one user message may cost.
 *
 * A model that calls a tool, reads the result and calls again is working; a model that calls
 * the same tool forever is a bill. The ceiling is on round trips rather than on calls,
 * because several calls answered in one round is the case worth encouraging.
 */
const MAX_STEPS = 6;

/**
 * Sends one turn and streams the answer into the conversation.
 *
 * @param text What the user typed.
 */
async function ask(text: string): Promise<void> {
  turn += 1;
  const id = `t${turn}`;

  const staged = [...attachments.attachments];
  const content = await buildContent(text, staged);
  // The transcript shows what was attached, because a message that reads "看看这个" with no
  // sign of the four screenshots beside it is a message nobody can reconstruct later.
  const shown = staged.length === 0 ? text : `${text}\n\n${staged.map((a) => `\`${a.name}\``).join(' · ')}`;

  chat.push({ type: 'turn/start', id: `${id}-user`, role: 'user', text: shown });
  current.messages.push({ role: 'user', content });
  // Named from the first thing said in it, once: a conversation renamed on every turn is a
  // list entry that keeps moving under the reader.
  if (current.messages.length === 1) current.title = titleFrom(content);
  attachments.clear();
  await persist();
  await renderSessions();

  setRunning(true);
  await runStep(id, 0);
}

/**
 * Runs one provider round trip, and the next one when the model asked for tools.
 *
 * The loop lives here rather than in the stream layer because continuing is a decision about
 * the conversation: it needs the history to append to, the transcript to draw into, and a
 * ceiling on how many times it may happen. `streamDialog` knows about one response.
 *
 * @param id The user turn every round of this exchange belongs to.
 * @param step Which round this is, counted from 0.
 * @returns Once the exchange has ended, whether by an answer, a failure, or the ceiling.
 */
function runStep(id: string, step: number): Promise<void> {
  // Each round gets its own node ids: its reasoning, its answer and its tool cards are
  // separate rows from the previous round's, which is what makes a multi-step exchange
  // readable rather than one row that keeps being rewritten.
  const round = `${id}-r${step}`;
  let emitted: EmittedSoFar = NOTHING_EMITTED;
  let answered = false;

  return new Promise((resolve) => {
    inFlight = streamDialog(
      '/api/im/dialog',
      { messages: current.messages, tools: toolsForRequest() },
      {
        onMode: (mode) => {
          // Confirms what the server already stamped into the page, and corrects it if the
          // server was restarted with a key while this tab stayed open.
          setNotice(mode === 'demo' ? DEMO_NOTICE : '');
        },
        onUpdate: (snapshot) => {
          const next = eventsFromSnapshot(round, snapshot, emitted);
          emitted = next.emitted;
          for (const event of next.events) {
            if (event.type === 'turn/start') answered = true;
            chat.push(event);
          }
        },
        onEnd: (snapshot, error) => {
          inFlight = null;
          const text = snapshot.blocks.reduce((out, b) => (b.type === 'text' ? out + b.text : out), '');
          const calls = snapshot.blocks.filter((block) => block.type === 'tool-call');

          if (error !== undefined) {
            // A failure before any text has no row to attach itself to; open one so the
            // reader sees what happened instead of a request that produced nothing.
            if (!answered) chat.push({ type: 'turn/start', id: round, role: 'assistant', text: '' });
            chat.push({ type: 'turn/error', id: round, message: error.message });
            setRunning(false);
            resolve();
            return;
          }

          if (calls.length === 0) {
            chat.push({ type: 'turn/end', id: round });
            if (text !== '') {
              current.messages.push({ role: 'assistant', content: text });
              void persist().then(renderSessions);
            }
            setRunning(false);
            resolve();
            return;
          }

          chat.push({ type: 'turn/end', id: round });
          void continueWithTools(id, step, round, text, calls).then(resolve);
        },
      },
    );
  });
}

/**
 * Runs the tools a round asked for and starts the next round.
 *
 * The assistant message carrying the calls is appended before any tool runs: a provider
 * rejects a `role: 'tool'` message whose id names no call in the message before it, so the
 * two halves are written in the order the wire format requires, not the order they complete.
 *
 * @param id The user turn this exchange belongs to.
 * @param step Which round produced these calls.
 * @param round The node-id prefix that round used.
 * @param text Any text the model wrote alongside the calls.
 * @param calls The calls, in block order.
 */
async function continueWithTools(
  id: string,
  step: number,
  round: string,
  text: string,
  calls: readonly { id: string; name: string; arguments: string }[],
): Promise<void> {
  const wire: WireToolCall[] = calls.map((call, ordinal) => ({
    // A provider that streamed no id — some do for a single call — still needs one to
    // correlate the result, and it only has to be unique within this exchange.
    id: call.id === '' ? `${round}-${ordinal}` : call.id,
    type: 'function',
    function: { name: call.name, arguments: call.arguments },
  }));
  current.messages.push({ role: 'assistant', content: text, tool_calls: wire });

  // Concurrently: the model asked for all of them at once, and running them in sequence
  // would make two independent lookups cost the sum of their latencies for no reason.
  const outcomes = await Promise.all(calls.map((call) => runTool(call.name, parseToolArgs(call.arguments))));

  outcomes.forEach((outcome, ordinal) => {
    const call = calls[ordinal];
    const entry = wire[ordinal];
    if (call === undefined || entry === undefined) return;
    chat.push({ type: 'tool/result', id: toolNodeId(round, ordinal), output: outcome.output, failed: outcome.failed });
    // A failed tool still goes back to the model. It is the model's turn, and "that URL does
    // not resolve" is something it can act on; withholding it leaves it waiting forever.
    current.messages.push({ role: 'tool', content: outcome.output, tool_call_id: entry.id, name: call.name });
  });

  await persist();
  await renderSessions();

  if (step + 1 >= MAX_STEPS) {
    chat.push({ type: 'turn/start', id: `${round}-halt`, role: 'assistant', text: '' });
    chat.push({
      type: 'turn/error',
      id: `${round}-halt`,
      message: `已连续调用工具 ${MAX_STEPS} 轮仍未给出答案，已停止。`,
    });
    setRunning(false);
    return;
  }
  await runStep(id, step + 1);
}

// ── Sessions ───────────────────────────────────────────────────────────────

/**
 * Persists the open conversation.
 *
 * Reported rather than swallowed: a conversation someone just had is their work, and losing
 * it without a word is worse than saying the browser refused. Once per page, though —
 * a full disk fails every write, and one warning per turn would be a wall.
 */
async function persist(): Promise<void> {
  current.updatedAt = Date.now();
  const saved = await store.save(current);
  if (saved || storageWarned) return;
  storageWarned = true;
  message?.warning('这台浏览器拒绝保存对话记录，本次会话在刷新后会丢失。');
}

/**
 * Builds an empty conversation.
 *
 * @returns The new session, not yet stored — an empty conversation nobody has spoken in is
 *   not worth a record, and writing one on every page load would fill the list with blanks.
 */
function blankSession(): Session {
  const now = Date.now();
  return { id: `s-${now}-${Math.round(now % 1000)}`, title: '新对话', createdAt: now, updatedAt: now, messages: [] };
}

/**
 * Replays a stored conversation into the transcript.
 *
 * @param session The conversation to show.
 */
function renderSession(session: Session): void {
  chat.reset();
  turn = 0;
  // Results are indexed by call id first, because a tool message names the call it answers
  // and the two are not adjacent when the model made several calls at once.
  const results = new Map<string, { output: string; failed: boolean }>();
  for (const entry of session.messages) {
    // A stored result carries no verdict — the wire format has no field for one, and the
    // model is not told either. Replay shows every finished call as finished.
    if (entry.role === 'tool') results.set(entry.tool_call_id, { output: entry.content, failed: false });
  }

  session.messages.forEach((entry, index) => {
    // A tool message has already been drawn as the result of its call.
    if (entry.role === 'tool') return;
    const id = `restored-${index}`;
    const text = typeof entry.content === 'string' ? entry.content : textOf(entry.content);
    // An assistant message that only asked for tools has no text; opening an empty row for
    // it would put a blank card above every tool call in the transcript.
    if (text !== '' || entry.role === 'user' || entry.tool_calls === undefined) {
      chat.push({ type: 'turn/start', id, role: entry.role, text });
      // Restored turns are finished by definition; without this every one of them would come
      // back mid-stream, with `r-markdown` still guessing at half-written syntax.
      chat.push({ type: 'turn/end', id });
    }
    if (entry.role !== 'assistant') return;

    (entry.tool_calls ?? []).forEach((call, ordinal) => {
      const node = toolNodeId(id, ordinal);
      chat.push({ type: 'tool/start', id: node, name: call.function.name });
      chat.push({ type: 'tool/args', id: node, args: call.function.arguments });
      const outcome = results.get(call.id);
      // A call with no result is one whose exchange was cut off — the tab closed mid-run.
      // Its card stays in the running state, which is what actually happened.
      if (outcome !== undefined) chat.push({ type: 'tool/result', id: node, ...outcome });
    });
  });
}

/**
 * The readable part of a message.
 *
 * @param content Message content.
 * @returns Its text, with attachments named — a restored turn that showed nothing where four
 *   screenshots were is a turn nobody can reconstruct.
 */
function textOf(content: MessageContent): string {
  if (typeof content === 'string') return content;
  const text = content
    .filter((part): part is Extract<ContentPart, { type: 'text' }> => part.type === 'text')
    .map((part) => part.text)
    .join('\n');
  const images = content.filter((part) => part.type === 'image_url').length;
  return images === 0 ? text : `${text}\n\n${images} 张图片`;
}

/** Redraws the conversation list. */
async function renderSessions(): Promise<void> {
  const all = await store.list();
  sessionList.replaceChildren();

  for (const session of all) {
    const row = document.createElement('li');
    row.className = 'session';
    row.tabIndex = 0;
    row.setAttribute('role', 'button');
    // Marked by more than colour: this is what a screen reader reads to say which is open.
    row.setAttribute('aria-current', session.id === current.id ? 'true' : 'false');

    const title = document.createElement('span');
    title.className = 'session-title';
    title.textContent = session.title;
    title.title = session.title;

    const time = document.createElement('span');
    time.className = 'session-time';
    time.textContent = formatRelative(session.updatedAt, { style: 'narrow' });

    const remove = document.createElement('button');
    remove.className = 'session-delete';
    remove.type = 'button';
    remove.textContent = '×';
    // Named after the conversation, so a column of delete buttons is a column of distinct
    // commands rather than twelve identical ones.
    remove.setAttribute('aria-label', `删除对话：${session.title}`);
    remove.addEventListener('click', (event) => {
      event.stopPropagation();
      void deleteSession(session.id);
    });

    row.append(title, time, remove);
    row.addEventListener('click', () => void openSession(session.id));
    row.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      void openSession(session.id);
    });
    sessionList.appendChild(row);
  }
}

/**
 * Switches to a stored conversation.
 *
 * @param id The conversation to open.
 */
async function openSession(id: string): Promise<void> {
  if (id === current.id) return;
  // An answer still arriving belongs to the conversation being left, and following it into
  // another one would write it into the wrong history.
  inFlight?.close();
  const session = await store.get(id);
  if (session === null) return;
  current = session;
  store.setCurrentId(session.id);
  renderSession(session);
  await renderSessions();
}

/**
 * Deletes a conversation, opening a blank one when it was the open one.
 *
 * @param id The conversation to delete.
 */
async function deleteSession(id: string): Promise<void> {
  await store.remove(id);
  if (id === current.id) {
    inFlight?.close();
    current = blankSession();
    store.setCurrentId(current.id);
    renderSession(current);
  }
  await renderSessions();
}

newSession.addEventListener('click', () => {
  inFlight?.close();
  current = blankSession();
  store.setCurrentId(current.id);
  renderSession(current);
  void renderSessions();
});

// ── Attachments ────────────────────────────────────────────────────────────
//
// Three gestures, one destination. Whichever way a file arrives — picked, pasted, dropped —
// it goes through the same `add`, so validation and preview cannot differ by entry point.

const REJECTION_TEXT: Record<AttachmentRejection, string> = {
  'too-large': '文件超过 10 MB',
  'type-not-accepted': '不支持这种文件类型',
  'too-many': '最多同时附带 6 个文件',
  duplicate: '这个文件已经在列表里了',
};

attachments.addEventListener('attachmentrejected', (event) => {
  const { file, reason } = (event as CustomEvent<{ file: File; reason: AttachmentRejection }>).detail;
  // Named, because "a file was rejected" leaves the reader checking which of the four they
  // just dropped is missing.
  message?.warning(`${file.name}：${REJECTION_TEXT[reason]}`);
});

attach.addEventListener('click', () => picker.click());

picker.addEventListener('change', () => {
  if (picker.files !== null) attachments.add(picker.files);
  // Cleared so picking the same file again still fires `change`; the browser reports no
  // change when the value is identical, and the second pick would look ignored.
  picker.value = '';
});

question.addEventListener('paste', (event) => {
  const files = (event as ClipboardEvent).clipboardData?.files;
  if (files === undefined || files.length === 0) return;
  // Only when the clipboard actually carries files. Intercepting every paste would break
  // pasting text, which is what the box is mostly for.
  event.preventDefault();
  attachments.add(files);
});

let dragDepth = 0;

drop.addEventListener('dragenter', (event) => {
  if (!(event as DragEvent).dataTransfer?.types.includes('Files')) return;
  event.preventDefault();
  // Counted, not toggled: dragging across a child fires leave-then-enter, and a boolean
  // would flicker the highlight off every time the pointer crossed the input.
  dragDepth += 1;
  drop.classList.add('is-dropping');
});

drop.addEventListener('dragover', (event) => {
  if ((event as DragEvent).dataTransfer?.types.includes('Files')) event.preventDefault();
});

drop.addEventListener('dragleave', () => {
  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) drop.classList.remove('is-dropping');
});

drop.addEventListener('drop', (event) => {
  const files = (event as DragEvent).dataTransfer?.files;
  dragDepth = 0;
  drop.classList.remove('is-dropping');
  if (files === undefined || files.length === 0) return;
  // Without this the browser navigates away to display the dropped file, taking the
  // conversation with it.
  event.preventDefault();
  attachments.add(files);
});

/**
 * Builds the content of a user message.
 *
 * A text-only turn stays a plain string, which is what every provider accepts; parts are
 * used only once there is something besides text, so a conversation that never attaches
 * anything sends exactly what it sent before.
 *
 * @param text What was typed.
 * @param staged The files staged alongside it.
 * @returns The `content` field for the request.
 */
async function buildContent(text: string, staged: readonly Attachment[]): Promise<MessageContent> {
  if (staged.length === 0) return text;
  const parts: ContentPart[] = [];
  for (const attachment of staged) {
    if (!attachment.type.startsWith('image/')) continue;
    // A data URL, built once at send time. The preview used an object URL, which costs a
    // reference rather than a base64 copy of the bytes.
    parts.push({ type: 'image_url', image_url: { url: await readFileAsDataURL(attachment.file) } });
  }
  if (text !== '') parts.push({ type: 'text', text });
  return parts;
}

// ── Dictation ──────────────────────────────────────────────────────────────
//
// Speech arrives as the transcript of the whole capture, revised as recognition firms up,
// so the text already in the box is remembered at the start and the transcript is appended
// to it. Appending each event instead would repeat every revision.
let dictationBase = '';

mic.addEventListener('voicestart', () => {
  const typed = question.value;
  // A space between what was typed and what is said, unless one is already there — without
  // it, dictating after a half-typed word runs the two together.
  dictationBase = typed === '' || /\s$/.test(typed) ? typed : `${typed} `;
});

mic.addEventListener('voiceresult', (event) => {
  const { transcript } = (event as CustomEvent<{ transcript: string; isFinal: boolean }>).detail;
  question.value = dictationBase + transcript;
});

mic.addEventListener('voiceerror', (event) => {
  const { kind } = (event as CustomEvent<{ kind: string; detail: string }>).detail;
  // A silent pause and a programmatic stop travel the same channel as a real failure and
  // are neither; showing them would nag after every capture.
  // `message` is null when there is no window — ranui returns no toast API during server
  // rendering, and this file only ever runs in a browser, but the type says what it says.
  if (kind === 'denied') message?.error('麦克风被拒绝。请在浏览器地址栏的权限设置里允许后重试。');
  else if (kind === 'failed') message?.error('语音识别失败，请重试或改用键盘输入。');
});

composer.addEventListener('submit', (event) => {
  event.preventDefault();
  // Sending while still dictating: end the capture first, so the words already spoken land
  // in the message rather than in the box after it has been cleared.
  if (mic.listening) mic.stop();
  const text = question.value.trim();
  // Attachments alone are a message: "look at this" is often the whole point of sending one.
  if ((text === '' && attachments.attachments.length === 0) || inFlight !== null) return;
  question.value = '';
  void ask(text);
});

send.addEventListener('click', () => composer.requestSubmit());
stop.addEventListener('click', () => inFlight?.close());

// Resolves the light/dark choice `r-theme-switch` offers, and the `system` default it starts
// on, before the first interaction rather than after it.
initTheme();

// The server knows which mode it is in and says so in the markup, so the notice is on screen
// at first paint — someone should know they are talking to a canned answer before they type.
if ((document.querySelector('main')?.dataset.mode ?? '') === 'demo') setNotice(DEMO_NOTICE);

setRunning(false);

/**
 * Opens the store and restores whatever this browser had open.
 *
 * A reload landing on a blank conversation with the previous one a click away is not the
 * same as landing back in it; the second is what someone who refreshed expects.
 */
async function boot(): Promise<void> {
  store = await openSessionStore();
  const restored = await store.get(store.currentId());
  current = restored ?? blankSession();
  if (restored !== null) renderSession(restored);
  store.setCurrentId(current.id);
  await renderSessions();
}

void boot();
