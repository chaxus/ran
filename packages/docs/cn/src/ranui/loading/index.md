# Loading

一些好看的 loading

## Code demo

<r-loading name="circle"></r-loading>

```xml
<r-loading name="circle"></r-loading>
```

## 属性

### `name`

这里有很多好看的 loading，可供选择

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="double-bounce"></r-loading>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
    <r-loading name="rotate"></r-loading>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
     <r-loading name="stretch"></r-loading>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;width:80px;height:80px">
     <r-loading name="cube"></r-loading>
</div>

```xml
<r-loading name="double-bounce"></r-loading>
<r-loading name="rotate"></r-loading>
<r-loading name="stretch"></r-loading>
<r-loading name="cube"></r-loading>
```

## Loading list

<div style="display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-flow: row wrap;" id="loading-list"></div>

<script>
const createLoadingList = () => {
  setTimeout(() => {
    const list = [
      'double-bounce', 'rotate','stretch', 'cube','dot', 'triple-bounce','scale-out', 'circle'
      ]
    if (typeof document !== "undefined") {
      const dom = document.getElementById('loading-list')
      const com = document.createElement('div')
      com.style.setProperty('display', 'flex')
      com.style.setProperty('flex-flow', 'row wrap')
      com.style.setProperty('align-items', 'center')
      com.style.setProperty('justify-content', 'flex-start')
      list.forEach(item => {
        const container = document.createElement('div')
        container.style.setProperty('display', 'flex')
        container.style.setProperty('height', '120px')
        container.style.setProperty('width', '120px')
        container.style.setProperty('align-items', 'center')
        container.style.setProperty('margin', '8px')
        container.style.setProperty('justify-content', 'flex-end')
        container.style.setProperty('flex-flow', 'column nowrap')
        const loading = document.createElement('r-loading')
        loading.setAttribute('name', item)
        container.appendChild(loading)
        const span = document.createElement('span')
        span.style.setProperty('font-size', '14px')
        span.style.setProperty('color', 'gray')
        span.innerHTML = item
        container.appendChild(span)
        com?.appendChild(container)
      })
      dom?.appendChild(com)
    }
  }, 0)
}
createLoadingList()
</script>
