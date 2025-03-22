import { useEffect, useRef, useState } from 'react';
import { debounce, getMatchingSentences } from 'ranuts/utils';
import { trim } from '@/lib/transformText';
import type { TextSyntaxTree } from '@/lib/transformText';
import { Catalogue } from '@/components/Catalogue';
import { getTextSyntaxTree, setPageNum } from '@/lib/subscribe';

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

interface SearchResult {
  text: { pre: string; value: string; next: string; index: number }[];
  index: number;
  title: string;
}

const ICON_STYLE = {
  '--ran-icon-font-size': '60px',
};

export const BookDetailMenu = (): React.JSX.Element => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const searchResultRef = useRef<HTMLDivElement>(null);

  const onSearch = debounce((e: Event) => {
    const value = (e.target as HTMLInputElement)?.value || '';
    const searchValue = trim(value);
    // 没有输入内容，则不进行搜索
    if (!searchValue) {
      setShowSearchResult(false);
      return;
    }
    // 展示搜索结果
    setShowSearchResult(true);
    const textSyntaxTree: TextSyntaxTree = getTextSyntaxTree();
    const { pageText = [], pageTitleId, titleIdTitle } = textSyntaxTree || {};
    const pageSearchResult: SearchResult[] = [];
    pageText.forEach((item, index) => {
      if (item.text.includes(searchValue)) {
        const text = getMatchingSentences(item.text, searchValue);
        const textList = text.map((str: string) => {
          const [pre, next] = str.split(searchValue);
          return { pre, value: searchValue, next, index };
        });
        const title = titleIdTitle[pageTitleId[index]];
        const pageSearchResultItem = pageSearchResult.find((i) => i.title === titleIdTitle[pageTitleId[index]]);
        if (pageSearchResultItem) {
          pageSearchResultItem.text.push(...textList);
        } else {
          pageSearchResult.push({ text: textList, index, title });
        }
      }
    });
    setSearchResult(pageSearchResult);
  }, 500);

  const onSearchResult = (e: Event) => {
    const title = (e.target as HTMLElement)?.getAttribute('item-index');
    if (title === '') return;
    setPageNum(Number(title));
  };

  useEffect(() => {
    searchRef.current?.addEventListener('change', onSearch);
    return () => {
      searchRef.current?.removeEventListener('change', onSearch);
    };
  }, []);

  useEffect(() => {
    searchResultRef.current?.addEventListener('click', onSearchResult);
    return () => {
      searchResultRef.current?.removeEventListener('click', onSearchResult);
    };
  }, [searchResult]);

  return (
    <div
      className="w-md flex flex-col"
      style={{
        height: 'calc(100vh - calc(var(--spacing) * 32))',
      }}
    >
      <div className="px-6 py-7">
        <r-input className="h-10" icon="search" style={inputStyle} placeholder="搜索" ref={searchRef}></r-input>
      </div>
      {!showSearchResult ? (
        <Catalogue />
      ) : (
        <div ref={searchResultRef} className="pb-7 overflow-y-auto flex-auto">
          {searchResult.length > 0 ? (
            searchResult?.map((item) => {
              const { text = [], index, title } = item;
              return (
                <div key={index} item-index={`${index}`}>
                  <div className="text-text-color-1 font-normal text-base px-6 py-2">{title}</div>
                  {text.map((str, i) => {
                    const { pre, value, next } = str;
                    return (
                      <div
                        item-index={`${str.index}`}
                        className="text-text-color-2 font-normal text-base py-4 px-6 cursor-pointer hover:bg-blue-50"
                        key={pre + value + next + i}
                      >
                        {pre}
                        <span className="text-brand-blue-color-1">{value}</span>
                        {next}
                      </div>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <div className="h-full">
              <div className="flex flex-col items-center justify-center h-full">
                <r-icon name="without-content" style={ICON_STYLE}></r-icon>
                <div className="text-text-color-2 font-normal text-base">无结果</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
