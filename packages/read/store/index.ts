import { WebDB } from '@/lib/indexedDB';
import { createBookStore } from '@/store/books';

export const db = new WebDB({ dbName: 'read' });

export const initDB = (): void => {
  db.openDataBase().then(() => {
    createBookStore()
  })
}
export const closeDB = (): void => {
  db.closeDataBase();
}

export const resumeDB = (): void => {
  db.refreshDatabase().then(() => {
    createBookStore()
  })
}
