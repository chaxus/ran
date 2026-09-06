# merge

객체를 합칩니다. 둘째 객체의 속성을 첫째 객체로 옮겨 씁니다.

## API

### merge

#### 반환값

| 인자     | 설명                                | 타입     |
| -------- | ----------------------------------- | -------- |
| `Object` | 합쳐진 객체(첫째 객체를 돌려줍니다) | `Object` |

#### 매개변수

| 매개변수 | 설명                               | 타입     | 기본값 |
| -------- | ---------------------------------- | -------- | ------ |
| `a`      | 대상 객체(고쳐집니다)              | `Object` | 필수   |
| `b`      | 원본 객체(속성이 `a`로 옮겨집니다) | `Object` | 선택   |

## 예시

### 기본 사용법

```js
import { merge } from 'ranuts';

const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

const result = merge(obj1, obj2);
console.log(result); // { a: 1, b: 3, c: 4 }
console.log(obj1); // { a: 1, b: 3, c: 4 } (원래 객체가 고쳐졌습니다)
console.log(result === obj1); // true (원래 객체를 돌려줍니다)
```

### 설정 객체 합치기

```js
import { merge } from 'ranuts';

const defaultConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
};

const userConfig = {
  port: 8080,
  ssl: true,
};

const config = merge(defaultConfig, userConfig);
console.log(config);
// { host: 'localhost', port: 8080, timeout: 5000, ssl: true }
```

### 인자를 하나만 넘기기

```js
import { merge } from 'ranuts';

const obj = { a: 1 };
const result = merge(obj);
console.log(result); // { a: 1 } (그대로 돌려줍니다)
```

## 참고

1. **원래 객체를 고칩니다**: 새 객체를 만들지 않고 첫째 객체를 곧바로 고칩니다.
2. **얕은 합치기**: 한 겹만 합치며, 중첩된 객체까지 깊이 들어가지 않습니다.
3. **덮어쓰기**: 두 객체에 같은 키가 있으면 둘째 객체의 값이 첫째 값을 덮습니다.
4. **반환값**: 첫째 객체(이미 고쳐진 것)를 돌려줍니다.

## mergeExports

이름은 비슷해도 다른 물건입니다. 평범한 값을 옮겨 쓰는 대신, 게터들의 목록에서 **게으르게 평가되고 얼어붙은** 내보내기 객체를 짓습니다. 각 게터는 처음 손댈 때 많아야 한 번 돌고, 그다음부터는 결과가 갈무리됩니다. `ranuts/utils`가 따로 내보내는 바로 그 `once` 감싸개를 씁니다. 중첩된 평범한 객체는 재귀로 합쳐지고 얼려집니다. 게터도 중첩 객체도 아닌 것을 주면 예외가 납니다.

```js
import { mergeExports } from 'ranuts/utils';

const lazyModule = mergeExports(
  {},
  {
    get expensive() {
      console.log('computing...');
      return heavyComputation();
    },
    nested: {
      get value() {
        return 42;
      },
    },
  },
);

lazyModule.expensive; // 'computing...'을 찍고 나서 결과를 돌려줍니다
lazyModule.expensive; // 갈무리한 결과를 돌려주고 다시 찍지 않습니다
```

#### Notes

1. **두루 쓰는 합치기가 아닙니다.** 평범한 값에는 `merge`를 쓰세요. `mergeExports`는 몇몇 속성의 계산이 비싸서 정말로 읽힐 때만 돌아야 하는, 모듈 모양의 객체를 지을 때 쓰는 것입니다.
2. **결과는 얼어붙습니다**(`Object.freeze`). 정의되는 속성은 모두 `configurable: false`이므로, 돌려받은 객체를 다시 대입할 수도, 속성을 더할 수도 없습니다.
3. **그 밖의 것은 예외를 냅니다.** 게터도 아니고 평범한 중첩 객체도 아닌 값(배열, 함수, 곧바로 대입한 원시값)을 주면 `Exposed values must be either
a getter or a nested object`가 던져집니다.
