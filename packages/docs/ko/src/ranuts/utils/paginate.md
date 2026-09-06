# paginateText

일반 텍스트를 정해진 상자에 들어맞는 쪽으로 자릅니다. 독서 앱, 프롬프터, 인쇄용 미리 보기에 씁니다.

순수한 산술입니다. 상자와 글자 치수를 숫자로 받을 뿐 DOM에는 손대지 않습니다. 담는 그릇을 메인 스레드에서 한 번 재어 두면, 이후에는 워커에서도 서버에서도 테스트 안에서도 쪽을 나눌 수 있습니다.

## API

### paginateText(text, box, metrics, options?)

| 매개변수         | 설명                                                             | 타입              |
| ---------------- | ---------------------------------------------------------------- | ----------------- |
| `text`           | 원본 텍스트. `\r\n`과 `\r`는 `\n`으로 고릅니다                   | `string`          |
| `box`            | `{ width, height }`(px)                                          | `TextBox`         |
| `metrics`        | `{ charWidth, lineHeight, narrowRatio? }`(px)                    | `TextGridMetrics` |
| `options.minBox` | 이보다 작은 상자는 아직 배치되지 않은 것으로 봅니다. 기본값 `30` | `number`          |

`narrowRatio`는 ASCII 문자의 나아감을 `charWidth`에 대한 비로 나타낸 값입니다. 기본값은 `0.5625`(9/16)입니다.

`{ pages, total, charsPerLine, linesPerPage, charsPerPage }`를 돌려줍니다. 각 쪽은 `{ text, start, end, index }`이며, 위치는 고른 뒤의 원본을 기준으로 합니다.

## 예시

```js
import { paginateText } from 'ranuts';

const { width, height } = container.getBoundingClientRect();
const result = paginateText(book, { width, height }, { charWidth: 18.4, lineHeight: 40 });

render(result.pages[0].text);
console.log(`${result.pages.length}쪽, 한 줄에 ${result.charsPerLine}자`);
```

## 참고

1. **고정폭 격자를 전제합니다.** 모든 문자가 한 칸(CJK, 전각)이나 그 `narrowRatio`만큼(ASCII) 나아갑니다. 고정폭 글꼴이라면 그대로 맞고 CJK 위주의 본문이라면 충분히 가깝지만, 비례 라틴 문자에 대한 진짜 자형 처리를 **대신하지는** 못합니다.
2. **ASCII 낱말은 쪼개지 않습니다.** 낱말이 한 줄보다 길지 않은 한, 쪽이 낱말 중간에서 끝나는 일은 없습니다. 그보다 길면 쪼갤 수밖에 없습니다.
3. **위치는 끊김 없이 이어집니다.** `pages[i].start === pages[i - 1].end`이고, 모든 `page.text`를 이어 붙이면 고른 뒤의 원본이 그대로 되살아납니다. 주석을 전체 기준 위치로 저장해 두고 쪽을 다시 나눠도 그대로 쓸 수 있는 까닭이 이것입니다. [segmentByRanges](./segment)를 보세요.
4. **`minBox`보다 작은 상자에서는 쪽을 돌려주지 않습니다.** 그러지 않으면 그릇의 치수가 아직 0인 첫 그리기 중에 쪽 나누기가 돌아 헛돕니다.

::: tip 한 쪽보다 긴 낱말
URL, base64 덩어리, 길게 이어진 하이픈은 모두 낱말을 이루는 글자로 셉니다. 그런 연속이 한 쪽을 넘겨 이어질 때는 미룰 "다음 쪽"이 없으므로 그대로 끊습니다. 대신 미루려 들면 커서가 그 쪽이 시작된 자리로 되감깁니다. 쪽은 빈 채로 나오고 루프는 한 걸음도 나아가지 못합니다. 배치가 어그러지는 정도가 아니라 멎어 버리는 것이지요.
:::
