import { addClassToElement, removeClassToElement } from 'ranuts/utils';

export function shouldSetLoadingOnSeeking(input: { isDraggingProgress: boolean; video?: HTMLVideoElement }): boolean {
  const { isDraggingProgress, video } = input;
  return !isDraggingProgress && !!video && !video.paused;
}

export function shouldSetLoadingOnWaiting(input: { isSeeking: boolean; video?: HTMLVideoElement }): boolean {
  const { isSeeking, video } = input;
  return !!video && !video.paused && !video.ended && !isSeeking;
}

export function syncPlayButtonState(playButton: HTMLElement, isPlaying: boolean): void {
  if (isPlaying) {
    removeClassToElement(playButton, 'ran-player-controller-bottom-left-btn-play');
    addClassToElement(playButton, 'ran-player-controller-bottom-left-btn-pause');
    return;
  }
  removeClassToElement(playButton, 'ran-player-controller-bottom-left-btn-pause');
  addClassToElement(playButton, 'ran-player-controller-bottom-left-btn-play');
}

export function syncCenterPlayVisibility(centerPlayButton: HTMLElement, visible: boolean): void {
  centerPlayButton.style.setProperty('display', visible ? 'block' : 'none');
}
