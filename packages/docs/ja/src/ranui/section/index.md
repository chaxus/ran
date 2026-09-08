---
description: '見出しと副題（いずれも任意）をスロット本文の上に置く、ページ区画の面。'
---

# Section

見出しと副題（いずれも任意）をスロット本文の上に置く、ページ区画の面です。

> **使いどころ**：ページの主要な領域に、アクセシブルなレベル 2 見出しと任意の副題で名前を付けたいとき。`<r-section>` が見出し行と本文の面を用意します。

## クイックスタート

### 基本的な使い方

<ran-demo column>
  <r-section heading="区画の見出し" subtitle="この区画を説明する短い一行。">
    <p style="margin: 0;">本文はデフォルトスロットに入ります。</p>
  </r-section>
</ran-demo>

```html
<r-section heading="区画の見出し" subtitle="この区画を説明する短い一行。">
  <p>本文はデフォルトスロットに入ります。</p>
</r-section>
```

## API リファレンス

### プロパティ

| プロパティ | 型       | 既定値 | 説明                                           |
| ---------- | -------- | ------ | ---------------------------------------------- |
| `heading`  | `string` | `''`   | 区画の見出し。ARIA のレベル 2 見出しとして描画 |
| `subtitle` | `string` | `''`   | 見出しの下に添える一行                         |
| `sheet`    | `string` | `''`   | 区画の shadow DOM に注入する CSS               |

`heading` と `subtitle` がどちらも空のときは、見出し行そのものが隠れます。

### 見出し `heading`

区画の見出しで、ARIA のレベル 2 見出し（`role="heading"`、`aria-level="2"`）として描画されます。空なら隠れます。

<ran-demo column>
  <r-section heading="見出しだけ">
    <p style="margin: 0;">本文。</p>
  </r-section>
</ran-demo>

```html
<r-section heading="見出しだけ">
  <p>本文。</p>
</r-section>
```

### 副題 `subtitle`

見出しの下に添える一行です。空なら隠れます。

<ran-demo column>
  <r-section heading="見出し" subtitle="補足の副題テキスト。">
    <p style="margin: 0;">本文。</p>
  </r-section>
</ran-demo>

```html
<r-section heading="見出し" subtitle="補足の副題テキスト。">
  <p>本文。</p>
</r-section>
```

### Shadow の CSS `sheet`

区画の shadow DOM に注入する CSS です。ranui のどのコンポーネントとも同じ `sheet` の作法に従います。

<ran-demo column>
  <r-section heading="テーマを当てた区画" subtitle="sheet で見出しの色を変えています。" sheet=".ran-section-heading { color: #006bff; }">
    <p style="margin: 0;">本文。</p>
  </r-section>
</ran-demo>

```html
<r-section heading="テーマを当てた区画" sheet=".ran-section-heading { color: #006bff; }">
  <p>本文。</p>
</r-section>
```

## スロット

| スロット       | 説明                               |
| -------------- | ---------------------------------- |
| _(デフォルト)_ | 本文。見出し行の下に描画されます。 |

## CSS Part

| Part       | 説明                                   |
| ---------- | -------------------------------------- |
| `header`   | 見出しと副題を包む見出し行             |
| `heading`  | ARIA レベル 2 の見出し要素             |
| `subtitle` | 補足の副題の行                         |
| `body`     | デフォルトスロットを包む本文のラッパー |

公開している CSS 変数：`--ran-section-border-color`、`--ran-section-radius`、`--ran-section-background`、`--ran-section-shadow`、`--ran-section-padding`、`--ran-section-heading-color`、`--ran-section-heading-font-size`、`--ran-section-heading-font-weight`、`--ran-section-subtitle-color`。

```css
r-section {
  --ran-section-background: var(--surface-1);
  --ran-section-padding: 32px;
  --ran-section-heading-color: var(--text-strong);
}
r-section::part(subtitle) {
  max-width: 48ch;
}
```

## ベストプラクティス

- **区画の見出し**：ページの主要な領域ごとに `heading` を設定して名前を付けます。
- **文脈**：短い補足には `subtitle` を使います。両方を省けば、見出し行のない素の面になります。
- **アクセシビリティ**：見出しは ARIA のレベル 2 見出しとして公開され、文書のアウトラインに加わります。意味のある見出しを付けてください。
- **テーマ**：再利用できるスタイルには `sheet` 属性より `--ran-section-*` の CSS 変数か `::part()` セレクターを優先してください。
