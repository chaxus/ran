# Popover

Popover component that reveals a floating bubble card layer when the trigger is hovered or clicked.

## Quick Start

### Basic Usage

The trigger lives in the default slot; the floating content is wrapped in a nested `<r-content>` element.

<Demo>
  <r-popover style="display: inline-block;">
    <r-button>popover</r-button>
    <r-content>
      <div>this is content</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover style="display: inline-block;">
  <r-button>popover</r-button>
  <r-content>
    <div>this is content</div>
  </r-content>
</r-popover>
```

## API Reference

### Properties

| Property              | Type     | Default   | Description                                                                        |
| --------------------- | -------- | --------- | ---------------------------------------------------------------------------------- |
| `placement`           | `string` | `'top'`   | Panel position relative to the trigger: `top`, `bottom`, `left`, `right`           |
| `trigger`             | `string` | `'hover'` | How the panel opens: `hover` or `click` (a `click` handler is always bound)        |
| `getPopupContainerId` | `string` | `''`      | `id` of an element to position the panel within (read at open time; not reflected) |
| `sheet`               | `string` | `''`      | CSS injected into the component's shadow DOM                                       |

### Trigger Mode `trigger`

<Demo>
  <r-popover trigger="hover" style="display: inline-block;">
    <r-button>hover</r-button>
    <r-content>
      <div>hover</div>
    </r-content>
  </r-popover>
  <r-popover trigger="click" style="display: inline-block;">
    <r-button>click</r-button>
    <r-content>
      <div>click</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover trigger="hover" style="display: inline-block;">
  <r-button>hover</r-button>
  <r-content>
    <div>hover</div>
  </r-content>
</r-popover>

<r-popover trigger="click" style="display: inline-block;">
  <r-button>click</r-button>
  <r-content>
    <div>click</div>
  </r-content>
</r-popover>
```

### Placement `placement`

<Demo column>
  <r-popover trigger="hover" placement="top" style="display: inline-block;">
    <r-button>top</r-button>
    <r-content>
      <div>top</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div>bottom</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="left" style="display: inline-block;">
    <r-button>left</r-button>
    <r-content>
      <div>left</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="right" style="display: inline-block;">
    <r-button>right</r-button>
    <r-content>
      <div>right</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover trigger="hover" placement="top" style="display: inline-block;">
  <r-button>top</r-button>
  <r-content>
    <div>top</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="bottom" style="display: inline-block;">
  <r-button>bottom</r-button>
  <r-content>
    <div>bottom</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="left" style="display: inline-block;">
  <r-button>left</r-button>
  <r-content>
    <div>left</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="right" style="display: inline-block;">
  <r-button>right</r-button>
  <r-content>
    <div>right</div>
  </r-content>
</r-popover>
```

## Slots

| Component     | Slot      | Description                                                                                    |
| ------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `<r-popover>` | (default) | The trigger element plus the `<r-content>` wrapper                                             |
| `<r-content>` | (default) | The floating panel's content; these children are portaled to `document.body` and shown on open |

Both components expose a single unnamed default slot — there are no named slots.

## Events

`<r-popover>` dispatches no custom events. It is driven by standard DOM interaction:

- **Open**: `mouseenter` (when `trigger` includes `hover`), `click`, or pressing `Enter` / `Space` while focused.
- **Close**: `mouseleave` (hover mode), pressing `Escape`, or a `click` elsewhere in the document.

Internally, the companion `<r-content>` element watches its own subtree with a `MutationObserver` and emits a `change` `CustomEvent` (`detail: { type, value: { content, mutation } }`) that the popover consumes to keep the panel in sync. This is an implementation detail rather than a public API.

Accessibility is wired automatically: the host receives `tabindex="0"`, `aria-haspopup="dialog"`, and an `aria-expanded` that toggles between `"false"` and `"true"` as the panel opens and closes.

## Best Practices

- **Trigger element**: Place a focusable control (e.g. `<r-button>`) as the trigger so keyboard open/close works.
- **Content wrapper**: Always wrap panel content in `<r-content>` — plain children that are not inside `<r-content>` are not shown as the floating panel.
- **Inline sizing**: The host is `display: block`; add `style="display: inline-block;"` (or place it in an inline context) so it shrinks to the trigger.
- **Placement**: Choose the `placement` that keeps the panel within the viewport for the trigger's position.
- **Scoped container**: Use `getPopupContainerId` to anchor the panel inside a specific scroll/positioning container when the default body-level positioning is not desired.
