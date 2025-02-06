import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getBookById } from "@/store/books";
import type { BookInfo } from "@/store/books";
import { arrayBufferToString } from "@/lib/transformText";
import 'ranui/icon'

const ICON_STYLE = {
  '--ran-icon-font-size': '14px',
  '--ran-icon-color': '#8c8c8c',
}

export const BookDetail = (): React.JSX.Element => {

  const { id } = useParams();
  const showContainerRef = useRef<HTMLDivElement>(null);

  const [bookDetail, setBookDetail] = useState<BookInfo>();
  const [bookContentList, setBookContentList] = useState<string[]>([]);
  const [pageNum, setPageNum] = useState(0);

  const pre = () => {
    if (pageNum === 0) return;
    setPageNum(Math.max(pageNum - 2, 0));
  }

  const next = () => {
    const size = bookContentList.length
    setPageNum(Math.min(pageNum + 2, size));
  }

  const toHome = () => {
    window.location.href = '/';
  }

  useEffect(() => {
    if (!id) return;
    getBookById<BookInfo>(id).then((res) => {
      if (res.error) return;
      setBookDetail(res.data);
      const { content } = res.data;
      const text = arrayBufferToString(content).replace(/(?:\r\n|\r|\n)+/g, '\n') || ''
      const total = text.length;
      if (showContainerRef.current) {
        const { clientHeight, clientWidth } = showContainerRef.current;
        // 字体大小，字体行高，字体间距，字体宽度
        const rootFontSize = 16;
        const fontSize = 1.125 * rootFontSize; // 字体大小 text-lg
        const lineHeight = 0.25 * 10 * rootFontSize; // 行高（倍数）leading-10
        const letterSpacing = 0.025 * rootFontSize; // 字符间距（em）tracking-wide
        const charWidth = fontSize + letterSpacing; // 每个字符的宽度（px）
        const charsPerLine = Math.floor(clientWidth / charWidth); // 每行能容纳的字符数
        const lines = Math.floor(clientHeight / lineHeight); // 总行数
        const pageTotalChar = charsPerLine * lines; // 每页总字符数
        let useChar = 0;
        const result = [];
        while (total > useChar) {
          let currentLine = 0;
          let currentChart = 0;
          let currentText = ''
          while (currentLine < lines && currentChart < pageTotalChar) {
            if (text[useChar] === '\n') {
              currentLine++;
              currentChart = 0;
            }
            if (text[useChar] === '\r') {
              currentLine++;
              currentChart = 0;
            }
            if(currentChart >= charsPerLine){
              currentLine++;
              currentChart = 0;
            }
            currentText += text[useChar];
            useChar++;
            currentChart++;
          }
          result.push(currentText);
        }
        setBookContentList(result);
      }
    })
  }, []);

  return (
    <div className="px-44 bg-front-bg-color-1 h-screen">
      <div className="w-full h-full flex flex-col">
        <div className="h-16 flex items-center justify-between flex-row flex-nowrap shrink-0">
          <div>
            <div className="text-text-color-2 font-medium hover:text-text-color-1 cursor-pointer">{bookDetail?.title}</div>
          </div>
          <div>
            <div className="text-text-color-2 font-normal cursor-pointer hover:text-text-color-1" onClick={toHome}>首页</div>
          </div>
        </div>
        <div className="bg-front-bg-color-3 rounded-2xl flex-grow pt-7 px-16 flex flex-col text-base">
          <div className="text-text-color-3 text-sm font-light">
            第一章，如何构建一个
          </div>
          <div className="mt-5 cursor-auto flex flex-row flex-nowrap justify-between items-center font-normal tracking-wide whitespace-pre-wrap text-text-color-1 text-lg leading-10 w-full" style={{
            height: 'calc(100vh - var(--spacing) * 63)',
          }}>
            <div className="h-full w-4/9 overflow-hidden" ref={showContainerRef}>{bookContentList[pageNum]}</div>
            <div className="h-full w-4/9 overflow-hidden">{bookContentList[pageNum + 1]}</div>
          </div>
          <div className="h-16">
            <div className="flex justify-between items-center h-full">
              <div className="text-text-color-2 text-sm font-light border-1 border-border-color-1 pl-2 pr-3 rounded-4xl h-8 flex items-center justify-center cursor-pointer" onClick={pre}>
                <r-icon className="rotate-90 cursor-pointer" name="more" style={ICON_STYLE}></r-icon>
                <span>上一章</span>
              </div>
              <div className="text-text-color-2 text-sm font-light border-1 border-border-color-1 pr-2 pl-3 rounded-4xl h-8 flex items-center justify-center cursor-pointer" onClick={next}>
                <span>下一章</span>
                <r-icon className="-rotate-90 cursor-pointer" name="more" style={ICON_STYLE}></r-icon>
              </div>
            </div>
          </div>
        </div>
        <div className="h-14 w-full"></div>
      </div>
    </div>
  )
}

export default BookDetail;
