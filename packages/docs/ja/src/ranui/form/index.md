---
description: 'ranui でフォームを組む方法：r-input、r-checkbox、r-select は素のネイティブ <form> の中でそのまま動き、ラッパーコンポーネントは要りません。'
---

# Forms

ranui には `<form>` を包むコンポーネントがありません。`r-input`、`r-checkbox`、`r-select` は自身が [Form-Associated Custom Elements](https://developer.mozilla.org/ja/docs/Web/API/Web_components/Using_form-associated_custom_elements) です（それぞれ `attachInternals()` を呼び、値を `ElementInternals.setFormValue()` で中継します）。したがって素のネイティブ `<form>` の中ですでに動きます。`new FormData(form)` で値が集まり、`form.reset()` で操作前の状態に戻り、`required` のフィールドは送信を止めてブラウザ標準の検証 UI をそのフィールドに紐づけて表示します。どれも ranui 固有のマークアップを必要としません。

> **使いどころ**：`r-input` / `r-checkbox` / `r-select` でフォームを組み立てているとき。本物の `<form>` をそのまま使い、送信された値を `FormData` の反復処理を自前で書かずにプレーンなオブジェクトとして欲しければ、下記の `serializeForm()` に手を伸ばしてください。

## クイックスタート

3 種類のフィールドすべてを、素の `<form>` で送信します。フィールドを変えて送信すると、下に結果が出ます。このデモはブラウザ自身の `FormData` / `Object.fromEntries` でオブジェクトを組み立てています（import は不要）。次に紹介する `serializeForm()` は同じことをしたうえで、`Object.fromEntries` にできないことを一つ足します。同じ名前が繰り返し現れたとき、黙って最後の値だけを残すのではなく配列として返すのです。

<ran-demo column>
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.info(JSON.stringify(Object.fromEntries(new FormData(this))))">
    <r-input name="username" label="ユーザー名" placeholder="ユーザー名を入力"></r-input>
    <r-select name="role" label="ロール" style="width: 100%" defaultValue="member">
      <r-option value="member">メンバー</r-option>
      <r-option value="admin">管理者</r-option>
    </r-select>
    <r-checkbox name="subscribe">ニュースレターを購読する</r-checkbox>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">送信</button></r-button>
  </form>
</ran-demo>

> 下の[レイアウト](#layout)の節でも触れますが、フィールドはフォーム全体のレイアウトを自前では
> 持ちません。そのためこのページのすべての例（これも含めて）は、自分の `<form>` に CSS
> （`display: flex; flex-direction: column; gap: …`）を設定しています。省くとフィールドは通常の
> フローで隙間なく積まれ、フォームというより壊れて重なっているように見えます。

```html
<form id="signup" style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="ユーザー名" placeholder="ユーザー名を入力"></r-input>
  <r-select name="role" label="ロール" defaultValue="member">
    <r-option value="member">メンバー</r-option>
    <r-option value="admin">管理者</r-option>
  </r-select>
  <r-checkbox name="subscribe">ニュースレターを購読する</r-checkbox>
  <button type="submit">送信</button>
</form>

<script type="module">
  import { serializeForm } from 'ranui';

  document.getElementById('signup').addEventListener('submit', (event) => {
    event.preventDefault(); // 本物の <form> は、そのままだとページを遷移させます
    console.log(serializeForm(event.target)); // { username: '...', role: 'member', subscribe: 'true' }
  });
</script>
```

## `serializeForm(form)`

`<form>` の名前つきフィールドを `FormData` 経由でプレーンなオブジェクトにまとめます。送信された内容を `JSON.stringify` したり fetch のボディとして送ったりするために、誰もが自前で書いている定型処理です。ranui のフィールドに依存しないただの関数なので、本物の `<form>` なら何にでも使えます。

```ts
function serializeForm(form: HTMLFormElement): Record<string, unknown>;
```

同じ `name` に複数の値があるフィールド（名前を共有する複数のチェックボックスなど）は配列として返り、それ以外は単一の値として返ります。

```ts
import { serializeForm } from 'ranui';

const data = serializeForm(document.querySelector('form'));
// { username: 'alice', tags: ['a', 'b'] }
fetch('/api/signup', { method: 'POST', body: JSON.stringify(data) });
```

## レイアウト {#layout}

フィールドはフォーム全体のレイアウトを自前では持ちません。あなたの `<form>` に普通の CSS でスタイルを当ててください。

<ran-demo column>
  <form style="display: flex; flex-direction: column; gap: 16px;">
    <r-input name="first" label="名"></r-input>
    <r-input name="last" label="姓"></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">次へ</button></r-button>
  </form>
</ran-demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="first" label="名"></r-input>
  <r-input name="last" label="姓"></r-input>
  <button type="submit">次へ</button>
</form>
```

## 検証とリセット

`r-input`、`r-checkbox`、`r-select` はいずれも `required`（ネイティブのフィールドとまったく同じように送信を止め、ブラウザ標準の検証バブルを出します）に加えて、`checkValidity()`、`reportValidity()`、`validity`、`validationMessage` に対応しています。ネイティブの `form.reset()`（または `<button type="reset">`）は `formResetCallback()` を通じて各フィールドを操作前の状態に戻します。詳しくは各フィールドのドキュメント（[Input](/ja/src/ranui/input/#form-association)、[Checkbox](/ja/src/ranui/checkbox/#form-association)、[Select](/ja/src/ranui/select/#form-association)）を参照してください。

<ran-demo column>
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.success('Valid — submitted')">
    <r-input name="username" label="ユーザー名" required></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">送信</button></r-button>
  </form>
</ran-demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="ユーザー名" required></r-input>
  <button type="submit">送信</button>
</form>
```

## なぜ `<r-form>` のラッパーがないのか

素のネイティブ `<form>` ですでに十分だからです。ranui のフィールドコンポーネントはその中で直接動き、ラッパーは要りません。`serializeForm()` は、残った唯一の本当の隙間 —— 送信内容をプレーンなオブジェクトにすること —— を埋めます。
