---
description: '彩度・明度、色相、透明度のコントロールと HEX/RGB の入力欄を持つパネルを開く、小さなカラースウォッチ。'
---

# Color Picker

彩度・明度のパレット、色相スライダー、透明度スライダー、HEX/RGB の値入力を備えたポップオーバーを開く、小さなカラースウォッチです。`value` は標準的な CSS の色文字列を受け取り、返します。

> **使いどころ**：彩度・色相・透明度のパネルと HEX/RGB 入力で色を選ばせたいとき。`<r-colorpicker>` は標準的な CSS の色文字列を受け取って返し、`change` ではすべての表現形式を報告します。

## クイックスタート

### 基本的な使い方

<ran-demo align="start">
  <r-colorpicker value="#006bff"></r-colorpicker>
  <r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
</ran-demo>

```html
<r-colorpicker value="#006bff"></r-colorpicker> <r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
```

スウォッチをクリックする（またはフォーカスして Enter / Space を押す）とパネルが開きます。色相と透明度のスライダーはキーボードでも操作できます。矢印キーで 1 ずつ、Shift + 矢印で 10 ずつ動き、Home / End で両端へ飛びます。

## API リファレンス

### プロパティ

| プロパティ | 型        | 既定値  | 説明                                                                       |
| ---------- | --------- | ------- | -------------------------------------------------------------------------- |
| `value`    | `string`  | `''`    | 現在の色。CSS の色文字列（HEX、`rgb(...)`、`rgba(...)`）                   |
| `disabled` | `boolean` | `false` | 付いているとスウォッチは開かず、タブ順から外れ、`aria-disabled` が付きます |
| `sheet`    | `string`  | `''`    | コンポーネントの shadow DOM に注入する CSS                                 |

### 値 `value`

現在の色を CSS の色文字列で表します。入力としては HEX（`#1677FF`、`#fff`）、`rgb(...)`、`rgba(...)` を受け付けます。読み出しの正規形は、完全に不透明なら 6 桁の HEX 文字列、透明度が 1 未満なら `rgba(...)` の文字列です。

<ran-demo align="start">
  <r-colorpicker value="#00c853"></r-colorpicker>
  <r-colorpicker value="rgb(22, 119, 255)"></r-colorpicker>
  <r-colorpicker value="rgba(255, 0, 0, 0.5)"></r-colorpicker>
</ran-demo>

```html
<r-colorpicker value="#00c853"></r-colorpicker>
<r-colorpicker value="rgb(22, 119, 255)"></r-colorpicker>
<r-colorpicker value="rgba(255, 0, 0, 0.5)"></r-colorpicker>
```

```js
const picker = document.createElement('r-colorpicker');
picker.value = '#00c853';
console.log(picker.value); // 現在の色を読み出します
toolbar.append(picker);
```

### 無効化 `disabled`

`disabled` 属性を付けるとピッカーは反応しなくなります。スウォッチはマウスでもキーボードでもパネルを開かず、タブ順から外れ、ホストに `aria-disabled="true"` が付きます。属性を外せば通常どおりに戻ります。

<ran-demo align="start">
  <r-colorpicker value="#006bff" disabled></r-colorpicker>
  <r-colorpicker value="rgba(255, 0, 0, 0.5)" disabled></r-colorpicker>
</ran-demo>

```html
<r-colorpicker value="#006bff" disabled></r-colorpicker>
```

```js
const picker = document.createElement('r-colorpicker');
picker.disabled = true; // 操作を止める
picker.disabled = false; // 再び有効にする
toolbar.append(picker);
```

### 外部スタイル `sheet`

コンポーネントの shadow DOM に注入する CSS です。ranui のどのコンポーネントとも同じ `sheet` の作法に従います。

```html
<r-colorpicker value="#006bff" sheet=".ran-colorpicker { border-radius: 6px; }"></r-colorpicker>
```

## イベント

### `change`

色が変わるたびに発生します。パレットのドラッグ、スライダーの移動、値入力の編集、`value` 属性の設定のいずれでも起きます。**バブリング**し、**composed**（shadow の境界を越える）です。`event.detail` は色をすべての形式で運びます。

| フィールド | 型       | 例                                        |
| ---------- | -------- | ----------------------------------------- |
| `value`    | `string` | `"#1677ff"` / `"rgba(22, 119, 255, 0.5)"` |
| `hex`      | `string` | `"#1677ff"`                               |
| `rgb`      | `string` | `"rgb(22, 119, 255)"`                     |
| `rgba`     | `string` | `"rgba(22, 119, 255, 0.5)"`               |
| `alpha`    | `number` | `0.5`                                     |

```html
<r-colorpicker value="#1677ff"></r-colorpicker>

<script>
  const picker = document.createElement('r-colorpicker');
  picker.addEventListener('change', (e) => {
    console.log(e.detail.hex, e.detail.alpha);
  });
  toolbar.append(picker);
</script>
```

## CSS Part

トリガーのスウォッチは、shadow DOM の外からスタイルを当てるための part を二つ公開しています。

| Part     | 説明                                           |
| -------- | ---------------------------------------------- |
| `block`  | スウォッチのコンテナ（市松模様を背景に持つ箱） |
| `swatch` | 現在の色を示す内側の塗り                       |

```css
r-colorpicker::part(block) {
  box-shadow: 0 0 0 1px var(--line);
}
```

ポップオーバーのパネルは `document.body` へポータルされるので、そのスタイルは名前空間つき（`.ran-color-picker-*`）で、ホストではなくパネルとともに移動します。

### CSS 変数

トリガーのスウォッチは次のトークンを読みます。

| 変数                                    | 用途                     |
| --------------------------------------- | ------------------------ |
| `--ran-colorpicker-background`          | スウォッチの背景         |
| `--ran-colorpicker-border`              | スウォッチの枠線         |
| `--ran-colorpicker-hover-border-color`  | ホバー時の枠線の色       |
| `--ran-colorpicker-border-radius`       | スウォッチの角の丸み     |
| `--ran-colorpicker-block-border-radius` | 内側のブロックの角の丸み |
| `--ran-colorpicker-transition`          | ホバーのトランジション   |

```css
r-colorpicker {
  --ran-colorpicker-border-radius: 6px;
}
```

## ベストプラクティス

- **入力の形式**：`value` には CSS の色文字列なら何でも渡せます。HEX、`rgb(...)`、`rgba(...)` のいずれも、ピッカーが内部で正規化します。
- **結果の読み取り**：`change` を購読し、必要な形式を `event.detail` から読んでください（`hex`、`rgb`、`rgba`、`alpha`）。
- **透明度**：透明度が必要なときは `rgba(...)` を入力するか透明度スライダーを使います。透明度が 1 を下回ると、読み出される `value` は `rgba(...)` の文字列になります。
- **キーボード**：スウォッチも二つのスライダーもフォーカスでき、キーボードで操作できます。マウスは要りません。
- **読み込み**：`import 'ranui'`（すべてのコンポーネントを登録）または単体の `import 'ranui/colorpicker'` で読み込みます。
