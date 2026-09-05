# ranuts/conversation — イベントログから描画できるノードへ

追記だけのイベントログを、会話ビューが描画するノードへ射影します。

```js
import { createConversationEngine } from 'ranuts/conversation';
```

**独立したエントリーポイント**で、DOM を使いません。だから射影そのものをテストでき、サーバー側でも描画できます。[`<r-conversation>`](../../ranui/conversation/) が DOM 側の利用者です。

## イベントの種類で分岐しない理由

会話を描画する普通のやり方は、イベントの種類で分岐してコンポーネントツリーを書き換えるビューです。それだと順序、同一性、部分更新の突き合わせが**ビューの中**に入り込むので、新しい種類の内容（ツール呼び出し、承認の問い合わせ、状態表示の行）が増えるたびに手作業で通してやる必要があり、ビューには種類の数だけ分岐が増えます。

ここでは種類ごとが**それぞれ独立して登録された状態機械**です。定義は、どのイベントが自分のものかを述べ、それを自分の状態へ畳み込み、ほかの種類が存在することを最後まで知りません。種類を足すことは、定義を足すことであって、レンダラーを書き換えることではありません。

## 定義

```ts
const message = {
  kind: 'message',
  // どのイベントが自分のもので、どのノードに属するか。
  match: (event) =>
    event.type === 'message/start'
      ? { id: event.id, role: 'start' }
      : event.type === 'message/delta'
        ? { id: event.id, role: 'update' }
        : null,
  // それを自分の状態へ畳み込む。
  start: (event, reader) => ({ text: '', after: reader.previous('message')?.id }),
  update: (state, event) => ({ ...state, text: state.text + event.text }),
  // 購読者に結果をどれくらいの頻度で見せるか。
  publication: (event) => (event.type === 'message/delta' ? 'animation-frame' : 'immediate'),
};

const engine = createConversationEngine({ definitions: [message, toolCall] });
engine.subscribe((nodes) => render(nodes));
engine.push(event);
```

`definitions` は `unknown` の状態として宣言されているので、状態の型が違う定義どうしを呼び出し側でキャストなしに並べて登録でき、それぞれは書かれた場所で完全に型づけされたままです。

## 意味論

- **どの定義もすべてのイベントを見ます。** エンジンは最初に名乗り出たところで止まらないので、ログのひとつのイベントがふたつのノードを動かすこともあります。
- **順序は `start` の時点で決まります。** 更新され続けるノードは開いた場所に留まるので、ストリーミング中のメッセージがデルタのたびにリストの末尾へ飛ぶことはありません。
- **開いているノードのない id への `update` は捨てられます。** ページ分割された窓から start イベントが切り落とされていた場合、それが正しい結果です。部分更新だけからノードを組み立てれば、存在しなかったものを描いてしまいます。
- **`start` が繰り返されると、その場でノードを開き直します。** 定義がこれは新しいノードだと判断したのだから、古い状態はマージされるのではなく捨てられ、位置は保たれます。
- **`reader.previous(kind)` は後ろ向きにしか見ません。** 自分より後に始まったノードまで見える定義は、いつ走ったかで答えが変わってしまい、同じログを再生しても同じビューを再現できなくなります。

## 通知の頻度

`publication` は購読者が更新をどれくらいの頻度で見るかを決めます。性能のために調整すべき設定はこれだけです。

| 頻度              | 用途                                                                             |
| ----------------- | -------------------------------------------------------------------------------- |
| `animation-frame` | トークンごとのデルタ。2 回の描画のあいだのデルタは、ひとつの通知にまとめられます |
| `immediate`       | 離散的な事実。ツールの結果、承認など。1 フレーム待つのは遅延を足すだけです       |
| `none`            | あとの通知がどのみち運ぶ状態。ビューを起こさずに記録されます                     |

**頻度は上がることはあっても、緩むことはありません。** フレーム待ちの最中に `immediate` の通知があれば、いま発火してフレームを取り消します。2 回通知することはありません。`publication` を省くと `immediate` になります。

`scheduler` オプションはフレームのスケジューリングを差し替えるもので、描画なしに頻度をテストする手立てです。既定ではブラウザーで `requestAnimationFrame`、それ以外ではマイクロタスクを使います。

## ノード

```ts
interface ConversationNode<State> {
  key: string; // `kind:id`。ノードの一生を通じて変わりません
  kind: string;
  id: string;
  seq: number; // start イベントの順番。並び順のキーです
  state: State;
}
```

`nodes()` は次に受け入れられるイベントまで同じ配列を返し、各ノードは凍結されています。だからビューは、ひとつの通知をまたいでノードを保持しても、その足元が変わることはありません。

## 関連

- [ranuts/stream](../stream/)：イベントを生み出す側
- [`<r-conversation>`](../../ranui/conversation/)：ノードを描画する側
- [ranuts/utils](../utils/) の `createBottomFollower`：ビューを最下部に貼り付けておく
