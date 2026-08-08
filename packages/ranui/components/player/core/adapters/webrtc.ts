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
 * finish, capped at `ICE_GATHERING_TIMEOUT_MS`, then sends whatever
 * candidates it has) rather than the WHEP PATCH-based trickle mechanism, and
 * no `Link: rel="ice-server"` header parsing for server-supplied STUN/TURN
 * hints — both are real WHEP spec features, left out because they add
 * meaningful complexity for a first cut and most WHEP servers work without
 * them for directly-reachable deployments. `getQualityLevels()` always
 * returns `[]`, matching FLV's "nothing to switch" behavior — WHEP has no
 * client-facing multi-bitrate selection standard the way HLS/DASH manifests
 * do.
 */
const ICE_GATHERING_TIMEOUT_MS = 3000;

function waitForIceGatheringComplete(pc: RTCPeerConnection, timeoutMs = ICE_GATHERING_TIMEOUT_MS): Promise<void> {
  if (pc.iceGatheringState === 'complete') return Promise.resolve();
  return new Promise((resolve) => {
    const onChange = (): void => {
      if (pc.iceGatheringState !== 'complete') return;
      clearTimeout(timer);
      pc.removeEventListener('icegatheringstatechange', onChange);
      resolve();
    };
    const timer = setTimeout(() => {
      pc.removeEventListener('icegatheringstatechange', onChange);
      resolve();
    }, timeoutMs);
    pc.addEventListener('icegatheringstatechange', onChange);
  });
}

export function createWebrtcAdapter(): EngineAdapter {
  const emitter = createAdapterEmitter();
  let peerConnection: RTCPeerConnection | undefined;
  let resourceUrl: string | undefined;

  return {
    reloadsOnQualityChange: false,
    load: async (video, src) => {
      if (!src) return;
      const pc = new RTCPeerConnection();
      peerConnection = pc;
      // `recvonly` — this is a playback-only adapter, never publishing.
      pc.addTransceiver('video', { direction: 'recvonly' });
      pc.addTransceiver('audio', { direction: 'recvonly' });
      pc.ontrack = (event) => {
        const [stream] = event.streams;
        if (stream) video.srcObject = stream;
      };
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed') {
          emitter.emit('error', { fatal: true, detail: { connectionState: pc.connectionState } });
        }
      };
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await waitForIceGatheringComplete(pc);
        const response = await fetch(src, {
          method: 'POST',
          headers: { 'Content-Type': 'application/sdp' },
          body: pc.localDescription?.sdp,
        });
        if (!response.ok) {
          emitter.emit('error', { fatal: true, detail: { status: response.status } });
          return;
        }
        // The WHEP session's resource URL — DELETE this on destroy() to tell the
        // server playback has ended. Resolved against `src` since servers may
        // return a relative path.
        const location = response.headers.get('Location');
        resourceUrl = location ? new URL(location, src).href : undefined;
        const answerSdp = await response.text();
        await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
      } catch (error) {
        emitter.emit('error', { fatal: true, detail: error });
      }
    },
    destroy: () => {
      if (resourceUrl) {
        // Best-effort session teardown — the server should also time out the
        // session on its own once the PeerConnection actually closes.
        fetch(resourceUrl, { method: 'DELETE' }).catch(() => undefined);
      }
      peerConnection?.close();
      peerConnection = undefined;
      resourceUrl = undefined;
    },
    getQualityLevels: () => [],
    setQuality: () => undefined,
    on: emitter.on,
  };
}
