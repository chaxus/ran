# noop

아무 일도 하지 않는 빈 함수입니다. 기본 콜백이나 자리 채움용으로 흔히 씁니다.

## API

### noop

#### 반환값

| 인자   | 설명        | 타입   |
| ------ | ----------- | ------ |
| `void` | 반환값 없음 | `void` |

#### 매개변수

매개변수 없음

## 예시

### 기본 사용법

```js
import { noop } from 'ranuts';

// 기본 콜백으로
const callback = noop;
callback(); // 아무 일도 일어나지 않습니다
```

### 인자의 기본값으로 쓰기

```js
import { noop } from 'ranuts';

function processData(data, onSuccess = noop, onError = noop) {
  try {
    // 데이터를 처리합니다
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

// 성공 콜백만 넘깁니다
processData({ id: 1 }, (data) => {
  console.log('성공:', data);
});

// 콜백을 하나도 넘기지 않습니다
processData({ id: 2 }); // 예외가 나지 않습니다
```

### 조건부 콜백

```js
import { noop } from 'ranuts';

const handleClick = isEnabled
  ? () => {
      console.log('동작 실행');
    }
  : noop;

button.addEventListener('click', handleClick);
```

### 이벤트 리스너 자리 채우기

```js
import { noop } from 'ranuts';

const unsubscribe = someService.subscribe(noop); // 당분간 이벤트를 다루지 않습니다
```

## 참고

1. **비용**: 빈 함수를 부르는 비용은 거의 없어 기본값으로 알맞습니다.
2. **타입 안전**: TypeScript에서 `noop`의 타입은 `() => void`라, 함수를 받는 자리라면 어디든 안전하게 쓸 수 있습니다.
3. **가독성**: `() => {}`보다 `noop`이 "아무것도 하지 않는다"는 뜻을 더 분명하게 드러냅니다.
