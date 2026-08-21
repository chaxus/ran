import type { Context } from '@/app/types/index';

const POEM =
  '春江花月夜\n春江潮水连海平，海上明月共潮生。\n滟滟随波千万里，何处春江无月明。\n江流宛转绕芳甸，月照花林皆似霰。\n空里流霜不觉飞，汀上白沙看不见。\n江天一色无纤尘，皎皎空中孤月轮。\n江畔何人初见月？江月何年初照人？\n人生代代无穷已，江月年年望相似。\n不知江月待何人，但见长江送流水。\n';

/** Characters per delta; a real provider's token is a few characters too. */
const CHUNK_SIZE = 3;
const INTERVAL_MS = 40;

export default class IMController {
  /**
   * Streams a canned answer as Server-Sent Events.
   *
   * The wire shape is the OpenAI-compatible one — `choices[].delta.content`, a terminal
   * `finish_reason`, a trailing `[DONE]` sentinel — so the client's mapping onto
   * `ranuts/stream` is a real mapping rather than an identity function, and so this route
   * can be swapped for an actual provider without touching the client.
   *
   * @param ctx Request context.
   */
  dialog(ctx: Context): void {
    const { res, req } = ctx;
    const { question } = ctx.request.body;

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      // Without this a proxy may buffer the whole response and defeat streaming entirely.
      'X-Accel-Buffering': 'no',
    });

    /**
     * Writes one event with the framing SSE actually requires.
     *
     * The previous implementation declared `text/event-stream` and then wrote bare JSON
     * with no `data:` prefix and no blank-line terminator, so any client that parsed the
     * protocol saw nothing and the one that did not broke as soon as two writes coalesced
     * into a single chunk.
     *
     * @param payload Event body, or the raw `[DONE]` sentinel.
     */
    const send = (payload: unknown): void => {
      res.write(`data: ${typeof payload === 'string' ? payload : JSON.stringify(payload)}\n\n`);
    };

    const id = `chat-${Date.now()}`;
    let sent = 0;

    const timer = setInterval(() => {
      // Deltas, not the accumulated answer. Resending the whole text on every tick costs
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
        usage: { prompt_tokens: question?.length ?? 0, completion_tokens: POEM.length },
      });
      send('[DONE]');
      res.end();
    }, INTERVAL_MS);

    req.on('close', () => {
      clearInterval(timer);
      res.end();
    });
  }
}
