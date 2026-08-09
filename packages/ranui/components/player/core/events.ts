export function shouldSetLoadingOnSeeking(input: { isDraggingProgress: boolean; video?: HTMLVideoElement }): boolean {
  const { isDraggingProgress, video } = input;
  return !isDraggingProgress && !!video && !video.paused;
}

export function shouldSetLoadingOnWaiting(input: { isSeeking: boolean; video?: HTMLVideoElement }): boolean {
  const { isSeeking, video } = input;
  return !!video && !video.paused && !video.ended && !isSeeking;
}

/** Swaps `playButtonIcon` (the `<r-icon>` inside `playButton`) between `play`/`pause` — see `<r-icon>` migration in `docs/PLAYER_ROADMAP.md` Phase 4. */
export function syncPlayButtonState(playButton: HTMLElement, playButtonIcon: HTMLElement, isPlaying: boolean): void {
  playButtonIcon.setAttribute('name', isPlaying ? 'pause' : 'play');
  const label = isPlaying ? 'Pause' : 'Play';
  playButton.setAttribute('aria-label', label);
  playButton.setAttribute('title', label);
}

export function syncCenterPlayVisibility(centerPlayButton: HTMLElement, visible: boolean): void {
  centerPlayButton.style.setProperty('display', visible ? 'block' : 'none');
}
