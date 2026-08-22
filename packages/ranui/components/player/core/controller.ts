import type { EventManager } from '@/utils/builder';

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
  pipBtn: HTMLDivElement;
  remoteBtn: HTMLDivElement;
}

export interface PlayerControllerHandlers {
  onContainerClick: (e: Event) => void;
  onPlayerBtnClick: (e: Event) => void;
  onKeydown: (e: KeyboardEvent) => void;
  onProgressDotPointerDown: (e: PointerEvent) => void;
  onPlayBtnClick: (e: Event) => void;
  onPlayBtnKeydown: (e: KeyboardEvent) => void;
  onFullScreenKeydown: (e: KeyboardEvent) => void;
  onProgressClick: (e: MouseEvent) => void;
  onProgressKeydown: (e: KeyboardEvent) => void;
  onProgressMouseEnter: (e: MouseEvent) => void;
  onProgressMouseMove: (e: MouseEvent) => void;
  onProgressMouseLeave: (e: MouseEvent) => void;
  onPlayerMouseMove: (e: MouseEvent) => void;
  onDocumentPointerMove: (e: PointerEvent) => void;
  onDocumentPointerUp: (e: PointerEvent) => void;
  onDocumentPointerCancel: (e: PointerEvent) => void;
  onVolumeChange: (e: Event) => void;
  onFullScreenClick: (e: Event) => void;
  onVolumeIconClick: (e: Event) => void;
  onFullscreenChange: () => void;
  onResize: () => void;
  onPipClick: (e: Event) => void;
  onRemoteClick: (e: Event) => void;
  onVisibilityChange: () => void;
}

type EventTargetScope = keyof PlayerControllerElements | 'document' | 'window';

type ControllerEventBinding = {
  target: EventTargetScope;
  eventName: string;
  handler: keyof PlayerControllerHandlers;
};

const CONTROLLER_EVENT_BINDINGS: ControllerEventBinding[] = [
  { target: 'container', eventName: 'click', handler: 'onContainerClick' },
  { target: 'playerBtn', eventName: 'click', handler: 'onPlayerBtnClick' },
  { target: 'host', eventName: 'keydown', handler: 'onKeydown' },
  // Scrubbing runs on Pointer Events so it works with touch and pen, not just a mouse —
  // paired with `touch-action: none` on the dot so the browser scrolls the page instead of
  // delivering the drag. `pointercancel` matters here and has no mouse equivalent: a touch
  // drag can be taken away by the browser or the system at any moment, and without it the
  // player would stay stuck mid-seek.
  //
  // The move/up/cancel listeners sit on `document` for the drag's whole life rather than
  // being attached per drag the way `r-progress` does. That component's reason does not
  // apply here: it exists to keep a page full of progress bars from each holding a
  // document listener, and a page holds one or two players, not fifty.
  { target: 'progressDot', eventName: 'pointerdown', handler: 'onProgressDotPointerDown' },
  { target: 'playBtn', eventName: 'click', handler: 'onPlayBtnClick' },
  { target: 'playBtn', eventName: 'keydown', handler: 'onPlayBtnKeydown' },
  { target: 'fullScreenBtn', eventName: 'keydown', handler: 'onFullScreenKeydown' },
  { target: 'progress', eventName: 'click', handler: 'onProgressClick' },
  { target: 'progress', eventName: 'keydown', handler: 'onProgressKeydown' },
  { target: 'progress', eventName: 'mouseenter', handler: 'onProgressMouseEnter' },
  { target: 'progress', eventName: 'mousemove', handler: 'onProgressMouseMove' },
  { target: 'progress', eventName: 'mouseleave', handler: 'onProgressMouseLeave' },
  { target: 'player', eventName: 'mousemove', handler: 'onPlayerMouseMove' },
  { target: 'document', eventName: 'pointermove', handler: 'onDocumentPointerMove' },
  { target: 'document', eventName: 'pointerup', handler: 'onDocumentPointerUp' },
  { target: 'document', eventName: 'pointercancel', handler: 'onDocumentPointerCancel' },
  { target: 'volumeProgress', eventName: 'change', handler: 'onVolumeChange' },
  { target: 'fullScreenBtn', eventName: 'click', handler: 'onFullScreenClick' },
  { target: 'volumeIcon', eventName: 'click', handler: 'onVolumeIconClick' },
  { target: 'pipBtn', eventName: 'click', handler: 'onPipClick' },
  { target: 'remoteBtn', eventName: 'click', handler: 'onRemoteClick' },
  { target: 'document', eventName: 'fullscreenchange', handler: 'onFullscreenChange' },
  { target: 'document', eventName: 'visibilitychange', handler: 'onVisibilityChange' },
  { target: 'window', eventName: 'resize', handler: 'onResize' },
];

function resolveEventTarget(elements: PlayerControllerElements, target: EventTargetScope): EventTarget {
  if (target === 'document') return document;
  if (target === 'window') return window;
  return elements[target];
}

/**
 * Registers every controller/chrome listener through `events` (an
 * `EventManager`). Teardown is a single `events.abort()` call by the caller —
 * there is no matching unbind function to keep in sync.
 */
export function bindControllerEvents(
  events: EventManager,
  elements: PlayerControllerElements,
  handlers: PlayerControllerHandlers,
): void {
  CONTROLLER_EVENT_BINDINGS.forEach((binding) => {
    const target = resolveEventTarget(elements, binding.target);
    const handler = handlers[binding.handler] as EventListener;
    events.on(target, binding.eventName, handler);
  });
}
