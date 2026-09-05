# checkEncoding

`Uint8Array` 데이터의 문자 인코딩을 판별합니다.

## API

### checkEncoding

#### 반환값

| 인자 | 설명 | 타입 |
| -------- | ---------------------- | -------- |
| `string` | 판별된 인코딩 | `string` |

#### 매개변수

| 매개변수 | 설명 | 타입 | 기본값 |
| ------------ | -------------- | ------------ | -------- |
| `uint8Array` | 판별할 데이터 | `Uint8Array` | 필수 |

## 예시

### 기본 사용법

```js
import { checkEncoding } from 'ranuts';

const data = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
const encoding = checkEncoding(data);
console.log(encoding); // 'UTF-8' 등 판별된 인코딩
```

### 파일 인코딩 판별하기

```js
import { checkEncoding } from 'ranuts';

async function detectFileEncoding(file) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const encoding = checkEncoding(uint8Array);
  return encoding;
}
```

### 텍스트 디코딩

```js
import { checkEncoding } from 'ranuts';

function decodeText(uint8Array) {
  const encoding = checkEncoding(uint8Array);
  const decoder = new TextDecoder(encoding);
  return decoder.decode(uint8Array);
}
```

## 참고

1. **의존성**: 인코딩 판별에 `jschardet` 라이브러리를 사용합니다.
2. **기본 인코딩**: 판별에 실패하면 `'utf-8'`로 처리합니다.
3. **정확도**: 인코딩 판별이 100% 정확하지는 않으며, 특히 짧은 글에서는 빗나가기 쉽습니다.
4. **활용**: 파일 처리, 텍스트 디코딩, 문자 인코딩 변환 등에 흔히 쓰입니다.
