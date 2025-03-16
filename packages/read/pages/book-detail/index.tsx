import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getBookById } from '@/store/books';
import {
  CHAPTER_TITLE_END,
  CHAPTER_TITLE_START,
  arrayBufferToString,
  extractCaptionTitleChapters,
  pagingText,
} from '@/lib/transformText';
import type { BookInfo } from '@/store/books';
import type { PagingTextItem, PagingTextResult } from '@/lib/transformText';
import { ROUTE_PATH } from '@/router';
import { BookDetailOperate } from '@/components/DetailOperate';
import 'ranui/icon';
import 'ranui/input';
import './index.scss';

const ICON_STYLE = {
  '--ran-icon-font-size': '14px',
  '--ran-icon-color': 'var(--icon-color-1)',
};

export interface Section {
  title: string;
  section: string;
}

export interface Sequence {
  title: string;
  result: PagingTextResult;
  titleId: number;
}

export interface TextSyntaxTree {
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
  const ref = useRef<HTMLDivElement>(null);
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

  const toHome = () => {
    if (document.startViewTransition) {
      ref.current?.style.setProperty('view-transition-name', 'book-info');
      document.startViewTransition(() => {
        ref.current?.style.setProperty('view-transition-name', '');
        navigate(ROUTE_PATH.HOME);
      });
    } else {
      navigate(ROUTE_PATH.HOME);
    }
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
        ref.current?.style.setProperty('view-transition-name', 'book-info');
      })
      .catch(() => {
        navigate(ROUTE_PATH.HOME);
      });
  }, []);

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
            viewTransitionName: 'book-info',
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
      <BookDetailOperate bookDetail={bookDetail} setPageNum={setPageNum} textSyntaxTree={textSyntaxTree} />
    </div>
  );
};

export default BookDetail;
