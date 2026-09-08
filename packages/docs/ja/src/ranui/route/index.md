---
description: '現在のパスがパターンに一致しているあいだだけスロットの内容を見せる、r-router の中で使うルーティングの差し込み口。'
---

# Route

ルーティングの差し込み口となる要素です。[`r-router`](../router/) の中に置くと、現在のパスが自身の `path` パターンに一致したときスロットの内容を表示し、一致しなければ隠します。

> **使いどころ**：現在のパスがパターンに一致しているあいだだけ内容を見せる差し込み口が要るとき（`:param` と `*` に対応）。`<r-route>` を `<r-router>` の中に置けば、クライアント側のビュー切り替えが組めます。

## クイックスタート

### 基本的な使い方

`path` が `/` の `r-route` は既定のパスに一致するので、単体でも内容が描画されます。

<ran-demo>
  <r-route path="/">
    <p>現在のパスが一致するとき、この内容が表示されます。</p>
  </r-route>
</ran-demo>

```html
<r-route path="/">
  <p>現在のパスが一致するとき、この内容が表示されます。</p>
</r-route>
```

### ルーターの中で

[`r-router`](../router/) の中で使うと、複数のルートがスイッチとして働きます。ルーターは遷移のたびにすべての `r-route` 子要素を同期し、`path` が一致するものを表示して残りを隠します。

```html
<r-router>
  <r-route path="/" exact><h2>Home</h2></r-route>
  <r-route path="/about"><h2>About</h2></r-route>
  <r-route path="/users/:id"><h2>User profile</h2></r-route>
</r-router>
```

`r-router` のコンテナと、`createRouter` / `RouterCore` の JavaScript API（遷移、ガード、ビュートランジション）は [Router のページ](../router/)にまとまっています。

## API リファレンス

### プロパティ

| プロパティ | 型                       | 既定値  | 説明                                                                 |
| ---------- | ------------------------ | ------- | -------------------------------------------------------------------- |
| `path`     | `string`                 | `'/'`   | 現在のパスと突き合わせるパターン。`:param` の区間と `*` に対応します |
| `exact`    | `boolean`                | `false` | 読み取り専用。`exact` 属性があるとき、完全一致を要求します           |
| `params`   | `Record<string, string>` | `{}`    | 読み取り専用。今回の一致で取り出されたパラメーター                   |
| `sheet`    | `string`                 | `''`    | コンポーネントの shadow DOM に注入する CSS                           |

### パスの一致 `path`

`path` は `/` で分割され、区間ごとに正規表現へコンパイルされます。

- `:` で始まる区間は名前つきパラメーターを取り出します（パスの 1 区間に一致）
- `*` の区間は残りのパス全体に一致します
- それ以外の区間は文字どおりに一致します

`exact` がない場合、パターンはパスの**前方一致**です（後ろに区間が続いていてもかまいません）。`exact` があるときは完全一致だけが受け入れられます。

```
/users            /users、/users/42、/users/42/profile に一致
/users (exact)    /users にだけ一致
/users/:id        :id を取り出して params.id へ
/*                すべてに一致
```

取り出されたパラメーターは読み取り専用の `params` プロパティから読みます（各値は `decodeURIComponent` で復号されます）。

```js
const route = document.createElement('r-route');
route.path = '/users/:id';
router.append(route);
route.params; // ルーターがこのルートに一致した時点で、たとえば { id: '42' }
```

### 完全一致 `exact`

真偽値の属性です。付いているとき、この差し込み口は完全一致のパスにだけ反応します（前方一致はしません）。`path="/users" exact` は `/users` に一致しますが `/users/42` には一致しません。

```html
<r-route path="/" exact><h2>Home</h2></r-route>
```

### 外部 CSS `sheet`

コンポーネントの shadow DOM に注入する CSS です。ranui のどのコンポーネントとも同じ `sheet` の作法に従います。

### スロット

デフォルト（無名）のスロットが、ルートが有効なあいだ表示される内容を持ちます。パスが一致しないときはホストに `hidden` が設定され、内容は表示されません。

```html
<r-route path="/about">
  <!-- デフォルトスロット：/about が有効なあいだだけ表示 -->
  <h2>About</h2>
</r-route>
```

## イベント

### `routematch`

この差し込み口が有効になったとき（`path` が現在のパスに一致したとき）に発生します。**バブリングします。** `event.detail` は `{ path, params }` です。

```html
<r-route path="/users/:id"><h2>User profile</h2></r-route>

<script>
  // 同じ作りのルートをマウントする前に購読しておく
  const route = document.createElement('r-route');
  route.path = '/users/:id';
  route.addEventListener('routematch', (e) => {
    console.log(e.detail.path, e.detail.params); // '/users/42', { id: '42' }
  });
  router.append(route);
</script>
```

## スタイリング

`r-route` は `::part()` のハンドルも、専用の `--ran-route-*` CSS 変数も公開していません。ホストはただの `display: block` の要素で、隠れているあいだは `display: none` に畳まれます。カスタマイズには `sheet` 属性を使うか、ホストに直接スタイルを当ててください。

`import 'ranui'`（すべてのコンポーネントを登録）または単体の `import 'ranui/route'` で読み込みます。

## ベストプラクティス

- **`r-router` の中にマウントする**：`r-route` が遷移で切り替わるのは、同期してくれる [`r-router`](../router/) の祖先があるときだけです。
- **ルートには `exact` を**：`path="/"` には `exact` 属性を付け、ほかのすべてのルートに前方一致してしまわないようにします。
- **具体的なものから一般的なものへ**：受け皿となる `path="/*"` のルートは最後に置きます。`exact` でないルートは前方一致するからです。
- **URL を自分で解析せず `params` を読む**：動的な区間は `:param` で取り出し、`params` プロパティから読んでください。
- **`routematch` で有効化に反応する**：バブリングする `routematch` イベントを使って、ルートが有効になったときのデータ読み込みを起こします。
