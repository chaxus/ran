# getStatus / status

HTTP 상태 코드와 메시지를 맞바꿔 찾는 표, 그리고 양방향 도우미 `getStatus`입니다. Node의 `http.STATUS_CODES`가 주는 것과 같은 자료를 브라우저에서도 쓸 수 있게 꾸린 것입니다.

## 사용법

```ts
import { getStatus, status } from 'ranuts/utils';

getStatus(404); // 'Not Found'
getStatus('404'); // 'Not Found' — 숫자 문자열은 코드로 먼저 읽습니다
getStatus('not found'); // 404 — 아니면 메시지로 찾습니다(대소문자는 가리지 않습니다)

status.redirect[302]; // true
status.empty[204]; // true
status.retry[503]; // true
```

## API

### `getStatus(code)`

#### 매개변수

| 매개변수 | 설명                                     | 타입               | 기본값 |
| -------- | ---------------------------------------- | ------------------ | ------ |
| `code`   | 상태 코드, 숫자 문자열, 또는 상태 메시지 | `number \| string` | 필수   |

#### 반환값

`number | string`입니다. `number`를 넘기면 **메시지**가, `string`을 넘기면 **코드**가 돌아옵니다(`'404'` 같은 숫자 문자열은 코드로 먼저 읽고, 아는 코드가 아닐 때만 메시지로 찾습니다). 둘 다 아니면 예외를 던집니다.

### `status`

| 필드       | 설명                                                                      | 타입                   |
| ---------- | ------------------------------------------------------------------------- | ---------------------- |
| `message`  | 코드 → 메시지                                                             | `Map<number, string>`  |
| `code`     | 소문자로 만든 메시지 → 코드                                               | `Map<string, number>`  |
| `codes`    | 알려진 코드 전부                                                          | `number[]`             |
| `redirect` | 리다이렉트를 뜻하는 코드(`300`, `301`, `302`, `303`, `305`, `307`, `308`) | `Record<number, true>` |
| `empty`    | 본문이 없는 코드(`204`, `205`, `304`)                                     | `Record<number, true>` |
| `retry`    | 다시 시도할 만한 코드(`502`, `503`, `504`)                                | `Record<number, true>` |

## 참고

1. **모르는 코드나 메시지를 주면 `getStatus`는 예외를 던집니다.** 인자가 `number`도 `string`도 아니면 `TypeError`, 그 밖에는 `Error`입니다. 통신에서 읽어 온 상태 코드처럼 올바름이 보장되지 않는 입력이라면 `try`/`catch`로 감싸거나 먼저 `status.codes.includes(n)`으로 확인하세요.
2. **`status.redirect`, `empty`, `retry`는 `Set`이 아니라 그냥 객체입니다.** 들어 있는지는 `.has()`가 아니라 `status.retry[code]`로 확인하세요.
3. 브라우저와 Node 양쪽에서 돕니다(`ranuts/utils`). 그래서 서버 쪽 `ranuts/node` 핸들러가 쓰는 것과 같은 코드↔메시지 대응을 클라이언트에서도 그대로 쓸 수 있습니다.
