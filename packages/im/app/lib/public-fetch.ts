import { lookup } from 'node:dns/promises';
import type { LookupAddress } from 'node:dns';
import { request as httpRequest } from 'node:http';
import type { IncomingMessage } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { isIP } from 'node:net';
import { pipeline } from 'node:stream/promises';
import { createGunzip, createInflate, createBrotliDecompress } from 'node:zlib';
import { allowedUrl, isPublicAddress } from './public-url';

async function resolveAddress(host: string, signal: AbortSignal): Promise<LookupAddress> {
  signal.throwIfAborted();
  const addresses = isIP(host)
    ? [{ address: host, family: isIP(host) }]
    : await new Promise<LookupAddress[]>((resolve, reject) => {
        const abort = (): void => reject(signal.reason);
        signal.addEventListener('abort', abort, { once: true });
        lookup(host, { all: true })
          .then(resolve, reject)
          .finally(() => signal.removeEventListener('abort', abort));
      });
  signal.throwIfAborted();
  if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) {
    throw new Error('不允许访问内网地址');
  }
  return addresses[0];
}

/** Connect to the validated IP while preserving Host and TLS certificate verification. */
async function open(url: URL, signal: AbortSignal): Promise<IncomingMessage> {
  const host = url.hostname.replace(/^\[|\]$/g, '');
  const address = await resolveAddress(host, signal);
  const request = url.protocol === 'https:' ? httpsRequest : httpRequest;
  const options = {
    hostname: address.address,
    family: address.family,
    servername: isIP(host) ? undefined : host,
    agent: false as const,
    signal,
    headers: {
      host: url.host,
      'user-agent': 'ran-im/1.0 (+tool fetch_url)',
      accept: 'text/html,text/plain;q=0.9,*/*;q=0.5',
      'accept-encoding': 'gzip, deflate, br',
    },
  };
  return new Promise((resolve, reject) => {
    const req = request(url, options, resolve);
    req.on('error', reject);
    req.end();
  });
}

/** Bound decompressed bytes and cancel the response as soon as the limit is reached. */
async function limitedText(response: IncomingMessage, limit: number): Promise<string> {
  const encoding = response.headers['content-encoding'];
  const decompress =
    encoding === 'gzip'
      ? createGunzip()
      : encoding === 'deflate'
        ? createInflate()
        : encoding === 'br'
          ? createBrotliDecompress()
          : undefined;
  if (encoding && encoding !== 'identity' && !decompress) throw new Error('不支持的响应压缩格式');
  const source = decompress ?? response;
  if (decompress) void pipeline(response, decompress).catch(() => {});
  const decoder = new TextDecoder();
  let remaining = limit;
  let text = '';
  try {
    for await (const chunk of source) {
      const bytes = chunk as Buffer;
      text += decoder.decode(bytes.subarray(0, remaining), { stream: true });
      remaining -= Math.min(bytes.length, remaining);
      // Do not flush an incomplete UTF-8 character when intentionally truncating.
      if (remaining === 0) return text;
    }
    return text + decoder.decode();
  } finally {
    source.destroy();
    response.destroy();
  }
}

/** Every redirect gets a new validation and a connection pinned to its DNS result. */
export async function fetchPublicPage(
  initial: URL,
  signal: AbortSignal,
  limit: number,
): Promise<{ body: string; type: string }> {
  let url = initial;
  for (let redirects = 0; redirects <= 5; redirects++) {
    const checked = allowedUrl(url.href);
    if ('error' in checked) throw new Error(checked.error);
    const response = await open(checked.url, signal);
    const status = response.statusCode ?? 0;
    if ([301, 302, 303, 307, 308].includes(status)) {
      response.destroy();
      if (!response.headers.location) throw new Error('重定向缺少目标地址');
      url = new URL(response.headers.location, url);
      continue;
    }
    if (status < 200 || status >= 300) {
      response.destroy();
      throw new Error(`${status} ${response.statusMessage ?? ''}`.trim());
    }
    try {
      return { body: await limitedText(response, limit), type: response.headers['content-type'] ?? '' };
    } finally {
      response.destroy();
    }
  }
  throw new Error('重定向次数过多');
}
