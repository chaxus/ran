---
description: 'Mermaid の図（フローチャート、シーケンス、クラス、状態、ガント）を、遅延読み込みでフレームワーク非依存の Web Component として描画します。'
---

# Mermaid

[Mermaid](https://mermaid.js.org/) の図（フローチャート、シーケンス、クラス、状態、ガント…）を、
フレームワーク非依存の Web Component として描画します。`<r-mermaid>` は最初の描画時に mermaid
ライブラリを遅延読み込みし（使わないアプリは何も負担しません）、図を自分の shadow root に描くので、
ページのスタイルから隔離されます。

> **使いどころ**：mermaid の配線を自分でせずに、テキストから起こした図をどのページにも置きたいとき。
> 必要ならコピー／ダウンロード／全画面のツールバーと、パン・ズームのビューアも付きます。

## クイックスタート

<ran-demo>
  <r-mermaid>graph LR; A[Request] --> B[Validate]; B --> C[Store]; C --> D[Respond]</r-mermaid>
</ran-demo>

```html
<r-mermaid>graph LR; A[Request] --> B[Validate]; B --> C[Store]</r-mermaid>
```

```js
import 'ranui'; // あるいは単体のエントリー：
import 'ranui/mermaid';
```

図のソースは要素の**テキスト内容**から読まれます。あるいは URI エンコードされた `code` 属性からでも
読めます（構文に `<` が含まれるとき、たとえば `classDiagram` の `<|--` は HTML の解析を生き延びさせる
ため `code` を使ってください）。

```js
el.code = 'classDiagram\n  Dog --|> Animal'; // プロパティのセッターが URI エンコードします
```

## コントロール

どのコントロールも真偽値の属性による**オプトイン**です。属性のない `<r-mermaid>` はすっきりした静的な
図になります。ツールバーはホバー時に右上へ現れます。

<ran-demo>
  <r-mermaid copy download fullscreen>graph TD; A[Start] --> B[Do work]; B --> C[End]</r-mermaid>
</ran-demo>

```html
<r-mermaid copy download fullscreen>graph TD; A --> B; B --> C</r-mermaid>
```

- **copy**：図のソースをクリップボードへコピーします。
- **download**：SVG / PNG / ソース（`.mmd`）。形式が一つならそのままダウンロードし、複数ならメニューを
  出します。`download="svg"` や `download="svg png"` で絞れます。
- **fullscreen**：ヘッダーのないライトボックス（r-modal）を開き、**パンとズーム**ができます（ホイールで
  ズーム、ドラッグでパン、リセットあり）。閉じるのは ✕、背景のクリック、または `Esc` です。

## API リファレンス

### 属性

| 属性         | 型                            | 既定値   | 説明                                                                                                                                                                            |
| ------------ | ----------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code`       | `string`（URI エンコード）    | —        | 図のソース。無いときは要素のテキスト内容にフォールバックします。                                                                                                                |
| `theme`      | `'auto' \| 'light' \| 'dark'` | `'auto'` | mermaid のテーマ。`auto` はページ（`.dark` / `[data-ran-theme]`）に追従し、切り替え時に再描画します。                                                                           |
| `copy`       | boolean                       | off      | ソースをコピーするボタンを表示します。                                                                                                                                          |
| `download`   | boolean / `"svg png source"`  | off      | ダウンロードボタンを表示します。値で提供する形式を絞れます。                                                                                                                    |
| `fullscreen` | boolean                       | off      | 全画面ボタンを表示します。                                                                                                                                                      |
| `sheet`      | `string`                      | —        | shadow root に注入する追加の CSS。                                                                                                                                              |
| `label-*`    | `string`                      | 英語     | コントロールのラベルを上書き：`label-copy`、`label-download`、`label-fullscreen`、`label-zoom-in`、`label-zoom-out`、`label-reset`、`label-diagram`（全画面ダイアログの名前）。 |

## イベント

すべてのイベントはバブリングし、shadow の境界を越えます（`composed`）。

| イベント           | `detail`                                 | 発生するとき                     |
| ------------------ | ---------------------------------------- | -------------------------------- |
| `render`           | `{ ok: true }`                           | 図の描画が終わった               |
| `copied`           | `{ kind: 'source' }`                     | ソースがコピーされた             |
| `download`         | `{ format: 'svg' \| 'png' \| 'source' }` | ファイルがダウンロードされた     |
| `error`            | `{ message: string }`                    | 図の解析／描画に失敗した         |
| `fullscreenchange` | `{ open: boolean }`                      | 全画面のライトボックスが開閉した |

## CSS Part

| Part      | 説明                                 |
| --------- | ------------------------------------ |
| `mermaid` | 外側のラッパー。                     |
| `diagram` | 描画された図のコンテナ。             |
| `toolbar` | ホバーで出るコントロールバー。       |
| `button`  | ツールバーの各アイコンボタン。       |
| `error`   | エラーメッセージの箱（描画失敗時）。 |

```css
r-mermaid::part(toolbar) {
  background: var(--surface);
}
```

## CSS 変数

要素の上で上書きします（それぞれセマンティックトークン、さらにリテラルへとフォールバックします）：
`--ran-mermaid-padding`、`--ran-mermaid-toolbar-background`、`--ran-mermaid-toolbar-gap`、
`--ran-mermaid-button-size`、`--ran-mermaid-button-color`、`--ran-mermaid-button-hover-background`、
`--ran-mermaid-error-color`。

## メモ

- **遅延読み込み**：mermaid（および全画面に使う r-modal）は動的インポートなので、図が描画される／
  全画面が開かれるときにだけ、別の非同期チャンクとして届きます。
- **描画の忠実さ**：`<r-mermaid>` は mermaid 自身のレンダーを使うので、すべての図の種類とテーマに
  対応します。
- **PNG の書き出し**：HTML ラベル（mermaid の `htmlLabels`）を使う図は `<foreignObject>` 経由で
  描画されます。これは canvas を汚染して PNG の書き出しを失敗させることがあり、その場合は `error`
  イベントが派発されます。SVG とソースの書き出しは常に動きます。
