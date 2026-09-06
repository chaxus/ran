# localStorage 도우미

예외를 던지지 않는 localStorage 접근, 그리고 그 위에 얹은 접두사 붙은 JSON 시야입니다.

`localStorage`는 SSR에서 그저 없기만 한 것이 아닙니다. 쿠키가 막힌 남의 사이트 iframe 안에서는 _건드리는_ 순간 예외가 나고, 사파리 사생활 보호 모드나 용량 한도에서는 _쓸 때_ 예외가 납니다. 여기서는 읽기와 쓰기마다 모두 방패를 둘렀습니다. 저장에 실패하더라도 설정 하나가 못 먹히는 정도로 그쳐야지, 쪽이 무너져서는 안 되니까요.

## API

### localStorageSetItem

localStorage에 값을 씁니다.

#### 매개변수

| 매개변수 | 설명    | 타입     | 기본값 |
| -------- | ------- | -------- | ------ |
| `name`   | 키 이름 | `string` | 필수   |
| `value`  | 값      | `string` | 필수   |

#### 반환값

반환값 없음(`void`)

### localStorageGetItem

localStorage에서 값을 읽습니다.

#### 매개변수

| 매개변수 | 설명    | 타입     | 기본값 |
| -------- | ------- | -------- | ------ |
| `name`   | 키 이름 | `string` | 필수   |

#### 반환값

| 인자     | 설명                                     | 타입     |
| -------- | ---------------------------------------- | -------- |
| `string` | 저장된 값. 없으면 빈 문자열을 돌려줍니다 | `string` |

### localStorageRemoveItem

키를 뗍니다.

| 매개변수 | 설명    | 타입     | 기본값 |
| -------- | ------- | -------- | ------ |
| `name`   | 키 이름 | `string` | 필수   |

### createStore(prefix?)

localStorage 위에 얹은, 접두사가 붙고 JSON으로 직렬화하는 시야입니다.

#### 반환값

| 메서드               | 설명                                                                  |
| -------------------- | --------------------------------------------------------------------- |
| `get(key, fallback)` | 저장된 값. 없거나, 쓸 수 없거나, 깨졌으면 `fallback`                  |
| `set(key, value)`    | 직렬화해 저장합니다. 아무것도 못 썼으면 `false`                       |
| `remove(key)`        | 그 키를 뗍니다                                                        |
| `keyOf(key)`         | 온전한 저장 키(`prefix + key`). `storage` 이벤트를 들을 때 요긴합니다 |

## 예시

### 기본 사용법

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// 값을 씁니다
localStorageSetItem('username', 'john');

// 값을 읽습니다
const username = localStorageGetItem('username');
console.log(username); // 'john'
```

### 객체 저장하기

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

const user = { name: 'John', age: 30 };
localStorageSetItem('user', JSON.stringify(user));

const storedUser = JSON.parse(localStorageGetItem('user'));
console.log(storedUser); // { name: 'John', age: 30 }
```

### 서버에서의 안전성

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// 서버 환경에서도 예외를 내지 않고 조용히 실패합니다
localStorageSetItem('key', 'value'); // 서버에서는 아무 일도 없습니다
const value = localStorageGetItem('key'); // 서버에서는 ''를 돌려줍니다
```

### 있는지 확인하기

```js
import { localStorageGetItem } from 'ranuts';

const value = localStorageGetItem('myKey');
if (value) {
  console.log('값이 있습니다:', value);
} else {
  console.log('값이 없습니다');
}
```

### 이름 공간이 붙은 JSON 저장

```js
import { createStore } from 'ranuts';

const history = createStore('agent_history_');

history.set('default', messages); // agent_history_default에 씁니다
const restored = history.get('default', []); // 없거나 깨졌으면 []
history.remove('default');
```

### 한 출처에 여러 기능

```js
import { createStore } from 'ranuts';

// 접두사 덕분에 상관없는 기능끼리 부딪히지 않습니다.
const keys = createStore('agent_api_key_');
const prefs = createStore('editor_prefs_');

keys.set('anthropic', token);
prefs.set('theme', 'dark');
```

## 참고

1. **여기 있는 것은 아무것도 예외를 던지지 않습니다.** 저장소가 없든, 남의 사이트 프레임이 막혔든, 사생활 보호 모드든, 용량이 찼든, 모두 조용히 물러섭니다. `localStorageGetItem`은 `''`를 돌려주고, 쓰는 쪽은 아무 일도 하지 않으며, `createStore().set()`은 `false`를 알립니다.

2. **방패를 두르는 시점은 호출할 때이지 모듈을 불러올 때가 아닙니다.** 저장소를 찾는 일이 호출마다 안에서 일어나므로, SSR 뒤 하이드레이션 상황에서도 돌아가고 테스트에서 갈아 끼울 수도 있습니다.

3. **`createStore`는 아무것도 검증하지 않습니다.** 저장돼 있던 것이 그대로 `T` 타입으로 돌아옵니다. 버전 경계를 넘는다면 직접 확인하세요. 대체값이 받아 주는 것은 값이 없는 경우와 파싱 실패뿐입니다. 옛 버전 코드가 써 둔 값이 부르는 쪽으로 `SyntaxError`를 던지지는 않지만, 모양이 어긋날 수는 있습니다.

4. **`set`이 `false`를 돌려주는 것은** 순환 구조, `BigInt`, 그리고 쓰기가 끝내 닿지 못한 경우입니다. 쓴 뒤 다시 읽어 확인합니다.

5. **타입의 한계**: 맨 도우미들이 다루는 것은 문자열뿐입니다. 호출하는 자리마다 `JSON.stringify`와 `JSON.parse`에 try/catch를 손수 두르는 대신 `createStore`를 쓰세요.

6. **반환값**: 값이 없을 때 `localStorageGetItem`은 `null`이 아니라 `''`를 돌려줍니다.
