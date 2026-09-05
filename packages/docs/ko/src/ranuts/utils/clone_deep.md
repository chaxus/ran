# cloneDeep

객체나 배열을 깊게 복제해, 안에 든 객체와 배열까지 아울러 완전히 독립된 사본을 만듭니다.

## API

### cloneDeep

#### 반환값

| 인자  | 설명                   | 타입  |
| ----- | ---------------------- | ----- |
| `any` | 복제된 새 객체 또는 값 | `any` |

#### 매개변수

| 매개변수 | 설명      | 타입  | 기본값 |
| -------- | --------- | ----- | ------ |
| `value`  | 복제할 값 | `any` | 필수   |

## 예시

### 기본 사용법

```js
import { cloneDeep } from 'ranuts';

const original = { a: 1, b: { c: 2 } };
const cloned = cloneDeep(original);

cloned.b.c = 3;
console.log(original.b.c); // 2 (원래 객체는 그대로)
console.log(cloned.b.c); // 3
```

### 배열 복제하기

```js
import { cloneDeep } from 'ranuts';

const original = [1, 2, { a: 3 }];
const cloned = cloneDeep(original);

cloned[2].a = 4;
console.log(original[2].a); // 3 (원래 배열은 그대로)
console.log(cloned[2].a); // 4
```

### 중첩된 객체 복제하기

```js
import { cloneDeep } from 'ranuts';

const original = {
  user: {
    name: 'John',
    address: {
      city: 'New York',
      zip: '10001',
    },
  },
};

const cloned = cloneDeep(original);
cloned.user.address.city = 'Los Angeles';

console.log(original.user.address.city); // 'New York'
console.log(cloned.user.address.city); // 'Los Angeles'
```

### `Date` 객체 복제하기

```js
import { cloneDeep } from 'ranuts';

const original = { date: new Date('2023-01-01') };
const cloned = cloneDeep(original);

cloned.date.setFullYear(2024);
console.log(original.date.getFullYear()); // 2023
console.log(cloned.date.getFullYear()); // 2024
```

## 참고

1. **완전히 독립**: 복제본은 원본과 아무것도 나누어 갖지 않아, 어느 쪽을 고쳐도 서로 영향이 없습니다.
2. **깊은 복제**: 중첩된 객체와 배열을 재귀로 모두 복제합니다.
3. **순환 참조**: 순환 참조도 제대로 다룹니다.
4. **성능**: 객체나 배열이 크면 깊은 복제가 느려질 수 있습니다.
5. **함수와 특수 객체**: 함수나 정규식 같은 일부 특수 객체가 어떻게 복제되는지는 구현에 따라 다를 수 있습니다.
