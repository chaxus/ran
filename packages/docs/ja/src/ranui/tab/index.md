---
description: 'ranui の Tabs（<r-tabs>）は、どのフレームワークでも使えるネイティブな Web Component で、内容を切り替え可能なパネルにまとめます。'
---

# Tab

ペインを切り替えるタブコンテナです。コンテナとして `<r-tabs>` を置き、その中に `<r-tab>` のペインを 1 つ以上並べて組み立てます。

> **こんなときに**：ペインを切り替えるタブコンテナが必要なとき。`<r-tabs>` に `<r-tab>` の子を並べ、それぞれにヘッダーの `label` とペインの本文を与えます。

## クイックスタート

### 基本的な使い方

<ran-demo column>
  <r-tabs>
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs>
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

`<r-tab>` ひとつがペインひとつになります。`label` がヘッダーのボタンとして描画され、スロットに入れた内容がペインの本文です。ヘッダーを選ぶと、対応するペインがスライドして現れます。

## API リファレンス

### `r-tabs` のプロパティ

コンテナです。ヘッダー行、アクティブを示すインジケーター、ペインの内容領域を持ちます。

| プロパティ | 型        | 既定値           | 説明                                                                     |
| ---------- | --------- | ---------------- | ------------------------------------------------------------------------ |
| `active`   | `string`  | 最初の有効なタブ | いま選ばれているタブの `r-key`                                           |
| `type`     | `string`  | `'flat'`         | ヘッダーの見た目：`flat`、`line`                                         |
| `align`    | `string`  | `'start'`        | ヘッダーの揃え：`start`、`center`、`end`                                 |
| `effect`   | `boolean` | `false`          | ヘッダーボタンのリップルを有効にし、スライドするインジケーターを隠します |
| `sheet`    | `string`  | `''`             | Shadow DOM に注入する CSS テキスト                                       |

> `active` のセッターはキー文字列を受け取ります。`null` を代入すると属性が外れます。`active` を設定しない場合は、マウント時に無効でない最初のタブが選ばれます。

### `r-tab` のプロパティ

ペインひとつぶんです。その属性は親の `<r-tabs>` に読まれ、対応するヘッダーボタンが組み立てられます。

| プロパティ | 型        | 既定値       | 説明                                                                |
| ---------- | --------- | ------------ | ------------------------------------------------------------------- |
| `label`    | `string`  | `''`         | タブヘッダーに表示する文字列                                        |
| `r-key`    | `string`  | インデックス | ひとつの `<r-tabs>` 内で一意な識別子。`active` と突き合わせられます |
| `icon`     | `string`  | —            | ラベルの前に表示する `r-icon` の名前                                |
| `iconSize` | `string`  | —            | ヘッダーアイコンの大きさ                                            |
| `disabled` | `boolean` | `false`      | そのタブを選べなくします                                            |
| `effect`   | `boolean` | —            | ヘッダーのリップル効果（通常は親の `effect` から設定されます）      |
| `sheet`    | `string`  | `''`         | Shadow DOM に注入する CSS テキスト                                  |

> `key` プロパティのゲッター／セッターは `r-key` 属性を読み書きします（素の `key` という名前は予約フィールドのため避けています）。`label` と `r-key` は要素が接続される前に設定してください。ヘッダーが組み立てられたあとは、この 2 つの属性の変更は再処理されません。

### ヘッダーの見た目 `type`

`flat`（既定）はスライドする下線のインジケーターを見せ、`line` は枠線付きのタブヘッダーを描画します。

<ran-demo column>
  <r-tabs type="flat">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs type="flat">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>

<r-tabs type="line">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### ヘッダーの揃え `align`

ヘッダー行を揃えます。既定は `start` です。

<ran-demo column>
  <r-tabs type="line" align="start">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="center">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="end">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs type="line" align="start"> ... </r-tabs>
<r-tabs type="line" align="center"> ... </r-tabs>
<r-tabs type="line" align="end"> ... </r-tabs>
```

### アクティブなタブ `active` と `r-key`

- `r-key` は `<r-tab>` の属性で、同じ `<r-tabs>` の中で各ペインに安定した識別子を与えます。省略するとそのペインのインデックスになります。
- `active` は `<r-tabs>` の属性で、最初に選ばれるタブを指定します。`r-key` が `active` と一致するペインが表示されます。

キーを明示しない場合、`active` は 0 始まりのインデックスと一致します。

<ran-demo column>
  <r-tabs active="1">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs active="1">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

`r-key` を明示した場合（キーのないペインはインデックスにフォールバックします）：

<ran-demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a">11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a">11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

> ひとつの `<r-tabs>` の中で `r-key` はすべて一意でなければなりません。一部のペインでキーが重複していたり欠けていたりすると、ヘッダーの組み立て中にエラーになります。

### 無効なペイン `disabled`

`disabled` の `<r-tab>` は選択できず、既定のアクティブタブを決めるときにも飛ばされます。

<ran-demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

### ヘッダーのアイコン `icon` と `iconSize`

`<r-tab>` は `icon` 属性（`r-icon` の名前）を受け取り、ラベルの前に描画します。`iconSize` でその大きさを決めます。

<ran-demo column>
  <r-tabs>
    <r-tab label="tab1" icon="edit">11111</r-tab>
    <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs>
  <r-tab label="tab1" icon="edit">11111</r-tab>
  <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### リップル効果 `effect`

`<r-tabs>` に `effect` を付けると、ヘッダーボタンのクリック時にリップルが出ます。`effect` が有効なあいだ、スライドする下線のインジケーターは隠れます。

<ran-demo column>
  <r-tabs effect="true">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs effect="true">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

## スロット

| 要素     | スロット | 説明                                             |
| -------- | -------- | ------------------------------------------------ |
| `r-tabs` | （既定） | `<r-tab>` のペインを受け取ります                 |
| `r-tab`  | （既定） | ペインの本文。そのタブがアクティブなときに出ます |

## CSS parts

`r-tabs` が公開するもの：

| Part           | 説明                                   |
| -------------- | -------------------------------------- |
| `tabs`         | ルートのラッパー                       |
| `header`       | ヘッダー行のラッパー                   |
| `nav`          | ヘッダー項目を収める tablist           |
| `indicator`    | スライドする下線                       |
| `content`      | ペイン内容のビューポート               |
| `content-wrap` | すべてのペインを載せるスライドトラック |

`r-tab` が公開するもの：

| Part      | 説明                 |
| --------- | -------------------- |
| `content` | ペインの内容スロット |

## イベント

### `change`

`<r-tabs>` は監視対象の属性が変わったときに `change` の `CustomEvent` を発火します。もっともよくあるのはアクティブなタブが切り替わったときです。`event.detail.active` は現在のアクティブキー（選ばれた `<r-tab>` の `r-key`、`r-key` がなければそのインデックス）です。

```js
const tabs = document.createElement('r-tabs');
tabs.addEventListener('change', (e) => {
  console.log('アクティブなタブ:', e.detail.active);
});
tabbar.append(tabs);
```

`<r-tab>` はカスタムイベントを発火しません。

## スタイル

`<r-tabs>` は自前の **CSS カスタムプロパティを 10 個**と、テーマから読み取るセマンティックトークンを公開しています。継承が届く場所ならどこでも指定できます（`:root`、ラッパー、要素そのもの）。

```css
r-tabs {
  --ran-tab-content-background: var(--ran-color-bg-subtle);
}
```

Parts：`content` · `content-wrap` · `header` · `indicator` · `nav` · `tabs`

全一覧は[スタイルトークン](/ja/src/ranui/style-tokens#tab)にあります。どのトークンを選ぶかは[デザインシステム](/ja/src/ranui/design-system/)を参照してください。

## ベストプラクティス

- **安定した識別子**：各 `<r-tab>` に一意な `r-key` を与え、位置のインデックスに頼らず `<r-tabs>` の `active` で選択を制御してください。
- **見た目の選択**：枠線のある文書風のタブ列には `type="line"` を、最小限のスライド下線には `type="flat"`（既定）を使ってください。
- **揃え**：幅の広いコンテナの中でヘッダー行の位置を変えるには `align="center"` や `align="end"` を使います。
- **無効なペイン**：使えないペインには `disabled` を付けてください。クリックでも既定の選択でも飛ばされます。
- **キーボード操作**：ヘッダー行は WAI-ARIA の tablist です。矢印キーでタブ間を移動でき（`Home` / `End` も使えます）、タブ順に入るのはアクティブなタブだけです。
