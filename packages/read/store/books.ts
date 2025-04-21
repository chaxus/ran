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
  createTime?: number;
  modifyTime?: number;
}

export interface SearchResult extends BookInfo {
  matchedText: string;
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
}): Promise<IDBResult<BookInfo>> => {
  const { title = '', author = '', image = '', content, encoding = '' } = data;
  const hash = CryptoJS.MD5(typeof content === 'string' ? content : CryptoJS.lib.WordArray.create(content)).toString();
  const createTime = Date.now();
  const bookInfo: BookInfo = {
    id: `${hash}`,
    title,
    author,
    image,
    content,
    encoding,
    createTime,
    modifyTime: Date.now(),
  };

  return performWorkerOperation<BookInfo>('add', { bookInfo });
};

// 创建 worker
const createDBWorker = () => {
  const worker = new Worker(new URL('../workers/dbWorker.ts', import.meta.url), {
    type: 'module',
  });
  return worker;
};

// 通用的 worker 操作函数
const performWorkerOperation = <T = unknown>(type: string, data: any = {}): Promise<IDBResult<T>> => {
  return new Promise((resolve) => {
    if (!db.database) {
      resolve({
        status: 'error',
        code: 1,
        data: undefined as T,
        error: true,
        message: 'Database not initialized',
      });
      return;
    }

    const worker = createDBWorker();
    worker.onmessage = (e) => {
      resolve(e.data);
      worker.terminate();
    };

    worker.onerror = (error) => {
      resolve({
        status: 'error',
        code: 1,
        data: undefined as T,
        error: true,
        message: error.message,
      });
      worker.terminate();
    };

    worker.postMessage({
      type,
      data,
      dbName: db.database.name,
      storeName: STORE_NAME_BOOKS_INFO_KEY,
    });
  });
};

// 搜索函数
export const searchBooksByTitle = <T = unknown>(keyword: string): Promise<IDBResult<T[]>> => {
  return performWorkerOperation<T[]>('search', { keyword, searchType: 'title' });
};

export const searchBooksByAuthor = <T = unknown>(keyword: string): Promise<IDBResult<T[]>> => {
  return performWorkerOperation<T[]>('search', { keyword, searchType: 'author' });
};

export const searchBooksByContent = <T = unknown>(keyword: string): Promise<IDBResult<T[]>> => {
  return performWorkerOperation<T[]>('search', { keyword, searchType: 'content' });
};

// 获取所有书籍
export const getAllBooks = <T = unknown>(): Promise<IDBResult<T[]>> => {
  return performWorkerOperation<T[]>('getAll');
};

// 获取单个书籍
export const getBookById = <T = unknown>(id: string): Promise<IDBResult<T>> => {
  return performWorkerOperation<T>('get', { key: id });
};
