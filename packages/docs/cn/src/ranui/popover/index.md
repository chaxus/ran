# Popover 气泡卡片

点击/鼠标移入元素，弹出气泡式的卡片浮层。

## 代码演示

<r-popover>
    <r-button style="display:inline-block">popover</r-button>
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

## 属性

### `trigger`

触发方式

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

展示的位置

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
