import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getBookById } from '@/store/books';
import { arrayBufferToString, extractRomanChapters, pagingText } from '@/lib/transformText';
import { Popover } from '@/components/popover';
import type { BookInfo } from '@/store/books';
import type { ChapterItem, PagingTextResult } from '@/lib/transformText';
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
}

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
  catalogue?: ChapterItem[];
  setPageNum?: (num: number) => void;
}

const Menu = ({ bookDetail, catalogue, setPageNum }: MenuProps) => {
  const { title, author, image } = bookDetail || {};
  const scrollRef = useRef<HTMLDivElement>(null);

  const toPage = useCallback((e: Event) => {
    // const { start, end } = item || {};
    const start = (e.target as HTMLElement)?.getAttribute('title') || {}
    if (!start) return;
    const item = catalogue?.find((i) => i.start === Number(start));
    if (!item) return;
    if (setPageNum && item.pageNum !== undefined) {
      setPageNum(item.pageNum);
    }
    console.log('item', item);

  }, [catalogue])

  useEffect(() => {
    scrollRef.current?.addEventListener('click', toPage)
    return () => {
      scrollRef.current?.removeEventListener('click', toPage)
    }
  }, [catalogue])


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
      <div className='mx-9 basis-10 flex items-center justify-end shrink-0'>
        <r-icon className="cursor-pointer hover-icon" name="sort" style={SORT_ICON_STYLE}></r-icon>
      </div>
      <div className='overflow-y-auto flex-auto' ref={scrollRef}>
        {catalogue?.map((item) => {
          return (
            <div className='px-7 h-12 text-text-color-2 font-normal text-base hover:bg-blue-50 cursor-pointer' title={`${item.start}`} key={item.start} >
              <div className='border-t border-front-bg-color-1 h-full w-full flex items-center' title={`${item.start}`} >{item.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface BookDetailOperateProps {
  bookDetail?: BookInfo;
  catalogue?: ChapterItem[];
  setPageNum?: (num: number) => void;
}

const BookDetailOperate = ({ bookDetail, catalogue, setPageNum }: BookDetailOperateProps) => {
  return (
    <div className="absolute top-16 right-22">
      <Popover placement="left" trigger="click" overlay={<Menu bookDetail={bookDetail} catalogue={catalogue} setPageNum={setPageNum} />}>
        <div className="w-12 h-12 bg-front-bg-color-3 rounded-4xl flex items-center justify-center cursor-pointer">
          <r-icon className="hover-icon" name="menu" style={MENU_ICON_STYLE}></r-icon>
        </div>
      </Popover>
    </div>
  );
};

export const BookDetail = (): React.JSX.Element => {
  const { id } = useParams();
  const showContainerRef = useRef<HTMLDivElement>(null);

  const [bookDetail, setBookDetail] = useState<BookInfo>();
  const [bookContentList, setBookContentList] = useState<{ text: string; title: string }[]>([]);
  const [catalogue, setCatalogue] = useState<ChapterItem[]>([]);
  const [pageNum, setPageNum] = useState(0);

  const pre = () => {
    if (pageNum === 0) return;
    setPageNum(Math.max(pageNum - 2, 0));
  };

  const next = () => {
    const size = bookContentList.length;
    setPageNum(Math.min(pageNum + 2, size));
  };

  const toHome = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    if (!id) return;
    getBookById<BookInfo>(id)
      .then((res) => {
        if (res.error) return;
        setBookDetail(res.data);
        const { content } = res.data;
        const text = arrayBufferToString(content).replace(/(?:\r\n|\r|\n)+/g, '\n') || '';
        const extractedChapters = extractRomanChapters(text);
        const chapters = JSON.parse(JSON.stringify(extractedChapters));
        if (showContainerRef.current) {
          const result: PagingTextResult = pagingText(text, showContainerRef.current);
          const { program = [] } = result || {}
          const bookContents = program.map((item) => {
            const { text, index, start } = item;
            if (start > chapters[0]?.end) {
              const chapterItem = chapters.shift();
              const value = extractedChapters.findIndex(i => i.start === chapterItem?.start)
              extractedChapters[value + 1].pageNum = index
            }
            extractedChapters[0].pageNum = 0;
            const title = chapters[0]?.title || '';
            return {
              text,
              title,
              pageNum: index,
            };
          });
          console.log('bookContents', bookContents);

          setCatalogue(extractedChapters);
          setBookContentList(bookContents);
        }
      })
      .catch(() => {
        toHome();
      });
  }, []);

  return (
    <div className="px-44 bg-front-bg-color-1 h-screen relative">
      <div className="w-full h-full flex flex-col">
        <div className="h-16 flex items-center justify-between flex-row flex-nowrap shrink-0">
          <div>
            <div className="text-text-color-2 font-medium hover:text-text-color-1 cursor-pointer" onClick={toHome}>
              {bookDetail?.title}
            </div>
          </div>
          <div>
            <div className="text-text-color-2 font-normal cursor-pointer hover:text-text-color-1" onClick={toHome}>
              首页
            </div>
          </div>
        </div>
        <div className="bg-front-bg-color-3 rounded-2xl flex-grow pt-7 px-16 flex flex-col text-base">
          <div className="text-text-color-3 text-sm font-light">
            {bookContentList[pageNum]?.title}
          </div>
          <div
            className="mt-5 cursor-auto flex flex-row flex-nowrap justify-between items-center font-normal tracking-wide whitespace-pre-wrap text-text-color-1 text-lg leading-10 w-full"
            style={{
              height: 'calc(100vh - var(--spacing) * 63)',
            }}
          >
            <div
              className="h-full w-4/9 overflow-hidden"
              ref={showContainerRef}
              dangerouslySetInnerHTML={{ __html: bookContentList[pageNum]?.text }}
            ></div>
            <div
              className="h-full w-4/9 overflow-hidden"
              dangerouslySetInnerHTML={{ __html: bookContentList[pageNum + 1]?.text }}
            ></div>
          </div>
          <div className="h-16">
            <div className="flex justify-between items-center h-full">
              <div
                className="text-text-color-2 text-sm font-light border-1 border-border-color-1 pl-2 pr-3 rounded-4xl h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                onClick={pre}
              >
                <r-icon className="rotate-90 cursor-pointer" name="more" style={ICON_STYLE}></r-icon>
                <span>上一章</span>
              </div>
              <div
                className="text-text-color-2 text-sm font-light border-1 border-border-color-1 pr-2 pl-3 rounded-4xl h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                onClick={next}
              >
                <span>下一章</span>
                <r-icon className="-rotate-90 cursor-pointer" name="more" style={ICON_STYLE}></r-icon>
              </div>
            </div>
          </div>
        </div>
        <div className="h-14 w-full"></div>
      </div>
      <BookDetailOperate bookDetail={bookDetail} catalogue={catalogue} setPageNum={setPageNum} />
    </div>
  );
};

export default BookDetail;
