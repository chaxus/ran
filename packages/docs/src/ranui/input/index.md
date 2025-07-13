# Input

Input component for entering content via mouse or keyboard, the most basic form control.

## Quick Start

### Basic Usage

<div style="width:300px;">
    Input field: <r-input></r-input>
</div>

```html
<r-input></r-input>
```

## API Reference

### Properties

| Property      | Type      | Default  | Description                                      |
| ------------- | --------- | -------- | ------------------------------------------------ |
| `label`       | `string`  | `''`     | Input label for Material Design style experience |
| `placeholder` | `string`  | `''`     | Placeholder text                                 |
| `value`       | `string`  | `''`     | Input value                                      |
| `disabled`    | `boolean` | `false`  | Whether the input is disabled                    |
| `type`        | `string`  | `'text'` | Input type: `text`, `password`, `number`         |
| `icon`        | `string`  | `''`     | Input icon                                       |
| `name`        | `string`  | `''`     | Form field name for form submission              |
| `status`      | `string`  | `''`     | Input status: `error`, `warning`                 |
| `min`         | `number`  | `-`      | Minimum value for number input                   |
| `max`         | `number`  | `-`      | Maximum value for number input                   |
| `step`        | `number`  | `1`      | Step value for number input                      |

### Label Input `label`

Provides Material Design style input experience

<r-input label="Username"></r-input>

```html
<r-input label="Username"></r-input>
```

### Placeholder `placeholder`

Consistent with native `placeholder` attribute

<r-input placeholder="Enter username"></r-input>

```html
<r-input placeholder="Enter username"></r-input>
```

### Disabled State `disabled`

<r-input label="Username" disabled></r-input>

```html
<r-input label="Username" disabled></r-input>
```

### Input Value `value`

<r-input value="1234"></r-input>

```html
<r-input value="1234"></r-input>
```

### Icon `icon`

<r-input icon="user"></r-input>

```html
<r-input icon="user"></r-input>
```

### Input Types `type`

#### Password Input

<r-input icon="lock" type="password"></r-input>

```html
<r-input icon="lock" type="password"></r-input>
```

#### Number Input

<r-input type="number" min="-10" max="10" step="0.5"></r-input>

```html
<r-input type="number" min="-10" max="10" step="0.5"></r-input>
```

### Form Field Name `name`

```html
<r-input name="username" label="Username"></r-input>
```

### Status `status`

#### Error State

<r-input status="error" label="Username"></r-input>

```html
<r-input status="error" label="Username"></r-input>
```

#### Warning State

<r-input status="warning" label="Username"></r-input>

```html
<r-input status="warning" label="Username"></r-input>
```

## Events

### Change Event `onchange`

<r-input onchange="console.log(this.value)" label="Username"></r-input>

```html
<r-input onchange="handleChange(this.value)" label="Username"></r-input>
```

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', 'Username');
const handleChange = (value) => {
  console.log('Value changed:', value);
};
input.addEventListener('change', handleChange);
```

### Input Event `oninput`

<r-input oninput="console.log(this.value)" label="Username"></r-input>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', 'Username');
const handleInput = (value) => {
  console.log('Typing:', value);
};
input.addEventListener('input', handleInput);
```

## Best Practices

- **Labels**: Add meaningful labels to inputs
- **Placeholders**: Use placeholders for input hints
- **Icons**: Add relevant icons to enhance UX
- **Validation**: Use `status` property to show input state
- **Types**: Choose appropriate input types for content
