/**
 * Picture-in-Picture — standard API only (no Safari `webkitSetPresentationMode`
 * legacy variant; that's a different, non-standard API and out of scope here).
 * Mirrors `core/fullscreen.ts`'s shape: pure functions, no DOM-building.
 */

export function isPipSupported(video?: HTMLVideoElement): boolean {
  if (typeof document === 'undefined') return false;
  if (!('pictureInPictureEnabled' in document) || !document.pictureInPictureEnabled) return false;
  if (video?.disablePictureInPicture) return false;
  return true;
}

export function isInPip(video?: HTMLVideoElement): boolean {
  return typeof document !== 'undefined' && !!video && document.pictureInPictureElement === video;
}

export function requestPip(video: HTMLVideoElement): Promise<PictureInPictureWindow> {
  return video.requestPictureInPicture();
}

export function exitPip(): Promise<void> {
  if (typeof document === 'undefined' || !document.pictureInPictureElement) return Promise.resolve();
  return document.exitPictureInPicture();
}
