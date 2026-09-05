# transformText

`ArrayBuffer`를 텍스트로 바꿉니다. 인코딩을 알아서 판별해 디코딩합니다.

## API

### transformText

#### 반환값

| 인자 | 설명 | 타입 |
| ---------------------------- | ------------------------------------- | ---------------------------- |
| `TransformText \| undefined` | 변환 결과 객체 또는 undefined | `TransformText \| undefined` |

#### TransformText

| 프로퍼티 | 설명 | 타입 |
| ---------- | ----------------- | -------- |
| `encoding` | 판별된 인코딩 | `string` |
| `content` | 디코딩된 텍스트 | `string` |

#### 매개변수

| 매개변수 | 설명 | 타입 | 기본값 |
| --------- | ------------------ | ----------------------- | -------- |
| `content` | 변환할 내용 | `string \| ArrayBuffer` | 필수 |

## 예시

### 기본 사용법

```js
import { transformText } from 'ranuts';

const arrayBuffer = new TextEncoder().encode('Hello World').buffer;
const result = transformText(arrayBuffer);
if (result) {
  console.log('인코딩:', result.encoding);
  console.log('내용:', result.content); // 'Hello World'
}
```

### 파일 처리하기

```js
import { transformText } from 'ranuts';

async function readTextFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = transformText(arrayBuffer);
  if (result) {
    return result.content;
  }
  return null;
}
```

### 인코딩 자동 판별

```js
import { transformText } from 'ranuts';

// 인코딩을 알아서 판별해 디코딩합니다
const result = transformText(arrayBuffer);
if (result) {
  console.log(`${result.encoding} 인코딩으로 디코딩했습니다`);
  console.log(result.content);
}
```

## 참고

1. **자동 판별**: `jschardet`으로 인코딩 종류를 알아냅니다.
2. **`ArrayBuffer`만**: 지금은 `ArrayBuffer`만 지원하며, 문자열을 넘기면 경고를 냅니다.
3. **결과가 나오는 조건**: 인코딩을 판별하고 디코딩까지 성공했을 때만 결과를 돌려주며, 그 밖에는 `undefined`입니다.
4. **활용**: 파일 읽기, 텍스트 디코딩, 인코딩 변환 등에 흔히 쓰입니다.
