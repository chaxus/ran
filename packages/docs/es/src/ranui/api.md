---
title: API de elementos de ranui
description: 'Todos los custom elements de ranui: 40 elementos con sus atributos, propiedades, eventos, slots y nombres de ::part(), extraídos del código fuente.'
---

# API de elementos de ranui (generada)

Generada automáticamente desde el código de los componentes por `pnpm -F ranui doc:api`, de
modo que no puede desviarse de lo que se publica. Referencia por elemento de atributos,
propiedades tipadas, eventos (con la forma de su `detail` y sus opciones de despacho),
slots y nombres de `::part()`. Las descripciones se extraen del JSDoc del código, así que
permanecen en inglés.

Para las variables CSS que expone cada elemento, consulta
[style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md); para elegir entre ellas, el
[sistema de diseño](/es/src/ranui/design-system/) y la
[guía de diseño](/es/src/ranui/design-guides/). El uso de cada elemento se explica en su
propia página de la barra lateral; esto es la superficie completa en un solo sitio.

Cada evento indica las opciones con las que se despacha: `bubbles`, `composed` (cruza el
límite del shadow DOM) y `cancelable` (`preventDefault()` lo veta). **`element-only`**
significa ninguna de las tres: una escucha delegada en un ancestro nunca verá ese evento,
así que enlázala al elemento mismo.

**40 custom elements.**

## `<r-attachments>`

Código fuente: `components/attachments/index.ts`

- **Atributos**: `sheet: string`
- **Propiedades**:
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

Código fuente: `components/button/index.ts`

- **Atributos**: `aria-label`, `disabled: boolean | string`, `effect: boolean`, `icon: string`, `iconSize: string`, `sheet: string`, `type: string`
- **Propiedades**:
  - `disabled: boolean | string`
  - `effect: boolean` — Whether the click ripple is drawn. On by default; opt out with `effect="false"`.
  - `icon: string`
  - `iconSize: string`
  - `sheet: string`
  - `type: string` — Visual variant: `''` (default) | `'primary'` (monochrome) | `'warning'` | `'text'`. Drives the `:host([type=...])` styles.
- **Eventos**: —
- **Slots**: `por defecto`
- **Partes**: `button`, `content`

## `<r-card>`

Código fuente: `components/card/index.ts`

- **Atributos**: `description: string`, `heading: string`, `hoverable: boolean`, `sheet: string`
- **Propiedades**:
  - `description: string`
  - `heading: string` — Heading text.
  - `hoverable: boolean` — Interactive card (Geist): hover darkens the border and lifts to the elevated shadow tier. Purely presentational — gate it to cards that are actually clickable.
  - `sheet: string`
- **Eventos**: —
- **Slots**: `por defecto`, `extra (con nombre)`, `footer (con nombre)`
- **Partes**: `body`, `card`, `description`, `extra`, `footer`, `header`, `title`

## `<r-checkbox>`

Código fuente: `components/checkbox/index.ts`

- **Atributos**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `value: string`
- **Propiedades**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `validationMessage: string`, `validity: ValidityState | undefined`, `value: string`
- **Eventos**:
  - `change` · element-only · detail `{ checked }`
- **Slots**: `por defecto`
- **Partes**: `checkbox`, `inner`, `input`, `label`, `wrapper`

## `<r-colorpicker>`

Código fuente: `components/colorpicker/index.ts`

- **Atributos**: `alpha-label`, `disabled: boolean`, `hue-label`, `label: string`, `sheet: string`, `value: string`
- **Propiedades**:
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

Código fuente: `components/popover/content/index.ts`

- **Atributos**: —
- **Propiedades**: —
- **Eventos**:
  - `change` · element-only
- **Slots**: `por defecto`
- **Partes**: —

## `<r-conversation>`

Código fuente: `components/conversation/index.ts`

- **Atributos**: `empty: string`, `follow: boolean`, `loading-older`, `older: string`, `sheet: string`
- **Propiedades**:
  - `empty: string` — Text shown while the projection has produced no rows.
  - `follow: boolean` — Whether new content is followed until the reader scrolls away from the floor.
  - `loadingOlder: boolean` — Whether a page is in flight; the affordance stays visible and goes inert.
  - `older: string` — Label for the paging affordance above the first row. Empty hides it.
  - `pinned: boolean` — Whether the view is currently following new content.
  - `sheet: string`
- **Eventos**:
  - `olderrequest` · bubbles, composed
  - `pinnedchange` · bubbles, composed · detail `{ pinned }`
- **Slots**: `footer (con nombre)`
- **Partes**: `conversation`, `empty`, `footer`, `list`, `older`

## `<r-disclosure-row>`

Código fuente: `components/disclosure-row/index.ts`

- **Atributos**: `busy: boolean`, `expandable: boolean`, `heading: string`, `name: string`, `open: boolean`, `sheet: string`, `summary: string`, `tone: string`
- **Propiedades**:
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
- **Slots**: `por defecto`, `leading (con nombre)`
- **Partes**: `body`, `disclosure`, `leading`, `row`, `separator`, `summary`, `title`

## `<r-dropdown>`

Código fuente: `components/dropdown/index.ts`

- **Atributos**: `arrow: string`, `sheet: string`, `transit: string`
- **Propiedades**: `arrow: string`, `sheet: string`, `transit: string`
- **Eventos**: —
- **Slots**: `por defecto`
- **Partes**: `dropdown`

## `<r-dropdown-item>`

Código fuente: `components/select/dropdown-item/index.ts`

- **Atributos**: `active: string`, `sheet: string`, `title: string`, `value: string`
- **Propiedades**: `active: string`, `sheet: string`, `title: string`, `value: string`
- **Eventos**: —
- **Slots**: `por defecto`
- **Partes**: `content`, `item`

## `<r-glass>`

Código fuente: `components/glass/index.ts`

- **Atributos**: `blur`, `displace: string`, `frequency: string`, `interactive: boolean`, `radius: string`, `rim: boolean`, `saturate: string`, `tint: string`
- **Propiedades**:
  - `displace: string` — Liquid refraction strength — the SVG displacement scale. `0` is a flat pane.
  - `frequency: string` — Turbulence base frequency — smaller = larger, smoother liquid ripples.
  - `interactive: boolean` — Hover lift + press-scale feedback, for clickable glass. Also makes the host
  - `radius: string` — Corner radius, in px.
  - `rim: boolean` — Opt-in GPU specular rim + chromatic edge, lit from a fixed top-left light —
  - `saturate: string` — Backdrop saturation, as a percentage number (e.g. `180`).
  - `sheen: boolean` — Animated specular sweep across the surface.
  - `tint: string` — Glass fill tint (any CSS background value).
- **Eventos**: —
- **Slots**: `por defecto`
- **Partes**: `glass`, `specular`

## `<r-icon>`

Código fuente: `components/icon/index.ts`

- **Atributos**: `aria-label`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
- **Propiedades**: `ariaLabel: string`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
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

Código fuente: `components/image/index.ts`

- **Atributos**: —
- **Propiedades**:
  - `alt` — Alternative text forwarded to the inner `<img>`. Defaults to `''` (empty),
  - `fallback`
  - `sheet`
- **Eventos**: —
- **Slots**: —
- **Partes**: —

## `<r-input>`

Código fuente: `components/input/index.ts`

- **Atributos**: `disabled: boolean`, `icon: string`, `label: string`, `max: string`, `message: string`, `min: string`, `name: string`, `placeholder: string`, `required: boolean`, `sheet: string`, `status: string`, `step: string`, `type: string`, `value: string`
- **Propiedades**:
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

Código fuente: `components/link/index.ts`

- **Atributos**: `href: string`, `replace: boolean`, `sheet: string`
- **Propiedades**: `href: string`, `replace: boolean`, `sheet: string`
- **Eventos**:
  - `ran-navigate` · bubbles, composed · detail `{ path, replace }`
- **Slots**: —
- **Partes**: —

## `<r-loading>`

Código fuente: `components/loading/index.ts`

- **Atributos**: `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`, `sheet: string`
- **Propiedades**: `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`, `sheet: string`
- **Eventos**: —
- **Slots**: —
- **Partes**: —

## `<r-markdown>`

Código fuente: `components/markdown/index.ts`

- **Atributos**: `caret: string`, `content: string`, `copy`, `download`, `highlight: string | null`, `inline-math`, `line-numbers`, `link-target`, `mode: string`, `sheet: string`, `theme: string`
- **Propiedades**:
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

Código fuente: `components/math/index.ts`

- **Atributos**: `copy`, `display: string`, `download`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **Propiedades**: `copyable: boolean`, `copyTarget: 'source' | 'mathml'`, `display: string`, `downloadable: boolean`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **Eventos**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ ok }`
- **Slots**: —
- **Partes**: `button`, `error`, `math`, `menu`, `render`, `toolbar`

## `<r-mermaid>`

Código fuente: `components/mermaid/index.ts`

- **Atributos**: `code: string`, `copy`, `download`, `fullscreen`, `sheet: string`, `theme: string`
- **Propiedades**: `code: string`, `copyable: boolean`, `downloadable: boolean`, `fullscreenable: boolean`, `sheet: string`, `theme: string`
- **Eventos**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `fullscreenchange` · bubbles, composed · detail `{ open }`
  - `render` · bubbles, composed · detail `{ ok }`
- **Slots**: —
- **Partes**: `button`, `diagram`, `error`, `menu`, `mermaid`, `toolbar`

## `<r-message>`

Código fuente: `components/message/index.ts`

- **Atributos**: —
- **Propiedades**: `content: string | null`, `sheet: string`, `type: string | null`
- **Eventos**: —
- **Slots**: —
- **Partes**: —

## `<r-modal>`

Código fuente: `components/modal/index.ts`

- **Atributos**: `autoFocus: boolean`, `closable: boolean`, `closeOnEsc: boolean`, `heading: string`, `hide-header`, `lockScroll: boolean`, `maskClosable: boolean`, `open: boolean`, `sheet: string`
- **Propiedades**:
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
- **Slots**: `por defecto`, `footer (con nombre)`
- **Partes**: `body`, `close`, `dialog`, `footer`, `header`, `mask`, `root`, `title`

## `<r-option>`

Código fuente: `components/select/option/index.ts`

- **Atributos**: —
- **Propiedades**: `disabled: boolean | string | undefined | null`, `sheet`, `value`
- **Eventos**: —
- **Slots**: `por defecto`
- **Partes**: —

## `<r-player>`

Código fuente: `components/player/index.ts`

- **Atributos**: `autoplay: boolean`, `currenttime`, `currentTime: string`, `debug: string`, `disable-error-modal`, `format: string`, `loop: boolean`, `muted: boolean`, `playbackrate`, `playbackRate: string`, `poster: string`, `remember-position`, `sheet: string`, `src: string`, `thumbnails: string`, `volume: string`
- **Propiedades**:
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

Código fuente: `components/popover/index.ts`

- **Atributos**: `open: boolean`, `placement: Placement`, `sheet: string`, `trigger: string`
- **Propiedades**:
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
- **Slots**: `por defecto`
- **Partes**: —

## `<r-progress>`

Código fuente: `components/progress/index.ts`

- **Atributos**: `drag`, `primary`
- **Propiedades**: `dot: string`, `percent: string`, `sheet: string`, `total: string`, `type: string`
- **Eventos**:
  - `change` · element-only · detail `{ percent, total, value }`
- **Slots**: —
- **Partes**: `dot`, `fill`, `track`

## `<r-radar>`

Código fuente: `components/radar/index.ts`

- **Atributos**: —
- **Propiedades**: `abilitys`, `colorLine`, `colorPolygon`, `fillColor`, `fontColor`, `sheet`, `strokeColor`
- **Eventos**: —
- **Slots**: —
- **Partes**: —

## `<r-reasoning>`

Código fuente: `components/reasoning/index.ts`

- **Atributos**: `duration: number | null`, `label: string`, `open: boolean`, `sheet: string`, `streaming: boolean`
- **Propiedades**:
  - `content: string` — The reasoning text. Assigning repeatedly is the streaming path.
  - `duration: number | null` — How long the model spent, in milliseconds. Rendered beside the label when set.
  - `label: string` — Summary text. Defaults to `Reasoning`.
  - `open: boolean` — Whether the body is expanded.
  - `sheet: string`
  - `streaming: boolean` — Whether reasoning is still arriving.
- **Eventos**: —
- **Slots**: `por defecto`
- **Partes**: `body`, `row`, `text`

## `<r-route>`

Código fuente: `components/route/index.ts`

- **Atributos**: `exact: boolean`, `path: string`, `sheet: string`, `src: string`
- **Propiedades**:
  - `exact: boolean`
  - `params: Record<string, string>`
  - `path: string`
  - `sheet: string`
  - `src: string` — Module specifier for lazy, code-split, mount/unmount page rendering.
- **Eventos**:
  - `routematch` · bubbles · detail `{ params, path }`
- **Slots**: `por defecto`
- **Partes**: —

## `<r-router>`

Código fuente: `components/router/index.ts`

- **Atributos**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **Propiedades**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **Eventos**:
  - `routechange` · bubbles · detail `{ path }`
- **Slots**: `por defecto`
- **Partes**: —

## `<r-scratch>`

Código fuente: `components/scratch/index.ts`

- **Atributos**: `disabled: boolean`, `sheet: string`
- **Propiedades**: `disabled: boolean`, `sheet: string`
- **Eventos**: —
- **Slots**: `por defecto`
- **Partes**: `award`

## `<r-section>`

Código fuente: `components/section/index.ts`

- **Atributos**: `heading: string`, `sheet: string`, `subtitle: string`
- **Propiedades**: `heading: string`, `sheet: string`, `subtitle: string`
- **Eventos**: —
- **Slots**: `por defecto`
- **Partes**: `body`, `header`, `heading`, `subtitle`

## `<r-select>`

Código fuente: `components/select/index.ts`

- **Atributos**: `defaultvalue`, `disabled: boolean`, `dropdownclass: string`, `getpopupcontainerid`, `label: string`, `open: boolean`, `placement: Placement`, `required: boolean`, `sheet: string`, `showsearch`, `trigger: string`, `type: string`, `value: string`
- **Propiedades**:
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
- **Slots**: `por defecto`
- **Partes**: `icon`, `label`, `search`, `select`, `selection`, `selection-item`

## `<r-skeleton>`

Código fuente: `components/skeleton/index.ts`

- **Atributos**: `sheet: string`
- **Propiedades**: `sheet: string`
- **Eventos**: —
- **Slots**: —
- **Partes**: —

## `<r-state-dot>`

Código fuente: `components/state-dot/index.ts`

- **Atributos**: `label: string`, `sheet: string`, `state: 'idle' | 'running' | 'success' | 'warning' | 'error'`
- **Propiedades**:
  - `label: string` — Accessible name.
  - `sheet: string`
  - `state: 'idle' | 'running' | 'success' | 'warning' | 'error'` — Which lifecycle step to show. Unknown values render as `idle`.
- **Eventos**: —
- **Slots**: —
- **Partes**: `dot`

## `<r-tab>`

Código fuente: `components/tabpane/index.ts`

- **Atributos**: —
- **Propiedades**: `disabled`, `effect`, `icon`, `iconSize`, `key`, `label`, `sheet`
- **Eventos**: —
- **Slots**: `por defecto`
- **Partes**: `content`

## `<r-tabs>`

Código fuente: `components/tab/index.ts`

- **Atributos**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **Propiedades**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **Eventos**:
  - `change` · element-only · detail `{ active }`
- **Slots**: `por defecto`
- **Partes**: `content`, `content-wrap`, `header`, `indicator`, `nav`, `tabs`

## `<r-theme-switch>`

Código fuente: `components/theme-switch/index.ts`

- **Atributos**: `label-dark`, `label-light`, `label-system`, `sheet: string`
- **Propiedades**:
  - `sheet: string`
  - `value: RanThemeName` — Current selection; falls back to 'system' when nothing is forced.
- **Eventos**:
  - `change` · bubbles, composed · detail `{ theme }`
- **Slots**: —
- **Partes**: `button ${choice}`, `switch`

## `<r-token-meter>`

Código fuente: `components/token-meter/index.ts`

- **Atributos**: `label: string`, `limit: number`, `sheet: string`, `spent: number`, `used: number`
- **Propiedades**:
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

Código fuente: `components/tool-card/index.ts`

- **Atributos**: `open: boolean`, `sheet: string`, `status: ToolCardStatus`
- **Propiedades**:
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

Código fuente: `components/voice-button/index.ts`

- **Atributos**: `active-label`, `cancel-hint`, `cancelling`, `disabled: boolean`, `hold-hint`, `holding`, `label: string`, `listening: boolean`, `sheet: string`
- **Propiedades**:
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
