import { useCallback, useEffect, useRef, useState } from 'react';
import type { BookInfo } from '@/store/books';
import type { TextSyntaxTree } from '@/lib/transformText';
import { EVENT_NAME, synchook } from '@/lib/subscribe';

export enum SORT_DIRECTION {
  UP = 'UP',
  DOWN = 'DOWN',
}

const SORT_ICON_STYLE = {
  '--ran-icon-font-size': '20px',
};

export interface CatalogueProps {
  bookDetail?: BookInfo;
  textSyntaxTree: TextSyntaxTree;
  setPageNum?: (page: number) => void;
}

export const Catalogue = ({ bookDetail, textSyntaxTree }: CatalogueProps): React.JSX.Element => {
  const { title, author, image } = bookDetail || {};
  const { titleIdTitle = [], titleIdPage } = textSyntaxTree || {};
  const sortRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sortDirection, setSortDirection] = useState(SORT_DIRECTION.DOWN);

  const toPage = (e: Event) => {
    const index = (e.target as HTMLElement)?.getAttribute('title') || '';
    if (index === undefined) return;
    const page = titleIdPage[index];
    if (page !== undefined) {
      // Fallback for browsers that don't support View Transitions API
      if (!document.startViewTransition) {
        synchook.call(EVENT_NAME.SET_CURRENT_BOOK_PAGE, page);
        return;
      }
      // With View Transition
      document.startViewTransition(() => {
        synchook.call(EVENT_NAME.SET_CURRENT_BOOK_PAGE, page);
      });
    }
    synchook.call(EVENT_NAME.CLOSE_POPOVER);
  };

  const toSort = useCallback(() => {
    setSortDirection(SORT_DIRECTION.UP);
    if (sortDirection === SORT_DIRECTION.DOWN) {
      const bottom = scrollRef.current?.scrollHeight;
      scrollRef.current?.scrollTo({ top: bottom, behavior: 'smooth' });
      setSortDirection(SORT_DIRECTION.UP);
    }
    if (sortDirection === SORT_DIRECTION.UP) {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      setSortDirection(SORT_DIRECTION.DOWN);
    }
  }, [sortDirection]);

  useEffect(() => {
    scrollRef.current?.addEventListener('click', toPage);
    sortRef.current?.addEventListener('click', toSort);
    return () => {
      scrollRef.current?.removeEventListener('click', toPage);
      sortRef.current?.removeEventListener('click', toSort);
    };
  }, [textSyntaxTree, bookDetail, sortDirection]);

  return (
    <>
      <div className="px-7 py-2 flex flex-row flex-nowrap items-center shrink-0">
        <img className="w-14 mr-5" src={image} />
        <div>
          <div className="text-lg text-text-color-1 font-medium break-all">{title}</div>
          <div className="text-sm text-text-color-2 font-medium mt-1 break-all">{author}</div>
        </div>
      </div>
      <div className="mx-9 basis-10 flex items-center justify-end shrink-0" ref={sortRef}>
        <r-icon
          className={`cursor-pointer hover-icon rotate-180 ${sortDirection}`}
          name="sort"
          style={SORT_ICON_STYLE}
        ></r-icon>
      </div>
      <div className="overflow-y-auto flex-auto" ref={scrollRef}>
        {titleIdTitle?.map((item, index) => {
          return (
            <div
              className="px-7 h-12 text-text-color-2 font-normal text-base hover:bg-blue-50 cursor-pointer"
              title={`${index}`}
              key={index}
            >
              <div className="border-t border-front-bg-color-1 h-full w-full flex items-center" title={`${index}`}>
                {item}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
