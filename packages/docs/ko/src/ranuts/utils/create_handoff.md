# createHandoff

값(`File`, `Blob`, 구조화 복제가 되는 것이면 무엇이든)을 같은 출처의 한 쪽에서 다음 쪽으로 건넵니다.

사용자가 A 쪽에서 고른 `File`은 B 쪽으로 건너가지 못합니다. URL에 담기지도 않고 직렬화도 안 되며, `sessionStorage`가 받는 것은 문자열뿐입니다. IndexedDB는 구조화 복제가 되는 값을 있는 그대로 담아 두므로, A 쪽이 값을 맡겨 두고 옮겨 가면 B 쪽이 그것을 꺼냅니다.

## API

### createHandoff(options)

| 매개변수 | 설명 | 타입 | 기본값 |
| ----------- | -------------------------------------------- | -------- | ----------- |
| `dbName` | 데이터베이스 이름. 양쪽이 같아야 합니다 | `string` | 필수 |
| `storeName` | 객체 저장소 이름. 처음 열 때 만들어집니다 | `string` | `'files'` |
| `key` | 맡겨 둔 단 하나의 값이 놓이는 키 | `string` | `'pending'` |

#### 반환값

| 메서드 | 설명 |
| ------------ | -------------------------------------------------------------------- |
| `put(value)` | 다음 쪽을 위해 값을 맡깁니다. 맡기지 못하면 `false` |
| `take()` | 맡겨 둔 값을 꺼내고 지웁니다. 맡긴 것이 없으면 `null` |

## 예시

### 첫 쪽이 앱에 파일을 건넵니다

```js
import { createHandoff } from 'ranuts';

const handoff = createHandoff({ dbName: 'document-handoff' });

input.addEventListener('change', async () => {
  await handoff.put(input.files[0]);
  location.href = '/app?open=local';
});
```

### 앱이 받아 갑니다

```js
import { createHandoff, queryFlag } from 'ranuts';

const handoff = createHandoff({ dbName: 'document-handoff' });

if (queryFlag('open')) {
  const file = await handoff.take();
  if (file) openDocument(file); // 새로고침하면 null. 값은 이미 쓰였습니다
}
```

## 참고

1. **읽으면 사라집니다.** `take()`는 값을 읽는 바로 그 트랜잭션 안에서 그것을 지웁니다. 새로고침해도 같은 파일이 다시 열리지 않는 까닭이고, 철 지난 `?open=local` URL이 아무것도 찾지 못하는 까닭입니다.

2. **두 탭이 함께 이길 수는 없습니다.** 읽기와 지우기가 한 트랜잭션 안에 있으므로, 탭끼리 다투어도 값은 정확히 한쪽에만 건네집니다.

3. **`put`은 쓰기 요청이 아니라 커밋 시점에 이행합니다.** 값이 굳는 것은 트랜잭션이 커밋된 뒤이고, 쪽은 대개 그 직후에 떠나 버리기 때문입니다.

4. **실패는 조용합니다.** IndexedDB가 없거나 막혀 있으면(SSR, 사생활 보호 모드, 남의 사이트 안의 프레임) `put`은 `false`로, `take`는 `null`로 이행합니다. 무언가를 건네려 _시도만_ 한 쪽이 저장소가 없다는 이유로 망가져서는 안 됩니다.

5. **저장소는 버전 1로 만들어집니다.** 데이터베이스를 먼저 연 쪽이 만들고, 다른 쪽은 이미 있는 것을 찾습니다.

6. **한 번에 하나씩.** 이것은 건네주기이지 대기열이 아닙니다. 두 번째 `put`은 맡겨 둔 값을 덮어씁니다. 진짜 저장이 필요하다면 [`WebDB`](/ko/src/ranuts/utils/web_db)를 쓰세요.
