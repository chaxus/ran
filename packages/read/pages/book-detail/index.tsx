// import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { debounce, getQuery } from 'ranuts/utils';
import { getBookById } from '@/store/books';
import { transformTextToExpectedFormat } from '@/lib/transformText';
import type { BookInfo } from '@/store/books';
import type { TextSyntaxTree } from '@/lib/transformText';
import { ROUTE_PATH } from '@/router';
import { BookDetailOperate, MobileBookDetailOperate } from '@/components/DetailOperate';
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
import { DEVICE_ENUM, useCheckDevice } from '@/lib/hooks';
import { Loading } from '@/components/Loading';
import { t } from '@/locales';
import 'ranui/icon';
import 'ranui/input';
import './index.scss';

const DESKTOP_ICON_STYLE = {
  '--ran-icon-font-size': '14px',
  '--ran-icon-color': 'var(--icon-color-1)',
};

const pre = (num: number = 1) => {
  const pageNum: number = getPageNum();
  if (pageNum === 0) return;
  // 开始视图变换
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      setPageNum(Math.max(pageNum - num, 0));
    });
  } else {
    setPageNum(Math.max(pageNum - num, 0));
  }
};

const next = (num: number = 1) => {
  const pageNum: number = getPageNum();
  const textSyntaxTree: TextSyntaxTree = getTextSyntaxTree();
  const size: number = textSyntaxTree?.totalPage;
  // 开始视图变换
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      setPageNum(Math.min(pageNum + num, size));
    });
  } else {
    setPageNum(Math.min(pageNum + num, size));
  }
};

export const BookDetail = (): React.JSX.Element => {
  const [currentDevice] = useCheckDevice();
  if (currentDevice === DEVICE_ENUM.MOBILE) return <MobileBookDetail />;
  if (currentDevice === DEVICE_ENUM.DESKTOP) return <DesktopBookDetail />;
  return <Loading />;
};

export const DesktopBookDetail = (): React.JSX.Element => {
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
        window.location.href = `${ROUTE_PATH.HOME}`;
      });
    } else {
      window.location.href = `${ROUTE_PATH.HOME}`;
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
          const { content, title } = res.data;
          const textSyntaxTree: TextSyntaxTree = transformTextToExpectedFormat({
            content,
            title,
            container: showContainerRef.current!,
          });
          setTextSyntaxTree(textSyntaxTree);
          ref.current?.style.setProperty('view-transition-name', `book-info-${id}`);
        }
      })
      .catch((error) => {
        console.log('error', error);
        window.location.href = `${ROUTE_PATH.HOME}`;
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
              {t('home')}
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
                onClick={() => pre(2)}
              >
                <r-icon className="rotate-90 cursor-pointer" name="more" style={DESKTOP_ICON_STYLE}></r-icon>
                <span>{t('previous_page')}</span>
              </div>
              <div
                className="text-text-color-2 text-sm font-light border-1 border-border-color-1 pr-2 pl-3 rounded-4xl h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                onClick={() => next(2)}
              >
                <span>{t('next_page')}</span>
                <r-icon className="-rotate-90 cursor-pointer" name="more" style={DESKTOP_ICON_STYLE}></r-icon>
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

const MOBILE_ICON_STYLE = {
  '--ran-icon-font-size': '36px',
  '--ran-icon-color': 'var(--icon-color-1)',
};

export const MobileBookDetail = (): React.JSX.Element => {
  const showContainerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const touchMoveRef = useRef<number>(0);
  const [_, update] = useState(0);
  const [isTouch, setIsTouch] = useState(false);
  const textSyntaxTree: TextSyntaxTree = getTextSyntaxTree();
  const totalPage: number = textSyntaxTree.totalPage;
  const pageNum: number = getPageNum();
  const { id } = getQuery();

  const updateUI = () => {
    debounce(() => {
      update((prev) => prev + 1);
    }, 16)();
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
          const { content, title } = res.data;
          const textSyntaxTree: TextSyntaxTree = transformTextToExpectedFormat({
            content,
            title,
            container: showContainerRef.current!,
          });
          setTextSyntaxTree(textSyntaxTree);
          ref.current?.style.setProperty('view-transition-name', `book-info-${id}`);
        }
      })
      .catch((error) => {
        console.log('error', error);
        window.location.href = `${ROUTE_PATH.HOME}`;
      });
  };

  const touchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const { touches } = e;
    const { clientX } = touches[0];
    touchMoveRef.current = clientX;
  };

  const touchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const { changedTouches } = e;
    const { clientX } = changedTouches[0];
    const distance = clientX - touchMoveRef.current;
    if (Math.abs(distance) < 30) return;
    if (distance > 0) {
      pre();
    } else {
      next();
    }
  };

  const click = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX } = e;
    const clientWidth = showContainerRef.current?.clientWidth || 0;
    if (!clientWidth) return;
    if (clientX < clientWidth / 4) {
      pre();
      setIsTouch(false);
    } else if (clientX > (clientWidth / 4) * 3) {
      next();
      setIsTouch(false);
    } else {
      setIsTouch(!isTouch);
    }
  };

  const back = () => {
    window.history.back();
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
    <div>
      <div
        className="w-screen h-screen bg-front-bg-color-1"
        ref={ref}
        style={{
          viewTransitionName: `book-info-${id}`,
        }}
      >
        <div className="w-full h-full p-8 relative">
          <div
            className="absolute top-0 left-0 transition-all w-full flex items-center justify-between px-4 bg-front-bg-color-3 overflow-hidden"
            style={{
              height: isTouch ? 'calc(var(--spacing) * 14)' : '0px',
            }}
          >
            <r-icon name="more" className="cursor-pointer rotate-90" style={MOBILE_ICON_STYLE} onClick={back}></r-icon>
          </div>
          <div
            className="w-full h-full text-text-color-1 text-lg leading-10 whitespace-pre-wrap"
            onTouchStart={touchStart}
            onTouchEnd={touchEnd}
            onClick={click}
            ref={showContainerRef}
          >
            {textSyntaxTree.pageText[pageNum]?.text}
          </div>
          <div
            className="absolute bottom-0 left-0 transition-all w-full flex items-center justify-between px-4 bg-front-bg-color-3 overflow-hidden z-20"
            style={{
              height: isTouch ? 'calc(var(--spacing) * 14)' : '0px',
            }}
          >
            <MobileBookDetailOperate />
          </div>
          <div className="text-right text-text-color-2 text-base absolute bottom-8 right-8 z-10">
            {pageNum + 1} / {totalPage + 1}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
