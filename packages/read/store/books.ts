
import CryptoJS from 'crypto-js';
import { db } from '@/store/index'
import type { IDBResult } from '@/lib/indexedDB'

export const createBookStore = (): void => {
  db.createObjectStore({ storeName: 'books', options: { keyPath: 'id' } })
}

interface BookInfo {
  id: string
  title: string
  author: string
  image: string
  content: string
  encoding: string
  createTime: number
  modifyTime: number
}

export const addBook = (data:{
  title: string,
  author?: string,
  image?: string,
  content: string,
  encoding: string
}): Promise<IDBResult> => {
  const { title = '', author = '', image = '', content = '', encoding = '' } = data;
  const hash = CryptoJS.MD5(content).toString();
  const bookInfo: BookInfo = {
    id: hash,
    title,
    author,
    image,
    content,
    encoding,
    createTime: Date.now(),
    modifyTime: Date.now()
  }
  return db.add<BookInfo>({ storeName: 'books', data: bookInfo })
}
