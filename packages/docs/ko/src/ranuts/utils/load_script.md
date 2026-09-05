# loadScript

`<script>` 하나를 동적으로 끼워 넣습니다. 같은 내용은 중복으로 보고 거릅니다.

[`scriptOnLoad`](/ko/src/ranuts/utils/script_on_load)와 다른 점: 그쪽은 URL을 **한 묶음**으로 불러오며(`.css`는 `<link>` 태그로 보냅니다), 이쪽은 **하나의** 스크립트를 다루고 인라인 본문도 받으며 같은 스크립트가 딱 한 번만 평가되도록 보장합니다. 서드파티 SDK를 두 번 끼워 넣으면 대개 초기화의 부수 효과까지 두 번 일어납니다.

중복을 가리는 열쇠는 `type + content`의 md5라서, URL과 이름이 같은 인라인 스크립트가 뒤섞일 일은 없습니다.

## 사용법

```ts
import { loadScript } from 'ranuts/utils';

// 외부 스크립트
await loadScript({ type: 'url', content: 'https://cdn.example.com/sdk.js' });

// 인라인 스크립트
await loadScript({ type: 'content', content: 'window.__ready = true;' });

// 두 번째 호출은 아무 일도 하지 않습니다. 이미 평가되었습니다
await loadScript({ type: 'url', content: 'https://cdn.example.com/sdk.js' });
```

## API

### loadScript

#### 매개변수

| 매개변수  | 설명                                                                      | 타입                 | 기본값 |
| --------- | ------------------------------------------------------------------------- | -------------------- | ------ |
| `type`    | `'url'`은 `src`로 불러오고, `'content'`는 스크립트 본문을 그대로 넣습니다 | `'url' \| 'content'` | 필수   |
| `content` | `type`이 `'url'`이면 URL, `'content'`이면 스크립트 본문                   | `string`             | 필수   |

#### 반환값

| 인자      | 설명                                           | 타입                            |
| --------- | ---------------------------------------------- | ------------------------------- |
| `promise` | 평가가 끝나면 `{ success: true }`로 이행됩니다 | `Promise<{ success: boolean }>` |

외부 스크립트를 불러오지 못하면 `{ success: false, error }`로 거부됩니다.

## 참고

**인라인** 스크립트는 붙는 순간 동기로 평가되고, 그 뒤로는 `load` 이벤트를 내지 않습니다. `onload`만 기다리면 실제 브라우저에서는 Promise가 끝없이 대기 상태로 남으므로, `type: 'content'`일 때는 `append`가 돌아오는 즉시 이행합니다. (jsdom은 인라인 스크립트에도 load 이벤트를 _내주기_ 때문에 단위 테스트로는 이 차이를 잡을 수 없습니다.)
