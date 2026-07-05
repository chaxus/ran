# Tab

Tabbed container that switches between panes. Compose `<r-tabs>` as the container with one or more `<r-tab>` panes inside it.

## Quick Start

### Basic Usage

<Demo column>
  <r-tabs>
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs>
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

Each `<r-tab>` becomes one pane; its `label` is rendered as the header button, and its slotted content is the pane body. Selecting a header slides the corresponding pane into view.

## API Reference

### `r-tabs` Properties

The container. Holds the header row, the active indicator, and the pane content area.

| Property | Type      | Default           | Description                                                          |
| -------- | --------- | ----------------- | -------------------------------------------------------------------- |
| `active` | `string`  | first enabled tab | The `r-key` of the currently active tab                              |
| `type`   | `string`  | `'flat'`          | Header style: `flat`, `line`                                         |
| `align`  | `string`  | `'start'`         | Header alignment: `start`, `center`, `end`                           |
| `effect` | `boolean` | `false`           | Enables ripple on the header buttons and hides the sliding indicator |
| `sheet`  | `string`  | `''`              | CSS text injected into the shadow DOM                                |

> The `active` property setter accepts a key string; assigning `null` removes the attribute. When no `active` is set, the first non-disabled tab is selected on mount.

### `r-tab` Properties

A single pane. Its attributes are read by the parent `<r-tabs>` to build the matching header button.

| Property   | Type      | Default | Description                                                         |
| ---------- | --------- | ------- | ------------------------------------------------------------------- |
| `label`    | `string`  | `''`    | Text shown in the tab header                                        |
| `r-key`    | `string`  | index   | Unique identifier within an `<r-tabs>`; matched against `active`    |
| `icon`     | `string`  | —       | `r-icon` name shown before the label                                |
| `iconSize` | `string`  | —       | Size of the header icon                                             |
| `disabled` | `boolean` | `false` | Makes the tab unselectable                                          |
| `effect`   | `boolean` | —       | Ripple effect on the header (normally set by the parent's `effect`) |
| `sheet`    | `string`  | `''`    | CSS text injected into the shadow DOM                               |

> The `key` property getter/setter reads and writes the `r-key` attribute (the plain `key` name is avoided because it is a reserved field). Set `label` and `r-key` before the element is connected — changes to those two attributes are not re-processed after the headers are built.

### Header Style `type`

`flat` (default) shows a sliding underline indicator; `line` renders bordered tab headers.

<Demo column>
  <r-tabs type="flat">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs type="flat">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>

<r-tabs type="line">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### Header Alignment `align`

Aligns the header row. Defaults to `start`.

<Demo column>
  <r-tabs type="line" align="start">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="center">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="end">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs type="line" align="start"> ... </r-tabs>
<r-tabs type="line" align="center"> ... </r-tabs>
<r-tabs type="line" align="end"> ... </r-tabs>
```

### Active Tab `active` and `r-key`

- `r-key` is an `<r-tab>` attribute that gives each pane a stable identity within the same `<r-tabs>`. When omitted it defaults to the pane's index.
- `active` is an `<r-tabs>` attribute that selects the initially active tab: the pane whose `r-key` equals `active` is shown.

Without explicit keys, `active` matches the zero-based index:

<Demo column>
  <r-tabs active="1">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs active="1">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

With explicit `r-key` values (panes without a key fall back to their index):

<Demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a">11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a">11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

> Every `r-key` within one `<r-tabs>` must be unique — duplicate or missing keys on some panes throw an error while headers are being built.

### Disabled Pane `disabled`

A disabled `<r-tab>` cannot be selected, and it is skipped when picking the default active tab.

<Demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

### Header Icon `icon` and `iconSize`

`<r-tab>` accepts an `icon` attribute (an `r-icon` name) rendered before the label; `iconSize` sets its size.

<Demo column>
  <r-tabs>
    <r-tab label="tab1" icon="edit">11111</r-tab>
    <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs>
  <r-tab label="tab1" icon="edit">11111</r-tab>
  <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### Ripple Effect `effect`

Set `effect` on `<r-tabs>` to enable the click ripple on the header buttons. When `effect` is active the sliding underline indicator is hidden.

<Demo column>
  <r-tabs effect="true">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs effect="true">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

## Slots

| Element  | Slot      | Description                                           |
| -------- | --------- | ----------------------------------------------------- |
| `r-tabs` | (default) | Accepts the `<r-tab>` panes                           |
| `r-tab`  | (default) | The pane's body content, shown when the tab is active |

## CSS Parts

`r-tabs` exposes:

| Part           | Description                             |
| -------------- | --------------------------------------- |
| `tabs`         | Root wrapper                            |
| `header`       | Header row wrapper                      |
| `nav`          | The tablist containing the header items |
| `indicator`    | The sliding underline line              |
| `content`      | Pane content viewport                   |
| `content-wrap` | The sliding track holding all panes     |

`r-tab` exposes:

| Part      | Description             |
| --------- | ----------------------- |
| `content` | The pane's content slot |

## Events

### `change`

`<r-tabs>` dispatches a `change` `CustomEvent` when an observed attribute changes — most notably when the active tab switches. `event.detail.active` is the current active key (the `r-key` of the selected `<r-tab>`, or its index when no `r-key` is set).

```js
const tabs = document.querySelector('r-tabs');
tabs.addEventListener('change', (e) => {
  console.log('active tab:', e.detail.active);
});
```

`<r-tab>` does not dispatch any custom events.

## Best Practices

- **Stable identity**: Give each `<r-tab>` a unique `r-key` and drive selection with `active` on `<r-tabs>` instead of relying on positional indexes.
- **Style choice**: Use `type="line"` for a bordered, document-style tab strip; `type="flat"` (default) for the minimal sliding underline.
- **Alignment**: Use `align="center"` or `align="end"` to reposition the header row within wide containers.
- **Disabled panes**: Mark unavailable panes with `disabled`; they are skipped for both clicks and default selection.
- **Keyboard navigation**: The header row is a WAI-ARIA tablist — arrow keys move between tabs (with `Home`/`End`), and only the active tab is in the tab order.
