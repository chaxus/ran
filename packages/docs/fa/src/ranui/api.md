---
title: API عناصر ranui
description: 'همهٔ عناصر سفارشی ranui — 41 عنصر همراه با ویژگی‌ها، خصیصه‌ها، رویدادها، اسلات‌ها و نام‌های ()::part، همگی استخراج‌شده از کد منبع.'
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

**41 عنصر سفارشی.**

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
  - `disabled: boolean | string` — Blocks clicks and keyboard activation and removes the button from the tab order. Off by default; `disabled="false"` counts as enabled.
  - `effect: boolean` — Whether the click ripple is drawn. On by default; opt out with `effect="false"`.
  - `icon: string` — Name of an `<r-icon>` drawn before the label, for example `'search'`. No icon when empty.
  - `iconSize: string` — Icon size passed to the inner `<r-icon>`. Defaults to about 1.15× the button's font size; set it only when the icon needs a fixed size.
  - `sheet: string`
  - `type: string` — Visual variant: `''` (default) | `'primary'` (monochrome) | `'warning'` | `'text'`. Drives the `:host([type=...])` styles.
- **رویدادها**: —
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: `button`, `content`

## `<r-card>`

کد منبع: `components/card/index.ts`

- **ویژگی‌ها (attribute)**: `description: string`, `heading: string`, `hoverable: boolean`, `sheet: string`
- **خصیصه‌ها (property)**:
  - `description: string` — Secondary text shown under the heading. Empty by default; the header is hidden when the heading, description and `extra` slot are all empty.
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
  - `disabled: boolean` — Blocks opening the picker and emitting `change`, and removes the swatch from the tab order. Off by default; `disabled="false"` counts as enabled.
  - `hueLabel: string` — Accessible name of the hue slider.
  - `label: string` — Accessible name of the swatch that opens the picker. Defaults to `'Choose color'`.
  - `sheet: string`
  - `value: string` — Selected colour as `#rrggbb` (or `#rgb`), `rgb(...)` or `rgba(...)`; picking a colour writes a hex value, or `rgba(...)` when opacity is below 1. Unparseable values are ignored. Empty until set; the swatch starts white.
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

## `<r-fan-gallery>`

کد منبع: `components/fan-gallery/index.ts`

- **ویژگی‌ها (attribute)**: `sheet: string`, `spread: string`
- **خصیصه‌ها (property)**:
  - `sheet: string`
  - `spread: string` — Angle in degrees between the first and last child once open. Defaults to `24`; `0` lines them up.
- **رویدادها**: —
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: `stage`

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

کد منبع: `components/image/index.ts`

- **ویژگی‌ها (attribute)**: `alt`, `fallback`, `sheet`, `src`
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

- **ویژگی‌ها (attribute)**: `caret: string`, `content: string`, `copy`, `download`, `highlight: string | null`, `inline-math`, `label-copy-error`, `line-numbers`, `link-target`, `mode: string`, `sheet: string`, `theme: string`
- **خصیصه‌ها (property)**:
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
- **رویدادها**:
  - `copied` · bubbles, composed · detail `{ code, kind, language }`
  - `download` · bubbles, composed · detail `{ filename, kind, language }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ blocks, changed }`
- **اسلات‌ها**: —
- **Part‌ها**: `block`, `body`, `button`, `code`, `code-actions`, `code-header`, `code-lang`, `copy-status`, `error`, `markdown`, `table`

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
- **Part‌ها**: `button`, `copy-status`, `error`, `math`, `menu`, `render`, `toolbar`

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
- **Part‌ها**: `button`, `copy-status`, `diagram`, `error`, `menu`, `mermaid`, `toolbar`

## `<r-message>`

کد منبع: `components/message/index.ts`

- **ویژگی‌ها (attribute)**: `content: string | null`, `sheet: string`, `type: string | null`
- **خصیصه‌ها (property)**: `content: string | null`, `sheet: string`, `type: string | null`
- **رویدادها**: —
- **اسلات‌ها**: —
- **Part‌ها**: —

## `<r-modal>`

کد منبع: `components/modal/index.ts`

- **ویژگی‌ها (attribute)**: `autoFocus: boolean`, `closable: boolean`, `closeOnEsc: boolean`, `heading: string`, `hide-header`, `lockScroll: boolean`, `maskClosable: boolean`, `open: boolean`, `sheet: string`
- **خصیصه‌ها (property)**:
  - `autoFocus: boolean` — Moves focus to the first focusable element in the dialog (or the dialog itself) when it opens. On by default; turn off with `autoFocus="false"`.
  - `closable: boolean` — Shows the close button in the corner. On by default; turn off with `closable="false"` when the dialog must be closed by its own actions.
  - `closeOnEsc: boolean` — Closes the topmost dialog when Escape is pressed. On by default; turn off with `closeOnEsc="false"`.
  - `heading: string` — Heading text shown in the title bar; falls back to `Modal` when empty.
  - `hideHeader: boolean` — Headerless mode for content-only dialogs such as image lightboxes: drops the title bar and keeps only a floating close button when `closable`. Off by default.
  - `lockScroll: boolean` — Stops the page behind from scrolling while the dialog is open. On by default; turn off with `lockScroll="false"`.
  - `maskClosable: boolean` — Closes the dialog when the backdrop outside it is clicked. On by default; turn off with `maskClosable="false"` for forms that must not be dismissed by a stray click.
  - `open: boolean` — Shows the dialog when set and closes it when removed. Off by default; `open="false"` counts as closed.
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

- **ویژگی‌ها (attribute)**: `disabled: boolean | string | undefined | null`, `sheet`, `value`
- **خصیصه‌ها (property)**: `disabled: boolean | string | undefined | null`, `sheet`, `value`
- **رویدادها**: —
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: —

## `<r-player>`

کد منبع: `components/player/index.ts`

- **ویژگی‌ها (attribute)**: `autoplay: boolean`, `currenttime`, `currentTime: string`, `debug: string`, `disable-error-modal`, `format: string`, `loop: boolean`, `muted: boolean`, `playbackrate`, `playbackRate: string`, `poster: string`, `remember-position`, `sheet: string`, `src: string`, `thumbnails: string`, `volume: string`
- **خصیصه‌ها (property)**:
  - `autoplay: boolean` — Start playback as soon as the video can play, via the native `autoplay` flag. Browsers usually block unmuted autoplay, so pair it with `muted`. Off by default.
  - `controllerBarTimeId: ReturnType<typeof setTimeout> | undefined` — Internal timer id for auto-hiding the control bar. Not meant to be set by consumers.
  - `currentTime: string` — Playback position in seconds, also accepted as `currenttime`. In the markup it is the start position; a later change seeks. The getter returns the attribute, not the live position.
  - `debug: string` — Any non-empty value logs every internal `change` event and source-load errors to the console. An empty value (`<r-player debug>`) leaves logging off.
  - `disableErrorModal: boolean` — Suppress the built-in "Playback failed" dialog with its Retry button, for apps that show their own error UI. Off by default, so the dialog shows.
  - `format: string` — Playback engine: `'hls'` | `'dash'` | `'flv'` | `'webrtc'` | `'native'`. Empty by default, which detects it from the `src` extension; set it for signed or extensionless URLs, and always for `webrtc` (a WHEP endpoint).
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
- **رویدادها**:
  - `change` · element-only · detail `{ currentTime, data, duration, tag, type }`
- **اسلات‌ها**: —
- **Part‌ها**: —

## `<r-popover>`

کد منبع: `components/popover/index.ts`

- **ویژگی‌ها (attribute)**: `open: boolean`, `placement: Placement`, `sheet: string`, `trigger: string`
- **خصیصه‌ها (property)**:
  - `getPopupContainerId: string` — Id of the element the panel is mounted into, looked up in the popover's own root first and then the document. Defaults to `document.body`.
  - `open: boolean` — Whether the panel is showing.
  - `placement: Placement` — Which side of the trigger the panel sits on, with an optional alignment. Defaults to `'top'`.
  - `sheet: string`
  - `trigger: string` — How the panel opens: `'hover'` | `'click'`. Default `'hover'`. Click toggles the panel in either mode; hover is ignored on mobile devices.
- **رویدادها**:
  - `after-hide` · element-only
  - `after-show` · element-only
  - `hide` · element-only
  - `show` · element-only
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: —

## `<r-progress>`

کد منبع: `components/progress/index.ts`

- **ویژگی‌ها (attribute)**: `dot: string`, `percent: string`, `sheet: string`, `total: string`, `type: string`
- **خصیصه‌ها (property)**: `dot: string`, `percent: string`, `sheet: string`, `total: string`, `type: string`
- **رویدادها**:
  - `change` · element-only · detail `{ percent, total, value }`
- **اسلات‌ها**: —
- **Part‌ها**: `dot`, `fill`, `track`

## `<r-radar>`

کد منبع: `components/radar/index.ts`

- **ویژگی‌ها (attribute)**: `abilitys`, `colorline`, `colorpolygon`, `fillcolor`, `sheet`, `strokecolor`
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
  - `exact: boolean` — Match only the full path, so `/users` no longer shows for `/users/42`. Off by default; set it on a `/` home route.
  - `params: Record<string, string>` — Read-only. Values captured by the `:name` segments of `path` on the last match, URL-decoded. Empty when the route does not match.
  - `path: string` — Path pattern this route shows for. `:name` segments capture params and `*` matches the rest. Without `exact`, deeper paths also match. Defaults to `'/'`.
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

- **ویژگی‌ها (attribute)**: `disabled: boolean`, `reveal-label`, `revealed-label`, `sheet: string`
- **خصیصه‌ها (property)**: `disabled: boolean`, `revealedLabel: string`, `revealLabel: string`, `sheet: string`
- **رویدادها**: —
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: `award`, `reveal-button`

## `<r-section>`

کد منبع: `components/section/index.ts`

- **ویژگی‌ها (attribute)**: `heading: string`, `sheet: string`, `subtitle: string`
- **خصیصه‌ها (property)**: `heading: string`, `sheet: string`, `subtitle: string`
- **رویدادها**: —
- **اسلات‌ها**: `پیش‌فرض`
- **Part‌ها**: `body`, `header`, `heading`, `subtitle`

## `<r-select>`

کد منبع: `components/select/index.ts`

- **ویژگی‌ها (attribute)**: `defaultvalue`, `disabled: boolean`, `dropdownclass: string`, `getpopupcontainerid`, `label: string`, `open: boolean`, `placeholder: string`, `placement: Placement`, `required: boolean`, `sheet: string`, `showsearch`, `trigger: string`, `type: string`, `value: string`
- **خصیصه‌ها (property)**:
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

- **ویژگی‌ها (attribute)**: `disabled`, `effect`, `icon`, `iconsize`, `key`, `label`, `sheet`
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

- **ویژگی‌ها (attribute)**: `label`, `label-dark`, `label-light`, `label-system`, `sheet: string`
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
- **رویدادها**:
  - `voiceend` · bubbles, composed
  - `voiceerror` · bubbles, composed
  - `voiceresult` · bubbles, composed · detail `{ isFinal, transcript }`
  - `voicestart` · bubbles, composed
- **اسلات‌ها**: —
- **Part‌ها**: `button`, `hint`, `icon`
