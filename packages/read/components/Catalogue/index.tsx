import { useCallback, useEffect, useRef, useState } from 'react';
import type { BookInfo } from '@/store/books';
import type { TextSyntaxTree } from '@/lib/transformText';
import { EVENT_NAME, getCurrentBookDetail, getTextSyntaxTree, setPageNum, syncHook } from '@/lib/subscribe';
import { SORT_DIRECTION } from '@/lib/enums';

const SORT_ICON_STYLE = {
  '--ran-icon-font-size': '20px',
};

const toPage = (e: Event) => {
  const index = (e.target as HTMLElement)?.getAttribute('title') || '';
  if (index === undefined) return;
  const textSyntaxTree: TextSyntaxTree = getTextSyntaxTree();
  const page = textSyntaxTree?.titleIdPage[index];
  if (page !== undefined) {
    // Fallback for browsers that don't support View Transitions API
    if (!document.startViewTransition) {
      setPageNum(page);
      return;
    }
    // With View Transition
    document.startViewTransition(() => {
      setPageNum(page);
    });
  }
  syncHook.call(EVENT_NAME.CLOSE_POPOVER);
};

export const Catalogue = (): React.JSX.Element => {
  const sortRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sortDirection, setSortDirection] = useState(SORT_DIRECTION.DOWN);
  const bookDetail: BookInfo = getCurrentBookDetail();
  const textSyntaxTree: TextSyntaxTree = getTextSyntaxTree();

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
  }, [sortDirection]);

  return (
    <>
      <div className="px-7 py-2 flex flex-row flex-nowrap items-center shrink-0">
        {bookDetail.image && <img className="w-14 mr-5" src={bookDetail.image} />}
        <div>
          <div className="text-lg text-text-color-1 font-medium break-all">{bookDetail.title}</div>
          <div className="text-sm text-text-color-2 font-medium mt-1 break-all">{bookDetail.author}</div>
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
        {textSyntaxTree?.titleIdTitle?.map((item: string, index: number) => {
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
