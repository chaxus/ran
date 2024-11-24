import { EventPhase } from '@/utils/visual/event/types';
import type { Point } from '@/utils/visual/vertex/point';
import type { Container } from '@/utils/visual/vertex/container';
import type { Cursor, FederatedMouseEvent } from '@/utils/visual/event/types';

export class EventBoundary {
  private rootContainer: Container; // 根元素 stage
  private hasFoundTarget = false;
  private hitTarget: Container | null = null;
  public cursor: Cursor = 'auto';
  private eventHandlerMap: {
    [anyKey: string]: (e: FederatedMouseEvent) => any;
  } = {};
  private pressTargetsMap: { [anyKey: number]: Container[] } = {};
  public overTargets: Container[] = [];
  constructor(stage: Container) {
    this.rootContainer = stage;

    this.eventHandlerMap.mousemove = this.fireMouseMove;
    this.eventHandlerMap.mousedown = this.fireMouseDown;
    this.eventHandlerMap.mouseup = this.fireMouseUp;
  }
  // 引入了层级关系的碰撞检测
  private hitTestRecursive = (curTarget: Container, globalPos: Point) => {
    // 如果对象不可见则返回
    if (!curTarget.visible) {
      return;
    }

    if (this.hasFoundTarget) {
      return;
    }

    // 深度优先遍历子元素
    for (let i = curTarget.children.length - 1; i >= 0; i--) {
      const child = curTarget.children[i];
      this.hitTestRecursive(child, globalPos);
    }

    if (this.hasFoundTarget) {
      return;
    }

    // 最后检测自身
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
    // 执行 event handler，首先获取碰撞元素，这里使用的是上一篇文章讲述的碰撞检测代码
    const hitTarget = this.hitTest(event.global);
    // event.target = target

    const topTarget = this.overTargets.length > 0 ? this.overTargets[this.overTargets.length - 1] : null;

    // 处理 mouseout 和 mouseleave 事件
    if (topTarget && topTarget !== hitTarget) {
      // 首先是 mouseout
      event.target = topTarget;
      event.type = 'mouseout';
      this.dispatchEvent(event);

      // 接着处理 mouseleave
      if (!hitTarget || !this.composePath(hitTarget).includes(topTarget)) {
        event.type = 'mouseleave';
        event.eventPhase = EventPhase.AT_TARGET;

        if (!hitTarget) {
          for (let i = this.overTargets.length - 1; i >= 0; i--) {
            event.target = this.overTargets[i];
            event.currentTarget = event.target;

            // 执行对应的 event handler，捕获和冒泡分别执行一次
            event.target.call(`${event.type}capture`, event);
            event.target.call(event.type, event);
          }
        } else {
          let tempTarget: Container | undefined = topTarget;
          while (tempTarget && !this.composePath(hitTarget).includes(tempTarget)) {
            event.target = tempTarget;
            event.currentTarget = event.target;

            // 执行对应的 event handler，捕获和冒泡分别执行一次
            event.target.call(`${event.type}capture`, event);
            event.target.call(event.type, event);

            tempTarget = tempTarget.parent;
          }
        }
      }
    }

    // 处理 mouseover 和 mouseenter 事件
    if (hitTarget && topTarget !== hitTarget) {
      // 首先是 mouseover
      event.target = hitTarget;
      event.type = 'mouseover';
      this.dispatchEvent(event);

      // 接下来是 mouseenter
      const composedPath = this.composePath(hitTarget);
      event.type = 'mouseenter';
      event.eventPhase = EventPhase.AT_TARGET;
      if (!topTarget) {
        for (let i = 0; i < composedPath.length; i++) {
          event.target = composedPath[i];
          event.currentTarget = event.target;

          // 执行对应的event handler，捕获和冒泡分别执行一次
          event.target.call(`${event.type}capture`, event);
          event.target.call(event.type, event);
        }
      } else {
        // 首先找出分叉点，也就是hitTarget和topTarget的冒泡路径上的共同点
        let forkedPointIdx = composedPath.length - 1;
        for (; forkedPointIdx >= 0; forkedPointIdx--) {
          if (this.composePath(topTarget).includes(composedPath[forkedPointIdx])) {
            break;
          }
        }

        // 按照自顶向下的顺序依次在对应的 event target 上触发 mouseenter 事件
        for (let i = forkedPointIdx + 1; i < composedPath.length; i++) {
          event.target = composedPath[i];
          event.currentTarget = event.target;

          // 执行对应的event handler，捕获和冒泡分别执行一次
          event.target.call(`${event.type}capture`, event);
          event.target.call(event.type, event);
        }
      }
    }

    // 处理mousemove事件
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

    // 记录 mousedown 时的传播路径
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

    // 处理 click 事件
    let clickTarget: Container = pressTarget;
    const composedPath = this.composePath(hitTarget);

    // 找出最近公共祖先
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
    // 首先是捕获阶段
    event.eventPhase = EventPhase.CAPTURING;
    for (let i = 0; i < composedPath.length - 1; i++) {
      event.currentTarget = composedPath[i];
      this.notifyTarget(event);
      if (event.propagationStopped) {
        return;
      }
    }

    // 然后是at target阶段
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

    // 最后是冒泡阶段
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
