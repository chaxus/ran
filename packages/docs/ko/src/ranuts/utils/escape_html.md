# escapeHtml

HTML 특수 문자를 이스케이프해 XSS 공격을 막습니다.

## API

### escapeHtml

#### 반환값

| 인자     | 설명                | 타입     |
| -------- | ------------------- | -------- |
| `string` | 이스케이프된 문자열 | `string` |

#### 매개변수

| 매개변수 | 설명                | 타입                       | 기본값 |
| -------- | ------------------- | -------------------------- | ------ |
| `string` | 이스케이프할 문자열 | `string \| number \| null` | 필수   |

## 예시

### 기본 사용법

```js
import { escapeHtml } from 'ranuts';

const html = '<script>alert("XSS")</script>';
const escaped = escapeHtml(html);
console.log(escaped); // '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
```

### 특수 문자 이스케이프하기

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml('"hello"')); // '&quot;hello&quot;'
console.log(escapeHtml("'world'")); // '&#39;world&#39;'
console.log(escapeHtml('a & b')); // 'a &amp; b'
console.log(escapeHtml('<div>')); // '&lt;div&gt;'
```

### 숫자와 null 다루기

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml(123)); // '123'
console.log(escapeHtml(null)); // 'null'
```

### XSS 공격 막기

```js
import { escapeHtml } from 'ranuts';

const userInput = '<img src=x onerror=alert(1)>';
const safe = escapeHtml(userInput);
document.getElementById('content').textContent = safe;
// 안전하게 표시되며 스크립트는 실행되지 않습니다
```

## 참고

1. **이스케이프되는 문자**: 다음 문자들이 바뀝니다.
   - `"` → `&quot;`
   - `'` → `&#39;`
   - `&` → `&amp;`
   - `<` → `&lt;`
   - `>` → `&gt;`

2. **타입 변환**: 문자열이 아닌 값은 먼저 문자열로 바꾼 뒤 이스케이프합니다.

3. **보안**: XSS 공격을 막기 위한 것이므로, 사용자가 입력한 내용을 보여 줄 때 쓰세요.

4. **성능**: 특수 문자가 없는 문자열은 원래 문자열을 그대로 돌려줍니다.
