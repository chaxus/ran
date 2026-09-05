# matchMediaQuery / watchMediaQuery

CSS 미디어 쿼리를 JavaScript에서 읽고 구독합니다.

레이아웃을 정할 때는 `isMobile()`보다 이쪽을 쓰세요. UA를 훑는 것은 **기기**를 가려내고, 미디어 쿼리는 **뷰포트**를 가려냅니다. 데스크톱 브라우저를 좁히거나 태블릿을 돌렸을 때 옳은 쪽은 후자뿐입니다.

## API

| 함수                               | 설명                                           |
| ---------------------------------- | ---------------------------------------------- |
| `matchMediaQuery(query)`           | 지금 이 쿼리가 맞나요? SSR에서는 `false`       |
| `watchMediaQuery(query, callback)` | 변화를 구독합니다. 구독 해제 함수를 돌려줍니다 |
| `MOBILE_MEDIA_QUERY`               | `'(max-width: 768px)'`. 공용 모바일 중단점     |

## 예시

```js
import { MOBILE_MEDIA_QUERY, watchMediaQuery } from 'ranuts';

const off = watchMediaQuery(MOBILE_MEDIA_QUERY, (isMobile) => render(isMobile));
onCleanup(off);
```

## 참고

1. **콜백은 지금 값으로 한 번 동기적으로 불립니다.** 그래서 초기 상태를 따로 읽을 일이 없습니다.
2. **반드시 구독을 해제하세요.** 풀리지 않은 `MediaQueryList` 리스너는 그 클로저(그리고 그것이 붙잡은 DOM)를 계속 살려 둡니다.
3. **옛 Safari도 챙깁니다.** `MediaQueryList`의 `addEventListener`는 Safari 14에서야 들어왔기에, `addListener`/`removeListener`를 대체 수단으로 씁니다.
