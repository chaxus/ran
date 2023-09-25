import { attributesModule } from './attributes';
import { classModule } from './class';
import { eventListenersModule } from './listeners';
import { propsModule } from './props';
import { styleModule } from './style';
import type { VNode } from '@/vnode/vnode';

export type ModuleHook = any;

export type Modules = {
  [key: string]: {
    [key: string]: ModuleHook;
  };
};

export const modules: Modules = {
  attributesModule,
  classModule,
  eventListenersModule,
  propsModule,
  styleModule,
};
