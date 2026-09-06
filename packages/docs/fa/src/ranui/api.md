---
title: API عناصر ranui
description: 'همهٔ عناصر سفارشی ranui — 40 عنصر همراه با ویژگی‌ها، خصیصه‌ها، رویدادها، اسلات‌ها و نام‌های ()::part، همگی استخراج‌شده از کد منبع.'
---

# API عناصر ranui (تولید خودکار)

این صفحه را `pnpm -F ranui doc:api` از کد منبع کامپوننت‌ها می‌سازد، بنابراین هرگز از آنچه
منتشر می‌شود جدا نمی‌افتد. برای هر عنصر: ویژگی‌ها، خصیصه‌های تایپ‌شده، رویدادها (همراه با
ساختار `detail` و گزینه‌های ارسال)، اسلات‌ها و نام‌های `()::part`. توضیح‌ها مستقیم از JSDoc
کد برداشته می‌شوند و به همین دلیل انگلیسی می‌مانند.

متغیرهای CSS هر عنصر در
[style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md) آمده است؛ برای انتخاب میان آن‌ها
[سیستم طراحی](/fa/src/ranui/design-system/) و [راهنمای طراحی](/fa/src/ranui/design-guides/) را ببینید.
شیوهٔ استفاده از هر عنصر در صفحهٔ خودش در نوار کناری است؛ اینجا کل سطح رابط یک‌جا آمده.

برای هر رویداد گزینه‌های ارسال آن نوشته شده است: `bubbles` (حباب‌کردن)، `composed` (عبور از
مرز Shadow) و `cancelable` (امکان وتو با `preventDefault()`). **`element-only`** یعنی هیچ‌کدام
از این سه — شنوندهٔ واگذارشده روی یک گره والد هرگز آن را نمی‌بیند، پس شنونده را به خود عنصر ببندید.

**40 عنصر سفارشی.**

## `<r-attachments>`

کد منبع: `components/attachments/index.ts`

- **ویژگی‌ها (attribute)**: `sheet: string`
- **خصیصه‌ها (property)**:
  - `accept: string` — Comma-separated types or extensions, in the form `<input accept>` takes.
  - `attachments: readonly Attachment[]` — The staged files, in the order they arrived.
  - `files: File[]` — Just the files, for building a request body.
  - `maxCount: number` — Most files that may be staged at once; unlimited when unset.
  - `maxSize: number` — Largest file accepted, in bytes.
  - `sheet: string`
- **رویدادها**:
  - `attachmentrejected` · bubbles, composed · detail `{ file, reason }`
  - `attachmentschange` · bubbles, composed · detail `{ attachments }`
- **اسلات‌ها**: —
- **Part‌ها**: `attachment`, `icon`, `list`, `name`, `remove`, `size`, `thumb`

## `<r-button>`

کد منبع: `components/button/index.ts`

- **ویژگی‌ها (attribute)**: `aria-label`, `disabled: boolean | string`, `effect: boolean`, `icon: string`, `iconSize: string`, `sheet: string`, `type: string`
- **خصیصه‌ها (property)**:
  - `disabled: boolean | string`
  - `effect: boolean` — Whether the click ripple is drawn. On by default; opt out with `effect="false"`.
  - `icon: string`
  - `iconSize: string`
  - `sheet: string`
  - `type: string` — Visual variant: `''` (default) | `'primary'` (monochrome) | `'warning'` | `'text'`. Drives the `:host([type=...])` styles.
- **رویدادها**: —
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: `button`, `content`

## `<r-card>`

کد منبع: `components/card/index.ts`

- **ویژگی‌ها (attribute)**: `description: string`, `heading: string`, `hoverable: boolean`, `sheet: string`
- **خصیصه‌ها (property)**:
  - `description: string`
  - `heading: string` — Heading text.
  - `hoverable: boolean` — Interactive card (Geist): hover darkens the border and lifts to the elevated shadow tier. Purely presentational — gate it to cards that are actually clickable.
  - `sheet: string`
- **رویدادها**: —
- **اسلات‌ها**: `پیش‌فرض`, `extra (نام‌دار)`, `footer (نام‌دار)`
- **Part‌ها**: `body`, `card`, `description`, `extra`, `footer`, `header`, `title`

## `<r-checkbox>`

کد منبع: `components/checkbox/index.ts`

- **ویژگی‌ها (attribute)**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `value: string`
- **خصیصه‌ها (property)**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `validationMessage: string`, `validity: ValidityState | undefined`, `value: string`
- **رویدادها**:
  - `change` · element-only · detail `{ checked }`
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: `checkbox`, `inner`, `input`, `label`, `wrapper`

## `<r-colorpicker>`

کد منبع: `components/colorpicker/index.ts`

- **ویژگی‌ها (attribute)**: `alpha-label`, `disabled: boolean`, `hue-label`, `label: string`, `sheet: string`, `value: string`
- **خصیصه‌ها (property)**:
  - `alphaLabel: string` — Accessible name of the opacity slider.
  - `disabled: boolean`
  - `hueLabel: string` — Accessible name of the hue slider.
  - `label: string` — Accessible name of the swatch that opens the picker. An attribute rather than a
  - `sheet: string`
  - `value: string`
- **رویدادها**:
  - `change` · bubbles, composed
- **اسلات‌ها**: —
- **Part‌ها**: `block`, `swatch`

## `<r-content>`

کد منبع: `components/popover/content/index.ts`

- **ویژگی‌ها (attribute)**: —
- **خصیصه‌ها (property)**: —
- **رویدادها**:
  - `change` · element-only
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: —

## `<r-conversation>`

کد منبع: `components/conversation/index.ts`

- **ویژگی‌ها (attribute)**: `empty: string`, `follow: boolean`, `loading-older`, `older: string`, `sheet: string`
- **خصیصه‌ها (property)**:
  - `empty: string` — Text shown while the projection has produced no rows.
  - `follow: boolean` — Whether new content is followed until the reader scrolls away from the floor.
  - `loadingOlder: boolean` — Whether a page is in flight; the affordance stays visible and goes inert.
  - `older: string` — Label for the paging affordance above the first row. Empty hides it.
  - `pinned: boolean` — Whether the view is currently following new content.
  - `sheet: string`
- **رویدادها**:
  - `olderrequest` · bubbles, composed
  - `pinnedchange` · bubbles, composed · detail `{ pinned }`
- **اسلات‌ها**: `footer (نام‌دار)`
- **Part‌ها**: `conversation`, `empty`, `footer`, `list`, `older`

## `<r-disclosure-row>`

کد منبع: `components/disclosure-row/index.ts`

- **ویژگی‌ها (attribute)**: `busy: boolean`, `expandable: boolean`, `heading: string`, `name: string`, `open: boolean`, `sheet: string`, `summary: string`, `tone: string`
- **خصیصه‌ها (property)**:
  - `busy: boolean` — Whether the work this row stands for is still running.
  - `expandable: boolean` — Whether the row has a body worth opening.
  - `heading: string` — The fixed-width left half of the line.
  - `name: string` — Groups rows so that opening one closes the rest.
  - `open: boolean` — Whether the body is shown.
  - `sheet: string`
  - `summary: string` — The truncating right half. Empty drops the separator with it.
  - `tone: string` — `error` colours the summary; anything else is the ordinary tone.
- **رویدادها**:
  - `disclosurebeforetoggle` · bubbles, composed, cancelable · detail `{ open }`
  - `disclosuretoggle` · bubbles, composed · detail `{ open }`
- **اسلات‌ها**: `پیش‌فرض`, `leading (نام‌دار)`
- **Part‌ها**: `body`, `disclosure`, `leading`, `row`, `separator`, `summary`, `title`

## `<r-dropdown>`

کد منبع: `components/dropdown/index.ts`

- **ویژگی‌ها (attribute)**: `arrow: string`, `sheet: string`, `transit: string`
- **خصیصه‌ها (property)**: `arrow: string`, `sheet: string`, `transit: string`
- **رویدادها**: —
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: `dropdown`

## `<r-dropdown-item>`

کد منبع: `components/select/dropdown-item/index.ts`

- **ویژگی‌ها (attribute)**: `active: string`, `sheet: string`, `title: string`, `value: string`
- **خصیصه‌ها (property)**: `active: string`, `sheet: string`, `title: string`, `value: string`
- **رویدادها**: —
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: `content`, `item`

## `<r-glass>`

کد منبع: `components/glass/index.ts`

- **ویژگی‌ها (attribute)**: `blur`, `displace: string`, `frequency: string`, `interactive: boolean`, `radius: string`, `rim: boolean`, `saturate: string`, `tint: string`
- **خصیصه‌ها (property)**:
  - `displace: string` — Liquid refraction strength — the SVG displacement scale. `0` is a flat pane.
  - `frequency: string` — Turbulence base frequency — smaller = larger, smoother liquid ripples.
  - `interactive: boolean` — Hover lift + press-scale feedback, for clickable glass. Also makes the host
  - `radius: string` — Corner radius, in px.
  - `rim: boolean` — Opt-in GPU specular rim + chromatic edge, lit from a fixed top-left light —
  - `saturate: string` — Backdrop saturation, as a percentage number (e.g. `180`).
  - `sheen: boolean` — Animated specular sweep across the surface.
  - `tint: string` — Glass fill tint (any CSS background value).
- **رویدادها**: —
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: `glass`, `specular`

## `<r-icon>`

کد منبع: `components/icon/index.ts`

- **ویژگی‌ها (attribute)**: `aria-label`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
- **خصیصه‌ها (property)**: `ariaLabel: string`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
- **رویدادها**:
  - `ranui-icon-registered` · element-only · detail `{ name }`
- **اسلات‌ها**: —
- **Part‌ها**: `ran-icon`

> **Requires registration.** `<r-icon>` has no built-in icon set — it renders only SVGs
> registered into its in-memory registry, so `<r-icon name="lock">` is **blank** until `lock`
> is registered. Register once, in the browser, before the first `<r-icon>` connects:
>
> ```ts
> import { registerBuiltinIcons } from 'ranui';       // or 'ranui/icons'
> registerBuiltinIcons(); // registers every name in RAN_ICON_NAMES
> ```
>
> For a custom set, call `registerIcon(name, svgString)` / `registerIcons({ … })`, or pass raw
> SVG markup straight to `name` (rendered as-is when it starts with `<svg`). Valid bundled
> names are the `RanIconName` union / `RAN_ICON_NAMES` tuple.

## `<r-img>`

کد منبع: `components/image/index.ts`

- **ویژگی‌ها (attribute)**: —
- **خصیصه‌ها (property)**:
  - `alt` — Alternative text forwarded to the inner `<img>`. Defaults to `''` (empty),
  - `fallback`
  - `sheet`
- **رویدادها**: —
- **اسلات‌ها**: —
- **Part‌ها**: —

## `<r-input>`

کد منبع: `components/input/index.ts`

- **ویژگی‌ها (attribute)**: `disabled: boolean`, `icon: string`, `label: string`, `max: string`, `message: string`, `min: string`, `name: string`, `placeholder: string`, `required: boolean`, `sheet: string`, `status: string`, `step: string`, `type: string`, `value: string`
- **خصیصه‌ها (property)**:
  - `disabled: boolean` — input 上 disabled 属性
  - `icon: string` — 一个 icon
  - `label: string` — 字段上方的静态说明文字（label）。
  - `max: string` — 当 input 类型为 number 类型时，可以获取 max 属性
  - `message: string` — 下方的提示/校验文案
  - `min: string` — 当 input 类型为 number 类型时，可以获取 min 属性
  - `name: string` — 与 form 组件联动时，收集的属性名
  - `placeholder: string` — input 的占位字符
  - `required: boolean` — input 是否为必选
  - `sheet: string`
  - `status: string` — input 框的状态
  - `step: string` — 当 input 类型为 number 类型时，可以获取 step 属性
  - `type: string` — input 的类型
  - `validationMessage: string`
  - `validity: ValidityState | undefined`
  - `value: string` — input 的值
- **رویدادها**:
  - `change` · element-only · detail `{ value }`
  - `input` · element-only · detail `{ value }`
- **اسلات‌ها**: —
- **Part‌ها**: `content`, `input`, `label`, `message`

## `<r-link>`

کد منبع: `components/link/index.ts`

- **ویژگی‌ها (attribute)**: `href: string`, `replace: boolean`, `sheet: string`
- **خصیصه‌ها (property)**: `href: string`, `replace: boolean`, `sheet: string`
- **رویدادها**:
  - `ran-navigate` · bubbles, composed · detail `{ path, replace }`
- **اسلات‌ها**: —
- **Part‌ها**: —

## `<r-loading>`

کد منبع: `components/loading/index.ts`

- **ویژگی‌ها (attribute)**: `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`, `sheet: string`
- **خصیصه‌ها (property)**: `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`, `sheet: string`
- **رویدادها**: —
- **اسلات‌ها**: —
- **Part‌ها**: —

## `<r-markdown>`

کد منبع: `components/markdown/index.ts`

- **ویژگی‌ها (attribute)**: `caret: string`, `content: string`, `copy`, `download`, `highlight: string | null`, `inline-math`, `line-numbers`, `link-target`, `mode: string`, `sheet: string`, `theme: string`
- **خصیصه‌ها (property)**:
  - `caret: string`
  - `content: string` — Markdown source. Resolution order: the `content` property (set via JS, not
  - `copyable: boolean`
  - `downloadable: boolean`
  - `highlight: string | null` — `""` → github-light/github-dark; `"a"` → both; `"a b"` → light / dark theme.
  - `inlineMath: boolean`
  - `lineNumbers: boolean`
  - `linkTarget: string`
  - `mode: string`
  - `sheet: string`
  - `theme: string`
- **رویدادها**:
  - `copied` · bubbles, composed · detail `{ code, kind, language }`
  - `download` · bubbles, composed · detail `{ filename, kind, language }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ blocks, changed }`
- **اسلات‌ها**: —
- **Part‌ها**: `block`, `body`, `error`, `markdown`

## `<r-math>`

کد منبع: `components/math/index.ts`

- **ویژگی‌ها (attribute)**: `copy`, `display: string`, `download`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **خصیصه‌ها (property)**: `copyable: boolean`, `copyTarget: 'source' | 'mathml'`, `display: string`, `downloadable: boolean`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **رویدادها**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ ok }`
- **اسلات‌ها**: —
- **Part‌ها**: `button`, `error`, `math`, `menu`, `render`, `toolbar`

## `<r-mermaid>`

کد منبع: `components/mermaid/index.ts`

- **ویژگی‌ها (attribute)**: `code: string`, `copy`, `download`, `fullscreen`, `sheet: string`, `theme: string`
- **خصیصه‌ها (property)**: `code: string`, `copyable: boolean`, `downloadable: boolean`, `fullscreenable: boolean`, `sheet: string`, `theme: string`
- **رویدادها**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `fullscreenchange` · bubbles, composed · detail `{ open }`
  - `render` · bubbles, composed · detail `{ ok }`
- **اسلات‌ها**: —
- **Part‌ها**: `button`, `diagram`, `error`, `menu`, `mermaid`, `toolbar`

## `<r-message>`

کد منبع: `components/message/index.ts`

- **ویژگی‌ها (attribute)**: —
- **خصیصه‌ها (property)**: `content: string | null`, `sheet: string`, `type: string | null`
- **رویدادها**: —
- **اسلات‌ها**: —
- **Part‌ها**: —

## `<r-modal>`

کد منبع: `components/modal/index.ts`

- **ویژگی‌ها (attribute)**: `autoFocus: boolean`, `closable: boolean`, `closeOnEsc: boolean`, `heading: string`, `hide-header`, `lockScroll: boolean`, `maskClosable: boolean`, `open: boolean`, `sheet: string`
- **خصیصه‌ها (property)**:
  - `autoFocus: boolean`
  - `closable: boolean`
  - `closeOnEsc: boolean`
  - `heading: string` — Heading text.
  - `hideHeader: boolean` — Headerless mode: drops the title bar and its border, leaving only a floating
  - `lockScroll: boolean`
  - `maskClosable: boolean`
  - `open: boolean`
  - `sheet: string`
- **رویدادها**:
  - `afterclose` · element-only · detail `{ trigger }`
  - `afteropen` · element-only
  - `beforeclose` · cancelable · detail `{ trigger }`
  - `beforeopen` · cancelable
  - `close` · element-only · detail `{ trigger }`
  - `open` · element-only
- **اسلات‌ها**: `پیش‌فرض`, `footer (نام‌دار)`
- **Part‌ها**: `body`, `close`, `dialog`, `footer`, `header`, `mask`, `root`, `title`

## `<r-option>`

کد منبع: `components/select/option/index.ts`

- **ویژگی‌ها (attribute)**: —
- **خصیصه‌ها (property)**: `disabled: boolean | string | undefined | null`, `sheet`, `value`
- **رویدادها**: —
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: —

## `<r-player>`

کد منبع: `components/player/index.ts`

- **ویژگی‌ها (attribute)**: `autoplay: boolean`, `currenttime`, `currentTime: string`, `debug: string`, `disable-error-modal`, `format: string`, `loop: boolean`, `muted: boolean`, `playbackrate`, `playbackRate: string`, `poster: string`, `remember-position`, `sheet: string`, `src: string`, `thumbnails: string`, `volume: string`
- **خصیصه‌ها (property)**:
  - `autoplay: boolean`
  - `controllerBarTimeId: ReturnType<typeof setTimeout> | undefined`
  - `currentTime: string`
  - `debug: string`
  - `disableErrorModal: boolean`
  - `format: string` — 强制指定引擎（`hls`/`dash`/`flv`/`webrtc`/`native`），给拿不到扩展名的
  - `loop: boolean`
  - `moveProgress`
  - `muted: boolean`
  - `playbackRate: string`
  - `poster: string`
  - `rememberPosition: boolean`
  - `sheet: string`
  - `src: string`
  - `thumbnails: string` — URL of a WebVTT sprite-sheet manifest (cues whose text is
  - `tracks: PlayerTrackConfig[]` — 字幕/CC 轨道配置，imperative 属性而不是 attribute——player 会在每次
  - `volume: string`
- **رویدادها**:
  - `change` · element-only · detail `{ currentTime, data, duration, tag, type }`
- **اسلات‌ها**: —
- **Part‌ها**: —

## `<r-popover>`

کد منبع: `components/popover/index.ts`

- **ویژگی‌ها (attribute)**: `open: boolean`, `placement: Placement`, `sheet: string`, `trigger: string`
- **خصیصه‌ها (property)**:
  - `getPopupContainerId: string`
  - `open: boolean` — Whether the panel is showing.
  - `placement: Placement` — Which side of the trigger the panel sits on, with an optional alignment.
  - `sheet: string`
  - `trigger: string`
- **رویدادها**:
  - `after-hide` · element-only
  - `after-show` · element-only
  - `hide` · element-only
  - `show` · element-only
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: —

## `<r-progress>`

کد منبع: `components/progress/index.ts`

- **ویژگی‌ها (attribute)**: `drag`, `primary`
- **خصیصه‌ها (property)**: `dot: string`, `percent: string`, `sheet: string`, `total: string`, `type: string`
- **رویدادها**:
  - `change` · element-only · detail `{ percent, total, value }`
- **اسلات‌ها**: —
- **Part‌ها**: `dot`, `fill`, `track`

## `<r-radar>`

کد منبع: `components/radar/index.ts`

- **ویژگی‌ها (attribute)**: —
- **خصیصه‌ها (property)**: `abilitys`, `colorLine`, `colorPolygon`, `fillColor`, `fontColor`, `sheet`, `strokeColor`
- **رویدادها**: —
- **اسلات‌ها**: —
- **Part‌ها**: —

## `<r-reasoning>`

کد منبع: `components/reasoning/index.ts`

- **ویژگی‌ها (attribute)**: `duration: number | null`, `label: string`, `open: boolean`, `sheet: string`, `streaming: boolean`
- **خصیصه‌ها (property)**:
  - `content: string` — The reasoning text. Assigning repeatedly is the streaming path.
  - `duration: number | null` — How long the model spent, in milliseconds. Rendered beside the label when set.
  - `label: string` — Summary text. Defaults to `Reasoning`.
  - `open: boolean` — Whether the body is expanded.
  - `sheet: string`
  - `streaming: boolean` — Whether reasoning is still arriving.
- **رویدادها**: —
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: `body`, `row`, `text`

## `<r-route>`

کد منبع: `components/route/index.ts`

- **ویژگی‌ها (attribute)**: `exact: boolean`, `path: string`, `sheet: string`, `src: string`
- **خصیصه‌ها (property)**:
  - `exact: boolean`
  - `params: Record<string, string>`
  - `path: string`
  - `sheet: string`
  - `src: string` — Module specifier for lazy, code-split, mount/unmount page rendering.
- **رویدادها**:
  - `routematch` · bubbles · detail `{ params, path }`
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: —

## `<r-router>`

کد منبع: `components/router/index.ts`

- **ویژگی‌ها (attribute)**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **خصیصه‌ها (property)**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **رویدادها**:
  - `routechange` · bubbles · detail `{ path }`
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: —

## `<r-scratch>`

کد منبع: `components/scratch/index.ts`

- **ویژگی‌ها (attribute)**: `disabled: boolean`, `sheet: string`
- **خصیصه‌ها (property)**: `disabled: boolean`, `sheet: string`
- **رویدادها**: —
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: `award`

## `<r-section>`

کد منبع: `components/section/index.ts`

- **ویژگی‌ها (attribute)**: `heading: string`, `sheet: string`, `subtitle: string`
- **خصیصه‌ها (property)**: `heading: string`, `sheet: string`, `subtitle: string`
- **رویدادها**: —
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: `body`, `header`, `heading`, `subtitle`

## `<r-select>`

کد منبع: `components/select/index.ts`

- **ویژگی‌ها (attribute)**: `defaultvalue`, `disabled: boolean`, `dropdownclass: string`, `getpopupcontainerid`, `label: string`, `open: boolean`, `placement: Placement`, `required: boolean`, `sheet: string`, `showsearch`, `trigger: string`, `type: string`, `value: string`
- **خصیصه‌ها (property)**:
  - `defaultValue: string`
  - `disabled: boolean`
  - `dropdownclass: string`
  - `getPopupContainerId: string`
  - `label: string` — 字段上方的静态说明文字（label）。
  - `open: boolean` — Whether the dropdown is showing.
  - `placement: Placement` — Which side of the trigger the panel opens on, with an optional alignment.
  - `required: boolean`
  - `sheet: string`
  - `showSearch: string`
  - `trigger: string`
  - `type: string`
  - `validationMessage: string`
  - `validity: ValidityState | undefined`
  - `value: string`
- **رویدادها**:
  - `after-hide` · element-only
  - `after-show` · element-only
  - `change` · element-only · detail `{ label, value }`
  - `hide` · element-only
  - `search` · element-only · detail `{ value }`
  - `show` · element-only
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: `icon`, `label`, `search`, `select`, `selection`, `selection-item`

## `<r-skeleton>`

کد منبع: `components/skeleton/index.ts`

- **ویژگی‌ها (attribute)**: `sheet: string`
- **خصیصه‌ها (property)**: `sheet: string`
- **رویدادها**: —
- **اسلات‌ها**: —
- **Part‌ها**: —

## `<r-state-dot>`

کد منبع: `components/state-dot/index.ts`

- **ویژگی‌ها (attribute)**: `label: string`, `sheet: string`, `state: 'idle' | 'running' | 'success' | 'warning' | 'error'`
- **خصیصه‌ها (property)**:
  - `label: string` — Accessible name.
  - `sheet: string`
  - `state: 'idle' | 'running' | 'success' | 'warning' | 'error'` — Which lifecycle step to show. Unknown values render as `idle`.
- **رویدادها**: —
- **اسلات‌ها**: —
- **Part‌ها**: `dot`

## `<r-tab>`

کد منبع: `components/tabpane/index.ts`

- **ویژگی‌ها (attribute)**: —
- **خصیصه‌ها (property)**: `disabled`, `effect`, `icon`, `iconSize`, `key`, `label`, `sheet`
- **رویدادها**: —
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: `content`

## `<r-tabs>`

کد منبع: `components/tab/index.ts`

- **ویژگی‌ها (attribute)**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **خصیصه‌ها (property)**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **رویدادها**:
  - `change` · element-only · detail `{ active }`
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: `content`, `content-wrap`, `header`, `indicator`, `nav`, `tabs`

## `<r-theme-switch>`

کد منبع: `components/theme-switch/index.ts`

- **ویژگی‌ها (attribute)**: `label-dark`, `label-light`, `label-system`, `sheet: string`
- **خصیصه‌ها (property)**:
  - `sheet: string`
  - `value: RanThemeName` — Current selection; falls back to 'system' when nothing is forced.
- **رویدادها**:
  - `change` · bubbles, composed · detail `{ theme }`
- **اسلات‌ها**: —
- **Part‌ها**: `button ${choice}`, `switch`

## `<r-token-meter>`

کد منبع: `components/token-meter/index.ts`

- **ویژگی‌ها (attribute)**: `label: string`, `limit: number`, `sheet: string`, `spent: number`, `used: number`
- **خصیصه‌ها (property)**:
  - `label: string` — Prefix for the readout. Defaults to `Context`; an empty string leaves only the counts.
  - `level: 'ok' | 'warn' | 'over'` — How full the window is. Derived; assigning it is overwritten on the next update.
  - `limit: number` — Context window size in tokens. Zero or absent hides the bar and shows only counts.
  - `sheet: string`
  - `spent: number` — Tokens billed across the conversation so far.
  - `used: number` — Tokens the next request will carry — the history, not the whole conversation.
- **رویدادها**: —
- **اسلات‌ها**: —
- **Part‌ها**: `meter`, `text`

## `<r-tool-card>`

کد منبع: `components/tool-card/index.ts`

- **ویژگی‌ها (attribute)**: `open: boolean`, `sheet: string`, `status: ToolCardStatus`
- **خصیصه‌ها (property)**:
  - `call: ToolCallView | null` — The pending view, derived from the call's arguments.
  - `open: boolean` — Whether the body is expanded.
  - `result: ToolResultView | null` — The completed view. Replaces the pending one once set.
  - `sheet: string`
  - `status: ToolCardStatus` — Lifecycle of the call, reflected so styling can key off it.
- **رویدادها**:
  - `locationclick` · bubbles, composed · detail `{ location }`
- **اسلات‌ها**: —
- **Part‌ها**: `body`, `exit`, `file`, `hunk`, `io`, `io-text`, `line`, `location`, `locations`, `path`, `row`

## `<r-voice-button>`

کد منبع: `components/voice-button/index.ts`

- **ویژگی‌ها (attribute)**: `active-label`, `cancel-hint`, `cancelling`, `disabled: boolean`, `hold-hint`, `holding`, `label: string`, `listening: boolean`, `sheet: string`
- **خصیصه‌ها (property)**:
  - `activeLabel: string` — Accessible name while listening; the name has to change, not only the icon.
  - `cancelHint: string` — Replaces {@link holdHint} once the finger has slid far enough to discard.
  - `continuous: boolean` — Keep listening across pauses instead of stopping at the first one.
  - `disabled: boolean`
  - `holdHint: string` — Shown above the button while a finger is held down.
  - `label: string` — Accessible name while idle.
  - `lang: string` — Language being spoken, as a BCP 47 tag.
  - `listening: boolean` — Whether a capture is running. Reflected, so `:host([listening])` can style it.
  - `sheet: string`
  - `supported: boolean` — Whether this platform can recognize speech at all.
- **رویدادها**:
  - `voiceend` · bubbles, composed
  - `voiceerror` · bubbles, composed
  - `voiceresult` · bubbles, composed · detail `{ isFinal, transcript }`
  - `voicestart` · bubbles, composed
- **اسلات‌ها**: —
- **Part‌ها**: `button`, `hint`, `icon`
