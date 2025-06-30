# Button

Button component for triggering instant actions with multiple styles and states.

## Quick Start

### Basic Usage

<r-button>Button</r-button>

```html
<r-button>Button</r-button>
```

## API Reference

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `string` | `'default'` | Button type: `default`, `primary`, `warning`, `text` |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `icon` | `string` | `''` | Button icon name |
| `effect` | `boolean` | `true` | Whether to show click ripple effect |

### Button Types `type`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary">Primary Button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="warning">Warning Button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button type="text">Text Button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button>Default Button</r-button>
</div>

```html
<r-button type="primary">Primary Button</r-button>
<r-button type="warning">Warning Button</r-button>
<r-button type="text">Text Button</r-button>
<r-button>Default Button</r-button>
```

### Disabled State `disabled`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" disabled>Primary Button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="warning" disabled>Warning Button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button type="text" disabled>Text Button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button disabled>Default Button</r-button>
</div>

```html
<r-button type="primary" disabled>Primary Button</r-button>
<r-button type="warning" disabled>Warning Button</r-button>
<r-button type="text" disabled>Text Button</r-button>
<r-button disabled>Default Button</r-button>
```

### Icon Button `icon`

> 💡 **Tip**: For precise icon positioning, use the Icon component directly

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="default" icon="user">Default Button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" icon="home">Primary Button</r-button>
</div>

```html
<r-button type="default" icon="user">Default Button</r-button>
<r-button type="primary" icon="home">Primary Button</r-button>
```

### Effect Control `effect`

<r-button type="default" effect="false" icon="user">Default Button</r-button>
<r-button type="primary" effect="false" icon="home">Primary Button</r-button>

```html
<r-button type="default" effect="false" icon="user">Default Button</r-button>
<r-button type="primary" effect="false" icon="home">Primary Button</r-button>
```

## Events

```html
<r-button onclick="handleClick()">Click Me</r-button>

<script>
function handleClick() {
  console.log('Button clicked');
}
</script>
```

## Best Practices

- **Primary Actions**: Use `type="primary"`
- **Dangerous Actions**: Use `type="warning"`  
- **Secondary Actions**: Use `type="text"`
- **Disabled State**: Use `disabled` when actions unavailable
- **Icons**: Add relevant icons to enhance UX
