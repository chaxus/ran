import { RanElement } from '@/utils/index';
import { Div } from '@/utils/builder';
import {
  mountShadowTree,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { adoptStyles } from '@/utils/style';
import { defineSSR } from '@/utils/ssr-registry';
import type { LoadingVariant } from './types';
// 常用动画同步内置：默认 name=circle，dot 也高频 —— 走同步路径即时渲染，无异步闪烁。
import circleVariant from './variants/circle';
import dotVariant from './variants/dot';

export type { LoadingVariant } from './types';

const isDev = import.meta.env?.DEV ?? false;

export enum ICON_NAME_AMP {
  DOUBLE_BOUNCE = 'double-bounce',
  ROTATE = 'rotate',
  STRETCH = 'stretch',
  CUBE = 'cube',
  DOT = 'dot',
  TRIPLE_BOUNCE = 'triple-bounce',
  SCALE_OUT = 'scale-out',
  CIRCLE = 'circle',
  CIRCLE_LINE = 'circle-line',
  SQUARE = 'square',
  PULSE = 'pulse',
  SOLAR = 'solar',
  CUBE_FOLD = 'cube-fold',
  CIRCLE_FOLD = 'circle-fold',
  CUBE_GRID = 'cube-grid',
  CIRCLE_TURN = 'circle-turn',
  CIRCLE_ROTATE = 'circle-rotate',
  CIRCLE_SPIN = 'circle-spin',
  DOT_BAR = 'dot-bar',
  DOT_CIRCLE = 'dot-circle',
  LINE = 'line',
  DOT_PULSE = 'dot-pulse',
  LINE_SCALE = 'line-scale',
  TEXT = 'text',
  CUBE_DIM = 'cube-dim',
  DOT_LINE = 'dot-line',
  ARC = 'arc',
  DROP = 'drop',
  PACMAN = 'pacman',
}

// 同步内置的核心动画（默认款 + 高频款），命中即无异步开销。
const SYNC_VARIANTS: Record<string, LoadingVariant> = {
  [ICON_NAME_AMP.CIRCLE]: circleVariant,
  [ICON_NAME_AMP.DOT]: dotVariant,
};

// 其余动画按需动态 import —— 每个 variant（JS + 自身 CSS）单独 code-split，
// 只有真正用到 `name` 才会下载。新增动画只需在 variants/ 下加目录，无需改本表。
const variantLoaders = import.meta.glob<LoadingVariant>('./variants/*/index.ts', {
  import: 'default',
});
const LOADERS: Record<string, () => Promise<LoadingVariant>> = {};
for (const [filePath, loader] of Object.entries(variantLoaders)) {
  const match = /\/variants\/([^/]+)\/index\.ts$/.exec(filePath);
  if (match) LOADERS[match[1]] = loader;
}

export class Loading extends RanElement {
  contain: HTMLDivElement;
  _shadowDom: ShadowRoot;
  /** 递增令牌：异步渲染回来时若 name 已变则丢弃，避免竞态覆盖。 */
  private _renderToken = 0;
  /** 最近一次渲染的 Promise，便于测试 await。 */
  _pending: Promise<void> = Promise.resolve();
  static get observedAttributes(): string[] {
    return ['name', 'sheet'];
  }
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this);
    const contain = mountShadowTree(this._shadowDom, () => Div().class('ran-loading').build() as HTMLDivElement);
    this.contain = contain;
  }
  get name(): ICON_NAME_AMP {
    const name = getStringAttribute(this, 'name');
    if (!name) return ICON_NAME_AMP.CIRCLE;
    return name as ICON_NAME_AMP;
  }
  set name(value: string) {
    setStringAttribute(this, 'name', value);
  }
  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }
  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };
  private applyVariant = (variant: LoadingVariant): void => {
    adoptStyles(this._shadowDom, variant.css);
    this.contain.replaceChildren(variant.render());
  };
  createLoading = (): void => {
    const name = this.name;
    const token = ++this._renderToken;
    const sync = SYNC_VARIANTS[name];
    if (sync) {
      this.applyVariant(sync);
      this._pending = Promise.resolve();
      return;
    }
    const loader = LOADERS[name];
    if (!loader) {
      this.contain.replaceChildren();
      if (isDev) console.warn(`[ranui-loading] unknown name: ${name}`);
      this._pending = Promise.resolve();
      return;
    }
    this._pending = loader()
      .then((variant) => {
        // name 在等待期间又变了 → 丢弃这次结果
        if (token !== this._renderToken) return;
        this.applyVariant(variant);
      })
      .catch((err) => {
        if (isDev) console.warn(`[ranui-loading] load failed: ${name}`, err);
      });
  };
  connectedCallback(): void {
    this.handlerExternalCss();
    this.createLoading();
  }
  attributeChangedCallback(k: string, o: string, n: string): void {
    if (o === n) return;
    if (k === 'name') this.createLoading();
    if (k === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-loading', Loading as unknown as new () => HTMLElement);
export default Loading;
