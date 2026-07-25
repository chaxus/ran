import { afterEach, describe, expect, it } from 'vitest';
import { readFileAsArrayBuffer, readFileAsDataURL, readFileAsText, readFileAsUint8Array } from '@/utils';

/** 最小 FileReader 替身：按 mode 决定回调走 load / error / abort 哪条出口 */
type Mode = 'load' | 'error' | 'abort';
let mode: Mode = 'load';
let payload: unknown = null;
const calls: string[] = [];

class FakeFileReader {
  result: unknown = null;
  error: Error | null = null;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onabort: (() => void) | null = null;

  private finish(): void {
    queueMicrotask(() => {
      if (mode === 'load') {
        this.result = payload;
        this.onload?.();
      } else if (mode === 'error') {
        this.error = new Error('disk failure');
        this.onerror?.();
      } else {
        this.onabort?.();
      }
    });
  }
  readAsArrayBuffer(): void {
    calls.push('arrayBuffer');
    this.finish();
  }
  readAsText(_blob: unknown, encoding?: string): void {
    calls.push(`text:${encoding ?? 'default'}`);
    this.finish();
  }
  readAsDataURL(): void {
    calls.push('dataURL');
    this.finish();
  }
  readAsBinaryString(): void {
    calls.push('binaryString');
    this.finish();
  }
}

const g = globalThis as unknown as { FileReader?: unknown };

const withReader = (m: Mode, value: unknown): void => {
  mode = m;
  payload = value;
  calls.length = 0;
  g.FileReader = FakeFileReader;
};

afterEach(() => {
  delete g.FileReader;
});

const blob = {} as Blob;

describe('file readers', () => {
  it('reads an ArrayBuffer', async () => {
    const buffer = new Uint8Array([1, 2, 3]).buffer;
    withReader('load', buffer);
    await expect(readFileAsArrayBuffer(blob)).resolves.toBe(buffer);
    expect(calls).toEqual(['arrayBuffer']);
  });

  it('reads a Uint8Array view over the buffer', async () => {
    withReader('load', new Uint8Array([1, 2, 3]).buffer);
    const bytes = await readFileAsUint8Array(blob);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect([...bytes]).toEqual([1, 2, 3]);
  });

  it('passes the encoding through to readAsText', async () => {
    withReader('load', 'hello');
    await expect(readFileAsText(blob, 'gbk')).resolves.toBe('hello');
    expect(calls).toEqual(['text:gbk']);
  });

  it('reads a data URL', async () => {
    withReader('load', 'data:text/plain;base64,aGk=');
    await expect(readFileAsDataURL(blob)).resolves.toBe('data:text/plain;base64,aGk=');
  });

  it('rejects on a read error', async () => {
    withReader('error', null);
    await expect(readFileAsText(blob)).rejects.toThrow('disk failure');
  });

  it('rejects on abort instead of hanging forever', async () => {
    withReader('abort', null);
    await expect(readFileAsText(blob)).rejects.toThrow('aborted');
  });

  it('rejects where FileReader does not exist (node / worker without it)', async () => {
    delete g.FileReader;
    await expect(readFileAsText(blob)).rejects.toThrow('FileReader is not available');
  });
});
