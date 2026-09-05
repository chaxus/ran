# scriptOnLoad

script나 link 태그를 동적으로 끼워 넣고 모든 리소스가 불릴 때까지 기다립니다.

## API

### scriptOnLoad

#### 반환값

| 인자            | 설명                                        | 타입      |
| --------------- | ------------------------------------------- | --------- |
| `Promise<void>` | 모든 리소스를 다 불렀을 때 이행되는 Promise | `Promise` |

#### 매개변수

| 매개변수   | 설명                           | 타입          | 기본값 |
| ---------- | ------------------------------ | ------------- | ------ |
| `urls`     | 리소스 URL의 배열              | `string[]`    | 필수   |
| `append`   | 끼워 넣을 부모 요소(선택)      | `HTMLElement` | `body` |
| `callback` | 모두 불렸을 때 부를 콜백(선택) | `Function`    | 선택   |

## 예시

### 기본 사용법

```js
import { scriptOnLoad } from 'ranuts';

// 스크립트 하나 불러오기
await scriptOnLoad(['https://example.com/script.js']);
console.log('스크립트를 불렀습니다');
```

### 여러 리소스 불러오기

```js
import { scriptOnLoad } from 'ranuts';

// 여러 스크립트와 스타일을 한꺼번에 불러옵니다
await scriptOnLoad([
  'https://example.com/script1.js',
  'https://example.com/script2.js',
  'https://example.com/style.css',
]);
console.log('모든 리소스를 불렀습니다');
```

### 콜백 쓰기

```js
import { scriptOnLoad } from 'ranuts';

scriptOnLoad(['https://example.com/library.js'], document.body, () => {
  console.log('다 불렀으니 이제 쓸 수 있습니다');
});
```

### 서드파티 라이브러리를 동적으로 불러오기

```js
import { scriptOnLoad } from 'ranuts';

async function loadLibrary() {
  await scriptOnLoad(['https://cdn.example.com/library.js']);
  // 라이브러리를 불렀으니 쓸 수 있습니다
  window.Library.init();
}
```

## 참고

1. **종류 자동 판별**: URL 끝(`.css`)을 보고 스타일인지 스크립트인지 알아서 가려냅니다.
2. **동시에 불러오기**: 모든 리소스를 동시에 불러오고, 전부 끝난 뒤에 이행됩니다.
3. **끼워 넣는 자리**: 기본은 `body` 요소지만 다른 부모 요소도 지정할 수 있습니다.
4. **Promise와 콜백**: 둘 다 지원하며 함께 써도 됩니다.
