---
description: 'ranui の Input（<r-input>）はキーボード入力のための基本的なフォームコントロールです。型・サイズ・検証を備え、ネイティブな Web Component としてどのフレームワークでも使えます。'
---

# Input

キーボードで内容を入力するための、もっとも基本的なフォームコントロールです。

> **こんなときに**：上に固定されたラベル、先頭のアイコン、検証の状態とメッセージ、そしてネイティブフォームへの参加が必要なテキストフィールドがほしいとき。`<r-input>` はテキスト、パスワード、数値の入力をカバーします。

## クイックスタート

### 基本的な使い方

<Demo column>
  <r-input placeholder="テキストを入力"></r-input>
</Demo>

```html
<r-input placeholder="テキストを入力"></r-input>
```

## API リファレンス

### プロパティ

| プロパティ    | 型        | 既定値  | 説明                                                                            |
| ------------- | --------- | ------- | ------------------------------------------------------------------------------- |
| `label`       | `string`  | `''`    | フィールドの上に描画される固定のキャプション                                    |
| `placeholder` | `string`  | `''`    | プレースホルダー。ネイティブの `<input>` にそのまま渡されます                   |
| `value`       | `string`  | `''`    | フィールドの値。属性に反映され、フォームにも伝えられます                        |
| `disabled`    | `boolean` | `false` | 入力を無効にするかどうか                                                        |
| `type`        | `string`  | `''`    | 内部のコントロールに渡すネイティブの入力型（`text`、`password`、`number` など） |
| `icon`        | `string`  | `''`    | フィールド内の先頭に置くアイコン名（`r-icon` として描画）                       |
| `name`        | `string`  | `''`    | フォームに参加するときに使うフィールド名                                        |
| `status`      | `string`  | `''`    | 検証の状態：`error`、`warning`                                                  |
| `message`     | `string`  | `''`    | フィールドの下に描画される補助・検証テキスト                                    |
| `min`         | `string`  | `''`    | 最小値。`type="number"` のとき内部の `<input>` に渡されます                     |
| `max`         | `string`  | `''`    | 最大値。`type="number"` のとき内部の `<input>` に渡されます                     |
| `step`        | `string`  | `''`    | 値の刻み。`type="number"` のとき内部の `<input>` に渡されます                   |
| `required`    | `boolean` | `false` | 内部の `<input>` に渡され、ネイティブの制約検証が働きます                       |
| `sheet`       | `string`  | `''`    | シャドウルートに注入する CSS                                                    |

### ラベル `label`

フィールドの上に描画される固定のキャプションです。常に見えていて、隣の内容と重ならず、フォーカスしてもレイアウトがずれません（上揃えのラベルはインラインやフローティングのラベルより入力完了も速い。[Luke Wroblewski のアイトラッキング調査](https://www.lukew.com/ff/entry.asp?504=)を参照）。

<Demo column>
  <r-input label="ユーザー名"></r-input>
</Demo>

```html
<r-input label="ユーザー名"></r-input>
```

### プレースホルダー `placeholder`

ネイティブの `placeholder` 属性と同じ挙動です。

<Demo column>
  <r-input placeholder="ユーザー名を入力"></r-input>
</Demo>

```html
<r-input placeholder="ユーザー名を入力"></r-input>
```

### 値 `value`

<Demo column>
  <r-input value="1234"></r-input>
</Demo>

```html
<r-input value="1234"></r-input>
```

### 無効状態 `disabled`

<Demo column>
  <r-input label="ユーザー名" disabled></r-input>
</Demo>

```html
<r-input label="ユーザー名" disabled></r-input>
```

### アイコン `icon`

<Demo column>
  <r-input icon="user"></r-input>
</Demo>

```html
<r-input icon="user"></r-input>
```

### 入力の型 `type`

<Demo column>
  <r-input icon="lock" type="password" placeholder="パスワード"></r-input>
  <r-input type="number" placeholder="数値"></r-input>
</Demo>

```html
<r-input icon="lock" type="password" placeholder="パスワード"></r-input>
<r-input type="number" placeholder="数値"></r-input>
```

### 状態 `status`

`status` は必ず `message` と組み合わせてください。状態が色だけでなく文字でも伝わります。

<Demo column>
  <r-input status="error" label="ユーザー名" message="この項目は必須です"></r-input>
  <r-input status="warning" label="ユーザー名" message="この値を確認してください"></r-input>
</Demo>

```html
<r-input status="error" label="ユーザー名" message="この項目は必須です"></r-input>
<r-input status="warning" label="ユーザー名" message="この値を確認してください"></r-input>
```

### 補助メッセージ `message`

フィールドの下に補助・検証のテキストを描画します。

<Demo column>
  <r-input label="メールアドレス" message="メールアドレスを共有することはありません"></r-input>
</Demo>

```html
<r-input label="メールアドレス" message="メールアドレスを共有することはありません"></r-input>
```

### フォームのフィールド名 `name`

```html
<r-input name="username" label="ユーザー名"></r-input>
```

## イベント

どちらのイベントも `CustomEvent` として発火し、`detail` に現在の値を載せます。

| イベント | 発火するタイミング                             | `detail`            |
| -------- | ---------------------------------------------- | ------------------- |
| `input`  | キーを打つたび（ネイティブの `input` と同じ）  | `{ value: string }` |
| `change` | 確定・ブラー時（ネイティブの `change` と同じ） | `{ value: string }` |

### input イベント `input`

<Demo column>
  <r-input oninput="console.log(event.detail.value)" label="ユーザー名"></r-input>
</Demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', 'ユーザー名');
input.addEventListener('input', (event) => {
  console.log('入力中:', event.detail.value);
});
```

### change イベント `change`

<Demo column>
  <r-input onchange="console.log(event.detail.value)" label="ユーザー名"></r-input>
</Demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', 'ユーザー名');
input.addEventListener('change', (event) => {
  console.log('値が変わりました:', event.detail.value);
});
```

## フォームとの関連付け {#form-association}

`r-input` はフォーム関連付けカスタム要素です（`static formAssociated = true`）。`ElementInternals` を取り付け、`setFormValue` で値を伝えるので、ネイティブの `<form>` の実際の子孫であれば `new FormData(form)` で収集されます。値にキーを付けるには `name` を設定してください。送信をそのままプレーンなオブジェクトにする `serializeForm()` ヘルパーについては[フォーム](/ja/src/ranui/form/)を参照してください。

```html
<form>
  <r-input name="username" label="ユーザー名"></r-input>
</form>
```

**リセット**：ネイティブの `form.reset()`（や `<button type="reset">`）は、フィールドが最初に接続されたときの値に戻します。これは `formResetCallback()` で実装されています。フォーム関連付けカスタム要素に対して、ブラウザーが自動的に呼ぶライフサイクルフックのひとつです。

**検証**：`required` を設定すると、空のフィールドは `ElementInternals.setValidity()` によって不正になります。`form.checkValidity()` / `form.reportValidity()` からも見え、送信するとブラウザー標準の検証バルーンがそのフィールドに紐づいて表示されます。`disabled` のフィールドが検証を止めることはなく、これはネイティブの `<input>` と同じです。`r-input` はネイティブフィールドでおなじみのメソッドとプロパティも公開しています：`checkValidity()`、`reportValidity()`、`validity`、`validationMessage`。

```html
<form>
  <r-input name="username" label="ユーザー名" required></r-input>
  <button type="submit">送信</button>
</form>
```

## CSS parts

外部からスタイルを当てられるよう `::part()` で公開しています。

| Part      | 要素                                                     |
| --------- | -------------------------------------------------------- |
| `input`   | フィールドのラッパー                                     |
| `content` | 内部のネイティブ `<input>` コントロール                  |
| `label`   | フィールド上の固定ラベル（`label` を設定したときに存在） |
| `message` | 補助・検証のテキスト（`message` を設定したときに存在）   |

```css
r-input::part(content) {
  font-size: 16px;
}
```

## スタイル

`<r-input>` は自前の **CSS カスタムプロパティを 61 個**と、テーマから読み取るセマンティックトークンを公開しています。継承が届く場所ならどこでも指定できます（`:root`、ラッパー、要素そのものなど）。

```css
r-input {
  --ran-input-color: var(--ran-color-text-secondary);
}
```

Parts：`content` · `input` · `label` · `message`

全一覧は[スタイルトークン](/ja/src/ranui/style-tokens#input)にあります。どのトークンを使うかは[デザインシステム](/ja/src/ranui/design-system/)を参照してください。

## ベストプラクティス

- **ラベル**：意味のある `label` を付けて、フィールドにアクセシブルな名前を与えてください。
- **プレースホルダー**：`placeholder` は入力のヒントであって、ラベルの代わりではありません。
- **状態とメッセージ**：`status` は `message` と組み合わせ、状態を色だけで示さないようにしてください。
- **アイコン**：内容に合った `icon` を添えると認識しやすくなります。
- **型**：内容にふさわしい `type`（`text`、`password`、`number` など）を選んでください。
- **フォーム**：フォームの中で値を集めるときは `name` を設定してください。
