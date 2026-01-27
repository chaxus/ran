# Input

Modern input component with floating labels, multiple variants, and extensive form integration support.

## Quick Start

### Basic Usage

<r-input></r-input>

```html
<r-input></r-input>
```

## API Reference

### Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `'text'` | Input type: `text`, `password`, `email`, `number`, `tel`, `url`, `search`, `date`, `time`, `datetime-local`, `textarea` |
| `value` | `string` | `''` | Input value |
| `placeholder` | `string` | `''` | Placeholder text |
| `label` | `string` | - | Floating label text (Material Design style) |
| `name` | `string` | - | Input name for form submission |
| `disabled` | `boolean` | `false` | Whether the input is disabled |
| `readonly` | `boolean` | `false` | Whether the input is readonly |
| `required` | `boolean` | `false` | Whether the input is required |
| `size` | `string` | `'md'` | Input size: `sm`, `md`, `lg` |
| `status` | `string` | `'normal'` | Input status: `normal`, `error`, `warning`, `success` |
| `variant` | `string` | `'outlined'` | Input variant: `outlined`, `filled`, `borderless` |
| `maxlength` | `number` | - | Maximum character length |
| `min` | `string\|number` | - | Minimum value (for number/date types) |
| `max` | `string\|number` | - | Maximum value (for number/date types) |
| `step` | `string\|number` | - | Step value (for number type) |
| `prefix` | `string` | - | Prefix icon name |
| `suffix` | `string` | - | Suffix icon name |
| `clearable` | `boolean` | `false` | Show clear button |
| `show-count` | `boolean` | `false` | Show character count |
| `full-width` | `boolean` | `false` | Take full width of container |
| `error` | `string` | - | Error message to display |
| `autocomplete` | `string` | - | Autocomplete attribute |
| `inputmode` | `string` | - | Input mode for mobile keyboards |
| `spellcheck` | `boolean` | - | Enable/disable spell checking |
| `minrows` | `number` | `3` | Minimum rows (textarea only) |
| `maxrows` | `number` | `6` | Maximum rows (textarea only) |

### Input Types `type`

#### Text Input (Default)

<r-input type="text" placeholder="Enter text"></r-input>

```html
<r-input type="text" placeholder="Enter text"></r-input>
```

#### Password Input

<r-input type="password" placeholder="Enter password"></r-input>

```html
<r-input type="password" placeholder="Enter password"></r-input>
```

#### Email Input

<r-input type="email" placeholder="Enter email"></r-input>

```html
<r-input type="email" placeholder="Enter email"></r-input>
```

#### Number Input

<r-input type="number" min="0" max="100" step="1" placeholder="Enter number"></r-input>

```html
<r-input type="number" min="0" max="100" step="1" placeholder="Enter number"></r-input>
```

#### Telephone Input

<r-input type="tel" placeholder="Enter phone number"></r-input>

```html
<r-input type="tel" placeholder="Enter phone number"></r-input>
```

#### URL Input

<r-input type="url" placeholder="Enter URL"></r-input>

```html
<r-input type="url" placeholder="Enter URL"></r-input>
```

#### Search Input

<r-input type="search" placeholder="Search..."></r-input>

```html
<r-input type="search" placeholder="Search..."></r-input>
```

#### Date Input

<r-input type="date"></r-input>

```html
<r-input type="date"></r-input>
```

#### Time Input

<r-input type="time"></r-input>

```html
<r-input type="time"></r-input>
```

#### Datetime Input

<r-input type="datetime-local"></r-input>

```html
<r-input type="datetime-local"></r-input>
```

#### Textarea

<r-input type="textarea" placeholder="Enter multi-line text" minrows="3" maxrows="6"></r-input>

```html
<r-input type="textarea" placeholder="Enter multi-line text" minrows="3" maxrows="6"></r-input>
```

### Floating Label `label`

Material Design style floating label:

<r-input label="Username"></r-input>

```html
<r-input label="Username"></r-input>
```

### Sizes `size`

<div style="display:flex;gap:12px;align-items:flex-start;flex-direction:column;">
<r-input size="sm" label="Small"></r-input>
<r-input size="md" label="Medium"></r-input>
<r-input size="lg" label="Large"></r-input>
</div>

```html
<r-input size="sm" label="Small"></r-input>
<r-input size="md" label="Medium"></r-input>
<r-input size="lg" label="Large"></r-input>
```

### Variants `variant`

<div style="display:flex;gap:12px;align-items:flex-start;flex-direction:column;">
<r-input variant="outlined" label="Outlined"></r-input>
<r-input variant="filled" label="Filled"></r-input>
<r-input variant="borderless" label="Borderless"></r-input>
</div>

```html
<r-input variant="outlined" label="Outlined"></r-input>
<r-input variant="filled" label="Filled"></r-input>
<r-input variant="borderless" label="Borderless"></r-input>
```

### Status `status`

<div style="display:flex;gap:12px;align-items:flex-start;flex-direction:column;">
<r-input status="normal" label="Normal"></r-input>
<r-input status="success" label="Success"></r-input>
<r-input status="warning" label="Warning"></r-input>
<r-input status="error" label="Error" error="This field has an error"></r-input>
</div>

```html
<r-input status="normal" label="Normal"></r-input>
<r-input status="success" label="Success"></r-input>
<r-input status="warning" label="Warning"></r-input>
<r-input status="error" label="Error" error="This field has an error"></r-input>
```

### Disabled State `disabled`

<r-input label="Username" disabled value="Disabled input"></r-input>

```html
<r-input label="Username" disabled value="Disabled input"></r-input>
```

### Readonly State `readonly`

<r-input label="Username" readonly value="Readonly input"></r-input>

```html
<r-input label="Username" readonly value="Readonly input"></r-input>
```

### Required Field `required`

<r-input label="Username" required></r-input>

```html
<r-input label="Username" required></r-input>
```

### Icons `prefix` / `suffix`

<r-input prefix="user" label="Username"></r-input>
<r-input suffix="search" label="Search"></r-input>
<r-input prefix="lock" suffix="eye" type="password" label="Password"></r-input>

```html
<r-input prefix="user" label="Username"></r-input>
<r-input suffix="search" label="Search"></r-input>
<r-input prefix="lock" suffix="eye" type="password" label="Password"></r-input>
```

### Clearable `clearable`

<r-input label="Username" clearable value="Clear me"></r-input>

```html
<r-input label="Username" clearable value="Clear me"></r-input>
```

### Character Count `show-count`

<r-input label="Bio" show-count maxlength="100" type="textarea"></r-input>

```html
<r-input label="Bio" show-count maxlength="100" type="textarea"></r-input>
```

### Full Width `full-width`

<r-input label="Full Width Input" full-width></r-input>

```html
<r-input label="Full Width Input" full-width></r-input>
```

## Events

The input component fires several custom events:

### Change Event

Fired when the input value changes and loses focus:

```html
<r-input label="Username"></r-input>

<script>
  const input = document.querySelector('r-input');
  input.addEventListener('input-change', (e) => {
    console.log('Value changed:', e.detail.value);
  });
</script>
```

### Input Event

Fired on every keystroke:

```html
<r-input label="Search"></r-input>

<script>
  const input = document.querySelector('r-input');
  input.addEventListener('input-input', (e) => {
    console.log('Typing:', e.detail.value);
  });
</script>
```

### Focus/Blur Events

```html
<r-input label="Username"></r-input>

<script>
  const input = document.querySelector('r-input');

  input.addEventListener('input-focus', (e) => {
    console.log('Input focused');
  });

  input.addEventListener('input-blur', (e) => {
    console.log('Input blurred');
  });
</script>
```

### Clear Event

Fired when the clear button is clicked:

```html
<r-input label="Search" clearable></r-input>

<script>
  const input = document.querySelector('r-input');
  input.addEventListener('input-clear', (e) => {
    console.log('Input cleared, previous value:', e.detail.previousValue);
  });
</script>
```

### Enter Event

Fired when Enter key is pressed:

```html
<r-input label="Search"></r-input>

<script>
  const input = document.querySelector('r-input');
  input.addEventListener('input-enter', (e) => {
    console.log('Enter pressed with value:', e.detail.value);
  });
</script>
```

## Methods

### focus()

Focus the input programmatically:

```javascript
const input = document.querySelector('r-input');
input.focus();
```

### blur()

Blur the input programmatically:

```javascript
const input = document.querySelector('r-input');
input.blur();
```

### select()

Select all text in the input:

```javascript
const input = document.querySelector('r-input');
input.select();
```

### clear()

Clear the input value:

```javascript
const input = document.querySelector('r-input');
input.clear();
```

## Form Integration

The input component integrates with native HTML forms using the ElementInternals API:

```html
<form id="myForm">
  <r-input name="username" label="Username" required></r-input>
  <r-input name="email" label="Email" type="email" required></r-input>
  <r-input name="age" label="Age" type="number" min="18" max="100"></r-input>
  <button type="submit">Submit</button>
</form>

<script>
  const form = document.getElementById('myForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    console.log('Form data:', Object.fromEntries(formData));
  });
</script>
```

## CSS Parts

The input component exposes the following CSS parts for styling:

```css
/* Target the container */
r-input::part(container) {
  /* Custom styles */
}

/* Target the input/textarea element */
r-input::part(input) {
  /* Custom styles */
}

/* Target the label */
r-input::part(label) {
  /* Custom styles */
}

/* Target the prefix icon */
r-input::part(prefix) {
  /* Custom styles */
}

/* Target the suffix icon */
r-input::part(suffix) {
  /* Custom styles */
}

/* Target the clear button */
r-input::part(clear) {
  /* Custom styles */
}

/* Target the counter */
r-input::part(counter) {
  /* Custom styles */
}

/* Target the error message */
r-input::part(error) {
  /* Custom styles */
}
```

## CSS Custom Properties

Customize the input appearance using CSS variables:

```css
r-input {
  /* Colors */
  --input-color-border: #d1d5db;
  --input-color-border-hover: #9ca3af;
  --input-color-border-focus: #3b82f6;
  --input-color-bg: #ffffff;
  --input-color-text: #1f2937;
  --input-color-placeholder: #9ca3af;
  --input-color-label: #6b7280;
  --input-color-disabled-bg: #f3f4f6;
  --input-color-disabled-text: #9ca3af;

  /* Status colors */
  --input-color-error: #ef4444;
  --input-color-warning: #f59e0b;
  --input-color-success: #10b981;

  /* Sizes */
  --input-sm-height: 32px;
  --input-md-height: 40px;
  --input-lg-height: 48px;
  --input-sm-font-size: 14px;
  --input-md-font-size: 16px;
  --input-lg-font-size: 18px;

  /* Spacing */
  --input-padding-x: 12px;
  --input-padding-y: 8px;

  /* Border */
  --input-border-width: 1px;
  --input-border-radius: 6px;

  /* Transition */
  --input-transition-duration: 150ms;
}
```

## Best Practices

- **Labels**: Always provide meaningful labels for accessibility
- **Placeholders**: Use placeholders for hints, not instructions
- **Types**: Choose the correct input type for the data (email, tel, number, etc.)
- **Validation**: Use the `required`, `min`, `max`, `maxlength` attributes for validation
- **Status**: Use `status` and `error` props to show validation feedback
- **Icons**: Add relevant prefix/suffix icons to enhance UX
- **Clearable**: Enable `clearable` for search and filter inputs
- **Character Count**: Show `show-count` for inputs with length limits
- **Autocomplete**: Set appropriate `autocomplete` values for better UX
- **Input Mode**: Use `inputmode` to optimize mobile keyboards

## Accessibility

The input component follows WAI-ARIA best practices:

- Uses semantic `<input>` or `<textarea>` elements
- Supports keyboard navigation (Tab, Enter, Escape)
- Properly manages `disabled` and `readonly` states
- Maintains focus indicators
- Associates labels with inputs via `aria-label` or visible labels
- Exposes validation states via `aria-invalid`
- Supports `aria-describedby` for error messages
- Announces status changes to screen readers
