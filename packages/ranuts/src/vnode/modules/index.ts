import { attributesModule } from './attributes';
import { classModule } from './class';
import { eventListenersModule } from './listeners';
import { propsModule } from './props';
import { styleModule } from './style';

export type ModuleHook = any;

export type Modules = Record<string, Record<string, ModuleHook>>;

export const modules: Modules = {
  attributesModule,
  classModule,
  eventListenersModule,
  propsModule,
  styleModule,
};
