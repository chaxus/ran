# paginateText

把纯文本切成适配固定盒子的页，阅读器、提词器、打印预览都是这个形状。

纯算术：盒子尺寸与排版度量都以数字传入，全程不碰 DOM。主线程量一次容器，之后在 Worker、
服务端或测试里都能分页。

## API

### paginateText(text, box, metrics, options?)

| 参数             | 说明                                               | 类型              |
| ---------------- | -------------------------------------------------- | ----------------- |
| `text`           | 源文本；`\r\n` / `\r` 会先归一成 `\n`              | `string`          |
| `box`            | `{ width, height }`，单位 px                       | `TextBox`         |
| `metrics`        | `{ charWidth, lineHeight, narrowRatio? }`，单位 px | `TextGridMetrics` |
| `options.minBox` | 小于此值视为容器尚未布局，默认 `30`                | `number`          |

`narrowRatio` 是 ASCII 字符相对 `charWidth` 的步进比例，默认 `0.5625`（9/16）。

返回 `{ pages, total, charsPerLine, linesPerPage, charsPerPage }`，每页为
`{ text, start, end, index }`，偏移是相对归一化后源文本的。

## 示例

```js
import { paginateText } from 'ranuts';

const { width, height } = container.getBoundingClientRect();
const result = paginateText(book, { width, height }, { charWidth: 18.4, lineHeight: 40 });

render(result.pages[0].text);
console.log(`${result.pages.length} 页，每行 ${result.charsPerLine} 字`);
```

## 注意

1. **它假定等宽网格**：每个字符要么占一格（CJK、全角），要么占 `narrowRatio` 格（ASCII）。
   对等宽字体是精确的，对以中文为主的正文也足够接近，但**不能**替代比例西文的真实字形排版。
2. **ASCII 单词保持完整**。除非单词本身比一行还长（那只能硬切），否则页尾不会切在词中间。
3. **偏移连续**：`pages[i].start === pages[i - 1].end`，把所有 `page.text` 拼起来逐字还原
   归一化后的源文本。这正是「把标注存成全局偏移、重新分页后依然有效」的前提，
   见 [segmentByRanges](./segment)。
4. **盒子小于 `minBox` 时返回空**。否则首屏容器还是 0 时去分页会空转。

::: tip 比整页还长的单词
长 URL、base64 串、一整行连字符，这些都算单词字符。当这种连续串超过整页时，
没有「下一页」可以挪，只能硬切。若坚持挪，游标会退回本页起点：这一页产出为空、
外层循环永远不前进，那是卡死，不是排版难看。
:::
