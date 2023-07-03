# 页面加载完成后事件

## window.onload

## DOMContentLoaded

```js
document.addEventListener('DOMContentLoaded', fun)
```

## `<body onload="fun()">`

## readyState

```js
document.readyState

document.onreadystatechange
```

一个文档的 readyState 可以是以下之一：

- loading / 加载 。document 仍在加载。
- interactive / 互动。文档已经完成加载，文档已被解析，但是诸如图像，样式表和框架之类的子资源仍在加载。
- complete / 完成。T 文档和所有子资源已完成加载。状态表示 load 事件即将被触发。
