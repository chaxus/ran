# getMime

파일 확장자를 건네면 그 `mime type`을 돌려줍니다.

## API

### 반환값

| 인자     | 설명                     | 타입     |
| -------- | ------------------------ | -------- |
| `string` | `mime type`을 돌려줍니다 | `string` |

### 옵션

| 매개변수 | 설명             | 타입     | 기본값 |
| -------- | ---------------- | -------- | ------ |
| ext      | 파일 확장자 형식 | `string` | 필수   |

## 예시

```js
import { getMime } from 'ranuts';

const result = getMime('.pptx');
console.log(result);
// 'application/vnd.openxmlformats-officedocument.presentationml.presentation'

const res = getMime('.txt');
console.log(res);
// 'text/plain'
```
