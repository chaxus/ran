import { resolveProvider } from '@/app/lib/provider';
import type { LiveProvider } from '@/app/lib/provider';
import type { Context } from '@/app/types/index';

/** One turn of the conversation, as the client sends it and the provider expects it. */
interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  /**
   * A plain string for a text-only turn, or the parts a multimodal one carries. Forwarded
   * as it arrives: which shapes a model accepts is between the client and the provider, and
   * a proxy that narrowed this would have to be changed for every new part type.
   */
  content: unknown;
  /** Present on an assistant message that asked for tools, and on the results that answer it. */
  tool_calls?: unknown;
  tool_call_id?: string;
  name?: string;
}

const POEM = [
  '## 春江花月夜',
  '',
  '春江潮水连海平，海上明月共潮生。',
  '',
  '滟滟随波千万里，何处春江无月明。',
  '',
  '江流宛转绕芳甸，月照花林皆似霰。',
  '',
  '空里流霜不觉飞，汀上白沙看不见。',
  '',
  '江天一色无纤尘，皎皎空中孤月轮。',
  '',
  '> 江畔何人初见月？江月何年初照人？',
  '',
  '人生代代无穷已，江月年年望相似。',
  '',
  '不知江月待何人，但见长江送流水。',
  '',
].join('\n');

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
 * Pulls the human-readable part out of a provider's error body.
 *
 * Every OpenAI-compatible provider answers a rejection with `{"error":{"message":…}}`, and
 * showing the envelope around it asks the reader to parse JSON to find the one sentence
 * that tells them what to do. A body in some other shape is passed through as-is, truncated,
 * rather than dropped — an unrecognised error is still better than none.
 *
 * @param body The raw response body.
 * @returns The message to show.
 */
export function extractMessage(body: string): string {
  try {
    const parsed = JSON.parse(body) as { error?: { message?: unknown } };
    const message = parsed.error?.message;
    if (typeof message === 'string' && message !== '') return message;
  } catch {
    // Not JSON; fall through to the raw body.
  }
  return body.slice(0, 500);
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
async function streamProvider(
  ctx: Context,
  provider: LiveProvider,
  messages: ChatMessage[],
  tools: unknown[] | undefined,
): Promise<void> {
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
      body: JSON.stringify({
        model: provider.model,
        messages,
        stream: true,
        stream_options: { include_usage: true },
        // Omitted rather than sent empty: a provider that receives `tools: []` may reject the
        // request outright, and one that does not still pays for the field.
        ...(tools === undefined || tools.length === 0 ? {} : { tools, tool_choice: 'auto' }),
      }),
      signal: abort.signal,
    });

    if (!upstream.ok || upstream.body === null) {
      // The provider's own message is the useful one — a key that expired, a model that
      // cannot read images. Surfacing it beats a generic failure the reader cannot act on,
      // but the reader should not have to read JSON to find it either.
      const body = await upstream.text().catch(() => '');
      send({ error: { status: upstream.status, message: extractMessage(body) || upstream.statusText } });
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
/**
 * Streams a single tool call, so the demo shows the agent loop rather than only a monologue.
 *
 * A clone with no key otherwise never sees a tool card at all — the one feature that
 * separates this from a chat box. It answers with `get_current_time` because that tool runs
 * entirely in the browser: no network, no key, and the result is real.
 *
 * @param ctx Request context.
 * @param id Stable id for this response's chunks.
 */
function streamDemoToolCall(ctx: Context, id: string): void {
  const { res } = ctx;
  const send = sender((chunk) => res.write(chunk));
  const call = {
    index: 0,
    id: `${id}-call`,
    type: 'function',
    function: { name: 'get_current_time', arguments: '{}' },
  };
  send({ id, object: 'chat.completion.chunk', choices: [{ index: 0, delta: { content: '我先看一下现在几点。' } }] });
  send({ id, object: 'chat.completion.chunk', choices: [{ index: 0, delta: { tool_calls: [call] } }] });
  send({
    id,
    object: 'chat.completion.chunk',
    choices: [{ index: 0, delta: {}, finish_reason: 'tool_calls' }],
    usage: { completion_tokens: 12 },
  });
  send('[DONE]');
  res.end();
}

/**
 * Whether this demo turn should answer with a tool call rather than with the poem.
 *
 * Only on a request that offered tools — the compaction summariser sends none, and it wants
 * prose — and only while nothing has come back from one yet, which is what stops the loop
 * after the client feeds the result back.
 *
 * @param messages The conversation as sent.
 * @param tools The tools offered, if any.
 * @returns Whether to call a tool.
 */
export function demoShouldCallTool(messages: readonly ChatMessage[], tools: unknown[] | undefined): boolean {
  return tools !== undefined && tools.length > 0 && !messages.some((message) => message.role === 'tool');
}

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

/** How much of a fetched page is worth returning; a model reads text, not a whole site. */
const FETCH_LIMIT = 200_000;
/** A page that has not answered in this long is not going to be useful mid-turn. */
const FETCH_TIMEOUT_MS = 15_000;

/**
 * Matches a raw-text element and everything inside it.
 *
 * Three details each cost something when missed:
 *
 * - **`\s*` before the closing `>`.** `</script >` is a valid end tag. A pattern requiring
 *   `</script>` exactly does not match it, so the whole element stays, the tag stripper
 *   below removes only the tags, and the script body reaches the model as prose.
 * - **`(?:…|$)`.** A truncated page can end mid-element. Without the alternative the match
 *   fails outright and the same leak happens.
 * - **`\b` after the name.** `<scriptfoo>` is not a script tag, and treating it as one
 *   would swallow the rest of the document.
 *
 * @param tag Element name.
 * @returns The pattern, global and case-insensitive.
 */
function rawTextElement(tag: string): RegExp {
  return new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?(?:</${tag}\\s*>|$)`, 'gi');
}

/**
 * Strips a fetched HTML document down to the text a model can read.
 *
 * Deliberately not a parser. Script and style content has to go — it is most of the bytes
 * and none of the meaning — and beyond that a model reads through markup perfectly well, so
 * anything more here is a dependency and a source of its own bugs.
 *
 * @param html The document.
 * @returns Its readable text.
 */
export function readableText(html: string): string {
  return (
    html
      .replace(rawTextElement('script'), ' ')
      .replace(rawTextElement('style'), ' ')
      // Comments before tags: a comment may contain `>`, and the tag stripper would end at
      // the first one and spill the rest of the comment into the text.
      .replace(/<!--[\s\S]*?(?:-->|$)/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Ampersand last: decoding it first would let `&amp;lt;` turn into a tag.
      .replace(/&amp;/g, '&')
      .replace(/[ \t\r\f]+/g, ' ')
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      .trim()
  );
}

/**
 * Whether a URL is one this server will fetch on a model's behalf.
 *
 * The model chooses this address, and the server reaches it with the server's own network
 * access — which on a developer machine includes localhost and whatever else is on the LAN.
 * Restricting the scheme and refusing an obviously internal host is the difference between a
 * fetch tool and a request forwarder pointed at the inside of the network.
 *
 * @param raw The address the model asked for.
 * @returns The parsed URL, or the reason it was refused.
 */
export function allowedUrl(raw: string): { url: URL } | { error: string } {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { error: '不是合法的地址' };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return { error: '只支持 http 和 https' };
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host === '::1' ||
    host.startsWith('127.') ||
    host.startsWith('10.') ||
    host.startsWith('192.168.') ||
    // The only one that stays a regex: 172.16–172.31 is a range, not a prefix.
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    host.startsWith('169.254.') ||
    host.startsWith('fc') ||
    host.startsWith('fd')
  ) {
    return { error: '不允许访问内网地址' };
  }
  return { url };
}

export default class IMController {
  /**
   * Fetches one page for the client's `fetch_url` tool.
   *
   * A browser cannot fetch a third-party page from a page, so the tool asks the server. The
   * address comes from the model, which is why {@link allowedUrl} decides what may be
   * reached before anything is opened.
   *
   * @param ctx Request context.
   */
  async fetch(ctx: Context): Promise<void> {
    const { res } = ctx;
    const { url: raw } = ctx.request.body as { url?: string };
    const reply = (status: number, payload: unknown): void => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(payload));
    };

    const checked = allowedUrl(typeof raw === 'string' ? raw : '');
    if ('error' in checked) {
      reply(400, { error: checked.error });
      return;
    }

    try {
      const response = await globalThis.fetch(checked.url, {
        headers: { 'user-agent': 'ran-im/1.0 (+tool fetch_url)', accept: 'text/html,text/plain;q=0.9,*/*;q=0.5' },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        redirect: 'follow',
      });
      if (!response.ok) {
        reply(200, { error: `${response.status} ${response.statusText}` });
        return;
      }
      const body = (await response.text()).slice(0, FETCH_LIMIT);
      const type = response.headers.get('content-type') ?? '';
      reply(200, { text: type.includes('html') ? readableText(body) : body });
    } catch (error) {
      reply(200, { error: error instanceof Error ? error.message : String(error) });
    }
  }

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
    const body = ctx.request.body as { messages?: ChatMessage[]; question?: string; tools?: unknown[] };
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
      // The client compacts against this. It is a deployment fact — which model is
      // configured — and a browser that guessed would compact a conversation that fits or
      // fail to compact one that does not.
      'X-IM-Context-Limit': String(provider.contextLimit),
    });

    // The router resolves a handler as `controller[name][method]` and calls it detached,
    // so `this` is undefined by the time it runs. These are module functions for that
    // reason, not for style.
    if (provider.mode === 'demo') {
      if (demoShouldCallTool(messages, body.tools)) streamDemoToolCall(ctx, `demo-${Date.now()}`);
      else streamDemo(ctx);
      return;
    }
    void streamProvider(ctx, provider, messages, body.tools);
    req.on('close', () => {
      res.end();
    });
  }
}
