# isEqual

두 값이 같은지 깊게 견줍니다. 객체, 배열, 날짜처럼 복잡한 타입도 다룹니다.

## API

### isEqual

#### 반환값

| 인자 | 설명 | 타입 |
| --------- | -------------------------------- | --------- |
| `boolean` | 두 값이 같은지 여부 | `boolean` |

#### 매개변수

| 매개변수 | 설명 | 타입 | 기본값 |
| --------- | ----------------------- | ----- | -------- |
| `value` | 견줄 첫째 값 | `any` | 필수 |
| `other` | 견줄 둘째 값 | `any` | 필수 |

## 예시

### 기본 사용법

```js
import { isEqual } from 'ranuts';

console.log(isEqual(1, 1)); // true
console.log(isEqual(1, 2)); // false
console.log(isEqual('hello', 'hello')); // true
```

### 객체 견주기

```js
import { isEqual } from 'ranuts';

const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const obj3 = { a: 1, b: { c: 3 } };

console.log(isEqual(obj1, obj2)); // true
console.log(isEqual(obj1, obj3)); // false
```

### 배열 견주기

```js
import { isEqual } from 'ranuts';

const arr1 = [1, 2, { a: 3 }];
const arr2 = [1, 2, { a: 3 }];
const arr3 = [1, 2, { a: 4 }];

console.log(isEqual(arr1, arr2)); // true
console.log(isEqual(arr1, arr3)); // false
```

### 날짜 견주기

```js
import { isEqual } from 'ranuts';

const date1 = new Date('2023-01-01');
const date2 = new Date('2023-01-01');
const date3 = new Date('2023-01-02');

console.log(isEqual(date1, date2)); // true
console.log(isEqual(date1, date3)); // false
```

### 순환 참조 다루기

```js
import { isEqual } from 'ranuts';

const obj1 = { a: 1 };
obj1.self = obj1;

const obj2 = { a: 1 };
obj2.self = obj2;

console.log(isEqual(obj1, obj2)); // true (순환 참조도 다룹니다)
```

## 참고

1. **깊은 비교**: 객체와 배열의 모든 속성을 재귀로 견줍니다.
2. **순환 참조**: 순환 참조도 제대로 다룹니다.
3. **타입 확인**: 값의 타입도 보므로 타입이 다르면 `false`를 반환합니다.
4. **성능**: 객체나 배열이 크면 깊은 비교가 느려질 수 있습니다.
