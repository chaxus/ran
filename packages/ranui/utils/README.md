# RanUI Utilities

This directory contains the shared utilities used by RanUI components: Shadow DOM setup, fluent DOM builders, SSR registration and serialization, theme helpers, style adoption, and small DOM helpers.

## Component Utilities (`component.ts`)

Use these helpers in every component constructor and attribute sync path.

```ts
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setBooleanAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
```

| API                                                        | Description                                                                                             |
| :--------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| `ensureShadowRoot(host, cssText?, options?)`               | Create or reuse a cached Shadow Root and apply component CSS. Prefer this over direct `attachShadow()`. |
| `ensureShadowElement(root, selector, factory)`             | Query an existing element from the Shadow Root, or append the factory result if it is missing.          |
| `getStringAttribute(element, name, fallback?)`             | Read an attribute with a string fallback.                                                               |
| `setStringAttribute(element, name, value, options?)`       | Set a string attribute; `removeEmpty: true` removes empty values.                                       |
| `setBooleanAttribute(element, name, value, options?)`      | Set or remove a boolean attribute, optionally mirroring to `aria-*`.                                    |
| `syncSheetAttribute(host, root, name, oldValue, newValue)` | Apply the `sheet` attribute through `adoptSheetText` when it changes.                                   |

Component conventions:

- Always include `sheet` in `observedAttributes`.
- Always call `syncSheetAttribute` from `connectedCallback` and from the `sheet` branch of `attributeChangedCallback`.
- Always guard `attributeChangedCallback` with `if (old === next) return;`.

## Element Builder (`builder/`)

`ElementBuilder` provides a fluent API for constructing DOM elements. It is SSR-safe and keeps component constructors concise.

### Basic Usage

```ts
import { ButtonBuilder, Div, Slot, Span } from '@/utils/builder';

const card = Div()
  .class('card')
  .part('card')
  .children(
    Span().text('Hello World'),
    ButtonBuilder()
      .label('Click Me')
      .on('click', () => console.log('Clicked')),
    Slot().attr('name', 'extra'),
  )
  .build();
```

### Factories

Factory helpers all return `ElementBuilder<T>`:

```ts
Div();
Span();
Slot();
ButtonBuilder();
InputBuilder();
Label();
Style();
Ul();
Li();
Section();
Article();
Nav();
Header();
Footer();
Main();
```

### API Reference

| Method                                                | Description                                                                   |
| :---------------------------------------------------- | :---------------------------------------------------------------------------- |
| `id(value)`                                           | Set the element ID.                                                           |
| `class(value)`                                        | Set the full class string.                                                    |
| `addClass(...names)` / `removeClass(...names)`        | Add or remove classes incrementally.                                          |
| `attr(name, value)` / `attrs(record)`                 | Set attributes. `attrs` skips `null` and `undefined` values.                  |
| `boolAttr(name, value, enabledValue?)`                | Toggle a boolean attribute.                                                   |
| `part(value)`                                         | Set the `part` attribute for `::part()` styling.                              |
| `data(key, value)`                                    | Set a `data-*` attribute.                                                     |
| `style(key, value)` / `style(map)`                    | Set inline styles.                                                            |
| `cssVar(name, value)`                                 | Set a CSS custom property; `--` is added when omitted.                        |
| `aria(key, value)` / `role(value)`                    | Set accessibility attributes.                                                 |
| `tabIndex(value)`                                     | Set `tabindex`.                                                               |
| `label(value)` / `labelledBy(id)` / `describedBy(id)` | Set common ARIA naming attributes.                                            |
| `ariaHidden(hidden?)`                                 | Set `aria-hidden`.                                                            |
| `on(type, listener, options?)`                        | Attach an event listener.                                                     |
| `children(...items)` / `replaceChildren(...items)`    | Append or replace child builders, elements, strings, arrays, or empty values. |
| `text(value)`                                         | Set text content.                                                             |
| `ref(holder)`                                         | Capture the built element in a `createRef()` holder.                          |
| `shadow(options?)`                                    | Attach a Shadow Root and return a `ShadowBuilder`.                            |
| `build()`                                             | Return the `HTMLElement` or SSR mock.                                         |
| `serialize()`                                         | Serialize the element for SSR or browser diagnostics.                         |

## SSR & Declarative Shadow DOM

RanUI supports SSR through `HTMLElementMock`, `defineSSR`, and Declarative Shadow DOM serialization.

### `ssr-registry.ts`

```ts
import { defineSSR, getSSRConstructor, getSSRRegistry } from '@/utils/ssr-registry';

defineSSR('r-button', Button as unknown as new () => HTMLElement);
```

| API                          | Description                                                                                 |
| :--------------------------- | :------------------------------------------------------------------------------------------ |
| `defineSSR(tagName, ctor)`   | Browser: defines a custom element when needed. SSR: stores the constructor in the registry. |
| `getSSRConstructor(tagName)` | Return a registered SSR constructor.                                                        |
| `getSSRRegistry()`           | Return the SSR constructor map.                                                             |

### `ssr.ts`

Renders a RanUI component instance to an HTML string including its shadow tree.

```ts
import { Button } from '@/components/button';
import { renderToString } from '@/utils/ssr';

const btn = new Button();
btn.setAttribute('effect', 'true');
const html = renderToString(btn);
// Output: <r-button effect="true"><template shadowrootmode="closed">...</template></r-button>
```

Components should use `ensureShadowRoot` in the constructor so browser initialization can reuse an existing Declarative Shadow DOM root when one is present.

`RanElement` is exported from `utils/index.ts`:

```ts
export const RanElement = HTMLElementSSR()!;
```

It resolves to the native `HTMLElement` in the browser and `HTMLElementMock` in SSR.

## Theme Utilities (`theme.ts`)

```ts
import {
  clearThemeToken,
  getTheme,
  getThemePack,
  initTheme,
  setTheme,
  setThemePack,
  setThemeToken,
  setThemeTokens,
} from '@/utils/theme';
```

| API                                   | Description                                                    |
| :------------------------------------ | :------------------------------------------------------------- |
| `initTheme(target?)`                  | Restore theme and theme pack from localStorage.                |
| `setTheme(name, target?)`             | Set `light`, `dark`, or `system`.                              |
| `getTheme(target?)`                   | Read the current theme; returns `system` when stored that way. |
| `setThemePack(name, target?)`         | Set a theme pack, or clear it with `default`.                  |
| `getThemePack(target?)`               | Read the active theme pack.                                    |
| `setThemeToken(name, value, target?)` | Set one CSS token on the target element.                       |
| `clearThemeToken(name, target?)`      | Remove one CSS token.                                          |
| `setThemeTokens(tokens, target?)`     | Set or clear multiple CSS tokens.                              |

Theme names:

```ts
type RanThemeName = 'light' | 'dark' | 'system';
type RanThemePackName =
  | 'default'
  | 'windows-98'
  | 'windows-xp'
  | 'system-6'
  | 'wired'
  | 'paper'
  | 'pixel-retro'
  | 'neo-brutalism';
```

localStorage keys:

```ts
'ran-theme';
'ran-theme-pack';
```

## Style Utilities (`style.ts`)

| API                             | Description                                                                    |
| :------------------------------ | :----------------------------------------------------------------------------- |
| `adoptStyles(root, cssText)`    | Adopt component CSS into a Shadow Root with constructable stylesheet fallback. |
| `adoptSheetText(root, cssText)` | Adopt raw CSS text supplied by the `sheet` attribute.                          |

## DOM Utilities (`dom.ts`)

```ts
import { falseList, isDisabled } from '@/utils/dom';
```

| API                   | Description                                                                                   |
| :-------------------- | :-------------------------------------------------------------------------------------------- |
| `falseList`           | Values treated as false for boolean-like attributes: `false`, `'false'`, `null`, `undefined`. |
| `isDisabled(element)` | Read `disabled` using RanUI's boolean-like attribute semantics.                               |
