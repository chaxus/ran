# retain

覆盖浏览器的后退事件，用于拦截和处理浏览器返回操作。

## API

### retain

#### Return

无返回值（`void`）

#### Parameters

| 参数       | 说明                       | 类型       | 默认值 |
| ---------- | -------------------------- | ---------- | ------ |
| `callback` | 返回按钮被点击时的回调函数 | `Function` | `noop` |

## Example

### 基础用法

```js
import { retain } from 'ranuts';

retain(() => {
  console.log('用户点击了返回按钮');
  // 执行自定义逻辑，比如显示确认对话框
  if (confirm('确定要离开吗？')) {
    window.history.back();
  }
});
```

### 阻止返回

```js
import { retain } from 'ranuts';

retain(() => {
  // 阻止默认返回行为
  // 可以显示提示或执行其他操作
  alert('请先保存数据');
});
```

### 自定义返回逻辑

```js
import { retain } from 'ranuts';

retain(() => {
  // 保存数据后再返回
  saveData().then(() => {
    window.history.back();
  });
});
```

## 注意事项

1. **实现原理**：向 history 栈中推入一个历史记录，然后监听 `popstate` 事件来拦截返回操作。
2. **延迟监听**：使用 500ms 延迟来确保历史记录已正确推入。
3. **服务端安全**：在服务端环境（无 `window` 对象）时会静默处理，不会抛出错误。
4. **用途**：常用于表单页面，在用户返回时提示保存数据，或阻止未保存的返回操作。
