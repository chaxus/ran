
import CryptoJS from 'crypto-js';
import { db } from '@/store/index'
import type { IDBResult } from '@/lib/indexedDB'

const STORE_NAME_BOOKS_KEY = 'books'

export const createBookStore = (): void => {
  db.createObjectStore({ storeName: STORE_NAME_BOOKS_KEY, options: { keyPath: 'id' } })
}

export interface BookInfo {
  id: string
  title: string
  author: string
  image: string
  content: ArrayBuffer | Uint8Array<ArrayBuffer>
  encoding: string
  createTime: number
  modifyTime: number
}

export const addBook = (data: {
  title: string,
  author?: string,
  image?: string,
  content: ArrayBuffer | Uint8Array<ArrayBuffer>,
  encoding: string
}): Promise<IDBResult> => {
  const { title = '', author = '', image = '', content, encoding = '' } = data;
  const hash = CryptoJS.MD5(typeof content === 'string' ? content : CryptoJS.lib.WordArray.create(content)).toString();
  const createTime = Date.now();
  const bookInfo: BookInfo = {
    id: `${hash}_${createTime}`,
    title,
    author,
    image,
    content,
    encoding,
    createTime,
    modifyTime: Date.now()
  }
  return db.add<BookInfo>({ storeName: STORE_NAME_BOOKS_KEY, data: bookInfo })
}

export const getAllBooks = <T = unknown>(): Promise<IDBResult<T[]>> => {
  // 创建一个读写事务
  return db.readByCursor<T>({ storeName: STORE_NAME_BOOKS_KEY })
}

export const getBookById = <T = unknown>(id: string): Promise<IDBResult<T>> => {
  return db.readByKey<T>({ storeName: STORE_NAME_BOOKS_KEY, key: id })
}
