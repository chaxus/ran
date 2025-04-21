import { getMatchingSentences } from 'ranuts/utils';
import { arrayBufferToString } from '@/lib/transformText';

// 定义操作策略接口
interface DBStrategy {
  execute(store: IDBObjectStore, data: any): void;
}

// 定义操作类型
type OperationType = 'search' | 'add' | 'getAll' | 'get';

// 搜索策略
class SearchStrategy implements DBStrategy {
  execute(store: IDBObjectStore, data: { keyword: string; searchType: 'title' | 'author' | 'content' }): void {
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
      });
    };
  }
}

// 添加策略
class AddStrategy implements DBStrategy {
  execute(store: IDBObjectStore, data: { bookInfo: any }): void {
    const { bookInfo } = data;
    const request = store.add(bookInfo);

    request.onsuccess = () => {
      self.postMessage({
        status: 'success',
        code: 0,
        data: bookInfo,
        error: false,
      });
    };
  }
}

// 获取所有策略
class GetAllStrategy implements DBStrategy {
  execute(store: IDBObjectStore): void {
    const request = store.getAll();
    request.onsuccess = () => {
      self.postMessage({
        status: 'success',
        code: 0,
        data: request.result,
        error: false,
      });
    };
  }
}

// 获取单个策略
class GetStrategy implements DBStrategy {
  execute(store: IDBObjectStore, data: { key: string }): void {
    const { key } = data;
    const request = store.get(key);
    request.onsuccess = () => {
      self.postMessage({
        status: 'success',
        code: 0,
        data: request.result,
        error: false,
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

// 监听主线程的消息
self.onmessage = async (e) => {
  const { type, data, dbName, storeName } = e.data as {
    type: OperationType;
    data: any;
    dbName: string;
    storeName: string;
  };

  try {
    // 打开数据库
    const request = indexedDB.open(dbName);

    request.onerror = () => {
      self.postMessage({
        status: 'error',
        code: 1,
        data: null,
        error: true,
        message: 'Database not initialized',
      });
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, type === 'add' ? 'readwrite' : 'readonly');
      const store = transaction.objectStore(storeName);

      // 发送进行中状态
      // self.postMessage({
      //     status: 'pending',
      //     code: 0,
      //     data: null,
      //     error: false,
      //     progress: 0
      // });
      // 获取对应的策略并执行
      const strategy = strategyFactory[type];
      if (strategy) {
        strategy.execute(store, data);
      } else {
        self.postMessage({
          status: 'error',
          code: 1,
          data: null,
          error: true,
          message: 'Unknown operation type',
        });
      }

      request.onerror = () => {
        self.postMessage({
          status: 'error',
          code: 1,
          data: null,
          error: true,
          message: 'Operation failed',
        });
      };
    };
  } catch (error) {
    self.postMessage({
      status: 'error',
      code: 1,
      data: null,
      error: true,
      message: error.message,
    });
  }
};
