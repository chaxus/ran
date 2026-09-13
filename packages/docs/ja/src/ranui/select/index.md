---
description: 'ranui の Select（<r-select>）は、選択肢から値をひとつ選ぶドロップダウンです。検索とネイティブフォームへの参加に対応します。'
---

# Select

選択肢の一覧から値をひとつ選ぶドロップダウンです。検索とフォームへの参加にも対応します。

> **こんなときに**：`<r-option>` の子要素から組み立てる、値ひとつのドロップダウンが必要なとき。検索やネイティブフォームへの参加も欲しい場合に。`<r-select>` が開閉、絞り込み、`FormData` への受け渡しを引き受けます。

## クイックスタート

### 基本的な使い方

選択肢はスロットに入れた `<r-option>` の子要素で与えます。各選択肢の `value` 属性がその値、テキスト内容が表示されるラベルです。

<ran-demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## API リファレンス

### プロパティ

| プロパティ            | 型        | 既定値     | 説明                                                                                                                                         |
| --------------------- | --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`               | `string`  | `''`       | フィールドの上に置く固定のキャプション（`r-input` の `label` と同じ作り）。ラベル付きの select とラベル付きの input がフォームの中で揃います |
| `value`               | `string`  | `''`       | 選択された値。設定すると閉じた状態のラベルが更新されます。`disabled` のあいだは無視されます                                                  |
| `defaultValue`        | `string`  | `''`       | 最初に選ばれる値。選択肢の `value` と突き合わせられます                                                                                      |
| `disabled`            | `boolean` | `false`    | select を無効にするかどうか                                                                                                                  |
| `type`                | `string`  | `''`       | `text` にすると枠線も背景もなく矢印アイコンもないトリガーになります。それ以外は枠線つきです                                                  |
| `open`                | `boolean` | `false`    | ドロップダウンが出ているかどうか。これ**が**状態そのもので、設定すればパネルが開閉します                                                       |
| `placement`           | `string`  | `'bottom'` | ドロップダウンが開く側と、任意の揃え：`bottom`、`bottom-end`、`top-center` など                                                              |
| `showSearch`          | `boolean` | `false`    | ラベルで選択肢を絞り込む、内蔵の検索ボックスを出します                                                                                       |
| `getPopupContainerId` | `string`  | `''`       | ドロップダウンを配置する要素の `id`（既定は `document.body`）                                                                                |
| `dropdownclass`       | `string`  | `''`       | ドロップダウンのパネルに付けるカスタムクラス                                                                                                 |
| `trigger`             | `string`  | `'click'`  | ドロップダウンの開き方：`click`、`hover`、`click,hover`（モバイルでは hover は無視されます）                                                 |
| `required`            | `boolean` | `false`    | フォームを送信するのに選択が必須かどうか                                                                                                     |
| `sheet`               | `string`  | `''`       | Shadow DOM に注入する CSS                                                                                                                    |

> **補足：** `defaultValue` と `showSearch` はリアクティブです。要素が接続されたあとに変更しても、（`value`、`disabled`、`sheet` とともに）`attributeChangedCallback` で処理し直されます。`defaultValue` を更新すると一致する選択が適用し直され、`showSearch` を切り替えると内蔵の検索ボックスが繋がれたり外されたりします。

### 選択肢のプロパティ

選択肢は `<r-option>` の子要素で与えます。

| プロパティ | 型        | 既定値  | 説明                                                               |
| ---------- | --------- | ------- | ------------------------------------------------------------------ |
| `value`    | `string`  | `''`    | 選択肢の値。選ばれたとき select の値として送出されます             |
| `disabled` | `boolean` | `false` | その選択肢を選べなくします。クリックでもキーボードでも飛ばされます |
| `sheet`    | `string`  | `''`    | 選択肢の Shadow DOM に注入する CSS                                 |

ラベルや値が重複している選択肢があると `console.warn` が出ます。

### ラベル `label`

フィールドの上に描画される固定のキャプションです。常に見えていて、隣の内容と重なりません。`r-input` の `label` と同じトークンとレイアウトを使うので、ラベル付きの select とラベル付きの input をフォームで並べたとき、高さも上端も揃います。

<ran-demo>
  <r-select label="国" style="width: 180px" defaultValue="185">
    <r-option value="185">アメリカ合衆国</r-option>
    <r-option value="186">カナダ</r-option>
    <r-option value="187">メキシコ</r-option>
  </r-select>
</ran-demo>

```html
<r-select label="国" defaultValue="185">
  <r-option value="185">アメリカ合衆国</r-option>
  <r-option value="186">カナダ</r-option>
  <r-option value="187">メキシコ</r-option>
</r-select>
```

### 既定値 `defaultValue`

<ran-demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 無効状態 `disabled`

<ran-demo>
  <r-select style="width: 120px; height: 40px" disabled defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" disabled defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### テキスト型 `type`

<ran-demo>
  <r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 開く方向 `placement`

`placement` は希望であって保証ではありません。トリガーがビューポートの端に近く、希望した側に余裕がないときは、ドロップダウンは自動的に反対側へ反転し、水平方向にずれて画面内に収まります。これは既定の body 直下への配置にのみ当てはまります。`getPopupContainerId` を設定した場合は、そのコンテナに収まる `placement` を選んでください。

方向には揃えの接尾辞を付けられます。`bottom-end`、`top-center` のように、`r-popover` と同じ文法です。方向だけを書いた場合は `-start` の意味になり、パネルの先頭側の辺がトリガーの先頭側の辺に揃います。

この接尾辞が効くのは、パネルの幅がトリガーと違うときだけです。パネルは既定でトリガーの幅に追随するからです。パネルを広げると（`r-dropdown::part(dropdown)`。パネルは select のシャドウルートではなく `<body>` にポータルされるので、`dropdownclass` 経由で届きます）、揃えは実際に描画されている幅に対して計算されます。

```html
<style>
  r-dropdown.wide::part(dropdown) {
    min-width: 220px;
  }
</style>

<!-- パネルの右端をトリガーの右端に合わせる -->
<r-select placement="bottom-end" dropdownclass="wide" style="width: 80px">
  <r-option value="a">とても長い選択肢のラベル</r-option>
</r-select>
```

なお、境界に収めるためのシフトは揃えより優先されます。トリガーがビューポートの端に十分近ければ、どんな揃えを指定していてもパネルは画面内へ押し戻されます。

<ran-demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185" placement="top">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185" placement="top">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 開閉状態 `open`

`open` はドロップダウンの状態そのもので、`<details open>` や `<dialog open>` と同じように属性へ反映されます。パネルの `display` から状態を推測する箇所はどこにもありません（`display` は退場アニメーションのぶんだけ状態から遅れます）。だから属性と `aria-expanded` と画面上の見た目が食い違うことはありません。

そのおかげで、これはコンポーネントを動かす正式な手段であり、スタイルの対象にもテストの検証対象にもできます。

```html
<r-select id="picker" open>
  <r-option value="185">Mike</r-option>
</r-select>

<script>
  const picker = document.getElementById('picker');
  picker.open = true; // または picker.show()
  picker.open = false; // または picker.hide()
  picker.toggle();
</script>

<style>
  /* パネルが開いているあいだのトリガー */
  r-select[open]::part(selection) {
    border-color: var(--ran-color-primary);
  }
</style>
```

`show()`、`hide()`、`toggle()` はその薄いラッパーで、代入よりメソッドのほうが読みやすい場面のためにあります。

### 検索機能 `showSearch`

<ran-demo>
  <r-select style="width: 120px; height: 40px" showSearch="true">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" showSearch="true">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 開き方 `trigger`

<ran-demo>
  <r-select style="width: 120px; height: 40px" trigger="click,hover">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<!-- クリックで開く（既定） -->
<r-select trigger="click">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- ホバーで開く（モバイルでは無視されます） -->
<r-select trigger="hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- クリックとホバーの両方 -->
<r-select trigger="click,hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 配置先のコンテナ `getPopupContainerId`

ドロップダウンは既定で `document.body` へポータルされます。別の要素の `id` を渡すと、そちらに配置されます。

```html
<r-select getPopupContainerId="my-container">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### ドロップダウンのカスタムクラス `dropdownclass`

```html
<r-select dropdownclass="custom-dropdown">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## イベント

### `change`

選択肢が選ばれたときに発火します。`event.detail` は `{ value, label }` で、`value` は選ばれた選択肢の値、`label` はその表示テキストです。最初の `defaultValue` が選ばれることでは `change` は発火しません。

```html
<r-select id="picker">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  document.getElementById('picker').addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.label); // 例："186" "Tom"
  });
</script>
```

### `search`

`showSearch` が有効なときにだけ、検索ボックスへの入力に合わせて発火します（スロットリングあり）。`event.detail` は `{ value }` で、現在の検索文字列です。コンポーネント側でも、見えている選択肢をラベルで絞り込みます。

```html
<r-select showSearch="true" id="searchable">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  document.getElementById('searchable').addEventListener('search', (e) => {
    console.log(e.detail.value);
  });
</script>
```

### `show` / `after-show` / `hide` / `after-hide`

パネルの遷移まわりで発火します。`show` と `hide` は遷移が始まるときに意図を知らせ、`after-show` と `after-hide` はパネルが実際に到着してアニメーションも終わってから発火します。パネルが本当に消えたあとにだけ何かをしたいときは、後者を聞いてください。

`detail` は持ちません。

```html
<script>
  const picker = document.getElementById('picker');
  picker.addEventListener('show', () => console.log('開きます'));
  picker.addEventListener('after-hide', () => console.log('閉じ終わり、アニメーションも完了'));
</script>
```

待つのはスクリプトに書き写した固定の秒数ではなく、スタイルシートのアニメーションそのものです。そのため `prefers-reduced-motion` のとき（パネルに再生すべきアニメーションがない）、`after-hide` は固定の遅延を待たずに `hide` の直後に続きます。

## フォームとの関連付け {#form-association}

`r-select` はフォーム関連付けカスタム要素です（`static formAssociated = true`）。選ばれた `value` を `ElementInternals` 経由で伝えるので、ネイティブの `<form>` の実際の子孫であれば、select の `name` のもとで `new FormData(form)` に収集されます。フォームの値は接続時の初期選択から作られ、値が変わるたびに同期されます。

**リセット**：ネイティブの `form.reset()` は、`defaultValue` が設定されていればその選択に戻し、なければ選択を完全に消します。実装は `formResetCallback()` です。

**検証**：`required` を付けると、未選択は `ElementInternals.setValidity()` によって不正になり、`form.checkValidity()` / `form.reportValidity()` から見えます。`disabled` の select が検証を止めることはありません。`checkValidity()`、`reportValidity()`、`validity`、`validationMessage` は、ネイティブのフィールドと同じように要素から使えます。

```html
<form>
  <r-select name="country" required>
    <r-option value="us">アメリカ合衆国</r-option>
    <r-option value="ca">カナダ</r-option>
  </r-select>
  <button type="submit">送信</button>
</form>
```

## スロット

| スロット | 説明                                             |
| -------- | ------------------------------------------------ |
| （既定） | 選択肢を定義する `<r-option>` 要素を受け取ります |

## CSS parts

| Part             | 説明                                                     |
| ---------------- | -------------------------------------------------------- |
| `select`         | select のルートのラッパー                                |
| `selection`      | トリガーの箱（枠線、背景、レイアウト）                   |
| `icon`           | ドロップダウンの矢印アイコン                             |
| `selection-item` | 選ばれた選択肢のラベルを表示する要素                     |
| `search`         | 内蔵の検索入力（`showSearch` のときに見えます）          |
| `label`          | フィールド上の固定ラベル（`label` を設定したときに存在） |

## ベストプラクティス

- **選択肢が多いとき**：`showSearch` を有効にして、ラベルで絞り込めるようにしてください。
- **開き方**：`trigger` は利用者の期待に合わせてください。モバイルでは `hover` が無視されるので、`click` は残しておきます。
- **配置先**：スクロールする、あるいははみ出しを切るレイアウトでは、`getPopupContainerId` でドロップダウンの配置先を制御してください。
- **見た目の調整**：`dropdownclass` や公開されている `::part()` の名前で、トリガーとドロップダウンのスタイルを変えられます。
- **フォーム**：select に `name` を与えると、ネイティブの `<form>` の中で値が `FormData` に取り込まれます。
