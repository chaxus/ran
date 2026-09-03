# buildOffsets / indexForOffset / segmentByRanges

「内容分块 + 标注记录在拼接后坐标系」的坐标换算。把高亮存成**全局偏移**而不是「第 N 块第 M 个字」，
重新分块后标注依然有效：改字号、改页宽、改分片大小，标注仍指向同一段文字。

## API

### buildOffsets(lengths)

前缀和：`offsets[i]` 是第 `i` 块之前所有内容的长度之和。

```js
buildOffsets([3, 5, 2]); // [0, 3, 8]
```

### indexForOffset(offsets, offset)

二分查找全局偏移落在第几块。越界会夹取到 `[0, offsets.length - 1]`，空数组返回 `0`，
返回值总是可以安全索引。

### segmentByRanges(text, chunkStart, ranges)

把一块文本切成「普通段 / 命中段」序列，供分段渲染（高亮、搜索命中、diff 上色）。

| 参数         | 说明                                   | 类型                        |
| ------------ | -------------------------------------- | --------------------------- |
| `text`       | 本块文本                               | `string`                    |
| `chunkStart` | 本块在全局坐标系里的起始偏移           | `number`                    |
| `ranges`     | 全局坐标系里的 `{ start, end, value }` | `readonly OffsetRange<T>[]` |

返回 `{ text, start, end, value }[]`，未被覆盖的段 `value` 为 `null`。顺序拼接必然还原
`text`，且至少返回一段。

## 示例

```js
import { buildOffsets, indexForOffset, segmentByRanges } from 'ranuts';

const offsets = buildOffsets(pages.map((p) => p.text.length));

// 这条笔记从第几页开始？
const pageIndex = indexForOffset(offsets, note.start);

// 渲染某一页及其高亮
const segments = segmentByRanges(
  pages[i].text,
  offsets[i],
  notes.map((n) => ({
    start: n.start,
    end: n.end,
    value: n,
  })),
);
segments.forEach((s) => container.append(s.value ? mark(s.text, s.value) : text(s.text)));
```

## 注意

1. **区间是半开的** `[start, end)`。
2. **重叠是被消解而不是合并**。区间按序消费，后者只取尚未被覆盖的部分，被完全吞没的直接丢弃。
   切点严格递增，不会产生意外的空段或重复文本。
3. **块外区间会被忽略**，部分重叠的会被裁剪，所以可以把整份标注列表传给每一块。
