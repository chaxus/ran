/**
 * Where the model comes from.
 *
 * The key stays on the server. A browser holding it would ship it to every visitor, and no
 * amount of care in the client changes that — so the client talks to this app, and this app
 * talks to the provider.
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * How large a context window the deployment's model has.
 *
 * A deployment fact, not a client one: the browser does not know which model is configured,
 * and a client that guessed would either compact a conversation that fits or fail to compact
 * one that does not. Reported to the client in `X-IM-Context-Limit`.
 */
export interface ContextBudget {
  /** Tokens the model accepts in one request. */
  contextLimit: number;
}

/** A configured provider. */
export interface LiveProvider extends ContextBudget {
  mode: 'live';
  apiKey: string;
  /** Base URL with no trailing slash; `/chat/completions` is appended. */
  baseURL: string;
  model: string;
}

/** No key configured: the canned answer, so a fresh clone still runs. */
export interface DemoProvider extends ContextBudget {
  mode: 'demo';
}

export type Provider = LiveProvider | DemoProvider;

/** Default endpoint, matching the key name checked first. */
const DEFAULT_BASE_URL = 'https://api.deepseek.com/v1';
const DEFAULT_MODEL = 'deepseek-chat';
/**
 * DeepSeek's published window, and a conservative floor for anything else.
 *
 * Set `IM_CONTEXT_LIMIT` when pointing this at a model with a different one. Guessing high
 * means the provider refuses a request the client believed would fit; guessing low means
 * compacting earlier than necessary, which is the survivable direction.
 */
const DEFAULT_CONTEXT_LIMIT = 65_536;

/**
 * Reads the configured context window.
 *
 * @returns The limit in tokens, falling back to {@link DEFAULT_CONTEXT_LIMIT} when unset or
 *   unusable — a typo in an environment variable must not silently disable compaction.
 */
function resolveContextLimit(): number {
  const raw = Number(process.env.IM_CONTEXT_LIMIT ?? '');
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : DEFAULT_CONTEXT_LIMIT;
}

let loaded = false;

/**
 * Loads `.env` from the repository root, once.
 *
 * `process.loadEnvFile` is Node's own, so this needs no dependency. It throws when the file
 * is absent, which is the normal case for someone who only wants the demo, so existence is
 * checked rather than the throw caught — a caught throw here would also swallow a genuine
 * parse error in a file that does exist.
 */
function loadEnvOnce(): void {
  if (loaded) return;
  loaded = true;
  for (const candidate of ['.env', '../../.env']) {
    const path = resolve(process.cwd(), candidate);
    if (existsSync(path)) {
      process.loadEnvFile(path);
      return;
    }
  }
}

/**
 * Resolves the provider from the environment.
 *
 * `IM_*` wins over `DEEPSEEK_*` so a machine that already has a DeepSeek key for something
 * else can point this one demo elsewhere without disturbing it.
 *
 * @returns The configured provider, or the demo when no key is set.
 */
export function resolveProvider(): Provider {
  loadEnvOnce();
  const contextLimit = resolveContextLimit();
  const apiKey = process.env.IM_API_KEY ?? process.env.DEEPSEEK_API_KEY ?? '';
  if (apiKey.trim() === '') return { mode: 'demo', contextLimit };
  const baseURL = (process.env.IM_BASE_URL ?? process.env.DEEPSEEK_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
  return {
    mode: 'live',
    contextLimit,
    apiKey: apiKey.trim(),
    baseURL,
    model: process.env.IM_MODEL ?? process.env.DEEPSEEK_MODEL ?? DEFAULT_MODEL,
  };
}
