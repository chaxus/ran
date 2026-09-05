---
description: 'ヘッダー・本文・フッターの領域を持つ構造化されたコンテンツ容器。関連する内容をまとめる、Geist 風の枠線つきの面です。'
---

# Card

ヘッダー・本文・フッターの領域を持ち、関連する内容をまとめる構造化されたコンテンツ容器です。カードは Geist 風の枠線つきの面（ページの背景に 1px の枠線であって、灰色の塗りではありません）で、`hoverable` を明示しない限りホバーしても反応しません。

> **使いどころ**：関連する内容を、タイトル・説明・本文・フッターの領域を持つ枠線つきの面にまとめたいとき。`<r-card>` はそれらのスロットに加えて、任意の `hoverable` な操作状態も用意します。

## クイックスタート

### 基本的な使い方

<Demo>
  <r-card heading="カードのタイトル" description="任意の副題" style="max-width: 360px;">
    <span slot="extra" style="font-size: 12px;">tag</span>
    <p style="margin: 0;">本文はデフォルトスロットに入ります。</p>
    <a slot="footer" href="#">メモを見る</a>
  </r-card>
</Demo>

```html
<r-card heading="カードのタイトル" description="任意の副題">
  <span slot="extra">tag</span>
  <p>本文はデフォルトスロットに入ります。</p>
  <a slot="footer" href="#">メモを見る</a>
</r-card>
```

## API リファレンス

### プロパティ

| プロパティ    | 型        | 既定値  | 説明                                                                 |
| ------------- | --------- | ------- | -------------------------------------------------------------------- |
| `heading`     | `string`  | `''`    | カードの見出し。ヘッダーの上部に出ます。空なら隠れます。             |
| `description` | `string`  | `''`    | タイトルの下に描かれる副題。空なら隠れます。                         |
| `hoverable`   | `boolean` | `false` | 操作できるカード。ホバーで枠線が濃くなり、浮き上がった影になります。 |
| `sheet`       | `string`  | `''`    | カードの shadow DOM に注入する CSS。                                 |

### 見出し `heading`

カードの見出しで、ヘッダーの上部に出ます。空なら隠れます。

<Demo>
  <r-card heading="見出しだけ" style="max-width: 360px;">
    <p style="margin: 0;">本文。</p>
  </r-card>
</Demo>

```html
<r-card heading="見出しだけ">
  <p>本文。</p>
</r-card>
```

### 説明 `description`

タイトルの下に描かれる副題です。空なら隠れます。`title` も `description` も設定していないときは、ヘッダー全体が隠れます。

<Demo>
  <r-card heading="タイトル" description="短い補足の副題" style="max-width: 360px;">
    <p style="margin: 0;">本文。</p>
  </r-card>
</Demo>

```html
<r-card heading="タイトル" description="短い補足の副題">
  <p>本文。</p>
</r-card>
```

### 操作できるカード `hoverable`

カードは既定ではホバーに反応しません。実際にクリックできるカードにだけ `hoverable` 属性を付けてください。ホバーすると枠線がグレーの段階を一つ濃くし（`--ran-color-border` → `--ran-color-border-hover`）、面は控えめな浮き上がりの影（`--ran-shadow-elevated`）をまといます。

<Demo>
  <r-card hoverable heading="ホバーできるカード" description="マウスを乗せてみてください" style="max-width: 360px; cursor: pointer;">
    <p style="margin: 0;">枠線が濃くなり、カードがわずかに浮き上がります。</p>
  </r-card>
</Demo>

```html
<r-card hoverable heading="ホバーできるカード" description="マウスを乗せてみてください">
  <p>枠線が濃くなり、カードがわずかに浮き上がります。</p>
</r-card>
```

`hoverable` は純粋に見た目のものです。クリックに反応するカードにだけ付け、操作できないカードは反応しないままにしてください。

### 外部スタイル `sheet`

カードの shadow DOM に注入する CSS です。ranui のどのコンポーネントとも同じ `sheet` の作法に従います。

```html
<r-card heading="テーマを当てたカード" sheet=".ran-card { background: #f6ffed; }">
  <p>本文。</p>
</r-card>
```

## スロット

| スロット       | 説明                                                               |
| -------------- | ------------------------------------------------------------------ |
| _(デフォルト)_ | 本文。カードの本文領域に描かれます。                               |
| `extra`        | ヘッダーの右側。バッジ、リンク、操作など。                         |
| `footer`       | フッターの内容。このスロットにノードが入るまでフッターは隠れます。 |

## CSS Part

カードは外部からのスタイル当てのために、次の `::part()` を公開しています。

| Part          | 説明                                  |
| ------------- | ------------------------------------- |
| `card`        | カードの外側のコンテナ。              |
| `header`      | ヘッダーの行。                        |
| `title`       | タイトルのテキスト。                  |
| `description` | 副題のテキスト。                      |
| `extra`       | ヘッダーの `extra` スロット。         |
| `body`        | 本文の領域（デフォルトスロット）。    |
| `footer`      | フッターの領域（`footer` スロット）。 |

上書きできる CSS 変数：`--ran-card-display`、`--ran-card-min-height`、`--ran-card-gap`、`--ran-card-padding`、`--ran-card-radius`、`--ran-card-background`、`--ran-card-border-color`、`--ran-card-shadow`、`--ran-card-hover-border-color`、`--ran-card-hover-shadow`（後ろの二つは `hoverable` のときに効きます）、`--ran-card-title-color`、`--ran-card-title-font-size`、`--ran-card-title-font-weight`、`--ran-card-description-color`、`--ran-card-description-font-size`。

```css
r-card {
  --ran-card-background: var(--surface-2);
  --ran-card-radius: 12px;
  --ran-card-min-height: 148px;
}
r-card::part(header) {
  border-bottom: 1px solid var(--line);
}
```

## イベント

カードは受け身の容器で、カスタムイベントは派発しません。

## ベストプラクティス

- **タイトルと説明**：見出しには `title` を、短い補足には `description` を使います。両方を省けばヘッダーはまるごと隠れます。
- **本文**：主要な内容はデフォルトスロットに置きます。
- **ヘッダーの操作**：ヘッダーの右端に寄せるバッジ、リンク、操作には `extra` スロットを使います。
- **フッター**：副次的な操作やリンクには `footer` スロットを使います。中身をスロットに入れるまで隠れたままです。
- **ホバーの手応え**：クリックできるカードにだけ `hoverable` を付けてください。操作できないカードはホバーに反応してはいけません。
- **テーマ**：再利用できるスタイルには `sheet` 属性より CSS 変数と `::part()` を優先します。
