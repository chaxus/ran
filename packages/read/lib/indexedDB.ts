// 数据库：IDBDatabase 对象，数据库有版本概念，同一时刻只能有一个版本，每个域名可以建多个数据库
// 对象仓库：IDBObjectStore 对象，类似于关系型数据库的表格
// 索引：IDBIndex 对象，可以在对象仓库中，为不同的属性建立索引，主键建立默认索引
// 事务：IDBTransaction 对象，增删改查都需要通过事务来完成，事务对象提供了 error,abord,complete 三个回调方法，监听操作结果
// 操作请求：IDBRequest 对象
// 指针：IDBCursor 对象
// 主键集合：IDBKeyRange 对象，主键是默认建立索引的属性，可以取当前层级的某个属性，也可以指定下一层对象的属性，还可以是一个递增的整数

export interface IDBResult<T = unknown> {
  status: 'success' | 'error',
  data: T,
  code: number
  error: boolean,
  message?: string
}

export class WebDB {
  db?: IDBDatabase;
  storeMap: Map<string, IDBObjectStore>;
  constructor() {
    this.storeMap = new Map<string, IDBObjectStore>();
  }
  openDataBase = ({ dbName, version }: {
    dbName: string,
    version?: number
  }): Promise<IDBResult<{ db: IDBDatabase }>> => {
    return new Promise<IDBResult<{ db: IDBDatabase }>>((resolve, reject) => {
      const request = indexedDB.open(dbName, version);
      request.onsuccess = () => {
        this.db = request.result;
        resolve({
          status: 'success',
          data: {
            db: this.db
          },
          code: 0,
          error: false
        });
      };
      request.onerror = () => {
        reject({
          status: 'error',
          data: request.error,
          code: 1,
          message: 'open database error',
          error: true
        });
      };
      request.onupgradeneeded = () => {
        this.db = request.result;
        resolve({
          status: 'success',
          data: {
            db: this.db
          },
          code: 0,
          error: false
        });
      };
    });
  }
  closeDataBase = (): void => {
    this.db?.close();
  }
  deleteDatabase = ({ dbName }: { dbName: string }): Promise<IDBResult> => {
    return new Promise<IDBResult>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName);
      request.onsuccess = () => {
        resolve({
          status: 'success',
          code: 0,
          data: null,
          error: false
        });
      };
      request.onerror = () => {
        reject({
          status: 'error',
          data: request.error,
          code: 1,
          message: 'delete database error',
          error: true
        });
      };
    });
  }
  createObjectStore = ({ storeName, options }: {
    storeName: string,
    options: IDBObjectStoreParameters
  }): IDBObjectStore | undefined => {
    const store = this.db?.createObjectStore(storeName, options);
    if (!this.storeMap.has(storeName) && store) {
      this.storeMap.set(storeName, store);
    }
    return store;
  }
  createObjectStoreIndex = ({ storeName, indexName, keyPath, options }: {
    storeName: string,
    indexName: string,
    keyPath: string | string[],
    options?: IDBIndexParameters
  }): void => {
    const store = this.storeMap.get(storeName);
    if (store) {
      store.createIndex(indexName, keyPath, options)
    }
  }
  add = <T = unknown>({ storeName, data }: {
    storeName: string,
    data: T
  }): Promise<IDBResult> => {
    return new Promise<IDBResult>((resolve, reject) => {
      const transaction = this.db?.transaction(storeName, 'readwrite');
      const store = transaction?.objectStore(storeName);
      const request = store?.add(data);
      if (request) {
        request.onsuccess = () => {
          resolve({
            status: 'success',
            code: 0,
            data: null,
            error: false
          });
        };
        request.onerror = () => {
          reject({
            status: 'error',
            data: request.error,
            code: 1,
            message: 'add error',
            error: true
          });
        };
      } else {
        reject({
          status: 'error',
          data: null,
          code: 1,
          message: 'add error',
          error: true
        })
      }
    });
  }
  update = <T = unknown>({ storeName, data }: {
    storeName: string,
    data: T
  }): Promise<IDBResult> => {
    return new Promise<IDBResult>((resolve, reject) => {
      const transaction = this.db?.transaction(storeName, 'readwrite');
      const store = transaction?.objectStore(storeName);
      const request = store?.put(data);
      if (request) {
        request.onsuccess = () => {
          resolve({
            status: 'success',
            code: 0,
            data: null,
            error: false
          });
        };
        request.onerror = () => {
          reject({
            status: 'error',
            data: request.error,
            code: 1,
            message: 'update error',
            error: true
          });
        };
      } else {
        reject({
          status: 'error',
          data: null,
          code: 1,
          message: 'update error',
          error: true
        })
      }
    });
  }
  readByKey = ({ storeName, key }: {
    storeName: string,
    key: IDBValidKey
  }): Promise<IDBResult> => {
    return new Promise<IDBResult>((resolve, reject) => {
      const transaction = this.db?.transaction(storeName, 'readonly');
      const store = transaction?.objectStore(storeName);
      const request = store?.get(key);
      if (request) {
        request.onsuccess = () => {
          resolve({
            status: 'success',
            code: 0,
            data: request.result,
            error: false
          });
        };
        request.onerror = () => {
          reject({
            status: 'error',
            data: request.error,
            code: 1,
            message: 'read error',
            error: true
          });
        };
      } else {
        reject({
          status: 'error',
          data: null,
          code: 1,
          message: 'read error',
          error: true
        })
      }
    });
  }
  readByCursor = ({ storeName, keyRange, direction }: {
    storeName: string,
    keyRange?: IDBKeyRange,
    direction?: IDBCursorDirection
  }): Promise<IDBResult> => {
    return new Promise<IDBResult>((resolve, reject) => {
      const transaction = this.db?.transaction(storeName, 'readonly');
      const store = transaction?.objectStore(storeName);
      const request = store?.openCursor(keyRange, direction);
      if (request) {
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            console.log(cursor.value);
            cursor.continue();
          } else {
            resolve({
              status: 'success',
              code: 0,
              data: null,
              error: false
            });
          }
        };
        request.onerror = () => {
          reject({
            status: 'error',
            data: request.error,
            code: 1,
            message: 'read cursor error',
            error: true
          });
        };
      } else {
        reject({
          status: 'error',
          data: null,
          code: 1,
          message: 'read cursor error',
          error: true
        })
      }
    });
  }
  delete = ({ storeName, key }: {
    storeName: string,
    key: IDBValidKey
  }): Promise<IDBResult> => {
    return new Promise<IDBResult>((resolve, reject) => {
      const transaction = this.db?.transaction(storeName, 'readwrite');
      const store = transaction?.objectStore(storeName);
      const request = store?.delete(key);
      if (request) {
        request.onsuccess = () => {
          resolve({
            status: 'success',
            code: 0,
            data: null,
            error: false
          });
        };
        request.onerror = () => {
          reject({
            status: 'error',
            data: request.error,
            code: 1,
            message: 'delete error',
            error: true
          });
        };
      }else{
        reject({
          status: 'error',
          data: null,
          code: 1,
          message: 'delete error',
          error: true
        })
      }
    });
  }
}
