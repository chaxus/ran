---
description: 'ranui の Loading（<r-loading>）は、コンテンツや操作が進行中であることを回るインジケーターで示します。'
---

# Loading

進行中の作業を示すアニメーションのインジケーターを集めたコンポーネントです。

> **使いどころ**：作業が進行中であることを示すアニメーションのスピナーやインジケーターが欲しいとき。`<r-loading>` は `name` で選べる約 30 種類の組み込みアニメーションを備え、CSS 変数でテーマを当てられます。

## クイックスタート

### 基本的な使い方

<ran-demo>
  <r-loading name="circle"></r-loading>
</ran-demo>

```html
<r-loading name="circle"></r-loading>
```

## API リファレンス

### プロパティ

| プロパティ | 型       | 既定値     | 説明                                                                              |
| ---------- | -------- | ---------- | --------------------------------------------------------------------------------- |
| `name`     | `string` | `'circle'` | アニメーションの種類。未設定または認識できないときは `circle` に戻ります          |
| `sheet`    | `string` | `''`       | 外部からのスタイル当てのため、コンポーネントの shadow DOM に注入する CSS テキスト |

### アニメーションの種類 `name`

`name` に組み込みのアニメーション名を設定します。知らない値は何も描画しません（下の一覧にある名前だけが扱われます）。

<ran-demo>
  <r-loading name="double-bounce"></r-loading>
  <r-loading name="rotate"></r-loading>
  <r-loading name="stretch"></r-loading>
  <r-loading name="cube"></r-loading>
</ran-demo>

```html
<r-loading name="double-bounce"></r-loading>
<r-loading name="rotate"></r-loading>
<r-loading name="stretch"></r-loading>
<r-loading name="cube"></r-loading>
```

指定できる値：

`double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`

### 外部スタイル `sheet`

`sheet` 属性は生の CSS をコンポーネントの shadow root に注入し、ビルド工程なしで内部のルールを外から上書きできるようにします。

```html
<r-loading name="circle" sheet=".circle { transform: scale(1.5); }"></r-loading>
```

## スタイルの上書き

どのアニメーションも、テーマは完全に CSS 変数で決まります。`r-loading` 要素（または祖先）に設定して大きさと色を制御してください。既定の `em` ベースの指定より、`px` 単位のほうが精密に制御できます。

### 大きさの調整

```css
/* Circle */
r-loading {
  --loading-circle-width: 32px;
  --loading-circle-height: 32px;
}

/* Double-bounce */
r-loading {
  --loading-double-bounce-width: 40px;
  --loading-double-bounce-height: 40px;
}

/* Rotate */
r-loading {
  --loading-rotate-width: 48px;
  --loading-rotate-height: 48px;
}

/* Stretch */
r-loading {
  --loading-stretch-width: 60px;
  --loading-stretch-height: 72px;
}
```

### 色の調整

```css
/* Circle */
r-loading {
  --loading-circle-container-div-background: #1890ff;
}

/* Double-bounce */
r-loading {
  --loading-double-bounce1-background: #52c41a;
  --loading-double-bounce2-background: #52c41a;
}

/* Rotate */
r-loading {
  --loading-rotate-background: #faad14;
}

/* Stretch */
r-loading {
  --loading-stretch-div-background-color: #f5222d;
}
```

### 実際の例

<ran-demo>
  <r-loading name="circle" style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"></r-loading>
  <r-loading name="rotate" style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"></r-loading>
</ran-demo>

```html
<r-loading
  name="circle"
  style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"
></r-loading>
<r-loading
  name="rotate"
  style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"
></r-loading>
```

### よく使う CSS 変数

アニメーションの種類ごとに独自のトークン名前空間があります。よく使うものは次のパターンに従います。

| 変数                                    | 既定値    | 説明                                    |
| --------------------------------------- | --------- | --------------------------------------- |
| `--loading-{type}-width`                | `4em`     | アニメーションの幅（`px` 単位を推奨）   |
| `--loading-{type}-height`               | `4em`     | アニメーションの高さ（`px` 単位を推奨） |
| `--loading-{type}-background`           | `#4096ff` | 主な背景色                              |
| `--loading-{type}-div-background-color` | `#4096ff` | 子要素の背景色                          |

> `{type}` は具体的なアニメーション名（`circle`、`double-bounce`、`rotate` など）に置き換えてください。基本の色はテーマトークン `--ran-color-primary`、`--ran-color-success`、`--ran-color-text` を既定として辿ります。

## CSS Part

どのアニメーションも、自身のルート要素を `name` の値と同じ名前の `::part()` として公開するので、shadow DOM の外から狙えます。

```css
r-loading::part(rotate) {
  filter: drop-shadow(0 0 4px currentColor);
}
```

Part の名前：`double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`。`solar` のアニメーションは、さらに `sun` という part も公開します。

## スロット

ありません。コンポーネントはアニメーションをすべて shadow DOM で描画し、light DOM の子を投影しません。

## イベント

ありません。カスタムイベントは派発しません。

## すべてのローディングアニメーション

<Loading />

## ベストプラクティス

- **場面に合わせて選ぶ**：文脈と作業の速さに合ったアニメーションを選んでください。
- **CSS 変数**：要素で包むのではなく、`--loading-{type}-*` のトークンで大きさと色を調整します。
- **サイズ**：予測しやすい寸法のため、既定の `em` より `px` 単位を優先してください。
- **性能**：一つの画面で多数のアニメーションを同時に描画するのは避けてください。
- **必要な分だけ読み込む**：各アニメーションは独立した遅延チャンク（自前の JS + CSS）です。`name` を設定すると、使う variant だけが読み込まれ、一つを参照しても残る 28 個が同梱されることはありません。既定の `circle` と頻出の `dot` は即時かつちらつかない初回描画のため組み込み済みで、残りは初回使用時に非同期で読み込まれます。使い方は変わりません。`name` を設定するだけです。
- **テーマ**：基本の色は `--ran-color-*` のテーマトークンに従うので、アニメーションはライトとダークに自動で馴染みます。
