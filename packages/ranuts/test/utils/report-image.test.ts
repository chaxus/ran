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
  /** Records whether the <img> fallback was reached */
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
    // Regression: the old implementation branched on `typeof navigator !== 'undefined'`, and
    // navigator exists in every browser — so the image fallback was unreachable and reports
    // were silently dropped whenever sendBeacon was missing
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
  /** A controllable Image stand-in: tracks the objectURL's lifecycle and fires load / error by hand */
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
    // Regression: the old implementation did not return after reject, went on to touch window, and threw a ReferenceError under SSR
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
    // Regression: the later condition used to overwrite the earlier one, making the width check a no-op
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
