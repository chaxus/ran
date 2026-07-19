---
description: 'The ranui Button (<r-button>) triggers instant actions with multiple types, sizes, and loading/disabled states — a framework-agnostic Web Component.'
---

# Button

Button component for triggering instant actions with multiple styles and states.

> **Use when** you need a clickable action control with ready-made primary/contrast/warning/text styles plus disabled and icon support — reach for `<r-button>` instead of styling a raw `<button>`.

## Quick Start

### Basic Usage

<Demo>
  <r-button>Button</r-button>
</Demo>

```html
<r-button>Button</r-button>
```

## API Reference

### Properties

| Property   | Type      | Default     | Description                                                      |
| ---------- | --------- | ----------- | ---------------------------------------------------------------- |
| `type`     | `string`  | `'default'` | Button type: `default`, `primary`, `contrast`, `warning`, `text` |
| `disabled` | `boolean` | `false`     | Whether the button is disabled                                   |
| `icon`     | `string`  | `''`        | Button icon name                                                 |
| `effect`   | `boolean` | `true`      | Whether to show click ripple effect                              |

### Button Types `type`

<Demo>
  <r-button type="primary">Primary Button</r-button>
  <r-button type="warning">Warning Button</r-button>
  <r-button type="text">Text Button</r-button>
  <r-button>Default Button</r-button>
</Demo>

```html
<r-button type="primary">Primary Button</r-button>
<r-button type="warning">Warning Button</r-button>
<r-button type="text">Text Button</r-button>
<r-button>Default Button</r-button>
```

`primary` is the monochrome action (from the Geist design language): black-on-white in light mode, white-on-black in dark mode. Blue carries no brand meaning here — it is reserved for links and the focus ring. It rides the `--ran-color-primary*` tokens (`--ran-color-primary`, `-hover`, `-active`, and `--ran-color-primary-text` for the inverse ink) — see [Theme & Tokens](/src/ranui/theme/).

### Disabled State `disabled`

<Demo>
  <r-button type="primary" disabled>Primary Button</r-button>
  <r-button type="warning" disabled>Warning Button</r-button>
  <r-button type="text" disabled>Text Button</r-button>
  <r-button disabled>Default Button</r-button>
</Demo>

```html
<r-button type="primary" disabled>Primary Button</r-button>
<r-button type="warning" disabled>Warning Button</r-button>
<r-button type="text" disabled>Text Button</r-button>
<r-button disabled>Default Button</r-button>
```

### Icon Button `icon`

> 💡 **Tip**: For precise icon positioning, use the Icon component directly

<Demo>
  <r-button type="default" icon="user">Default Button</r-button>
  <r-button type="primary" icon="home">Primary Button</r-button>
</Demo>

```html
<r-button type="default" icon="user">Default Button</r-button>
<r-button type="primary" icon="home">Primary Button</r-button>
```

### Effect Control `effect`

<Demo>
  <r-button type="default" effect="false" icon="user">Default Button</r-button>
  <r-button type="primary" effect="false" icon="home">Primary Button</r-button>
</Demo>

```html
<r-button type="default" effect="false" icon="user">Default Button</r-button>
<r-button type="primary" effect="false" icon="home">Primary Button</r-button>
```

## Events

```html
<r-button onclick="handleClick()">Click Me</r-button>

<script>
  function handleClick() {
    console.log('Button clicked');
  }
</script>
```

## Best Practices

- **Primary Actions**: Use `type="primary"` (monochrome — black-on-white / white-on-black)
- **Dangerous Actions**: Use `type="warning"`
- **Secondary Actions**: Use `type="text"`
- **Disabled State**: Use `disabled` when actions unavailable
- **Icons**: Add relevant icons to enhance UX
