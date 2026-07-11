# Icon

Semantic vector graphics

> **Use when** you need a named, resizable, recolorable vector icon (with an optional spin animation) inline in your UI — `<r-icon>` renders it from a built-in icon set by `name`.

## Code demo

<Demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</Demo>

```xml
 <r-icon name="lock"  ></r-icon>
 <r-icon name="eye"  ></r-icon>
 <r-icon name="user"  ></r-icon>
```

## Attribute

### `name`

Select a different icon based on the name

<Demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</Demo>

```html
<r-icon name="lock"></r-icon>
<r-icon name="eye"></r-icon>
<r-icon name="user"></r-icon>
```

### `size`

<Demo align="end">
  <r-icon name="lock" size="30"></r-icon>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="lock" size="70"></r-icon>
</Demo>

```html
<r-icon name="lock" size="30"></r-icon>
<r-icon name="lock" size="50"></r-icon>
<r-icon name="lock" size="70"></r-icon>
```

### `color`

<Demo>
  <r-icon name="lock" size="50" color="red"></r-icon>
  <r-icon name="lock" size="50" color="#1E90FF"></r-icon>
  <r-icon name="lock" size="50" color="#F44336"></r-icon>
  <r-icon name="lock" size="50" color="#3F51B5"></r-icon>
</Demo>

```html
<r-icon name="lock" size="50" color="red"></r-icon>
<r-icon name="lock" size="50" color="#1E90FF"></r-icon>
<r-icon name="lock" size="50" color="#F44336"></r-icon>
<r-icon name="lock" size="50" color="#3F51B5"></r-icon>
```

### `spin`

Set spin to turn on the rotation, and pass in a number to control the rotation speed. The smaller the number, the faster the rotation

<Demo>
  <r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
</Demo>

```html
<r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
```

## Icon list

Click any icon to copy its markup.

<IconGallery />
