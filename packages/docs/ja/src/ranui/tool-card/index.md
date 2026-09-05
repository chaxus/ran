---
description: 'ツールが選んだマークアップではなく、宣言された意図（generic / terminal / diff）からツール呼び出しとその結果を描画します。'
---

# Tool Card

ツール呼び出しとその結果を、マークアップではなく**宣言された意図**から描画します。

> **使いどころ**：エージェントやジョブが実際に何をしたか（シェルコマンド、ファイル編集、検索）を
> 見せたいとき。ツールには _それが何であるか_ だけを言わせ、見た目は表示側に決めさせたい場合です。

HTML を返すツールは、UI に代わってレンダラーもテーマもレイアウトも選んでしまっています。しかもそれを、
UI の関心事があってはならない唯一の場所（モデルに向けた結果）で行っています。意図を宣言すればこの二つは
分かれます。同じ呼び出しが、ここではターミナルのブロックとして、圧縮された会話ログでは一行として、
エディターでは飛び先として描画できます。ツールはそのどれの存在も知らないままです。

## クイックスタート

```html
<r-tool-card open></r-tool-card>
```

```ts
const card = document.createElement('r-tool-card');

card.call = { card: 'terminal', title: 'pnpm test', cwd: '/repo' };
card.status = 'running';

// …呼び出しが返ってきたら
card.result = { card: 'terminal', output: '2351 passed', exitCode: 0 };
card.status = 'success';

conversation.append(card);
```

## カードの種類

### `generic`

既定であり、フォールバックでもあります。タイトル、見せる価値のある引数のキー／値の表（任意）、
そして結果の内容（任意）です。

```ts
card.call = { card: 'generic', title: 'Read file', input: { path: 'src/a.ts', limit: '200' } };
card.result = { card: 'generic', content: 'export const a = 1;' };
```

### `terminal`

呼び出しそのものがシェルコマンドである場合です。`title` がコマンドで、`description` と `cwd` が
出力の上に描かれます。ゼロでない `exitCode` は表に出し、ゼロは出しません。

```ts
card.call = { card: 'terminal', title: 'ls -la', description: 'List the tree', cwd: '/repo' };
card.result = { card: 'terminal', output: 'total 8\ndrwxr-xr-x …', exitCode: 0 };
```

### `diff`

呼び出しがファイルを作る、あるいは変更する場合です。各項目は両側の行番号つきの unified 形式の
ハンクとして描画され、[ranuts/utils](../../ranuts/utils/) の `diffLines` が計算します。
**`oldText` が null ならファイルは新規作成**という意味です。呼び出し時点のビューが持つ情報はそれで、
呼び出す側には読むべき以前の内容がないからです。

```ts
card.call = {
  card: 'diff',
  title: 'Edit config',
  diffs: [{ path: 'vite.config.ts', oldText: 'port: 3000\n', newText: 'port: 5173\n' }],
};
```

## 噛みつく二つの規則

これらのビューは、進行中の呼び出しで計算され、**ログを再生するときにもう一度計算されます**。
ほかのすべてはそこから導かれます。

- **ビューは呼び出しの引数の純粋関数です**（結果のビューなら結果も含めて）。I/O も、時計も、
  セッションの状態もありません。さもなければ再生が、ユーザーが最初に見たものと食い違います。
- **知らないカードは劣化して描画され、決して例外を投げません。** 新しい生産者が付けたカードの種類も、
  保存の途中で壊れた値も、持っているタイトルのまま `generic` として描画され、形の崩れたビューは空で
  描画されます。表示が再生を壊せてはいけません。

## 位置

呼び出しに付いた `locations` はボタンとして描画され、`locationclick` を発生させます。エディターは
それを追いかけられます。

```ts
card.call = { card: 'generic', title: 'Read', locations: [{ path: 'src/a.ts', line: 42 }] };
card.addEventListener('locationclick', (e) => openInEditor(e.detail.location));
```

## API リファレンス

### プロパティ

| プロパティ | 型                                  | 既定値      | 説明                                           |
| ---------- | ----------------------------------- | ----------- | ---------------------------------------------- |
| `call`     | `ToolCallView \| null`              | `null`      | 呼び出しの引数から導かれる、進行中のビュー。   |
| `result`   | `ToolResultView \| null`            | `null`      | 完了後のビュー。進行中のものを置き換えます。   |
| `status`   | `'running' \| 'success' \| 'error'` | `'running'` | 反映されるので、スタイルの切り替えに使えます。 |
| `open`     | `boolean`                           | `false`     | 本文が開いているかどうか。                     |
| `sheet`    | `string`                            | `''`        | 要素の shadow DOM に注入する CSS。             |

知らない `status` の値は、読み出すと `running` になります。

### イベント

| イベント        | detail                       | 発生するとき                     |
| --------------- | ---------------------------- | -------------------------------- |
| `locationclick` | `{ location: ToolLocation }` | ファイルへの参照が起動されたとき |

### Part

`card`、`header`、`status`、`title`、`toggle`、`body`、`description`、`exit`、`input`、
`output`、`file`、`path`、`hunk`、`line`、`locations`、`location`。

diff の行は `data-kind` として `context`、`added`、`removed` のいずれかを持ちます。

### アクセシビリティ

ヘッダーは `aria-expanded` を持つ本物の `<button type="button">` なので、追加の配線なしに
キーボードから到達でき、操作できます。

## スタイリング

`<r-tool-card>` は自前の **CSS カスタムプロパティを 24 個**、そしてテーマから読むセマンティック
トークンを公開しています。継承が届く場所ならどこにでも設定できます（`:root`、外側のコンテナ、要素）。

```css
r-tool-card {
  --ran-tool-card-io-background: var(--ran-color-bg-subtle);
}
```

Part：`body` · `exit` · `file` · `hunk` · `io` · `io-text` · `line` · `location` · `locations` · `path` · `row`

一覧は[スタイルトークン](/ja/src/ranui/style-tokens#tool-card)に、どのトークンを選ぶかは[デザインシステム](/ja/src/ranui/design-system/)にあります。

## 関連

- [Conversation](../conversation/)：ツール呼び出しのビューを載せる `mount` 先としてこれを使う
- [ranuts/utils](../../ranuts/utils/)：`diff` カードを描く `diffLines`
