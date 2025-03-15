import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getBookById } from '@/store/books';
import {
  CHAPTER_TITLE_END,
  CHAPTER_TITLE_START,
  arrayBufferToString,
  extractCaptionTitleChapters,
  pagingText,
} from '@/lib/transformText';
import { Popover } from '@/components/popover';
import type { BookInfo } from '@/store/books';
import type { PagingTextItem, PagingTextResult } from '@/lib/transformText';
import { ROUTE_PATH } from '@/router';
import 'ranui/icon';
import 'ranui/input';
import './index.scss';

const ICON_STYLE = {
  '--ran-icon-font-size': '14px',
  '--ran-icon-color': 'var(--icon-color-1)',
};

const MENU_ICON_STYLE = {
  '--ran-icon-font-size': '24px',
};

const SORT_ICON_STYLE = {
  '--ran-icon-font-size': '20px',
};

const inputStyle = {
  '--ran-input-border-radius': '2rem',
  '--ran-input-content-border-radius': '2rem',
  '--ran-input-content-padding': '10px',
  '--ran-input-content-font-size': '14px',
  '--ran-input-content-font-weight': '400',
  '--ran-icon-font-size': '16px',
  '--ran-icon-color': 'var(--icon-color-1)',
  '--ran-icon-margin': '2px 0px 0px 12px',
  '--ran-input-background-color': 'rgba(13,20,30,.04)',
  '--ran-input-content-background-color': 'transparent',
  '--ran-input-border': 'none',
};

interface MenuProps {
  bookDetail?: BookInfo;
  setPageNum?: (num: number) => void;
  textSyntaxTree: TextSyntaxTree;
}

enum SORT_DIRECTION {
  UP = 'UP',
  DOWN = 'DOWN',
}

const Menu = ({ bookDetail, setPageNum, textSyntaxTree }: MenuProps) => {
  const { title, author, image } = bookDetail || {};
  const { titleIdTitle = [], titleIdPage = {} } = textSyntaxTree || {};
  const scrollRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const [sortDirection, setSortDirection] = useState(SORT_DIRECTION.DOWN);

  const toPage = useCallback(
    (e: Event) => {
      const index = (e.target as HTMLElement)?.getAttribute('title') || '';
      if (index === undefined) return;
      const page = titleIdPage[index];
      if (setPageNum && page !== undefined) {
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
    },
    [textSyntaxTree],
  );

  const toSort = useCallback(() => {
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
  }, [textSyntaxTree, sortDirection]);

  return (
    <div
      className="w-md flex flex-col"
      style={{
        height: 'calc(100vh - calc(var(--spacing) * 32))',
      }}
    >
      <div className="px-6 py-7">
        <r-input className="h-10" icon="search" style={inputStyle} placeholder="搜索"></r-input>
      </div>
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
    </div>
  );
};

interface BookDetailOperateProps {
  setPageNum?: (num: number) => void;
  textSyntaxTree: TextSyntaxTree;
  bookDetail?: BookInfo;
}

const BookDetailOperate = ({ bookDetail, setPageNum, textSyntaxTree }: BookDetailOperateProps) => {
  return (
    <div className="absolute top-16 right-22">
      <Popover
        placement="left"
        trigger="click"
        overlay={<Menu bookDetail={bookDetail} setPageNum={setPageNum} textSyntaxTree={textSyntaxTree} />}
      >
        <div className="w-12 h-12 bg-front-bg-color-3 rounded-4xl flex items-center justify-center cursor-pointer">
          <r-icon className="hover-icon" name="menu" style={MENU_ICON_STYLE}></r-icon>
        </div>
      </Popover>
    </div>
  );
};

interface Section {
  title: string;
  section: string;
}

interface Sequence {
  title: string;
  result: PagingTextResult;
  titleId: number;
}

interface TextSyntaxTree {
  sequences: Sequence[];
  totalPage: number;
  pageText: PagingTextItem[];
  pageTitleId: number[];
  titleIdTitle: string[];
  titleIdPage: Record<string, number>;
}

export const BookDetail = (): React.JSX.Element => {
  const { id } = useParams();
  const showContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [bookDetail, setBookDetail] = useState<BookInfo>();
  const [textSyntaxTree, setTextSyntaxTree] = useState<TextSyntaxTree>({
    sequences: [],
    totalPage: 0,
    pageText: [],
    pageTitleId: [],
    titleIdTitle: [],
    titleIdPage: {},
  });
  const [pageNum, setPageNum] = useState(0);

  const pre = () => {
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
    const size = textSyntaxTree.totalPage;
    // 开始视图变换
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setPageNum(Math.min(pageNum + 2, size));
      });
    } else {
      setPageNum(Math.min(pageNum + 2, size));
    }
  };

  const getTitle = () => {
    const titleId = textSyntaxTree.pageTitleId[pageNum];
    return textSyntaxTree.titleIdTitle[titleId];
  };

  const bookInfoStyle: Record<string, string> = {
    '--view-transition-name': `${id}`,
  };

  useEffect(() => {
    if (!id) return;
    getBookById<BookInfo>(id)
      .then((res) => {
        if (res.error) return;
        setBookDetail(res.data);
        const { content } = res.data;
        // 1. 过滤空格换行
        const text = arrayBufferToString(content).replace(/(?:\r\n|\r|\n)+/g, '\n') || '';
        // 2. 提取章节标题
        const extractedChapters = extractCaptionTitleChapters(text);
        // 3. 把文本按章节划分
        const sections: Section[] = [];
        extractedChapters.forEach((item, index) => {
          const { start, end, title } = item;
          if (index === 0) {
            const section = text.slice(0, start);
            sections.push({ title: '前言', section });
          }
          const section = text.slice(start, end);
          sections.push({ title, section });
        });
        // 4. 把章节按页划分
        const sequences: Sequence[] = [];
        sections.forEach((item, index) => {
          const { title, section } = item;
          if (showContainerRef.current) {
            const result = pagingText(
              section.replace(CHAPTER_TITLE_START, '').replace(CHAPTER_TITLE_END, ''),
              showContainerRef.current,
            );
            sequences.push({ title, result, titleId: index });
          }
        });

        // 5. 输出文本语法树
        let totalPage = 0;
        // 通过空间换时间，构建 page -> text 的映射
        const pageText: PagingTextItem[] = [];
        // page -> titleId 的映射
        const pageTitleId: number[] = [];
        // titleId -> title 的映射
        const titleIdTitle: string[] = [];
        // titleId -> page 的映射
        const titleIdPage: Record<string, number> = {};

        sequences.forEach((item) => {
          totalPage += item.result.program.length;
          item.result.program.forEach((page) => {
            if (!titleIdPage[item.titleId]) {
              titleIdPage[item.titleId] = pageText.length;
            }
            pageTitleId.push(item.titleId);
            pageText.push(page);
          });
          titleIdTitle.push(item.title);
        });
        setTextSyntaxTree({ sequences, totalPage, pageText, pageTitleId, titleIdTitle, titleIdPage });
      })
      .catch(() => {
        navigate(ROUTE_PATH.HOME);
      });
  }, []);

  const toHome = () => {
    navigate(ROUTE_PATH.HOME);
  };

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
          className="bg-front-bg-color-3 rounded-2xl flex-grow pt-7 px-16 flex flex-col text-base book-info"
          style={bookInfoStyle}
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
      <BookDetailOperate bookDetail={bookDetail} setPageNum={setPageNum} textSyntaxTree={textSyntaxTree} />
    </div>
  );
};

export default BookDetail;
