# Message

Global feedback component for operation results, invoked imperatively through the `message` API and rendered as a dismissable toast.

> **Use when** you need a transient, auto-dismissing toast to confirm an operation result — call the imperative `message.info` / `success` / `warning` / `error` / `toast` API instead of placing markup.

## Quick Start

<Demo>
  <r-button type="primary" onclick="message.info('This is a hint')">Show message</r-button>
</Demo>

```html
<r-button type="primary" onclick="message.info('This is a hint')">Show message</r-button>
```

Message is normally called from JavaScript. The global `message` object is registered on `window` (also available as `window.ranui.message`) as soon as the component module loads.

```js
message.info('This is a hint');
message.success('Project deleted');
```

## API Reference

### Global Methods

Each method appends a toast and auto-dismisses it after `duration` milliseconds (default `3000`). All five share the same signature.

| Method              | Description                                       |
| ------------------- | ------------------------------------------------- |
| `message.info()`    | Neutral information toast (blue info icon)        |
| `message.success()` | Success toast (green check icon)                  |
| `message.warning()` | Warning toast (amber icon), announced assertively |
| `message.error()`   | Error toast (red icon), announced assertively     |
| `message.toast()`   | Plain dark toast with no icon                     |

### Method Signature

Each method accepts either a `string` (the content) or an options object.

```js
// 1. Pass a string — content only, dismisses after 3000ms
message.info('This is a hint');

// 2. Pass an options object
message.info({
  content: 'This is a hint',
  duration: 2000,
  close: () => console.log('closed'),
});
```

### Options

| Option         | Type                        | Default         | Description                                                                       |
| -------------- | --------------------------- | --------------- | --------------------------------------------------------------------------------- |
| `content`      | `string`                    | —               | Text to display (required when passing an object)                                 |
| `duration`     | `number`                    | `3000`          | Auto-dismiss delay in milliseconds                                                |
| `close`        | `() => void`                | —               | Callback fired after the toast is removed                                         |
| `top`          | `number \| string`          | `8`             | Offset of the toast stack from the top of its container (number is treated as px) |
| `zIndex`       | `number \| string`          | `1200`          | Stacking order of the toast container                                             |
| `getContainer` | `() => HTMLElement \| null` | `document.body` | Returns the element the toast stack mounts into                                   |

> Passing `null`, `undefined`, or an empty argument is a no-op — nothing is shown.

### Element Attributes `r-message`

Each toast is a `<r-message>` custom element. The global API sets these attributes for you, but they can also be used directly.

| Attribute | Type     | Default | Description                                                                                                 |
| --------- | -------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| `type`    | `string` | —       | One of `info`, `success`, `warning`, `error`, `toast`. Selects the icon/color and the ARIA live-region role |
| `content` | `string` | —       | Text rendered inside the toast                                                                              |
| `sheet`   | `string` | `''`    | CSS injected into the component's shadow DOM                                                                |

## Message Types `type`

<Demo>
  <r-button onclick="message.info('This is a hint')">Information prompt</r-button>
  <r-button onclick="message.success('This is a hint')">Success tip</r-button>
  <r-button onclick="message.warning('This is a hint')">Warning prompt</r-button>
  <r-button onclick="message.error('This is a hint')">Error prompt</r-button>
  <r-button onclick="message.toast('This is a hint')">Toast tip</r-button>
</Demo>

```html
<r-button onclick="message.info('This is a hint')">Information prompt</r-button>
<r-button onclick="message.success('This is a hint')">Success tip</r-button>
<r-button onclick="message.warning('This is a hint')">Warning prompt</r-button>
<r-button onclick="message.error('This is a hint')">Error prompt</r-button>
<r-button onclick="message.toast('This is a hint')">Toast tip</r-button>
```

## Custom Duration `duration`

<Demo>
  <r-button onclick="message.info({ content: 'Stays for 6s', duration: 6000 })">6 second toast</r-button>
  <r-button onclick="message.info({ content: 'Stays for 1s', duration: 1000 })">1 second toast</r-button>
</Demo>

```html
<r-button onclick="message.info({ content: 'Stays for 6s', duration: 6000 })">6 second toast</r-button>
<r-button onclick="message.info({ content: 'Stays for 1s', duration: 1000 })">1 second toast</r-button>
```

## Close Callback `close`

The `close` callback runs after the toast is removed from the DOM.

<Demo>
  <r-button onclick="message.success({ content: 'Saved', close: () => message.info('Toast closed') })">Chained message</r-button>
</Demo>

```html
<r-button onclick="message.success({ content: 'Saved', close: () => message.info('Toast closed') })"
  >Chained message</r-button
>
```

```js
message.success({
  content: 'Saved',
  close: () => {
    // runs once the toast is dismissed
    console.log('toast closed');
  },
});
```

## Custom Placement `top` / `zIndex` / `getContainer`

<Demo>
  <r-button onclick="message.info({ content: 'Pushed down', top: 120 })">Offset from top</r-button>
</Demo>

```js
message.info({
  content: 'Pushed down',
  top: 120, // distance from the top of the container
  zIndex: 1300, // stacking order
  getContainer: () => document.querySelector('#app'), // custom mount point
});
```

## Styling

The toast stack lives in a body-portaled container; each `<r-message>` renders its content inside a shadow DOM whose surface is themeable via CSS variables (all with sensible fallbacks).

| CSS Variable                                   | Default                        | Description               |
| ---------------------------------------------- | ------------------------------ | ------------------------- |
| `--ran-message-notice-content-background`      | `var(--ran-color-bg-elevated)` | Toast surface background  |
| `--ran-message-notice-content-border-radius`   | `var(--ran-radius-md)`         | Toast corner radius       |
| `--ran-message-notice-content-box-shadow`      | `var(--ran-shadow-menu)`       | Toast elevation           |
| `--ran-message-notice-content-info-span-color` | `var(--ran-color-text)`        | Toast text color          |
| `--ran-message-z-index`                        | `var(--ran-z-message, 1200)`   | Stack z-index             |
| `--ran-message-top`                            | `8px`                          | Stack offset from the top |

## Best Practices

- **State the change**: write toast copy as a result — "Project deleted", "Changes saved" — not a vague "Success".
- **Success / Info**: use `message.success` / `message.info` for non-blocking confirmations.
- **Errors / Warnings**: use `message.error` / `message.warning`; these escalate to an assertive ARIA live region so screen readers interrupt.
- **Keep it brief**: a toast auto-dismisses — reserve long or actionable content for a dialog.
- **Tune duration sparingly**: raise `duration` for longer messages, but avoid making transient feedback sticky.
