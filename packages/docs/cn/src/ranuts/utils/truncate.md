# truncate

把字符串截断到最大长度，用省略号标记截断处，对 Unicode 安全，而且"保留哪一端"这个选择本身就带有含义。

## 使用

```ts
import { truncate } from 'ranuts/utils';

truncate('the quick brown fox', 12); // 'the quick b…'

truncate('/Users/me/code/app/src/index.ts', { length: 20, position: 'start' });
// '…de/app/src/index.ts'

truncate('0xabcdef0123456789', { length: 11, position: 'middle' });
// '0xabc…56789'
```

## API

### `truncate(value, options)`

#### 参数

| 参数      | 说明                          | 类型                        | 默认值 |
| --------- | ----------------------------- | --------------------------- | ------ |
| `value`   | 要截断的字符串                | `string`                    | 必填   |
| `options` | 传一个数字相当于 `{ length }` | `TruncateOptions \| number` | 必填   |

#### `TruncateOptions`

| 字段       | 说明                           | 类型                           | 默认值  |
| ---------- | ------------------------------ | ------------------------------ | ------- |
| `length`   | 结果的最大长度，包含省略号本身 | `number`                       | —       |
| `position` | 保留哪一端，见下文             | `'end' \| 'start' \| 'middle'` | `'end'` |
| `ellipsis` | 截断处插入的标记               | `string`                       | `'…'`   |

`position` 决定保留哪一端，这个选择本身是有含义的：

- `'end'`（默认）保留开头，适合正文和标题。
- `'start'` 保留**结尾**，这正是文件路径想要的：`/Users/someone/work/…` 是读者已经知道的部分；`…/src/utils/str.ts` 才是他们需要的部分。
- `'middle'` 两端都保留，适合头尾都有意义的标识符，比如哈希值或账号。

#### 返回

`string`，长度不会超过 `length`。如果 `length` 比省略号本身还短，返回的是被截断的省略号，而不会溢出。

## 注意事项

1. **按 Unicode 码点切分，而不是 UTF-16 code unit。** 直接用 `value.slice(i)` 可能会切在代理对（surrogate pair）中间：任何超出基本多文种平面的字符（emoji、部分 CJK 扩展字符）在 UTF-16 里都占 2 个 code unit，切开后省略号旁边就会留下一个落单的代理项，渲染成乱码。`truncate` 按码点遍历，不会把多单元字符切开。
2. `value` 比 `length` 短时会原样返回，不会加上省略号。
3. 如果默认的 `'…'` 字符在你使用的字体里不可用，可以传入自定义的 `ellipsis`（比如 `'...'` 或 `'[cut]'`）。
