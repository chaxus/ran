# isImageSize

이미지 파일의 크기가 요구한 조건에 맞는지 확인합니다.

## API

### isImageSize

#### 반환값

| 인자               | 설명                                         | 타입      |
| ------------------ | -------------------------------------------- | --------- |
| `Promise<boolean>` | 크기가 조건에 맞는지 여부로 이행되는 Promise | `Promise` |

#### 매개변수

| 매개변수 | 설명                | 타입     | 기본값 |
| -------- | ------------------- | -------- | ------ |
| `file`   | 이미지 파일 객체    | `File`   | 필수   |
| `width`  | 기대하는 너비(선택) | `number` | 선택   |
| `height` | 기대하는 높이(선택) | `number` | 선택   |

## 예시

### 기본 사용법

```js
import { isImageSize } from 'ranuts';

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      // 너비가 800인지 확인합니다
      const isValid = await isImageSize(file, 800);
      if (isValid) {
        console.log('이미지 너비가 조건에 맞습니다');
      } else {
        console.log('이미지 너비가 조건에 맞지 않습니다');
      }
    } catch (error) {
      console.error('확인에 실패했습니다:', error);
    }
  }
});
```

### 너비와 높이 모두 확인하기

```js
import { isImageSize } from 'ranuts';

async function validateImage(file) {
  // 800x600인지 확인합니다
  const isValid = await isImageSize(file, 800, 600);
  return isValid;
}
```

### 높이만 확인하기

```js
import { isImageSize } from 'ranuts';

const isValid = await isImageSize(file, undefined, 600);
// 높이가 600인지만 확인합니다
```

### 올리기 전에 확인하기

```js
import { isImageSize } from 'ranuts';

async function handleFileUpload(file) {
  const isValid = await isImageSize(file, 1920, 1080);
  if (!isValid) {
    alert('이미지 크기는 1920x1080이어야 합니다');
    return;
  }
  // 업로드를 이어 갑니다
}
```

## 동작

1. **`width`와 `height`를 다 주면 둘 다 맞아야 합니다.** 둘 다 주지 않으면 그 파일이 이미지로 디코딩되는지만 확인합니다.
2. **디코딩에 실패하면 거부합니다.** 깨진 파일이나 이미지가 아닌 파일일 때 프로미스를 대기 상태로 내버려 두지 않습니다.
3. **객체 URL은 언제나 풀어 줍니다.** 성공하든 실패하든 풀어 주므로, 파일을 여럿 확인해도 blob URL이 쪽을 떠날 때까지 새지 않습니다.
4. **브라우저 전용**: SSR에서는 분명한 오류로 거부합니다.

::: warning 0.3에서 고쳤습니다
예전에는 둘째 조건이 첫째 조건을 덮어써서, `width`와 `height`를 함께 주면 `width`가 소리 없이 무시됐습니다. `onerror`가 없어서 깨진 파일을 주면 프로미스가 영영 대기 상태로 남았고, SSR을 막는 부분은 `reject`를 부르고도 return하지 않은 채 계속 나아가 `window`를 건드리며 `ReferenceError`를 던졌습니다.
:::

## 참고

1. **비동기**: Promise를 반환하니 `await`나 `.then()`으로 다루세요.

2. **인자에 대하여**:
   - `width`만 주면 너비만 확인합니다
   - `height`만 주면 높이만 확인합니다
   - 둘 다 주면 둘 다 맞아야 합니다

3. **서버 환경**: 서버 환경(`window` 객체가 없는 경우)에서는 거부합니다.

4. **메모리 정리**: 만들어진 객체 URL은 함수가 안에서 알아서 치우므로 손댈 것이 없습니다.

5. **활용**: 파일을 올리기 전 크기 확인, 프로필 사진 크기 확인 등에 흔히 쓰입니다.
