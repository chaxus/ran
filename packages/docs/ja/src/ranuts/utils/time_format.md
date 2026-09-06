# 時間の書式

画面に出てくる時間には三つの姿があり、それを混同するのが混乱のいつもの元です。`ranuts` はそれぞれに専用の関数を用意しています。

| 読み手が知りたいこと               | 関数                                   | 出力例                |
| ---------------------------------- | -------------------------------------- | --------------------- |
| これは _いつ_ 起きたのか（正確に） | [`formatDate`](./timestamp_to_time.md) | `2026-07-25 14:05:09` |
| これは _どれだけの長さ_ か         | `formatDuration`                       | `01:01:01`            |
| どれくらい _前_ のことか           | `formatRelative`                       | `3 days ago`、`5m`    |

## formatDuration

経過した**秒数**を、コロン区切りの時計表記（メディアプレーヤーが再生位置に使うあの形）にします。`mm:ss` で、1 時間を超えると `hh:mm:ss` に広がります。

#### パラメーター

| パラメーター | 説明                            | 型       | 既定値 |
| ------------ | ------------------------------- | -------- | ------ |
| `seconds`    | 経過秒数。負の値は 0 に丸めます | `number` | 必須   |

#### Returns

`string`: 長さの文字列。入力が有限の数値でなければ `''`。

```js
import { formatDuration } from 'ranuts/utils';

formatDuration(0); // '00:00'
formatDuration(65); // '01:05'
formatDuration(3661); // '01:01:01'
formatDuration(NaN); // ''
```

`NaN` に空文字を返すのは意図的です。プレーヤーはメタデータの読み込み前に `video.duration` を尋ねて `NaN` を受け取りますが、その場面では `NaN:NaN` と出すより空欄のほうが読みやすいからです。

::: tip 名前が変わりました
この関数はかつて `timeFormat` という名前でした。その名前は非推奨の別名として残っていて挙動もまったく同じですが、三つある時間表記の _どれ_ を作るのかが名前から分かりませんでした。
:::

## formatRelative

ある時点を別の時点から見て言い表します。「3 日前」「2 時間後」といった具合です。

各言語のローカライズは、プラットフォーム側の [`Intl.RelativeTimeFormat`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) に任せます。2020 年以降どの主要ブラウザーにも入っていて、言語ごとの複数形や語形変化の規則をすでに知っているからです。`formatRelative` が受け持つのは `Intl` があえて手を出さない部分、つまり差を _どの単位_ で言い表すかの判断だけです。

`Intl` 自身と同じく、返すのは**ひとつ**の単位だけです。3 日と 6 時間の差は「3 日前」であって、「3 日と 6 時間前」にはなりません。

#### パラメーター

| パラメーター | 説明             | 型                         | 既定値 |
| ------------ | ---------------- | -------------------------- | ------ |
| `value`      | 言い表したい時点 | `number \| string \| Date` | 必須   |
| `options`    | 下記参照         | `FormatRelativeOptions`    | `{}`   |

| オプション | 説明                                                                        | 型                         | 既定値             |
| ---------- | --------------------------------------------------------------------------- | -------------------------- | ------------------ |
| `now`      | 差を測る基準                                                                | `number \| string \| Date` | 現在時刻           |
| `locale`   | BCP 47 のタグ（複数可）。`compact` スタイルでは無視されます                 | `string \| string[]`       | 実行環境のロケール |
| `style`    | `'long' \| 'short' \| 'narrow' \| 'compact'`                                | `RelativeStyle`            | `'long'`           |
| `numeric`  | `'auto'` は `yesterday` のような言い回しに置き換え、`'always'` は数字のまま | `'always' \| 'auto'`       | `'auto'`           |

#### Returns

`string` — 言い表した文字列。どちらかの時点を解釈できなければ `''`。

```js
import { formatRelative } from 'ranuts/utils';

const twoHoursAgo = Date.now() - 2 * 3600_000;

formatRelative(twoHoursAgo); // '2 hours ago'
formatRelative(twoHoursAgo, { style: 'short' }); // '2 hr. ago'
formatRelative(twoHoursAgo, { locale: 'zh-CN' }); // '2 小时前'
formatRelative(Date.now() + 60_000); // 'in 1 minute'
formatRelative(Date.now() - 86_400_000); // 'yesterday'
formatRelative(Date.now() - 86_400_000, { numeric: 'always' }); // '1 day ago'
```

### compact スタイル

`compact` は、フィードやリストの項目の隣に並ぶ、あの詰まったバッジ表記です。

```js
formatRelative(Date.now() - 30_000, { style: 'compact' }); // '30s'
formatRelative(Date.now() - 5 * 60_000, { style: 'compact' }); // '5m'
formatRelative(Date.now() - 3 * 3600_000, { style: 'compact' }); // '3h'
formatRelative(Date.now() - 2 * 86_400_000, { style: 'compact' }); // '2d'
```

::: warning 前後の向きは表しません
`compact` は大きさだけなので、未来の時刻も過去の時刻とまったく同じ見た目になります（どちらも `5m`）。過去の出来事が並ぶフィード向けの表記です。読み手が過去と未来を区別する必要がある場所では、ほかのスタイルを使ってください。
:::

## parseVttTimestamp / parseVttCueTiming

WebVTT の字幕タイミング、つまり `.vtt` ファイルの `hh:mm:ss.mmm --> hh:mm:ss.mmm` という行を解釈します。

`parseVttTimestamp` はタイムスタンプひとつ（`hh:` は省略可）を秒に直します。`parseVttCueTiming` はキューのタイミング行まるごと、つまり `-->` で区切られた両側を `{ start, end }` に直し、末尾に付くキュー設定（`align:start line:0` など）は読み飛ばします。

```js
import { parseVttTimestamp, parseVttCueTiming } from 'ranuts/utils';

parseVttTimestamp('00:00:05.000'); // 5
parseVttTimestamp('01:05.250'); // 65.25
parseVttTimestamp('not a timestamp'); // undefined

parseVttCueTiming('00:00:00.000 --> 00:00:05.000'); // { start: 0, end: 5 }
parseVttCueTiming('00:00:05.000 --> 00:00:10.000 align:start line:0'); // { start: 5, end: 10 }
```

どちらも入力が形に合わなければ例外ではなく `undefined` を返すので、字幕ファイルの中に壊れた行があっても、解析全体を止めずにその行だけ飛ばせます。

## 補足

1. **単位の選び方**: `formatRelative` は差が実際に満たすいちばん粗い単位を選び、その中で丸めます。丸めた結果が次の単位の入り口に届いたとき（59.6 分が「60 分」になるなど）は単位を繰り上げるので、「1 時間前」と読めます。
2. **符号を分けて丸める**: 大きさのほうを丸めてから符号を戻します。JavaScript では `Math.round(-1.5)` が `-1` になるため、そうしないと 90 分前は「1 時間前」なのに 90 分後は「2 時間後」になってしまうからです。
3. **フォーマッターの使い回し**: `Intl.RelativeTimeFormat` のインスタンスはロケール・スタイル・numeric の組み合わせごとにキャッシュされます。100 件の時刻を並べるリストでも、作られるフォーマッターは 100 個ではなく 1 個です。
4. **代替の挙動**: `Intl.RelativeTimeFormat` がない実行環境では、例外を投げずに compact 表記へ切り替わります。
