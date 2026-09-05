# ranuts/stream — モデルの応答をストリーミングする

Server-Sent Events の解析、ストリーミングされたモデル応答ひとつを表すベンダー中立な語彙、そしてその語彙から描画できるブロックへの畳み込みです。

```js
import { parseEventStream, mapEventStream, createStreamAccumulator } from 'ranuts/stream';
```

**独立したエントリーポイントです。** ここにあるものは DOM に一切触れないので、応答をテストの中でもサーバー上でも畳み込めます。`ranuts/utils` から import すると、DOM を向いたモジュールを引きずってきてしまいます。

**ベンダーはここに住んでいません。** 主要なチャット補完 API はどれも同じ 4 つのもの（アシスタントのテキスト、別に課金される推論のテキスト、ツール呼び出し、トークン数）を流しますが、名前の付け方も混ぜ方もそれぞれ違います。あるプロバイダーのイベントを `StreamChunk` へ写すことだけがベンダー固有の工程で、それはあなたの手元に残ります。ひとつの通信形式を焼き込んでしまえば、残りふたつの層はほかの誰にとっても使えないものになります。

## 3 つの層

| 層                          | 何をするか                                       |
| --------------------------- | ------------------------------------------------ |
| `parseEventStream(source)`  | バイト列 → `ServerSentEvent`。伝送だけを扱います |
| `StreamChunk`               | ひとつの応答が流す語彙                           |
| `createStreamAccumulator()` | チャンクを、ビューが描けるブロックへ畳み込みます |

`mapEventStream(source, map)` は最初のふたつを繋ぎます。イベントを辿り、あなたの写像がそれぞれについてチャンクを 0 個以上返せるようにします。キープアライブや `[DONE]` の番兵を捨てるには `[]` を返します。

## 語彙

```ts
type StreamChunk =
  | { type: 'block-start'; index: number; blockType: ContentBlockType }
  | { type: 'text-delta'; index: number; text: string }
  | { type: 'reasoning-delta'; index: number; text: string }
  | { type: 'tool-call-delta'; index: number; id: string; name?: string; argumentsDelta: string }
  | { type: 'block-end'; index: number; block: ContentBlock }
  | { type: 'usage'; usage: TokenUsage }
  | { type: 'finish'; reason: FinishReason };
```

- **`index` が、混ざり合って届くデルタを結び付けます。** 推論とテキストは交互に届き、ツール呼び出しは複数が同時に開くので、到着順はグループ分けにはなりません。
- **`block-end` は組み上がったブロックを運び**、デルタが作ったものより優先されます。完成したブロックだけがほしい利用者は、デルタをすべて無視できます。
- **ツールの引数は生の JSON テキストのままです。** JSON 文書の半分は値ではありません。`arguments` の解析は `finish` のあとで一度だけ行ってください。ストリーミング中に `argumentsDelta` を解析することこそ、ストリーミングのツール呼び出しがたいてい壊れる場所です。
- **`block-start` は任意です。** いくつかのプロバイダーは最初のデルタでブロックを開くので、アキュムレーターも必要になった時点で開きます。あなたの写像でも必須にしないでください。
- **`finish` で終わります。** `usage` はその前に届き、そのあとには何も続きません。

## 応答を畳み込む

```js
const accumulator = createStreamAccumulator();

for await (const chunk of mapEventStream(response.body, toStreamChunks)) {
  accumulator.push(chunk);
  render(accumulator.snapshot());
}

const { blocks, usage, finishReason } = accumulator.snapshot();
const calls = accumulator.toolCalls(); // 引数はまだテキストです。解析はここで
```

`snapshot()` は不変です。ストリーミングの途中で取ったスナップショットはそのときの値を保つので、ビューはひとつを保持していても、あとの `push` に足元を書き換えられません。`text()` と `reasoning()` は自分のブロックを index の順に連結し、`reset()` はインスタンスを次の応答のために空にします。

## SSE パーサーが面倒を見ること

フレーミングの規則は小さいのに、完全に実装されていることはほとんどありません。`parseEventStream` は次を扱います。

- **どこであっても**チャンクの境目。マルチバイト文字の途中や、`\r\n` のふたつの半分のあいだも含みます
- 繰り返された `data:` フィールドを `\n` で連結すること
- コロンのあとの空白をちょうどひとつだけ取り除くこと
- `:` で始まるコメント行。サーバーが接続を温めておくのに使います
- 先頭の BOM
- サーバーが空行で終端しなかった、末尾のブロック
- `Symbol.asyncIterator` を持たない `ReadableStream`

`ReadableStream` のほか、任意の `AsyncIterable<Uint8Array>` も受け取ります。だからテストはネットワークなしにバイトの断片を渡せます。

## 実際に動いている写像

このリポジトリの `packages/im` が動く利用者です。OpenAI 互換の SSE ルート、`StreamChunk` への写像、そして自分でデルタを連結するのではなくスナップショットを保持するビューがあります。その往復テストは、本物のサーバーのバイト列を、いくつものチャンクサイズで本物のクライアントへ流します。だからふたつの半分が離れていくことはありません。

## 関連

- [ranuts/conversation](../conversation/)：できたイベントを、描画できるノードへ射影します
- [`<r-conversation>`](../../ranui/conversation/)：そのノードを描画します
