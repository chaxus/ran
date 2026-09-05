---
title: ranui 엘리먼트 API
description: ranui의 모든 커스텀 엘리먼트 — 40개 엘리먼트의 어트리뷰트, 프로퍼티, 이벤트, 슬롯, ::part() 이름. 모두 소스에서 추출했습니다.
---

# ranui 엘리먼트 API (자동 생성)

`pnpm -F ranui doc:api`가 컴포넌트 소스에서 자동 생성하므로 실제로 배포되는 코드와
어긋날 수 없습니다. 엘리먼트별로 어트리뷰트, 타입이 붙은 프로퍼티, 이벤트(`detail` 구조와
디스패치 옵션 포함), 슬롯, `::part()` 이름을 정리합니다. 설명은 소스 JSDoc에서 그대로
가져오므로 영어입니다.

각 엘리먼트가 노출하는 CSS 변수는
[style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md)를, 무엇을 고를지는
[디자인 시스템](/ko/src/ranui/design-system/)과 [디자인 가이드](/ko/src/ranui/design-guides/)를 보세요.
엘리먼트별 사용법은 사이드바의 각 페이지에 있고, 여기는 전체 인터페이스를 한자리에 모은 곳입니다.

각 이벤트에는 디스패치 옵션이 함께 적혀 있습니다: `bubbles`(버블링), `composed`(섀도 경계를
넘음), `cancelable`(`preventDefault()`로 취소 가능). **`element-only`** 은 셋 다 아니라는
뜻이며, 조상 노드에 건 위임 리스너로는 절대 받을 수 없습니다. 엘리먼트 자체에 바인딩하세요.

**커스텀 엘리먼트 40개.**

## `<r-attachments>`

소스: `components/attachments/index.ts`

- **어트리뷰트**: `sheet: string`
- **프로퍼티**:
  - `accept: string` — Comma-separated types or extensions, in the form `<input accept>` takes.
  - `attachments: readonly Attachment[]` — The staged files, in the order they arrived.
  - `files: File[]` — Just the files, for building a request body.
  - `maxCount: number` — Most files that may be staged at once; unlimited when unset.
  - `maxSize: number` — Largest file accepted, in bytes.
  - `sheet: string`
- **이벤트**:
  - `attachmentrejected` · bubbles, composed · detail `{ file, reason }`
  - `attachmentschange` · bubbles, composed · detail `{ attachments }`
- **슬롯**: —
- **Part**: `attachment`, `icon`, `list`, `name`, `remove`, `size`, `thumb`

## `<r-button>`

소스: `components/button/index.ts`

- **어트리뷰트**: `aria-label`, `disabled: boolean | string`, `effect: boolean`, `icon: string`, `iconSize: string`, `sheet: string`, `type: string`
- **프로퍼티**:
  - `disabled: boolean | string`
  - `effect: boolean` — Whether the click ripple is drawn. On by default; opt out with `effect="false"`.
  - `icon: string`
  - `iconSize: string`
  - `sheet: string`
  - `type: string` — Visual variant: `''` (default) | `'primary'` (monochrome) | `'warning'` | `'text'`. Drives the `:host([type=...])` styles.
- **이벤트**: —
- **슬롯**: `기본 슬롯`
- **Part**: `button`, `content`

## `<r-card>`

소스: `components/card/index.ts`

- **어트리뷰트**: `description: string`, `heading: string`, `hoverable: boolean`, `sheet: string`
- **프로퍼티**:
  - `description: string`
  - `heading: string` — Heading text.
  - `hoverable: boolean` — Interactive card (Geist): hover darkens the border and lifts to the elevated shadow tier. Purely presentational — gate it to cards that are actually clickable.
  - `sheet: string`
- **이벤트**: —
- **슬롯**: `기본 슬롯`, `extra (이름 있음)`, `footer (이름 있음)`
- **Part**: `body`, `card`, `description`, `extra`, `footer`, `header`, `title`

## `<r-checkbox>`

소스: `components/checkbox/index.ts`

- **어트리뷰트**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `value: string`
- **프로퍼티**: `checked: boolean`, `disabled: boolean`, `required: boolean`, `sheet: string`, `validationMessage: string`, `validity: ValidityState | undefined`, `value: string`
- **이벤트**:
  - `change` · element-only · detail `{ checked }`
- **슬롯**: `기본 슬롯`
- **Part**: `checkbox`, `inner`, `input`, `label`, `wrapper`

## `<r-colorpicker>`

소스: `components/colorpicker/index.ts`

- **어트리뷰트**: `alpha-label`, `disabled: boolean`, `hue-label`, `label: string`, `sheet: string`, `value: string`
- **프로퍼티**:
  - `alphaLabel: string` — Accessible name of the opacity slider.
  - `disabled: boolean`
  - `hueLabel: string` — Accessible name of the hue slider.
  - `label: string` — Accessible name of the swatch that opens the picker. An attribute rather than a
  - `sheet: string`
  - `value: string`
- **이벤트**:
  - `change` · bubbles, composed
- **슬롯**: —
- **Part**: `block`, `swatch`

## `<r-content>`

소스: `components/popover/content/index.ts`

- **어트리뷰트**: —
- **프로퍼티**: —
- **이벤트**:
  - `change` · element-only
- **슬롯**: `기본 슬롯`
- **Part**: —

## `<r-conversation>`

소스: `components/conversation/index.ts`

- **어트리뷰트**: `empty: string`, `follow: boolean`, `loading-older`, `older: string`, `sheet: string`
- **프로퍼티**:
  - `empty: string` — Text shown while the projection has produced no rows.
  - `follow: boolean` — Whether new content is followed until the reader scrolls away from the floor.
  - `loadingOlder: boolean` — Whether a page is in flight; the affordance stays visible and goes inert.
  - `older: string` — Label for the paging affordance above the first row. Empty hides it.
  - `pinned: boolean` — Whether the view is currently following new content.
  - `sheet: string`
- **이벤트**:
  - `olderrequest` · bubbles, composed
  - `pinnedchange` · bubbles, composed · detail `{ pinned }`
- **슬롯**: `footer (이름 있음)`
- **Part**: `conversation`, `empty`, `footer`, `list`, `older`

## `<r-disclosure-row>`

소스: `components/disclosure-row/index.ts`

- **어트리뷰트**: `busy: boolean`, `expandable: boolean`, `heading: string`, `name: string`, `open: boolean`, `sheet: string`, `summary: string`, `tone: string`
- **프로퍼티**:
  - `busy: boolean` — Whether the work this row stands for is still running.
  - `expandable: boolean` — Whether the row has a body worth opening.
  - `heading: string` — The fixed-width left half of the line.
  - `name: string` — Groups rows so that opening one closes the rest.
  - `open: boolean` — Whether the body is shown.
  - `sheet: string`
  - `summary: string` — The truncating right half. Empty drops the separator with it.
  - `tone: string` — `error` colours the summary; anything else is the ordinary tone.
- **이벤트**:
  - `disclosurebeforetoggle` · bubbles, composed, cancelable · detail `{ open }`
  - `disclosuretoggle` · bubbles, composed · detail `{ open }`
- **슬롯**: `기본 슬롯`, `leading (이름 있음)`
- **Part**: `body`, `disclosure`, `leading`, `row`, `separator`, `summary`, `title`

## `<r-dropdown>`

소스: `components/dropdown/index.ts`

- **어트리뷰트**: `arrow: string`, `sheet: string`, `transit: string`
- **프로퍼티**: `arrow: string`, `sheet: string`, `transit: string`
- **이벤트**: —
- **슬롯**: `기본 슬롯`
- **Part**: `dropdown`

## `<r-dropdown-item>`

소스: `components/select/dropdown-item/index.ts`

- **어트리뷰트**: `active: string`, `sheet: string`, `title: string`, `value: string`
- **프로퍼티**: `active: string`, `sheet: string`, `title: string`, `value: string`
- **이벤트**: —
- **슬롯**: `기본 슬롯`
- **Part**: `content`, `item`

## `<r-glass>`

소스: `components/glass/index.ts`

- **어트리뷰트**: `blur`, `displace: string`, `frequency: string`, `interactive: boolean`, `radius: string`, `rim: boolean`, `saturate: string`, `tint: string`
- **프로퍼티**:
  - `displace: string` — Liquid refraction strength — the SVG displacement scale. `0` is a flat pane.
  - `frequency: string` — Turbulence base frequency — smaller = larger, smoother liquid ripples.
  - `interactive: boolean` — Hover lift + press-scale feedback, for clickable glass. Also makes the host
  - `radius: string` — Corner radius, in px.
  - `rim: boolean` — Opt-in GPU specular rim + chromatic edge, lit from a fixed top-left light —
  - `saturate: string` — Backdrop saturation, as a percentage number (e.g. `180`).
  - `sheen: boolean` — Animated specular sweep across the surface.
  - `tint: string` — Glass fill tint (any CSS background value).
- **이벤트**: —
- **슬롯**: `기본 슬롯`
- **Part**: `glass`, `specular`

## `<r-icon>`

소스: `components/icon/index.ts`

- **어트리뷰트**: `aria-label`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
- **프로퍼티**: `ariaLabel: string`, `color: string`, `decorative: boolean`, `name: string`, `sheet: string`, `size: string`, `spin: boolean`
- **이벤트**:
  - `ranui-icon-registered` · element-only · detail `{ name }`
- **슬롯**: —
- **Part**: `ran-icon`

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

소스: `components/image/index.ts`

- **어트리뷰트**: —
- **프로퍼티**:
  - `alt` — Alternative text forwarded to the inner `<img>`. Defaults to `''` (empty),
  - `fallback`
  - `sheet`
- **이벤트**: —
- **슬롯**: —
- **Part**: —

## `<r-input>`

소스: `components/input/index.ts`

- **어트리뷰트**: `disabled: boolean`, `icon: string`, `label: string`, `max: string`, `message: string`, `min: string`, `name: string`, `placeholder: string`, `required: boolean`, `sheet: string`, `status: string`, `step: string`, `type: string`, `value: string`
- **프로퍼티**:
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
- **이벤트**:
  - `change` · element-only · detail `{ value }`
  - `input` · element-only · detail `{ value }`
- **슬롯**: —
- **Part**: `content`, `input`, `label`, `message`

## `<r-link>`

소스: `components/link/index.ts`

- **어트리뷰트**: `href: string`, `replace: boolean`, `sheet: string`
- **프로퍼티**: `href: string`, `replace: boolean`, `sheet: string`
- **이벤트**:
  - `ran-navigate` · bubbles, composed · detail `{ path, replace }`
- **슬롯**: —
- **Part**: —

## `<r-loading>`

소스: `components/loading/index.ts`

- **어트리뷰트**: `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`, `sheet: string`
- **프로퍼티**: `name: 'double-bounce' | 'rotate' | 'stretch' | 'cube' | 'dot' | 'triple-bounce' | 'scale-out' | 'circle' | 'circle-line' | 'square' | 'pulse' | 'solar' | 'cube-fold' | 'circle-fold' | 'cube-grid' | 'circle-turn' | 'circle-rotate' | 'circle-spin' | 'dot-bar' | 'dot-circle' | 'line' | 'dot-pulse' | 'line-scale' | 'text' | 'cube-dim' | 'dot-line' | 'arc' | 'drop' | 'pacman'`, `sheet: string`
- **이벤트**: —
- **슬롯**: —
- **Part**: —

## `<r-markdown>`

소스: `components/markdown/index.ts`

- **어트리뷰트**: `caret: string`, `content: string`, `copy`, `download`, `highlight: string | null`, `inline-math`, `line-numbers`, `link-target`, `mode: string`, `sheet: string`, `theme: string`
- **프로퍼티**:
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
- **이벤트**:
  - `copied` · bubbles, composed · detail `{ code, kind, language }`
  - `download` · bubbles, composed · detail `{ filename, kind, language }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ blocks, changed }`
- **슬롯**: —
- **Part**: `block`, `body`, `error`, `markdown`

## `<r-math>`

소스: `components/math/index.ts`

- **어트리뷰트**: `copy`, `display: string`, `download`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **프로퍼티**: `copyable: boolean`, `copyTarget: 'source' | 'mathml'`, `display: string`, `downloadable: boolean`, `font: string`, `latex: string`, `macros: Record<string, string> | undefined`, `sheet: string`, `wrap: 'none' | 'tex' | '=' | undefined`
- **이벤트**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `render` · bubbles, composed · detail `{ ok }`
- **슬롯**: —
- **Part**: `button`, `error`, `math`, `menu`, `render`, `toolbar`

## `<r-mermaid>`

소스: `components/mermaid/index.ts`

- **어트리뷰트**: `code: string`, `copy`, `download`, `fullscreen`, `sheet: string`, `theme: string`
- **프로퍼티**: `code: string`, `copyable: boolean`, `downloadable: boolean`, `fullscreenable: boolean`, `sheet: string`, `theme: string`
- **이벤트**:
  - `copied` · bubbles, composed · detail `{ kind }`
  - `download` · bubbles, composed · detail `{ format }`
  - `error` · bubbles, composed · detail `{ message }`
  - `fullscreenchange` · bubbles, composed · detail `{ open }`
  - `render` · bubbles, composed · detail `{ ok }`
- **슬롯**: —
- **Part**: `button`, `diagram`, `error`, `menu`, `mermaid`, `toolbar`

## `<r-message>`

소스: `components/message/index.ts`

- **어트리뷰트**: —
- **프로퍼티**: `content: string | null`, `sheet: string`, `type: string | null`
- **이벤트**: —
- **슬롯**: —
- **Part**: —

## `<r-modal>`

소스: `components/modal/index.ts`

- **어트리뷰트**: `autoFocus: boolean`, `closable: boolean`, `closeOnEsc: boolean`, `heading: string`, `hide-header`, `lockScroll: boolean`, `maskClosable: boolean`, `open: boolean`, `sheet: string`
- **프로퍼티**:
  - `autoFocus: boolean`
  - `closable: boolean`
  - `closeOnEsc: boolean`
  - `heading: string` — Heading text.
  - `hideHeader: boolean` — Headerless mode: drops the title bar and its border, leaving only a floating
  - `lockScroll: boolean`
  - `maskClosable: boolean`
  - `open: boolean`
  - `sheet: string`
- **이벤트**:
  - `afterclose` · element-only · detail `{ trigger }`
  - `afteropen` · element-only
  - `beforeclose` · cancelable · detail `{ trigger }`
  - `beforeopen` · cancelable
  - `close` · element-only · detail `{ trigger }`
  - `open` · element-only
- **슬롯**: `기본 슬롯`, `footer (이름 있음)`
- **Part**: `body`, `close`, `dialog`, `footer`, `header`, `mask`, `root`, `title`

## `<r-option>`

소스: `components/select/option/index.ts`

- **어트리뷰트**: —
- **프로퍼티**: `disabled: boolean | string | undefined | null`, `sheet`, `value`
- **이벤트**: —
- **슬롯**: `기본 슬롯`
- **Part**: —

## `<r-player>`

소스: `components/player/index.ts`

- **어트리뷰트**: `autoplay: boolean`, `currenttime`, `currentTime: string`, `debug: string`, `disable-error-modal`, `format: string`, `loop: boolean`, `muted: boolean`, `playbackrate`, `playbackRate: string`, `poster: string`, `remember-position`, `sheet: string`, `src: string`, `thumbnails: string`, `volume: string`
- **프로퍼티**:
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
- **이벤트**:
  - `change` · element-only · detail `{ currentTime, data, duration, tag, type }`
- **슬롯**: —
- **Part**: —

## `<r-popover>`

소스: `components/popover/index.ts`

- **어트리뷰트**: `open: boolean`, `placement: Placement`, `sheet: string`, `trigger: string`
- **프로퍼티**:
  - `getPopupContainerId: string`
  - `open: boolean` — Whether the panel is showing.
  - `placement: Placement` — Which side of the trigger the panel sits on, with an optional alignment.
  - `sheet: string`
  - `trigger: string`
- **이벤트**:
  - `after-hide` · element-only
  - `after-show` · element-only
  - `hide` · element-only
  - `show` · element-only
- **슬롯**: `기본 슬롯`
- **Part**: —

## `<r-progress>`

소스: `components/progress/index.ts`

- **어트리뷰트**: `drag`, `primary`
- **프로퍼티**: `dot: string`, `percent: string`, `sheet: string`, `total: string`, `type: string`
- **이벤트**:
  - `change` · element-only · detail `{ percent, total, value }`
- **슬롯**: —
- **Part**: `dot`, `fill`, `track`

## `<r-radar>`

소스: `components/radar/index.ts`

- **어트리뷰트**: —
- **프로퍼티**: `abilitys`, `colorLine`, `colorPolygon`, `fillColor`, `fontColor`, `sheet`, `strokeColor`
- **이벤트**: —
- **슬롯**: —
- **Part**: —

## `<r-reasoning>`

소스: `components/reasoning/index.ts`

- **어트리뷰트**: `duration: number | null`, `label: string`, `open: boolean`, `sheet: string`, `streaming: boolean`
- **프로퍼티**:
  - `content: string` — The reasoning text. Assigning repeatedly is the streaming path.
  - `duration: number | null` — How long the model spent, in milliseconds. Rendered beside the label when set.
  - `label: string` — Summary text. Defaults to `Reasoning`.
  - `open: boolean` — Whether the body is expanded.
  - `sheet: string`
  - `streaming: boolean` — Whether reasoning is still arriving.
- **이벤트**: —
- **슬롯**: `기본 슬롯`
- **Part**: `body`, `row`, `text`

## `<r-route>`

소스: `components/route/index.ts`

- **어트리뷰트**: `exact: boolean`, `path: string`, `sheet: string`, `src: string`
- **프로퍼티**:
  - `exact: boolean`
  - `params: Record<string, string>`
  - `path: string`
  - `sheet: string`
  - `src: string` — Module specifier for lazy, code-split, mount/unmount page rendering.
- **이벤트**:
  - `routematch` · bubbles · detail `{ params, path }`
- **슬롯**: `기본 슬롯`
- **Part**: —

## `<r-router>`

소스: `components/router/index.ts`

- **어트리뷰트**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **프로퍼티**: `base: string`, `mode: 'history' | 'hash'`, `sheet: string`
- **이벤트**:
  - `routechange` · bubbles · detail `{ path }`
- **슬롯**: `기본 슬롯`
- **Part**: —

## `<r-scratch>`

소스: `components/scratch/index.ts`

- **어트리뷰트**: `disabled: boolean`, `sheet: string`
- **프로퍼티**: `disabled: boolean`, `sheet: string`
- **이벤트**: —
- **슬롯**: `기본 슬롯`
- **Part**: `award`

## `<r-section>`

소스: `components/section/index.ts`

- **어트리뷰트**: `heading: string`, `sheet: string`, `subtitle: string`
- **프로퍼티**: `heading: string`, `sheet: string`, `subtitle: string`
- **이벤트**: —
- **슬롯**: `기본 슬롯`
- **Part**: `body`, `header`, `heading`, `subtitle`

## `<r-select>`

소스: `components/select/index.ts`

- **어트리뷰트**: `defaultvalue`, `disabled: boolean`, `dropdownclass: string`, `getpopupcontainerid`, `label: string`, `open: boolean`, `placement: Placement`, `required: boolean`, `sheet: string`, `showsearch`, `trigger: string`, `type: string`, `value: string`
- **프로퍼티**:
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
- **이벤트**:
  - `after-hide` · element-only
  - `after-show` · element-only
  - `change` · element-only · detail `{ label, value }`
  - `hide` · element-only
  - `search` · element-only · detail `{ value }`
  - `show` · element-only
- **슬롯**: `기본 슬롯`
- **Part**: `icon`, `label`, `search`, `select`, `selection`, `selection-item`

## `<r-skeleton>`

소스: `components/skeleton/index.ts`

- **어트리뷰트**: `sheet: string`
- **프로퍼티**: `sheet: string`
- **이벤트**: —
- **슬롯**: —
- **Part**: —

## `<r-state-dot>`

소스: `components/state-dot/index.ts`

- **어트리뷰트**: `label: string`, `sheet: string`, `state: 'idle' | 'running' | 'success' | 'warning' | 'error'`
- **프로퍼티**:
  - `label: string` — Accessible name.
  - `sheet: string`
  - `state: 'idle' | 'running' | 'success' | 'warning' | 'error'` — Which lifecycle step to show. Unknown values render as `idle`.
- **이벤트**: —
- **슬롯**: —
- **Part**: `dot`

## `<r-tab>`

소스: `components/tabpane/index.ts`

- **어트리뷰트**: —
- **프로퍼티**: `disabled`, `effect`, `icon`, `iconSize`, `key`, `label`, `sheet`
- **이벤트**: —
- **슬롯**: `기본 슬롯`
- **Part**: `content`

## `<r-tabs>`

소스: `components/tab/index.ts`

- **어트리뷰트**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **프로퍼티**: `active: string | null`, `align: string`, `effect: string | null`, `sheet: string`, `type: string`
- **이벤트**:
  - `change` · element-only · detail `{ active }`
- **슬롯**: `기본 슬롯`
- **Part**: `content`, `content-wrap`, `header`, `indicator`, `nav`, `tabs`

## `<r-theme-switch>`

소스: `components/theme-switch/index.ts`

- **어트리뷰트**: `label-dark`, `label-light`, `label-system`, `sheet: string`
- **프로퍼티**:
  - `sheet: string`
  - `value: RanThemeName` — Current selection; falls back to 'system' when nothing is forced.
- **이벤트**:
  - `change` · bubbles, composed · detail `{ theme }`
- **슬롯**: —
- **Part**: `button ${choice}`, `switch`

## `<r-token-meter>`

소스: `components/token-meter/index.ts`

- **어트리뷰트**: `label: string`, `limit: number`, `sheet: string`, `spent: number`, `used: number`
- **프로퍼티**:
  - `label: string` — Prefix for the readout. Defaults to `Context`; an empty string leaves only the counts.
  - `level: 'ok' | 'warn' | 'over'` — How full the window is. Derived; assigning it is overwritten on the next update.
  - `limit: number` — Context window size in tokens. Zero or absent hides the bar and shows only counts.
  - `sheet: string`
  - `spent: number` — Tokens billed across the conversation so far.
  - `used: number` — Tokens the next request will carry — the history, not the whole conversation.
- **이벤트**: —
- **슬롯**: —
- **Part**: `meter`, `text`

## `<r-tool-card>`

소스: `components/tool-card/index.ts`

- **어트리뷰트**: `open: boolean`, `sheet: string`, `status: ToolCardStatus`
- **프로퍼티**:
  - `call: ToolCallView | null` — The pending view, derived from the call's arguments.
  - `open: boolean` — Whether the body is expanded.
  - `result: ToolResultView | null` — The completed view. Replaces the pending one once set.
  - `sheet: string`
  - `status: ToolCardStatus` — Lifecycle of the call, reflected so styling can key off it.
- **이벤트**:
  - `locationclick` · bubbles, composed · detail `{ location }`
- **슬롯**: —
- **Part**: `body`, `exit`, `file`, `hunk`, `io`, `io-text`, `line`, `location`, `locations`, `path`, `row`

## `<r-voice-button>`

소스: `components/voice-button/index.ts`

- **어트리뷰트**: `active-label`, `cancel-hint`, `cancelling`, `disabled: boolean`, `hold-hint`, `holding`, `label: string`, `listening: boolean`, `sheet: string`
- **프로퍼티**:
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
- **이벤트**:
  - `voiceend` · bubbles, composed
  - `voiceerror` · bubbles, composed
  - `voiceresult` · bubbles, composed · detail `{ isFinal, transcript }`
  - `voicestart` · bubbles, composed
- **슬롯**: —
- **Part**: `button`, `hint`, `icon`
