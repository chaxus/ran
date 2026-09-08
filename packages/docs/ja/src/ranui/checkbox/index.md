---
description: 'ranui の Checkbox（<r-checkbox>）は、オン／オフの選択を一つ切り替えます。ラベルを付けられ、ネイティブのフォームにも対応します。'
---

# Checkbox

オン／オフの選択を一つ切り替えるチェックボックスです。ラベルを付けられ、ネイティブのフォームにも対応します。

> **使いどころ**：ラベル付きのオン／オフの切り替えが一つ必要で、ネイティブのフォームに参加してほしいとき。`<r-checkbox>` はチェック状態を `FormData` に伝え、キーボードでも操作できます。

## クイックスタート

### 基本的な使い方

<ran-demo>
  <r-checkbox>ログイン状態を保持する</r-checkbox>
</ran-demo>

```html
<r-checkbox>ログイン状態を保持する</r-checkbox>
```

デフォルトスロットの内容がチェックボックスのラベルになります。

## API リファレンス

### プロパティ

| プロパティ | 型        | 既定値    | 説明                                                             |
| ---------- | --------- | --------- | ---------------------------------------------------------------- |
| `checked`  | `boolean` | `false`   | チェックされているか                                             |
| `value`    | `string`  | `'false'` | フォームの値。チェック状態を `'true'` / `'false'` として映します |
| `disabled` | `boolean` | `false`   | 無効かどうか                                                     |
| `required` | `boolean` | `false`   | フォームを送信するのにチェックが必要か                           |
| `sheet`    | `string`  | `''`      | 見た目を変えるためコンポーネントの shadow DOM に注入する CSS     |

> `checked` と `value` の属性は同期されます。どちらかを設定するともう一方も更新されます。チェックされているとき `value` は `'true'`、されていないとき `'false'` です。

### チェック状態 `checked`

<ran-demo>
  <r-checkbox checked="true">チェック済み</r-checkbox>
  <r-checkbox checked="false">未チェック</r-checkbox>
</ran-demo>

```html
<r-checkbox checked="true">チェック済み</r-checkbox> <r-checkbox checked="false">未チェック</r-checkbox>
```

### 値 `value`

<ran-demo>
  <r-checkbox value="true">value は true</r-checkbox>
  <r-checkbox value="false">value は false</r-checkbox>
</ran-demo>

```html
<r-checkbox value="true">value は true</r-checkbox> <r-checkbox value="false">value は false</r-checkbox>
```

### 無効状態 `disabled`

<ran-demo>
  <r-checkbox checked="true" disabled>チェック済み</r-checkbox>
  <r-checkbox checked="false" disabled>未チェック</r-checkbox>
</ran-demo>

```html
<r-checkbox checked="true" disabled>チェック済み</r-checkbox>
<r-checkbox checked="false" disabled>未チェック</r-checkbox>
```

### スタイルの上書き `sheet`

`sheet` 属性は shadow DOM に CSS を注入し、内部の要素をクラス名で狙えるようにします。

<ran-demo>
  <r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">色を変えたラベル</r-checkbox>
</ran-demo>

```html
<r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">色を変えたラベル</r-checkbox>
```

## イベント

### `change`

チェックボックスが切り替わったとき（クリック、または Space / Enter の押下）に発生します。イベントは `CustomEvent` で、`detail` が新しいチェック状態を運びます。

```ts
detail: {
  checked: boolean; // 切り替えたあとのチェック状態
}
```

無効なチェックボックスは `change` を発生させません。

<ran-demo>
  <r-checkbox onchange="message.info(this)">切り替えてみてください</r-checkbox>
</ran-demo>

```html
<r-checkbox onchange="handleChange(event)">切り替えてみてください</r-checkbox>

<script>
  function handleChange(event) {
    console.log('checked:', event.detail.checked);
  }
</script>
```

## スロット

| スロット     | 説明                                     |
| ------------ | ---------------------------------------- |
| (デフォルト) | チェックボックスのラベル。箱の隣に出ます |

## フォームとの関連づけ {#form-association}

`r-checkbox` はフォーム関連づけカスタム要素（`formAssociated = true`）です。チェック状態を `ElementInternals.setFormValue` で中継するので、ネイティブのフォームに参加し、ネイティブ `<form>` の実際の子孫であれば `new FormData(form)` に集められます。ネイティブのチェックボックスの意味づけに倣い、チェックされているときだけ `value` を差し出します。

ホスト自身がアクセシブルなチェックボックスの意味づけを持ちます：`role="checkbox"`、`aria-checked`、`aria-disabled`、そしてキーボード操作（Space か Enter で切り替え）。

**リセット**：ネイティブの `form.reset()` は `formResetCallback()` を通じて、最初に接続したときのチェック状態へ戻します。

**検証**：`required` は未チェックの箱を `ElementInternals.setValidity()` 経由で無効にし、`form.checkValidity()` / `form.reportValidity()` から見えるようにします。`disabled` の箱が検証を止めることはありません。`checkValidity()`、`reportValidity()`、`validity`、`validationMessage` は、ネイティブのフィールドと同じように要素の上で使えます。

```html
<form>
  <r-checkbox name="terms" required>利用規約に同意します</r-checkbox>
  <button type="submit">送信</button>
</form>
```

## CSS Part

`::part()` セレクターで内部の構造にスタイルを当てられます。

| Part       | 要素                                       |
| ---------- | ------------------------------------------ |
| `wrapper`  | 箱とラベルを収める外側の flex コンテナ     |
| `checkbox` | 箱のコンテナ                               |
| `input`    | 視覚的に隠された `<input type="checkbox">` |
| `inner`    | 描画される箱（枠線、塗り、チェックマーク） |
| `label`    | デフォルトスロットを包むラベル             |

```css
r-checkbox::part(inner) {
  border-radius: 50%;
}
r-checkbox::part(label) {
  font-weight: 600;
}
```

## スタイリング

`<r-checkbox>` は自前の **CSS カスタムプロパティを 32 個**、そしてテーマから読むセマンティック
トークンを公開しています。継承が届く場所ならどこにでも設定できます（`:root`、外側のコンテナ、
要素そのもの）。

```css
r-checkbox {
  --ran-checkbox-color: var(--ran-color-text-secondary);
}
```

Part：`checkbox` · `inner` · `input` · `label` · `wrapper`

一覧は[スタイルトークン](/ja/src/ranui/style-tokens#checkbox)に、どのトークンを選ぶかは[デザインシステム](/ja/src/ranui/design-system/)にあります。

## ベストプラクティス

- **ラベルを付ける**：スロットにテキストを渡し、コントロールにアクセシブルな名前を与えてください。
- **checked と value**：真偽の状態には `checked` を使い、フォームのデータを集めるときは `value`（`'true'` / `'false'`）を読みます。
- **無効状態**：その選択が使えないときは `disabled` を使います。
- **`change` を購読する**：DOM を問い合わせ直すのではなく `event.detail.checked` を読んでください。
- **フォーム**：`r-checkbox` は `<form>` の中に置くだけで、チェックされていれば値が自動的に集められます。送信をプレーンなオブジェクトに変える `serializeForm()` については [Forms](/ja/src/ranui/form/) を参照してください。
