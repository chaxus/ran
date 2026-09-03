# parseChineseNumber / parseRomanNumber / parseEnglishNumber

解析写给人看的数字：`第二十三章`、`Chapter XIV`、`Part Three`。

三者共享同一约定：**无法完整解析就返回 `null`，绝不返回猜测值**。这类解析通常用于
「这行是不是标题」的判断，一个错误的数字会污染整条序列校验。

## API

| 函数                        | 支持                                                        |
| --------------------------- | ----------------------------------------------------------- |
| `parseChineseNumber(value)` | 数字（半角与全角）、`一二三…`、单位 `十百千万/萬`，简繁通用 |
| `parseRomanNumber(value)`   | `IVXLCDM`，大小写皆可，支持减法记法（`IV`、`IX`）           |
| `parseEnglishNumber(value)` | 数字、英文数词 `one`–`twenty`，再退回罗马数字               |

相关字符串工具：`toHalfWidth(value)` / `toFullWidth(value)` 做全半角归一化，
`parseChineseNumber` 已内置调用。

## 示例

```js
import { parseChineseNumber, parseRomanNumber, parseEnglishNumber, toHalfWidth } from 'ranuts';

parseChineseNumber('二十三'); // 23
parseChineseNumber('一百零三'); // 103
parseChineseNumber('三萬'); // 30000
parseChineseNumber('第三章'); // null —— 请先截出编号段

parseRomanNumber('MCMXCIV'); // 1994
parseEnglishNumber('Three'); // 3
toHalfWidth('（１）'); // '(1)'
```

## 注意

1. **只传编号段**。`第三章` 返回 `null`，请先用你自己的模式把 `三` 截出来再解析。
2. **`十` 前面没有数字时按 1 处理**，所以 `十五` 是 15 而不是 5。
3. **`parseEnglishNumber` 依次尝试数字、数词、罗马数字**。`twenty-one` 及以上未覆盖，
   需要的话自行扩展词表。
