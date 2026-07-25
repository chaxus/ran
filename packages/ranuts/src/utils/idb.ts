// 数据库：IDBDatabase 对象，数据库有版本概念，同一时刻只能有一个版本，每个域名可以建多个数据库
// 对象仓库：IDBObjectStore 对象，类似于关系型数据库的表格
// 索引：IDBIndex 对象，可以在对象仓库中，为不同的属性建立索引，主键建立默认索引
// 事务：IDBTransaction 对象，增删改查都需要通过事务来完成
// 操作请求：IDBRequest 对象
// 指针：IDBCursor 对象
// 主键集合：IDBKeyRange 对象

/**
 * @description: IndexedDB 操作的统一返回结构。所有方法 resolve/reject 的都是这个形状，
 * 调用方只需判断 `error` 即可，不必区分「请求没建起来」和「请求失败了」两种路径。
 */
export interface IDBResult<T = unknown> {
  status: 'success' | 'error' | 'pending';
  code: number;
  data: T;
  error: boolean;
  message?: string;
  progress?: number;
}

/**
 * @description: 对象仓库的声明式 schema。`openDataBase` 会在 `onupgradeneeded` 里
 * 创建缺失的仓库与索引——**建表只能在版本升级事务里做**，所以必须提前声明，
 * 不能等数据库打开后再调 createObjectStore。
 */
export interface IDBStoreSchema {
  name: string;
  options?: IDBObjectStoreParameters;
  indexes?: Array<{
    name: string;
    keyPath: string | string[];
    options?: IDBIndexParameters;
  }>;
}

export interface WebDBOptions {
  dbName: string;
  version?: number;
  /** 声明式仓库定义：升级时自动建缺失的 store / index（已存在的跳过，幂等） */
  stores?: IDBStoreSchema[];
  /** 逃生舱：schema 表达不了的迁移（改 keyPath、搬数据）在这里做，于 stores 建完后调用 */
  upgrade?: (db: IDBDatabase, event: IDBVersionChangeEvent, transaction: IDBTransaction | null) => void;
}

const ok = <T>(data: T): IDBResult<T> => ({ status: 'success', code: 0, data, error: false });

const fail = (message: string, data: unknown = null): IDBResult<never> =>
  ({ status: 'error', code: 1, data, error: true, message }) as IDBResult<never>;

/**
 * @description: IndexedDB 的 Promise 封装。原生 IndexedDB 是事件回调 + 事务式 API，
 * 每次读写都要 open → transaction → objectStore → request → onsuccess/onerror 五步，
 * 这个类把它压成 `await db.add({ storeName, data })`。
 *
 * 三个容易踩的点已内置处理：
 * 1. **版本降级**：用比磁盘上更低的 version 打开会抛 VersionError。这里解析出实际版本、
 *    对齐后自动重开，而不是把错误抛给调用方。
 * 2. **升级阻塞**：其它标签页/worker 持有旧连接时，新版本的升级会一直挂起。
 *    连接上 `onversionchange` 会主动断开自己，让升级方能继续。
 * 3. **建表时机**：仓库只能在 `onupgradeneeded` 里建，故用 `stores` 声明式配置。
 *
 * @example
 * ```ts
 * const db = new WebDB({
 *   dbName: 'read',
 *   version: 4,
 *   stores: [
 *     { name: 'books', options: { keyPath: 'id' }, indexes: [{ name: 'byAuthor', keyPath: 'author' }] },
 *     { name: 'notes', options: { keyPath: 'id' } },
 *   ],
 * });
 * await db.openDataBase();
 * await db.add({ storeName: 'books', data: { id: '1', title: 'Walden' } });
 * ```
 */
export class WebDB {
  database?: IDBDatabase;
  version: number;
  dbName: string;
  private stores: IDBStoreSchema[];
  private upgrade?: WebDBOptions['upgrade'];

  constructor({ dbName, version, stores, upgrade }: WebDBOptions) {
    this.dbName = dbName;
    this.version = version || 1;
    this.stores = stores || [];
    this.upgrade = upgrade;
  }

  /**
   * @description: 打开数据库；版本低于磁盘上的实际版本时自动对齐并重开
   * @return {Promise<IDBResult<{ db: IDBDatabase }>>}
   */
  openDataBase = (): Promise<IDBResult<{ db: IDBDatabase }>> => {
    return new Promise<IDBResult<{ db: IDBDatabase }>>((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(fail('indexedDB is not available'));
        return;
      }
      const request = indexedDB.open(this.dbName, this.version);
      request.onsuccess = () => {
        this.database = request.result;
        this.version = this.database.version;
        // 其他连接（新标签页/worker）请求更高版本时主动断开，避免阻塞升级
        this.database.onversionchange = () => {
          this.database?.close();
          this.database = undefined;
        };
        resolve(ok({ db: this.database }));
      };
      request.onerror = () => {
        // 打开低版本数据库导致失败：解析出磁盘上的实际版本，对齐后重开。
        // 必须把重开的结果接回本次 promise，否则调用方会永远挂着。
        if (request.error && request.error.name === 'VersionError') {
          const message = request.error.message || '';
          const [, existVersion] = message.match(/\d+/g) || [];
          if (Number(existVersion) > this.version) {
            this.version = Number(existVersion);
            this.refreshDatabase().then(resolve, reject);
            return;
          }
        }
        reject(fail('open database error', request.error));
      };
      request.onupgradeneeded = (event) => {
        const db = request.result;
        this.database = db;
        this.version = db.version;
        for (const store of this.stores) {
          const objectStore = db.objectStoreNames.contains(store.name)
            ? request.transaction?.objectStore(store.name)
            : db.createObjectStore(store.name, store.options);
          for (const index of store.indexes || []) {
            if (objectStore && !objectStore.indexNames.contains(index.name)) {
              objectStore.createIndex(index.name, index.keyPath, index.options);
            }
          }
        }
        this.upgrade?.(db, event, request.transaction);
      };
    });
  };

  closeDataBase = (): void => {
    this.database?.close();
    this.database = undefined;
  };

  /** @description: 关闭并重新打开（版本对齐后恢复连接用） */
  refreshDatabase = (): Promise<IDBResult<{ db: IDBDatabase }>> => {
    this.closeDataBase();
    return this.openDataBase();
  };

  deleteDatabase = ({ dbName }: { dbName?: string } = {}): Promise<IDBResult> => {
    return new Promise<IDBResult>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName ?? this.dbName);
      request.onsuccess = () => resolve(ok(null));
      request.onerror = () => reject(fail('delete database error', request.error));
    });
  };

  /** @description: 取一个 objectStore（各自开一个事务，仅适合读一次的场景） */
  getObjectStore = (storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore | undefined => {
    if (!this.database) return undefined;
    return this.database.transaction([storeName], mode).objectStore(storeName);
  };

  /**
   * @description: 把一个 IDBRequest 包成 Promise<IDBResult>，所有读写方法共用。
   * `store` 拿不到（数据库没开 / 仓库不存在）时也走同一条错误出口。
   */
  private run = <T>(
    storeName: string,
    mode: IDBTransactionMode,
    action: (store: IDBObjectStore) => IDBRequest,
    label: string,
    mapResult: (request: IDBRequest) => T,
  ): Promise<IDBResult<T>> => {
    return new Promise<IDBResult<T>>((resolve, reject) => {
      let request: IDBRequest | undefined;
      try {
        const store = this.database?.transaction(storeName, mode).objectStore(storeName);
        request = store && action(store);
      } catch (e) {
        reject(fail(`${label} error`, e));
        return;
      }
      if (!request) {
        reject(fail(`${label} error`));
        return;
      }
      const req = request;
      req.onsuccess = () => resolve(ok(mapResult(req)));
      req.onerror = () => reject(fail(`${label} error`, req.error));
    });
  };

  /** @description: 新增；主键已存在会失败（想覆盖用 update） */
  add = <T = unknown>({ storeName, data }: { storeName: string; data: T }): Promise<IDBResult<T>> =>
    this.run(storeName, 'readwrite', (store) => store.add(data), 'add', () => data);

  /** @description: 写入（put 语义：不存在则插入，存在则覆盖） */
  update = <T = unknown>({ storeName, data }: { storeName: string; data: T }): Promise<IDBResult> =>
    this.run(storeName, 'readwrite', (store) => store.put(data), 'update', () => null);

  readByKey = <T = unknown>({ storeName, key }: { storeName: string; key: IDBValidKey }): Promise<IDBResult<T>> =>
    this.run(storeName, 'readonly', (store) => store.get(key), 'read', (request) => request.result as T);

  /** @description: 读取整个仓库；数据量大时用 readByCursor 逐条处理，避免一次性驻留内存 */
  readAll = <T = unknown>({
    storeName,
    query,
    count,
  }: {
    storeName: string;
    query?: IDBValidKey | IDBKeyRange;
    count?: number;
  }): Promise<IDBResult<T[]>> =>
    this.run(storeName, 'readonly', (store) => store.getAll(query, count), 'read all', (r) => r.result as T[]);

  count = ({ storeName, query }: { storeName: string; query?: IDBValidKey | IDBKeyRange }): Promise<IDBResult<number>> =>
    this.run(storeName, 'readonly', (store) => store.count(query), 'count', (r) => r.result as number);

  /** @description: 游标遍历，按 keyRange / direction 收集结果 */
  readByCursor = <T = unknown>({
    storeName,
    keyRange,
    direction,
  }: {
    storeName: string;
    keyRange?: IDBKeyRange;
    direction?: IDBCursorDirection;
  }): Promise<IDBResult<T[]>> => {
    return new Promise<IDBResult<T[]>>((resolve, reject) => {
      const store = this.database?.transaction(storeName, 'readonly').objectStore(storeName);
      const request = store?.openCursor(keyRange, direction);
      const result: T[] = [];
      if (!request) {
        reject(fail('read cursor error'));
        return;
      }
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          result.push(cursor.value);
          cursor.continue();
        } else {
          resolve(ok(result));
        }
      };
      request.onerror = () => reject(fail('read cursor error', request.error));
    });
  };

  delete = ({ storeName, key }: { storeName: string; key: IDBValidKey }): Promise<IDBResult> =>
    this.run(storeName, 'readwrite', (store) => store.delete(key), 'delete', () => null);

  clear = ({ storeName }: { storeName: string }): Promise<IDBResult> =>
    this.run(storeName, 'readwrite', (store) => store.clear(), 'clear', () => null);
}
