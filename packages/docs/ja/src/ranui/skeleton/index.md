---
description: 'ranui の Skeleton（<r-skeleton>）は、コンテンツの読み込み中にその場所を埋めるきらめくプレースホルダーです。'
---

# Skeleton

コンテンツの読み込み中にその場所を埋めるプレースホルダーです。きらめくアニメーションで待ち時間を示します。

> **使いどころ**：コンテンツを読み込むあいだ、その場所を確保するきらめくプレースホルダーが欲しいとき。`<r-skeleton>` の親要素を実際のコンテンツと同じ大きさにしておき、データが届いたら差し替えます。

## クイックスタート

### 基本的な使い方

スケルトンは親要素の幅いっぱいに広がり、高さは既定で `16px` です。

<ran-demo>
  <r-skeleton></r-skeleton>
</ran-demo>

```html
<r-skeleton></r-skeleton>
```

### 幅は親に従う

スケルトンは `width: 100%` なので、長さは中に置いたコンテナの大きさで決めます。

<ran-demo column>
  <div style="width: 100px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 200px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 100%">
    <r-skeleton></r-skeleton>
  </div>
</ran-demo>

```html
<div style="width: 100px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 200px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 100%">
  <r-skeleton></r-skeleton>
</div>
```

### プレースホルダーを積む

複数のスケルトンを組み合わせて、文章のかたまりや段落を模します。

<ran-demo column>
  <div style="width: 100%; display: flex; flex-direction: column; gap: 12px">
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
  </div>
</ran-demo>

```html
<div style="display: flex; flex-direction: column; gap: 12px">
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
</div>
```

## API リファレンス

### プロパティ

| プロパティ | 型       | 既定値 | 説明                                                 |
| ---------- | -------- | ------ | ---------------------------------------------------- |
| `sheet`    | `string` | `''`   | スコープ付きの上書きのため shadow DOM に注入する CSS |

### スタイルの上書き `sheet`

`sheet` に CSS 文字列を渡すと、shadow DOM の内側でスケルトンの見た目を上書きできます。

<ran-demo>
  <r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
</ran-demo>

```html
<r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
```

### CSS 変数

`sheet` を使わずにテーマを当てるための CSS カスタムプロパティも用意しています。

| 変数                                        | 既定値                         | 説明                           |
| ------------------------------------------- | ------------------------------ | ------------------------------ |
| `--ran-skeleton-height`                     | `16px`                         | プレースホルダーの高さ         |
| `--ran-skeleton-background`                 | `var(--ran-gray-alpha-200, …)` | きらめき以外の下地の色         |
| `--ran-skeleton-border-radius`              | `var(--ran-radius-sm, 6px)`    | 角の丸み                       |
| `--ran-skeleton-shimmer-background`         | `linear-gradient(90deg, …)`    | 動くハイライトのグラデーション |
| `--ran-skeleton-shimmer-animation-duration` | `1.4s`                         | きらめきが一度通り過ぎる時間   |

<ran-demo>
  <r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
</ran-demo>

```html
<r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
```

## イベント

ありません。スケルトンはカスタムイベントを派発しません。

## スロット

ありません。スケルトンは自身のプレースホルダーだけを描画し、スロットの内容を投影しません。

## ベストプラクティス

- **レイアウトを合わせる**：親コンテナの大きさを調整し、各スケルトンが代わりに立っている実際のコンテンツと同じ幅になるようにします。
- **形を模す**：複数のスケルトンを一定の間隔で積み、複数行のテキストやリストの行を表します。
- **変数でテーマを当てる**：ちょっとした調整には `--ran-skeleton-*` の CSS 変数を優先し、変数では届かないセレクターが必要なときだけ `sheet` を使います。
- **届いたら差し替える**：データが届いたらスケルトンを実際のコンテンツに置き換え、いつまでもアニメーションさせたままにしないでください。
