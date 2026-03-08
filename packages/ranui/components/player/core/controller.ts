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

type EventTargetScope =
  | keyof PlayerControllerElements
  | 'document'
  | 'window';

type ControllerEventBinding = {
  target: EventTargetScope;
  eventName: string;
  handler: keyof PlayerControllerHandlers;
};

const CONTROLLER_EVENT_BINDINGS: ControllerEventBinding[] = [
  { target: 'container', eventName: 'click', handler: 'onContainerClick' },
  { target: 'playerBtn', eventName: 'click', handler: 'onPlayerBtnClick' },
  { target: 'host', eventName: 'keydown', handler: 'onKeydown' },
  { target: 'progressDot', eventName: 'mousedown', handler: 'onProgressDotMouseDown' },
  { target: 'playBtn', eventName: 'click', handler: 'onPlayBtnClick' },
  { target: 'progress', eventName: 'click', handler: 'onProgressClick' },
  { target: 'progress', eventName: 'mouseenter', handler: 'onProgressMouseEnter' },
  { target: 'progress', eventName: 'mousemove', handler: 'onProgressMouseMove' },
  { target: 'progress', eventName: 'mouseleave', handler: 'onProgressMouseLeave' },
  { target: 'player', eventName: 'mousemove', handler: 'onPlayerMouseMove' },
  { target: 'document', eventName: 'mousemove', handler: 'onDocumentMouseMove' },
  { target: 'document', eventName: 'mouseup', handler: 'onDocumentMouseUp' },
  { target: 'volumeProgress', eventName: 'change', handler: 'onVolumeChange' },
  { target: 'fullScreenBtn', eventName: 'click', handler: 'onFullScreenClick' },
  { target: 'volumeIcon', eventName: 'click', handler: 'onVolumeIconClick' },
  { target: 'document', eventName: 'fullscreenchange', handler: 'onFullscreenChange' },
  { target: 'window', eventName: 'resize', handler: 'onResize' },
];

function resolveEventTarget(
  elements: PlayerControllerElements,
  target: EventTargetScope,
): EventTarget {
  if (target === 'document') return document;
  if (target === 'window') return window;
  return elements[target];
}

function applyControllerEvents(
  method: 'addEventListener' | 'removeEventListener',
  elements: PlayerControllerElements,
  handlers: PlayerControllerHandlers,
): void {
  CONTROLLER_EVENT_BINDINGS.forEach((binding) => {
    const target = resolveEventTarget(elements, binding.target);
    const handler = handlers[binding.handler] as EventListener;
    target[method](binding.eventName, handler);
  });
}

export function bindControllerEvents(elements: PlayerControllerElements, handlers: PlayerControllerHandlers): void {
  applyControllerEvents('addEventListener', elements, handlers);
}

export function unbindControllerEvents(elements: PlayerControllerElements, handlers: PlayerControllerHandlers): void {
  applyControllerEvents('removeEventListener', elements, handlers);
}
