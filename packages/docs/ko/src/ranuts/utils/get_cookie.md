# getCookie

주어진 이름의 쿠키 값을 가져옵니다.

## API

### 반환값

| 인자     | 설명                  | 타입     |
| -------- | --------------------- | -------- |
| `string` | 지정한 이름의 쿠키 값 | `string` |

### 옵션

| 인자   | 설명                | 타입     | 기본값 |
| ------ | ------------------- | -------- | ------ |
| `name` | 읽어 올 쿠키의 이름 | `string` | 필수   |

## 예시

```js
import { getCookie } from 'ranuts';

const result = getCookie('name');

console.log(result);

// ''
```
