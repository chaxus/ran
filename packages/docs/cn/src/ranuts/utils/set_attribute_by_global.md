# setAttributeByGlobal

给全局对象（`window` 或 `global`）添加属性。

## API

### setAttributeByGlobal

#### Return

无返回值（`void`）

#### Parameters

| 参数    | 说明   | 类型     | 默认值 |
| ------- | ------ | -------- | ------ |
| `name`  | 属性名 | `string` | 无     |
| `value` | 属性值 | `any`    | 无     |

## Example

### 基础用法

```js
import { setAttributeByGlobal } from 'ranuts';

setAttributeByGlobal('myGlobalVar', 'hello');
console.log(window.myGlobalVar); // 'hello'
```

### 设置函数

```js
import { setAttributeByGlobal } from 'ranuts';

setAttributeByGlobal('myFunction', () => {
  console.log('Global function called');
});

window.myFunction(); // 'Global function called'
```

### 跨环境兼容

```js
import { setAttributeByGlobal } from 'ranuts';

// 在浏览器环境设置到 window
// 在 Node.js 环境设置到 global
setAttributeByGlobal('appConfig', { apiUrl: 'https://api.example.com' });
```

## 注意事项

1. **环境检测**：自动检测环境，在浏览器中设置到 `window`，在 Node.js 中设置到 `global`。
2. **全局污染**：会修改全局对象，可能导致命名冲突，谨慎使用。
3. **类型安全**：TypeScript 中可能需要类型声明才能正确识别。
4. **用途**：常用于设置全局配置、暴露 API 给全局使用等场景。
