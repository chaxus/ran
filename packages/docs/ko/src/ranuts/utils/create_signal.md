# createSignal

가장 단출한 시그널입니다. `[읽기, 쓰기]`를 돌려주며, 원하면 공유 버스인 [`subscribers`](./sync_hook)로 알림을 흘려 상관없는 모듈도 변화에 반응할 수 있게 합니다.

## API

### createSignal(value, options?)

#### 매개변수

| 매개변수             | 설명                                              | 타입                                         | 기본값      |
| -------------------- | ------------------------------------------------- | -------------------------------------------- | ----------- |
| `value`              | 처음 값                                           | `T`                                          | 필수        |
| `options.subscriber` | 이벤트 이름. 값이 바뀌면 `subscribers`로 알립니다 | `string`                                     | `undefined` |
| `options.equals`     | "바뀌었는지"를 어떻게 가릴지                      | `boolean \| ((prev: T, next: T) => boolean)` | `true`      |

`equals`의 뜻:

| 값               | 동작                                                    |
| ---------------- | ------------------------------------------------------- |
| 생략 또는 `true` | `Object.is`. 참조나 값으로서의 같음(시그널의 표준 동작) |
| `false`          | 쓸 때마다 변화로 보고 알립니다                          |
| 함수             | `true`를 돌려주면 "같으니 알리지 말라"는 뜻입니다       |

#### 반환값

`[getter, setter]`.

## 예시

```js
import { createSignal, isEqual, subscribers } from 'ranuts';

const [count, setCount] = createSignal(0, { subscriber: 'count-changed' });
subscribers.tap('count-changed', () => render(count()));

setCount(1); // 알립니다
setCount(1); // 같은 값이라 알리지 않습니다

// 정말 필요할 때만 깊은 비교를 골라 씁니다
const [tree, setTree] = createSignal(initial, { equals: isEqual });
```

## 참고

1. **기본은 참조로 견줍니다.** 속이 똑같더라도 새로 만든 객체는 변화가 _맞습니다_. 이는 시그널의 표준 동작이며, 쓰기를 O(1)로 지켜 줍니다.
2. **깊은 비교는 골라 쓰는 것입니다.** `{ equals: isEqual }`로 쓰면 되니, 그 비용이 부르는 자리에서 눈에 보입니다.
3. **`subscriber`는 선택입니다.** 없으면 시그널은 그저 지역 상태입니다.

::: warning 0.3에서 달라졌습니다
동작이 바뀌는 수정이 둘 있습니다.

- `{ equals: true }`는 전에 "언제나 같다"는 뜻이어서 시그널을 얼려 **한 번도 갱신되지 않게** 했습니다. 이제는 `undefined`와 마찬가지로 "기본 비교를 쓰라"는 뜻입니다.
- 전에는 쓸 때마다 `equals` 위에 `cloneDeep`과 `isEqual`까지 돌았습니다. 쓰기라는 잦은 길목에 데이터 크기만큼의 복제를 얹은 셈이고, 그 덤으로 붙은 깊은 검사가 `equals`를 덮어써서 `{ equals: false }`("언제나 알림")가 속이 똑같은 값에는 소리 없이 아무 일도 하지 않았습니다. 둘 다 없앴습니다.
  :::
