import { createSignal, subscribers } from 'ranuts/utils';
import type { BookInfo } from '@/store/books';

export enum EVENT_NAME {
  CLOSE_POPOVER = 'close-popover',
  SET_CURRENT_BOOK_PAGE = 'set-current-book-page',
  SET_CURRENT_BOOK_DETAIL = 'set-current-book-detail',
}

export const syncHook = subscribers

export const [getCurrentBookDetail, setCurrentBookDetail] = createSignal<BookInfo>({ subscriber: EVENT_NAME.SET_CURRENT_BOOK_DETAIL });