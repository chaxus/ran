---
description: 'The ranui Popover (<r-popover>) reveals a floating bubble card on hover or click, for tooltips, menus and contextual content.'
---

# Popover

Popover component that reveals a floating bubble card layer when the trigger is hovered or clicked.

> **Use when** you need a floating bubble panel that opens on hover or click of a trigger — `<r-popover>` positions and portals its `<r-content>` panel and wires the accessibility for you.

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

| Property              | Type     | Default   | Description                                                                                                                                     |
| --------------------- | -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `placement`           | `string` | `'top'`   | Panel position relative to the trigger: `top`, `bottom`, `left`, `right`, each optionally suffixed with `-start` (default), `-center` or `-end` |
| `trigger`             | `string` | `'hover'` | How the panel opens: `hover` or `click` (a `click` handler is always bound)                                                                     |
| `getPopupContainerId` | `string` | `''`      | `id` of an element to position the panel within (read at open time; not reflected)                                                              |
| `sheet`               | `string` | `''`      | CSS injected into the component's shadow DOM                                                                                                    |

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

### Alignment `placement="<side>-<align>"`

A bare side lines the panel's leading edge up with the trigger's. Add `-center` or `-end` when it
should sit centred on the trigger, or flush with the trigger's trailing edge instead — what a menu
anchored to the right end of a header bar wants, so that it opens inwards rather than being pushed
back inside the viewport by the shift. The suffix survives an auto-flip: `bottom-end` becomes
`top-end`, not `top`.

<Demo column>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div style="width: 200px;">bottom — same as bottom-start</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-center" style="display: inline-block;">
    <r-button>bottom-center</r-button>
    <r-content>
      <div style="width: 200px;">bottom-center</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
    <r-button>bottom-end</r-button>
    <r-content>
      <div style="width: 200px;">bottom-end</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
  <r-button>bottom-end</r-button>
  <r-content>
    <div style="width: 200px;">bottom-end</div>
  </r-content>
</r-popover>
```

## Slots

| Component     | Slot      | Description                                                                                    |
| ------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `<r-popover>` | (default) | The trigger element plus the `<r-content>` wrapper                                             |
| `<r-content>` | (default) | The floating panel's content; these children are portaled to `document.body` and shown on open |

Both components expose a single unnamed default slot — there are no named slots.

## Open State `open`

`open` is the panel's state, reflected as an attribute the way `<details open>` and `<dialog open>` are. Nothing infers it from the panel's `display`, which trails the state by the length of the exit animation — so the attribute, `aria-expanded` and what is on screen cannot disagree.

```html
<r-popover id="pop" trigger="click">
  <r-button>Trigger</r-button>
  <r-content><div>Content</div></r-content>
</r-popover>

<script>
  const pop = document.getElementById('pop');
  pop.open = true; // or pop.show()
  pop.open = false; // or pop.hide()
  pop.toggle();
</script>
```

`show()`, `hide()` and `toggle()` are thin wrappers over it. `closePopover()` remains as an alias for `hide()`.

## Events

`<r-popover>` fires four events around the panel's transitions, none of which carry a `detail`:

| Event        | When                                                     |
| ------------ | -------------------------------------------------------- |
| `show`       | The panel is about to appear.                            |
| `after-show` | It has appeared and any entrance animation has finished. |
| `hide`       | The panel is about to close.                             |
| `after-hide` | It has closed and any exit animation has finished.       |

The wait is the stylesheet's own animation rather than a duration copied into script, so under `prefers-reduced-motion` — where there is no animation to play — `after-hide` follows `hide` immediately instead of after a fixed delay.

It is otherwise driven by standard DOM interaction:

- **Open**: `mouseenter` (when `trigger` includes `hover`), `click`, or pressing `Enter` / `Space` while focused.
- **Close**: `mouseleave` (hover mode), pressing `Escape`, or a `click` elsewhere in the document.

Internally, the companion `<r-content>` element watches its own subtree with a `MutationObserver` and emits a `change` `CustomEvent` (`detail: { type, value: { content, mutation } }`) that the popover consumes to keep the panel in sync. This is an implementation detail rather than a public API.

Accessibility is wired automatically: the host receives `tabindex="0"`, `aria-haspopup="dialog"`, and an `aria-expanded` that toggles between `"false"` and `"true"` as the panel opens and closes.

## Best Practices

- **Trigger element**: Place a focusable control (e.g. `<r-button>`) as the trigger so keyboard open/close works.
- **Content wrapper**: Always wrap panel content in `<r-content>` — plain children that are not inside `<r-content>` are not shown as the floating panel.
- **Inline sizing**: The host is `display: block`; add `style="display: inline-block;"` (or place it in an inline context) so it shrinks to the trigger.
- **Placement**: `placement` is a preference, not a guarantee — when the trigger is near a viewport edge and the preferred side lacks room, the panel automatically flips to the opposite side and shifts along the cross axis to stay on-screen. This auto-flip only applies to the default body-level positioning.
- **Scoped container**: Use `getPopupContainerId` to anchor the panel inside a specific scroll/positioning container when the default body-level positioning is not desired — flip/shift do not apply in this mode, so choose a `placement` that fits the container. The alignment suffix does apply there, exactly as it does in the body portal.
