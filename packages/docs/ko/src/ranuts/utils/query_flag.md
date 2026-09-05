# queryFlag / isInIframe

URL의 불리언 플래그를 읽고, 이 쪽이 남의 페이지에 박혀 있는지 가려냅니다. `?embed`, `?readonly`, `?debug` 뒤에 있는 두 가지 확인입니다.

## API

| 함수                   | 설명                                            |
| ---------------------- | ----------------------------------------------- |
| `queryFlag(key, url?)` | 질의 매개변수가 참으로 읽히는지                 |
| `isInIframe()`         | 이 쪽이 iframe 안에서 도는지. SSR에서는 `false` |

### `queryFlag`

| 매개변수 | 설명                        | 타입     | 기본값          |
| -------- | --------------------------- | -------- | --------------- |
| `key`    | 매개변수 이름               | `string` | 필수            |
| `url`    | 완전한 URL 또는 질의 문자열 | `string` | 지금의 location |

`?k`, `?k=`, `?k=1`, `?k=true`는 참입니다(대소문자는 가리지 않습니다). 그 밖은 모두 거짓이며, 매개변수가 없는 경우와 대놓고 `?k=false`라고 쓴 경우도 거짓입니다.

## 예시

### 플래그 읽기

```js
import { queryFlag } from 'ranuts';

queryFlag('embed', '?embed'); // true  ← 가장 흔한 표기
queryFlag('embed', '?embed=1'); // true
queryFlag('embed', '?embed=true'); // true
queryFlag('embed', '?embed=false'); // false
queryFlag('embed', '?lang=en'); // false
```

### 삽입 모드 가려내기

```js
import { queryFlag, isInIframe } from 'ranuts';

// 프레임 안에 있거나 품는 쪽이 대놓고 요청했다면 삽입된 것으로 봅니다.
const embedded = isInIframe() || queryFlag('embed') || queryFlag('embedded');

if (embedded) {
  document.body.classList.add('embed-mode');
}
```

### 남의 페이지 안에서는 계측하지 않기

```js
import { isInIframe } from 'ranuts';

// 여기서 계측하면 품은 사이트의 방문자를 우리 몫으로 세게 됩니다.
if (!isInIframe()) initAnalytics();
```

### 읽기 전용 미리 보기

```js
import { queryFlag } from 'ranuts';

openDocument(file, { readonly: queryFlag('readonly') });
```

## 참고

1. **값 없이 플래그만 쓰는 것이 가장 흔한 표기입니다.** `?embed`에는 값이 없으므로 `getQuery(url).embed`는 `''`(거짓으로 평가되는 값)이고, 참·거짓만 보는 검사는 가장 흔한 형태를 소리 없이 놓칩니다. `queryFlag`가 있는 까닭입니다.

2. **`?k=false`는 거짓입니다.** "적혀 있으니 켜진 것"으로 보지 않고, 대놓고 쓴 부정을 그대로 존중합니다.

3. **`isInIframe`은 막아 두었습니다.** `window.parent`를 읽으면 엔진에 따라 오리진이 다를 때 예외가 날 수 있습니다. 읽히지 않는 부모는 삽입된 것으로 봅니다. 읽히지 않는다는 것이 바로 그런 뜻이기 때문입니다.

4. **둘 다 SSR에서 안전합니다.** `window`가 없으면 `isInIframe`은 `false`이고, `queryFlag`도 `url`을 넘기지 않는 한 `false`입니다. URL만 건네면 빌드 스크립트에서도 둘 다 쓸 수 있습니다.
