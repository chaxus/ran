export interface PlayerControllerElements {
  host: HTMLElement;
  container: HTMLDivElement;
  player: HTMLDivElement;
  playerBtn: HTMLDivElement;
  progress: HTMLDivElement;
  progressDot: HTMLDivElement;
  playBtn: HTMLDivElement;
  volumeProgress: HTMLElement;
  fullScreenBtn: HTMLDivElement;
  volumeIcon: HTMLDivElement;
}

export interface PlayerControllerHandlers {
  onContainerClick: (e: Event) => void;
  onPlayerBtnClick: (e: Event) => void;
  onKeydown: (e: KeyboardEvent) => void;
  onProgressDotMouseDown: (e: MouseEvent) => void;
  onPlayBtnClick: (e: Event) => void;
  onProgressClick: (e: MouseEvent) => void;
  onProgressMouseEnter: (e: MouseEvent) => void;
  onProgressMouseMove: (e: MouseEvent) => void;
  onProgressMouseLeave: (e: MouseEvent) => void;
  onPlayerMouseMove: (e: MouseEvent) => void;
  onDocumentMouseMove: (e: MouseEvent) => void;
  onDocumentMouseUp: (e: MouseEvent) => void;
  onVolumeChange: (e: Event) => void;
  onFullScreenClick: (e: Event) => void;
  onVolumeIconClick: (e: Event) => void;
  onFullscreenChange: () => void;
  onResize: () => void;
}

export function bindControllerEvents(elements: PlayerControllerElements, handlers: PlayerControllerHandlers): void {
  elements.container.addEventListener('click', handlers.onContainerClick);
  elements.playerBtn.addEventListener('click', handlers.onPlayerBtnClick);
  elements.host.addEventListener('keydown', handlers.onKeydown);
  elements.progressDot.addEventListener('mousedown', handlers.onProgressDotMouseDown);
  elements.playBtn.addEventListener('click', handlers.onPlayBtnClick);
  elements.progress.addEventListener('click', handlers.onProgressClick);
  elements.progress.addEventListener('mouseenter', handlers.onProgressMouseEnter);
  elements.progress.addEventListener('mousemove', handlers.onProgressMouseMove);
  elements.progress.addEventListener('mouseleave', handlers.onProgressMouseLeave);
  elements.player.addEventListener('mousemove', handlers.onPlayerMouseMove);
  document.addEventListener('mousemove', handlers.onDocumentMouseMove);
  document.addEventListener('mouseup', handlers.onDocumentMouseUp);
  elements.volumeProgress.addEventListener('change', handlers.onVolumeChange);
  elements.fullScreenBtn.addEventListener('click', handlers.onFullScreenClick);
  elements.volumeIcon.addEventListener('click', handlers.onVolumeIconClick);
  document.addEventListener('fullscreenchange', handlers.onFullscreenChange);
  window.addEventListener('resize', handlers.onResize);
}

export function unbindControllerEvents(elements: PlayerControllerElements, handlers: PlayerControllerHandlers): void {
  elements.container.removeEventListener('click', handlers.onContainerClick);
  elements.playerBtn.removeEventListener('click', handlers.onPlayerBtnClick);
  elements.host.removeEventListener('keydown', handlers.onKeydown);
  elements.progressDot.removeEventListener('mousedown', handlers.onProgressDotMouseDown);
  elements.playBtn.removeEventListener('click', handlers.onPlayBtnClick);
  elements.progress.removeEventListener('click', handlers.onProgressClick);
  elements.progress.removeEventListener('mouseenter', handlers.onProgressMouseEnter);
  elements.progress.removeEventListener('mousemove', handlers.onProgressMouseMove);
  elements.progress.removeEventListener('mouseleave', handlers.onProgressMouseLeave);
  elements.player.removeEventListener('mousemove', handlers.onPlayerMouseMove);
  document.removeEventListener('mousemove', handlers.onDocumentMouseMove);
  document.removeEventListener('mouseup', handlers.onDocumentMouseUp);
  elements.volumeProgress.removeEventListener('change', handlers.onVolumeChange);
  elements.fullScreenBtn.removeEventListener('click', handlers.onFullScreenClick);
  elements.volumeIcon.removeEventListener('click', handlers.onVolumeIconClick);
  document.removeEventListener('fullscreenchange', handlers.onFullscreenChange);
  window.removeEventListener('resize', handlers.onResize);
}
