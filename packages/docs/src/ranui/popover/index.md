# Popover

Click/mouse to move into the element and pop up a bubbling card layer.

## Code demo

<r-popover>
    <r-button>popover</r-button>
    <r-content>
      <div>this is content</div>
    </r-content>
  </r-popover>

```xml
<r-popover>
    <r-button>popover</r-button>
    <r-content>
      <div>this is content</div>
    </r-content>
</r-popover>
```

## Attribute

### `trigger`

Trigger mode：

- `hover`

<r-popover trigger="hover">
    <r-button>hover</r-button>
    <r-content>
      <div>hover</div>
    </r-content>
  </r-popover>

```xml
<r-popover trigger="hover">
    <r-button>hover</r-button>
    <r-content>
      <div>hover</div>
    </r-content>
  </r-popover>
```

- `click`

<r-popover trigger="click">
    <r-button>click</r-button>
    <r-content>
      <div>click</div>
    </r-content>
  </r-popover>

```xml
<r-popover trigger="click">
    <r-button>click</r-button>
    <r-content>
      <div>click</div>
    </r-content>
  </r-popover>
```

### `placement`

Display location

- `bottom`

<r-popover trigger="hover" placement="bottom">
    <r-button>bottom</r-button>
    <r-content>
      <div>bottom</div>
    </r-content>
  </r-popover>

```xml
<r-popover trigger="hover" placement="bottom">
    <r-button>bottom</r-button>
    <r-content>
      <div>bottom</div>
    </r-content>
  </r-popover>
```

- `top`

<r-popover trigger="hover" placement="top">
    <r-button>top</r-button>
    <r-content>
      <div>top</div>
    </r-content>
  </r-popover>

```xml
<r-popover trigger="hover" placement="top">
    <r-button>top</r-button>
    <r-content>
      <div>top</div>
    </r-content>
  </r-popover>
```