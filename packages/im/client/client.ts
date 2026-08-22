import 'ranui/card';
import 'ranui/conversation';
import 'ranui/input';
import 'ranui/button';
import 'ranui/markdown';
import 'ranui/reasoning';
import 'ranui/theme-switch';
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
        // The answer's content is the model's; a note about configuration is not, so it
        // arrives as a header and is shown here rather than mixed into the stream.
        setNotice(
          mode === 'demo'
            ? '演示模式：未配置 API key，回答来自内置示例。设置 IM_API_KEY（可选 IM_BASE_URL、IM_MODEL）后重启即可对接真实模型。'
            : '',
        );
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
        // Resolves the light/dark choice `r-theme-switch` offers, and the `system` default it
        // starts on, before the first interaction rather than after it.
        initTheme();

        setRunning(false);
      },
    },
  );
}

composer.addEventListener('submit', (event) => {
  event.preventDefault();
  const content = question.value.trim();
  if (content === '' || inFlight !== null) return;
  question.value = '';
  ask(content);
});

send.addEventListener('click', () => composer.requestSubmit());
stop.addEventListener('click', () => inFlight?.close());

setRunning(false);
