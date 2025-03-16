import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from 'ranuts/utils';
import { trim } from '@/lib/transformText';
import type { BookInfo } from '@/store/books';
import type { PagingTextItem, TextSyntaxTree } from '@/lib/transformText';
import { Catalogue } from '@/components/Catalogue';

export interface MenuProps {
    bookDetail?: BookInfo;
    setPageNum?: (num: number) => void;
    textSyntaxTree: TextSyntaxTree;
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

export enum SORT_DIRECTION {
    UP = 'UP',
    DOWN = 'DOWN',
}

export const BookDetailMenu = ({ bookDetail, setPageNum, textSyntaxTree }: MenuProps): React.JSX.Element => {
    const searchRef = useRef<HTMLInputElement>(null);
    const [showSearchResult, setShowSearchResult] = useState(false);
    const [searchResult, setSearchResult] = useState<{ title: { item: string; index: number }[]; page: { item: PagingTextItem; index: number }[] }>({ title: [], page: [] });
    
    const onSearch = useCallback(
        debounce((e: Event) => {
            const value = (e.target as HTMLInputElement)?.value || '';
            const searchValue = trim(value);
            // 没有输入内容，则不进行搜索
            if (!searchValue) {
                setShowSearchResult(false);
                return
            }
            setShowSearchResult(true);
            console.log('value---->', value, textSyntaxTree, searchResult);
            const { titleIdTitle = [], pageText = [] } = textSyntaxTree || {};
            const titleSearchResult: { item: string; index: number }[] = []
            titleIdTitle.forEach((item, index) => {
                if (item.includes(searchValue)) {
                    titleSearchResult.push({ item, index });
                }
            })
            const pageSearchResult: { item: PagingTextItem; index: number }[] = []
            pageText.forEach((item, index) => {
                if (item.text.includes(searchValue)) {
                    pageSearchResult.push({ item, index });
                }
            })
            // 没有搜索结果
            if (titleSearchResult.length <= 0 && pageSearchResult.length <= 0) {
                return;
            }
            setSearchResult({ title: titleSearchResult, page: pageSearchResult });
        }, 500),
        [textSyntaxTree],
    );

    useEffect(() => {
        searchRef.current?.addEventListener('change', onSearch);
        return () => {
            searchRef.current?.removeEventListener('change', onSearch);
        };
    }, [textSyntaxTree]);

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
                <Catalogue bookDetail={bookDetail} textSyntaxTree={textSyntaxTree} setPageNum={setPageNum} />
            ) : (
                <div></div>
            )}
        </div>
    );
};
