---
description: '追記のみのイベントログを会話として描画します。投影、下端追従、行の突き合わせを引き受け、内容の種類ごとに独立したビューを登録します。'
---

# Conversation

追記のみのイベントログを会話として描画します。この要素が持つのは、面倒で間違えやすい三つのことだけです。
イベントをノードへ投影すること、読み手自身のスクロールを上書きせずに表示を下端へ留めること、そして
ノードの一覧に対して行を突き合わせることです。

> **使いどころ**：流れてくる会話ログ（チャット、エージェントのセッション、ログ）を描画していて、
> 内容の種類（メッセージ、ツール呼び出し、状態の行）ごとに、肥大していく描画関数の分岐を増やすのではなく
> 独立した登録として扱いたいとき。

メッセージやツール呼び出しが _どう見えるか_ は登録されたビューの仕事で、この要素の関知するところでは
ありません。投影は [ranuts/conversation](../../ranuts/conversation/) が、スクロールは
[ranuts/utils](../../ranuts/utils/) の `createBottomFollower` が担います。

## クイックスタート

```html
<r-conversation empty="まだメッセージがありません" style="height: 400px"></r-conversation>
```

```ts
const chat = document.createElement('r-conversation');

chat.register({
  kind: 'message',
  // どのイベントが自分のもので、どのノードに属するか。
  match: (e) =>
    e.type === 'message/start'
      ? { id: e.id, role: 'start' }
      : e.type === 'message/delta'
        ? { id: e.id, role: 'update' }
        : null,
  // それらを自分の状態へ畳み込む。
  start: () => ({ text: '' }),
  update: (state, e) => ({ text: state.text + e.text }),
  // トークンごとの差分は 1 フレーム 1 回の再描画にまとめ、確定した事実は待たせない。
  publication: (e) => (e.type === 'message/delta' ? 'animation-frame' : 'immediate'),
  // その状態が画面へ届く経路。
  mount: () => document.createElement('r-markdown'),
  patch: (el, node) => {
    el.content = node.state.text;
  },
});

chat.push({ type: 'message/start', id: 'm1' });
chat.push({ type: 'message/delta', id: 'm1', text: 'Hello' });

container.append(chat);
```

散文の行には `<r-markdown>` を想定しています。既定の `mode="streaming"` では、途中まで流れてきた
`**bold`、バッククォート、リンク、`$$` の数式をすでに閉じてくれるので、ビューが面倒を見る必要はありません。

## 破ると噛みつく規則

- **最初の `push` の前に、すべてのビューを登録してください。** 投影は登録済みの集合から一度だけ組み立てられ
  るので、あとから登録すると、すでに畳み込まれたイベントを黙って取りこぼします。この要素はそうする代わりに
  例外を投げます。
- **`update` は状態を畳み、`patch` はそれを DOM へ書きます。** 名前が分かれているのは仕事が別だからです。
  `patch` は何も畳まず、流れている行では 1 フレームに 1 回走るので、軽く保ってください。
- **`mount` は任意です。** 持たないビューは、ほかのビューが `reader.previous` から読む状態を提供するだけで、
  自身は何も描画しません。
- **行は開いた位置に留まります。** 流れているメッセージが、差分のたびに一覧の末尾へ跳ぶことはありません。

## 下端への追従

既定で有効です。内容が届くあいだ表示は下端に留まり、読み手が上へスクロールした瞬間に止まり、下へ戻ると
また留まります。どの時点でも手動のスクロールを上書きしません。追従の仕組みが、入力デバイスを監視するので
はなく、自分のスクロール書き込みと読み手のそれを区別しているからです。

```ts
chat.addEventListener('pinnedchange', (e) => {
  jumpButton.hidden = e.detail.pinned;
});
```

`follow="false"` は最初から読み手に主導権を渡します。`scrollToBottom()` はそれを取り戻します。古い内容を
遡って読み込むときは、前に足す前に `captureAnchor()` を、足したあとに `restoreAnchor()` を呼べば、
読み手は見ていたものを見続けられます。

## API リファレンス

### プロパティ

| プロパティ | 型        | 既定値 | 説明                                                             |
| ---------- | --------- | ------ | ---------------------------------------------------------------- |
| `follow`   | `boolean` | `true` | 読み手が下端から離れるまで、新しい内容に追従します。             |
| `empty`    | `string`  | `''`   | 投影が行を一つも生んでいないあいだ表示する文言。空なら隠れます。 |
| `pinned`   | `boolean` | `true` | 読み取り専用。いま新しい内容に追従しているかどうか。             |
| `sheet`    | `string`  | `''`   | 要素の shadow DOM に注入する CSS。                               |

### メソッド

| メソッド              | 説明                                                         |
| --------------------- | ------------------------------------------------------------ |
| `register(view)`      | 内容の種類を一つ登録します。最初の `push` のあとは投げます。 |
| `push(event)`         | イベントを一つ投影し、変わったところを描画します。           |
| `reset()`             | 登録済みのビューは残したまま、ノードと行をすべて捨てます。   |
| `scrollToBottom()`    | 下端までスクロールし、追従を再開します。                     |
| `captureAnchor(key?)` | 古い内容を前に足す前に、ある行の位置を覚えます。             |
| `restoreAnchor()`     | 覚えた行を元の位置へ戻します。                               |

### イベント

| イベント       | detail                | 発生するとき                       |
| -------------- | --------------------- | ---------------------------------- |
| `pinnedchange` | `{ pinned: boolean }` | 下端への追従を得たとき、失ったとき |

### スロット

| スロット | 説明                                                                   |
| -------- | ---------------------------------------------------------------------- |
| `footer` | 行の下に貼り付く領域。入力欄はここに置きます。高さは監視されています。 |

### Part

`conversation`（スクロール領域）、`list`、`row`、`footer`、`empty`。

各行は `data-kind` と `data-key` も持つので、使う側は shadow ツリーに手を伸ばさずにスタイルを当てたり
探したりできます。

## スタイリング

`<r-conversation>` は自前の **CSS カスタムプロパティを 14 個**、そしてテーマから読むセマンティック
トークンを公開しています。継承が届く場所ならどこにでも設定できます（`:root`、外側のコンテナ、要素そのもの）。

```css
r-conversation {
  --ran-conversation-background: var(--ran-color-bg-subtle);
}
```

Part：`conversation` · `empty` · `footer` · `list` · `older`

一覧は[スタイルトークン](/ja/src/ranui/style-tokens#conversation)に、どのトークンを選ぶかは[デザインシステム](/ja/src/ranui/design-system/)にあります。

## 関連

- [ranuts/stream](../../ranuts/stream/)：プロバイダーの SSE を、ここへ push するイベントに変える
- [ranuts/conversation](../../ranuts/conversation/)：投影の仕組み。更新の頻度も含めて
- [Markdown](../markdown/)：散文のための、ストリーミングを心得た行
