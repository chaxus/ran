# Icon 图标

语义化的矢量图形

## 代码演示

<div style='display:flex'>
     <r-icon name="lock" size="50" ></r-icon>
     <r-icon name="eye" size="50" ></r-icon>
     <r-icon name="user" size="50" ></r-icon>
</div>

```xml
 <r-icon name="lock"  ></r-icon>
 <r-icon name="eye"  ></r-icon>
 <r-icon name="user"  ></r-icon>
```

## 属性

### 名称`name`

根据名称选择不同的图标

<div style='display:flex'>
 <r-icon name="lock" size="50" ></r-icon>
 <r-icon name="eye" size="50" ></r-icon>
 <r-icon name="user" size="50" ></r-icon>
</div>

```html
<r-icon name="lock"></r-icon>
<r-icon name="eye"></r-icon>
<r-icon name="user"></r-icon>
```

### 尺寸`size`

<div style='display:flex;align-items: flex-end;'>
 <r-icon name="lock" size="30" ></r-icon>
 <r-icon name="lock" size="50" ></r-icon>
 <r-icon name="lock" size="70" ></r-icon>
</div>

```html
<r-icon name="lock" size="30"></r-icon>
<r-icon name="lock" size="50"></r-icon>
<r-icon name="lock" size="70"></r-icon>
```

### 颜色`color`

<div style='display:flex'>
 <r-icon name="lock" size="50" color="red" ></r-icon>
 <r-icon name="lock" size="50" color="#1E90FF" ></r-icon>
 <r-icon name="lock" size="50" color="#F44336" ></r-icon>
 <r-icon name="lock" size="50" color="#3F51B5" ></r-icon>
</div>

```html
<r-icon name="lock" size="50" color="red"></r-icon>
<r-icon name="lock" size="50" color="#1E90FF"></r-icon>
<r-icon name="lock" size="50" color="#F44336"></r-icon>
<r-icon name="lock" size="50" color="#3F51B5"></r-icon>
```

### 旋转`spin`

设置 spin 开启旋转，传入数字控制旋转的速度，数字越小旋转越快

<div style='display:flex'>
 <r-icon name="loading" size="50" color="#1E90FF" spin='0.7'></r-icon>
 <r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
 <r-icon name="loading" size="50" color="#1E90FF" spin='5'></r-icon>
</div>

```html
<r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
```

## 图标列表

<div style="display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-flow: row wrap;" id="icon-list"></div>

<script>
const createIconList = () => {
  setTimeout(() => {
    const list = ['add-user', 'book',
    'check-circle', 'close-circle',
    'eye-close', 'eye',
    'info-circle', 'loading',
    'lock', 'message',
    'power-off', 'setting',
    'team', 'unlock',
    'user']
    if (typeof document !== "undefined") {
      const dom = document.getElementById('icon-list')
      list.forEach(item => {
        const container = document.createElement('div')
        container.style.setProperty('display', 'flex')
        container.style.setProperty('align-items', 'center')
        container.style.setProperty('margin', '15px')
        container.style.setProperty('justify-content', 'center')
        container.style.setProperty('flex-flow', 'column nowrap')
        const icon = document.createElement('r-icon')
        icon.setAttribute('name', item)
        icon.setAttribute('size', "50")
        container.appendChild(icon)
        const span = document.createElement('span')
        span.innerHTML = item
        container.appendChild(span)
        dom?.appendChild(container)
      })
    }
  }, 0)
}
createIconList()
</script>
