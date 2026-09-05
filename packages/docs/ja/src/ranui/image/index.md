---
description: 'ranui の Image（<r-image>）は、読み込みに失敗したときに代替画像へ切り替わる画像コンポーネントです。'
---

# Image

画像を描画し、読み込みに失敗したときは組み込みの代替画像へ切り替わるコンポーネントです。

> **使いどころ**：読み込みに失敗しても崩れずプレースホルダーへ落ちる画像が欲しいとき。`<r-img>` は組み込みの「壊れた画像」グラフィック、または指定した `fallback` に差し替えます。

## クイックスタート

### 基本的な使い方

<Demo>
  <r-img src="https://picsum.photos/id/1015/240/160"></r-img>
</Demo>

```html
<r-img src="https://picsum.photos/id/1015/240/160"></r-img>
```

## API リファレンス

### プロパティ

| プロパティ | 型       | 既定値                           | 説明                                                               |
| ---------- | -------- | -------------------------------- | ------------------------------------------------------------------ |
| `src`      | `string` | `''`                             | 画像の URL。リアクティブで、マウント後に変えると読み込み直します。 |
| `alt`      | `string` | `''`                             | 内側の `<img>` へ渡す代替テキスト。空なら装飾目的とみなされます。  |
| `fallback` | `string` | 組み込みの「壊れた画像」data URI | `src` の読み込みに失敗したときに表示する画像。                     |
| `sheet`    | `string` | `''`                             | コンポーネントの shadow DOM に注入する CSS。                       |

`src`、`alt`、`fallback`、`sheet` はいずれも監視されており、リアクティブに更新されます。マウント済みの要素でどれを変えても即座に反映されます。

### 画像の場所 `src`

<Demo>
  <r-img src="https://picsum.photos/id/1025/240/160"></r-img>
</Demo>

```html
<r-img src="https://picsum.photos/id/1025/240/160"></r-img>
```

### 代替テキスト `alt`

`alt` は内側の `<img>` へそのまま渡されます。装飾目的の画像では既定どおり空のままにしてスクリーンリーダーに読み飛ばさせ、意味のある画像には説明を与えてください。

<Demo>
  <r-img src="https://picsum.photos/id/1035/240/160" alt="夕暮れの山上湖"></r-img>
</Demo>

```html
<r-img src="https://picsum.photos/id/1035/240/160" alt="夕暮れの山上湖"></r-img>
```

### 読み込み失敗 `fallback`

`src` の読み込みに失敗すると、コンポーネントは `fallback` に差し替えます。`fallback` を指定していない場合は組み込みの「壊れた画像」プレースホルダーが使われます。下の例では `src` が無効な URL なので、代替画像が表示されます。

<Demo>
  <r-img src="https://example.invalid/does-not-exist.png" fallback="data:image/png;base64,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"></r-img>
</Demo>

```html
<r-img
  src="https://example.invalid/does-not-exist.png"
  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...（壊れた画像のプレースホルダー）..."
></r-img>
```

### 外部スタイル `sheet`

`sheet` はコンポーネントの shadow DOM へ生の CSS を注入します。内部の `.ran-image` コンテナや内側の `<img>` にスタイルを当てるのに使います。

<Demo>
  <r-img
    src="https://picsum.photos/id/1043/240/160"
    sheet="img { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.25); }"
  ></r-img>
</Demo>

```html
<r-img
  src="https://picsum.photos/id/1043/240/160"
  sheet="img { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.25); }"
></r-img>
```

## イベント

ありません。`r-img` はカスタムイベントを派発しません。

## ベストプラクティス

- **`src` はいつでも変えてよい**：`src` はリアクティブなので、マウント済みの要素で更新すれば画像を読み込み直します。新しい URL が失敗した場合も代替画像はきちんと働きます。
- **意味のある画像には `alt` を**：スクリーンリーダー向けに内容を説明してください。`alt` を空にするのは純粋に装飾目的の画像だけです。
- **組み込みの代替画像に任せる**：既定の「壊れた画像」プレースホルダーは自動で使われます。ブランドや文脈に合ったものを出したいときだけ `fallback` を指定してください。
- **スタイルは `sheet` で**：画像は shadow DOM の中にあるので、枠線・角丸・サイズは `sheet` 属性（またはコンポーネントの CSS 変数）で当てます。
