import CryptoJS from 'crypto-js';
import { db } from '@/store/index';
import type { IDBResult } from '@/lib/indexedDB';

export interface BookInfo {
  id: string;
  title: string;
  author: string;
  image: string;
  content: ArrayBuffer | Uint8Array<ArrayBuffer>;
  encoding: string;
  createTime: number;
  modifyTime: number;
}

const STORE_NAME_BOOKS_INFO_KEY = 'books_info';

const ID = 'id';

export const createBookStore = (): void => {
  db.createObjectStore({ storeName: STORE_NAME_BOOKS_INFO_KEY, options: { keyPath: ID } });
};

export const addBook = (data: {
  title: string;
  author?: string;
  image?: string;
  content: ArrayBuffer | Uint8Array<ArrayBuffer>;
  encoding: string;
}): Promise<IDBResult> => {
  const { title = '', author = '', image = '', content, encoding = '' } = data;
  const hash = CryptoJS.MD5(typeof content === 'string' ? content : CryptoJS.lib.WordArray.create(content)).toString();
  const createTime = Date.now();
  const bookInfo: BookInfo = {
    id: `${hash}.${createTime}`,
    title,
    author,
    image,
    content,
    encoding,
    createTime,
    modifyTime: Date.now(),
  };
  return db.add<BookInfo>({ storeName: STORE_NAME_BOOKS_INFO_KEY, data: bookInfo });
};

export const getAllBooks = <T = unknown>(): Promise<IDBResult<T[]>> => {
  // 创建一个读写事务
  return db.readByCursor<T>({ storeName: STORE_NAME_BOOKS_INFO_KEY });
};

export const getBookById = <T = unknown>(id: string): Promise<IDBResult<T>> => {
  return db.readByKey<T>({ storeName: STORE_NAME_BOOKS_INFO_KEY, key: id });
};
// 搜索书籍标题
export const searchBooksByTitle = <T = unknown>(keyword: string): Promise<IDBResult<T[]>> => {
  return new Promise((resolve) => {
    if (!db.database) {
      resolve({
        status: 'error',
        code: 1,
        data: [] as T[],
        error: true,
        message: 'Database not initialized',
      });
      return;
    }

    const request = db.database
      .transaction(STORE_NAME_BOOKS_INFO_KEY, 'readonly')
      .objectStore(STORE_NAME_BOOKS_INFO_KEY)
      .openCursor();

    const results: T[] = [];

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        const book = cursor.value as BookInfo;
        const searchText = keyword.toLowerCase();

        // 检查标题或作者是否包含搜索关键词
        if (book.title.toLowerCase().includes(searchText)) {
          results.push(book as T);
        }
        cursor.continue();
      } else {
        resolve({
          status: 'success',
          code: 0,
          data: results,
          error: false,
        });
      }
    };

    request.onerror = () => {
      resolve({
        status: 'error',
        code: 1,
        data: [] as T[],
        error: true,
        message: 'Search failed',
      });
    };
  });
};
// 搜索书籍作者
export const searchBooksByAuthor = <T = unknown>(keyword: string): Promise<IDBResult<T[]>> => {
  return new Promise((resolve) => {
    if (!db.database) {
      resolve({
        status: 'error',
        code: 1,
        data: [] as T[],
        error: true,
        message: 'Database not initialized',
      });
      return;
    }

    const request = db.database
      .transaction(STORE_NAME_BOOKS_INFO_KEY, 'readonly')
      .objectStore(STORE_NAME_BOOKS_INFO_KEY)
      .openCursor();

    const results: T[] = [];

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        const book = cursor.value as BookInfo;
        const searchText = keyword.toLowerCase();

        // 检查标题或作者是否包含搜索关键词
        if (book.author.toLowerCase().includes(searchText)) {
          results.push(book as T);
        }
        cursor.continue();
      } else {
        resolve({
          status: 'success',
          code: 0,
          data: results,
          error: false,
        });
      }
    };

    request.onerror = () => {
      resolve({
        status: 'error',
        code: 1,
        data: [] as T[],
        error: true,
        message: 'Search failed',
      });
    };
  });
};
