# formatJson

格式化 JSON。可传对象，也可传 JSON 字符串重新排版。

## API

### formatJson(value, onError?, indent?)

| 参数      | 说明                               | 类型                 | 默认值 |
| --------- | ---------------------------------- | -------------------- | ------ |
| `value`   | 对象，或 JSON 字符串（容忍单引号） | `string \| object`   | 必填   |
| `onError` | 解析/序列化出错时的回调            | `(e: Error) => void` | 空函数 |
| `indent`  | 每级缩进空格数                     | `number`             | `4`    |

返回格式化后的字符串，无法解析时返回 `''`。

## 示例

```js
import { formatJson } from 'ranuts';

formatJson({ a: 1, b: [2, 3] });
formatJson("{'a': 1}"); // 容忍单引号
formatJson({ a: 1 }, undefined, 2); // 2 空格缩进
formatJson('nope', (e) => console.warn(e)); // 返回 '' 并把错误交给回调
```

## 注意

1. **字符串入参会被重新解析而不是原样输出**，既做了校验也统一了排版，而不是信任调用方原本的空格。
2. **错误只上报不抛出** —— 非法 JSON、循环引用、`JSON.stringify` 无法表示的值都返回 `''` 并触发 `onError`。

::: warning 0.3 重写
此前是一个约 90 行的手写格式化器：先用正则在每个大括号、方括号、逗号两侧注入换行，
再靠「逐行数引号数量」去还原被破坏的字符串字面量。它处理不了转义引号，也会把**字符串值内部**的
大括号和逗号当成结构，于是 `{ css: 'a { color: red, }' }` 会被打乱。现在改为在 `JSON.stringify`
前加一层宽松解析 —— 正确，且快了几个数量级。输出排版与 `JSON.stringify` 一致，不再是原来那套自定义布局。
:::
