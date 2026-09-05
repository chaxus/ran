# getExtensions

MIME 타입에 해당하는 파일 확장자 배열을 가져옵니다.

## API

### getExtensions

#### 반환값

| 인자 | 설명 | 타입 |
| -------- | ---------------------------------- | ---------- |
| `Array` | 파일 확장자 배열(점 없음) | `string[]` |

#### 매개변수

| 매개변수 | 설명 | 타입 | 기본값 |
| ---------- | ----------- | -------- | -------- |
| `mimeType` | MIME 타입 | `string` | 필수 |

## 예시

### 기본 사용법

```js
import { getExtensions } from 'ranuts';

const exts = getExtensions('image/jpeg');
console.log(exts); // ['jpeg', 'jpg', 'jpe']
```

### 모든 확장자 가져오기

```js
import { getExtensions } from 'ranuts';

const jsExts = getExtensions('application/javascript');
console.log(jsExts); // ['js', 'jsx', 'ts', 'tsx']
```

### 파일 종류 검사

```js
import { getExtensions } from 'ranuts';

function isValidImageFile(filename, mimeType) {
  const exts = getExtensions(mimeType);
  const fileExt = filename.split('.').pop();
  return exts.includes(fileExt);
}

console.log(isValidImageFile('photo.jpg', 'image/jpeg')); // true
```

## 참고

1. **반환 형식**: 반환되는 확장자에는 점(`.`)이 붙지 않습니다. `'.jpg'`가 아니라 `'jpg'`입니다.
2. **여러 확장자**: 하나의 MIME 타입이 여러 확장자에 대응할 수 있으며, 해당하는 것을 모두 반환합니다.
3. **빈 배열**: MIME 타입이 존재하지 않으면 빈 배열을 반환합니다.
4. **활용**: 파일 종류 검사, 업로드 확인 등에 흔히 쓰입니다.
