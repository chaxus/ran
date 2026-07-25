// Database: IDBDatabase — versioned, only one version active at a time, and an origin may
//   hold several databases.
// Object store: IDBObjectStore — the equivalent of a table in a relational database.
// Index: IDBIndex — an index over any property of an object store; the primary key is
//   indexed by default.
// Transaction: IDBTransaction — every read and write goes through one.
// Request: IDBRequest
// Cursor: IDBCursor
// Key range: IDBKeyRange

/**
 * @description: The uniform result shape of every IndexedDB operation. Every method
 * resolves and rejects with this shape, so callers only need to check `error` rather than
 * distinguishing "the request was never created" from "the request failed".
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
 * @description: Declarative schema for object stores. `openDataBase` creates the missing
 * stores and indexes inside `onupgradeneeded` — **stores can only be created in a version
 * upgrade transaction**, so they must be declared up front; createObjectStore cannot be
 * called after the database is open.
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
  /** Declarative store definitions: missing stores / indexes are created on upgrade (existing ones are skipped — idempotent) */
  stores?: IDBStoreSchema[];
  /** Escape hatch: migrations the schema cannot express (changing a keyPath, moving data) go here, called after `stores` are created */
  upgrade?: (db: IDBDatabase, event: IDBVersionChangeEvent, transaction: IDBTransaction | null) => void;
}

const ok = <T>(data: T): IDBResult<T> => ({ status: 'success', code: 0, data, error: false });

const fail = (message: string, data: unknown = null): IDBResult<never> =>
  ({ status: 'error', code: 1, data, error: true, message }) as IDBResult<never>;

/**
 * @description: A Promise wrapper over IndexedDB. The native API is event-callback and
 * transaction based — every read or write takes five steps (open → transaction →
 * objectStore → request → onsuccess/onerror); this class collapses that into
 * `await db.add({ storeName, data })`.
 *
 * Three easy traps are handled internally:
 * 1. **Version downgrade**: opening with a version lower than the one on disk throws a
 *    VersionError. Here the actual version is parsed out and the database reopened aligned
 *    to it, instead of surfacing the error to the caller.
 * 2. **Blocked upgrade**: an upgrade hangs while another tab or worker holds an old
 *    connection. `onversionchange` on the connection closes it so the upgrading side can
 *    proceed.
 * 3. **When stores can be created**: only inside `onupgradeneeded`, hence the declarative
 *    `stores` configuration.
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
   * @description: Open the database; when the requested version is below the one on disk,
   * align to it and reopen automatically
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
        // Close this connection when another one (a new tab/worker) asks for a higher
        // version, so the upgrade is not blocked
        this.database.onversionchange = () => {
          this.database?.close();
          this.database = undefined;
        };
        resolve(ok({ db: this.database }));
      };
      request.onerror = () => {
        // Failed because the requested version is older than the stored one: parse the
        // actual version, align and reopen. The reopen result must feed back into this
        // promise, otherwise the caller waits forever.
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

  /** @description: Close and reopen (used to restore the connection after aligning versions) */
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

  /** @description: Get an objectStore (each call opens its own transaction — only suitable for a single read) */
  getObjectStore = (storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore | undefined => {
    if (!this.database) return undefined;
    return this.database.transaction([storeName], mode).objectStore(storeName);
  };

  /**
   * @description: Wrap an IDBRequest into a Promise<IDBResult>, shared by every read and
   * write method. When `store` cannot be obtained (database not open / store missing) the
   * failure takes the same error path.
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

  /** @description: Insert; fails when the primary key already exists (use `update` to overwrite) */
  add = <T = unknown>({ storeName, data }: { storeName: string; data: T }): Promise<IDBResult<T>> =>
    this.run(
      storeName,
      'readwrite',
      (store) => store.add(data),
      'add',
      () => data,
    );

  /** @description: Write with `put` semantics: insert when absent, overwrite when present */
  update = <T = unknown>({ storeName, data }: { storeName: string; data: T }): Promise<IDBResult> =>
    this.run(
      storeName,
      'readwrite',
      (store) => store.put(data),
      'update',
      () => null,
    );

  readByKey = <T = unknown>({ storeName, key }: { storeName: string; key: IDBValidKey }): Promise<IDBResult<T>> =>
    this.run(
      storeName,
      'readonly',
      (store) => store.get(key),
      'read',
      (request) => request.result as T,
    );

  /** @description: Read a whole store; for large volumes use readByCursor to process record by record instead of holding everything in memory */
  readAll = <T = unknown>({
    storeName,
    query,
    count,
  }: {
    storeName: string;
    query?: IDBValidKey | IDBKeyRange;
    count?: number;
  }): Promise<IDBResult<T[]>> =>
    this.run(
      storeName,
      'readonly',
      (store) => store.getAll(query, count),
      'read all',
      (r) => r.result as T[],
    );

  count = ({
    storeName,
    query,
  }: {
    storeName: string;
    query?: IDBValidKey | IDBKeyRange;
  }): Promise<IDBResult<number>> =>
    this.run(
      storeName,
      'readonly',
      (store) => store.count(query),
      'count',
      (r) => r.result as number,
    );

  /** @description: Walk a cursor, collecting results per keyRange / direction */
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
    this.run(
      storeName,
      'readwrite',
      (store) => store.delete(key),
      'delete',
      () => null,
    );

  clear = ({ storeName }: { storeName: string }): Promise<IDBResult> =>
    this.run(
      storeName,
      'readwrite',
      (store) => store.clear(),
      'clear',
      () => null,
    );
}
