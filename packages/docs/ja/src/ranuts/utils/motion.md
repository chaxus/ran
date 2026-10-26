# spring / stagger / observeEntry

描画は呼び出し側に任せるモーションの基本部品です。厳密に解いたスプリング（CSS の `linear()` イージングとしても出力可能）、時差ディレイ、一度きりのビューポート進入検出、そして読者の視差効果を減らす設定。どれもアニメーションループを持たないので、Web Animations、CSS トランジション、独自の `requestAnimationFrame` のどれでも使えます。

## API

### spring(options?)

`{ at, duration, easing }` を返します。`at(seconds)` は 0〜1 の進捗（減衰不足のスプリングは 1 を超えてから落ち着きます）、`duration` は目標の 0.1% 以内に収まるまでの秒数、`easing` は同じ曲線を CSS `linear()` 文字列にしたものです。

| オプション  | 説明                                                  | 既定値 |
| ----------- | ----------------------------------------------------- | ------ |
| `stiffness` | 目標へ引く強さ。大きいほど速い                        | `170`  |
| `damping`   | 抵抗。`2 * sqrt(stiffness * mass)` 未満だと行き過ぎる | `26`   |
| `mass`      | 慣性                                                  | `1`    |
| `velocity`  | 初速度（1 秒あたりの進捗）                            | `0`    |

### stagger(index, count, options?)

`count` 個中 `index` 番目の要素の遅延秒数。先頭・末尾・中央のどこから始めるかを `from` で選びます。

### observeEntry(element, options)

要素の上端が `line`（ビューポート上端からの高さの割合）を初めて越えたときに `onEnter` を一度だけ呼び、監視をやめます。引数は `{ reduced }` で、`true` のときはアニメーションせず最終状態を表示します。戻り値で早めに監視を止められます。

### prefersReducedMotion()

読者が視差効果を減らす設定にしているとき `true`。window のない環境（SSR、Node）では `false`。

## 例

```js
import { observeEntry, prefersReducedMotion, spring, stagger } from 'ranuts';

const { duration, easing } = spring({ stiffness: 260, damping: 20 });
const cards = [...document.querySelectorAll('.card')];

cards.forEach((card, index) => {
  observeEntry(card, {
    line: 0.85,
    onEnter: ({ reduced }) => {
      if (reduced) return; // already in its final place
      card.animate(
        [
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: duration * 1000,
          delay: stagger(index, cards.length, { each: 0.06 }) * 1000,
          easing,
          fill: 'backwards',
        },
      );
    },
  });
});
```

## 注意

1. **スクリプトがなくても内容は見える。** CSS で先に隠すのではなく、`fill: 'backwards'` でオフセット位置*から*アニメーションさせれば、スクリプトの失敗時も視差効果を減らす設定でも内容はその場に残ります。
2. **IntersectionObserver がない環境では `observeEntry` はすぐに進入扱いになり、** 要素を待たせません。
3. **スプリングは逐次計算ではなく厳密解** なので、同じオプションならどのフレームレートでも同じ曲線になります。
