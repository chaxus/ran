import type { ToolCallView, ToolResultView } from 'ranui';

/**
 * The tools the model may call, and everything each of them needs to be shown.
 *
 * A tool is four things that must stay together, which is why they are one record rather
 * than three parallel tables:
 *
 * - **`schema`** — what the provider is told the tool accepts. This is the only part that
 *   crosses the wire to the model.
 * - **`call` / `result`** — the render intent. Both are *pure functions of their arguments*,
 *   as `ToolCallView` requires: they run once while the call is live and again every time a
 *   stored conversation is replayed, so a view that read the clock or the filesystem would
 *   make a replay disagree with what the user saw. `call` never reads the result — at the
 *   moment it renders, there is none.
 * - **`run`** — the executor, which is the only part allowed to have effects. Its return
 *   value is what the model reads, so it is written for a model: facts, no prose about the
 *   UI, and a failure reported as a sentence the model can act on rather than thrown.
 *
 * Adding a tool means adding one entry here. Nothing else in the client knows the set.
 */

/** One argument object as the model sent it, before any tool has looked at it. */
export type ToolArgs = Record<string, unknown>;

/** JSON Schema for one tool's parameters, as the provider expects it. */
export interface ToolSchema {
  type: 'object';
  properties: Record<string, { type: string; description: string; enum?: string[] }>;
  required?: string[];
}

/** One callable tool. */
export interface ToolDefinition {
  name: string;
  /** Read by the model to decide when to call it, so it says *when*, not *how*. */
  description: string;
  schema: ToolSchema;
  /**
   * The pending card.
   *
   * @param args The arguments the model sent, which may be anything at all — the model
   *   writes them, and a malformed call must still render.
   * @returns What the call looks like before it has a result.
   */
  call: (args: ToolArgs) => ToolCallView;
  /**
   * The completed card.
   *
   * @param args The arguments the call was made with.
   * @param output What {@link ToolDefinition.run} returned.
   * @returns What the finished call looks like.
   */
  result: (args: ToolArgs, output: string) => ToolResultView;
  /**
   * Performs the call.
   *
   * @param args The arguments the model sent.
   * @param signal Aborted when the reader stops the exchange. A tool that waits on anything
   *   — a network call, a subprocess — must pass this on, or Stop will leave it running and
   *   the answer it produces will arrive in a conversation that moved on without it.
   * @returns The text the model reads back. Throwing is reserved for a genuine defect;
   *   an expected failure is a returned sentence, because the model can act on that.
   */
  run: (args: ToolArgs, signal: AbortSignal) => Promise<string>;
}

/**
 * Reads one string argument.
 *
 * The model writes these, so a number where a string was declared, or an absent required
 * field, is an ordinary event rather than a corrupted program.
 *
 * @param args The argument object.
 * @param key Which argument to read.
 * @returns Its value as a string, or an empty string when it is absent or not a scalar.
 */
function str(args: ToolArgs, key: string): string {
  const value = args[key];
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

/** How much of a fetched page is worth sending back; beyond this it is padding a context window. */
const FETCH_LIMIT = 8000;

const currentTime: ToolDefinition = {
  name: 'get_current_time',
  description:
    'Return the current date and time. Call this whenever the answer depends on what time it is now; you have no clock of your own.',
  schema: {
    type: 'object',
    properties: {
      timezone: {
        type: 'string',
        description: "IANA timezone name such as Asia/Shanghai. Omit to use the user's own timezone.",
      },
    },
  },
  call: (args) => {
    const zone = str(args, 'timezone');
    return {
      card: 'generic',
      title: '读取当前时间',
      kind: 'read',
      summary: zone,
      input: zone === '' ? undefined : { 时区: zone },
    };
  },
  result: (_args, output) => ({ card: 'generic', content: output }),
  run: async (args) => {
    const zone = str(args, 'timezone');
    try {
      // `timeZone: ''` is not the same as omitting it — the browser rejects an empty string.
      const options: Intl.DateTimeFormatOptions = {
        dateStyle: 'full',
        timeStyle: 'long',
        ...(zone === '' ? {} : { timeZone: zone }),
      };
      return new Intl.DateTimeFormat('zh-CN', options).format(new Date());
    } catch {
      // A timezone the model invented. Naming it back is what lets the model retry with a
      // real one instead of assuming the tool is broken.
      return `未知时区 ${zone}。请使用 IANA 名称，例如 Asia/Shanghai。`;
    }
  },
};

const fetchUrl: ToolDefinition = {
  name: 'fetch_url',
  description:
    'Fetch a web page and return its readable text. Call this for anything you cannot answer from memory, or when the user gives you a link.',
  schema: {
    type: 'object',
    properties: { url: { type: 'string', description: 'Absolute http or https URL.' } },
    required: ['url'],
  },
  call: (args) => ({
    card: 'generic',
    title: '抓取网页',
    kind: 'search',
    summary: str(args, 'url'),
    input: { 地址: str(args, 'url') },
  }),
  result: (_args, output) => ({ card: 'generic', content: output }),
  run: async (args, signal) => {
    const url = str(args, 'url');
    if (url === '') return '没有提供地址。';
    // Through this app's own server: a browser cannot fetch a third-party page from a page,
    // and the same-origin policy is not something a tool gets to opt out of.
    const response = await fetch('/api/im/fetch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url }),
      signal,
    });
    const body = (await response.json()) as { text?: string; error?: string };
    if (typeof body.error === 'string') return `抓取失败：${body.error}`;
    const text = body.text ?? '';
    return text.length > FETCH_LIMIT ? `${text.slice(0, FETCH_LIMIT)}\n\n[已截断，共 ${text.length} 字符]` : text;
  },
};

/** Prefix marking a {@link writeNote} result that carries the content it replaced. */
const REPLACED = '已覆盖，原内容：\n';

/** Notes the model has written this page, so a rewrite can show what it replaced. */
const notes = new Map<string, string>();

const writeNote: ToolDefinition = {
  name: 'write_note',
  description:
    'Save a named note for the user, replacing any note of that name. Use it when the user asks you to write something down, draft text, or keep a result for later.',
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Short file-like name, such as plan.md.' },
      content: { type: 'string', description: 'The full new content of the note.' },
    },
    required: ['name', 'content'],
  },
  // `oldText: null` even for a rewrite: a call view may not read `notes`, because a replayed
  // conversation has an empty map and would render a different diff than the user saw. The
  // result view is where the prior content legitimately appears — it is derived from what
  // the call returned, which is recorded.
  call: (args) => ({
    card: 'diff',
    title: `写入 ${str(args, 'name')}`,
    // The first line of what is being written. Left to derive, the collapsed row would read
    // `写入 notes.md · notes.md` — the path twice and the content not at all.
    summary: str(args, 'content').split('\n', 1)[0] ?? '',
    diffs: [{ path: str(args, 'name'), oldText: null, newText: str(args, 'content') }],
  }),
  result: (args, output) => {
    const previous = output.startsWith(REPLACED) ? output.slice(REPLACED.length) : null;
    return { card: 'diff', diffs: [{ path: str(args, 'name'), oldText: previous, newText: str(args, 'content') }] };
  },
  run: async (args) => {
    const name = str(args, 'name');
    if (name === '') return '没有提供名称。';
    const previous = notes.get(name);
    notes.set(name, str(args, 'content'));
    // The prior content is carried in the result so the result view can diff against it
    // without reading the map, which replay would not have.
    return previous === undefined ? `已新建 ${name}。` : `${REPLACED}${previous}`;
  },
};

/** Every tool, by name. */
export const TOOLS: ReadonlyMap<string, ToolDefinition> = new Map(
  [currentTime, fetchUrl, writeNote].map((tool) => [tool.name, tool]),
);

/**
 * The tool list as the provider's request body wants it.
 *
 * @returns One entry per tool, in the OpenAI-compatible envelope.
 */
export function toolsForRequest(): unknown[] {
  return [...TOOLS.values()].map((tool) => ({
    type: 'function',
    function: { name: tool.name, description: tool.description, parameters: tool.schema },
  }));
}

/**
 * Parses the arguments of one call.
 *
 * The model writes this JSON, and a truncated response leaves it half-written; an
 * unparseable call is a call with no arguments rather than a thrown page.
 *
 * @param raw The raw `arguments` text.
 * @returns The arguments, or an empty object when they cannot be read.
 */
export function parseToolArgs(raw: string): ToolArgs {
  if (raw.trim() === '') return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? (parsed as ToolArgs) : {};
  } catch {
    return {};
  }
}

/** What one executed call produced. */
export interface ToolOutcome {
  output: string;
  failed: boolean;
}

/**
 * Runs one call, whatever the model asked for.
 *
 * A name no tool has, and a tool that threw, both come back as text: the model is mid-turn
 * and its next move depends on reading what went wrong, so there is nothing here worth
 * failing the conversation over.
 *
 * @param name The tool the model named.
 * @param args Its parsed arguments.
 * @param signal Aborted when the reader stops the exchange.
 * @returns The text the model reads back, and whether it describes a failure.
 */
export async function runTool(name: string, args: ToolArgs, signal: AbortSignal): Promise<ToolOutcome> {
  const tool = TOOLS.get(name);
  if (tool === undefined) return { output: `没有名为 ${name} 的工具。`, failed: true };
  try {
    return { output: await tool.run(args, signal), failed: false };
  } catch (error) {
    // An abort is the reader pressing Stop, not a failure the model should read about — the
    // caller drops the whole exchange, and a sentence about it would only be sent back if it
    // did not.
    if (signal.aborted) return { output: '已取消。', failed: true };
    return { output: `工具执行失败：${error instanceof Error ? error.message : String(error)}`, failed: true };
  }
}
