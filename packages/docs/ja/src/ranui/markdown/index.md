---
description: 'ストリーミングに強い Markdown レンダラーの Web Component。途中まで届いた markdown を閉じ、変わったブロックだけ描き直し、コード（shiki）・Mermaid 図・数式を埋め込みます。'
---

<script setup>
const quick = `# こんにちは

**太字**、*斜体*、[リンク](https://github.com/chaxus/ran)、そして \`インラインコード\`。

\`\`\`ts
const greet = (name: string): string => \`Hi \${name}\`;
\`\`\`

| 機能 | 対応 |
| --- | --- |
| ストリーミング | ✅ |
| Mermaid / 数式 | ✅ |`;
const partial = '打ちかけの *強調*、`インラインコード`、そして **まだ届いている途中の太字';
const code = `\`\`\`python
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(10))
\`\`\``;
const rich = `\`\`\`mermaid
graph LR; A[Prompt] --> B[Model]; B --> C[Tokens]; C --> D[r-markdown]
\`\`\`

$$
E = mc^2
$$

インラインの \\(e^{i\\pi} + 1 = 0\\) は文章の中を流れます。`;
</script>

# Markdown

Markdown（**トークン単位で届く AI の出力**も含めて）を、フレームワークに依存しない Web Component として描画します。`<r-markdown>` は Vercel の [Streamdown](https://streamdown.ai) を手本にしています。テキストが流れ込んでくるあいだ、打ちかけの `**bold`、`` `code ``、リンク、`$$` の数式をその場で閉じ、文書をブロックに分割して**変わったブロックだけ**を描き直します。だから長い回答でも、トークンが届くたびに先頭から読み直すことはありません。

` ```mermaid ` のフェンスは [`<r-mermaid>`](/ja/src/ranui/mermaid/) に、数式は [`<r-math>`](/ja/src/ranui/math/) になり、コードは shiki でハイライトできます。どれも、内容が実際に必要とした最初のときに遅延読み込みされます。出力は DOMPurify でサニタイズされます。

> **こんなときに**：自分が完全には制御していない Markdown（チャットの返信、LLM のストリーム、ユーザーのコメント、ドキュメント）を表示したくて、ストリーミング、コード・図・数式への対応、安全な HTML を、パーサーとサニタイザーとハイライターを自分で組み合わせずに手に入れたいとき。

## クイックスタート

<Demo>
  <r-markdown copy highlight :content.prop="quick"></r-markdown>
</Demo>

```html
<r-markdown copy highlight content="# こんにちは ..."></r-markdown>
```

```js
import 'ranui'; // または単体のエントリー：
import 'ranui/markdown';
```

ソースは **`content` プロパティ**（推奨。属性には反映されないので、長い回答をストリーミングしても DOM がかき回されません）、`content` 属性、または要素のテキスト内容から読み取られます。

```js
const el = document.createElement('r-markdown');
el.setAttribute('caret', ''); // ストリーミング中に点滅するキャレットを出す
for await (const chunk of stream) {
  el.content += chunk; // 最後のブロックだけが描き直される
}
el.removeAttribute('caret');
container.append(el);
```

## ストリーミング

`mode="streaming"`（既定）は、まずテキストを [remend](https://www.npmjs.com/package/remend)（Streamdown から取り出された、未完成 markdown の終端処理）に通します。そのため受信途中の `**bold` はアスタリスクそのままではなく太字として描画され、`[text](https://exa` は URL が閉じるまで素のテキストのままで、`- ` が直前の段落を見出しに変えてしまうこともありません。完成した文書ではこの処理を飛ばして一気に描画するために `mode="static"` を設定してください。

<Demo>
  <r-markdown caret :content.prop="partial"></r-markdown>
</Demo>

```html
<r-markdown caret content="打ちかけの *強調*、`インラインコード`、そして **まだ届いている途中の太字"></r-markdown>
```

- **キャレット**：`caret` は点滅する `▋` を、`caret="circle"` は `●` を、最後のブロックのあとに出します。コードフェンスが開いたままのときや、最後のブロックが表のときは自動的に隠れます。
- **未完成のコードフェンス**は、閉じるフェンスが届くまで素のまま（ハイライトのちらつきも、描きかけの図もなし）です。そのあいだコンテナには `data-incomplete` が付きます。

## コードブロック

どのコードブロックにも言語名のヘッダーが付き、任意でコピー／ダウンロードのボタンを出せます。[shiki](https://shiki.style) でシンタックスハイライトするには `highlight` を付けてください（遅延読み込み。言語も必要になったときに読み込まれ、既定のテーマは `github-light` / `github-dark` でページのテーマに追随します）。

<Demo>
  <r-markdown copy download line-numbers highlight :content.prop="code"></r-markdown>
</Demo>

```html
<r-markdown copy download line-numbers highlight></r-markdown>
<!-- テーマを選ぶ： light dark -->
<r-markdown highlight="vitesse-light vitesse-dark"></r-markdown>
```

## Mermaid と数式

<Demo>
  <r-markdown :content.prop="rich"></r-markdown>
</Demo>

- ` ```mermaid ` → `<r-mermaid>`（全画面表示つき。`copy` / `download` はそのまま渡されます）。
- `$$…$$`、`\[…\]`、` ```math ` → ブロックの `<r-math>`。`\(…\)` → インライン。ドル記号ひとつの `$…$` は通貨と紛らわしいため、`inline-math` による**明示的な有効化**が必要です。

## API リファレンス

### 属性

| 属性           | 型                                 | 既定値        | 説明                                                                                                                                       |
| -------------- | ---------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `content`      | `string`                           | —             | Markdown のソース。`content` **プロパティ**が優先され、属性には反映されません。どちらもなければ要素のテキスト内容を使います。              |
| `mode`         | `'streaming' \| 'static'`          | `'streaming'` | `streaming` は未完成の markdown を閉じ、ブロック単位で差分をとります。`static` は全文をそのまま一度で描画します。                          |
| `caret`        | 真偽値 / `'circle'`                | 無効          | 最後のブロックのあとに点滅するキャレット（`▋`、`circle` なら `●`）。                                                                       |
| `copy`         | 真偽値                             | 無効          | コードブロックにコピーボタン（埋め込まれた `<r-mermaid>` にも渡されます）。                                                                |
| `download`     | 真偽値                             | 無効          | コードブロックにダウンロードボタン（言語に応じた `code.<ext>`）。                                                                          |
| `line-numbers` | 真偽値                             | 無効          | コードブロックに行番号。                                                                                                                   |
| `highlight`    | 真偽値 / `"light dark"` のテーマ名 | 無効          | shiki によるハイライト。裸なら `github-light github-dark`、1 つなら両方に、2 つならライト／ダークに使われます。                            |
| `inline-math`  | 真偽値                             | 無効          | `$…$` をインライン数式として扱います（`\(…\)` は常にインラインです）。                                                                     |
| `link-target`  | `string`                           | `'_blank'`    | 外部リンクの `target`（`rel="noopener noreferrer"` も付きます）。`_self` ならリンクに手を加えません。ページ内の `#anchor` には付きません。 |
| `theme`        | `'auto' \| 'light' \| 'dark'`      | `'auto'`      | ハイライトと図のテーマ。`auto` はページに追随します（`.dark`、`[data-ran-theme]`、なければ `prefers-color-scheme`）。                      |
| `sheet`        | `string`                           | —             | シャドウルートに注入する追加の CSS。                                                                                                       |
| `label-*`      | `string`                           | 英語          | コントロールのラベルを上書きします：`label-copy`、`label-download`。                                                                       |

プロパティの別名：`content`、`mode`、`caret`、`copyable`、`downloadable`、`lineNumbers`、`highlight`、`inlineMath`、`linkTarget`、`theme`、`sheet`。

## イベント

すべてのイベントはバブリングし、シャドウ境界を越えます（`composed`）。

| イベント   | `detail`                               | 発火するとき                                   |
| ---------- | -------------------------------------- | ---------------------------------------------- |
| `render`   | `{ blocks: number, changed: number }`  | 描画で少なくとも 1 ブロックが変わった          |
| `copied`   | `{ kind: 'code', language, code }`     | コードブロックがコピーされた                   |
| `download` | `{ kind: 'code', language, filename }` | コードブロックがダウンロードされた             |
| `error`    | `{ message: string }`                  | 解析・描画に失敗した（その場にも表示されます） |

## CSS parts

| Part           | 説明                                 |
| -------------- | ------------------------------------ |
| `markdown`     | 外側のラッパー。                     |
| `body`         | ブロックのコンテナ。                 |
| `block`        | 描画された各ブロック。               |
| `code`         | コードブロックのコンテナ。           |
| `code-header`  | コードブロックの言語／操作バー。     |
| `code-lang`    | 言語のラベル。                       |
| `code-actions` | 操作ボタンのまとまり。               |
| `button`       | コピー／ダウンロードの各ボタン。     |
| `table`        | 横スクロールする表のラッパー。       |
| `error`        | エラー表示のボックス（描画失敗時）。 |

```css
r-markdown::part(code) {
  border-radius: 8px;
}
```

## CSS 変数

要素の上で上書きできます（それぞれセマンティックトークン、さらにリテラルへとフォールバックします）：`--ran-markdown-color`、`--ran-markdown-font-size`、`--ran-markdown-line-height`、`--ran-markdown-gap`、`--ran-markdown-heading-color`、`--ran-markdown-link-color`、`--ran-markdown-inline-code-bg`、`--ran-markdown-code-bg`、`--ran-markdown-code-border`、`--ran-markdown-code-radius`、`--ran-markdown-code-font-size`、`--ran-markdown-mono-font`、`--ran-markdown-blockquote-border`、`--ran-markdown-table-border`、`--ran-markdown-table-header-bg`、`--ran-markdown-caret`、`--ran-markdown-caret-color`、`--ran-markdown-button-color`、`--ran-markdown-error-color`。

## 補足

- **遅延読み込み**：パーサーのチャンク（marked + DOMPurify + remend）は最初の描画時に読み込まれ、shiki・mermaid・Temml はそれぞれ内容が使ったときにだけ読み込まれます。markdown をまったく描画しないアプリの負担はゼロです。
- **サニタイズ済み**：markdown 内の生の HTML は DOMPurify を通ります。スクリプト、イベントハンドラー、`javascript:` の URL、`<style>`、フォーム、iframe は取り除かれます。タスクリストのチェックボックスは残ります。
- **ブロック差分**はブロックを位置でキーにするため、触っていないブロックの中の DOM の状態（開いたままの全画面図、スクロール位置を保った表）はストリーミング更新をまたいで残ります。文書は一度だけ字句解析され、各ブロックは自分のトークンから描画されるので、リンク参照定義はブロックをまたいで解決します（`[text][id]` が片方のブロック、`[id]: url` がもう片方にあっても大丈夫です）。
- **GFM の脚注**（`[^1]`）は**未対応**です。marked に脚注のトークナイザーがないため、記号はそのまま文字として描画されます。
- **shiki はあなたのインストールから解決されます。** ES ビルドは `import('shiki')` を素のまま残すので、バンドラーがコード分割し、コードフェンスが使う文法だけをダウンロードします。shiki は ranui の通常の依存なので、`npm i ranui` の時点ですでに入っています。追加で何かする必要はありません。
- **単体の IIFE**：`dist/iife/markdown.iife.js` にはリゾルバーがないため、代わりに mermaid、Temml、そして shiki の _web_ 言語バンドル（よく使う 50 前後の言語）をインライン化しています。言語を網羅したい場合やダウンロードを小さく抑えたい場合は、ES のエントリー（`ranui/markdown`）を選んでください。
