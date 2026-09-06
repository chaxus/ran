# WebDB

IndexedDB를 프로미스로 감싼 것입니다. 맨 IndexedDB는 이벤트 콜백과 트랜잭션에 기대고 있어, 읽거나 쓸 때마다 다섯 단계(열기 → 트랜잭션 → objectStore → 요청 → `onsuccess`/`onerror`)를 밟습니다. `WebDB`는 그것을 `await db.add({ storeName, data })` 한 줄로 줄입니다.

## API

### new WebDB(options)

| 매개변수  | 설명                                                               | 타입               | 기본값 |
| --------- | ------------------------------------------------------------------ | ------------------ | ------ |
| `dbName`  | 데이터베이스 이름                                                  | `string`           | 필수   |
| `version` | 스키마 버전. `stores`가 바뀔 때마다 올리세요                       | `number`           | `1`    |
| `stores`  | 객체 저장소와 색인의 선언. 업그레이드 때 만들어집니다              | `IDBStoreSchema[]` | `[]`   |
| `upgrade` | 스키마로는 나타낼 수 없는 이관을 위한 비상구. `stores` 뒤에 돕니다 | `Function`         | —      |

모든 메서드가 같은 `IDBResult` 모양으로 이행하거나 거부하므로, 부르는 쪽은 `error`만 보면 됩니다.

| 메서드                                               | 설명                                  |
| ---------------------------------------------------- | ------------------------------------- |
| `openDataBase()`                                     | 엽니다(필요하면 업그레이드도)         |
| `closeDataBase()`                                    | 닫고 쥐고 있던 손잡이를 놓습니다      |
| `refreshDatabase()`                                  | 닫았다가 다시 엽니다                  |
| `deleteDatabase()`                                   | 데이터베이스를 지웁니다               |
| `add({ storeName, data })`                           | 넣습니다. 키가 이미 있으면 실패합니다 |
| `update({ storeName, data })`                        | put입니다. 넣거나 덮어씁니다          |
| `readByKey({ storeName, key })`                      | 레코드 하나를 읽습니다                |
| `readAll({ storeName, query?, count? })`             | 모든 레코드를 읽습니다                |
| `readByCursor({ storeName, keyRange?, direction? })` | 커서로 훑습니다                       |
| `count({ storeName, query? })`                       | 레코드를 셉니다                       |
| `delete({ storeName, key })`                         | 레코드 하나를 지웁니다                |
| `clear({ storeName })`                               | 저장소를 비웁니다                     |

### `db.collection<T>(name)`

저장소 하나에 대한, 타입이 붙고 너그러운 손잡이입니다. 저장소 이름을 한 번 묶어 두고, `IDBResult` 대신 맨 값을 돌려줍니다.

| 멤버          | 반환값               | 실패했을 때 |
| ------------- | -------------------- | ----------- |
| `get(key)`    | `Promise<T \| null>` | `null`      |
| `all()`       | `Promise<T[]>`       | `[]`        |
| `count()`     | `Promise<number>`    | `0`         |
| `add(value)`  | `Promise<boolean>`   | `false`     |
| `put(value)`  | `Promise<boolean>`   | `false`     |
| `remove(key)` | `Promise<boolean>`   | `false`     |
| `clear()`     | `Promise<boolean>`   | `false`     |

```js
const notes = db.collection('books_notes');
await notes.put(note); // 실패하면 false
const all = await notes.all(); // 실패하면 []
```

::: warning 알맞은 층을 고르세요
이 메서드들은 모두 **오류를 삼킵니다**. 대개의 앱이 IndexedDB에 두는 것들(어디까지 읽었는지, 초안, 캐시)에는 이것이 옳은 기본값입니다. 읽기가 실패하면 그 기능이 수수해질 뿐, 화면이 무너져서는 안 되니까요. 하지만 그 쓰기 _자체_ 가 사용자의 행위일 때(문서 저장, 결제 완료)는 잘못된 기본값입니다. 그럴 때는 위의 `IDBResult`를 돌려주는 메서드를 부르고 실패를 직접 다루세요.
:::

## 예시

```js
import { WebDB } from 'ranuts';

const db = new WebDB({
  dbName: 'read',
  version: 4,
  stores: [
    { name: 'books', options: { keyPath: 'id' }, indexes: [{ name: 'byAuthor', keyPath: 'author' }] },
    { name: 'notes', options: { keyPath: 'id' } },
  ],
});

await db.openDataBase();
await db.add({ storeName: 'books', data: { id: '1', title: 'Walden' } });
const { data } = await db.readByKey({ storeName: 'books', key: '1' });
```

## 참고

1. **저장소는 업그레이드 트랜잭션 안에서만 만들 수 있습니다.** 데이터베이스를 연 뒤에 만드는 대신 미리 선언해 두는 까닭이 이것입니다. 없는 저장소나 색인을 만드는 일은 몇 번을 해도 결과가 같으므로, 버전이 바뀌어도 같은 `stores` 배열을 그대로 두어도 됩니다.
2. **버전을 낮춘 것은 스스로 아뭅니다.** 디스크에 있는 것보다 낮은 버전으로 열면 `VersionError`가 나는데, `WebDB`는 거기서 진짜 버전을 읽어 내 맞춘 뒤 다시 엽니다. 오류를 밖으로 내보내지 않습니다.
3. **이 연결이 업그레이드를 막는 일은 없습니다.** 열 때마다 `onversionchange`를 걸어 두므로, 다른 탭이나 워커가 더 높은 버전을 청하면 이 연결이 스스로 닫힙니다.
4. **`singleFlight`와 짝지어 쓰세요.** 그러면 동시에 부른 쪽들이 한 번의 열기를 함께 씁니다. `const ready = singleFlight(() => db.openDataBase())`처럼요.
