import { afterEach, describe, expect, it, vi } from 'vitest';
import { isImageSize, report } from '@/utils';

const g = globalThis as unknown as Record<string, unknown>;
const saved: Array<[string, PropertyDescriptor | undefined]> = [];

const define = (key: string, value: unknown): void => {
  saved.push([key, Object.getOwnPropertyDescriptor(g, key)]);
  Object.defineProperty(g, key, { value, configurable: true, writable: true });
};

afterEach(() => {
  while (saved.length > 0) {
    const [key, descriptor] = saved.pop() as [string, PropertyDescriptor | undefined];
    if (descriptor) Object.defineProperty(g, key, descriptor);
    else delete g[key];
  }
});

describe('report', () => {
  /** 记录 <img> 兜底是否被走到 */
  const trackImages = (): { srcs: string[] } => {
    const srcs: string[] = [];
    define('document', {});
    define(
      'Image',
      class {
        width = 0;
        height = 0;
        set src(value: string) {
          srcs.push(value);
        }
      },
    );
    return { srcs };
  };

  it('uses sendBeacon when it is available and succeeds', () => {
    const sendBeacon = vi.fn(() => true);
    define('navigator', { sendBeacon });
    define('Blob', class {});
    const { srcs } = trackImages();

    expect(report({ url: '/collect', payload: { a: 1 } })).toBe(true);
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(srcs).toEqual([]);
  });

  it('falls back to the image beacon when sendBeacon is missing', () => {
    // 回归：旧实现按 `typeof navigator !== 'undefined'` 分支，而 navigator 在所有浏览器里都存在，
    // 图片兜底因此永远走不到，sendBeacon 缺失时上报被静默丢弃
    define('navigator', {});
    const { srcs } = trackImages();

    expect(report({ url: '/collect', payload: { a: 1 } })).toBe(true);
    expect(srcs).toHaveLength(1);
    expect(srcs[0]).toContain('/collect?');
    expect(srcs[0]).toContain('a=1');
  });

  it('falls back when sendBeacon returns false (queue over quota)', () => {
    const sendBeacon = vi.fn(() => false);
    define('navigator', { sendBeacon });
    define('Blob', class {});
    const { srcs } = trackImages();

    expect(report({ url: '/collect', payload: {} })).toBe(true);
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(srcs).toHaveLength(1);
  });

  it('reports failure when no channel can send', () => {
    define('navigator', {});
    expect(report({ url: '/collect', payload: {} })).toBe(false);
  });

  it('reports failure when there is no url to send to', () => {
    define('navigator', { sendBeacon: vi.fn(() => true) });
    expect(report({ payload: {} })).toBe(false);
  });
});

describe('isImageSize', () => {
  /** 可控的 Image 替身：记录 objectURL 生命周期，手动触发 load / error */
  const setupImage = (): { created: string[]; revoked: string[]; fire: (event: 'load' | 'error') => void } => {
    const created: string[] = [];
    const revoked: string[] = [];
    let instance: { onload?: () => void; onerror?: () => void } | null = null;
    const dimensions = { width: 100, height: 50 };

    define('window', {
      URL: {
        createObjectURL: (): string => {
          const url = `blob:${created.length}`;
          created.push(url);
          return url;
        },
        revokeObjectURL: (url: string): void => void revoked.push(url),
      },
    });
    define(
      'Image',
      class {
        width = dimensions.width;
        height = dimensions.height;
        onload?: () => void;
        onerror?: () => void;
        src = '';
        constructor() {
          instance = this;
        }
      },
    );
    return {
      created,
      revoked,
      fire: (event) => {
        if (event === 'load') instance?.onload?.();
        else instance?.onerror?.();
      },
    };
  };

  const file = {} as File;

  it('rejects outside a browser instead of throwing on window', async () => {
    // 回归：旧实现 reject 之后没有 return，继续访问 window，SSR 下直接抛 ReferenceError
    const promise = isImageSize(file, 100);
    await expect(promise).rejects.toThrow('browser-only');
  });

  it('matches on width alone', async () => {
    const { fire } = setupImage();
    const promise = isImageSize(file, 100);
    fire('load');
    await expect(promise).resolves.toBe(true);
  });

  it('requires BOTH dimensions to match when both are given', async () => {
    // 回归：旧实现后一个条件整个覆盖前一个，宽度形同虚设
    const { fire } = setupImage();
    const wrongWidth = isImageSize(file, 999, 50);
    fire('load');
    await expect(wrongWidth).resolves.toBe(false);

    const bothRight = isImageSize(file, 100, 50);
    fire('load');
    await expect(bothRight).resolves.toBe(true);
  });

  it('passes when neither dimension is constrained', async () => {
    const { fire } = setupImage();
    const promise = isImageSize(file);
    fire('load');
    await expect(promise).resolves.toBe(true);
  });

  it('rejects on a decode failure rather than hanging forever', async () => {
    const { fire } = setupImage();
    const promise = isImageSize(file, 100);
    fire('error');
    await expect(promise).rejects.toThrow('decode');
  });

  it('revokes the object URL on both success and failure', async () => {
    const { created, revoked, fire } = setupImage();
    const ok = isImageSize(file, 100);
    fire('load');
    await ok;

    const bad = isImageSize(file, 100);
    fire('error');
    await expect(bad).rejects.toThrow();

    expect(revoked).toEqual(created);
    expect(created).toHaveLength(2);
  });
});
