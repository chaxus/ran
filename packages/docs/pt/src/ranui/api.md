---
title: API de elementos do ranui
description: Todos os custom elements do ranui: 40 elementos com seus atributos, propriedades, eventos, slots e nomes de ::part(), extraídos do código-fonte.
---

# API de elementos do ranui (gerada)

Gerada automaticamente a partir do código dos componentes por `pnpm -F ranui doc:api`, de
modo que não pode divergir do que é publicado. Referência por elemento de atributos,
propriedades tipadas, eventos (com o formato do `detail` e as opções de despacho), slots e
nomes de `::part()`. As descrições são extraídas do JSDoc do código, portanto permanecem
em inglês.

Para as variáveis CSS que cada elemento expõe, veja
[style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md); para escolher entre elas, o
[design system](/pt/src/ranui/design-system/) e as
[diretrizes de design](/pt/src/ranui/design-guides/). O uso de cada elemento fica na página
dele na barra lateral; aqui está toda a superfície em um só lugar.

Cada evento informa as opções com que é despachado: `bubbles`, `composed` (cruza a
fronteira do shadow DOM) e `cancelable` (`preventDefault()` o veta). **`element-only`**
significa nenhuma das três — um ouvinte delegado num ancestral nunca verá esse evento,
então ligue-o ao próprio elemento.

**40 custom elements.**

## `<r-attachments>`

Código-fonte: `components/attachments/index.ts`

- **Atributos**: `sheet: string`
- **Propriedades**:
  - `accept: string` — Comma-separated types or extensions, in the form `<input accept>` takes.
  - `attachments: readonly Attachment[]` — The staged files, in the order they arrived.
  - `files: File[]` — Just the files, for building a request body.
  - `maxCount: number` — Most files that may be staged at once; unlimited when unset.
  - `maxSize: number` — Largest file accepted, in bytes.
  - `sheet: string`
- **Eventos**:
  - `attachmentrejected` · bubbles, composed · detail `{ file, reason }`
  - `attachmentschange` · bubbles, composed · detail `{ attachments }`
- **Slots**: —
- **Partes**: `attachment`, `icon`, `list`, `name`, `remove`, `size`, `thumb`

## `<r-button>`

Código-fonte: `components/button/index.ts`

- **Atributos**: `aria-label`, `disabled: boolean | string`, `effect: boolean`, `icon: string`, `iconSize: string`, `sheet: string`, `type: string`
- **Propriedades**:
  - `disabled: boolean | string`
  - `effect: boolean` — Whether the click ripple is drawn. On by default; opt out with `effect="false"`.
  - `icon: string`
  - `iconSize: string`
  - `sheet: string`
  - `type: string` — Visual variant: `''` (default) | `'primary'` (monochrome) | `'warning'` | `'text'`. Drives the `:host([type=...])` styles.
- **Eventos**: —
- **Slots**: `padrão`
- **Partes**: `button`, `content`

## `<r-card>`

Código-fonte: `components/card/index.ts`

- **Atributos**: `description: string`, `heading: string`, `hoverable: boolean`, `sheet: string`
- **Propriedades**:
  - `description: string`
  - `heading: string` — Heading text.
  - `hoverable: boolean` — Interactive card (Geist): hover darkens the border and lifts to the elevated shadow tier. Purely presentational — gate it to cards that are actually clickable.
  - `sheet: string`
- **Eventos**: —
- **Slots**: `padrão`, `extra (nomeado)`, `footer (nomeado)`
- **Partes**: `body`, `card`, `description`, `extra`, `footer`, `header`, `title`

## `<r-checkbox>`

Código-fonte: `components/checkbox/index.ts`

- **Atributos**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `value: string`
- **Propriedades**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `validationMessage: string`, `validity: ValidityState | undefined`, `value: string`
- **Eventos**:
  - `change` · element-only · detail `{ checked }`
- **Slots**: `padrão`
- **Partes**: `checkbox`, `inner`, `input`, `label`, `wrapper`

## `<r-colorpicker>`

Código-fonte: `components/colorpicker/index.ts`

- **Atributos**: `alpha-label`, `disabled: boolean`, `hue-label`, `label: string`, `sheet: string`, `value: string`
- **Propriedades**:
  - `alphaLabel: string` — Accessible name of the opacity slider.
  - `disabled: boolean`
  - `hueLabel: string` — Accessible name of the hue slider.
  - `label: string` — Accessible name of the swatch that opens the picker. An attribute rather than a
  - `sheet: string`
  - `value: string`
- **Eventos**:
  - `change` · bubbles, composed
- **Slots**: —
- **Partes**: `block`, `swatch`

## `<r-content>`

Código-fonte: `components/popover/content/index.ts`

- **Atributos**: —
- **Propriedades**: —
- **Eventos**:
  - `change` · element-only
- **Slots**: `padrão`
- **Partes**: —

## `<r-conversation>`

Código-fonte: `components/conversation/index.ts`

- **Atributos**: `empty: string`, `follow: boolean`, `loading-older`, `older: string`, `sheet: string`
- **Propriedades**:
  - `empty: string` — Text shown while the projection has produced no rows.
  - `follow: boolean` — Whether new content is followed until the reader scrolls away from the floor.
  - `loadingOlder: boolean` — Whether a page is in flight; the affordance stays visible and goes inert.
  - `older: string` — Label for the paging affordance above the first row. Empty hides it.
  - `pinned: boolean` — Whether the view is currently following new content.
  - `sheet: string`
- **Eventos**:
  - `olderrequest` · bubbles, composed
  - `pinnedchange` · bubbles, composed · detail `{ pinned }`
- **Slots**: `footer (nomeado)`
- **Partes**: `conversation`, `empty`, `footer`, `list`, `older`

## `<r-disclosure-row>`

Código-fonte: `components/disclosure-row/index.ts`

- **Atributos**: `busy: boolean`, `expandable: boolean`, `heading: string`, `name: string`, `open: boolean`, `sheet: string`, `summary: string`, `tone: string`
- **Propriedades**:
  - `busy: boolean` — Whether the work this row stands for is still running.
  - `expandable: boolean` — Whether the row has a body worth opening.
  - `heading: string` — The fixed-width left half of the line.
  - `name: string` — Groups rows so that opening one closes the rest.
  - `open: boolean` — Whether the body is shown.
  - `sheet: string`
  - `summary: string` — The truncating right half. Empty drops the separator with it.
  - `tone: string` — `error` colours the summary; anything else is the ordinary tone.
- **Eventos**:
  - `disclosurebeforetoggle` · bubbles, composed, cancelable · detail `{ open }`
  - `disclosuretoggle` · bubbles, composed · detail `{ open }`
- **Slots**: `padrão`, `leading (nomeado)`
- **Partes**: `body`, `disclosure`, `leading`, `row`, `separator`, `summary`, `title`

## `<r-dropdown>`

Código-fonte: `components/dropdown/index.ts`

- **Atributos**: `arrow: string`, `sheet: string`, `transit: string`
- **Propriedades**: `arrow: string`, `sheet: string`, `transit: string`
- **Eventos**: —
- **Slots**: `padrão`
- **Partes**: `dropdown`

## `<r-dropdown-item>`

Código-fonte: `components/select/dropdown-item/index.ts`

- **Atributos**: `active: string`, `sheet: string`, `title: string`, `value: string`
- **Propriedades**: `active: string`, `sheet: string`, `title: string`, `value: string`
- **Eventos**: —
- **Slots**: `padrão`
- **Partes**: `content`, `item`

## `<r-glass>`

Código-fonte: `components/glass/index.ts`

- **Atributos**: `blur`, `displace: string`, `frequency: string`, `interactive: boolean`, `radius: string`, `rim: boolean`, `saturate: string`, `tint: string`
- **Propriedades**:
  - `displace: string` — Liquid refraction strength — the SVG displacement scale. `0` is a flat pane.
  - `frequency: string` — Turbulence base frequency — smaller = larger, smoother liquid ripples.
  - `interactive: boolean` — Hover lift + press-scale feedback, for clickable glass. Also makes the host
  - `radius: string` — Corner radius, in px.
  - `rim: boolean` — Opt-in GPU specular rim + chromatic edge, lit from a fixed top-left light —
  - `saturate: string` — Backdrop saturation, as a percentage number (e.g. `180`).
  - `sheen: boolean` — Animated specular sweep across the surface.
  - `tint: string` — Glass fill tint (any CSS background value).
- **Eventos**: —
- **Slots**: `padrão`
- **Partes**: `glass`, `specular`

## `<r-icon>`

Código-fonte: `components/icon/index.ts`

- **Atributos**: `aria-label`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
- **Propriedades**: `ariaLabel: string`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
- **Eventos**:
  - `ranui-icon-registered` · element-only · detail `{ name }`
- **Slots**: —
- **Partes**: `ran-icon`

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

Código-fonte: `components/image/index.ts`

- **Atributos**: —
- **Propriedades**:
  - `alt` — Alternative text forwarded to the inner `<img>`. Defaults to `''` (empty),
  - `fallback`
  - `sheet`
- **Eventos**: —
- **Slots**: —
- **Partes**: —

## `<r-input>`

Código-fonte: `components/input/index.ts`

- **Atributos**: `disabled: boolean`, `icon: string`, `label: string`, `max: string`, `message: string`, `min: string`, `name: string`, `placeholder: string`, `required: boolean`, `sheet: string`, `status: string`, `step: string`, `type: string`, `value: string`
- **Propriedades**:
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
- **Eventos**:
  - `change` · element-only · detail `{ value }`
  - `input` · element-only · detail `{ value }`
- **Slots**: —
- **Partes**: `content`, `input`, `label`, `message`

## `<r-link>`

Código-fonte: `components/link/index.ts`

- **Atributos**: `href: string`, `replace: boolean`, `sheet: string`
- **Propriedades**: `href: string`, `replace: boolean`, `sheet: string`
- **Eventos**:
  - `ran-navigate` · bubbles, composed · detail `{ path, replace }`
- **Slots**: —
- **Partes**: —

## `<r-loading>`

Código-fonte: `components/loading/index.ts`

- **Atributos**: `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`, `sheet: string`
- **Propriedades**: `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`, `sheet: string`
- **Eventos**: —
- **Slots**: —
- **Partes**: —

## `<r-markdown>`

Código-fonte: `components/markdown/index.ts`

- **Atributos**: `caret: string`, `content: string`, `copy`, `download`, `highlight: string | null`, `inline-math`, `line-numbers`, `link-target`, `mode: string`, `sheet: string`, `theme: string`
- **Propriedades**:
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
- **Eventos**:
  - `copied` · bubbles, composed · detail `{ code, kind, language }`
  - `download` · bubbles, composed · detail `{ filename, kind, language }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ blocks, changed }`
- **Slots**: —
- **Partes**: `block`, `body`, `error`, `markdown`

## `<r-math>`

Código-fonte: `components/math/index.ts`

- **Atributos**: `copy`, `display: string`, `download`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **Propriedades**: `copyable: boolean`, `copyTarget: 'source' | 'mathml'`, `display: string`, `downloadable: boolean`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **Eventos**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ ok }`
- **Slots**: —
- **Partes**: `button`, `error`, `math`, `menu`, `render`, `toolbar`

## `<r-mermaid>`

Código-fonte: `components/mermaid/index.ts`

- **Atributos**: `code: string`, `copy`, `download`, `fullscreen`, `sheet: string`, `theme: string`
- **Propriedades**: `code: string`, `copyable: boolean`, `downloadable: boolean`, `fullscreenable: boolean`, `sheet: string`, `theme: string`
- **Eventos**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `fullscreenchange` · bubbles, composed · detail `{ open }`
  - `render` · bubbles, composed · detail `{ ok }`
- **Slots**: —
- **Partes**: `button`, `diagram`, `error`, `menu`, `mermaid`, `toolbar`

## `<r-message>`

Código-fonte: `components/message/index.ts`

- **Atributos**: —
- **Propriedades**: `content: string | null`, `sheet: string`, `type: string | null`
- **Eventos**: —
- **Slots**: —
- **Partes**: —

## `<r-modal>`

Código-fonte: `components/modal/index.ts`

- **Atributos**: `autoFocus: boolean`, `closable: boolean`, `closeOnEsc: boolean`, `heading: string`, `hide-header`, `lockScroll: boolean`, `maskClosable: boolean`, `open: boolean`, `sheet: string`
- **Propriedades**:
  - `autoFocus: boolean`
  - `closable: boolean`
  - `closeOnEsc: boolean`
  - `heading: string` — Heading text.
  - `hideHeader: boolean` — Headerless mode: drops the title bar and its border, leaving only a floating
  - `lockScroll: boolean`
  - `maskClosable: boolean`
  - `open: boolean`
  - `sheet: string`
- **Eventos**:
  - `afterclose` · element-only · detail `{ trigger }`
  - `afteropen` · element-only
  - `beforeclose` · cancelable · detail `{ trigger }`
  - `beforeopen` · cancelable
  - `close` · element-only · detail `{ trigger }`
  - `open` · element-only
- **Slots**: `padrão`, `footer (nomeado)`
- **Partes**: `body`, `close`, `dialog`, `footer`, `header`, `mask`, `root`, `title`

## `<r-option>`

Código-fonte: `components/select/option/index.ts`

- **Atributos**: —
- **Propriedades**: `disabled: boolean | string | undefined | null`, `sheet`, `value`
- **Eventos**: —
- **Slots**: `padrão`
- **Partes**: —

## `<r-player>`

Código-fonte: `components/player/index.ts`

- **Atributos**: `autoplay: boolean`, `currenttime`, `currentTime: string`, `debug: string`, `disable-error-modal`, `format: string`, `loop: boolean`, `muted: boolean`, `playbackrate`, `playbackRate: string`, `poster: string`, `remember-position`, `sheet: string`, `src: string`, `thumbnails: string`, `volume: string`
- **Propriedades**:
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
- **Eventos**:
  - `change` · element-only · detail `{ currentTime, data, duration, tag, type }`
- **Slots**: —
- **Partes**: —

## `<r-popover>`

Código-fonte: `components/popover/index.ts`

- **Atributos**: `open: boolean`, `placement: Placement`, `sheet: string`, `trigger: string`
- **Propriedades**:
  - `getPopupContainerId: string`
  - `open: boolean` — Whether the panel is showing.
  - `placement: Placement` — Which side of the trigger the panel sits on, with an optional alignment.
  - `sheet: string`
  - `trigger: string`
- **Eventos**:
  - `after-hide` · element-only
  - `after-show` · element-only
  - `hide` · element-only
  - `show` · element-only
- **Slots**: `padrão`
- **Partes**: —

## `<r-progress>`

Código-fonte: `components/progress/index.ts`

- **Atributos**: `drag`, `primary`
- **Propriedades**: `dot: string`, `percent: string`, `sheet: string`, `total: string`, `type: string`
- **Eventos**:
  - `change` · element-only · detail `{ percent, total, value }`
- **Slots**: —
- **Partes**: `dot`, `fill`, `track`

## `<r-radar>`

Código-fonte: `components/radar/index.ts`

- **Atributos**: —
- **Propriedades**: `abilitys`, `colorLine`, `colorPolygon`, `fillColor`, `fontColor`, `sheet`, `strokeColor`
- **Eventos**: —
- **Slots**: —
- **Partes**: —

## `<r-reasoning>`

Código-fonte: `components/reasoning/index.ts`

- **Atributos**: `duration: number | null`, `label: string`, `open: boolean`, `sheet: string`, `streaming: boolean`
- **Propriedades**:
  - `content: string` — The reasoning text. Assigning repeatedly is the streaming path.
  - `duration: number | null` — How long the model spent, in milliseconds. Rendered beside the label when set.
  - `label: string` — Summary text. Defaults to `Reasoning`.
  - `open: boolean` — Whether the body is expanded.
  - `sheet: string`
  - `streaming: boolean` — Whether reasoning is still arriving.
- **Eventos**: —
- **Slots**: `padrão`
- **Partes**: `body`, `row`, `text`

## `<r-route>`

Código-fonte: `components/route/index.ts`

- **Atributos**: `exact: boolean`, `path: string`, `sheet: string`, `src: string`
- **Propriedades**:
  - `exact: boolean`
  - `params: Record<string, string>`
  - `path: string`
  - `sheet: string`
  - `src: string` — Module specifier for lazy, code-split, mount/unmount page rendering.
- **Eventos**:
  - `routematch` · bubbles · detail `{ params, path }`
- **Slots**: `padrão`
- **Partes**: —

## `<r-router>`

Código-fonte: `components/router/index.ts`

- **Atributos**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **Propriedades**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **Eventos**:
  - `routechange` · bubbles · detail `{ path }`
- **Slots**: `padrão`
- **Partes**: —

## `<r-scratch>`

Código-fonte: `components/scratch/index.ts`

- **Atributos**: `disabled: boolean`, `sheet: string`
- **Propriedades**: `disabled: boolean`, `sheet: string`
- **Eventos**: —
- **Slots**: `padrão`
- **Partes**: `award`

## `<r-section>`

Código-fonte: `components/section/index.ts`

- **Atributos**: `heading: string`, `sheet: string`, `subtitle: string`
- **Propriedades**: `heading: string`, `sheet: string`, `subtitle: string`
- **Eventos**: —
- **Slots**: `padrão`
- **Partes**: `body`, `header`, `heading`, `subtitle`

## `<r-select>`

Código-fonte: `components/select/index.ts`

- **Atributos**: `defaultvalue`, `disabled: boolean`, `dropdownclass: string`, `getpopupcontainerid`, `label: string`, `open: boolean`, `placement: Placement`, `required: boolean`, `sheet: string`, `showsearch`, `trigger: string`, `type: string`, `value: string`
- **Propriedades**:
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
- **Eventos**:
  - `after-hide` · element-only
  - `after-show` · element-only
  - `change` · element-only · detail `{ label, value }`
  - `hide` · element-only
  - `search` · element-only · detail `{ value }`
  - `show` · element-only
- **Slots**: `padrão`
- **Partes**: `icon`, `label`, `search`, `select`, `selection`, `selection-item`

## `<r-skeleton>`

Código-fonte: `components/skeleton/index.ts`

- **Atributos**: `sheet: string`
- **Propriedades**: `sheet: string`
- **Eventos**: —
- **Slots**: —
- **Partes**: —

## `<r-state-dot>`

Código-fonte: `components/state-dot/index.ts`

- **Atributos**: `label: string`, `sheet: string`, `state: 'idle' | 'running' | 'success' | 'warning' | 'error'`
- **Propriedades**:
  - `label: string` — Accessible name.
  - `sheet: string`
  - `state: 'idle' | 'running' | 'success' | 'warning' | 'error'` — Which lifecycle step to show. Unknown values render as `idle`.
- **Eventos**: —
- **Slots**: —
- **Partes**: `dot`

## `<r-tab>`

Código-fonte: `components/tabpane/index.ts`

- **Atributos**: —
- **Propriedades**: `disabled`, `effect`, `icon`, `iconSize`, `key`, `label`, `sheet`
- **Eventos**: —
- **Slots**: `padrão`
- **Partes**: `content`

## `<r-tabs>`

Código-fonte: `components/tab/index.ts`

- **Atributos**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **Propriedades**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **Eventos**:
  - `change` · element-only · detail `{ active }`
- **Slots**: `padrão`
- **Partes**: `content`, `content-wrap`, `header`, `indicator`, `nav`, `tabs`

## `<r-theme-switch>`

Código-fonte: `components/theme-switch/index.ts`

- **Atributos**: `label-dark`, `label-light`, `label-system`, `sheet: string`
- **Propriedades**:
  - `sheet: string`
  - `value: RanThemeName` — Current selection; falls back to 'system' when nothing is forced.
- **Eventos**:
  - `change` · bubbles, composed · detail `{ theme }`
- **Slots**: —
- **Partes**: `button ${choice}`, `switch`

## `<r-token-meter>`

Código-fonte: `components/token-meter/index.ts`

- **Atributos**: `label: string`, `limit: number`, `sheet: string`, `spent: number`, `used: number`
- **Propriedades**:
  - `label: string` — Prefix for the readout. Defaults to `Context`; an empty string leaves only the counts.
  - `level: 'ok' | 'warn' | 'over'` — How full the window is. Derived; assigning it is overwritten on the next update.
  - `limit: number` — Context window size in tokens. Zero or absent hides the bar and shows only counts.
  - `sheet: string`
  - `spent: number` — Tokens billed across the conversation so far.
  - `used: number` — Tokens the next request will carry — the history, not the whole conversation.
- **Eventos**: —
- **Slots**: —
- **Partes**: `meter`, `text`

## `<r-tool-card>`

Código-fonte: `components/tool-card/index.ts`

- **Atributos**: `open: boolean`, `sheet: string`, `status: ToolCardStatus`
- **Propriedades**:
  - `call: ToolCallView | null` — The pending view, derived from the call's arguments.
  - `open: boolean` — Whether the body is expanded.
  - `result: ToolResultView | null` — The completed view. Replaces the pending one once set.
  - `sheet: string`
  - `status: ToolCardStatus` — Lifecycle of the call, reflected so styling can key off it.
- **Eventos**:
  - `locationclick` · bubbles, composed · detail `{ location }`
- **Slots**: —
- **Partes**: `body`, `exit`, `file`, `hunk`, `io`, `io-text`, `line`, `location`, `locations`, `path`, `row`

## `<r-voice-button>`

Código-fonte: `components/voice-button/index.ts`

- **Atributos**: `active-label`, `cancel-hint`, `cancelling`, `disabled: boolean`, `hold-hint`, `holding`, `label: string`, `listening: boolean`, `sheet: string`
- **Propriedades**:
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
- **Eventos**:
  - `voiceend` · bubbles, composed
  - `voiceerror` · bubbles, composed
  - `voiceresult` · bubbles, composed · detail `{ isFinal, transcript }`
  - `voicestart` · bubbles, composed
- **Slots**: —
- **Partes**: `button`, `hint`, `icon`
