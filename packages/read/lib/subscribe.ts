import { SyncHook } from 'ranuts/utils';

export const synchook = new SyncHook();

export enum EVENT_NAME {
  CLOSE_POPOVER = 'close-popover',
  SET_CURRENT_BOOK_PAGE = 'set-current-book-page',
  SET_CURRENT_BOOK_DETAIL = 'set-current-book-detail',
}
