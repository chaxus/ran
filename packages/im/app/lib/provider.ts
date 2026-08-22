/**
 * Where the model comes from.
 *
 * The key stays on the server. A browser holding it would ship it to every visitor, and no
 * amount of care in the client changes that — so the client talks to this app, and this app
 * talks to the provider.
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/** A configured provider. */
export interface LiveProvider {
  mode: 'live';
  apiKey: string;
  /** Base URL with no trailing slash; `/chat/completions` is appended. */
  baseURL: string;
  model: string;
}

/** No key configured: the canned answer, so a fresh clone still runs. */
export interface DemoProvider {
  mode: 'demo';
}

export type Provider = LiveProvider | DemoProvider;

/** Default endpoint, matching the key name checked first. */
const DEFAULT_BASE_URL = 'https://api.deepseek.com/v1';
const DEFAULT_MODEL = 'deepseek-chat';

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
  const apiKey = process.env.IM_API_KEY ?? process.env.DEEPSEEK_API_KEY ?? '';
  if (apiKey.trim() === '') return { mode: 'demo' };
  const baseURL = (process.env.IM_BASE_URL ?? process.env.DEEPSEEK_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
  return {
    mode: 'live',
    apiKey: apiKey.trim(),
    baseURL,
    model: process.env.IM_MODEL ?? process.env.DEEPSEEK_MODEL ?? DEFAULT_MODEL,
  };
}
