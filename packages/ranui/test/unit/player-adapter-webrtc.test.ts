import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createWebrtcAdapter } from '@/components/player/core/adapters/webrtc';

class MockRTCPeerConnection {
  iceGatheringState: RTCIceGatheringState = 'complete';
  connectionState: RTCPeerConnectionState = 'new';
  localDescription: RTCSessionDescriptionInit | null = null;
  ontrack: ((event: any) => void) | null = null;
  onconnectionstatechange: (() => void) | null = null;
  transceivers: Array<{ kind: string; direction: string }> = [];
  closed = false;
  private listeners = new Map<string, Set<() => void>>();

  addTransceiver(kind: string, opts: { direction: string }): void {
    this.transceivers.push({ kind, direction: opts.direction });
  }

  addEventListener(type: string, handler: () => void): void {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(handler);
  }

  removeEventListener(type: string, handler: () => void): void {
    this.listeners.get(type)?.delete(handler);
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    return { type: 'offer', sdp: 'v=0\r\noffer-sdp' };
  }

  async setLocalDescription(desc: RTCSessionDescriptionInit): Promise<void> {
    this.localDescription = desc;
  }

  async setRemoteDescription(_desc: RTCSessionDescriptionInit): Promise<void> {
    // no-op for the mock
  }

  close(): void {
    this.closed = true;
  }

  emitTrack(stream: MediaStream): void {
    this.ontrack?.({ streams: [stream] });
  }

  emitConnectionStateChange(state: RTCPeerConnectionState): void {
    this.connectionState = state;
    this.onconnectionstatechange?.();
  }
}

const installMockPeerConnection = (): MockRTCPeerConnection[] => {
  const instances: MockRTCPeerConnection[] = [];
  vi.stubGlobal(
    'RTCPeerConnection',
    class {
      constructor() {
        const instance = new MockRTCPeerConnection();
        instances.push(instance);
        return instance;
      }
    },
  );
  return instances;
};

describe('core/adapters/webrtc createWebrtcAdapter (WHEP)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('does nothing when src is empty', async () => {
    const instances = installMockPeerConnection();
    const adapter = createWebrtcAdapter();
    await adapter.load(document.createElement('video'), '');
    expect(instances).toHaveLength(0);
  });

  it('posts the SDP offer to the WHEP endpoint and applies the answer', async () => {
    const instances = installMockPeerConnection();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ Location: '/whep/session/abc' }),
      text: () => Promise.resolve('v=0\r\nanswer-sdp'),
    });
    vi.stubGlobal('fetch', fetchMock);

    const adapter = createWebrtcAdapter();
    const video = document.createElement('video');
    await adapter.load(video, 'https://stream.example.com/whep/room123');

    expect(instances).toHaveLength(1);
    expect(instances[0].transceivers).toEqual([
      { kind: 'video', direction: 'recvonly' },
      { kind: 'audio', direction: 'recvonly' },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://stream.example.com/whep/room123',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/sdp' },
        body: 'v=0\r\noffer-sdp',
      }),
    );
  });

  it('attaches the incoming MediaStream to the video element via srcObject', async () => {
    const instances = installMockPeerConnection();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers(),
        text: () => Promise.resolve('v=0\r\nanswer-sdp'),
      }),
    );

    const adapter = createWebrtcAdapter();
    const video = document.createElement('video');
    await adapter.load(video, 'https://stream.example.com/whep/room123');

    expect(video.srcObject).toBeFalsy(); // no track event fired yet
    const stream = {} as MediaStream;
    instances[0].emitTrack(stream);
    expect(video.srcObject).toBe(stream);
  });

  it('emits a fatal error when the WHEP endpoint responds with a non-ok status', async () => {
    installMockPeerConnection();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, headers: new Headers() }));

    const adapter = createWebrtcAdapter();
    const errors: Array<{ fatal: boolean; detail: unknown }> = [];
    adapter.on('error', (payload) => errors.push(payload));

    await adapter.load(document.createElement('video'), 'https://stream.example.com/whep/room123');

    expect(errors).toHaveLength(1);
    expect(errors[0].fatal).toBe(true);
  });

  it('emits a fatal error when negotiation throws', async () => {
    vi.stubGlobal(
      'RTCPeerConnection',
      class {
        addTransceiver(): void {}
        addEventListener(): void {}
        removeEventListener(): void {}
        iceGatheringState = 'complete';
        async createOffer(): Promise<never> {
          throw new Error('negotiation failed');
        }
      },
    );

    const adapter = createWebrtcAdapter();
    const errors: Array<{ fatal: boolean; detail: unknown }> = [];
    adapter.on('error', (payload) => errors.push(payload));

    await adapter.load(document.createElement('video'), 'https://stream.example.com/whep/room123');

    expect(errors).toHaveLength(1);
    expect(errors[0].fatal).toBe(true);
  });

  it('emits a fatal error when the connection state becomes failed', async () => {
    const instances = installMockPeerConnection();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, headers: new Headers(), text: () => Promise.resolve('v=0\r\nsdp') }),
    );

    const adapter = createWebrtcAdapter();
    const errors: Array<{ fatal: boolean; detail: unknown }> = [];
    adapter.on('error', (payload) => errors.push(payload));
    await adapter.load(document.createElement('video'), 'https://stream.example.com/whep/room123');

    instances[0].emitConnectionStateChange('failed');

    expect(errors).toHaveLength(1);
    expect(errors[0].fatal).toBe(true);
  });

  it('resolves the Location header against src for the destroy() DELETE request', async () => {
    installMockPeerConnection();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ Location: '/whep/session/abc' }),
      text: () => Promise.resolve('v=0\r\nsdp'),
    });
    vi.stubGlobal('fetch', fetchMock);

    const adapter = createWebrtcAdapter();
    await adapter.load(document.createElement('video'), 'https://stream.example.com/whep/room123');
    adapter.destroy();

    expect(fetchMock).toHaveBeenLastCalledWith('https://stream.example.com/whep/session/abc', {
      method: 'DELETE',
    });
  });

  it('closes the peer connection on destroy() even with no resource URL', async () => {
    const instances = installMockPeerConnection();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, headers: new Headers(), text: () => Promise.resolve('v=0\r\nsdp') }),
    );

    const adapter = createWebrtcAdapter();
    await adapter.load(document.createElement('video'), 'https://stream.example.com/whep/room123');
    adapter.destroy();

    expect(instances[0].closed).toBe(true);
  });

  it('getQualityLevels always returns an empty array and setQuality is a no-op', () => {
    const adapter = createWebrtcAdapter();
    expect(adapter.getQualityLevels()).toEqual([]);
    expect(() => adapter.setQuality('anything')).not.toThrow();
    expect(adapter.reloadsOnQualityChange).toBe(false);
  });
});

describe('WHEP session lifecycle', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
  it('resolves relative endpoints and releases only its attached stream on destroy', async () => {
    const peers = installMockPeerConnection();
    const fetchMock = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        headers: new Headers({ Location: '/session/current' }),
        text: async () => 'answer',
      });
    vi.stubGlobal('fetch', fetchMock);
    const adapter = createWebrtcAdapter();
    const errors = vi.fn();
    adapter.on('error', errors);
    const video = document.createElement('video');
    await adapter.load(video, '/whep/live');
    expect(errors).not.toHaveBeenCalled();
    peers[0].emitTrack({} as MediaStream);
    adapter.destroy();
    expect(video.srcObject).toBeNull();
    expect(fetchMock).toHaveBeenLastCalledWith(new URL('/session/current', document.baseURI).href, {
      method: 'DELETE',
    });
  });
  it('aborts replaced requests and ignores late tracks, errors and answers, cleaning late sessions', async () => {
    const peers = installMockPeerConnection();
    let resolveOld!: (value: unknown) => void;
    const pending = new Promise((resolve) => {
      resolveOld = resolve;
    });
    const fetchMock = vi
      .fn()
      .mockImplementation((_url, init) => (init.method === 'POST' ? pending : Promise.resolve({ ok: true })));
    vi.stubGlobal('fetch', fetchMock);
    const adapter = createWebrtcAdapter();
    const errors = vi.fn();
    adapter.on('error', errors);
    const video = document.createElement('video');
    const oldLoad = adapter.load(video, 'https://example.com/whep/old');
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const signal = fetchMock.mock.calls[0][1].signal as AbortSignal;
    const remote = vi.spyOn(peers[0], 'setRemoteDescription');
    adapter.destroy();
    expect(signal?.aborted).toBe(true);
    peers[0].emitTrack({} as MediaStream);
    peers[0].emitConnectionStateChange('failed');
    resolveOld({ ok: true, headers: new Headers({ Location: '/session/old' }), text: async () => 'old answer' });
    await oldLoad;
    expect(video.srcObject).toBeFalsy();
    expect(errors).not.toHaveBeenCalled();
    expect(remote).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenLastCalledWith('https://example.com/session/old', { method: 'DELETE' });
  });
  it('replacement preserves the new stream and rejects an obsolete SDP body', async () => {
    const peers = installMockPeerConnection();
    let answerOld!: (value: string) => void;
    const oldBody = new Promise<string>((resolve) => {
      answerOld = resolve;
    });
    const readOldBody = vi.fn(() => oldBody);
    const fetchMock = vi.fn().mockImplementation((url, init) =>
      Promise.resolve({
        ok: true,
        headers: new Headers({ Location: url.endsWith('/old') ? '/session/old' : '/session/new' }),
        text: init.method === 'POST' && url.endsWith('/old') ? readOldBody : async () => 'new answer',
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const adapter = createWebrtcAdapter();
    const video = document.createElement('video');
    const oldLoad = adapter.load(video, 'https://example.com/old');
    await vi.waitFor(() => expect(readOldBody).toHaveBeenCalled());
    const oldRemote = vi.spyOn(peers[0], 'setRemoteDescription');
    await adapter.load(video, 'https://example.com/new');
    const currentStream = {} as MediaStream;
    peers[1].emitTrack(currentStream);
    peers[0].emitTrack({} as MediaStream);
    answerOld('stale answer');
    await oldLoad;
    expect(oldRemote).not.toHaveBeenCalled();
    expect(peers[0].closed).toBe(true);
    expect(peers[1].closed).toBe(false);
    expect(video.srcObject).toBe(currentStream);
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/session/old', { method: 'DELETE' });
    adapter.destroy();
    expect(video.srcObject).toBeNull();
  });

  it('cancels ICE gathering promptly and preserves a stream installed by another owner', async () => {
    const peers = installMockPeerConnection();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const adapter = createWebrtcAdapter();
    const video = document.createElement('video');
    const load = adapter.load(video, 'https://example.com/ice');
    peers[0].iceGatheringState = 'gathering';
    const add = vi.spyOn(peers[0], 'addEventListener');
    const remove = vi.spyOn(peers[0], 'removeEventListener');
    await vi.waitFor(() => expect(add).toHaveBeenCalledWith('icegatheringstatechange', expect.any(Function)));
    peers[0].emitTrack({} as MediaStream);
    const externalStream = {} as MediaStream;
    video.srcObject = externalStream;
    adapter.destroy();
    await load;
    expect(remove).toHaveBeenCalledWith('icegatheringstatechange', expect.any(Function));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(video.srcObject).toBe(externalStream);
  });
});
