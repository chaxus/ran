# convertImageToBase64

이미지 파일을 Base64 문자열로 바꿉니다.

## API

### convertImageToBase64

#### 반환값

| 인자                                  | 설명                         | 타입      |
| ------------------------------------- | ---------------------------- | --------- |
| `Promise<convertImageToBase64Return>` | 결과 객체로 이행되는 Promise | `Promise` |

#### convertImageToBase64Return

| 프로퍼티  | 설명             | 타입                            |
| --------- | ---------------- | ------------------------------- |
| `success` | 잘 되었는지 여부 | `boolean`                       |
| `data`    | Base64 데이터    | `string \| ArrayBuffer \| null` |
| `message` | 오류 메시지      | `string`                        |

#### 매개변수

| 매개변수 | 설명             | 타입   | 기본값 |
| -------- | ---------------- | ------ | ------ |
| `file`   | 이미지 파일 객체 | `File` | 필수   |

## 예시

### 기본 사용법

```js
import { convertImageToBase64 } from 'ranuts';

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const result = await convertImageToBase64(file);
      if (result.success) {
        console.log('Base64:', result.data);
        // img의 src에 그대로 쓸 수 있습니다
        document.getElementById('preview').src = result.data;
      }
    } catch (error) {
      console.error('변환에 실패했습니다:', error);
    }
  }
});
```

### 올리기 전에 미리 보기

```js
import { convertImageToBase64 } from 'ranuts';

async function previewImage(file) {
  const result = await convertImageToBase64(file);
  if (result.success) {
    return result.data; // data:image/jpeg;base64,...
  }
  throw new Error('이미지 변환에 실패했습니다');
}
```

### 오류 다루기

```js
import { convertImageToBase64 } from 'ranuts';

try {
  const result = await convertImageToBase64(file);
  if (!result.success) {
    console.error('오류:', result.message);
  }
} catch (error) {
  console.error('예외:', error);
}
```

## 참고

1. **비동기**: Promise를 반환하니 `await`나 `.then()`으로 다루세요.

2. **파일 종류**: 브라우저가 지원하는 이미지 형식(JPEG, PNG, GIF, WebP 등)을 모두 받습니다.

3. **데이터 형식**: 반환되는 `data`는 완전한 Data URL(`data:image/jpeg;base64,...`)이라 `img` 태그의 `src` 속성에 그대로 넣을 수 있습니다.

4. **오류 처리**: 변환이 실패하면 Promise가 거부되니 잡아 주세요.

5. **활용**: 이미지 미리 보기, 올리기 전 가공, 로컬 저장 등에 흔히 쓰입니다.
