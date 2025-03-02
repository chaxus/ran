# Icon

Semantic vector graphics

## Code demo

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

## Attribute

### `name`

Select a different icon based on the name

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

### `size`

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

### `color`

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

### `spin`

Set spin to turn on the rotation, and pass in a number to control the rotation speed. The smaller the number, the faster the rotation

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

## Icon list

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
    'user','more','plus','search','menu','sort']
    if (typeof document !== "undefined") {
      const dom = document.getElementById('icon-list')
      const com = document.createElement('div')
      com.style.setProperty('display', 'grid')
      com.style.setProperty('grid-template-columns', 'repeat(3, 200px)')
      com.style.setProperty('grid-template-rows', 'repeat(3, 200px);')
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
        com?.appendChild(container)
      })
      dom?.appendChild(com)
    }
  }, 0)
}
createIconList()
</script>
