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
