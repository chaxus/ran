# SyncHook

同步事件钩子类，用于实现发布-订阅模式。

## API

### SyncHook

#### 主要方法

| 方法       | 说明                         | 返回值          |
| ---------- | ---------------------------- | --------------- |
| `tap`      | 订阅事件                     | `this`          |
| `call`     | 触发事件                     | `this`          |
| `callSync` | 同步触发事件（支持异步回调） | `Promise<this>` |
| `once`     | 只订阅一次事件               | `this`          |
| `off`      | 取消订阅事件                 | `this`          |

## Example

### 基础用法

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

// 订阅事件
hook.tap('event1', () => {
  console.log('Event 1 triggered');
});

// 触发事件
hook.call('event1'); // 'Event 1 triggered'
```

### 传递参数

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

hook.call('greet', 'World'); // 'Hello, World!'
```

### 只订阅一次

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.once('onceEvent', () => {
  console.log('This will only fire once');
});

hook.call('onceEvent'); // 'This will only fire once'
hook.call('onceEvent'); // 不会触发
```

### 取消订阅

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

const callback = () => {
  console.log('Callback');
};

hook.tap('event', callback);
hook.call('event'); // 'Callback'

hook.off('event', callback);
hook.call('event'); // 不会触发
```

### 异步回调

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('asyncEvent', async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log('Async callback');
});

await hook.callSync('asyncEvent'); // 'Async callback'
```

## 注意事项

1. **同步执行**：`call` 方法同步执行所有回调函数。
2. **异步支持**：`callSync` 方法支持异步回调，会等待所有回调完成。
3. **事件管理**：内部使用 Map 和 Set 管理事件和回调。
4. **用途**：常用于事件系统、插件系统、中间件等场景。
