# md5

MD5 해시 함수로, 문자열을 MD5 해시 값(16진수 문자열)으로 바꿉니다.

## API

### md5

#### 반환값

| 인자     | 설명                       | 타입     |
| -------- | -------------------------- | -------- |
| `string` | MD5 해시 값(16진수 문자열) | `string` |

#### 매개변수

| 매개변수 | 설명          | 타입     | 기본값 |
| -------- | ------------- | -------- | ------ |
| `str`    | 해시할 문자열 | `string` | 필수   |

## 예시

### 기본 사용법

```js
import { md5 } from 'ranuts';

const hash = md5('hello world');
console.log(hash); // '5eb63bbbe01eeed093cb22bb8f5acdc3'
```

### 비밀번호 해싱

```js
import { md5 } from 'ranuts';

const password = 'myPassword123';
const hashedPassword = md5(password);
console.log(hashedPassword);
```

### 파일 내용 해싱

```js
import { md5 } from 'ranuts';

const fileContent = '여기에 파일 내용';
const fileHash = md5(fileContent);
console.log('파일 해시:', fileHash);
```

### 문자열이 아닌 값 다루기

```js
import { md5 } from 'ranuts';

// 문자열이 아닌 값을 넘기면 무작위 문자열이 돌아옵니다
const result = md5(123);
console.log(result); // 무작위 문자열
```

## 참고

1. **보안**: MD5는 안전하지 않다고 여겨지므로 비밀번호 저장이나 보안이 걸린 곳에는 쓰지 마세요. SHA-256처럼 더 튼튼한 해시 알고리즘을 권합니다.
2. **입력 타입**: 입력이 문자열이 아니면 무작위 문자열을 반환합니다.
3. **출력 형식**: 32자짜리 16진수 문자열(소문자)을 반환합니다.
4. **성능**: 데이터가 많으면 계산이 느려질 수 있으니 비동기 환경에서 쓰는 편이 좋습니다.
