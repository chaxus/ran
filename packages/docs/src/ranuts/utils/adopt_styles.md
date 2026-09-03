# adoptStyles / adoptSheetText

Inject CSS into a Shadow DOM, preferring **Constructable Stylesheets**: one piece of CSS is parsed
once and then shared _by reference_ across every component instance, so a thousand instances still
hold one parsed result. Where they are unsupported, both fall back to injecting a `<style>` tag.

Both are SSR-safe (they return immediately when there is no `document`) and idempotent.

## Usage

```ts
import css from './index.less?inline';
import { adoptStyles } from 'ranuts/utils';

class MyElement extends HTMLElement {
  constructor() {
    super();
    const root = this.shadowRoot || this.attachShadow({ mode: 'closed' });
    adoptStyles(root, css);
  }
}
```

## API

### adoptStyles

A component's **static** styles. The fallback path de-duplicates per **root**: a shadow root keeps
exactly one marked `<style>`, and the first writer wins. A component's static styles should exist
once per root, so a second call means the caller made a mistake.

#### Parameters

| Parameter    | Description                                | Type         | Default                |
| ------------ | ------------------------------------------ | ------------ | ---------------------- |
| `shadowRoot` | Target shadow root                         | `ShadowRoot` | Required               |
| `cssText`    | The style text                             | `string`     | Required               |
| `marker`     | Marker attribute on the fallback `<style>` | `string`     | `'data-adopted-style'` |

#### Return

No return value (`void`)

### adoptSheetText

**Dynamic** styles supplied at runtime (a component's `sheet` property, say). The only difference
from `adoptStyles` is what the fallback de-duplicates on: here it is the **cssText**, so one root
can stack several distinct dynamic stylesheets while an identical one is injected only once.

#### Parameters

| Parameter    | Description                                | Type         | Default                |
| ------------ | ------------------------------------------ | ------------ | ---------------------- |
| `shadowRoot` | Target shadow root                         | `ShadowRoot` | Required               |
| `cssText`    | The style text                             | `string`     | Required               |
| `marker`     | Marker attribute on the fallback `<style>` | `string`     | `'data-adopted-sheet'` |

#### Return

No return value (`void`)

## Constants

| Name                   | Value                  | Meaning                                           |
| ---------------------- | ---------------------- | ------------------------------------------------- |
| `ADOPTED_STYLE_MARKER` | `'data-adopted-style'` | Default marker for `adoptStyles`' fallback tag    |
| `ADOPTED_SHEET_MARKER` | `'data-adopted-sheet'` | Default marker for `adoptSheetText`' fallback tag |

The `marker` parameter exists so a library can brand the styles it injects and still find them
later. ranui, for example, passes `data-ranui` and `data-ranui-sheet`.
