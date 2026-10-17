import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createObjectURL, requestUrlToBuffer } from '@/utils/bom';

class MockXHR {
  static latest: MockXHR;
  status = 200;
  response: unknown;
  responseType: XMLHttpRequestResponseType = '';
  withCredentials = false;
  onload?: () => void;
  onerror?: (event: ProgressEvent) => void;
  onprogress?: (event: ProgressEvent) => void;
  open = vi.fn();
  send = vi.fn();
  setRequestHeader = vi.fn();

  constructor() {
    MockXHR.latest = this;
  }
}

beforeEach(() => {
  vi.stubGlobal('XMLHttpRequest', MockXHR);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('requestUrlToBuffer', () => {
  it('defaults omitted options to arraybuffer and preserves the returned bytes', async () => {
    const result = requestUrlToBuffer('/asset');
    const xhr = MockXHR.latest;
    const bytes = new Uint8Array([1, 2, 3]).buffer;
    xhr.response = bytes;
    xhr.onload?.();
    await expect(result).resolves.toEqual({ success: true, data: bytes, message: '' });
    expect(xhr.responseType).toBe('arraybuffer');
    expect(xhr.open).toHaveBeenCalledWith('GET', '/asset', true);
    expect(xhr.withCredentials).toBe(false);
  });

  it.each([undefined, '', 'arraybuffer'] as const)('uses arraybuffer for responseType %s', async (responseType) => {
    const result = requestUrlToBuffer('/asset', { responseType });
    const xhr = MockXHR.latest;
    xhr.response = new ArrayBuffer(0);
    xhr.onload?.();
    expect(xhr.responseType).toBe('arraybuffer');
    await expect(result).resolves.toMatchObject({ success: true });
  });

  it.each([
    ['blob', new Blob(['image'])],
    ['arraybuffer', new Uint8Array([42]).buffer],
    ['text', 'plain text'],
    ['json', { valid: true }],
    ['json', null],
    ['document', { nodeType: 9 }],
    ['document', null],
  ] as const)('preserves the %s response', async (responseType, response) => {
    const result = requestUrlToBuffer('/asset', { responseType });
    const xhr = MockXHR.latest;
    xhr.response = response;
    xhr.onload?.();
    expect(xhr.responseType).toBe(responseType);
    expect((await result).data).toBe(response);
  });

  it('forwards request options and progress events', async () => {
    const onProgress = vi.fn();
    const result = requestUrlToBuffer('/asset', {
      method: 'POST',
      withCredentials: true,
      headers: { Authorization: 'token' },
      body: 'payload',
      onProgress,
    });
    const xhr = MockXHR.latest;
    const event = { loaded: 5, total: 10, lengthComputable: true } as ProgressEvent;
    xhr.onprogress?.(event);
    expect(onProgress).toHaveBeenCalledWith(event);
    expect(xhr.open).toHaveBeenCalledWith('POST', '/asset', true);
    expect(xhr.withCredentials).toBe(true);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith('Authorization', 'token');
    expect(xhr.send).toHaveBeenCalledWith('payload');
    xhr.response = new ArrayBuffer(0);
    xhr.onload?.();
    await result;
  });

  it.each([201, 204, 404, 500])('keeps status %s on the rejection path', async (status) => {
    const result = requestUrlToBuffer('/asset', {});
    const xhr = MockXHR.latest;
    xhr.status = status;
    xhr.onload?.();
    await expect(result).rejects.toMatchObject({ success: false, data: status });
  });

  it('rejects a network error with the original event', async () => {
    const result = requestUrlToBuffer('/asset', {});
    const event = { type: 'error' } as ProgressEvent;
    MockXHR.latest.onerror?.(event);
    await expect(result).rejects.toEqual({ success: false, data: event, message: '' });
  });
});

describe('createObjectURL', () => {
  it('passes an existing string URL through', async () => {
    await expect(createObjectURL('https://example.com/asset')).resolves.toBe('https://example.com/asset');
  });

  it('creates URLs from a Blob, ArrayBuffer and Response', async () => {
    const create = vi.fn((_blob: Blob) => 'blob:asset');
    vi.stubGlobal('URL', { createObjectURL: create });
    const blob = new Blob(['a']);
    const bytes = new Uint8Array([2, 3]).buffer;
    await expect(createObjectURL(blob)).resolves.toBe('blob:asset');
    expect(create.mock.calls[0][0]).toBe(blob);
    await expect(createObjectURL(bytes)).resolves.toBe('blob:asset');
    expect(await create.mock.calls[1][0].arrayBuffer()).toEqual(bytes);
    await expect(createObjectURL(new Response('body'))).resolves.toBe('blob:asset');
    expect(await create.mock.calls[2][0].text()).toBe('body');
  });
});
