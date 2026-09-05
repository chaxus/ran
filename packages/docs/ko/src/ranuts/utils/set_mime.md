# setMime

MIME 타입 매핑을 등록하거나 갱신합니다.

## API

### setMime

#### 반환값

| 인자                  | 설명               | 타입                  |
| --------------------- | ------------------ | --------------------- |
| `Map<string, string>` | MIME 타입 매핑 Map | `Map<string, string>` |

#### 매개변수

| 매개변수   | 설명        | 타입     | 기본값 |
| ---------- | ----------- | -------- | ------ |
| `ext`      | 파일 확장자 | `string` | 필수   |
| `mimeType` | MIME 타입   | `string` | 필수   |

## 예시

### 기본 사용법

```js
import { setMime, getMime } from 'ranuts';

// 직접 만든 MIME 타입을 등록합니다
setMime('.myext', 'application/x-my-custom-type');

// MIME 타입을 읽습니다
const mime = getMime('.myext');
console.log(mime); // 'application/x-my-custom-type'
```

### 기존 타입 갱신하기

```js
import { setMime, getMime } from 'ranuts';

// .js의 MIME 타입을 바꿉니다
setMime('.js', 'application/javascript-custom');

const mime = getMime('script.js');
console.log(mime); // 'application/javascript-custom'
```

### 새 타입 추가하기

```js
import { setMime } from 'ranuts';

// 새 파일 종류의 매핑을 추가합니다
setMime('.xyz', 'application/x-xyz-format');
```

## 참고

1. **전역에 영향**: 등록하면 MIME 타입 매핑 전체에 반영되므로 `getMime`을 쓰는 모든 곳이 영향을 받습니다.
2. **덮어씁니다**: 이미 있는 확장자면 원래 MIME 타입을 덮어씁니다.
3. **반환값**: MIME 타입 Map 전체를 반환하므로 이어서 다룰 수 있습니다.
4. **활용**: 직접 만든 파일 종류에 MIME 타입을 붙일 때 흔히 쓰입니다.

## MimeType

`getMime`, `setMime`, `getExtensions`가 모두 읽고 쓰는 바탕의 `Map<string, string>`입니다. 하나를 찾는 대신 알려진 확장자와 타입 쌍을 전부 훑고 싶다면 이것을 직접 가져오세요.

```js
import { MimeType } from 'ranuts/utils';

MimeType.get('.pdf'); // 'application/pdf'
MimeType.size; // 알려진 확장자의 총수
[...MimeType.entries()].filter(([, type]) => type.startsWith('image/'));
```

`setMime`이 고치는 것과 같은 `Map` 인스턴스이므로, `setMime`으로 바꾼 내용이 여기에 곧바로 보이고 그 반대도 마찬가지입니다. 직접 고쳐도 됩니다. `setMime`은 흔한 쓰임에 이름을 붙인 입구일 뿐입니다.
