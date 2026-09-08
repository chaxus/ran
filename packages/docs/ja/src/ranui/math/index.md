---
description: 'Temml を使って LaTeX の数式をネイティブ MathML として描画します。canvas も SVG も KaTeX ランタイムも使いません。'
---

# Math

Temml を使って HTML ページ上に高品質な LaTeX 数式を描画します。ネイティブの MathML へ直接コンパイルします。

> **使いどころ**：HTML ページの中で LaTeX の数式をディスプレイ数式として描画したいとき。`<r-math>` は `latex` 属性の式を [Temml](https://temml.org/) で組版します。Temml は LaTeX を MathML にコンパイルし、レイアウトはブラウザ自身が行います（canvas も SVG も KaTeX ランタイムもありません）。

## クイックスタート

### 基本的な使い方

<ran-demo>
  <r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
</ran-demo>

```html
<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
```

## API リファレンス

### プロパティ

| プロパティ | 型        | 既定値    | 説明                                                                                               |
| ---------- | --------- | --------- | -------------------------------------------------------------------------------------------------- |
| `latex`    | `string`  | `''`      | 描画する LaTeX の式。式はこの属性で与えます。スロットのテキストではありません。                    |
| `display`  | `string`  | `'block'` | `block`（ディスプレイ数式）または `inline`（インライン数式）。                                     |
| `font`     | `string`  | `''`      | `system` にすると同梱の Latin Modern Math を使わず、読み手のシステム数式フォントを使います。       |
| `macros`   | `string`  | `''`      | Temml のマクロを表す JSON オブジェクト。不正な JSON は黙って無視されます。                         |
| `wrap`     | `string`  | `''`      | Temml のソフト改行：`none`、`tex`、`=`。                                                           |
| `copy`     | `boolean` | `false`   | コピーボタンを表示します。`copy` 単体は LaTeX ソースを、`copy="mathml"` は MathML をコピーします。 |
| `download` | `boolean` | `false`   | ソース（`.tex`）や MathML（`.mml`）のダウンロードボタン／メニューを表示します。                    |
| `sheet`    | `string`  | `''`      | コンポーネントの shadow DOM に注入する CSS。                                                       |

> 💡 **メモ**：`latex` プロパティのゲッターは値を `decodeURIComponent` で復号するので、URI エンコードされた式は描画前に復号されます。スロットのテキストとして式を渡しても効果はありません。描画されるのは `latex` 属性だけです。

### 式 `latex`

<ran-demo>
  <r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
</ran-demo>

```html
<r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
```

### 外部スタイル `sheet`

<ran-demo>
  <r-math latex="e^{i\pi} + 1 = 0" sheet=".ran-math { justify-content: flex-start; }"></r-math>
</ran-demo>

```html
<r-math latex="e^{i\pi} + 1 = 0" sheet=".ran-math { justify-content: flex-start; }"></r-math>
```

## イベント

| イベント   | detail                             | 発生するとき                                                 |
| ---------- | ---------------------------------- | ------------------------------------------------------------ |
| `render`   | `{ ok: true }`                     | 式の描画に成功した。                                         |
| `error`    | `{ message: string }`              | Temml が式を解析できなかった（不正な LaTeX など）。          |
| `copied`   | `{ kind: 'source' \| 'mathml' }`   | コピーボタンがソースまたは MathML をクリップボードへ写した。 |
| `download` | `{ format: 'source' \| 'mathml' }` | ダウンロードボタンが `.tex` か `.mml` を保存した。           |

## スタイリング

`<r-math>` は自前の **CSS カスタムプロパティを 16 個**、そしてテーマから読むセマンティックトークンを公開しています。継承が届く場所ならどこにでも設定できます（`:root`、外側のコンテナ、要素そのもの）。

```css
r-math {
  --ran-math-error-background: var(--ran-color-bg-subtle);
}
```

Part：`button` · `error` · `math` · `menu` · `render` · `toolbar`

一覧は[スタイルトークン](/ja/src/ranui/style-tokens#math)に、どのトークンを使うかは[デザインシステム](/ja/src/ranui/design-system/)にあります。

## ベストプラクティス

- **式は `latex` で渡す**：式は `latex` 属性に設定します。スロットのテキストは描画されません。
- **JavaScript ではバックスラッシュをエスケープする**：JS の文字列リテラルから `latex` に代入するときは `\` のエスケープを忘れずに（例：`'\\frac{1}{2}'`）。
- **解析失敗に備える**：すべての式が正しい LaTeX だと決めてかからず、`error` を購読する（あるいは描画された `::part(error)` の箱を見る）ようにします。
- **`sheet` で独自のレイアウトに**：内部の `.ran-math` のレイアウトを上書きしたいときは `sheet` 属性を使います。
