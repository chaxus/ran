# イージング関数（tween）

7 種類のイージングの系統があり、それぞれに `easeIn` と `easeOut` があります。中身は純粋な数式で、DOM も、自前の RAF のループも持ちません。自分のアニメーションフレームから現在の時刻を渡すと、そのフレームで使うべき値が返ります。

引数は Robert Penner による古典的な流儀に従います。

- `t`：現在の時刻（どれだけ経ったか）
- `b`：始まりの値
- `c`：値の変化量（終わりの値は `b + c`）
- `d`：継続時間

どの関数も内部で `t >= d` のときに値を抑えるので、終わりを過ぎて呼んでも、範囲の外へ外挿せずに最終的な値を返します。

## 使い方

```ts
import { cubic } from 'ranuts/utils';

const start = performance.now();
const tick = (now: number) => {
  const x = cubic.easeOut(now - start, 0, 300, 600); // 600ms かけて 0 → 300
  el.style.transform = `translateX(${x}px)`;
  if (now - start < 600) requestAnimationFrame(tick);
};
requestAnimationFrame(tick);
```

## 使える曲線

| エクスポート | 曲線         | 感じ                                                       |
| ------------ | ------------ | ---------------------------------------------------------- |
| `quad`       | 2 次（`t²`） | いちばん穏やかな加速。無難な既定値                         |
| `cubic`      | 3 次（`t³`） | `quad` よりはっきりきびきびします                          |
| `quart`      | 4 次（`t⁴`） | 力強い加速                                                 |
| `quint`      | 5 次（`t⁵`） | とても力強く、動きの印象を終わり際が支配します             |
| `sine`       | 正弦         | どれよりも柔らかく、イージングとしてほとんど気づかれません |
| `expo`       | 指数         | ほとんど止まっていて、そこから一気に走り出します           |
| `circ`       | 円           | ゆっくり始まり、終わりがとても唐突です                     |

## API

どのエクスポートも同じ形をしています。

```ts
interface SpeedType {
  easeIn: EasingFn;
  easeOut: EasingFn;
}

type EasingFn = (t: number, b: number, c: number, d: number) => number;
```

### easeIn / easeOut

#### パラメーター

| パラメーター | 説明                           | 型       | 既定値 |
| ------------ | ------------------------------ | -------- | ------ |
| `t`          | 経過した時間                   | `number` | 必須   |
| `b`          | 始まりの値                     | `number` | 必須   |
| `c`          | 値の変化量（終わりは `b + c`） | `number` | 必須   |
| `d`          | 継続時間                       | `number` | 必須   |

#### 戻り値

| 引数    | 説明                | 型       |
| ------- | ------------------- | -------- |
| `value` | 時刻 `t` における値 | `number` |

## 補足

`easeIn` はゆっくり始まって加速し、`easeOut` は速く始まって減速します。利用者の操作に応える UI では、たいてい `easeOut` のほうが自然に見えます。まずためらってから動くのではなく、すぐ動き出して落ち着くからです。

[zhangxinxu/Tween](https://github.com/zhangxinxu/Tween) に感謝します。
