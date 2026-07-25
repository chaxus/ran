# EventManager

以 `AbortController` 为底座的作用域事件注册表。

它解决的是「装上去的监听怎么全部摘下来」。`removeEventListener` 必须拿到与注册时**完全相同**的函数引用和 options 才生效 —— 中途包了一层箭头函数，就再也摘不掉了。反复挂载卸载的组件于是每个周期漏一个监听。`AbortController` 把这件事变成一次 `abort()`。

## 使用

### 在 Web Component 里

```ts
import { EventManager } from 'ranuts/utils';

class MyElement extends HTMLElement {
  private _events = new EventManager();

  connectedCallback() {
    this._events.on(this._input, 'input', this.handleInput).on(this, 'click', this.handleClick, { capture: true });
  }

  disconnectedCallback() {
    this._events.abort(); // 摘掉全部监听，并为下一次 connect 重置
  }
}
```

### 在普通页面代码里

```ts
function initSection(container: HTMLElement) {
  const scope = new EventManager();

  scope.on(input, 'input', handleSearch).delegate(container, '[data-action]', 'click', (ev, target) => {
    handleAction(target.getAttribute('data-action'));
  });

  return () => scope.abort(); // 区块销毁时调用
}
```

## API

### on

注册一个归属于该 manager 的监听。可链式调用。

#### 参数

| 参数      | 说明                                           | 类型                                     | 默认值 |
| --------- | ---------------------------------------------- | ---------------------------------------- | ------ |
| `target`  | 事件目标                                       | `EventTarget`                            | 必填   |
| `type`    | 事件名                                         | `string`                                 | 必填   |
| `handler` | 处理函数                                       | `EventListener`                          | 必填   |
| `options` | `addEventListener` 的 options（不含 `signal`） | `Omit<AddEventListenerOptions,'signal'>` | `-`    |

#### 返回

| 参数   | 说明                   | 类型           |
| ------ | ---------------------- | -------------- |
| `this` | manager 本身，便于链式 | `EventManager` |

### delegate

事件委托：只在 `parent` 上挂**一个**监听，事件来自匹配 `selector` 的后代时才触发 `handler`。可链式调用。

handler 拿到原始事件和命中的元素两个参数。

```ts
scope.delegate(list, '.item', 'click', (ev, item) => {
  console.log(item.getAttribute('data-id'));
});
```

#### 参数

| 参数       | 说明                                           | 类型                                     | 默认值 |
| ---------- | ---------------------------------------------- | ---------------------------------------- | ------ |
| `parent`   | 挂载单个监听的元素                             | `HTMLElement`                            | 必填   |
| `selector` | 后代需要匹配的选择器                           | `string`                                 | 必填   |
| `type`     | 事件名                                         | `string`                                 | 必填   |
| `handler`  | `(event, 命中元素) => void`                    | `Function`                               | 必填   |
| `options`  | `addEventListener` 的 options（不含 `signal`） | `Omit<AddEventListenerOptions,'signal'>` | `-`    |

#### 返回

| 参数   | 说明                   | 类型           |
| ------ | ---------------------- | -------------- |
| `this` | manager 本身，便于链式 | `EventManager` |

### abort

摘掉全部已注册的监听，并重置内部 `AbortController`。可以重复调用；之后的 `on()` / `delegate()` 从一个干净的作用域重新开始。

#### 返回

无返回值（`void`）

### signal

底层的 `AbortSignal`，需要时可以自己透传给 `addEventListener`。

| 参数     | 说明                       | 类型          |
| -------- | -------------------------- | ------------- |
| `signal` | 该 manager 的 abort signal | `AbortSignal` |
