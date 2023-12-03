# Button

The button is used to start an instant action.

## Code demo

<r-button>Button</r-button>

```xml
 <r-button >Button</r-button>
```

## Attribute

### `type`

There are four types of buttons

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary">Primary button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="warning">Warning button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button type="text">Text button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button >Default button</r-button>
</div>

```xml
 <r-button type="primary">Primary button</r-button>
 <r-button type="warning">Warning button</r-button>
 <r-button type="text">Text button</r-button>
 <r-button >Default button</r-button>
```

### `disabled`

Adding the disabled attribute makes the button unavailable and changes the button style.

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" disabled>Primary button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="warning" disabled>Warning button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button type="text" disabled>Text button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button disabled>Default button</r-button>
</div>

```xml
 <r-button type="primary" disabled>Primary butto</r-button>
 <r-button type="warning" disabled>Warning button</r-button>
 <r-button type="text" disabled>Text button</r-button>
 <r-button disabled>Default button</r-button>
```

### `icon`

When you need to embed an Icon inside a Button, you can set the icon property or use the Icon component directly inside a Button.

If you want to control the specific position of the Icon, you can only use the Icon component directly, not the icon property.

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="default" icon="user">Default button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" icon="home">Primary button</r-button>
</div>

```xml
<r-button type="default" icon="user">Default button</r-button>
<r-button type="primary" icon="home">Primary button</r-button>
```

### 特效 effect

If you want a pure Button, you can add effect = false to block the water ripple effect when clicked

<r-button type="default" effect="fase" icon="user">Default button</r-button>
<r-button type="primary" effect="fase" icon="home">Primary button</r-button>

```xml
<r-button type="default" icon="user">Default button</r-button>
<r-button type="primary" icon="home">Primary button</r-button>
```
