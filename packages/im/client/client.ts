import 'ranui/card';
import 'ranui/conversation';
import 'ranui/input';
import 'ranui/button';
import 'ranui/markdown';
import 'ranui/reasoning';
import 'ranui/theme-switch';
import 'ranui/voice-button';
import message from 'ranui/message';
import { initTheme } from 'ranui/theme';
import { streamDialog } from '@/client/lib/eventSource';
import type { DialogStream } from '@/client/lib/eventSource';
import { eventsFromSnapshot, reasoningView, turnView } from '@/client/chat';
import type { ChatEvent, EmittedSoFar } from '@/client/chat';

/** `<r-conversation>`, as far as this file needs it. */
type ConversationElement = HTMLElement & {
  register: (view: unknown) => void;
  push: (event: ChatEvent) => void;
};

/** One turn of the conversation, as the provider expects it. */
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const chat = document.querySelector('#chat') as ConversationElement;
const composer = document.querySelector('#composer') as HTMLFormElement;
const question = document.querySelector('#question') as HTMLElement & { value: string };
const send = document.querySelector('#send') as HTMLElement & { disabled: boolean };
const stop = document.querySelector('#stop') as HTMLElement & { disabled: boolean };
const notice = document.querySelector('#notice') as HTMLElement;
const mic = document.querySelector('#mic') as HTMLElement & { listening: boolean; stop: () => void };

const DEMO_NOTICE =
  '演示模式：未配置 API key，回答来自内置示例。设置 IM_API_KEY（可选 IM_BASE_URL、IM_MODEL）后重启即可对接真实模型。';

// Every view registers before the first push; the projection is built once, and the
// element throws rather than silently missing events a later registration never saw.
chat.register(turnView);
chat.register(reasoningView);

/** The conversation so far, which is what makes this a chat rather than a series of prompts. */
const history: ChatMessage[] = [];
let inFlight: DialogStream | null = null;
let turn = 0;

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
 * Sends one turn and streams the answer into the conversation.
 *
 * @param content What the user typed.
 */
function ask(content: string): void {
  turn += 1;
  const id = `t${turn}`;

  chat.push({ type: 'turn/start', id: `${id}-user`, role: 'user', text: content });
  history.push({ role: 'user', content });

  let emitted: EmittedSoFar = { text: 0, reasoning: 0 };
  let answered = false;
  setRunning(true);

  inFlight = streamDialog(
    '/api/im/dialog',
    { messages: history },
    {
      onMode: (mode) => {
        // Confirms what the server already stamped into the page, and corrects it if the
        // server was restarted with a key while this tab stayed open.
        setNotice(mode === 'demo' ? DEMO_NOTICE : '');
      },
      onUpdate: (snapshot) => {
        const next = eventsFromSnapshot(id, snapshot, emitted);
        emitted = next.emitted;
        for (const event of next.events) {
          if (event.type === 'turn/start') answered = true;
          chat.push(event);
        }
      },
      onEnd: (snapshot, error) => {
        const text = snapshot.blocks.reduce((out, b) => (b.type === 'text' ? out + b.text : out), '');
        // A failure before any text has no row to attach itself to; open one so the reader
        // sees what happened instead of a request that silently produced nothing.
        if (!answered && error !== undefined) chat.push({ type: 'turn/start', id, role: 'assistant', text: '' });
        chat.push(error === undefined ? { type: 'turn/end', id } : { type: 'turn/error', id, message: error.message });
        if (text !== '') history.push({ role: 'assistant', content: text });
        inFlight = null;
        setRunning(false);
      },
    },
  );
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
  const content = question.value.trim();
  if (content === '' || inFlight !== null) return;
  question.value = '';
  ask(content);
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
