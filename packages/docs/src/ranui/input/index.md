# Input

Entering content via mouse or keyboard is the most basic form field packaging.

## Code demo

<div style="width:300px;">
    Input field:<r-input></r-input>
</div>

```xml
<r-input></r-input>
```

## Attribute

### `label`

Provide an input experience similar to Metiral Design.

<r-input label="user"></r-input>

```html
<r-input label="user"></r-input>
```

### `placeholder`

Consistent with native 'placeholder'.

<r-input placeholder="user"></r-input>

```html
<r-input placeholder="user"></r-input>
```

### `disabled`

The input box can be disabled by disabled. After disabled, the events on the button become invalid.

<r-input label="user" disabled></r-input>

```html
<r-input label="user" disabled></r-input>
```

### `value`

Sets or returns the value of the 'value' property of the input box.

<r-input value="1234"></r-input>

### `type`

Currently support 'password', 'number' these types, set will appear additional 'ui' controls.

#### Password entry field

The password can be switched between plain text and ciphertext.

<r-input icon="lock" type="password"></r-input>

```html
<r-input icon="lock" type="password"></r-input>
```

### `icon`

You can set an 'icon' to represent the tag identifier.

<r-input icon="user"></r-input>

```html
<r-input icon="user"></r-input>
```

#### Digital input box

Numeric input box, similar to the native 'input[type=number]', support 'min', 'max', 'step' attributes, support keyboard up and down keys to switch numbers.

<r-input type="number" min="-10" max="10" step="0.5" ></r-input>

```html
<r-input type="number" min="-10" max="10" step="0.5"></r-input>
```

### name

Valid when associated with the form component, the field name collected when the form is submitted

### status

- error

Default color value: `#ff4d4f`

<div>
 <r-input status="error"></r-input>
</div>

```xml
<r-input status="error"></r-input>
```

- warning

Default color value:`#ff7875`

<div>
  <r-input status="warning"></r-input>
</div>

```xml
<r-input  status="warning"></r-input>
```

## `event`

Common callback events.

### onchange

Triggered when text changes.

<r-input onchange="console.log(this.value)"></r-input>

```html
<r-input onchange="func(this.value)"></r-input>
```

```js
const input = document.createElement('r-input');
input.setAttribute('label', 'home');
const func = (e) => {
  console.log(e);
};
input.addEventListener('change', func);
```

### oninput

Triggered when text changes.

<r-input oninput="console.log(this.value)"></r-input>

```js
const input = document.createElement('r-input');
input.setAttribute('label', 'home');
const func = (e) => {
  console.log(e);
};
input.addEventListener('input', func);
```

The e parameter structure of the event

![input method](../../../assets/ranui/input-input.jpg)
