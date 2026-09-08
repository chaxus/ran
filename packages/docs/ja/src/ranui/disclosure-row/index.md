---
description: 'ranui の DisclosureRow（<r-disclosure-row>）は「タイトル · 概要」を 1 行にまとめ、開くと本文を見せる行です。裏の処理が走っているあいだは、行の上を光が流れます。'
---

# DisclosureRow

`[先頭] タイトル · 概要` を 1 行に収め、開くと本文を見せる外枠です。`<r-reasoning>` と `<r-tool-card>` が共有している行なので、両方が並ぶ会話ログでも開閉の語彙がふたつに分かれません。

> **こんなときに**：もっと大きな何か（ツール呼び出し、思考の連なり、ログのまとまり）を代表する短い 1 行があり、その詳細は求められるまで隠しておきたいとき。

## クイックスタート

### 基本的な使い方

<ran-demo column>
  <r-disclosure-row heading="ファイルを読む" summary="packages/ranui/index.ts" expandable>
    <div style="padding:8px 0">行が開いているあいだ、本文が現れます。</div>
  </r-disclosure-row>
</ran-demo>

```html
<r-disclosure-row heading="ファイルを読む" summary="packages/ranui/index.ts" expandable>
  <div>行が開いているあいだ、本文が現れます。</div>
</r-disclosure-row>
```

**heading は幅の決まった左半分**、**summary は溢れを省略する右半分**です。だから概要がどれだけ長くても、行を縦に並べたときに同じ背骨で揃います。概要が空なら、区切りの記号も一緒に消えます。

### 処理が走っているあいだ

`busy` は行の上に光の帯を流します。スピナーは「どこかで何かが起きている」ことしか示しませんが、行の上を流れる光は、どの行がまだ働いているのかを指し示します。

<ran-demo column>
  <r-disclosure-row heading="テストを実行" summary="2351 件成功" busy expandable></r-disclosure-row>
  <r-disclosure-row heading="テストを実行" summary="2351 件成功" expandable></r-disclosure-row>
</ran-demo>

### 先頭のインジケーターつき

`leading` スロットと山形の記号はひとつのグリッドセルを共有しているので、両者が入れ替わってもレイアウトの費用はゼロで、見出しがポインターの下でずれることもありません。

`leading` に何も入れていなければ、山形の記号はずっと見えたままです。この行が開くことを読者に伝える印は、それしかないからです。先頭に内容があるときは、山形の記号はホバー時・フォーカス時・開いているあいだに現れ、それ以外のときは状態のインジケーターが見えています。

<ran-demo column>
  <r-disclosure-row heading="ビルド" summary="4.2 秒で失敗" tone="error" expandable>
    <r-state-dot slot="leading" state="error"></r-state-dot>
    <div style="padding:8px 0">バンドルがサイズ上限を超えました。</div>
  </r-disclosure-row>
</ran-demo>

```html
<r-disclosure-row heading="ビルド" summary="4.2 秒で失敗" tone="error" expandable>
  <r-state-dot slot="leading" state="error"></r-state-dot>
  <div>バンドルがサイズ上限を超えました。</div>
</r-disclosure-row>
```

## API リファレンス

### プロパティ

| プロパティ   | 属性         | 型        | 既定値  | 説明                                                                   |
| ------------ | ------------ | --------- | ------- | ---------------------------------------------------------------------- |
| `heading`    | `heading`    | `string`  | `''`    | 行の、幅の決まった左半分。                                             |
| `summary`    | `summary`    | `string`  | `''`    | 溢れを省略する右半分。空にすると区切りの記号も一緒に消えます。         |
| `open`       | `open`       | `boolean` | `false` | 本文を見せるかどうか。属性に反映されるので `:has([open])` が効きます。 |
| `expandable` | `expandable` | `boolean` | `false` | 開くに値する本文があるかどうか。                                       |
| `busy`       | `busy`       | `boolean` | `false` | この行が代表する処理がまだ走っているかどうか。                         |
| `tone`       | `tone`       | `string`  | `''`    | `error` は概要に色を付けます。それ以外は通常の色調です。               |
| `name`       | `name`       | `string`  | `''`    | 行をまとめ、ひとつを開くとほかが閉じるようにします。                   |
| `sheet`      | `sheet`      | `string`  | `''`    | シャドウルートに注入する CSS。                                         |

::: warning 属性は `heading` であって `title` ではありません
`title` はネイティブの `HTMLElement` の属性で、ブラウザーがツールチップとして描画します。だから見出しにこれを使うコンポーネントは、どのインスタンスにも「画面にすでにある文字をそのまま繰り返すツールチップ」を生やしてしまい、一度付いたらそれを止める手立てはありません。`<r-card>` と `<r-modal>` も同じ理由で同じ名前替えをしています。
:::

### イベント

| イベント                 | detail              | 発火のしかた                       | 説明                             |
| ------------------------ | ------------------- | ---------------------------------- | -------------------------------- |
| `disclosurebeforetoggle` | `{ open: boolean }` | バブリング、composed、キャンセル可 | 行がこれから開く／閉じるところ。 |
| `disclosuretoggle`       | `{ open: boolean }` | バブリング、composed               | 行が開いた／閉じた。             |

::: warning イベントは `disclosuretoggle` であって `toggle` ではありません
`toggle` は `<details>` が発火するもので、その `ToggleEvent` は `detail` ではなく `oldState` / `newState` を持ちます。プラットフォームの名前で型を付けたリスナーは、その中に何も見つけられません。状態は要素から読んでください：`row.open` です。
:::

```js
row.addEventListener('disclosuretoggle', () => {
  console.log(row.open ? 'opened' : 'closed');
});
```

`disclosurebeforetoggle` が先に発火し、拒否できます。これがあるおかげで「最初に開かれたときに本文を取ってくる」「編集が未保存のあいだは折りたたませない」を書き表せます。プラットフォームに同等のものはありません。`<details>` は事後の `toggle` しか発火せず、キャンセル可能な `beforetoggle` の要望はいまも未解決です。

```js
row.addEventListener('disclosurebeforetoggle', async (event) => {
  if (!event.detail.open || row.dataset.loaded) return;
  event.preventDefault(); // 本文が揃うまで閉じたままにする
  row.append(await fetchBody());
  row.dataset.loaded = 'true';
  row.open = true;
});
```

発火するのは押されたときだけです。プログラムからの `row.open = true` はアプリケーション自身が考えを変えただけで、尋ねる相手がいません。

### 一度にひとつだけ開く

`name` は、`<details>` の `name` と同じように行をまとめます。ひとつを開けば、ほかが閉じます。まとまりの範囲は文書全体で、行同士が兄弟である必要はありません。

```html
<r-disclosure-row name="run" heading="Install" expandable>…</r-disclosure-row>
<r-disclosure-row name="run" heading="Build" expandable>…</r-disclosure-row>
<r-disclosure-row name="run" heading="Test" expandable>…</r-disclosure-row>
```

### アクセシビリティ

行がコントロールになるのは、開くものがあるときだけです。`expandable` が付いた行は `role="button"`、タブ停止、`aria-expanded`、そして本文を指す `aria-controls` を持ちます。付いていない行はそのどれも持ちません。ただのテキスト行をボタンだと知らせれば、何も起きない押下を誘ってしまうからです。`busy` は `aria-busy` を立てるので、光の帯だけが「まだ動いている」合図ではなくなります。

折りたたまれた本文は、アニメーションできるように、取り除かれるのではなく切り取られます。あわせて `inert` になり、中身は `content-visibility: hidden` で読み飛ばされるので、閉じているあいだはタブ順序からも描画の経路からも外れます。

行の高さは 24px で、これは WCAG 2.5.8 の最小値ちょうどです。行同士は隙間なく積み重なります。粗いポインターでは既定の高さが 32px になります。当たり判定を行より大きくすると上の行と重なってしまい、小さい的を「間違った的」に取り替えることになるからです。`--ran-disclosure-row-height` を設定すれば、どの入力方式でも高さを固定できます。

### スロット

| スロット  | 内容                                                               |
| --------- | ------------------------------------------------------------------ |
| `default` | 本文。`open` のあいだ現れます。                                    |
| `leading` | 見出しの前に置くインジケーター。ふつうは `<r-state-dot>`。         |
| `heading` | 左半分のマークアップ。`heading` 属性の素のテキストを置き換えます。 |
| `summary` | 右半分のマークアップ。`summary` 属性の素のテキストを置き換えます。 |

`heading` と `summary` は属性として素の文字列を取ります。ツール呼び出しの行にはたいていそれで足ります。半分にマークアップを持たせたいとき（コード、リンク、略語など）は、代わりにスロットに入れてください。属性のテキストはスロットのフォールバックなので、スロットに入れた内容がそのまま置き換えます。

```html
<r-disclosure-row expandable>
  <code slot="heading">fetch()</code>
  <a slot="summary" href="https://example.com">https://example.com</a>
  <pre>…</pre>
</r-disclosure-row>
```

スロットに入れた内容も行の半分として数えられるので、区切りの記号は属性のときとまったく同じように現れたり消えたりします。

### Parts

`row` · `leading` · `title` · `separator` · `summary` · `disclosure` · `body`

## スタイル

`<r-disclosure-row>` は自前の **CSS カスタムプロパティを 15 個**と、テーマから読み取るセマンティックトークンを公開しています。継承が届く場所ならどこでも指定できます（`:root`、ラッパー、要素そのものなど）。

```css
r-disclosure-row {
  --ran-disclosure-hover-background: var(--ran-color-bg-subtle);
}
```

Parts：`body` · `disclosure` · `leading` · `row` · `separator` · `summary` · `title`

全一覧は[スタイルトークン](/ja/src/ranui/style-tokens#disclosure-row)にあります。どのトークンを選ぶかは[デザインシステム](/ja/src/ranui/design-system/)を参照してください。

## ベストプラクティス

- **行には本文を与えるか、そうでなければ開けるようにしないこと。** 何もない空間へ開く山形の記号は役に立ちません。`expandable` を外せば、行は 1 行のままです。
- **見出しは決まった語彙に保つ**（`ファイルを読む`、`テストを実行`、`検索`）**こと。** 変わる部分は概要に置きます。行を縦に並べたとき目で追えるのは、そのおかげです。
- **`tone="error"` は必ず言葉と組で使い、色だけに頼らないこと。** 何が失敗したのかは概要が語るべきです。
