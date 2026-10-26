---
description: 'ranui の FanGallery（<r-fan-gallery>）は子要素を手札のように扇形に広げます。初めてスクロールで表示されたときにスプリングで開き、ポインターやフォーカスのある子要素を持ち上げます。'
---

# FanGallery

子要素を手札のように扇形に広げます。各子要素は列の下にある一点を中心に回転するので、
帯状に並ぶのではなく、ひとまとまりのものとして見えます。

> **使いどころ**：数枚のカバー、スクリーンショット、カードを一つのセットとして見せたいとき。
> 一枚ずつ全体を見せることより、複数あることを伝えるほうが大事な場面です。
> 読み手が並べて比較する必要がある内容には、グリッドを使ってください。

## クイックスタート

### 基本的な使い方

<ran-demo>
  <r-fan-gallery>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8d5b7;color:#333">1</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#b7d0e8;color:#333">2</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#c8e8b7;color:#333">3</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8b7c8;color:#333">4</button>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery>
  <a href="/one">1</a>
  <a href="/two">2</a>
  <a href="/three">3</a>
  <a href="/four">4</a>
</r-fan-gallery>
```

子要素はあなた自身の要素です。リンク、ボタン、画像はロール、名前、タブ順をそのまま保ち、
ギャラリーはそれらを動かすだけです。

### 広がり

`spread` は最初と最後の子要素のあいだの角度（度）です。`0` にするとすべてが重なります。

<ran-demo>
  <r-fan-gallery spread="48">
    <div style="width:96px;height:128px;border-radius:12px;background:#d2b7e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#b7d0e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#c8e8b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8d5b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8b7c8"></div>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery spread="48">…</r-fan-gallery>
```

## モーション

- **開く動き。** ギャラリーが初めてスクロールで表示されるまで、子要素は重なっていて、
  先頭の一枚は最初から読めます。表示されると扇がスプリングで一枚ずつ開きます。
  開くのはページごとに一度だけで、スクロールで離れて戻っても再生されません。
- **ポインターとフォーカス。** ポインターの下、またはフォーカスを持つ子要素が持ち上がって前面に出て、
  隣の子要素は少し脇へ回ります。反応は即座で、新しい操作は直前の動きが到達した位置から引き継ぎます。
- **視差効果を減らす。** `prefers-reduced-motion: reduce` のときは最初から扇が開いており、
  すべての変化はトランジションなしで適用されます。

## API リファレンス

### プロパティ

| プロパティ | 属性     | 型       | 既定値 | 説明                                         |
| ---------- | -------- | -------- | ------ | -------------------------------------------- |
| `spread`   | `spread` | `string` | `'24'` | 開いたときの最初と最後の子要素の角度（度）。 |
| `sheet`    | `sheet`  | `string` | `''`   | shadow root に注入する CSS。                 |

### Part

| Part    | 要素                                 |
| ------- | ------------------------------------ |
| `stage` | すべての子要素が重ねられるグリッド。 |

### スタイリング

| トークン                    | 既定値           | 役割                                                         |
| --------------------------- | ---------------- | ------------------------------------------------------------ |
| `--ran-fan-gallery-padding` | `--ran-space-10` | 回転した角がはみ出すための、stage まわりの余白。             |
| `--ran-fan-gallery-pivot`   | `320px`          | 子要素が列のどれだけ下を中心に回るか。短いほど大きく広がる。 |
| `--ran-fan-gallery-lift`    | `--ran-space-4`  | ポインターやフォーカスのある子要素が外へ動く距離。           |

ギャラリーの高さは最も背の高い子要素と同じです。回転した角は stage からはみ出すので、
まわりに余白を残すか、`--ran-fan-gallery-padding` を大きくしてください。
