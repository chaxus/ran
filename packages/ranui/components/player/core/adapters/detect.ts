import type { EngineFormat } from './types';

const EXTENSION_MAP: Record<string, EngineFormat> = {
  m3u8: 'hls',
  mpd: 'dash',
  flv: 'flv',
  ts: 'flv', // mpegts.js also demuxes raw MPEG-TS, not just FLV containers
};

const VALID_HINTS: ReadonlySet<string> = new Set(['hls', 'dash', 'flv', 'native']);

/**
 * `typeHint` (the player's `format` attribute) always wins when it's one of
 * the known engine names — an explicit override for extensionless/signed
 * streaming URLs that can't be sniffed. Otherwise falls back to matching the
 * URL's extension (query string/hash stripped first), defaulting to `native`
 * for anything unrecognized (including no `src` at all).
 */
export function detectFormat(src: string, typeHint?: string): EngineFormat {
  const hint = (typeHint || '').trim().toLowerCase();
  if (VALID_HINTS.has(hint)) return hint as EngineFormat;
  if (!src) return 'native';
  const withoutQuery = src.split(/[?#]/)[0];
  const ext = withoutQuery.split('.').pop()?.toLowerCase() || '';
  return EXTENSION_MAP[ext] || 'native';
}
