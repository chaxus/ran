---
description: 'ストリーミングに強い Markdown レンダラーの Web Component。途中まで届いた markdown を閉じ、変わったブロックだけ描き直し、コード（shiki）・Mermaid 図・数式を埋め込みます。'
---

# Markdown

Markdown（**トークン単位で届く AI の出力**も含めて）を、フレームワークに依存しない Web Component として描画します。`<r-markdown>` は Vercel の [Streamdown](https://streamdown.ai) を手本にしています。テキストが流れ込んでくるあいだ、打ちかけの `**bold`、`` `code ``、リンク、`$$` の数式をその場で閉じ、文書をブロックに分割して**変わったブロックだけ**を描き直します。だから長い回答でも、トークンが届くたびに先頭から読み直すことはありません。

` ```mermaid ` のフェンスは [`<r-mermaid>`](/ja/src/ranui/mermaid/) に、数式は [`<r-math>`](/ja/src/ranui/math/) になり、コードは shiki でハイライトできます。どれも、内容が実際に必要とした最初のときに遅延読み込みされます。出力は DOMPurify でサニタイズされます。

> **こんなときに**：自分が完全には制御していない Markdown（チャットの返信、LLM のストリーム、ユーザーのコメント、ドキュメント）を表示したくて、ストリーミング、コード・図・数式への対応、安全な HTML を、パーサーとサニタイザーとハイライターを自分で組み合わせずに手に入れたいとき。

## クイックスタート

<ran-demo>
  <r-markdown copy highlight data-content="%23%20%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF%0A%0A%2A%2A%E5%A4%AA%E5%AD%97%2A%2A%E3%80%81%2A%E6%96%9C%E4%BD%93%2A%E3%80%81%5B%E3%83%AA%E3%83%B3%E3%82%AF%5D%28https%3A%2F%2Fgithub.com%2Fchaxus%2Fran%29%E3%80%81%E3%81%9D%E3%81%97%E3%81%A6%20%60%E3%82%A4%E3%83%B3%E3%83%A9%E3%82%A4%E3%83%B3%E3%82%B3%E3%83%BC%E3%83%89%60%E3%80%82%0A%0A%60%60%60ts%0Aconst%20greet%20%3D%20%28name%3A%20string%29%3A%20string%20%3D%3E%20%60Hi%20%24%7Bname%7D%60%3B%0A%60%60%60%0A%0A%7C%20%E6%A9%9F%E8%83%BD%20%7C%20%E5%AF%BE%E5%BF%9C%20%7C%0A%7C%20---%20%7C%20---%20%7C%0A%7C%20%E3%82%B9%E3%83%88%E3%83%AA%E3%83%BC%E3%83%9F%E3%83%B3%E3%82%B0%20%7C%20%E2%9C%85%20%7C%0A%7C%20Mermaid%20%2F%20%E6%95%B0%E5%BC%8F%20%7C%20%E2%9C%85%20%7C"></r-markdown>
</ran-demo>

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

<ran-demo>
  <r-markdown caret data-content="%E6%89%93%E3%81%A1%E3%81%8B%E3%81%91%E3%81%AE%20%2A%E5%BC%B7%E8%AA%BF%2A%E3%80%81%60%E3%82%A4%E3%83%B3%E3%83%A9%E3%82%A4%E3%83%B3%E3%82%B3%E3%83%BC%E3%83%89%60%E3%80%81%E3%81%9D%E3%81%97%E3%81%A6%20%2A%2A%E3%81%BE%E3%81%A0%E5%B1%8A%E3%81%84%E3%81%A6%E3%81%84%E3%82%8B%E9%80%94%E4%B8%AD%E3%81%AE%E5%A4%AA%E5%AD%97"></r-markdown>
</ran-demo>

```html
<r-markdown caret content="打ちかけの *強調*、`インラインコード`、そして **まだ届いている途中の太字"></r-markdown>
```

- **キャレット**：`caret` は点滅する `▋` を、`caret="circle"` は `●` を、最後のブロックのあとに出します。コードフェンスが開いたままのときや、最後のブロックが表のときは自動的に隠れます。
- **未完成のコードフェンス**は、閉じるフェンスが届くまで素のまま（ハイライトのちらつきも、描きかけの図もなし）です。そのあいだコンテナには `data-incomplete` が付きます。

## コードブロック

どのコードブロックにも言語名のヘッダーが付き、任意でコピー／ダウンロードのボタンを出せます。[shiki](https://shiki.style) でシンタックスハイライトするには `highlight` を付けてください（遅延読み込み。言語も必要になったときに読み込まれ、既定のテーマは `github-light` / `github-dark` でページのテーマに追随します）。

<ran-demo>
  <r-markdown copy download line-numbers highlight data-content="%60%60%60python%0Adef%20fib%28n%3A%20int%29%20-%3E%20int%3A%0A%20%20%20%20return%20n%20if%20n%20%3C%202%20else%20fib%28n%20-%201%29%20%2B%20fib%28n%20-%202%29%0A%0Aprint%28fib%2810%29%29%0A%60%60%60"></r-markdown>
</ran-demo>

```html
<r-markdown copy download line-numbers highlight></r-markdown>
<!-- テーマを選ぶ： light dark -->
<r-markdown highlight="vitesse-light vitesse-dark"></r-markdown>
```

## Mermaid と数式

<ran-demo>
  <r-markdown data-content="%60%60%60mermaid%0Agraph%20LR%3B%20A%5BPrompt%5D%20--%3E%20B%5BModel%5D%3B%20B%20--%3E%20C%5BTokens%5D%3B%20C%20--%3E%20D%5Br-markdown%5D%0A%60%60%60%0A%0A%24%24%0AE%20%3D%20mc%5E2%0A%24%24%0A%0A%E3%82%A4%E3%83%B3%E3%83%A9%E3%82%A4%E3%83%B3%E3%81%AE%20%5C%28e%5E%7Bi%5Cpi%7D%20%2B%201%20%3D%200%5C%29%20%E3%81%AF%E6%96%87%E7%AB%A0%E3%81%AE%E4%B8%AD%E3%82%92%E6%B5%81%E3%82%8C%E3%81%BE%E3%81%99%E3%80%82"></r-markdown>
</ran-demo>

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
