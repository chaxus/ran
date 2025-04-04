export enum EventPhase {
  NONE = 0, // 没有事件
  CAPTURING = 1, // 捕获阶段
  AT_TARGET = 2, // 目标阶段
  BUBBLING = 3, // 冒泡阶段
}
