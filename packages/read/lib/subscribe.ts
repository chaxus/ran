import { createSignal, subscribers } from 'ranuts/utils';
import type { BookInfo } from '@/store/books';
import type { TextSyntaxTree } from '@/lib/transformText';

export enum EVENT_NAME {
  CLOSE_POPOVER = 'close-popover',
  SET_CURRENT_BOOK_PAGE = 'set-current-book-page',
  SET_CURRENT_BOOK_DETAIL = 'set-current-book-detail',
  SET_TEXT_SYNTAX_TREE = 'set-text-syntax-tree',
}

export const syncHook = subscribers;

export const [getCurrentBookDetail, setCurrentBookDetail] = createSignal<BookInfo>(
  {},
  { subscriber: EVENT_NAME.SET_CURRENT_BOOK_DETAIL },
);

export const [getTextSyntaxTree, setTextSyntaxTree] = createSignal<TextSyntaxTree>(
  {
    sequences: [],
    totalPage: 0,
    pageText: [],
    pageTitleId: [],
    titleIdTitle: [],
    titleIdPage: {},
  },
  { subscriber: EVENT_NAME.SET_TEXT_SYNTAX_TREE },
);

export const [getPageNum, setPageNum] = createSignal<number>(0, { subscriber: EVENT_NAME.SET_CURRENT_BOOK_PAGE });
