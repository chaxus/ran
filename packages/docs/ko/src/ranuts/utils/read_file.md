# readFileAs*

`FileReader`를 프로미스로 감싼 것들입니다.

| 함수                              | 해결되는 값   | 쓰임새                                           |
| --------------------------------- | ------------- | ------------------------------------------------ |
| `readFileAsArrayBuffer(blob)`     | `ArrayBuffer` | 바이너리 처리                                    |
| `readFileAsUint8Array(blob)`      | `Uint8Array`  | `checkEncoding` / `arrayBufferToString`에 넘기기 |
| `readFileAsText(blob, encoding?)` | `string`      | 텍스트 파일. 인코딩을 모르면 먼저 알아내세요     |
| `readFileAsDataURL(blob)`         | `string`      | 이미지 미리보기                                  |

## 예시

```js
import { readFileAsUint8Array, arrayBufferToString } from 'ranuts';

input.addEventListener('change', async (e) => {
  const bytes = await readFileAsUint8Array(e.target.files[0]);
  const text = arrayBufferToString(bytes); // 인코딩은 알아서 가려냅니다. GBK/Big5 포함
});
```

## 참고

1. **세 갈래 출구를 모두 연결했습니다**: `onload`, `onerror`, `onabort`. `onabort`를 빠뜨리는 것이야말로, 사용자가 파일 선택을 취소했을 때 프로미스를 영원히 대기 상태로 남기는 고전적인 방법입니다.
2. **`FileReader`가 없는 곳에서는 분명한 오류로 reject합니다**(Node, 일부 워커 문맥).
3. **출처를 모르는 파일에 `new TextDecoder().decode()`를 쓰지 마세요**: UTF-8이라고 단정하는 셈이라 GBK/Big5가 깨집니다. 먼저 가려내는 `arrayBufferToString`을 쓰세요.
