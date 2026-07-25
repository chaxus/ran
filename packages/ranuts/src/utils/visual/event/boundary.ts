import { EventPhase } from '@/utils/visual/event/types';
import type { Point } from '@/utils/visual/vertex/point';
import type { Container } from '@/utils/visual/vertex/container';
import type { Cursor, FederatedMouseEvent } from '@/utils/visual/event/types';

export class EventBoundary {
  private rootContainer: Container; // the root element, i.e. the stage
  private hasFoundTarget = false;
  private hitTarget: Container | null = null;
  public cursor: Cursor = 'auto';
  private eventHandlerMap: Record<string, (e: FederatedMouseEvent) => void> = {};
  private pressTargetsMap: Record<number, Container[]> = {};
  public overTargets: Container[] = [];
  constructor(stage: Container) {
    this.rootContainer = stage;
    this.eventHandlerMap.mousemove = this.fireMouseMove;
    this.eventHandlerMap.mousedown = this.fireMouseDown;
    this.eventHandlerMap.mouseup = this.fireMouseUp;
  }
  // Hit testing that respects the scene hierarchy
  private hitTestRecursive = (curTarget: Container, globalPos: Point) => {
    // Invisible objects are skipped
    if (!curTarget.visible) {
      return;
    }

    if (this.hasFoundTarget) {
      return;
    }

    // Depth-first over the children
    for (let i = curTarget.children.length - 1; i >= 0; i--) {
      const child = curTarget.children[i];
      this.hitTestRecursive(child, globalPos);
    }

    if (this.hasFoundTarget) {
      return;
    }

    // and finally test itself
    const p = curTarget.worldTransform.applyInverse(globalPos);
    if (curTarget.containsPoint(p)) {
      this.hitTarget = curTarget;
      this.hasFoundTarget = true;
    }
  };
  private hitTest = (globalPos: Point): Container | null => {
    this.hasFoundTarget = false;
    this.hitTarget = null;

    this.hitTestRecursive(this.rootContainer, globalPos);

    return this.hitTarget;
  };
  public fireEvent = (event: FederatedMouseEvent): void => {
    this.eventHandlerMap[event.type]?.(event);
  };
  private fireMouseMove = (event: FederatedMouseEvent) => {
    // Run the handlers: first find what was hit, using the hit testing above
    const hitTarget = this.hitTest(event.global);
    // event.target = target

    const topTarget = this.overTargets.length > 0 ? this.overTargets[this.overTargets.length - 1] : null;

    // mouseout and mouseleave
    if (topTarget && topTarget !== hitTarget) {
      // mouseout first
      event.target = topTarget;
      event.type = 'mouseout';
      this.dispatchEvent(event);

      // then mouseleave
      if (!hitTarget || !this.composePath(hitTarget).includes(topTarget)) {
        event.type = 'mouseleave';
        event.eventPhase = EventPhase.AT_TARGET;

        if (!hitTarget) {
          for (let i = this.overTargets.length - 1; i >= 0; i--) {
            event.target = this.overTargets[i];
            event.currentTarget = event.target;

            // Run the handlers — once for capture, once for bubble
            event.target.call(`${event.type}capture`, event);
            event.target.call(event.type, event);
          }
        } else {
          let tempTarget: Container | undefined = topTarget;
          while (tempTarget && !this.composePath(hitTarget).includes(tempTarget)) {
            event.target = tempTarget;
            event.currentTarget = event.target;

            // Run the handlers — once for capture, once for bubble
            event.target.call(`${event.type}capture`, event);
            event.target.call(event.type, event);

            tempTarget = tempTarget.parent;
          }
        }
      }
    }

    // mouseover and mouseenter
    if (hitTarget && topTarget !== hitTarget) {
      // mouseover first
      event.target = hitTarget;
      event.type = 'mouseover';
      this.dispatchEvent(event);

      // then mouseenter
      const composedPath = this.composePath(hitTarget);
      event.type = 'mouseenter';
      event.eventPhase = EventPhase.AT_TARGET;
      if (!topTarget) {
        for (let i = 0; i < composedPath.length; i++) {
          event.target = composedPath[i];
          event.currentTarget = event.target;

          // Run the handlers — once for capture, once for bubble
          event.target.call(`${event.type}capture`, event);
          event.target.call(event.type, event);
        }
      } else {
        // Find where the paths diverge — the common ancestor of hitTarget and topTarget
        let forkedPointIdx = composedPath.length - 1;
        for (; forkedPointIdx >= 0; forkedPointIdx--) {
          if (this.composePath(topTarget).includes(composedPath[forkedPointIdx])) {
            break;
          }
        }

        // Fire mouseenter on each target from the top down
        for (let i = forkedPointIdx + 1; i < composedPath.length; i++) {
          event.target = composedPath[i];
          event.currentTarget = event.target;

          // Run the handlers — once for capture, once for bubble
          event.target.call(`${event.type}capture`, event);
          event.target.call(event.type, event);
        }
      }
    }

    // mousemove
    if (hitTarget) {
      event.target = hitTarget;
      event.type = 'mousemove';

      this.dispatchEvent(event);
    }

    this.overTargets = hitTarget ? this.composePath(hitTarget) : [];

    if (hitTarget) {
      this.cursor = hitTarget.cursor;
    } else {
      this.cursor = 'auto';
    }
  };
  private fireMouseDown = (event: FederatedMouseEvent) => {
    const hitTarget = this.hitTest(event.global);
    if (!hitTarget) {
      return;
    }
    event.target = hitTarget;
    this.dispatchEvent(event);

    // Record the propagation path at mousedown
    this.pressTargetsMap[event.button] = this.composePath(hitTarget);
  };
  private fireMouseUp = (event: FederatedMouseEvent) => {
    const hitTarget = this.hitTest(event.global);
    if (!hitTarget) {
      return;
    }
    event.target = hitTarget;
    this.dispatchEvent(event);

    const propagationPath = this.pressTargetsMap[event.button];
    if (!propagationPath) {
      return;
    }

    const pressTarget = propagationPath[propagationPath.length - 1];

    // click
    let clickTarget: Container = pressTarget;
    const composedPath = this.composePath(hitTarget);

    // Find the nearest common ancestor
    while (clickTarget) {
      if (!composedPath.includes(clickTarget)) {
        if (clickTarget.parent) {
          clickTarget = clickTarget.parent;
        }
      } else {
        break;
      }
    }

    event.type = 'click';
    event.target = clickTarget;
    this.dispatchEvent(event);

    delete this.pressTargetsMap[event.button];
  };
  private notifyTarget = (event: FederatedMouseEvent) => {
    if (event.eventPhase === EventPhase.CAPTURING) {
      event.currentTarget.call(`${event.type}capture`, event);
    } else {
      event.currentTarget.call(event.type, event);
    }
  };
  private propagate = (event: FederatedMouseEvent) => {
    const composedPath = this.composePath(event.target);
    // Capture phase first
    event.eventPhase = EventPhase.CAPTURING;
    for (let i = 0; i < composedPath.length - 1; i++) {
      event.currentTarget = composedPath[i];
      this.notifyTarget(event);
      if (event.propagationStopped) {
        return;
      }
    }

    // then the at-target phase
    event.eventPhase = EventPhase.AT_TARGET;
    event.currentTarget = event.target;
    event.currentTarget.call(`${event.type}capture`, event);
    if (event.propagationStopped) {
      return;
    }
    event.currentTarget.call(event.type, event);
    if (event.propagationStopped) {
      return;
    }

    // and finally the bubble phase
    event.eventPhase = EventPhase.BUBBLING;
    for (let i = composedPath.length - 2; i >= 0; i--) {
      event.currentTarget = composedPath[i];
      this.notifyTarget(event);
      if (event.propagationStopped) {
        return;
      }
    }
  };
  private dispatchEvent = (event: FederatedMouseEvent) => {
    event.propagationStopped = false;

    this.propagate(event);
  };
  private composePath = (target: Container) => {
    const res: Container[] = [];
    let element: Container | undefined = target;
    while (element) {
      res.unshift(element);
      element = element.parent;
    }
    return res;
  };
}
