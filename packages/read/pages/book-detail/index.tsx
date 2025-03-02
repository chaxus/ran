import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getBookById } from '@/store/books';
import type { BookInfo } from '@/store/books';
import { arrayBufferToString, extractChapters, pagingText } from '@/lib/transformText';
import { Popover } from '@/components/popover';
import 'ranui/icon';
import 'ranui/input';

const ICON_STYLE = {
  '--ran-icon-font-size': '14px',
  '--ran-icon-color': '#8c8c8c',
};

const MENU_ICON_STYLE = {
  '--ran-icon-font-size': '24px',
  '--ran-icon-color': '#8c8c8c',
};

const inputStyle = {
  '--ran-input-border-radius': '2rem',
  '--ran-input-content-border-radius': '2rem',
  '--ran-input-content-padding': '10px',
  '--ran-input-content-font-size': '14px',
  '--ran-input-content-font-weight': '400',
  '--ran-icon-font-size': '16px',
  '--ran-icon-color': '#212832',
  '--ran-icon-margin': '2px 0px 0px 12px',
  '--ran-input-background-color': 'rgba(13,20,30,.04)',
  '--ran-input-content-background-color': 'transparent',
  '--ran-input-border': 'none',
};

const Menu = () => {
  return (
    <div className='w-md' style={{
      height: 'calc(100vh - calc(var(--spacing) * 32))',
    }}>
      <div className='px-6 py-7'>
        <r-input className="h-10" icon="search" style={inputStyle} placeholder="搜索"></r-input>
      </div>
    </div>
  )
}

const BookDetailOperate = () => {
  return (
    <div className="absolute top-16 right-22">
      <Popover placement='left' trigger='click' overlay={<Menu />}>
        <div className="w-12 h-12 bg-front-bg-color-3 rounded-4xl flex items-center justify-center cursor-pointer">
          <r-icon name="menu" style={MENU_ICON_STYLE}></r-icon>
        </div>
      </Popover>
    </div>
  )
}

export const BookDetail = (): React.JSX.Element => {
  const { id } = useParams();
  const showContainerRef = useRef<HTMLDivElement>(null);

  const [bookDetail, setBookDetail] = useState<BookInfo>();
  const [bookContentList, setBookContentList] = useState<{ text: string; h2: string }[]>([]);
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
        let text = arrayBufferToString(content).replace(/(?:\r\n|\r|\n)+/g, '\n') || '';
        const extractedChapters = extractChapters(text);
        extractedChapters.forEach((chapter) => {
          const { title } = chapter;
          text = text.replace(title, `<h2>${title}</h2>`);
        });
        if (showContainerRef.current) {
          const result = pagingText(text, showContainerRef.current);
          setBookContentList(result);
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
            <div className="text-text-color-2 font-medium hover:text-text-color-1 cursor-pointer">
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
            {bookContentList[pageNum]?.h2.replace(/<h2>|<\/h2>/g, '')}
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
                className="text-text-color-2 text-sm font-light border-1 border-border-color-1 pl-2 pr-3 rounded-4xl h-8 flex items-center justify-center cursor-pointer"
                onClick={pre}
              >
                <r-icon className="rotate-90 cursor-pointer" name="more" style={ICON_STYLE}></r-icon>
                <span>上一章</span>
              </div>
              <div
                className="text-text-color-2 text-sm font-light border-1 border-border-color-1 pr-2 pl-3 rounded-4xl h-8 flex items-center justify-center cursor-pointer"
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
      <BookDetailOperate />
    </div>
  );
};

export default BookDetail;
