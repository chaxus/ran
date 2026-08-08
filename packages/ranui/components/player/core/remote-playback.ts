/**
 * AirPlay / the standards-track Remote Playback API — best-effort,
 * feature-detected exactly like `core/pip.ts`. Neither API is implemented by
 * both major engines (Remote Playback: Chrome/Edge; AirPlay:
 * `webkitShowPlaybackTargetPicker` on Safari), so this tries the standard one
 * first and falls back to the vendor-prefixed one. Mirrors `core/fullscreen.ts`'s
 * cast-through-an-untyped-host approach for the same reason: neither method is
 * in the DOM lib types every browser actually ships one of.
 */
interface RemotePlaybackHost {
  remote?: { prompt: () => Promise<void> };
  webkitShowPlaybackTargetPicker?: () => void;
}

function asRemotePlaybackHost(video?: HTMLVideoElement): RemotePlaybackHost | undefined {
  return video as unknown as RemotePlaybackHost | undefined;
}

export function isRemotePlaybackSupported(video?: HTMLVideoElement): boolean {
  const host = asRemotePlaybackHost(video);
  if (!host) return false;
  return typeof host.remote?.prompt === 'function' || typeof host.webkitShowPlaybackTargetPicker === 'function';
}

export function requestRemotePlayback(video: HTMLVideoElement): Promise<void> {
  const host = asRemotePlaybackHost(video);
  if (typeof host?.remote?.prompt === 'function') return host.remote.prompt();
  if (typeof host?.webkitShowPlaybackTargetPicker === 'function') {
    host.webkitShowPlaybackTargetPicker();
    return Promise.resolve();
  }
  return Promise.reject(new Error('Remote playback is not available'));
}
