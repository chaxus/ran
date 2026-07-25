import { querystring } from '@/utils/obj';
import { getCookie, getWindow } from '@/utils/bom';
import { randomString } from '@/utils/str';

export interface BeaconPayload {
  /** Endpoint to send to. Falls back to whatever `setReportUrl` configured. */
  url?: string;
  type?: string;
  payload: Record<string, unknown>;
}

export interface ReportConfig {
  /** Default endpoint for every `report()` that does not pass its own `url` */
  url?: string;
  /** Cookie holding the current user id, included in `createData()`. Unset means no user id. */
  userIdCookie?: string;
}

const config: ReportConfig = {};

/**
 * @description: Configure the default reporting endpoint (and optionally the cookie holding
 * the user id). Call it once at startup so `report({ payload })` needs no `url`.
 *
 * There is deliberately no default. The previous version derived one from `getHost()`, which
 * built a URL from a domain hard-coded to this repo's author — and a leftover edit had already
 * degraded it to the literal `'//log.'`, so every report without an explicit `url` was posted
 * to an unreachable host. A library cannot know where your telemetry belongs; it has to be told.
 *
 * @param {ReportConfig} next merged into the current configuration
 * @example
 * ```ts
 * setReportUrl({ url: 'https://telemetry.example.com/collect', userIdCookie: 'uid' });
 * report({ payload: { event: 'page_view' } });
 * ```
 */
export const setReportUrl = (next: ReportConfig | string): void => {
  if (typeof next === 'string') config.url = next;
  else Object.assign(config, next);
};

/** @description: The currently configured reporting endpoint, or `''` when none was set */
export const getReportUrl = (): string => config.url ?? '';

/** sendBeacon transport; returns false when unavailable or refused (queue over quota) so the caller can fall back */
const sendBeacon = ({ url = '', type = 'application/json; charset=UTF-8', payload = {} }: BeaconPayload): boolean => {
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  if (typeof navigator === 'undefined' || !navigator.sendBeacon || !url) return false;
  const param = new Blob([JSON.stringify(payload)], { type });
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  return navigator.sendBeacon(url, param);
};

/** 1x1 image transport: the oldest, most universal fallback — no CORS needed, and it usually survives unload */
const sendImage = ({ url = '', payload = {} }: { url?: string; payload?: Record<string, unknown> }): boolean => {
  if (typeof document === 'undefined' || !url) return false;
  const image = new Image();
  image.width = 1;
  image.height = 1;
  image.src = `${url}?${querystring(payload)}`;
  return true;
};

/**
 * @description: Send a telemetry beacon. Prefers `navigator.sendBeacon` (does not block
 * unload, delivery is the browser's job) and falls back to a 1x1 image.
 *
 * The fallback is chosen by whether **sendBeacon itself is available and succeeded**, not by
 * whether `navigator` exists — `navigator` exists in every browser, so testing that made the
 * image fallback unreachable and silently dropped the report whenever sendBeacon was missing
 * or returned false.
 *
 * @param {BeaconPayload} options
 * @return {boolean} whether some transport accepted it
 */
export const report = ({ url, type = 'application/json; charset=UTF-8', payload = {} }: BeaconPayload): boolean => {
  const requestUrl = url || getReportUrl();
  if (!requestUrl) return false;
  return sendBeacon({ url: requestUrl, type, payload }) || sendImage({ url: requestUrl, payload });
};

/**
 * @description: Build the standard envelope that accompanies a report — page URL, referrer,
 * viewport, user agent, a random event id and a timestamp. Merge your own fields on top.
 *
 * The user id comes from the cookie named by `setReportUrl({ userIdCookie })`; without that
 * configuration no user id is included. (It used to read a cookie named after this repo's
 * author's own deployment, which was never going to exist in anyone else's app.)
 *
 * @param {Record<string, unknown>} params extra fields, applied last
 * @return {Record<string, unknown>} empty object under SSR
 */
export function createData(params: Record<string, unknown> = {}): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  const { width, height } = getWindow();
  return {
    id: randomString(),
    path: window.location.href,
    time: Date.now(),
    referrer: document.referrer,
    ratio: `${width}x${height}`,
    userAgent: window.navigator.userAgent,
    ...(config.userIdCookie ? { userId: getCookie(config.userIdCookie) } : {}),
    ...params,
  };
}
