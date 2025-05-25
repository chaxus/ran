import { getMatchingSentences } from 'ranuts/utils';
import { arrayBufferToString } from '@/lib/transformText';

interface ExecuteOptions<T = unknown> {
  store: IDBObjectStore;
  data: T;
  operationId: string;
}
// 定义操作策略接口
interface DBStrategy {
  execute(options: ExecuteOptions): void;
}

// 定义操作类型
type OperationType = 'search' | 'add' | 'getAll' | 'get';

// 搜索策略
class SearchStrategy implements DBStrategy {
  execute({
    store,
    data,
    operationId,
  }: ExecuteOptions<{ keyword: string; searchType: 'title' | 'author' | 'content' }>): void {
    const { keyword, searchType } = data;
    const request = store.openCursor();
    const results: any[] = [];
    const searchText = keyword.toLowerCase();

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        const book = cursor.value;
        try {
          if (searchType === 'title' && book.title.toLowerCase().includes(searchText)) {
            results.push(book);
          } else if (searchType === 'author' && book.author.toLowerCase().includes(searchText)) {
            results.push(book);
          } else if (searchType === 'content') {
            const contentText = arrayBufferToString(book.content)
              .replace(/<caption-title>/g, '')
              .replace(/<\/caption-title>/g, '')
              .toLowerCase();
            if (contentText.includes(searchText)) {
              const matchedSentences = getMatchingSentences(contentText, searchText);
              results.push({
                ...book,
                matchedText: matchedSentences,
              });
            }
          }

          // totalProcessed++;
          // 报告进度
          // self.postMessage({
          //     status: 'pending',
          //     code: 0,
          //     data: null,
          //     error: false,
          //     progress: (totalProcessed / 100) * 100
          // });

          cursor.continue();
        } catch (error) {
          console.error('Error processing book:', error);
          cursor.continue();
        }
      } else {
        // 搜索完成，发送结果
        self.postMessage({
          status: 'success',
          code: 0,
          data: results,
          error: false,
          operationId,
        });
      }
    };

    request.onerror = () => {
      self.postMessage({
        status: 'error',
        code: 1,
        data: [],
        error: true,
        message: 'Search failed',
        operationId,
      });
    };
  }
}

// 添加策略
class AddStrategy implements DBStrategy {
  execute({ store, data, operationId }: ExecuteOptions<{ bookInfo: any }>): void {
    const { bookInfo } = data;
    const request = store.add(bookInfo);
    const onsuccess = () => {
      self.postMessage({
        status: 'success',
        code: 0,
        data: bookInfo,
        error: false,
        operationId,
      });
    };
    const onerror = () => {
      self.postMessage({
        status: 'error',
        code: 1,
        data: null,
        error: true,
        operationId,
      });
    };
    request.addEventListener('success', onsuccess);
    request.addEventListener('error', onerror);
  }
}

// 获取所有策略
class GetAllStrategy implements DBStrategy {
  execute({ store, operationId }: ExecuteOptions): void {
    const request = store.getAll();
    request.onsuccess = () => {
      self.postMessage({
        status: 'success',
        code: 0,
        data: request.result,
        error: false,
        operationId,
      });
    };
  }
}

// 获取单个策略
class GetStrategy implements DBStrategy {
  execute({ store, data, operationId }: ExecuteOptions<{ key: string }>): void {
    const { key } = data;
    const request = store.get(key);
    request.onsuccess = () => {
      self.postMessage({
        status: 'success',
        code: 0,
        data: request.result,
        error: false,
        operationId,
      });
    };
    request.onerror = () => {
      self.postMessage({
        status: 'error',
        code: 1,
        data: null,
        error: true,
        operationId,
      });
    };
  }
}

// 策略工厂
const strategyFactory: Record<OperationType, DBStrategy> = {
  search: new SearchStrategy(),
  add: new AddStrategy(),
  getAll: new GetAllStrategy(),
  get: new GetStrategy(),
};

// 数据库连接管理
let db: IDBDatabase | null = null;
let dbPromise: Promise<IDBDatabase> | null = null;

const getDatabase = (dbName: string): Promise<IDBDatabase> => {
  if (db) {
    return Promise.resolve(db);
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);

    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      dbPromise = null;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = (event.target as IDBOpenDBRequest).transaction;
      if (transaction) {
        transaction.oncomplete = () => {
          resolve(db);
        };
      } else {
        resolve(db);
      }
    };
  });

  return dbPromise;
};

// 监听主线程的消息
self.onmessage = async (e) => {
  const { type, data, dbName, storeName, operationId } = e.data as {
    type: OperationType;
    data: any;
    dbName: string;
    storeName: string;
    operationId: string;
  };

  try {
    const database = await getDatabase(dbName);
    const transaction = database.transaction(storeName, type === 'add' ? 'readwrite' : 'readonly');
    const store = transaction.objectStore(storeName);

    // 获取对应的策略并执行
    const strategy = strategyFactory[type];
    if (strategy) {
      strategy.execute({ store, data, operationId });
    } else {
      self.postMessage({
        status: 'error',
        code: 1,
        data: null,
        error: true,
        message: 'Unknown operation type',
        operationId,
      });
    }
  } catch (error) {
    self.postMessage({
      status: 'error',
      code: 1,
      data: null,
      error: true,
      message: error.message,
      operationId,
    });
  }
};
