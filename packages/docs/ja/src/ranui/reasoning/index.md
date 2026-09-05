---
description: '推論が流れているあいだは開き、終われば畳まれる折りたたみ式の思考プロセス。読み手が自分で操作するまでは、その振る舞いが続きます。'
---

# Reasoning

折りたたみ式の思考プロセスです。

> **使いどころ**：モデルが答えとは別に推論を見せるとき、読み手にはその過程を見せたいが、
> 終わったあとまで画面に残しておきたくはない場合。

推論は、進行中は見たいのに、終わってからはまず残しておきたくならない、応答のなかで唯一そういう部分です。
そこでこの要素は `streaming` が立っているあいだ開き、外れると畳まれます。

**読み手が触れるまでは。** 読み手が自分で開いたり畳んだりした時点で、この自動の振る舞いは以後止まります。
スクロールについても [`createBottomFollower`](../../ranuts/utils/) が同じ「所有権」の規則に従っており、理由も同じです。
読み手がすでに決めたことを勝手に決め直し続けるインターフェースは、はじめから何も決めないものより悪いのです。
スクリプトから `open` を設定するのも、主導権を取ったものとして扱われます。意見のある呼び出し元の代理として
スクリプトが動いているからです。

## クイックスタート

```html
<r-reasoning label="Thinking"></r-reasoning>
```

```ts
const reasoning = document.createElement('r-reasoning');

reasoning.streaming = true; // 開く
reasoning.content += delta; // 見えたまま伸びていく
reasoning.duration = 4200; // ラベルの横に「4.2s」
reasoning.streaming = false; // 読み手が介入していなければ畳まれる

conversation.append(reasoning);
```

`ranuts/stream` はすでに `reasoning-delta` を `text-delta` と分けて扱うので、ビューはスナップショットから
そのまま流し込めます。

```ts
reasoning.content = snapshot.blocks
  .filter((block) => block.type === 'reasoning')
  .map((block) => block.text)
  .join('');
reasoning.streaming = !snapshot.done;
```

## 知っておく価値のある点

- **1 秒未満の時間は何も表示しません。** 読み手にとって大事なのは速かったことであり、340ms だったことではありません。
- **ストリーミング中はラベルが脈打ちます。** 長く黙って考えていても停止と読み違えられません。
  `prefers-reduced-motion` では情報を失わずにアニメーションだけが止まります。
- **デフォルトスロットは描画済みのテキストを置き換えます。** 本文をプレーンテキストではなく `<r-markdown>` に
  したい呼び出し元のためです。

## API リファレンス

### プロパティ

| プロパティ  | 型               | 既定値        | 説明                                                       |
| ----------- | ---------------- | ------------- | ---------------------------------------------------------- |
| `content`   | `string`         | `''`          | 推論のテキスト。繰り返し代入するのがストリーミングの経路。 |
| `streaming` | `boolean`        | `false`       | 推論がまだ届いている最中かどうか。                         |
| `open`      | `boolean`        | `false`       | 本文が開いているかどうか。                                 |
| `label`     | `string`         | `'Reasoning'` | 要約行のテキスト。                                         |
| `duration`  | `number \| null` | `null`        | 考えていたミリ秒数。1 秒未満は隠されます。                 |
| `sheet`     | `string`         | `''`          | 要素の shadow DOM に注入する CSS。                         |

有限かつ非負の数でない `duration` は、読み出すと `null` になります。

### スロット

| スロット     | 説明                                           |
| ------------ | ---------------------------------------------- |
| (デフォルト) | 描画済みのテキストを自前の本文で置き換えます。 |

### Part

`reasoning`、`summary`、`marker`、`label`、`meta`、`body`、`text`。

### アクセシビリティ

要約行は `aria-expanded` を持つ本物の `<button type="button">` なので、追加の配線なしにキーボードから
到達でき、操作できます。

## スタイリング

`<r-reasoning>` は自前の **CSS カスタムプロパティを 4 つ**、そしてテーマから読むセマンティックトークンを
公開しています。継承が届く場所ならどこにでも設定できます（`:root`、外側のコンテナ、要素そのもの）。

```css
r-reasoning {
  --ran-reasoning-color: var(--ran-color-text-secondary);
}
```

Part：`body` · `row` · `text`

一覧は[スタイルトークン](/ja/src/ranui/style-tokens#reasoning)に、どのトークンを選ぶかは[デザインシステム](/ja/src/ranui/design-system/)にあります。

## 関連

- [Conversation](../conversation/)：会話ログの推論行としてこれを組み込む
- [ranuts/stream](../../ranuts/stream/)：`reasoning-delta` の出どころ
