# buildOffsets / indexForOffset / segmentByRanges

"내용은 덩어리로 나뉘어 있지만 주석은 이어 붙인 글 전체를 기준으로 저장한다"는 상황을 위한 좌표 계산입니다. 하이라이트를 "N번째 덩어리의 M번째 글자"가 아니라 **전체에서의 오프셋**으로 저장해 두면 다시 나누어도 살아남습니다. 글자 크기든 쪽 너비든 조각 크기든 바꿔도 주석은 여전히 같은 낱말을 가리킵니다.

## API

### buildOffsets(lengths)

누적합입니다. `offsets[i]`는 `i`번째 덩어리 앞에 있는 모든 것의 길이 합입니다.

```js
buildOffsets([3, 5, 2]); // [0, 3, 8]
```

### indexForOffset(offsets, offset)

전체에서의 오프셋이 어느 덩어리에 드는지 이분 탐색으로 찾습니다. 범위를 벗어난 오프셋은 `[0, offsets.length - 1]`로 죄어지고, 빈 배열이면 `0`을 돌려줍니다. 돌아온 값은 언제나 색인으로 써도 안전합니다.

### segmentByRanges(text, chunkStart, ranges)

한 덩어리를 맨 부분과 걸린 부분으로 갈라 조각마다 따로 그릴 수 있게 합니다(하이라이트, 검색 결과, 차이 색칠).

| 매개변수     | 설명                                         | 타입                        |
| ------------ | -------------------------------------------- | --------------------------- |
| `text`       | 이 덩어리의 글                               | `string`                    |
| `chunkStart` | 이 덩어리가 전체에서 시작하는 오프셋         | `number`                    |
| `ranges`     | 전체 좌표로 나타낸 `{ start, end, value }[]` | `readonly OffsetRange<T>[]` |

`{ text, start, end, value }[]`을 돌려줍니다. 어느 범위에도 덮이지 않은 글에서는 `value`가 `null`입니다. 조각들을 이어 붙이면 언제나 원래 `text`가 되고, 조각은 적어도 하나는 나옵니다.

## 예시

```js
import { buildOffsets, indexForOffset, segmentByRanges } from 'ranuts';

const offsets = buildOffsets(pages.map((p) => p.text.length));

// 이 메모는 어느 쪽에서 시작하는가?
const pageIndex = indexForOffset(offsets, note.start);

// 한 쪽을 하이라이트와 함께 그립니다
const segments = segmentByRanges(
  pages[i].text,
  offsets[i],
  notes.map((n) => ({
    start: n.start,
    end: n.end,
    value: n,
  })),
);
segments.forEach((s) => container.append(s.value ? mark(s.text, s.value) : text(s.text)));
```

## 참고

1. **범위는 반열린 구간** `[start, end)`입니다.
2. **겹침은 합치는 것이 아니라 갈라서 풉니다.** 범위는 순서대로 처리되며, 뒤의 범위는 아직 덮이지 않은 부분만 가져갑니다. 앞의 범위에 통째로 삼켜진 것은 버려집니다. 자르는 지점이 반드시 커지므로 실수로 빈 조각이 생기거나 조각이 겹치는 일이 없습니다.
3. **덩어리 밖의 범위는 무시되고** 일부만 겹치는 것은 잘려 나가므로, 주석 목록 전체를 어느 덩어리에나 그대로 넘겨도 됩니다.
