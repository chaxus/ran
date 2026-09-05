# detectLanguage

글자 비율로 글의 주된 언어를 정합니다. 모델도 사전도 없는 순수한 통계입니다. "어떤 토크나이저를 쓸지 / 어떤 언어 전용 모델을 쓸지 / 어떤 조판 수치를 쓸지"를 갈라야 할 때 쓰세요.

## API

### detectLanguage(text, sampleSize?)

| 매개변수 | 설명 | 타입 | 기본값 |
| ------------ | -------------------- | -------- | -------- |
| `text` | 살펴볼 글 | `string` | 필수 |
| `sampleSize` | 표본으로 볼 글자 수 | `number` | `20000` |

`'zh' \| 'en' \| 'other'`를 반환합니다.

### navigatorLanguage()

브라우저 UI 언어를 같은 세 갈래로 옮긴 값입니다. 살펴볼 내용이 없을 때의 기본값이며, SSR에서는 `'other'`를 반환합니다.

## 예시

```js
import { detectLanguage, navigatorLanguage } from 'ranuts';

const lang = book.content ? detectLanguage(book.content) : navigatorLanguage();
const model = { zh: 'chapter-title-zh-v1', en: 'chapter-title-en-v1' }[lang];
```

## 참고

1. **앞부분만 표본으로 봅니다.** 글의 언어는 처음부터 끝까지 한결같습니다. 첫 문단이 이미 알려 주는 사실을 알자고 100만 자짜리 책을 훑는 것은 낭비입니다.
2. **영어가 조금 섞인 중국어 글은 그대로 중국어입니다.** 판정이 영어로 넘어가려면 라틴 문자가 뚜렷하게(3배가 넘게) 우세해야 합니다. 중국어에 영어를 섞는 일은 흔하지만 그 반대는 그렇지 않습니다.
3. **`'other'`는 "CJK도 라틴도 아니다"라는 뜻입니다.** 일본어 가나, 키릴 문자, 아랍 문자, 숫자만 있는 글이 모두 여기에 들어갑니다. 언어를 식별하는 것이 아니라 거칠게 셋으로 나누는 것입니다.
