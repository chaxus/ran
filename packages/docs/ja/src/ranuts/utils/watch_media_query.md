# matchMediaQuery / watchMediaQuery

CSS のメディアクエリーを JavaScript から読み取り、購読します。

レイアウトの判断には `isMobile()` よりこちらを選んでください。UA の判別が見分けるのは**デバイス**で、メディアクエリーが見分けるのは**ビューポート**です。デスクトップのブラウザーを狭めたときやタブレットを回したときに正しいのは、後者だけです。

## API

| 関数                               | 説明                                                     |
| ---------------------------------- | -------------------------------------------------------- |
| `matchMediaQuery(query)`           | いまその条件に一致しますか。SSR では `false`             |
| `watchMediaQuery(query, callback)` | 変化を購読します。購読解除の関数を返します               |
| `MOBILE_MEDIA_QUERY`               | `'(max-width: 768px)'`。共有のモバイル用ブレークポイント |

## 使用例

```js
import { MOBILE_MEDIA_QUERY, watchMediaQuery } from 'ranuts';

const off = watchMediaQuery(MOBILE_MEDIA_QUERY, (isMobile) => render(isMobile));
onCleanup(off);
```

## 補足

1. **コールバックは、いまの値で一度だけ同期的に呼ばれます。** だから初期状態を別に読み取る必要がありません。
2. **必ず購読を解除してください。** 解放されない `MediaQueryList` のリスナーは、そのクロージャー（とそれが捕まえた DOM）を生かし続けます。
3. **古い Safari にも対応しています。** `MediaQueryList` の `addEventListener` は Safari 14 でようやく入ったので、`addListener` / `removeListener` をフォールバックとして使います。
