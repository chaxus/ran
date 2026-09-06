# createObjectURL

Blob, ArrayBuffer, Response에서 객체 URL을 만듭니다.

## API

### createObjectURL

#### 반환값

| 인자 | 설명 | 타입 |
| ----------------- | ----------------------------------- | --------- |
| `Promise<string>` | 객체 URL로 이행되는 Promise | `Promise` |

#### 매개변수

| 매개변수 | 설명 | 타입 | 기본값 |
| --------- | ----------- | ------------------------------------------- | -------- |
| `src` | 데이터의 출처 | `Blob \| ArrayBuffer \| Response \| string` | 필수 |

## 예시

### 기본 사용법(Blob)

```js
import { createObjectURL } from 'ranuts';

const blob = new Blob(['Hello World'], { type: 'text/plain' });
const url = await createObjectURL(blob);
console.log(url); // 'blob:http://example.com/...'
```

### ArrayBuffer에서 만들기

```js
import { createObjectURL } from 'ranuts';

const buffer = new ArrayBuffer(8);
const url = await createObjectURL(buffer);
console.log(url); // 'blob:http://example.com/...'
```

### Response에서 만들기

```js
import { createObjectURL } from 'ranuts';

const response = await fetch('https://example.com/image.jpg');
const url = await createObjectURL(response);
console.log(url); // 'blob:http://example.com/...'
```

### 문자열을 넘겼을 때

```js
import { createObjectURL } from 'ranuts';

// 문자열을 넘기면 그대로 돌려줍니다
const url = await createObjectURL('https://example.com/image.jpg');
console.log(url); // 'https://example.com/image.jpg'
```

### 이미지 미리 보기

```js
import { createObjectURL } from 'ranuts';

async function previewImage(file) {
  const url = await createObjectURL(file);
  document.getElementById('preview').src = url;
}
```

## 참고

1. **비동기**: Promise를 반환하니 `await`나 `.then()`으로 다루세요.
2. **받는 타입**: Blob, ArrayBuffer, Response, 문자열을 받습니다.
3. **메모리 관리**: 만들어진 URL은 직접 `URL.revokeObjectURL()`을 불러 풀어 주어야 합니다.
4. **활용**: 파일 미리 보기, 임시 URL 만들기, 이미지 가공 등에 흔히 쓰입니다.

## requestUrlToBuffer

`XMLHttpRequest`로 URL의 내용을 날바이트로 가져옵니다. 그 바이트는 대개 위의 `createObjectURL`로 넘어갑니다. 보여 줄 수 있는 URL로 바꾸기 전에 내용을 살피거나 손보아야 할 때(매직 넘버 확인, 오디오 디코딩 따위) 쓰지요.

```js
import { requestUrlToBuffer, createObjectURL } from 'ranuts/utils';

const result = await requestUrlToBuffer('/assets/clip.webm', {});
if (result.success) {
  const url = await createObjectURL(new Blob([result.data]));
  video.src = url;
}
```

#### 매개변수

| 매개변수 | 설명 | 타입 | 기본값 |
| --------- | ----------------------------------------------------------------------- | ---------------------------------------- | -------- |
| `src` | 가져올 URL | `string` | 필수 |
| `options` | `method`(기본 `'GET'`)와 `responseType`(기본 `'arraybuffer'`) | `Partial<RequestUrlToArraybufferOption>` | 필수 |

#### 반환값

HTTP 200이면 `{ success: true, data, message: '' }`로 이행하고, 그 밖에는 `{ success: false, data: status, message }`로 **거부하는** `Promise`입니다. 실패한 요청은 거부이지 `success: false`로 이행한 것이 아니므로, `.catch()` 없이 `.then()`만 쓰면 처리되지 않은 거부로 드러납니다.

::: tip 새로 짠다면 `fetch`를
이것은 `fetch`가 어디서나 쓰이게 되기 전부터 있던 것이라 속으로 `XMLHttpRequest`를 씁니다. XHR이 꼭 필요한 사정(업로드 진행 이벤트, `abort()`)이 없다면 `fetch(url).then(r =>
r.arrayBuffer())`가 같은 일을, 프로미스 본래의 거부 모양으로 해냅니다.
:::
