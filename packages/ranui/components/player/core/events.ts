export function shouldSetLoadingOnSeeking(input: { isDraggingProgress: boolean; video?: HTMLVideoElement }): boolean {
  const { isDraggingProgress, video } = input;
  return !isDraggingProgress && !!video && !video.paused;
}

export function shouldSetLoadingOnWaiting(input: { isSeeking: boolean; video?: HTMLVideoElement }): boolean {
  const { isSeeking, video } = input;
  return !!video && !video.paused && !video.ended && !isSeeking;
}

/** Swaps the `<r-icon>` inside `playButton` between `play`/`pause` — see `<r-icon>` migration in `docs/PLAYER_ROADMAP.md` Phase 4. */
export function syncPlayButtonState(playButton: HTMLElement, isPlaying: boolean): void {
  playButton.querySelector('r-icon')?.setAttribute('name', isPlaying ? 'pause' : 'play');
  playButton.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
}

export function syncCenterPlayVisibility(centerPlayButton: HTMLElement, visible: boolean): void {
  centerPlayButton.style.setProperty('display', visible ? 'block' : 'none');
}
