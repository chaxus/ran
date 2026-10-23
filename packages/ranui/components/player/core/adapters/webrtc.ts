import { createAdapterEmitter, type EngineAdapter } from './types';

/**
 * WHEP (WebRTC-HTTP Egress Protocol, an IETF draft standard) playback — the
 * one WebRTC signaling scheme generic enough to fit the same "just give it a
 * URL" model HLS/DASH/FLV use. `src` is a WHEP endpoint URL (what Cloudflare
 * Stream, LiveKit egress, Millicast, and similar platforms expose) — there is
 * no signaling server of ranui's own, and no library dependency:
 * `RTCPeerConnection`/`fetch` are native browser APIs, so unlike the other
 * three engines this adapter needs no lazy `import()`.
 *
 * Never auto-detected by extension — there's no `.whep` URL convention the
 * way `.m3u8`/`.mpd` are, so this is only ever reached via the explicit
 * `format="webrtc"` attribute (`core/adapters/detect.ts`).
 *
 * Scope, deliberately kept modest: non-trickle ICE (waits for gathering to
 * finish, capped at `ICE_GATHERING_TIMEOUT_MS` — proceed with whatever candidates it has rather than
 * fail) rather than the WHEP PATCH-based trickle mechanism, and no
 * `Link: rel="ice-server"` header parsing for server-supplied STUN/TURN
 * hints — both are real WHEP spec features, left out because they add
 * meaningful complexity for a first cut and most WHEP servers work without
 * them for directly-reachable deployments. `getQualityLevels()` always
 * returns `[]`, matching FLV's "nothing to switch" behavior — WHEP has no
 * client-facing multi-bitrate selection standard the way HLS/DASH manifests
 * do.
 */
const ICE_GATHERING_TIMEOUT_MS = 3000;

function waitForIceGatheringComplete(pc: RTCPeerConnection, signal: AbortSignal): Promise<void> {
  if (pc.iceGatheringState === 'complete' || signal.aborted) return Promise.resolve();
  return new Promise((resolve) => {
    const finish = (): void => {
      clearTimeout(timer);
      pc.removeEventListener('icegatheringstatechange', onChange);
      signal.removeEventListener('abort', finish);
      resolve();
    };
    const onChange = (): void => {
      if (pc.iceGatheringState === 'complete') finish();
    };
    const timer = setTimeout(finish, ICE_GATHERING_TIMEOUT_MS);
    pc.addEventListener('icegatheringstatechange', onChange);
    signal.addEventListener('abort', finish, { once: true });
  });
}

export function createWebrtcAdapter(): EngineAdapter {
  const emitter = createAdapterEmitter();
  type Session = {
    pc: RTCPeerConnection;
    abort: AbortController;
    video: HTMLVideoElement;
    stream?: MediaStream;
    resourceUrl?: string;
  };
  let session: Session | undefined;
  const deleteResource = (url: string): void => {
    void fetch(url, { method: 'DELETE' }).catch(() => undefined);
  };
  const destroy = (): void => {
    const previous = session;
    session = undefined;
    if (!previous) return;
    previous.abort.abort();
    previous.pc.ontrack = null;
    previous.pc.onconnectionstatechange = null;
    previous.pc.close();
    if (previous.stream && previous.video.srcObject === previous.stream) previous.video.srcObject = null;
    if (previous.resourceUrl) deleteResource(previous.resourceUrl);
  };

  return {
    reloadsOnQualityChange: false,
    load: async (video, src) => {
      destroy();
      if (!src) return;
      const pc = new RTCPeerConnection();
      const current: Session = { pc, video, abort: new AbortController() };
      session = current;
      const isCurrent = (): boolean => session === current;
      pc.addTransceiver('video', { direction: 'recvonly' });
      pc.addTransceiver('audio', { direction: 'recvonly' });
      pc.ontrack = (event) => {
        if (!isCurrent()) return;
        const [stream] = event.streams;
        if (stream) {
          current.stream = stream;
          video.srcObject = stream;
        }
      };
      pc.onconnectionstatechange = () => {
        if (isCurrent() && pc.connectionState === 'failed') {
          emitter.emit('error', { fatal: true, detail: { connectionState: pc.connectionState } });
        }
      };
      try {
        const endpoint = new URL(src, video.ownerDocument.baseURI).href;
        const offer = await pc.createOffer();
        if (!isCurrent()) return;
        await pc.setLocalDescription(offer);
        if (!isCurrent()) return;
        await waitForIceGatheringComplete(pc, current.abort.signal);
        if (!isCurrent()) return;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/sdp' },
          body: pc.localDescription?.sdp,
          signal: current.abort.signal,
        });
        if (!response.ok) {
          if (isCurrent()) emitter.emit('error', { fatal: true, detail: { status: response.status } });
          return;
        }
        // Redirected endpoints and relative session locations use the actual response URL.
        const location = response.headers.get('Location');
        const resourceUrl = location ? new URL(location, response.url || endpoint).href : undefined;
        if (!isCurrent()) {
          if (resourceUrl) deleteResource(resourceUrl);
          return;
        }
        current.resourceUrl = resourceUrl;
        const answerSdp = await response.text();
        if (!isCurrent()) return;
        await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
      } catch (error) {
        if (isCurrent()) emitter.emit('error', { fatal: true, detail: error });
      }
    },
    destroy,
    getQualityLevels: () => [],
    setQuality: () => undefined,
    on: emitter.on,
  };
}
