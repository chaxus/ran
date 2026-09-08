---
description: 'アプリ内の遷移を横取りし、外部リンクはブラウザに任せる、ルーターを意識したアンカー。'
---

# Link

スロットの内容を `<a>` で包み、アプリ内の遷移を横取りする、ルーターを意識したアンカーです。

> **使いどころ**：内部パスは ranui のルーターに通しつつ、外部リンクはブラウザにそのまま任せたいとき。`<r-link>` がアプリ内の遷移を横取りし、`push` / `replace` を代わりに行います。

## クイックスタート

### 基本的な使い方

<ran-demo>
  <r-link href="/getting-started">はじめかた</r-link>
</ran-demo>

```html
<r-link href="/getting-started">はじめかた</r-link>
```

内部の `href` がクリックされると、このリンクはパスを現在の ranui ルーターに渡します（`push`、`replace` 属性が付いていれば `replace`）。外部リンク（`https://`、`//`、`mailto:`、`tel:`）や修飾クリック（中ボタン、Ctrl / Cmd / Shift / Alt）は、いつもどおりブラウザに任されます。ルーターが登録されていない場合は、代わりにバブリングし composed な `ran-navigate` イベントを派発します。

## API リファレンス

### プロパティ

| プロパティ | 型        | 既定値  | 説明                                                                           |
| ---------- | --------- | ------- | ------------------------------------------------------------------------------ |
| `href`     | `string`  | `''`    | 遷移先。内部パスはアプリ内で解決され、外部 URL は通常どおり遷移します          |
| `replace`  | `boolean` | `false` | 付いているとき、アプリ内の遷移は履歴を置き換えます（読み取り専用。属性を反映） |
| `sheet`    | `string`  | `''`    | リンクの shadow DOM に注入する CSS                                             |

### 遷移先 `href`

内部パスはアプリ内で解決され、絶対 URL や `mailto:` / `tel:` は通常どおり遷移します。

<ran-demo>
  <r-link href="/docs">内部リンク</r-link>
  <r-link href="https://example.com">外部リンク</r-link>
</ran-demo>

```html
<r-link href="/docs">内部リンク</r-link> <r-link href="https://example.com">外部リンク</r-link>
```

### 履歴の置き換え `replace`

真偽値の属性です。付いているとき、アプリ内の遷移は新しい履歴を積むのではなく現在の履歴を置き換えます（`router.replace`）。

<ran-demo>
  <r-link href="/settings" replace>履歴を置き換える</r-link>
</ran-demo>

```html
<r-link href="/settings" replace>履歴を置き換える</r-link>
```

### 外部スタイル `sheet`

リンクの shadow DOM に注入する CSS です。ranui のどのコンポーネントとも同じ `sheet` の作法に従います。クリックできる `<a>` は shadow root の内側にあるので、ホストをボタンやカードのように見せたいときは `sheet` でボックスモデル（`display`、`padding`、`width`）を与えてください。

<ran-demo>
  <r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; background: var(--ran-color-bg-muted); }">余白のあるリンク</r-link>
</ran-demo>

```html
<r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; }">余白のあるリンク</r-link>
```

## スロット

| スロット     | 説明                                                                     |
| ------------ | ------------------------------------------------------------------------ |
| (デフォルト) | リンクの内容。shadow 内の `<a>` に投影されます（テキストでもノードでも） |

## イベント

| イベント       | detail                               | 発生するとき                                                                          |
| -------------- | ------------------------------------ | ------------------------------------------------------------------------------------- |
| `ran-navigate` | `{ path: string, replace: boolean }` | 内部リンクがクリックされ、ranui のルーターが動いていないとき。バブリングし composed。 |

```html
<r-link href="/docs">Docs</r-link>

<script>
  const link = document.createElement('r-link');
  link.href = '/docs';
  link.textContent = 'Docs';
  link.addEventListener('ran-navigate', (e) => {
    console.log(e.detail.path, e.detail.replace);
  });
  nav.append(link);
</script>
```

## ベストプラクティス

- **アプリ内の遷移**：ルーターがアプリ内で処理できるよう、ルート相対の `href`（例：`/docs`）を使ってください。
- **外部リンク**：絶対 URL と `mailto:` / `tel:` はブラウザに任されます。追加の設定は要りません。
- **履歴を置き換える**：戻るボタンの履歴を作りたくないリンク（リダイレクト、タブ切り替えなど）には `replace` を付けます。
- **現在位置**：ホストは `:host([active]) a` にスタイル（太字＋下線）を当てるので、現在のリンクには `active` 属性を設定してください。
- **ボタンやカードとして見せる**：面（背景・枠線・角丸）はホストに置き、`<a>` のボックスモデル（`display`、`padding`、`width`）は `sheet` で注入すると、領域全体がクリックできるようになります。
- **テーマ**：`<a>` はグローバルの `--ran-color-link`、`--ran-color-primary`（フォーカスリング）、`--ran-radius-sm` を読みます。コンポーネント固有の `--ran-link-*` 変数は存在しないので、これらのトークンを上書きしてください。
