# parseChineseNumber / parseRomanNumber / parseEnglishNumber

把人写的数字转成阿拉伯数字：中文 `二十三` / `二零二四`、罗马 `XIV`、英文 `Three`。

三者共享同一约定：**无法完整解析就返回 `null`，绝不返回猜测值**。

## API

| 函数                              | 支持                                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `parseChineseNumber(value)`       | 数字（半角与全角）、`一二三…`、单位 `十百千万/萬亿/億`、简写 `廿卅卌`、大写 `壹贰叁…拾佰仟`，简繁通用 |
| `parseChineseNumberBigInt(value)` | 输入同 `parseChineseNumber`，返回精确的 `bigint`，没有上限                                            |
| `parseChineseNumberString(value)` | 同上，返回精确的十进制字符串（可直接 JSON 序列化）                                                    |
| `parseRomanNumber(value)`         | `IVXLCDM`，大小写皆可，只接受标准写法（`IV`、`IX`、`XCIX`；3999 以上可重复 `M`）                      |
| `parseEnglishNumber(value)`       | 数字、英文数词 `one`–`twenty`，再退回罗马数字                                                         |

相关字符串工具：`toHalfWidth(value)` / `toFullWidth(value)` 做全半角归一化，
`parseChineseNumber` 已内置调用。

## 示例

```js
import {
  parseChineseNumber,
  parseChineseNumberBigInt,
  parseChineseNumberString,
  parseRomanNumber,
  parseEnglishNumber,
  toHalfWidth,
} from 'ranuts';

parseChineseNumber('二十三'); // 23
parseChineseNumber('廿三'); // 23
parseChineseNumber('二零二四'); // 2024
parseChineseNumber('一百一'); // 110
parseChineseNumber('百'); // 100
parseChineseNumber('一亿两千万'); // 120000000
parseChineseNumber('一万亿'); // 1000000000000
parseChineseNumber('壹仟贰佰叁拾肆'); // 1234
parseChineseNumber('一百百'); // null —— 单位重复
parseChineseNumber('三萬'); // 30000
parseChineseNumber('第三章'); // null —— 请先截出编号段

parseChineseNumberBigInt('九千九百九十九万九千九百九十九亿九千九百九十九万九千九百九十九'); // 9999999999999999n
parseChineseNumberString('二零二四'); // '2024'

parseRomanNumber('MCMXCIV'); // 1994
parseRomanNumber('IC'); // null —— 应写作 XCIX
parseEnglishNumber('Three'); // 3
toHalfWidth('（1）'); // '(1)'
```

## 注意

1. **只传编号段**。`第三章` 返回 `null`，请先用你自己的模式把 `三` 截出来再解析。
2. **开头的裸单位按「一」个该单位计**——`十`/`百`/`千`/`万`/`亿` 分别是 10 / 100 / 1000 / 10000 / 1e8，`百万` / `千万` 是 1e6 / 1e7——所以 `十五` 是 15。除 `十` 外（`一百十` → 110），只有第一个字可以是裸单位。**`廿`/`卅`/`卌`** 是 20 / 30 / 40（`廿三` → 23）。
3. **节可以叠加**：`亿` 前面的整体是它的个数，所以 `一万亿` 是 1e12，`一千万亿` 是 1e15。单位重复或顺序颠倒（`一百百`、`千千`、`十十`、`万万`）返回 `null`。
4. **连续数字位累加**（`二零二四` → 2024）。**省略的尾数**补下一档单位（`一百一` → 110）；个位要写 `零`（`一百零一` → 101）。
5. **`parseEnglishNumber` 依次尝试数字、数词、罗马数字**。`twenty-one` 及以上未覆盖，
   需要的话自行扩展词表。
6. **超过 `Number.MAX_SAFE_INTEGER`（约 9e15）后 `number` 无法精确表示**，所以
   `parseChineseNumber` 和 `parseEnglishNumber` 的纯数字分支在这里返回 `null`。数值可能这么大时，
   用 `parseChineseNumberBigInt` 或 `parseChineseNumberString`。
7. **罗马数字必须是标准写法**。`VV`、`IC`、`IIX` 以及钟面上的 `IIII` 都返回 `null`，不会猜一个值。
