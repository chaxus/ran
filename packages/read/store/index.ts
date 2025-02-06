import { WebDB } from '@/lib/indexedDB';
import { createBookStore } from '@/store/books';

export const db = new WebDB();

export const initDB = (): void => {
  const params = {
    dbName: 'read',
  }
  db.openDataBase(params).then(() => {
    createBookStore()
  })
}
export const closeDB = (): void => {
  db.closeDataBase();
}
