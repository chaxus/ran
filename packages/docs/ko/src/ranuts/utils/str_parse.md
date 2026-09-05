# strParse

구분자와 등호를 직접 정해 문자열을 객체로 바꿉니다.

## API

### strParse

#### 반환값

| 인자     | 설명          | 타입                     |
| -------- | ------------- | ------------------------ |
| `Object` | 만들어진 객체 | `Record<string, string>` |

#### 매개변수

| 매개변수 | 설명                   | 타입               | 기본값 |
| -------- | ---------------------- | ------------------ | ------ |
| `str`    | 해석할 문자열          | `string`           | `''`   |
| `sep`    | 키-값 쌍 사이의 구분자 | `string \| RegExp` | `''`   |
| `eq`     | 키와 값 사이의 등호    | `string \| RegExp` | `''`   |

## 예시

### 기본 사용법(URL 질의 문자열)

```js
import { strParse } from 'ranuts';

const query = 'a=1&b=2&c=3';
const result = strParse(query, '&', '=');
console.log(result); // { a: '1', b: '2', c: '3' }
```

### 구분자 바꾸기

```js
import { strParse } from 'ranuts';

const str = 'name:John,age:30,city:NY';
const result = strParse(str, ',', ':');
console.log(result); // { name: 'John', age: '30', city: 'NY' }
```

### 정규식 쓰기

```js
import { strParse } from 'ranuts';

const str = 'a=1|b=2|c=3';
const result = strParse(str, /\|/, '=');
console.log(result); // { a: '1', b: '2', c: '3' }
```

### 빈 값 다루기

```js
import { strParse } from 'ranuts';

const str = 'a=1&b=&c=3';
const result = strParse(str, '&', '=');
console.log(result); // { a: '1', c: '3' } (빈 값은 걸러집니다)
```

## 참고

1. **구분자**: 첫째 인자는 키-값 쌍 사이의 구분자(`&` 따위), 둘째 인자는 키와 값 사이의 등호(`=` 따위)입니다.
2. **빈 값 거르기**: 키나 값이 비어 있으면 알아서 걸러져 결과 객체에 나오지 않습니다.
3. **자동 정리**: 키와 값은 `clearStr`로 정리됩니다(공백, 따옴표 따위를 걷어냅니다).
4. **정규식 지원**: 구분자로 문자열과 정규식을 모두 받습니다.
