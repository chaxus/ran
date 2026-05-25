# ranui Theme And Style System Redesign

> Last updated: 2026-05-24

## Goal

Redesign ranui's style customization model from a collection of component-level CSS variables into a coherent theme system with semantic tokens, component tokens, runtime theme APIs, generated documentation, and regression tests.

The system must preserve current Web Components boundaries:

- Component styles remain inside Shadow DOM.
- Consumers can still customize through CSS custom properties, `::part()`, `sheet`, slots, and exported CSS.
- Existing component tokens keep working during migration.
- Server-side rendering and Declarative Shadow DOM stay compatible.

## Current State

The current style system has useful foundations:

- `style.ts` imports `theme/index.less` as the public global style entry.
- `theme/index.less` defines light and dark variables on `:root` and `:root[theme='dark']`.
- Component Less files use many CSS custom properties.
- Components inject Shadow DOM styles through `ensureShadowRoot()` and `adoptStyles()`.
- Dynamic component-level CSS is supported with the `sheet` attribute through `syncSheetAttribute()`.
- `bin/generate-style-docs.ts` extracts `--ran-*` tokens and `part` names into generated docs.

The main gap is that global theme variables and component tokens are not connected. For example, `theme/color.less` defines `--bg-color`, `--text-color-*`, and `--brand-color-*`, but most component defaults still hard-code colors or use component-specific defaults directly.

## Design Principles

1. **Theme tokens are semantic.**
   They describe intent: primary color, text color, border color, surface color, radius, font, shadow, motion.

2. **Component tokens are public override points.**
   They describe component anatomy: button content background, select selection border, modal mask background.

3. **Component tokens default to semantic tokens.**
   A component-specific override should win, but if absent, the component should inherit from the active theme.

4. **Shadow DOM remains isolated, CSS variables cross it.**
   The theme system should rely on CSS custom property inheritance instead of piercing Shadow DOM.

5. **`sheet` remains an escape hatch, not the primary theme API.**
   It is useful for programmatic or deeply scoped overrides, but should not be required for ordinary theming.

6. **Generated docs define the public surface.**
   Token and part documentation must be generated from source, then filtered for public consumption.

7. **Migration must be additive.**
   Existing tokens should not be removed or renamed until aliases and migration notes exist.

## Token Layers

### Layer 1: Base Tokens

Base tokens represent raw scales. They are rarely used directly by component styles.

```css
:root {
  --ran-blue-6: #1677ff;
  --ran-red-6: #ff4d4f;
  --ran-green-6: #52c41a;
  --ran-gray-1: #ffffff;
  --ran-gray-6: #8c8c8c;
  --ran-gray-13: #000000;
}
```

Base tokens may grow over time, but the first implementation should stay small and map only the values used by existing components.

### Layer 2: Semantic Theme Tokens

Semantic tokens are the primary theme contract.

```css
:root {
  --ran-color-primary: var(--ran-blue-6);
  --ran-color-success: var(--ran-green-6);
  --ran-color-warning: #faad14;
  --ran-color-danger: var(--ran-red-6);

  --ran-color-bg: #ffffff;
  --ran-color-bg-elevated: #ffffff;
  --ran-color-bg-muted: #f5f5f5;
  --ran-color-text: rgba(0, 0, 0, 0.88);
  --ran-color-text-secondary: rgba(0, 0, 0, 0.65);
  --ran-color-text-disabled: rgba(0, 0, 0, 0.25);
  --ran-color-border: #d9d9d9;
  --ran-color-border-secondary: #f0f0f0;

  --ran-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --ran-font-size: 14px;
  --ran-line-height: 1.5715;

  --ran-radius-sm: 4px;
  --ran-radius-md: 6px;
  --ran-radius-lg: 8px;

  --ran-shadow-elevated: 0 6px 16px rgba(0, 0, 0, 0.08), 0 9px 28px rgba(0, 0, 0, 0.05);
  --ran-motion-duration-fast: 0.2s;
  --ran-motion-duration-base: 0.3s;
}
```

Dark theme overrides the semantic layer, not every component token:

```css
:root[theme='dark'],
:root[data-ran-theme='dark'] {
  --ran-color-bg: #141414;
  --ran-color-bg-elevated: #1f1f1f;
  --ran-color-bg-muted: #262626;
  --ran-color-text: rgba(255, 255, 255, 0.88);
  --ran-color-text-secondary: rgba(255, 255, 255, 0.65);
  --ran-color-text-disabled: rgba(255, 255, 255, 0.25);
  --ran-color-border: #424242;
  --ran-color-border-secondary: #303030;
}
```

### Layer 3: Component Tokens

Component tokens remain stable public override points. They should fallback to semantic tokens:

```css
.ran-btn-content {
  background-color: var(--ran-btn-content-background-color, var(--ran-color-primary));
  border-color: var(--ran-btn-content-border-color, var(--ran-color-primary));
  color: var(--ran-btn-content-color, #fff);
}

.selection {
  background-color: var(--ran-select-selection-background-color, var(--ran-color-bg-elevated));
  border: var(--ran-select-selection-border, 1px solid var(--ran-color-border));
  color: var(--ran-select-selection-color, var(--ran-color-text));
}
```

This preserves existing component-level customization while enabling global theme switching.

### Layer 4: Runtime State Tokens

Runtime state tokens are internal or semi-public variables controlled by JS:

- `--ran-x`
- `--ran-y`
- `--progress-percent`
- popover/dropdown positioning variables

These should be documented separately as internal/runtime tokens. They should not be promoted as design theme API.

## Naming Rules

All new public tokens must use `--ran-*`.

Allowed families:

- `--ran-color-*`
- `--ran-font-*`
- `--ran-line-*`
- `--ran-radius-*`
- `--ran-shadow-*`
- `--ran-motion-*`
- `--ran-z-index-*`
- `--ran-[component]-[element]-[state]-[property]`

Deprecated but temporarily supported:

- `--bg-color`
- `--text-color-*`
- `--line-color`
- `--brand-color-*`
- `--loading-*`
- `--video-control-*`
- `--active-color`
- `--border-color`
- `--progress-percent`

The migration should first alias deprecated global variables to new semantic tokens, then update component defaults.

## Public API

### CSS Entry

Current usage remains supported:

```ts
import 'ranui/style';
```

This should load:

1. base token definitions
2. light semantic token defaults
3. dark semantic token overrides
4. compatibility aliases for old global variables

### Attribute Theme Switching

Both forms should be supported:

```html
<html theme="dark">
  <html data-ran-theme="dark"></html>
</html>
```

`data-ran-theme` is recommended for new code because it is namespaced.

### Runtime Theme API

Add a small runtime utility:

```ts
type RanThemeName = 'light' | 'dark';
type ThemeTarget = HTMLElement | Document;

setTheme(name: RanThemeName, target?: ThemeTarget): void;
getTheme(target?: ThemeTarget): RanThemeName | '';
setThemeToken(name: string, value: string, target?: HTMLElement): void;
setThemeTokens(tokens: Record<string, string | number | null | undefined>, target?: HTMLElement): void;
clearThemeToken(name: string, target?: HTMLElement): void;
```

Default target is `document.documentElement`.

Example:

```ts
import { setTheme, setThemeTokens } from 'ranui';

setTheme('dark');
setThemeTokens({
  '--ran-color-primary': '#6c47ff',
  '--ran-radius-md': '10px',
});
```

### What Happens When The Theme Switches

Understanding the switching mechanism helps implementors avoid common mistakes.

**Step 1 — one attribute write, no component JS involved**

```ts
setTheme('dark');
// only does:
document.documentElement.setAttribute('data-ran-theme', 'dark');
document.documentElement.setAttribute('theme', 'dark');
```

No component lifecycle methods run. No Shadow DOM is touched by JS.

**Step 2 — browser CSS engine re-evaluates the cascade**

The browser detects the attribute change on `:root` and immediately re-matches
all CSS selectors. The dark override block becomes active:

```css
:root[data-ran-theme='dark'] {
  --ran-color-bg: #141414;
  --ran-color-text: rgba(255, 255, 255, 0.88);
  /* ... */
}
```

**Step 3 — CSS custom properties cross Shadow DOM**

CSS custom properties are inherited properties. Shadow DOM does not block
inheritance. Every component's internal styles that reference `var(--ran-color-*)`
see the new values without any JS being triggered inside the component.

```
:root  →  --ran-color-bg: #141414
  └── <r-button>  (Light DOM)
        └── #shadow-root (closed)
              └── .ran-btn-content
                    background: var(--ran-btn-bg, var(--ran-color-bg))
                    ↑ reads #141414 automatically
```

**Step 4 — browser render pipeline**

What the browser does next depends on which properties changed:

| Changed property type                     | Pipeline stage              | Cost                      |
| ----------------------------------------- | --------------------------- | ------------------------- |
| `color`, `background-color`, `box-shadow` | Paint only                  | Low                       |
| `border-radius`, `opacity`                | Paint only                  | Low                       |
| `border-width`, `padding`, `font-size`    | Layout + Paint              | Medium, causes reflow     |
| `font-family`                             | Layout + Paint + font fetch | Medium–high, risk of FOUT |

For light/dark switching, only color-family properties change. This means:

- no layout reflow
- no font loading
- one paint pass across all affected elements
- the entire visual update completes within a single frame

This is why light/dark switching feels instant. Any theme system change that
triggers layout reflow or font loading will feel noticeably slower.

### Component Local Overrides

All existing customization paths remain valid:

```css
r-button {
  --ran-btn-content-background-color: #6c47ff;
}

r-button::part(content) {
  border-radius: 999px;
}
```

`sheet` remains valid:

```html
<r-button sheet=".ran-btn-content { background: rebeccapurple; }"></r-button>
```

## File Design

### New Files

- `theme/tokens.less`
  Defines base tokens and semantic light defaults.

- `theme/dark.less`
  Defines semantic dark overrides.

- `theme/compat.less`
  Maps old global variables to new semantic tokens where possible.

- `utils/theme.ts`
  Runtime theme API.

- `test/unit/utils.theme.test.ts`
  Unit tests for runtime API.

- `test/ssr/theme.tokens.ssr.test.ts`
  SSR-safe import and token serialization checks where applicable.

### Modified Files

- `theme/index.less`
  Imports `tokens.less`, `dark.less`, and `compat.less`.

- `utils/index.ts`
  Re-exports `utils/theme.ts`.

- Component Less files
  Gradually replace hard-coded defaults with semantic token fallbacks.

- `bin/generate-style-docs.ts`
  Add token layer classification:
  - semantic
  - component
  - runtime/internal
  - deprecated alias

- `docs/style-token-filter.json`
  Update filtering rules to include semantic tokens and exclude runtime internals.

## Migration Phases

### Phase 1: Theme Foundation

Add the new token files and runtime API without changing component visuals.

Deliverables:

- `theme/tokens.less`
- `theme/dark.less`
- `theme/compat.less`
- `utils/theme.ts`
- tests for theme API

Expected behavior:

- `import 'ranui/style'` still works.
- `setTheme('dark')` sets both `data-ran-theme="dark"` and `theme="dark"` for compatibility.
- Existing `:root[theme='dark']` behavior remains available.

### Phase 2: High-Impact Component Token Mapping

Update defaults for commonly used components first:

- button
- input
- select
- dropdown
- modal
- message
- checkbox

Example:

```css
border-color: var(--ran-input-border-color, var(--ran-color-border));
color: var(--ran-input-color, var(--ran-color-text));
background: var(--ran-input-background, var(--ran-color-bg-elevated));
```

Expected behavior:

- Existing component token overrides still win.
- Dark theme visibly affects these components.

### Phase 3: Complex Component Token Mapping

Update:

- player
- colorpicker
- loading
- progress
- tab
- popover
- radar
- skeleton
- image
- form

Complex visual components may keep specialized tokens, but their neutral colors should fallback to semantic tokens.

### Phase 4: Documentation And Enforcement

Enhance generated docs and add checks.

Deliverables:

- Generated style docs include semantic tokens.
- Public docs separate public component tokens from runtime internals.
- Add a test or script check for non-`--ran-*` public token additions.

### Phase 5: Deprecation

After compatibility aliases ship, mark old token families as deprecated:

- `--bg-color`
- `--text-color-*`
- `--brand-color-*`
- `--line-color`
- `--loading-*`
- `--video-control-*`

Do not remove deprecated tokens in this migration.

## Testing Strategy

### Unit Tests

Add tests for `utils/theme.ts`:

- `setTheme('dark')` sets `data-ran-theme` and `theme`.
- `setTheme('light')` sets light attributes.
- `getTheme()` reads `data-ran-theme` first, then `theme`.
- `setThemeToken()` writes a CSS custom property.
- `setThemeTokens()` writes multiple tokens and removes nullish values.
- `clearThemeToken()` removes a token.
- functions no-op safely when `document` is unavailable.

### Component Contract Tests

For each migrated component, add or update one focused test:

- set semantic token on host
- assert the component still renders
- assert component token override still wins by checking attribute/style injection path when feasible

### SSR Tests

Add SSR checks for:

- importing theme utilities does not require `document`
- style entry remains importable in SSR test context if the test runner supports Less transform
- components using semantic token fallbacks still serialize DSD markup

### Visual Tests

Add one light/dark visual fixture covering:

- button
- input
- select
- modal
- message

This catches accidental hard-coded color regressions.

## Compatibility Rules

1. Existing `sheet` attributes must keep working.
2. Existing `--ran-[component]-*` tokens must keep working.
3. Existing `theme="dark"` selector must keep working.
4. New code should prefer `data-ran-theme`.
5. No component should require JavaScript to receive a CSS-variable theme.
6. Runtime API should only write attributes and CSS variables; it should not import component modules.

## Risks

### Risk: Token Explosion

The codebase already has hundreds of component tokens. Adding semantic tokens can increase confusion.

Mitigation:

- Keep semantic tokens small.
- Public docs should list semantic tokens first.
- Component token docs should remain filterable.

### Risk: Visual Regressions

Replacing fallback colors can alter default appearance.

Mitigation:

- Migrate component groups in small commits.
- Run contract tests and visual tests after each group.
- Preserve original fallback as the final fallback:

```css
color: var(--ran-btn-content-color, var(--ran-color-primary, #1890ff));
```

### Risk: Shadow DOM Theme Misunderstanding

Consumers may expect global class selectors to style internals.

Mitigation:

- Document that CSS variables cross Shadow DOM, selectors do not.
- Keep `::part()` and `sheet` docs clear.

## Implementation Order

Recommended commit sequence:

1. `feat(ranui): add theme tokens and runtime api`
2. `refactor(ranui): map form controls to semantic tokens`
3. `refactor(ranui): map overlay components to semantic tokens`
4. `refactor(ranui): map media and feedback tokens`
5. `docs(ranui): regenerate style token docs`
6. `test(ranui): add theme visual coverage`

## Success Criteria

The redesign is complete when:

- `import 'ranui/style'` exposes semantic light and dark tokens.
- `setTheme('dark')` changes real component appearance without component-specific CSS.
- Existing component-level `--ran-*` overrides still work.
- Generated docs include semantic tokens and public component tokens.
- `pnpm --filter ranui test:all` passes.
- `pnpm --filter ranui test:unit:coverage` stays above current thresholds.
- Visual tests cover at least one light/dark theme fixture.
