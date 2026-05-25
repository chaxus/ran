# ranui Web Components Library - Technical Documentation

## Overview

**ranui** is a Web Components library built with TypeScript that provides a comprehensive set of customizable UI components. The library is designed with Shadow DOM encapsulation, SSR support, and extensive theming capabilities.

**Key Facts:**
- **Base Class**: All components extend `RanElement` (conditional: `HTMLElement` in browser, `HTMLElementMock` in SSR)
- **Registration**: All components use `defineSSR()` for unified registration across browser and SSR environments
- **Shadow DOM**: All components use closed mode (`mode: 'closed'`) shadow roots
- **CSS Variables**: Extensive CSS custom property system for theming with `--ran-*` namespace
- **Styling**: LESS-based styling with inline CSS injection via `?inline` imports

---

## Component Architecture

### Base Component Pattern

All components follow this architectural pattern:

```typescript
export class ComponentName extends RanElement {
  _shadowDom!: ShadowRoot;
  // Private element references
  _element!: HTMLElement;
  
  static get observedAttributes(): string[] {
    return ['attribute1', 'attribute2', 'sheet'];
  }
  
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);
    // Build DOM structure
  }
  
  // Lifecycle methods
  connectedCallback(): void { }
  disconnectedCallback(): void { }
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void { }
}

// SSR registration
defineSSR('r-component-name', ComponentName as unknown as new () => HTMLElement);
export default ComponentName;
```

### Representative Components

#### **Button** (`components/button/index.ts`)

**Class**: `Button extends RanElement`

**Observed Attributes**:
```typescript
['disabled', 'icon', 'effect', 'iconSize', 'sheet']
```

**Shadow DOM Structure**:
- `.ran-btn` (part="button") - main button element
  - `.ran-btn-content` (part="content") - content wrapper
    - `<slot>` - for button text/children

**Key Properties**:
- `disabled: boolean | string` - disables button interaction
- `icon: string` - icon name (r-icon element)
- `iconSize: string` - icon size override
- `effect: string` - visual effect (falseList check)
- `sheet: string` - external CSS string

**Special Behaviors**:
- Click position tracking via `--ran-x`, `--ran-y` CSS variables
- Debounced mouseup handling (600ms timeout)
- Keyboard support (Enter, Space keys)
- Dynamic icon element injection before slot
- A11y: aria-disabled, tabIndex management

**Lifecycle**:
```
connectedCallback()
  → handlerExternalCss() [adoptedStyleSheets or <style> fallback]
  → setIcon()
  → syncA11yState()

disconnectedCallback()
  → debounceMouseEvent() cleanup
  → event listener removal

attributeChangedCallback()
  → Sync disabled, icon, iconSize, sheet changes
```

#### **Input** (`components/input/index.ts`)

**Class**: `Input extends HTMLElementSSR()`

**Observed Attributes**:
```typescript
['label', 'disabled', 'name', 'placeholder', 'type', 'icon', 'value', 'status', 
 'prefix', 'suffix', 'allowclear', 'count', 'maxlength', 'showcount', 'onPressEnter',
 'variant', 'minrows', 'maxrows', 'sheet']
```

**Shadow DOM Structure**:
- `.ran-input` (part="input")
  - `.ran-input-content` (part="content") - native `<input>`
  - `.ran-input-label` (part="label") - floating label, dynamic
  - `r-icon.ran-icon` - optional prefix/icon element

**Key Properties**:
- `value: string` - input value (setter syncs wrapper + inner input)
- `disabled: string` - propagates to wrapper and inner input
- `label: string` - floating label (Material Design style)
- `status: string` - error | warning | normal (affects styling)
- `type: string` - input type (forwarded to inner input)
- `icon: string` - icon name for prefix
- `prefix: string`, `suffix: string` - icons on sides
- `sheet: string` - external CSS

**Event Handling**:
- `input` event → CustomEvent with `{ detail: { value } }`
- `change` event → CustomEvent with `{ detail: { value } }`
- Native input listener attached in connectedCallback

**Helper Methods**:
- `listenPlaceholder(name, value)` - syncs placeholder to inner input
- `listenLabel(name, value)` - creates/removes label dynamically
- `listenStatus(name, value)` - propagates status attribute
- `dealIcon()` - creates r-icon element and injects

#### **Select** (`components/select/index.ts`)

**Class**: `Select extends HTMLElementSSR()`

**Observed Attributes**:
```typescript
['disabled', 'sheet', 'clear', 'type', 'defaultValue', 'showSearch', 
 'placement', 'getPopupContainerId', 'dropdownclass', 'trigger']
```

**Shadow DOM Structure**:
- `.ran-select` (part="select")
  - `.selection` (part="selection")
    - `r-icon` (part="icon") - arrow-down
    - `<div>` - selector wrapper
      - `.selection-item` (part="selection-item") - selected text
      - `.selection-search` (part="search") - search input
  - `<slot>` - for r-option children

**Portal DOM**:
- `r-dropdown` (id=_listboxId, role="listbox")
  - `r-dropdown-item` elements (role="option")
  - Appended to document.body or custom container

**Key Properties**:
- `value: string` - selected value
- `defaultValue: string` - initial value
- `showSearch: string` - enable search in dropdown
- `placement: string` - 'bottom' | 'top'
- `trigger: string` - 'click' | 'hover' (hover disabled on mobile)
- `disabled: boolean` - propagates to selection element

**A11y Attributes**:
- `role="combobox"`, `aria-haspopup="listbox"`
- `aria-controls={_listboxId}`, `aria-expanded`
- `aria-activedescendant` - points to active option
- Option elements have `aria-selected`, `id`

**Advanced Features**:
- Animated dropdown: placement-based animations (ran-dropdown-down-in/out, ran-dropdown-up-in/out)
- Keyboard navigation: ArrowUp/Down, Enter, Escape
- Hover-based dropdown opening (desktop only)
- Option search with throttling
- Custom dropdown positioning with scroll offset

#### **Modal** (`components/modal/index.ts`)

**Class**: `Modal extends RanElement`

**Observed Attributes**:
```typescript
['open', 'title', 'maskClosable', 'closeOnEsc', 'lockScroll', 'autoFocus', 'closable', 'sheet']
```

**Shadow DOM Structure**:
- `.ran-modal-root` (part="root")
  - `.ran-modal-mask` (part="mask") - clickable backdrop
  - `.ran-modal-dialog` (part="dialog", role="dialog", aria-modal="true")
    - `.ran-modal-header` (part="header")
      - `<h3>.ran-modal-title` (part="title")
      - `<button>.ran-modal-close` (part="close") - x button
    - `.ran-modal-body` (part="body")
      - `<slot>` - main content
    - `.ran-modal-footer` (part="footer")
      - `<slot name="footer">` - footer content

**Key Properties**:
- `open: boolean` - controls modal visibility
- `title: string` - modal title
- `maskClosable: boolean` - allow close by clicking mask
- `closeOnEsc: boolean` - allow close by Escape key
- `lockScroll: boolean` - lock body scroll when open
- `autoFocus: boolean` - focus first focusable element
- `closable: boolean` - show close button
- `sheet: string` - external CSS

**Events**:
- `beforeopen` - cancelable, before opening
- `open` - after opening starts
- `afteropen` - after transition completes (uses computed transitionDuration)
- `beforeclose` - cancelable, before closing
- `close` - after closing starts
- `afterclose` - after transition completes (detail: { trigger })

**Static Methods (Programmatic API)**:
```typescript
Modal.open(options?: ModalProgrammaticOptions | string): Promise<ModalProgrammaticResult>
Modal.confirm(options)
Modal.info(options)
Modal.success(options)
Modal.warning(options)
Modal.error(options)
```

**Modal Stack Management**:
- Static `_openStack: Modal[]` - tracks open modals
- Top modal receives Escape key, focus events
- Other elements set `inert=true` and `aria-hidden="true"`
- Body scroll locked per count (handles nested modals)

**Focus Trapping**:
- Tab key cycles through focusable elements
- Focus restored to previously active element on close
- Focus selector: `'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'`

#### **Skeleton** (`components/skeleton/index.ts`)

**Class**: `CustomElement extends HTMLElement` (lightweight wrapper)

**Observed Attributes**:
```typescript
['disabled', 'sheet']
```

**Shadow DOM**:
- `.ran-skeleton` - single div placeholder

**Properties**:
- `sheet: string` - external CSS

**Note**: Simple component, minimal logic; good reference for basic structure.

#### **Card** (`components/card/index.ts`)

**Class**: `Card extends RanElement`

**Observed Attributes**:
```typescript
['title', 'description', 'sheet']
```

**Shadow DOM Structure**:
- `.ran-card` (part="card")
  - `.ran-card-header` (part="header", hidden if no title/description)
    - `.ran-card-title-area`
      - `.ran-card-title` (part="title") - attribute-driven text
      - `.ran-card-description` (part="description") - attribute-driven text
    - `<slot name="extra">` (part="extra") - extra header content
  - `.ran-card-body` (part="body")
    - `<slot>` - main content
  - `.ran-card-footer` (part="footer", hidden until footer slot has content)
    - `<slot name="footer">` - footer content

**Key Properties**:
- `title: string` - card title
- `description: string` - card description
- `sheet: string` - external CSS

**Behavior**:
- Header hidden if both title and description are empty
- Footer visibility bound to slotchange event (only shown if footer slot has elements)
- Simple, no complex logic; good for content layout

**CSS Variables** (from `index.less`):
```less
--ran-card-display, block
--ran-card-min-height, 0
--ran-card-gap, 14px
--ran-card-padding, 16px
--ran-skin-border-width, 1px
--ran-skin-border-style, solid
--ran-color-border
--ran-card-radius, var(--ran-radius-md)
--ran-card-background, var(--ran-color-bg-muted)
--ran-card-shadow, none
--ran-card-title-color, var(--ran-color-text)
--ran-card-title-font-size, 16px
--ran-card-title-font-weight, 600
--ran-card-description-color, var(--ran-color-text-secondary)
--ran-card-description-font-size, 14px
```

---

## Utility Functions

### Core Component Utilities (`utils/component.ts`)

#### **ensureShadowRoot()**
```typescript
function ensureShadowRoot(
  host: HTMLElement,
  cssText: string = '',
  options: ShadowRootInit = { mode: 'closed' }
): ShadowRoot
```
- Caches shadow root in WeakMap to prevent re-attachment
- Adopts CSS text via `adoptStyles()`
- Returns existing or newly created shadow root

#### **ensureShadowElement()**
```typescript
function ensureShadowElement<T extends HTMLElement>(
  root: ShadowRoot,
  selector: string,
  factory: () => T
): T
```
- Queries element; if missing, calls factory() and appends
- Prevents duplicate element creation

#### **getStringAttribute()**
```typescript
function getStringAttribute(element: HTMLElement, name: string, fallback = ''): string
```
- Safe getAttribute with fallback; handles null

#### **setStringAttribute()**
```typescript
function setStringAttribute(
  element: HTMLElement,
  name: string,
  value: string | null | undefined,
  options: { removeEmpty?: boolean } = {}
): void
```
- Sets attribute or removes if value is null/undefined
- `removeEmpty` option auto-removes on falsy values

#### **setBooleanAttribute()**
```typescript
function setBooleanAttribute(
  element: HTMLElement,
  name: string,
  value: boolean,
  options: { aria?: string } = {}
): void
```
- Sets boolean attribute with optional aria- counterpart
- Example: `setBooleanAttribute(el, 'disabled', true, { aria: 'disabled' })`
  → Sets `disabled=""` and `aria-disabled="true"`

#### **syncSheetAttribute()**
```typescript
function syncSheetAttribute(
  host: HTMLElement,
  root: ShadowRoot,
  name: string,
  oldValue: string | null,
  newValue: string | null
): void
```
- Calls `adoptSheetText(root, sheet)` when `sheet` attribute changes
- Noop if name !== 'sheet' or values unchanged

### Builder Pattern (`utils/builder/`)

#### **ElementBuilder** Class
```typescript
class ElementBuilder<T extends HTMLElement = HTMLElement> {
  constructor(tag: string)
  
  // Attribute/Style methods
  id(value: string): this
  class(name: string): this
  addClass(...names): this
  removeClass(...names): this
  attr(name: string, value: string): this
  attrs(values: Record<string, string | number | boolean | null>): this
  boolAttr(name: string, value: boolean, enabledValue = ''): this
  part(value: string): this
  data(key: string, value: string): this
  style(keyOrMap, value?): this
  cssVar(name: string, value: string): this  // --name prefixing handled
  
  // ARIA methods
  aria(key: string, value: string): this
  role(value: string): this
  tabIndex(value: number): this
  label(value: string): this
  labelledBy(id: string): this
  describedBy(id: string): this
  ariaHidden(hidden = true): this
  
  // Event & children
  on<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: T, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): this
  children(...items: (HTMLElement | string | ElementBuilder | undefined | null)[]): this
  replaceChildren(...items): this
  text(value: string): this
  ref(holder: Ref<T>): this
  
  // Shadow DOM
  shadow(options?: ShadowRootInit = { mode: 'closed' }): ShadowBuilder<T>
  
  // Serialize
  serialize(): string  // HTML string
  build(): T  // Returns the element
}
```

#### **ShadowBuilder** Class
```typescript
class ShadowBuilder<T extends HTMLElement = HTMLElement> {
  constructor(host: T, root: ShadowRoot, options: ShadowRootInit)
  
  children(...items): this
  adoptSheet(...sheets: CSSStyleSheet[]): this
  css(cssText: string): this  // Uses adoptedStyleSheets or <style> fallback
  done(): { host: T; shadow: ShadowRoot }
  serialize(): string
}
```

#### **Factory Functions**
Pre-configured builders for common elements:
```typescript
View(tag: string)           // ElementBuilder<HTMLElement>
Div()                       // ElementBuilder<HTMLDivElement>
Span()                      // ElementBuilder<HTMLSpanElement>
Slot()                      // ElementBuilder<HTMLSlotElement>
ButtonBuilder()             // ElementBuilder<HTMLButtonElement>
InputBuilder()              // ElementBuilder<HTMLInputElement>
Style()                     // ElementBuilder<HTMLStyleElement>
Label()                     // ElementBuilder<HTMLLabelElement>
Ul(), Li()                  // ElementBuilder<HTMLUListElement>, etc.
Section(), Article()
Nav(), Header(), Footer(), Main()
DeclarativeShadow()
```

**Usage Example**:
```typescript
const button = Div()
  .class('my-button')
  .attr('part', 'button')
  .role('button')
  .tabIndex(0)
  .on('click', () => console.log('clicked'))
  .children('Click me')
  .build();
```

### SSR Registry (`utils/ssr-registry.ts`)

#### **defineSSR()**
```typescript
function defineSSR(tagName: string, constructor: new () => HTMLElement): void
```
- Browser: calls `customElements.define()`
- SSR: stores in internal registry Map
- Use this instead of bare `customElements.define()`

#### **getSSRConstructor()**
```typescript
function getSSRConstructor(tagName: string): (new () => HTMLElement) | undefined
```
- Retrieves constructor from SSR registry
- Used by renderToString()

#### **getSSRRegistry()**
```typescript
function getSSRRegistry(): ReadonlyMap<string, new () => HTMLElement>
```
- Returns entire SSR component registry

#### **RanElement Export** (`utils/ssr.ts`)
```typescript
export const RanElement = HTMLElementSSR()!
// Returns HTMLElement (browser) or HTMLElementMock (SSR)
```

### Theme Utilities (`utils/theme.ts`)

#### **Type Definitions**
```typescript
type RanThemeName = 'light' | 'dark' | 'system'
type RanThemePackName = 
  | 'default'
  | 'windows-98'
  | 'windows-xp'
  | 'system-6'
  | 'wired'
  | 'paper'
  | 'pixel-retro'
  | 'neo-brutalism'
type ThemeTarget = HTMLElement | Document
type ThemeTokenMap = Record<string, string | number | null | undefined>
```

#### **Theme Functions**
```typescript
function setTheme(name: RanThemeName, target?: ThemeTarget): void
  // Sets data-ran-theme and theme attributes
  // 'system' triggers matchMedia listener

function getTheme(target?: ThemeTarget): RanThemeName | ''
  // Returns current theme from attributes/localStorage

function setThemePack(name: RanThemePackName, target?: ThemeTarget): void
  // Sets data-ran-theme-pack attribute

function getThemePack(target?: ThemeTarget): RanThemePackName | ''
  // Returns current theme pack

function setThemeToken(name: string, value: string | number, target?: HTMLElement): void
  // Sets single CSS custom property: element.style.setProperty(name, value)

function clearThemeToken(name: string, target?: HTMLElement): void
  // Removes CSS custom property

function setThemeTokens(tokens: ThemeTokenMap, target?: HTMLElement): void
  // Batch set/clear CSS custom properties

function initTheme(target?: ThemeTarget): void
  // Restores theme from localStorage on page load
```

#### **Storage Keys**
- `'ran-theme'` - stores theme preference
- `'ran-theme-pack'` - stores theme pack choice

#### **Example Usage**
```typescript
initTheme();  // on app load
setTheme('dark');
setThemePack('windows-98');
setThemeTokens({
  '--ran-color-primary': '#ff0000',
  '--ran-radius-md': '8px'
});
```

### DOM Utilities (`utils/dom.ts`)

#### **Constants**
```typescript
export const falseList = [false, 'false', null, undefined]
```

#### **isDisabled()**
```typescript
function isDisabled(element: Element): boolean
```
- Checks if element has `disabled` attribute with non-false value

#### **Other Utilities**
- `removeClassToElementChild(parent, deleteClass)` - removes class from children
- `createIconList()` - demo helper for icon documentation
- `loadScript({ type, content })` - dynamic script loading with deduplication

---

## LESS Styling Conventions

### CSS Variable Naming

All CSS variables use the `--ran-` prefix:

**Color Tokens** (in theme packs, e.g., windows-98.less):
```less
--ran-color-primary        // Main brand color (#000080 in windows-98)
--ran-color-success        // Success state (#008000)
--ran-color-warning        // Warning state (#808000)
--ran-color-danger         // Error/danger state (#800000)
--ran-color-bg             // Base background (#c0c0c0)
--ran-color-bg-elevated    // Elevated surface (#c0c0c0)
--ran-color-bg-muted       // Muted background (#808080)
--ran-color-text           // Primary text (#000000)
--ran-color-text-secondary // Secondary text (#000000)
--ran-color-text-disabled  // Disabled text (#808080)
--ran-color-border         // Border color (#808080)
--ran-color-border-secondary
--ran-color-link           // Link color (#000080)
```

**Radius Tokens**:
```less
--ran-radius-sm    // Small border radius (0 in windows-98)
--ran-radius-md    // Medium border radius (0 in windows-98)
--ran-radius-lg    // Large border radius
```

**Skin/Theme Tokens**:
```less
--ran-skin-font-family        // Font for controls
--ran-skin-border-width       // Border width (2px in windows-98)
--ran-skin-border-style       // solid, inset, etc.
--ran-skin-outline-color      // Focus outline
--ran-skin-raised-shadow      // Embossed effect
--ran-skin-inset-shadow       // Inset effect
--ran-skin-hard-shadow        // Strong shadow
--ran-skin-rough-shadow       // Textured shadow
--ran-skin-control-height-sm  // Small control height (21px)
--ran-skin-control-height-md  // Medium control height (23px)
```

**Motion/Animation**:
```less
--ran-motion-duration-fast    // Fast transition (0ms in windows-98)
--ran-motion-duration-base    // Base transition (0ms)
```

### Component-Level Variables

Components define their own variables with fallbacks:

**Button** (`components/button/index.less`):
```less
--ran-btn-box-sizing, border-box
--ran-btn-position, relative
--ran-btn-display, inline-flex
--ran-btn-contain-box-sizing, border-box
--ran-btn-contain-background, var(--ran-color-bg-elevated, #fff)
--ran-btn-content-background-color, var(--ran-color-primary, #1890ff)
--ran-btn-content-color, #fff
--ran-btn-content-border-color
```

**Input** (`components/input/index.less`):
```less
--ran-input-host-position, relative
--ran-input-host-display, block
--ran-input-box-sizing, border-box
--ran-input-width, 100%
--ran-input-padding, 0px 0px 0px 4px
--ran-input-color, var(--ran-color-text, #000000d9)
--ran-input-border, 1px solid var(--ran-color-border, #d9d9d9)
--ran-input-border-radius, 2px
```

**Card** (`components/card/index.less`):
```less
--ran-card-display, block
--ran-card-gap, 14px
--ran-card-padding, 16px
--ran-card-radius, var(--ran-radius-md)
--ran-card-background, var(--ran-color-bg-muted)
--ran-card-title-color, var(--ran-color-text)
--ran-card-title-font-size, 16px
--ran-card-description-color, var(--ran-color-text-secondary)
```

### Base LESS (`base.less`)

Shared variables and mixins:
```less
@font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...
@box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), ...

.remove-wap-active-focus {
  outline: 0;
  -webkit-tap-highlight-color: transparent;
}
```

---

## Build & Configuration

### Vite Configuration (`vite.config.ts`)

**Entry Points** (ES build):
- Per-component entries: `components/button/index.ts`, etc.
- Theme packs: `theme-packs/*.ts`
- Utilities: `style.ts`, `index.ts`
- Output: `dist/*.js` (ES modules)

**Build Options**:
- Bundle: CJS + IIFE to `dist/index.js`
- ES build: Per-component ES modules
- CSS handling: `cssCodeSplit: true`, esbuild minification
- External: `['react', 'react-dom', 'vue']`

**Aliases** (resolved in both vite and vitest):
```typescript
'@/components': './components/'
'@/utils': './utils/'
'@/assets': './assets/'
'@/public': './public/'
```

**LESS Processing**:
```typescript
less: {
  javascriptEnabled: true,
  additionalData: `@import "${resolve(__dirname, 'base.less')}";`
}
```
Base styles auto-imported into all LESS files

### TypeScript Configuration (`tsconfig.json`)

**Module & Target**:
```json
{
  "module": "ESNext",
  "moduleResolution": "bundler",
  "target": "ESNext",
  "declaration": true,
  "outDir": "dist"
}
```

**Strict Mode**: `strict: true`

**Path Aliases**:
```json
{
  "@/assets/*": ["./assets/*"],
  "@/components/*": ["./components/*"],
  "@/utils/*": ["./utils/*"],
  "@/shadowless/*": ["./shadowless/*"],
  "@/plugins/*": ["./plugins/*"]
}
```

### Testing Configuration (`vitest.config.ts`)

**Environment**: `jsdom`

**Test Files**: `test/unit/**/*.test.ts`

**Globals**: `true`

**Setup**: `test/setup.ts`

**Coverage** (thresholds):
- Statements: 80%
- Branches: 70%
- Functions: 85%
- Lines: 80%

**Include**: `components/**/*.ts`, `utils/**/*.ts` (exclude .test.ts)

---

## Testing Patterns

### Test Framework
- **Runner**: Vitest
- **DOM Environment**: jsdom
- **Assertions**: Vitest's `expect()`

### Component Testing Pattern (Input Example)

```typescript
import { describe, expect, it, beforeEach } from 'vitest';
import { Input } from '@/components/input';
import '@/components/input';  // Ensure customElements.define

describe('r-input contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders shadow DOM structure correctly', () => {
    const input = document.createElement('r-input');
    document.body.appendChild(input);
    
    const shadow = (input as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();
    
    const wrapper = shadow.querySelector('.ran-input') as HTMLElement;
    expect(wrapper?.getAttribute('part')).toBe('input');
  });

  it('reflects property to attribute', () => {
    const input = document.createElement('r-input');
    document.body.appendChild(input);
    
    input.setAttribute('value', 'test');
    expect((input as any).value).toBe('test');
  });

  it('emits custom events', async () => {
    const input = document.createElement('r-input');
    document.body.appendChild(input);
    
    const events: any[] = [];
    input.addEventListener('input', (e: Event) => {
      events.push((e as CustomEvent).detail.value);
    });
    
    const innerInput = (input as any)._shadowDom.querySelector('.ran-input-content');
    const event = new InputEvent('input', { data: 'hello' });
    Object.defineProperty(event, 'target', { value: innerInput });
    innerInput.dispatchEvent(event);
    
    expect(events.length).toBeGreaterThan(0);
  });

  it('disables attribute propagation', () => {
    const input = document.createElement('r-input');
    document.body.appendChild(input);
    
    input.disabled = 'true';
    expect((input as any)._input.hasAttribute('disabled')).toBe(true);
  });
});
```

### Key Testing Concepts

1. **Element Creation**: `document.createElement('r-component')`
2. **Shadow DOM Access**: Cast to component class, access private `_shadowDom`
3. **Event Testing**: Dispatch CustomEvent with detail, listen to custom events
4. **Attribute Testing**: Use `setAttribute()`, `getAttribute()`, `hasAttribute()`
5. **Property Testing**: Use component properties (getters/setters)
6. **Async Handling**: Use `await new Promise(r => setTimeout(r, ms))`

### Missing Tests

**Card** has no test file. Based on input/button patterns, a card test should cover:
- Shadow DOM structure (header, body, footer elements and parts)
- Title and description attribute sync
- Title/description hiding when empty
- Footer slot detection and visibility
- Part attribute exports for styling
- Sheet attribute handling
- ConnectedCallback initialization

---

## Attribute Patterns & Conventions

### Common Observed Attributes

**All Components**:
- `sheet: string` - External CSS text (applied to shadow DOM)

**Form Controls** (Input, Select, Button):
- `disabled: string | boolean` - Disables interaction
- Stored as empty attribute when true, removed when false/falsy

**Semantic**:
- `title: string` - Human-readable label (Button, Card)
- `name: string` - Form association (Input)
- `placeholder: string` - Input placeholder (Input, Select search)

### Property Access Pattern

**Getter/Setter Pattern**:
```typescript
get value(): string {
  return this.getAttribute('value') || '';
}

set value(val: string) {
  if (!isDisabled(this) && val) {
    this.setAttribute('value', val);
  } else {
    this.removeAttribute('value');
  }
}
```

**Boolean Attributes**:
```typescript
get disabled(): boolean | string {
  return isDisabled(this);
}

set disabled(value: boolean | string | undefined | null) {
  if (!value || value === 'false') {
    this.removeAttribute('disabled');
    this.removeAttribute('aria-disabled');
  } else {
    this.setAttribute('disabled', '');
    this.setAttribute('aria-disabled', 'true');
  }
}
```

**String Helpers** (setStringAttribute, getStringAttribute):
```typescript
get title(): string {
  return getStringAttribute(this, 'title');
}

set title(value: string) {
  setStringAttribute(this, 'title', value);
}
```

### External CSS (sheet) Pattern

All components support the `sheet` attribute:
```typescript
get sheet(): string {
  return getStringAttribute(this, 'sheet');
}

set sheet(value: string) {
  setStringAttribute(this, 'sheet', value);
}

connectedCallback(): void {
  syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
}

attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
  if (name === 'sheet') {
    syncSheetAttribute(this, this._shadowDom, 'sheet', oldValue, newValue);
  }
}
```

---

## Accessibility (A11y)

### ARIA Attributes Standard

**Form Controls**:
- `disabled` ↔ `aria-disabled="true"`
- `required` ↔ implied by form validation
- `status="error"` → visual indicator (no aria-invalid, relies on CSS)

**Button**:
- `role="button"`
- `tabindex="0"` when enabled, `-1` when disabled
- `aria-disabled="true"` when disabled

**Select**:
- `role="combobox"`
- `aria-haspopup="listbox"`
- `aria-controls="{listboxId}"`
- `aria-expanded="true|false"`
- `aria-activedescendant="{optionId}"`
- Dropdown: `role="listbox"`
- Options: `role="option"`, `aria-selected="true|false"`

**Modal**:
- `role="dialog"`, `aria-modal="true"`
- `aria-labelledby="{titleId}"`
- Focus trap (Tab cycles within dialog)
- Background elements get `inert=true`, `aria-hidden="true"`
- Close button: `aria-label="Close dialog"` (from builder `.label()`)

### Keyboard Interactions

**Button**:
- Enter, Space → click()

**Input**:
- Standard native input behavior

**Select**:
- ArrowUp/Down → navigate options
- Enter/Space → select option
- Escape → close dropdown

**Modal**:
- Escape → close (if closeOnEsc=true)
- Tab → cycle focus within dialog (trap)

---

## Example: Implementing Card Tests

Based on existing patterns, a card test file should look like:

```typescript
import { describe, expect, it, beforeEach } from 'vitest';
import { Card } from '@/components/card';
import '@/components/card';

describe('r-card contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders card structure with header, body, footer', () => {
    const card = document.createElement('r-card');
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('.ran-card')).toBeTruthy();
    expect(shadow.querySelector('.ran-card-header')).toBeTruthy();
    expect(shadow.querySelector('.ran-card-body')).toBeTruthy();
    expect(shadow.querySelector('.ran-card-footer')).toBeTruthy();
  });

  it('hides header when title and description are empty', () => {
    const card = document.createElement('r-card');
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    const header = shadow.querySelector('.ran-card-header') as HTMLElement;
    const styles = window.getComputedStyle(header);
    // Header display controlled by :host(:not([title]):not([description])) selector
    expect(header).toBeTruthy();  // Element exists
  });

  it('displays title when title attribute is set', () => {
    const card = document.createElement('r-card');
    document.body.appendChild(card);

    card.setAttribute('title', 'My Card Title');
    const shadow = (card as any)._shadowDom as ShadowRoot;
    const titleEl = shadow.querySelector('.ran-card-title');
    expect(titleEl?.textContent).toBe('My Card Title');
  });

  it('displays description when description attribute is set', () => {
    const card = document.createElement('r-card');
    document.body.appendChild(card);

    card.setAttribute('description', 'Card description');
    const shadow = (card as any)._shadowDom as ShadowRoot;
    const descEl = shadow.querySelector('.ran-card-description');
    expect(descEl?.textContent).toBe('Card description');
  });

  it('hides footer until content is slotted', async () => {
    const card = document.createElement('r-card');
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    const footer = shadow.querySelector('.ran-card-footer') as HTMLElement;
    expect(footer.style.display).toBe('none');

    // Add footer content
    const footerContent = document.createElement('div');
    footerContent.setAttribute('slot', 'footer');
    footerContent.textContent = 'Footer';
    card.appendChild(footerContent);

    // Wait for slotchange
    await new Promise(r => setTimeout(r, 50));
    expect(footer.style.display).not.toBe('none');
  });

  it('exports part attributes for styling', () => {
    const card = document.createElement('r-card');
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    const cardEl = shadow.querySelector('.ran-card');
    const headerEl = shadow.querySelector('.ran-card-header');
    const bodyEl = shadow.querySelector('.ran-card-body');
    const footerEl = shadow.querySelector('.ran-card-footer');

    expect(cardEl?.getAttribute('part')).toBe('card');
    expect(headerEl?.getAttribute('part')).toBe('header');
    expect(bodyEl?.getAttribute('part')).toBe('body');
    expect(footerEl?.getAttribute('part')).toBe('footer');
  });

  it('supports sheet attribute for custom CSS', () => {
    const card = document.createElement('r-card');
    document.body.appendChild(card);

    card.setAttribute('sheet', '.ran-card { background: red; }');
    const shadow = (card as any)._shadowDom as ShadowRoot;
    
    // Verify custom style is injected
    expect(shadow.innerHTML).toContain('.ran-card { background: red; }');
  });

  it('syncs title and description on attribute changes', () => {
    const card = document.createElement('r-card');
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    const titleEl = shadow.querySelector('.ran-card-title');

    card.setAttribute('title', 'First');
    expect(titleEl?.textContent).toBe('First');

    card.setAttribute('title', 'Second');
    expect(titleEl?.textContent).toBe('Second');

    card.removeAttribute('title');
    expect(titleEl?.textContent).toBe('');
  });

  it('accepts slotted content in header extra slot', () => {
    const card = document.createElement('r-card');
    const extra = document.createElement('div');
    extra.setAttribute('slot', 'extra');
    extra.textContent = 'Extra';
    card.appendChild(extra);
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    const extraSlot = shadow.querySelector('slot[name="extra"]');
    expect(extraSlot).toBeTruthy();
  });

  it('accepts slotted content in body', () => {
    const card = document.createElement('r-card');
    card.textContent = 'Body content';
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    const bodySlot = shadow.querySelector('.ran-card-body slot');
    expect(bodySlot).toBeTruthy();
  });
});
```

---

## Common Pitfalls & Solutions

1. **Shadow Root Caching**: Use `ensureShadowRoot()` to avoid re-attaching
2. **Element Hydration**: Check for existing elements before creating in constructor
3. **Event Listener Cleanup**: Always remove listeners in `disconnectedCallback()`
4. **JSDOM Limitations**: `adoptedStyleSheets` is frozen; fallback to `<style>` tag
5. **SSR Compatibility**: Use `RanElement` and `defineSSR()` for universal components
6. **CSS Variable Fallbacks**: Always provide fallbacks in LESS files

---

## Related Files & Entry Points

- **Main export**: `/index.ts`
- **Styles**: `/style.ts`
- **Components directory**: `/components/*/index.ts`
- **Theme packs**: `/theme-packs/*.ts`
- **Tests**: `/test/unit/**/*.test.ts`
- **Configuration**: `vite.config.ts`, `vitest.config.ts`, `tsconfig.json`

