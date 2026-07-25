# WebDB

IndexedDB 的 Promise 封装。原生 IndexedDB 是事件回调 + 事务式 API，每次读写都要五步
（open → transaction → objectStore → request → `onsuccess`/`onerror`）。`WebDB` 把它压成
`await db.add({ storeName, data })`。

## API

### new WebDB(options)

| 参数      | 说明                                                  | 类型               | 默认值 |
| --------- | ----------------------------------------------------- | ------------------ | ------ |
| `dbName`  | 数据库名                                              | `string`           | 必填   |
| `version` | schema 版本；改动 `stores` 时必须递增                 | `number`           | `1`    |
| `stores`  | 声明式仓库与索引，在版本升级事务里创建                | `IDBStoreSchema[]` | `[]`   |
| `upgrade` | 逃生舱：schema 表达不了的迁移，在 `stores` 建完后调用 | `Function`         | —      |

所有方法都以统一的 `IDBResult` 形状 resolve/reject，调用方只需判断 `error`。

| 方法                                                 | 说明                               |
| ---------------------------------------------------- | ---------------------------------- |
| `openDataBase()`                                     | 打开（必要时升级）                 |
| `closeDataBase()`                                    | 关闭并释放句柄                     |
| `refreshDatabase()`                                  | 关闭后重开                         |
| `deleteDatabase()`                                   | 删库                               |
| `add({ storeName, data })`                           | 新增；主键已存在则失败             |
| `update({ storeName, data })`                        | put 语义：不存在则插入，存在则覆盖 |
| `readByKey({ storeName, key })`                      | 读单条                             |
| `readAll({ storeName, query?, count? })`             | 读全部                             |
| `readByCursor({ storeName, keyRange?, direction? })` | 游标遍历                           |
| `count({ storeName, query? })`                       | 计数                               |
| `delete({ storeName, key })`                         | 删单条                             |
| `clear({ storeName })`                               | 清空仓库                           |

### `db.collection<T>(name)`

单个仓库的类型化句柄。仓库名只绑一次，返回值直接是普通值而不是 `IDBResult`。

| 成员          | 返回                 | 失败时  |
| ------------- | -------------------- | ------- |
| `get(key)`    | `Promise<T \| null>` | `null`  |
| `all()`       | `Promise<T[]>`       | `[]`    |
| `count()`     | `Promise<number>`    | `0`     |
| `add(value)`  | `Promise<boolean>`   | `false` |
| `put(value)`  | `Promise<boolean>`   | `false` |
| `remove(key)` | `Promise<boolean>`   | `false` |
| `clear()`     | `Promise<boolean>`   | `false` |

```js
const notes = db.collection('books_notes');
await notes.put(note); // 失败返回 false
const all = await notes.all(); // 失败返回 []
```

::: warning 选对层
每个方法都**把错误吞掉**。对大多数应用放进 IndexedDB 的东西（阅读进度、草稿、缓存）这是对的默认值 ——
读失败应该让功能降级，而不是让页面崩。但当写入本身就是用户的动作时（保存文档、完成下单）这个默认值是错的：
那种情况请用上面返回 `IDBResult` 的方法，自己处理失败。
:::

## 示例

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

## 注意

1. **仓库只能在版本升级事务里创建** —— 所以必须提前声明，而不是等数据库打开后再建。
   已存在的仓库/索引会跳过，因此跨版本沿用同一份 `stores` 是安全的。
2. **版本降级会自愈**。用比磁盘上更低的版本打开会抛 `VersionError`；`WebDB` 从中解析出
   真实版本、对齐后重开，而不是把错误抛给调用方。
3. **本连接不会阻塞升级**。每次打开都会注册 `onversionchange`，其它标签页/worker
   请求更高版本时本连接主动断开。
4. **搭配 `singleFlight`** 让并发调用共享同一次打开：
   `const ready = singleFlight(() => db.openDataBase())`。
