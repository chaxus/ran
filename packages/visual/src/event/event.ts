import type { Container } from "../vertex/container";
import { EventBoundary } from "./boundry";
import { FederatedMouseEvent } from "./types";
import type { FederatedEventMap } from "./types";


export class EventSystem {
    private canvasEle: HTMLCanvasElement; // canvas 元素
    private eventBoundary: EventBoundary;
    private rootEvent = new FederatedMouseEvent();
    constructor(canvasEle: HTMLCanvasElement, stage: Container) {
      this.canvasEle = canvasEle;
      this.eventBoundary = new EventBoundary(stage);
      this.addEvents();
    }
    // canvas 元素上触发了 pointermove 事件后，将原生事件转化成这个渲染引擎的内部事件 (FederatedMouseEvent)，并执行对应的 event handler。
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
    // 用 offsetX 和 offsetY 来将 DOM 事件的坐标转化成 canvas 视窗的全局坐标：
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