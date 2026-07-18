# Page Load Complete Events

## window.onload

## DOMContentLoaded

```js
document.addEventListener('DOMContentLoaded', fun);
```

## `<body onload="fun()">`

## readyState

```js
document.readyState;

document.onreadystatechange;
```

A document's `readyState` can be one of the following:

- loading. The document is still loading.
- interactive. The document has finished loading and has been parsed, but sub-resources such as images, stylesheets, and frames are still loading.
- complete. The document and all sub-resources have finished loading. This state indicates that the `load` event is about to fire.
