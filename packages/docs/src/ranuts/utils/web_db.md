# WebDB

A Promise wrapper around IndexedDB. Native IndexedDB is event-callback + transaction based —
every read or write is five steps (open → transaction → objectStore → request →
`onsuccess`/`onerror`). `WebDB` collapses that to `await db.add({ storeName, data })`.

## API

### new WebDB(options)

| Parameter | Description                                                               | Type               | Default  |
| --------- | ------------------------------------------------------------------------- | ------------------ | -------- |
| `dbName`  | Database name                                                             | `string`           | Required |
| `version` | Schema version; bump it whenever `stores` changes                         | `number`           | `1`      |
| `stores`  | Declarative object stores + indexes, created during an upgrade            | `IDBStoreSchema[]` | `[]`     |
| `upgrade` | Escape hatch for migrations the schema cannot express, run after `stores` | `Function`         | —        |

Every method resolves or rejects with the same `IDBResult` shape, so callers only check `error`.

| Method                                               | Description                     |
| ---------------------------------------------------- | ------------------------------- |
| `openDataBase()`                                     | Open (and upgrade if needed)    |
| `closeDataBase()`                                    | Close and drop the handle       |
| `refreshDatabase()`                                  | Close then reopen               |
| `deleteDatabase()`                                   | Delete the database             |
| `add({ storeName, data })`                           | Insert; fails if the key exists |
| `update({ storeName, data })`                        | Put — insert or overwrite       |
| `readByKey({ storeName, key })`                      | Read one record                 |
| `readAll({ storeName, query?, count? })`             | Read every record               |
| `readByCursor({ storeName, keyRange?, direction? })` | Walk with a cursor              |
| `count({ storeName, query? })`                       | Count records                   |
| `delete({ storeName, key })`                         | Delete one record               |
| `clear({ storeName })`                               | Empty a store                   |

## Example

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

## Notes

1. **Stores can only be created inside an upgrade transaction** — that's why they are declared
   up front rather than created after the database opens. Creating a missing store or index is
   idempotent, so it is safe to keep the same `stores` array across versions.
2. **Version downgrades self-heal.** Opening with a version lower than what is on disk throws a
   `VersionError`; `WebDB` parses the real version out of it, realigns and reopens instead of
   surfacing the error.
3. **Upgrades are never blocked by this connection.** Each open registers `onversionchange`,
   so when another tab or worker asks for a higher version this connection closes itself.
4. **Pair it with `singleFlight`** so concurrent callers share one open:
   `const ready = singleFlight(() => db.openDataBase())`.
