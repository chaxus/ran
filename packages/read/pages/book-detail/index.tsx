// import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { debounce, getQuery } from 'ranuts/utils';
import { getBookById } from '@/store/books';
import { transformTextToExpectedFormat } from '@/lib/transformText';
import type { BookInfo } from '@/store/books';
import type { TextSyntaxTree } from '@/lib/transformText';
import { ROUTE_PATH } from '@/router';
import { BookDetailOperate } from '@/components/DetailOperate';
import {
  EVENT_NAME,
  getCurrentBookDetail,
  getPageNum,
  getTextSyntaxTree,
  setCurrentBookDetail,
  setPageNum,
  setTextSyntaxTree,
  syncHook,
} from '@/lib/subscribe';
import { resumeDB } from '@/store';
import 'ranui/icon';
import 'ranui/input';
import './index.scss';

const ICON_STYLE = {
  '--ran-icon-font-size': '14px',
  '--ran-icon-color': 'var(--icon-color-1)',
};

const pre = () => {
  const pageNum: number = getPageNum();
  if (pageNum === 0) return;
  // 开始视图变换
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      setPageNum(Math.max(pageNum - 2, 0));
    });
  } else {
    setPageNum(Math.max(pageNum - 2, 0));
  }
};

const next = () => {
  const pageNum: number = getPageNum();
  const textSyntaxTree: TextSyntaxTree = getTextSyntaxTree();
  const size: number = textSyntaxTree?.totalPage;
  // 开始视图变换
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      setPageNum(Math.min(pageNum + 2, size));
    });
  } else {
    setPageNum(Math.min(pageNum + 2, size));
  }
};

export const BookDetail = (): React.JSX.Element => {
  const showContainerRef = useRef<HTMLDivElement>(null);
  const { id } = getQuery();
  const ref = useRef<HTMLDivElement>(null);
  const [_, update] = useState(0);
  const bookDetail: BookInfo = getCurrentBookDetail();
  const textSyntaxTree: TextSyntaxTree = getTextSyntaxTree();
  const pageNum: number = getPageNum();

  const updateUI = () => {
    debounce(() => {
      update((prev) => prev + 1);
    }, 16)();
  };

  const getTitle = () => {
    const textSyntaxTree: TextSyntaxTree = getTextSyntaxTree();
    const pageNum: number = getPageNum();
    const titleId = textSyntaxTree.pageTitleId[pageNum];
    return textSyntaxTree.titleIdTitle[titleId];
  };

  const toHome = () => {
    if (!id) return;
    if (document.startViewTransition) {
      ref.current?.style.setProperty('view-transition-name', `book-info-${id}`);
      document.startViewTransition(() => {
        ref.current?.style.setProperty('view-transition-name', '');
        window.location.href = ROUTE_PATH.HOME;
      });
    } else {
      window.location.href = ROUTE_PATH.HOME;
    }
  };

  const getBookDetailById = (id?: string) => {
    if (!id) return;
    getBookById<BookInfo>(id)
      .then((res) => {
        if (res.error) {
          resumeDB().then(() => {
            getBookDetailById(id);
          });
        } else {
          setCurrentBookDetail(res.data);
          const { content } = res.data;
          const textSyntaxTree: TextSyntaxTree = transformTextToExpectedFormat(content, showContainerRef.current!);
          setTextSyntaxTree(textSyntaxTree);
          ref.current?.style.setProperty('view-transition-name', `book-info-${id}`);
        }
      })
      .catch(() => {
        window.location.href = ROUTE_PATH.HOME;
      });
  };

  useEffect(() => {
    const { id } = getQuery();
    if (id) {
      getBookDetailById(id);
    }
  }, []);

  useEffect(() => {
    // 书籍详情变更，更新 UI
    syncHook.tap(EVENT_NAME.SET_CURRENT_BOOK_DETAIL, updateUI);
    syncHook.tap(EVENT_NAME.SET_CURRENT_BOOK_PAGE, updateUI);
    return () => {
      syncHook.off(EVENT_NAME.SET_CURRENT_BOOK_DETAIL, updateUI);
      syncHook.off(EVENT_NAME.SET_CURRENT_BOOK_PAGE, updateUI);
    };
  }, [_]);

  return (
    <div className="px-44 bg-front-bg-color-1 h-screen relative">
      <div className="w-full h-full flex flex-col">
        <div className="h-16 flex items-center justify-between flex-row flex-nowrap shrink-0">
          <div>
            <a className="text-text-color-2 font-medium hover:text-text-color-1 cursor-pointer" onClick={toHome}>
              {bookDetail?.title}
            </a>
          </div>
          <div>
            <a className="text-text-color-2 font-normal cursor-pointer hover:text-text-color-1" onClick={toHome}>
              首页
            </a>
          </div>
        </div>
        <div
          ref={ref}
          style={{
            viewTransitionName: `book-info-${id}`,
          }}
          className="bg-front-bg-color-3 rounded-2xl flex-grow pt-7 px-16 flex flex-col text-base book-info-container"
        >
          <div className="text-text-color-3 text-sm font-light">{getTitle()}</div>
          <div
            className="mt-5 cursor-auto flex flex-row flex-nowrap justify-between items-center font-normal tracking-wide whitespace-pre-wrap text-text-color-1 text-lg leading-10 w-full"
            style={{
              height: 'calc(100vh - var(--spacing) * 63)',
            }}
          >
            <div className="h-full w-4/9 overflow-hidden break-words whitespace-pre-wrap" ref={showContainerRef}>
              {textSyntaxTree.pageText[pageNum]?.text}
            </div>
            <div className="h-full w-4/9 overflow-hidden break-words whitespace-pre-wrap">
              {textSyntaxTree.pageText[pageNum + 1]?.text}
            </div>
          </div>
          <div className="h-16">
            <div className="flex justify-between items-center h-full">
              <div
                className="text-text-color-2 text-sm font-light border-1 border-border-color-1 pl-2 pr-3 rounded-4xl h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                onClick={pre}
              >
                <r-icon className="rotate-90 cursor-pointer" name="more" style={ICON_STYLE}></r-icon>
                <span>上一页</span>
              </div>
              <div
                className="text-text-color-2 text-sm font-light border-1 border-border-color-1 pr-2 pl-3 rounded-4xl h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                onClick={next}
              >
                <span>下一页</span>
                <r-icon className="-rotate-90 cursor-pointer" name="more" style={ICON_STYLE}></r-icon>
              </div>
            </div>
          </div>
        </div>
        <div className="h-14 w-full"></div>
      </div>
      <BookDetailOperate />
    </div>
  );
};

export default BookDetail;
