# parseChineseNumber / parseRomanNumber / parseEnglishNumber

사람이 읽으라고 쓴 숫자를 해석합니다. `第二十三章`, `Chapter XIV`, `Part Three` 같은 것들입니다.

세 함수 모두 같은 약속을 지킵니다. 입력을 끝까지 해석할 수 없으면 **넘겨짚지 않고 `null`을 반환합니다**. 이런 파서는 보통 "이 줄이 제목인가"라는 판단에 쓰이는데, 숫자 하나만 잘못 읽어도 연속성 검사 전체가 망가집니다.

## API

| 함수                        | 받아들이는 것                                                 |
| --------------------------- | ------------------------------------------------------------- |
| `parseChineseNumber(value)` | 숫자(반각·전각), `一二三…`, 자릿수 `十百千万/萬`, 간체와 번체 |
| `parseRomanNumber(value)`   | `IVXLCDM`, 대소문자 무관, 뺄셈 표기(`IV`, `IX`)               |
| `parseEnglishNumber(value)` | 숫자, 영어 수사 `one`–`twenty`, 그다음 로마 숫자              |

관련 문자열 헬퍼: `toHalfWidth(value)` / `toFullWidth(value)`는 전각 문자를 정규화하며, `parseChineseNumber`가 이를 알아서 적용합니다.

## 예시

```js
import { parseChineseNumber, parseRomanNumber, parseEnglishNumber, toHalfWidth } from 'ranuts';

parseChineseNumber('二十三'); // 23
parseChineseNumber('一百零三'); // 103
parseChineseNumber('三萬'); // 30000
parseChineseNumber('第三章'); // null — 숫자 부분을 먼저 떼어 내세요

parseRomanNumber('MCMXCIV'); // 1994
parseEnglishNumber('Three'); // 3
toHalfWidth('（１）'); // '(1)'
```

## 참고

1. **숫자 부분만 넘기세요.** `第三章`은 `null`을 반환합니다. 직접 만든 패턴으로 `三`을 먼저 뽑아낸 다음 해석하세요.
2. **앞에 아무것도 없는 `十`은 1입니다.** 그래서 `十五`는 5가 아니라 15입니다.
3. **`parseEnglishNumber`는 숫자 → 수사 → 로마 숫자 순으로 시도합니다.** `twenty-one` 이상은 다루지 않으니, 필요하면 수사 표를 넓히세요.
