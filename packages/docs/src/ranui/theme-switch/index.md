# ThemeSwitch

A three-state segmented control — **system / light / dark** — wired to ranui's
[theme API](/src/ranui/theme/). Clicking a segment calls `setTheme()`, persists the choice
under the localStorage key `ran-theme`, and keeps every instance on the page (and in other
tabs) in sync.

> **Use when** you need a ready-made system/light/dark segmented control wired to ranui's theme API — `<r-theme-switch>` handles persistence, system tracking, and cross-tab sync so you don't hand-roll a toggle.

## Quick Start

### Basic Usage

<Demo>
  <r-theme-switch></r-theme-switch>
</Demo>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui'; // or the standalone entry:
import 'ranui/theme-switch';
```

> 💡 **On this docs site** the theme is driven by the site-wide toggle in the header, which
> overwrites `data-ran-theme` on its own — so the demo above may be reset by the site. In your
> app, `<r-theme-switch>` is the source of truth.

Call `initTheme()` once on page load so the saved choice is restored before the switch renders:

```js
import { initTheme } from 'ranui';
initTheme();
```

## API Reference

### Properties

| Property | Type                            | Default    | Description                                                                                           |
| -------- | ------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| `value`  | `'system' \| 'light' \| 'dark'` | `'system'` | Current selection, read from the theme API (`getTheme()`). Setting it applies and persists the theme. |
| `sheet`  | `string`                        | `''`       | CSS injected into the component's shadow DOM.                                                         |

### Localization Attributes

The three buttons are icon-only, so each carries an `aria-label`. Override them to localize:

| Attribute      | Default          | Description                        |
| -------------- | ---------------- | ---------------------------------- |
| `label`        | `'Theme'`        | `aria-label` of the control group. |
| `label-system` | `'System theme'` | `aria-label` of the system button. |
| `label-light`  | `'Light theme'`  | `aria-label` of the light button.  |
| `label-dark`   | `'Dark theme'`   | `aria-label` of the dark button.   |

```html
<r-theme-switch label="Theme" label-system="System theme" label-light="Light theme" label-dark="Dark theme"></r-theme-switch>
```

## Events

| Event    | Detail                                     | Description                                                        |
| -------- | ------------------------------------------ | ------------------------------------------------------------------ |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | Fired when the user picks a theme. Bubbles and crosses shadow DOM. |

```js
document.querySelector('r-theme-switch').addEventListener('change', (e) => {
  console.log('theme is now', e.detail.theme);
});
```

## Behavior

- **Persistence** — selections go through `setTheme()`, so they're saved to localStorage
  (`ran-theme`) and restored by `initTheme()` on the next visit.
- **Multi-instance sync** — place one switch in the header and another in the footer; picking a
  theme on either updates both.
- **Cross-tab sync** — a theme flipped in another tab updates this control via the `storage` event.
- **Browser chrome** — forced light/dark updates `<meta name="theme-color">` to the resolved page
  background so the browser/PWA chrome matches; choosing `system` restores each meta's original
  (possibly media-qualified) content.

## CSS Parts

| Part                        | Description                                                                    |
| --------------------------- | ------------------------------------------------------------------------------ |
| `switch`                    | The outer segmented pill.                                                      |
| `button`                    | Every choice button (each also exposes its choice name as an additional part). |
| `system` / `light` / `dark` | The individual choice buttons.                                                 |

```css
r-theme-switch::part(switch) {
  border-color: var(--line);
}
r-theme-switch::part(dark) {
  color: rebeccapurple;
}
```

The following CSS variables can be overridden: `--ran-theme-switch-display`,
`--ran-theme-switch-gap`, `--ran-theme-switch-padding`, `--ran-theme-switch-border-color`,
`--ran-theme-switch-radius`, `--ran-theme-switch-background`, `--ran-theme-switch-button-size`,
`--ran-theme-switch-icon-size`, `--ran-theme-switch-color`, `--ran-theme-switch-hover-color`,
`--ran-theme-switch-active-background`, `--ran-theme-switch-active-color`,
`--ran-theme-switch-focus-outline`.

```css
r-theme-switch {
  --ran-theme-switch-button-size: 32px;
  --ran-theme-switch-icon-size: 18px;
}
```

## Best Practices

- **One source of truth**: use `<r-theme-switch>` instead of hand-rolling a toggle — it already
  handles persistence, system tracking, instance sync, and `theme-color` metas.
- **Restore early**: call `initTheme()` as early as possible (ideally inline before first paint)
  to avoid a light→dark flash.
- **Localize**: the buttons are icon-only; set `label` / `label-*` for non-English UIs.
