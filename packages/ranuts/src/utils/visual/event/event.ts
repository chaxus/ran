import { FederatedMouseEvent } from '@/utils/visual/event/types';
import { EventBoundary } from '@/utils/visual/event/boundary';
import type { Container } from '@/utils/visual/vertex/container';
import type { FederatedEventMap } from '@/utils/visual/event/types';

export class EventSystem {
  private canvasEle: HTMLCanvasElement; // the canvas element
  private eventBoundary: EventBoundary;
  private rootEvent = new FederatedMouseEvent();
  constructor(canvasEle: HTMLCanvasElement, stage: Container) {
    this.canvasEle = canvasEle;
    this.eventBoundary = new EventBoundary(stage);
    this.addEvents();
  }
  // On a pointermove over the canvas, translate the native event into the engine's own event (FederatedMouseEvent) and run the matching handler.
  private addEvents = () => {
    this.canvasEle.addEventListener('pointermove', this.onPointerMove, true);
    this.canvasEle.addEventListener('pointerleave', this.onPointerLeave, true);
    this.canvasEle.addEventListener('pointerdown', this.onPointerDown, true);
    this.canvasEle.addEventListener('pointerup', this.onPointerup, true);
  };
  private onPointerMove = (nativeEvent: PointerEvent) => {
    this.bootstrapEvent(nativeEvent);
    this.eventBoundary.fireEvent(this.rootEvent);
    this.setCursor();
  };
  private onPointerLeave = () => {
    this.eventBoundary.overTargets = [];
  };
  private onPointerDown = (nativeEvent: PointerEvent) => {
    this.bootstrapEvent(nativeEvent);
    this.eventBoundary.fireEvent(this.rootEvent);
  };
  private onPointerup = (nativeEvent: PointerEvent) => {
    this.bootstrapEvent(nativeEvent);
    this.eventBoundary.fireEvent(this.rootEvent);
  };
  // offsetX / offsetY convert the DOM event's coordinates into the canvas viewport's global coordinates:
  private bootstrapEvent = (nativeEvent: PointerEvent) => {
    this.rootEvent.isTrusted = nativeEvent.isTrusted;
    this.rootEvent.timeStamp = performance.now();
    this.rootEvent.type = nativeEvent.type.replace('pointer', 'mouse') as keyof FederatedEventMap;
    this.rootEvent.button = nativeEvent.button;
    this.rootEvent.buttons = nativeEvent.buttons;
    this.rootEvent.global.x = nativeEvent.offsetX;
    this.rootEvent.global.y = nativeEvent.offsetY;
  };
  private setCursor = () => {
    this.canvasEle.style.cursor = this.eventBoundary.cursor;
  };
}
