import { isIP } from 'node:net';

/** Only globally routable addresses may be used by the server-side page fetcher. */
export function isPublicAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 4) {
    const [a, b, c] = address.split('.').map(Number);
    return !(
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && (b === 168 || (b === 0 && (c === 0 || c === 2)))) ||
      (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
      (a === 203 && b === 0 && c === 113)
    );
  }
  if (family === 6) {
    const canonical = new URL(`http://[${address}]/`).hostname.slice(1, -1);
    if (canonical.startsWith('::ffff:')) {
      const words = canonical
        .slice(7)
        .split(':')
        .map((word) => Number.parseInt(word, 16));
      return isPublicAddress(`${words[0] >> 8}.${words[0] & 255}.${words[1] >> 8}.${words[1] & 255}`);
    }
    const [first, second = 0] = canonical.split(':').map((word) => Number.parseInt(word || '0', 16));
    // Global unicast only; exclude transition, benchmarking and documentation networks.
    return (
      first >= 0x2000 &&
      first <= 0x3fff &&
      first !== 0x2002 &&
      first !== 0x3fff &&
      !(first === 0x2001 && (second < 0x200 || second === 0xdb8))
    );
  }
  return false;
}

export function allowedUrl(raw: string): { url: URL } | { error: string } {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { error: '不是合法的地址' };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return { error: '只支持 http 和 https' };
  if (url.username || url.password) return { error: '不允许地址携带凭据' };
  const host = url.hostname
    .toLowerCase()
    .replace(/^\[|\]$/g, '')
    .replace(/\.$/, '');
  if (host === 'localhost' || host.endsWith('.localhost') || (isIP(host) && !isPublicAddress(host))) {
    return { error: '不允许访问内网地址' };
  }
  return { url };
}
