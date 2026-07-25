import { init } from './init';
import { addNS, h } from './h';
import { vnode } from './vnode';
// Chain 曾在 ./chainDom 有一份独立副本，缺少 SVG 命名空间支持和事件监听管理。
// 现在统一到 utils/chain，vnode 入口导出的是能力更全的那一份（向后兼容的超集）。
import { Chain, create } from '@/utils/chain';
import { htmlDomApi } from './htmlDomApi';
import { modules } from './modules';
import { attributesModule } from './modules/attributes';
import { classModule } from './modules/class';
import { eventListenersModule } from './modules/listeners';
import { propsModule } from './modules/props';
import { styleModule } from './modules/style';
import * as is from './is';
import type { ArrayOrElement, Key, VNode, VNodeChildElement, VNodeChildren, VNodeData, VNodes } from './vnode';
import type { Hooks } from './hooks';
import type { DOMAPI, Fragment } from './htmlDomApi';
import type { ModuleHook, Modules } from './modules';

export {
  init,
  h,
  addNS,
  vnode,
  Chain,
  create,
  htmlDomApi,
  modules,
  attributesModule,
  classModule,
  eventListenersModule,
  propsModule,
  styleModule,
  is,
};

export type {
  VNode,
  VNodeData,
  VNodes,
  VNodeChildren,
  VNodeChildElement,
  ArrayOrElement,
  Key,
  Hooks,
  DOMAPI,
  Fragment,
  Modules,
  ModuleHook,
};
