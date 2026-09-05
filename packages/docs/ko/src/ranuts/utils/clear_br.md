# clearBr

문자열에서 공백과 HTML 태그, 줄바꿈을 없앱니다.

## API

### clearBr

#### 반환값

| 인자     | 설명          | 타입     |
| -------- | ------------- | -------- |
| `string` | 정리된 문자열 | `string` |

#### 매개변수

| 매개변수 | 설명          | 타입     | 기본값 |
| -------- | ------------- | -------- | ------ |
| `str`    | 정리할 문자열 | `string` | `''`   |

## 예시

### 기본 사용법

```js
import { clearBr } from 'ranuts';

const text = '  <p>Hello\nWorld</p>  ';
const cleaned = clearBr(text);
console.log(cleaned); // 'HelloWorld'
```

### HTML 내용 정리하기

```js
import { clearBr } from 'ranuts';

const html = '<div>이것은 <strong>테스트</strong> 내용</div>\n줄바꿈';
const cleaned = clearBr(html);
console.log(cleaned); // '이것은테스트내용줄바꿈'
```

### 빈 문자열 다루기

```js
import { clearBr } from 'ranuts';

console.log(clearBr('')); // ''(빈 문자열)
console.log(clearBr()); // ''(빈 문자열)
```

## 참고

1. **없애는 것**: 공백과 HTML 태그, 줄바꿈(`\r\n`)을 모두 없앱니다.
2. **빈 문자열 처리**: 입력이 빈 문자열이면 그대로 빈 문자열을 돌려줍니다.
3. **쓰임새**: 서식 표시를 걷어 내고 순수한 텍스트만 뽑을 때 흔히 씁니다.
