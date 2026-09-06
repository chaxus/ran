# computePlacement

浮かぶパネル（ドロップダウン、ポップオーバー、ツールチップ）を、基準となる矩形に対して配置します。望んだ側に場所がなく、反対側のほうが広ければ反対側へ裏返し、そのうえで境界の内に収まるよう、交差する軸に沿ってずらします。Floating UI の `flip` / `shift` ミドルウェアと同じことを、依存なしで行います。

純粋な幾何です。DOM そのものには触れません。`getBoundingClientRect()` の結果を渡せば、書き込むべき座標が返ります。

## 使い方

```ts
import { computePlacement } from 'ranuts/utils';

const anchorRect = trigger.getBoundingClientRect();
const { top, left, placement } = computePlacement({
  anchor: anchorRect,
  floating: { width: panel.offsetWidth, height: panel.offsetHeight },
  placement: 'bottom',
  offset: 4,
});

panel.style.position = 'absolute';
panel.style.top = `${top + window.scrollY}px`;
panel.style.left = `${left + window.scrollX}px`;
// `placement` は、裏返したあとに実際に使われた側です。登場の
// アニメーションのクラスや、矢印の向きを選ぶのに使ってください。
```

## API

### computePlacement

#### パラメーター

| パラメーター        | 説明                                                                                       | 型                                       | 既定値                   |
| ------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------- | ------------------------ |
| `options.anchor`    | 基準（きっかけ）となる矩形。ビューポート座標で指定します（`getBoundingClientRect()` など） | `{ top, left, width, height }`           | 必須                     |
| `options.floating`  | 浮かぶパネル自身の大きさ                                                                   | `{ width, height }`                      | 必須                     |
| `options.placement` | 望む側。場所がなく、反対側のほうが広ければ反対側へ裏返します                               | `'top' \| 'bottom' \| 'left' \| 'right'` | 必須                     |
| `options.offset`    | 基準と浮かぶパネルのあいだに空ける間隔（px）                                               | `number`                                 | `0`                      |
| `options.boundary`  | パネルが収まっていなければならない範囲。ビューポート座標で指定します                       | `{ top, left, width, height }`           | ウィンドウのビューポート |
| `options.padding`   | ずらすときに、パネルと境界の縁のあいだに空ける最小の間隔（px）                             | `number`                                 | `8`                      |

#### 戻り値

| 引数        | 説明                                       | 型                                       |
| ----------- | ------------------------------------------ | ---------------------------------------- |
| `top`       | 決まった `top`。`anchor` と同じ座標系です  | `number`                                 |
| `left`      | 決まった `left`。`anchor` と同じ座標系です | `number`                                 |
| `placement` | 裏返したあとに実際に使われた側             | `'top' \| 'bottom' \| 'left' \| 'right'` |

## 補足

1. **座標は終始ビューポート基準**で、`anchor` と同じ空間です。パネルを文書に対して `position: absolute` で置くなら、スタイルを書き込むときに `scrollX` と `scrollY` を自分で足してください（上の使用例を参照）。
2. **実際のレイアウトがなければ、裏返しもずらしも行いません。** `anchor` か `floating` の幅か高さが 0 のとき（実際のレイアウトを一度も行わない jsdom や、中身が定まる前に読まれたパネル）、余白の計算は呼ぶたびに衝突を「検出」してしまいます。ですから `computePlacement` は裏返しもずらしもすべて飛ばし、呼び出し側が望んだ `placement` をそのまま返します。
3. **パネルが境界そのものより大きいときは、ずらしを行いません。** 押し込めば、逆の側へさらに画面の外へ追いやるだけだからです。
4. `ranui` の `r-popover` と `r-select` が内部で使っており、body へポータルしたドロップダウンを画面内にとどめています。
