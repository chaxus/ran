import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createData, getReportUrl, report, setReportUrl } from '@/utils';

const g = globalThis as unknown as Record<string, unknown>;
const saved: Array<[string, PropertyDescriptor | undefined]> = [];

const define = (key: string, value: unknown): void => {
  saved.push([key, Object.getOwnPropertyDescriptor(g, key)]);
  Object.defineProperty(g, key, { value, configurable: true, writable: true });
};

beforeEach(() => setReportUrl({ url: undefined, userIdCookie: undefined }));

afterEach(() => {
  while (saved.length > 0) {
    const [key, descriptor] = saved.pop() as [string, PropertyDescriptor | undefined];
    if (descriptor) Object.defineProperty(g, key, descriptor);
    else delete g[key];
  }
  setReportUrl({ url: undefined, userIdCookie: undefined });
});

describe('report endpoint configuration', () => {
  it('has no endpoint until one is configured', () => {
    expect(getReportUrl()).toBe('');
  });

  it('sends nothing when no endpoint is configured', () => {
    // 回归：旧实现回退到 getHost()，它返回字面量 '//log.' —— 一个不可达的 host，
    // 于是每条不带 url 的上报都被发往垃圾地址而不是明确失败
    const sendBeacon = vi.fn(() => true);
    define('navigator', { sendBeacon });
    define('Blob', class {});
    expect(report({ payload: { a: 1 } })).toBe(false);
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it('uses the configured endpoint for calls that omit url', () => {
    const sendBeacon = vi.fn(() => true);
    define('navigator', { sendBeacon });
    define('Blob', class {});
    setReportUrl('https://telemetry.example.com/collect');
    expect(getReportUrl()).toBe('https://telemetry.example.com/collect');
    expect(report({ payload: { a: 1 } })).toBe(true);
    expect(sendBeacon).toHaveBeenCalledWith('https://telemetry.example.com/collect', expect.anything());
  });

  it('lets a per-call url win over the configured one', () => {
    const sendBeacon = vi.fn(() => true);
    define('navigator', { sendBeacon });
    define('Blob', class {});
    setReportUrl({ url: 'https://default.example.com' });
    report({ url: 'https://override.example.com', payload: {} });
    expect(sendBeacon).toHaveBeenCalledWith('https://override.example.com', expect.anything());
  });
});

describe('createData', () => {
  const stubBrowser = (cookie = ''): void => {
    define('window', {
      location: { href: 'https://app.example.com/page' },
      navigator: { userAgent: 'test-agent' },
      innerWidth: 1280,
      innerHeight: 720,
      document: { cookie },
    });
    define('document', { referrer: 'https://ref.example.com', cookie });
    define('navigator', { userAgent: 'test-agent' });
  };

  it('returns an empty envelope under SSR', () => {
    expect(createData()).toEqual({});
  });

  it('collects the standard fields', () => {
    stubBrowser();
    const data = createData();
    expect(data).toMatchObject({
      path: 'https://app.example.com/page',
      referrer: 'https://ref.example.com',
      userAgent: 'test-agent',
    });
    expect(typeof data.time).toBe('number');
  });

  it('omits userId until a cookie name is configured', () => {
    // 回归：旧实现硬编码读取 'chaxus_prod' —— 这个仓库作者自己部署的 cookie 名，
    // 在任何其它应用里都不存在
    stubBrowser('uid=abc123');
    expect('userId' in createData()).toBe(false);

    setReportUrl({ userIdCookie: 'uid' });
    expect('userId' in createData()).toBe(true);
  });

  it('lets caller-supplied fields win', () => {
    stubBrowser();
    expect(createData({ path: 'custom' }).path).toBe('custom');
  });
});
