import { resolveProvider } from '@/app/lib/provider';
import type { LiveProvider } from '@/app/lib/provider';
import type { Context } from '@/app/types/index';

/** One turn of the conversation, as the client sends it and the provider expects it. */
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const POEM =
  '春江花月夜\n春江潮水连海平，海上明月共潮生。\n滟滟随波千万里，何处春江无月明。\n江流宛转绕芳甸，月照花林皆似霰。\n空里流霜不觉飞，汀上白沙看不见。\n江天一色无纤尘，皎皎空中孤月轮。\n江畔何人初见月？江月何年初照人？\n人生代代无穷已，江月年年望相似。\n不知江月待何人，但见长江送流水。\n';

/** Characters per demo delta; a real provider's token is a few characters too. */
const CHUNK_SIZE = 3;
const INTERVAL_MS = 40;

/**
 * Server-Sent Event framing.
 *
 * @param write Sink for one chunk of response body.
 * @returns A function that frames and writes one event payload.
 */
function sender(write: (chunk: string) => void): (payload: unknown) => void {
  return (payload) => {
    write(`data: ${typeof payload === 'string' ? payload : JSON.stringify(payload)}\n\n`);
  };
}

/**
 * Forwards a provider's stream to the browser byte for byte.
 *
 * Nothing is parsed or reassembled on the way through. Re-framing here would put a second
 * SSE implementation in the path, and the client already has one that is tested; a proxy
 * that only copies cannot disagree with the provider about where an event ends.
 *
 * @param ctx Request context.
 * @param provider The configured provider.
 * @param messages The conversation to send.
 */
async function streamProvider(ctx: Context, provider: LiveProvider, messages: ChatMessage[]): Promise<void> {
  const { res, req } = ctx;
  const send = sender((chunk) => res.write(chunk));
  const abort = new AbortController();
  req.on('close', () => abort.abort());

  try {
    const upstream = await fetch(`${provider.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({ model: provider.model, messages, stream: true, stream_options: { include_usage: true } }),
      signal: abort.signal,
    });

    if (!upstream.ok || upstream.body === null) {
      // The provider's own message is the useful one — a key that expired, a model that
      // does not exist. Surfacing it beats a generic failure the reader cannot act on.
      const detail = await upstream.text().catch(() => '');
      send({ error: { status: upstream.status, message: detail.slice(0, 500) || upstream.statusText } });
      send('[DONE]');
      res.end();
      return;
    }

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
    res.end();
  } catch (error) {
    // An abort is the reader closing the tab, not a failure to report.
    if (abort.signal.aborted) {
      res.end();
      return;
    }
    send({ error: { status: 0, message: error instanceof Error ? error.message : String(error) } });
    send('[DONE]');
    res.end();
  }
}

/**
 * Streams the canned answer, so a clone with no key still shows a working conversation.
 *
 * @param ctx Request context.
 */
function streamDemo(ctx: Context): void {
  const { res, req } = ctx;
  const send = sender((chunk) => res.write(chunk));
  const id = `demo-${Date.now()}`;
  let sent = 0;

  const timer = setInterval(() => {
    // Deltas, not the accumulated answer: resending the whole text on every tick costs
    // O(n²) bytes to transmit n characters, and leaves the client no way to tell an
    // append from a rewrite.
    const delta = POEM.slice(sent, sent + CHUNK_SIZE);
    sent += delta.length;
    send({ id, object: 'chat.completion.chunk', choices: [{ index: 0, delta: { content: delta } }] });

    if (sent < POEM.length) return;
    clearInterval(timer);
    send({
      id,
      object: 'chat.completion.chunk',
      choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
      usage: { completion_tokens: POEM.length },
    });
    send('[DONE]');
    res.end();
  }, INTERVAL_MS);

  req.on('close', () => {
    clearInterval(timer);
    res.end();
  });
}

export default class IMController {
  /**
   * Streams an answer as Server-Sent Events, from a real provider when one is configured
   * and from a canned poem otherwise.
   *
   * Both paths emit the same OpenAI-compatible wire shape, so the client's mapping onto
   * `ranuts/stream` is the same code either way — the demo is a stand-in for the provider,
   * not a second protocol.
   *
   * Which path ran is reported in `X-IM-Mode` rather than mixed into the stream: the
   * answer's content is the model's, and a notice about configuration is not.
   *
   * @param ctx Request context.
   */
  dialog(ctx: Context): void {
    const { res, req } = ctx;
    const body = ctx.request.body as { messages?: ChatMessage[]; question?: string };
    const messages: ChatMessage[] =
      body.messages ?? (body.question === undefined ? [] : [{ role: 'user', content: body.question }]);

    const provider = resolveProvider();
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      // Without this a proxy may buffer the whole response and defeat streaming entirely.
      'X-Accel-Buffering': 'no',
      'X-IM-Mode': provider.mode,
    });

    // The router resolves a handler as `controller[name][method]` and calls it detached,
    // so `this` is undefined by the time it runs. These are module functions for that
    // reason, not for style.
    if (provider.mode === 'demo') {
      streamDemo(ctx);
      return;
    }
    void streamProvider(ctx, provider, messages);
    req.on('close', () => {
      res.end();
    });
  }
}
