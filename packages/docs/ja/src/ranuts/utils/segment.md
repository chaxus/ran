# buildOffsets / indexForOffset / segmentByRanges

「中身は塊に分かれているが、注釈はつなげた全文に対して保存する」という場面のための座標計算です。ハイライトを「N 番目の塊の M 文字目」ではなく **全体での位置** として保存しておけば、塊の切り直しに耐えます。フォントの大きさ、ページの幅、分割の粒度を変えても、注釈は同じ語を指したままです。

## API

### buildOffsets(lengths)

累積和です。`offsets[i]` は、`i` 番目の塊より前にあるものすべての長さの合計です。

```js
buildOffsets([3, 5, 2]); // [0, 3, 8]
```

### indexForOffset(offsets, offset)

全体での位置がどの塊に入るかを二分探索で求めます。範囲の外の位置は `[0, offsets.length - 1]` に収められ、空の配列なら `0` を返します。返る値は、そのまま添字として使っても必ず安全です。

### segmentByRanges(text, chunkStart, ranges)

ひとつの塊を、素の部分と一致した部分に切り分けます。区切りごとに描き分けたいとき（ハイライト、検索の一致、差分の色分け）に使います。

| パラメーター | 説明                                         | 型                          |
| ------------ | -------------------------------------------- | --------------------------- |
| `text`       | この塊のテキスト                             | `string`                    |
| `chunkStart` | この塊の、全体での開始位置                   | `number`                    |
| `ranges`     | 全体の座標で表した `{ start, end, value }[]` | `readonly OffsetRange<T>[]` |

`{ text, start, end, value }[]` を返します。どの範囲にも覆われていない部分では `value` が `null` になります。切り分けたものをつなげれば必ずもとの `text` に戻りますし、切れ端が少なくともひとつは返ります。

## 使用例

```js
import { buildOffsets, indexForOffset, segmentByRanges } from 'ranuts';

const offsets = buildOffsets(pages.map((p) => p.text.length));

// この注釈はどのページから始まるか
const pageIndex = indexForOffset(offsets, note.start);

// 1 ページぶんを、ハイライトつきで描く
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

## 補足

1. **範囲は半開区間** `[start, end)` です。
2. **重なりは併合ではなく、切り分けで解きます。** 範囲は順に処理され、あとの範囲は、まだ覆われていない部分だけを取ります。前の範囲にすっかり飲み込まれたものは捨てられます。切れ目は必ず増えていくので、うっかり空になった切れ端や、重複した切れ端は生まれません。
3. **塊の外にある範囲は無視され**、一部だけ重なるものは切り詰められます。ですから、注釈の一覧をまるごとどの塊にも渡して構いません。
