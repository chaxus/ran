// 数据库：IDBDatabase 对象，数据库有版本概念，同一时刻只能有一个版本，每个域名可以建多个数据库
// 对象仓库：IDBObjectStore 对象，类似于关系型数据库的表格
// 索引：IDBIndex 对象，可以在对象仓库中，为不同的属性建立索引，主键建立默认索引
// 事务：IDBTransaction 对象，增删改查都需要通过事务来完成，事务对象提供了 error,abord,complete 三个回调方法，监听操作结果
// 操作请求：IDBRequest 对象
// 指针：IDBCursor 对象
// 主键集合：IDBKeyRange 对象，主键是默认建立索引的属性，可以取当前层级的某个属性，也可以指定下一层对象的属性，还可以是一个递增的整数

export interface IDBResult<T = unknown> {
  status: 'success' | 'error' | 'pending';
  code: number;
  data: T;
  error: boolean;
  message?: string;
  progress?: number;
}

export class WebDB {
  database?: IDBDatabase;
  version: number;
  dbName: string;
  constructor({ dbName, version }: { dbName: string; version?: number }) {
    this.dbName = dbName;
    this.version = version || 1;
  }
  openDataBase = (): Promise<IDBResult<{ db: IDBDatabase }>> => {
    return new Promise<IDBResult<{ db: IDBDatabase }>>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onsuccess = () => {
        this.database = request.result;
        this.version = this.database.version;
        resolve({
          status: 'success',
          data: {
            db: this.database,
          },
          code: 0,
          error: false,
        });
      };
      request.onerror = () => {
        // 打开低版本数据库导致失败
        if (request.error && request.error.name === 'VersionError') {
          try {
            const message = request.error.message || '';
            const regexp = /The requested version \(\d+\) is less than the existing version \(\d\)/;
            const isVersionLowError = message.search(regexp);
            if (isVersionLowError > -1) {
              const [_, existVersion] = message.match(/\d+/g) || [];
              if (+existVersion > this.version) {
                this.version = +existVersion;
                this.refreshDatabase();
              }
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          reject({
            status: 'error',
            data: request.error,
            code: 1,
            message: 'open database error',
            error: true,
          });
        }
      };
      request.onupgradeneeded = (_event) => {
        this.database = request.result;
        this.version = this.database.version;
        // 在这里创建 ObjectStore
        if (this.database && !this.database.objectStoreNames.contains('books_info')) {
          this.database.createObjectStore('books_info', { keyPath: 'id' });
        }
        resolve({
          status: 'success',
          data: {
            db: this.database,
          },
          code: 0,
          error: false,
        });
      };
    });
  };
  closeDataBase = (): void => {
    this.database?.close();
  };
  deleteDatabase = ({ dbName }: { dbName: string }): Promise<IDBResult> => {
    return new Promise<IDBResult>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName);
      request.onsuccess = () => {
        resolve({
          status: 'success',
          code: 0,
          data: null,
          error: false,
        });
      };
      request.onerror = () => {
        reject({
          status: 'error',
          data: request.error,
          code: 1,
          message: 'delete database error',
          error: true,
        });
      };
    });
  };
  getObjectStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore | undefined {
    if (!this.database) {
      console.error('Database is not open');
      return undefined;
    }
    const transaction = this.database.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }
  createObjectStore = ({ storeName, options }: { storeName: string; options: IDBObjectStoreParameters }): void => {
    if (this.database?.objectStoreNames.contains(storeName)) return;
    this.database?.createObjectStore(storeName, options);
  };
  refreshDatabase = (): Promise<IDBResult<{ db: IDBDatabase }>> => {
    this.closeDataBase();
    return this.openDataBase();
  };
  createObjectStoreIndex = ({
    storeName,
    indexName,
    keyPath,
    options,
  }: {
    storeName: string;
    indexName: string;
    keyPath: string | string[];
    options?: IDBIndexParameters;
  }): void => {
    const store = this.getObjectStore(storeName);
    if (store) {
      store.createIndex(indexName, keyPath, options);
    }
  };
  add = <T = unknown>({ storeName, data }: { storeName: string; data: T }): Promise<IDBResult<T>> => {
    return new Promise<IDBResult<T>>((resolve, reject) => {
      const transaction = this.database?.transaction(storeName, 'readwrite');
      const store = transaction?.objectStore(storeName);
      const request = store?.add(data);
      if (request) {
        request.onsuccess = () => {
          resolve({
            status: 'success',
            code: 0,
            data,
            error: false,
          });
        };
        request.onerror = () => {
          reject({
            status: 'error',
            data: request.error,
            code: 1,
            message: 'add error',
            error: true,
          });
        };
      } else {
        reject({
          status: 'error',
          data: null,
          code: 1,
          message: 'add error',
          error: true,
        });
      }
    });
  };
  update = <T = unknown>({ storeName, data }: { storeName: string; data: T }): Promise<IDBResult> => {
    return new Promise<IDBResult>((resolve, reject) => {
      const transaction = this.database?.transaction(storeName, 'readwrite');
      const store = transaction?.objectStore(storeName);
      const request = store?.put(data);
      if (request) {
        request.onsuccess = () => {
          resolve({
            status: 'success',
            code: 0,
            data: null,
            error: false,
          });
        };
        request.onerror = () => {
          reject({
            status: 'error',
            data: request.error,
            code: 1,
            message: 'update error',
            error: true,
          });
        };
      } else {
        reject({
          status: 'error',
          data: null,
          code: 1,
          message: 'update error',
          error: true,
        });
      }
    });
  };
  readByKey = <T = unknown>({ storeName, key }: { storeName: string; key: IDBValidKey }): Promise<IDBResult<T>> => {
    return new Promise<IDBResult<T>>((resolve, reject) => {
      const transaction = this.database?.transaction(storeName, 'readonly');
      const store = transaction?.objectStore(storeName);
      const request = store?.get(key);
      if (request) {
        request.onsuccess = () => {
          resolve({
            status: 'success',
            code: 0,
            data: request.result,
            error: false,
          });
        };
        request.onerror = () => {
          reject({
            status: 'error',
            data: request.error,
            code: 1,
            message: 'read error',
            error: true,
          });
        };
      } else {
        reject({
          status: 'error',
          data: null,
          code: 1,
          message: 'read error',
          error: true,
        });
      }
    });
  };
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
      const transaction = this.database?.transaction(storeName, 'readonly');
      const store = transaction?.objectStore(storeName);
      const request = store?.openCursor(keyRange, direction);
      const result: T[] = [];
      if (request) {
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            result.push(cursor.value);
            cursor.continue();
          } else {
            resolve({
              status: 'success',
              code: 0,
              data: result,
              error: false,
            });
          }
        };
        request.onerror = () => {
          reject({
            status: 'error',
            data: request.error,
            code: 1,
            message: 'read cursor error',
            error: true,
          });
        };
      } else {
        reject({
          status: 'error',
          data: null,
          code: 1,
          message: 'read cursor error',
          error: true,
        });
      }
    });
  };
  delete = ({ storeName, key }: { storeName: string; key: IDBValidKey }): Promise<IDBResult> => {
    return new Promise<IDBResult>((resolve, reject) => {
      const transaction = this.database?.transaction(storeName, 'readwrite');
      const store = transaction?.objectStore(storeName);
      const request = store?.delete(key);
      if (request) {
        request.onsuccess = () => {
          resolve({
            status: 'success',
            code: 0,
            data: null,
            error: false,
          });
        };
        request.onerror = () => {
          reject({
            status: 'error',
            data: request.error,
            code: 1,
            message: 'delete error',
            error: true,
          });
        };
      } else {
        reject({
          status: 'error',
          data: null,
          code: 1,
          message: 'delete error',
          error: true,
        });
      }
    });
  };
}
