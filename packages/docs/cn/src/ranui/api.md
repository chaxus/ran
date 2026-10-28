---
title: ranui 元素 API
description: 'ranui 的全部自定义元素 —— 41 个元素的属性、属性值、事件、插槽与 ::part() 名称，均从源码提取。'
---

# ranui 元素 API（自动生成）

由 `pnpm -F ranui doc:api` 从组件源码自动生成，因此不会与实际发布的代码脱节：逐个元素
列出属性（attribute）、带类型的属性值（property）、事件（含 `detail` 结构与派发选项）、
插槽与 `::part()` 名称。描述直接提取自源码 JSDoc，因此保持英文。

每个元素暴露的 CSS 变量见
[style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md)；如何在其中取舍见
[设计系统](/cn/src/ranui/design-system/)与[设计规范](/cn/src/ranui/design-guides/)。
单个元素的用法说明在侧边栏各自的页面里，这里是一次性列全的完整接口。

每个事件都标注了它的派发选项：`bubbles`（冒泡）、`composed`（可穿过 Shadow 边界）、
`cancelable`（`preventDefault()` 可否决）。**`element-only`** 表示三者皆无——在祖先节点上
做事件委托永远收不到它，请把监听绑在元素本身上。

**共 41 个自定义元素。**

## `<r-attachments>`

源码: `components/attachments/index.ts`

- **属性（attribute）**: `sheet: string`
- **属性值（property）**:
  - `accept: string` — Comma-separated types or extensions, in the form `<input accept>` takes.
  - `attachments: readonly Attachment[]` — The staged files, in the order they arrived.
  - `files: File[]` — Just the files, for building a request body.
  - `maxCount: number` — Most files that may be staged at once; unlimited when unset.
  - `maxSize: number` — Largest file accepted, in bytes.
  - `sheet: string`
- **事件**:
  - `attachmentrejected` · bubbles, composed · detail `{ file, reason }`
  - `attachmentschange` · bubbles, composed · detail `{ attachments }`
- **插槽**: —
- **Part**: `attachment`, `icon`, `list`, `name`, `remove`, `size`, `thumb`

## `<r-button>`

源码: `components/button/index.ts`

- **属性（attribute）**: `aria-label`, `disabled: boolean | string`, `effect: boolean`, `icon: string`, `iconSize: string`, `sheet: string`, `type: string`
- **属性值（property）**:
  - `disabled: boolean | string` — Blocks clicks and keyboard activation and removes the button from the tab order. Off by default; `disabled="false"` counts as enabled.
  - `effect: boolean` — Whether the click ripple is drawn. On by default; opt out with `effect="false"`.
  - `icon: string` — Name of an `<r-icon>` drawn before the label, for example `'search'`. No icon when empty.
  - `iconSize: string` — Icon size passed to the inner `<r-icon>`. Defaults to about 1.15× the button's font size; set it only when the icon needs a fixed size.
  - `sheet: string`
  - `type: string` — Visual variant: `''` (default) | `'primary'` (monochrome) | `'warning'` | `'text'`. Drives the `:host([type=...])` styles.
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `button`, `content`

## `<r-card>`

源码: `components/card/index.ts`

- **属性（attribute）**: `description: string`, `heading: string`, `hoverable: boolean`, `sheet: string`
- **属性值（property）**:
  - `description: string` — Secondary text shown under the heading. Empty by default; the header is hidden when the heading, description and `extra` slot are all empty.
  - `heading: string` — Heading text.
  - `hoverable: boolean` — Interactive card (Geist): hover darkens the border one step. Purely presentational — gate it to cards that are actually clickable.
  - `sheet: string`
- **事件**: —
- **插槽**: `默认插槽`, `extra（具名）`, `footer（具名）`
- **Part**: `body`, `card`, `description`, `extra`, `footer`, `header`, `title`

## `<r-checkbox>`

源码: `components/checkbox/index.ts`

- **属性（attribute）**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `value: string`
- **属性值（property）**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `validationMessage: string`, `validity: ValidityState | undefined`, `value: string`
- **事件**:
  - `change` · element-only · detail `{ checked }`
- **插槽**: `默认插槽`
- **Part**: `checkbox`, `inner`, `input`, `label`, `wrapper`

## `<r-colorpicker>`

源码: `components/colorpicker/index.ts`

- **属性（attribute）**: `alpha-label`, `disabled: boolean`, `hue-label`, `label: string`, `sheet: string`, `value: string`
- **属性值（property）**:
  - `alphaLabel: string` — Accessible name of the opacity slider.
  - `disabled: boolean` — Blocks opening the picker and emitting `change`, and removes the swatch from the tab order. Off by default; `disabled="false"` counts as enabled.
  - `hueLabel: string` — Accessible name of the hue slider.
  - `label: string` — Accessible name of the swatch that opens the picker. Defaults to `'Choose color'`.
  - `sheet: string`
  - `value: string` — Selected colour as `#rrggbb` (or `#rgb`), `rgb(...)` or `rgba(...)`; picking a colour writes a hex value, or `rgba(...)` when opacity is below 1. Unparseable values are ignored. Empty until set; the swatch starts white.
- **事件**:
  - `change` · bubbles, composed
- **插槽**: —
- **Part**: `block`, `swatch`

## `<r-content>`

源码: `components/popover/content/index.ts`

- **属性（attribute）**: —
- **属性值（property）**: —
- **事件**:
  - `change` · element-only
- **插槽**: `默认插槽`
- **Part**: —

## `<r-conversation>`

源码: `components/conversation/index.ts`

- **属性（attribute）**: `empty: string`, `follow: boolean`, `loading-older`, `older: string`, `sheet: string`
- **属性值（property）**:
  - `empty: string` — Text shown while the projection has produced no rows.
  - `follow: boolean` — Whether new content is followed until the reader scrolls away from the floor.
  - `loadingOlder: boolean` — Whether a page is in flight; the affordance stays visible and goes inert.
  - `older: string` — Label for the paging affordance above the first row. Empty hides it.
  - `pinned: boolean` — Whether the view is currently following new content.
  - `sheet: string`
- **事件**:
  - `olderrequest` · bubbles, composed
  - `pinnedchange` · bubbles, composed · detail `{ pinned }`
- **插槽**: `footer（具名）`
- **Part**: `conversation`, `empty`, `footer`, `list`, `older`

## `<r-disclosure-row>`

源码: `components/disclosure-row/index.ts`

- **属性（attribute）**: `busy: boolean`, `expandable: boolean`, `heading: string`, `name: string`, `open: boolean`, `sheet: string`, `summary: string`, `tone: string`
- **属性值（property）**:
  - `busy: boolean` — Whether the work this row stands for is still running.
  - `expandable: boolean` — Whether the row has a body worth opening.
  - `heading: string` — The fixed-width left half of the line.
  - `name: string` — Groups rows so that opening one closes the rest.
  - `open: boolean` — Whether the body is shown.
  - `sheet: string`
  - `summary: string` — The truncating right half. Empty drops the separator with it.
  - `tone: string` — `error` colours the summary; anything else is the ordinary tone.
- **事件**:
  - `disclosurebeforetoggle` · bubbles, composed, cancelable · detail `{ open }`
  - `disclosuretoggle` · bubbles, composed · detail `{ open }`
- **插槽**: `默认插槽`, `leading（具名）`
- **Part**: `body`, `disclosure`, `leading`, `row`, `separator`, `summary`, `title`

## `<r-dropdown>`

源码: `components/dropdown/index.ts`

- **属性（attribute）**: `arrow: string`, `sheet: string`, `transit: string`
- **属性值（property）**: `arrow: string`, `sheet: string`, `transit: string`
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `dropdown`

## `<r-dropdown-item>`

源码: `components/select/dropdown-item/index.ts`

- **属性（attribute）**: `active: string`, `selected: boolean`, `sheet: string`, `title: string`, `value: string`
- **属性值（property）**:
  - `active: string` — The transient cursor that pointer hover and arrow keys move; r-select sets it. It shares the hover fill and carries no selection meaning.
  - `selected: boolean` — Marks the committed choice with a check mark. Unlike `active` (the transient cursor), it stays put while the cursor moves.
  - `sheet: string`
  - `title: string`
  - `value: string`
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `content`, `item`

## `<r-fan-gallery>`

源码: `components/fan-gallery/index.ts`

- **属性（attribute）**: `sheet: string`, `spread: string`
- **属性值（property）**:
  - `sheet: string`
  - `spread: string` — Angle in degrees between the first and last child once open. Defaults to `24`; `0` lines them up.
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `stage`

## `<r-glass>`

源码: `components/glass/index.ts`

- **属性（attribute）**: `backdrop: string`, `bevel: string`, `blur`, `dispersion: string`, `displace: string`, `interactive: boolean`, `material: string`, `radius: string`, `rim: boolean`, `saturate: string`, `specular: string`, `tint: string`, `tone: string`
- **属性值（property）**:
  - `backdrop: string` — An `<img>` or `<video>` to refract with the WebGL path: a selector, resolved in the host's
  - `bevel: string` — Width of the curved edge band that bends light, in px.
  - `dispersion: string` — How far the colors split at the edge, as a percentage of `displace`. `0` keeps them together.
  - `displace: string` — How far the edge pulls the backdrop inward, in px. `0` is a flat pane.
  - `interactive: boolean` — Hover lift + press-scale feedback, for clickable glass. Also makes the host
  - `material: string` — A preset for every optical value: `regular` (default), `thin`, `thick` or `clear`.
  - `optics: GlassOptics` — The material's values with any attribute override applied.
  - `radius: string` — Corner radius, in px.
  - `rim: boolean` — Opt-in GPU specular rim: an outer and an inner wall line, lit by a key light from the
  - `saturate: string` — Backdrop saturation, as a percentage number (e.g. `180`).
  - `sheen: boolean` — Animated specular sweep across the surface.
  - `specular: string` — Strength of the highlights, as a percentage (`100` is the material's normal light).
  - `tint: string` — Glass fill tint (any CSS background value).
  - `tone: string` — What sits behind the glass: `dark` (default) lights the edge, `light` shades it, because a
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `glass`, `refraction`, `specular`

## `<r-icon>`

源码: `components/icon/index.ts`

- **属性（attribute）**: `aria-label`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
- **属性值（property）**: `ariaLabel: string`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
- **事件**:
  - `ranui-icon-registered` · element-only · detail `{ name }`
- **插槽**: —
- **Part**: `ran-icon`

> **Bundled icons are loaded on demand.** `<r-icon name="lock">` works without registration:
> its SVG is fetched on first use and cached. To register the entire bundled set eagerly,
> optionally call the following in the browser before the first `<r-icon>` connects:
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

源码: `components/image/index.ts`

- **属性（attribute）**: `alt`, `fallback`, `sheet`, `src`
- **属性值（property）**:
  - `alt` — Alternative text forwarded to the inner `<img>`. Defaults to `''` (empty),
  - `fallback` — Image shown when `src` fails. Empty by default: a failed image then shows a theme-aware placeholder that fills the box.
  - `sheet`
- **事件**: —
- **插槽**: —
- **Part**: `image`

## `<r-input>`

源码: `components/input/index.ts`

- **属性（attribute）**: `disabled: boolean`, `icon: string`, `label: string`, `max: string`, `message: string`, `min: string`, `name: string`, `placeholder: string`, `required: boolean`, `sheet: string`, `status: string`, `step: string`, `type: string`, `value: string`
- **属性值（property）**:
  - `disabled: boolean` — Blocks typing and focus, greys the field out and leaves it out of form validation. Off by default; `disabled="false"` counts as enabled.
  - `icon: string` — Name of an `r-icon` shown before the text, for example `search`. No icon when unset.
  - `label: string` — Caption rendered above the field and linked to the inner input, so it is the field's accessible name and clicking it focuses the input. No caption when unset.
  - `max: string` — Highest accepted number. Applies only when `type` is `'number'`; larger values fail form validation.
  - `message: string` — Helper or validation text shown below the field and linked to it with `aria-describedby`. Nothing is rendered when empty.
  - `min: string` — Lowest accepted number. Applies only when `type` is `'number'`; smaller values fail form validation.
  - `name: string` — Key under which the value is submitted with the owning form.
  - `placeholder: string` — Hint text shown inside the field while it is empty.
  - `required: boolean` — Makes an empty value fail native form validation (`checkValidity()`, `:invalid`) and sets `aria-required`. Off by default; setting the property to `false` or `'false'` removes it.
  - `sheet: string`
  - `status: string` — Validation state: `'error'` | `'warning'`. Colours the border and label and adds a status icon; pair it with `message` so the state is not shown by colour alone. Empty (neutral) by default.
  - `step: string` — Granularity of accepted numbers, forwarded to the native input. Applies only when `type` is `'number'`; off-step values fail form validation.
  - `type: string` — Native input type forwarded to the inner `<input>`, such as `text`, `password` or `number`; `number` enables `min`, `max` and `step`. Behaves as `text` when unset.
  - `validationMessage: string` — The browser's message for the current constraint error; empty while the field is valid.
  - `validity: ValidityState | undefined` — Native `ValidityState` of the field, for reading constraint errors from script. `undefined` where ElementInternals is unavailable.
  - `value: string` — Current text of the field. Updates on every keystroke and is submitted with the owning form under `name`. Empty by default.
- **事件**:
  - `change` · element-only · detail `{ value }`
  - `input` · element-only · detail `{ value }`
- **插槽**: —
- **Part**: `content`, `input`, `label`, `message`

## `<r-link>`

源码: `components/link/index.ts`

- **属性（attribute）**: `href: string`, `replace: boolean`, `sheet: string`
- **属性值（property）**: `href: string`, `replace: boolean`, `sheet: string`
- **事件**:
  - `ran-navigate` · bubbles, composed · detail `{ path, replace }`
- **插槽**: —
- **Part**: —

## `<r-loading>`

源码: `components/loading/index.ts`

- **属性（attribute）**: `label: string`, `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`, `sheet: string`
- **属性值（property）**:
  - `label: string` — Accessible name announced by the `status` role. Defaults to "Loading"; set it to say what is loading.
  - `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`
  - `sheet: string`
- **事件**: —
- **插槽**: —
- **Part**: —

## `<r-markdown>`

源码: `components/markdown/index.ts`

- **属性（attribute）**: `caret: string`, `content: string`, `copy`, `download`, `highlight: string | null`, `inline-math`, `label-copy-error`, `line-numbers`, `link-target`, `mode: string`, `sheet: string`, `theme: string`
- **属性值（property）**:
  - `caret: string` — Shows a blinking caret after the last block while text streams in; remove it when the answer is complete. Any value draws a block caret; `'circle'` draws a dot.
  - `content: string` — Markdown source. Resolution order: the `content` property (set via JS, not reflected), the `content` attribute, then the element's text content.
  - `copyable: boolean` — Adds a copy button to each code block header. Reflects the `copy` attribute; off by default.
  - `downloadable: boolean` — Adds a download button to each code block header that saves the code as a file. Reflects the `download` attribute; off by default.
  - `highlight: string | null` — Shiki syntax highlighting for code blocks; off when the attribute is absent. `""` → github-light/github-dark; `"a"` → both; `"a b"` → light / dark theme.
  - `inlineMath: boolean` — Treats `$…$` as inline math. Off by default because `$` often means currency; `\(…\)` always works. Reflects the `inline-math` attribute.
  - `lineNumbers: boolean` — Shows line numbers in code blocks. Reflects the `line-numbers` attribute; off by default.
  - `linkTarget: string` — `target` for rendered links, set with `rel="noopener noreferrer"`. Defaults to `'_blank'`; use `'_self'` to open links in place. In-page `#` links are left alone.
  - `mode: string` — Parsing mode: `'streaming'` | `'static'`. Default `'streaming'` repairs half-written syntax and re-renders only changed blocks; use `'static'` for finished text.
  - `sheet: string`
  - `theme: string` — Colour scheme: `'auto'` | `'light'` | `'dark'`. Default `'auto'` follows the document theme; embedded Mermaid diagrams use the same value.
- **事件**:
  - `copied` · bubbles, composed · detail `{ code, kind, language }`
  - `download` · bubbles, composed · detail `{ filename, kind, language }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ blocks, changed }`
- **插槽**: —
- **Part**: `block`, `body`, `button`, `code`, `code-actions`, `code-header`, `code-lang`, `copy-status`, `error`, `markdown`, `table`

## `<r-math>`

源码: `components/math/index.ts`

- **属性（attribute）**: `copy`, `display: string`, `download`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **属性值（property）**: `copyable: boolean`, `copyTarget: 'source' | 'mathml'`, `display: string`, `downloadable: boolean`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **事件**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ ok }`
- **插槽**: —
- **Part**: `button`, `copy-status`, `error`, `math`, `menu`, `render`, `toolbar`

## `<r-mermaid>`

源码: `components/mermaid/index.ts`

- **属性（attribute）**: `code: string`, `copy`, `download`, `fullscreen`, `sheet: string`, `theme: string`
- **属性值（property）**: `code: string`, `copyable: boolean`, `downloadable: boolean`, `fullscreenable: boolean`, `sheet: string`, `theme: string`
- **事件**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `fullscreenchange` · bubbles, composed · detail `{ open }`
  - `render` · bubbles, composed · detail `{ ok }`
- **插槽**: —
- **Part**: `button`, `copy-status`, `diagram`, `error`, `menu`, `mermaid`, `toolbar`

## `<r-message>`

源码: `components/message/index.ts`

- **属性（attribute）**: `content: string | null`, `sheet: string`, `type: string | null`
- **属性值（property）**: `content: string | null`, `sheet: string`, `type: string | null`
- **事件**: —
- **插槽**: —
- **Part**: —

## `<r-modal>`

源码: `components/modal/index.ts`

- **属性（attribute）**: `autoFocus: boolean`, `closable: boolean`, `closeOnEsc: boolean`, `heading: string`, `hide-header`, `lockScroll: boolean`, `maskClosable: boolean`, `open: boolean`, `sheet: string`
- **属性值（property）**:
  - `autoFocus: boolean` — Moves focus to the first focusable element in the dialog (or the dialog itself) when it opens. On by default; turn off with `autoFocus="false"`.
  - `closable: boolean` — Shows the close button in the corner. On by default; turn off with `closable="false"` when the dialog must be closed by its own actions.
  - `closeOnEsc: boolean` — Closes the topmost dialog when Escape is pressed. On by default; turn off with `closeOnEsc="false"`.
  - `heading: string` — Heading text shown in the title bar; falls back to `Modal` when empty.
  - `hideHeader: boolean` — Headerless mode for content-only dialogs such as image lightboxes: drops the title bar and keeps only a floating close button when `closable`. Off by default.
  - `lockScroll: boolean` — Stops the page behind from scrolling while the dialog is open. On by default; turn off with `lockScroll="false"`.
  - `maskClosable: boolean` — Closes the dialog when the backdrop outside it is clicked. On by default; turn off with `maskClosable="false"` for forms that must not be dismissed by a stray click.
  - `open: boolean` — Shows the dialog when set and closes it when removed. Off by default; `open="false"` counts as closed.
  - `sheet: string`
- **事件**:
  - `afterclose` · element-only · detail `{ trigger }`
  - `afteropen` · element-only
  - `beforeclose` · cancelable · detail `{ trigger }`
  - `beforeopen` · cancelable
  - `close` · element-only · detail `{ trigger }`
  - `open` · element-only
- **插槽**: `默认插槽`, `footer（具名）`
- **Part**: `body`, `close`, `dialog`, `footer`, `header`, `mask`, `root`, `title`

## `<r-option>`

源码: `components/select/option/index.ts`

- **属性（attribute）**: `disabled: boolean | string | undefined | null`, `sheet`, `value`
- **属性值（property）**: `disabled: boolean | string | undefined | null`, `sheet`, `value`
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: —

## `<r-player>`

源码: `components/player/index.ts`

- **属性（attribute）**: `autoplay: boolean`, `currenttime`, `currentTime: string`, `debug: string`, `disable-error-modal`, `format: string`, `loop: boolean`, `muted: boolean`, `playbackrate`, `playbackRate: string`, `poster: string`, `remember-position`, `sheet: string`, `src: string`, `thumbnails: string`, `volume: string`
- **属性值（property）**:
  - `autoplay: boolean` — Start playback as soon as the video can play, via the native `autoplay` flag. Browsers usually block unmuted autoplay, so pair it with `muted`. Off by default.
  - `controllerBarTimeId: ReturnType<typeof setTimeout> | undefined` — Internal timer id for auto-hiding the control bar. Not meant to be set by consumers.
  - `currentTime: string` — Playback position in seconds, also accepted as `currenttime`. In the markup it is the start position; a later change seeks. The getter returns the attribute, not the live position.
  - `debug: string` — Any non-empty value logs every internal `change` event and source-load errors to the console. An empty value (`<r-player debug>`) leaves logging off.
  - `disableErrorModal: boolean` — Suppress the built-in playback-error panel with its Retry button, for apps that show their own error UI. Off by default, so the panel shows.
  - `format: string` — Playback engine: `'hls'` | `'dash'` | `'flv'` | `'webrtc'` | `'native'`. Empty by default, which detects it from the `src` extension; set it for signed or extensionless URLs, and always for `webrtc` (a WHEP endpoint).
  - `labelError: string` — Heading of the built-in playback-error panel. Defaults to `'Playback failed'`.
  - `labelRetry: string` — Label of the panel's retry button. Defaults to `'Retry'`.
  - `loop: boolean` — Restart from the beginning when playback ends, via the native `loop` flag. Off by default.
  - `moveProgress` — Internal seek-bar drag state (`percentage`, `mouseDown`), read by the player's own modules. Not meant to be set by consumers.
  - `muted: boolean` — Start silent: sets volume to 0 and the native `muted` flag. Removing the attribute restores the previous volume, or 50 if none was recorded. Off by default.
  - `playbackRate: string` — Speed multiplier such as `1`, `1.5` or `2`, also accepted as `playbackrate`. Applied from the markup and on every change.
  - `poster: string` — Image URL shown on the video before playback starts, passed to the native `<video poster>`.
  - `rememberPosition: boolean` — Save the position to localStorage, keyed by `src`, on pause and when the page is hidden, and resume there on the next load of the same `src`. The entry is cleared when playback ends. Off by default.
  - `sheet: string`
  - `src: string` — Media URL to play. The engine is picked from its extension unless `format` is set; changing it on a connected player reloads the source.
  - `thumbnails: string` — URL of a WebVTT sprite-sheet manifest that shows a preview thumbnail above the seek-bar hover tip.
  - `tracks: PlayerTrackConfig[]` — Subtitle and caption tracks as `{ src, srclang, label, kind?, default? }` objects; property only, no attribute. Defaults to `[]`.
  - `volume: string` — Volume on a 0-100 scale, clamped; `muted` wins. Applied from the markup and on every change; the getter returns the attribute, not the live volume.
- **事件**:
  - `change` · element-only · detail `{ currentTime, data, duration, tag, type }`
- **插槽**: —
- **Part**: —

## `<r-popover>`

源码: `components/popover/index.ts`

- **属性（attribute）**: `open: boolean`, `placement: Placement`, `sheet: string`, `trigger: string`
- **属性值（property）**:
  - `getPopupContainerId: string` — Id of the element the panel is mounted into, looked up in the popover's own root first and then the document. Defaults to `document.body`.
  - `open: boolean` — Whether the panel is showing.
  - `placement: Placement` — Which side of the trigger the panel sits on, with an optional alignment. Defaults to `'top'`.
  - `sheet: string`
  - `trigger: string` — How the panel opens: `'hover'` | `'click'`. Default `'hover'`. Click toggles the panel in either mode; hover is ignored on mobile devices.
- **事件**:
  - `after-hide` · element-only
  - `after-show` · element-only
  - `hide` · element-only
  - `show` · element-only
- **插槽**: `默认插槽`
- **Part**: —

## `<r-progress>`

源码: `components/progress/index.ts`

- **属性（attribute）**: `dot: string`, `percent: string`, `sheet: string`, `total: string`, `type: string`
- **属性值（property）**: `dot: string`, `percent: string`, `sheet: string`, `total: string`, `type: string`
- **事件**:
  - `change` · element-only · detail `{ percent, total, value }`
- **插槽**: —
- **Part**: `dot`, `fill`, `track`

## `<r-radar>`

源码: `components/radar/index.ts`

- **属性（attribute）**: `abilitys`, `colorline`, `colorpolygon`, `fillcolor`, `sheet`, `strokecolor`
- **属性值（property）**: `abilitys`, `colorLine`, `colorPolygon`, `fillColor`, `fontColor`, `sheet`, `strokeColor`
- **事件**: —
- **插槽**: —
- **Part**: —

## `<r-reasoning>`

源码: `components/reasoning/index.ts`

- **属性（attribute）**: `duration: number | null`, `label: string`, `open: boolean`, `sheet: string`, `streaming: boolean`
- **属性值（property）**:
  - `content: string` — The reasoning text. Assigning repeatedly is the streaming path.
  - `duration: number | null` — How long the model spent, in milliseconds. Rendered beside the label when set.
  - `label: string` — Summary text. Defaults to `Reasoning`.
  - `open: boolean` — Whether the body is expanded.
  - `sheet: string`
  - `streaming: boolean` — Whether reasoning is still arriving.
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `body`, `row`, `text`

## `<r-route>`

源码: `components/route/index.ts`

- **属性（attribute）**: `exact: boolean`, `path: string`, `sheet: string`, `src: string`
- **属性值（property）**:
  - `exact: boolean` — Match only the full path, so `/users` no longer shows for `/users/42`. Off by default; set it on a `/` home route.
  - `params: Record<string, string>` — Read-only. Values captured by the `:name` segments of `path` on the last match, URL-decoded. Empty when the route does not match.
  - `path: string` — Path pattern this route shows for. `:name` segments capture params and `*` matches the rest. Without `exact`, deeper paths also match. Defaults to `'/'`.
  - `sheet: string`
  - `src: string` — Module specifier for lazy, code-split, mount/unmount page rendering.
- **事件**:
  - `routematch` · bubbles · detail `{ params, path }`
- **插槽**: `默认插槽`
- **Part**: —

## `<r-router>`

源码: `components/router/index.ts`

- **属性（attribute）**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **属性值（property）**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **事件**:
  - `routechange` · bubbles · detail `{ path }`
- **插槽**: `默认插槽`
- **Part**: —

## `<r-scratch>`

源码: `components/scratch/index.ts`

- **属性（attribute）**: `disabled: boolean`, `reveal-label`, `revealed-label`, `sheet: string`
- **属性值（property）**: `disabled: boolean`, `revealedLabel: string`, `revealLabel: string`, `sheet: string`
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `award`, `reveal-button`

## `<r-section>`

源码: `components/section/index.ts`

- **属性（attribute）**: `heading: string`, `sheet: string`, `subtitle: string`
- **属性值（property）**: `heading: string`, `sheet: string`, `subtitle: string`
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `body`, `header`, `heading`, `subtitle`

## `<r-select>`

源码: `components/select/index.ts`

- **属性（attribute）**: `defaultvalue`, `disabled: boolean`, `dropdownclass: string`, `getpopupcontainerid`, `label: string`, `open: boolean`, `placeholder: string`, `placement: Placement`, `required: boolean`, `sheet: string`, `showsearch`, `trigger: string`, `type: string`, `value: string`
- **属性值（property）**:
  - `defaultValue: string` — Option value to select initially when `value` is not set; also restored by `form.reset()`. Applied once the matching option exists.
  - `disabled: boolean` — Blocks opening, selection and search, removes the select from the tab order and closes an open dropdown. Off by default; `disabled="false"` counts as enabled.
  - `dropdownclass: string` — Class name set on the dropdown panel when it is first built, so the portaled panel can be styled from outside.
  - `getPopupContainerId: string` — Id of the element the dropdown panel is mounted into, looked up in the select's own root first and then the document. Defaults to `document.body`.
  - `label: string` — Caption rendered above the field and used as its accessible name; clicking it focuses the select. No caption when unset.
  - `open: boolean` — Whether the dropdown is showing.
  - `placeholder: string` — Empty-field hint; the field's accessible name remains its label.
  - `placement: Placement` — Which side of the trigger the panel opens on, with an optional alignment. Defaults to `'bottom'`.
  - `required: boolean` — Makes an empty selection fail native form validation and sets `aria-required`. Ignored while disabled. Off by default; setting the property to `false` or `'false'` removes it.
  - `sheet: string`
  - `showSearch: string` — Adds a search box that filters options as you type. Enabled whenever the attribute is present, whatever its value; remove the attribute to turn it off.
  - `trigger: string` — How the dropdown opens: `'click'` | `'hover'`. Default `'click'`. Hover is ignored on mobile devices.
  - `type: string` — Visual style. `'text'` drops the border, background and arrow so the select reads as inline text; any other value keeps the boxed field.
  - `validationMessage: string` — The browser's message for the current constraint error; empty while the field is valid.
  - `validity: ValidityState | undefined` — Native `ValidityState` of the field, for reading constraint errors from script. `undefined` where ElementInternals is unavailable.
  - `value: string` — Value of the selected option, submitted with the owning form. Setting it selects the matching option; an empty value clears the selection.
- **事件**:
  - `after-hide` · element-only
  - `after-show` · element-only
  - `change` · element-only · detail `{ label, value }`
  - `hide` · element-only
  - `search` · element-only · detail `{ value }`
  - `show` · element-only
- **插槽**: `默认插槽`
- **Part**: `icon`, `label`, `search`, `select`, `selection`, `selection-item`

## `<r-skeleton>`

源码: `components/skeleton/index.ts`

- **属性（attribute）**: `sheet: string`
- **属性值（property）**: `sheet: string`
- **事件**: —
- **插槽**: —
- **Part**: —

## `<r-state-dot>`

源码: `components/state-dot/index.ts`

- **属性（attribute）**: `label: string`, `sheet: string`, `state: 'idle' | 'running' | 'success' | 'warning' | 'error'`
- **属性值（property）**:
  - `label: string` — Accessible name.
  - `sheet: string`
  - `state: 'idle' | 'running' | 'success' | 'warning' | 'error'` — Which lifecycle step to show. Unknown values render as `idle`.
- **事件**: —
- **插槽**: —
- **Part**: `dot`

## `<r-tab>`

源码: `components/tabpane/index.ts`

- **属性（attribute）**: `disabled`, `effect`, `icon`, `iconsize`, `key`, `label`, `sheet`
- **属性值（property）**: `disabled`, `effect`, `icon`, `iconSize`, `key`, `label`, `sheet`
- **事件**: —
- **插槽**: `默认插槽`
- **Part**: `content`

## `<r-tabs>`

源码: `components/tab/index.ts`

- **属性（attribute）**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **属性值（property）**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **事件**:
  - `change` · element-only · detail `{ active }`
- **插槽**: `默认插槽`
- **Part**: `content`, `content-wrap`, `header`, `hover`, `indicator`, `nav`, `tabs`

## `<r-theme-switch>`

源码: `components/theme-switch/index.ts`

- **属性（attribute）**: `label`, `label-dark`, `label-light`, `label-system`, `sheet: string`
- **属性值（property）**:
  - `sheet: string`
  - `value: RanThemeName` — Current selection; falls back to 'system' when nothing is forced.
- **事件**:
  - `change` · bubbles, composed · detail `{ theme }`
- **插槽**: —
- **Part**: `button ${choice}`, `switch`

## `<r-token-meter>`

源码: `components/token-meter/index.ts`

- **属性（attribute）**: `label: string`, `limit: number`, `sheet: string`, `spent: number`, `used: number`
- **属性值（property）**:
  - `label: string` — Prefix for the readout. Defaults to `Context`; an empty string leaves only the counts.
  - `level: 'ok' | 'warn' | 'over'` — How full the window is. Derived; assigning it is overwritten on the next update.
  - `limit: number` — Context window size in tokens. Zero or absent hides the bar and shows only counts.
  - `sheet: string`
  - `spent: number` — Tokens billed across the conversation so far.
  - `used: number` — Tokens the next request will carry — the history, not the whole conversation.
- **事件**: —
- **插槽**: —
- **Part**: `flag`, `meter`, `text`

## `<r-tool-card>`

源码: `components/tool-card/index.ts`

- **属性（attribute）**: `open: boolean`, `sheet: string`, `status: ToolCardStatus`
- **属性值（property）**:
  - `call: ToolCallView | null` — The pending view, derived from the call's arguments.
  - `open: boolean` — Whether the body is expanded.
  - `result: ToolResultView | null` — The completed view. Replaces the pending one once set.
  - `sheet: string`
  - `status: ToolCardStatus` — Lifecycle of the call, reflected so styling can key off it.
- **事件**:
  - `locationclick` · bubbles, composed · detail `{ location }`
- **插槽**: —
- **Part**: `body`, `exit`, `file`, `hunk`, `io`, `io-text`, `line`, `location`, `locations`, `path`, `row`

## `<r-voice-button>`

源码: `components/voice-button/index.ts`

- **属性（attribute）**: `active-label`, `cancel-hint`, `cancelling`, `disabled: boolean`, `hold-hint`, `holding`, `label: string`, `listening: boolean`, `sheet: string`
- **属性值（property）**:
  - `activeLabel: string` — Accessible cancel/stop name while capture is pending or listening.
  - `cancelHint: string` — Replaces {@link holdHint} once the finger has slid far enough to discard.
  - `continuous: boolean` — Keep listening across pauses instead of stopping at the first one. On by default; set `continuous="false"` to stop at the first pause.
  - `disabled: boolean` — Disable the button so no capture can start. Off by default. Where speech recognition is unsupported the button is hidden instead, regardless of this.
  - `holdHint: string` — Shown above the button while a finger is held down.
  - `label: string` — Accessible name while idle.
  - `lang: string` — Language being spoken, as a BCP 47 tag.
  - `listening: boolean` — Whether a capture is running. Reflected, so `:host([listening])` can style it.
  - `sheet: string`
  - `supported: boolean` — Whether this platform can recognize speech at all.
- **事件**:
  - `voiceend` · bubbles, composed
  - `voiceerror` · bubbles, composed
  - `voiceresult` · bubbles, composed · detail `{ isFinal, transcript }`
  - `voicestart` · bubbles, composed
- **插槽**: —
- **Part**: `button`, `hint`, `icon`
