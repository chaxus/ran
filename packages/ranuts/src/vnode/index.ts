import { init } from './init';
import { addNS, h } from './h';
import { vnode } from './vnode';
// Chain used to have a separate copy in ./chainDom that lacked SVG namespace support and
// listener management. Both now share utils/chain, and this entry exports the fuller one
// (a backwards-compatible superset).
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
