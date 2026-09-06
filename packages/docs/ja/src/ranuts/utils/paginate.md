# paginateText

素のテキストを、決まった大きさの枠に収まるページへ切り分けます。読書アプリ、プロンプター、印刷用のプレビューなどに使います。

純粋な計算です。枠と文字の寸法を数値で受け取るだけで、DOM には一切触れません。入れ物の寸法をメインスレッドで一度測っておけば、あとは Worker でも、サーバーでも、テストの中でもページ分けできます。

## API

### paginateText(text, box, metrics, options?)

| パラメーター     | 説明                                                                      | 型                |
| ---------------- | ------------------------------------------------------------------------- | ----------------- |
| `text`           | もとのテキスト。`\r\n` と `\r` は `\n` に揃えられます                     | `string`          |
| `box`            | `{ width, height }`（px）                                                 | `TextBox`         |
| `metrics`        | `{ charWidth, lineHeight, narrowRatio? }`（px）                           | `TextGridMetrics` |
| `options.minBox` | これを下回る枠は、まだレイアウトされていないものとみなします。既定は `30` | `number`          |

`narrowRatio` は、ASCII 文字の送り幅を `charWidth` に対する割合で表したものです。既定は `0.5625`（9/16）です。

`{ pages, total, charsPerLine, linesPerPage, charsPerPage }` を返します。各ページは `{ text, start, end, index }` で、位置は揃えたあとのもとのテキストにおける値です。

## 使用例

```js
import { paginateText } from 'ranuts';

const { width, height } = container.getBoundingClientRect();
const result = paginateText(book, { width, height }, { charWidth: 18.4, lineHeight: 40 });

render(result.pages[0].text);
console.log(`${result.pages.length} ページ、1 行あたり ${result.charsPerLine} 文字`);
```

## 補足

1. **等幅の升目を前提にしています。** どの文字も 1 升ぶん（CJK・全角）か、その `narrowRatio` ぶん（ASCII）だけ進みます。等幅フォントならそのとおりで、CJK が主体の本文なら十分近い近似ですが、プロポーショナルなラテン文字に対する本物の字形処理の **代わりにはなりません**。
2. **ASCII の単語は割りません。** 単語が 1 行より長い場合を除き、ページが単語の途中で終わることはありません。長すぎる場合は割るしかありません。
3. **位置は途切れずつながります。** `pages[i].start === pages[i - 1].end` であり、各 `page.text` をつなげれば、揃えたあとのもとのテキストがそのまま再現されます。注釈を全体での位置として保存し、ページを組み直しても有効なままにできるのは、このおかげです。[segmentByRanges](./segment) を見てください。
4. **`minBox` より小さい枠では、ページを返しません。** さもないと、入れ物の寸法がまだ 0 の初回描画の最中にページ分けが走り、空回りします。

::: tip 1 ページより長い単語
URL、base64 の塊、ハイフンの長い連なりは、いずれも単語を構成する文字として数えられます。そうした連なりが 1 ページを超えて続くとき、送り先となる「次のページ」はもうないので、途中で断ち切ります。送り先へ回そうとすれば、カーソルはそのページの始まりまで巻き戻ってしまいます。ページは空のまま出てきて、ループは一歩も進みません。レイアウトが崩れるどころか、固まってしまいます。
:::
