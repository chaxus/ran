# filterObj

객체의 프로퍼티를 걸러 냅니다. 키가 `list` 배열에 있는 것을 없애고 새 객체를 돌려줍니다. 빈 문자열과 null 값을 털어 내는 데 많이 씁니다.

## API

### 반환값

| 인자     | 설명              | 타입     |
| -------- | ----------------- | -------- |
| `Object` | 걸러 낸 뒤의 객체 | `Object` |

### 옵션

| 인자   | 설명              | 타입     | 기본값 |
| ------ | ----------------- | -------- | ------ |
| `obj`  | 걸러 낼 객체      | `object` | 필수   |
| `list` | `obj`에서 없앨 키 | `array`  | 필수   |

## 예시

```js
import { filterObj } from 'ranuts';

const obj = {
  name: 'chaxus',
  age: 10,
  address: 'spark',
};

const result = filterObj(obj, ['name', 'address']);

console.log(result);

// { age:10 }
```
