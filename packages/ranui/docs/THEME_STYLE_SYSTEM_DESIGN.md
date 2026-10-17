# ranui theme architecture reference

This is a **repository architecture reference**, not another visual standard or a token
snapshot to copy. [DESIGN.md](./DESIGN.md) owns visual decisions. The generated
[public token catalog](./style-tokens-public.md) owns component override names.
The source links below require a repository checkout; this file is not shipped in npm.

## Ownership and layers

The light/dark system has one source for each layer:

1. [theme/tokens.less](../theme/tokens.less): base palettes, semantic roles and foundation values.
2. [theme/dark.less](../theme/dark.less): dark base palettes plus explicit semantic/shadow overrides.
3. Component LESS: component override points with semantic/foundation fallbacks.
4. [utils/theme.ts](../utils/theme.ts): theme preference, root attributes and inline token updates.

CSS custom properties inherit across Shadow DOM; document selectors do not cross it.
Use public tokens and parts before the per-instance `sheet` escape hatch. Runtime geometry
variables are implementation state, not an additional design-token scale.

## Representative bindings, not a duplicate catalog

These current bindings show the roles; consult source for the full values and scales:

```css
:root {
  --ran-color-primary: var(--ran-gray-1000);
  --ran-color-primary-text: var(--ran-background-100);
  --ran-color-link: var(--ran-blue-700);
  --ran-focus-ring: 0 0 0 2px var(--ran-background-100), 0 0 0 4px var(--ran-blue-700);
}
```

Primary actions are monochrome with inverse ink. Blue remains the link and shared focus-ring
role; changing primary does not automatically recolor that ring. Components may expose their
own focus mechanism: for example, the button uses an outline defaulting to primary rather
than the shared box-shadow ring. Check the component contract instead of assuming every
control consumes the same token.

The default secondary button has an elevated surface and semantic text/border. Its primary
variant in [components/button/index.less](../components/button/index.less) uses:

```css
:host([type='primary']) .ran-btn-content {
  background-color: var(--ran-btn-background, var(--ran-color-primary, #171717));
  color: var(--ran-btn-color, var(--ran-color-primary-text, #fff));
}
```

The inverse text token is essential in dark mode; a literal white override would remain
white when the primary surface becomes near-white. This excerpt explains the binding, not a
replacement stylesheet. Keep component-specific details in source and generated references.

## Dark mode and CSS entry

```ts
import 'ranui/style';
```

The entry loads [theme/index.less](../theme/index.less), including tokens and dark rules.
The dark mixin changes base palettes **and** explicit elevated-surface, primary hover/active
and shadow values. It is not a base-palette-only transformation.

Choose one root theme authority and keep other conventions synchronized:

```html
<html data-ran-theme="dark">
  <!-- document content -->
</html>
```

Alternatively, the legacy `theme="dark"` attribute or `.dark` class on the root is supported.
The system media query applies dark values unless the root has `data-ran-theme="light"`,
`theme="light"` or `.light`. An explicit dark selector can still match a contradictory root;
do not combine conflicting class and attribute values. Exact selectors live in dark.less.
These built-in selectors target `:root`; arbitrary nested targets do not create a complete
independent light/dark theme automatically.

## Public runtime API

Import the registration-free theme entry:

```ts
import { initTheme, setTheme, getTheme, setThemeToken, setThemeTokens, clearThemeToken } from 'ranui/theme';

initTheme();
setTheme('dark');
```

[theme.ts](../theme.ts) re-exports these functions and the following types from utils/theme.ts:

| API               | Arguments / result                                                     |
| ----------------- | ---------------------------------------------------------------------- |
| `initTheme`       | `target?: ThemeTarget` → `void`                                        |
| `setTheme`        | `name: RanThemeName, target?: ThemeTarget` → `void`                    |
| `getTheme`        | `target?: ThemeTarget` → `RanThemeName \| ''`                          |
| `setThemeToken`   | `name: string, value: string \| number, target?: HTMLElement` → `void` |
| `setThemeTokens`  | `tokens: ThemeTokenMap, target?: HTMLElement` → `void`                 |
| `clearThemeToken` | `name: string, target?: HTMLElement` → `void`                          |

`RanThemeName` is `'light' | 'dark' | 'system'`; `ThemeTarget` is `HTMLElement | Document`.
`ThemeTokenMap` is `Record<string, string | number | null | undefined>`; nullish values remove
an inline override. Token mutation APIs accept an element, not a Document. The default
resolved element is `document.documentElement`.

- `setTheme('light' | 'dark')` detaches the previous system subscription, writes **both**
  `data-ran-theme` and legacy `theme`, and best-effort persists `ran-theme` in local storage.
- `setTheme('system')` subscribes to `prefers-color-scheme`, applies the current resolved
  light/dark attributes and updates them on preference changes; storage records the system
  intent. The module owns one active system subscription, not one per target.
- `initTheme` restores a recognized saved choice; it does not invent a saved preference.
  `getTheme` can distinguish system intent through storage; without that storage it reports
  the resolved attributes.
- Storage being blocked does not prevent DOM updates. Missing a resolvable DOM element makes
  mutations return and `getTheme` return `''`; system mode also requires `window`. See the
  [guarded storage helpers](../../ranuts/src/utils/storage.ts) for best-effort persistence.

Theme-dependent CSS then re-evaluates through inheritance, including inside shadow roots.
Built-in palette changes avoid per-component registration work. Custom host overrides may
also affect typography/geometry, so do not promise every theme change is paint-only or
completes within a fixed frame budget.

## Host-specific overrides

A product may override public tokens on its own container. Brand choices below belong to
that host, **not** new ranui defaults; verify contrast, hover/active, dark mode and focus
separately. Pair background with appropriate ink and state tokens rather than assuming one
brand-color assignment completes a theme.

```css
.product-surface r-button[type='primary'] {
  --ran-btn-background: #6c47ff;
  --ran-btn-color: #fff;
}
```

## Source checks

- [test/unit/utils.theme.test.ts](../test/unit/utils.theme.test.ts): runtime attributes,
  persistence, token mutation and system mode.
- [test/unit/theme.skin-tokens.test.ts](../test/unit/theme.skin-tokens.test.ts): scale presence,
  semantic mapping, skin layer and dark source.
- [test/ssr/theme.tokens.ssr.test.ts](../test/ssr/theme.tokens.ssr.test.ts): SSR-safe theme utilities.
- `pnpm -F ranui doc:style:check`: generated public token/part docs remain derived from source.

This reference describes the implementation; DESIGN remains the authority for visual rules.
