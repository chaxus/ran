import { useEffect, useRef, useState } from 'react';
import { debounce } from 'ranuts/utils';
import { BookCard } from '@/components/BookCard';
import { addBook, getAllBooks, searchBooksByAuthor, searchBooksByContent, searchBooksByTitle } from '@/store/books';
import { checkEncoding, createReader, trim } from '@/lib/transformText';
import { resumeDB } from '@/store';
import { BOOKS_ADD_BY_DEFAULT, ensampleConfigs } from '@/lib/ensample';
import type { EnBook } from '@/lib/ensample';
import type { BookInfo, SearchResult } from '@/store/books';
import { ROUTE_PATH } from '@/router';
import { DEVICE_ENUM, useCheckDevice } from '@/lib/hooks';
import { Loading } from '@/components/Loading';
import { t } from '@/locales';
import 'ranui/input';
import 'ranui/icon';

const DESKTOP_INPUT_STYLE = {
  '--ran-input-border-radius': '2rem',
  '--ran-input-content-border-radius': '2rem',
  '--ran-input-content-padding': '10px',
  '--ran-input-content-font-size': '16px',
  '--ran-input-content-font-weight': '400',
  '--ran-icon-font-size': '24px',
  '--ran-icon-color': 'var(--icon-color-1)',
  '--ran-icon-margin': '4px 0px 0px 16px',
};

const DESKTOP_MORE_ICON_STYLE = {
  '--ran-icon-font-size': '24px',
  '--ran-icon-color': 'var(--icon-color-1)',
};

const DESKTOP_PLUS_ICON_STYLE = {
  '--ran-icon-font-size': '64px',
  '--ran-icon-color': 'var(--icon-color-2)',
  '--ran-icon-margin': '0px',
};

const DESKTOP_ICON_STYLE = {
  '--ran-icon-font-size': '120px',
};

const addBookByFile = () => {
  return new Promise((resolve, reject) => {
    const uploadFile = document.createElement('input');
    uploadFile.setAttribute('type', 'file');
    uploadFile.click();
    uploadFile.onchange = () => {
      const { files = [] } = uploadFile;
      if (files && files?.length > 0) {
        const [file] = files;
        createReader(file).then((result) => {
          addBook({
            title: file.name,
            encoding: checkEncoding(new Uint8Array(result)),
            content: result,
          }).then((res) => {
            if (!res.error) {
              resolve(res.data as BookInfo);
            } else {
              reject(res.error);
            }
          });
        });
      }
    };
  });
};

const addBookByUrl = ({ url, title, image, author }: EnBook) => {
  return new Promise((resolve, reject) => {
    fetch(url).then((response) => {
      response.blob().then((blob) => {
        const file = new File([blob], title, { type: blob.type });
        createReader(file).then((result) => {
          addBook({
            title: file.name,
            encoding: checkEncoding(new Uint8Array(result)),
            content: result,
            image,
            author,
          }).then((res) => {
            if (!res.error) {
              resolve(res.data as BookInfo);
            } else {
              reject(res.error);
            }
          });
        });
      });
    });
  });
};

export const Home = (): React.JSX.Element => {
  const [currentDevice] = useCheckDevice();
  if (currentDevice === DEVICE_ENUM.MOBILE) return <MobileHome />;
  if (currentDevice === DEVICE_ENUM.DESKTOP) return <DesktopHome />;
  return <Loading />;
};

export const DesktopHome = (): React.JSX.Element => {
  const [bookList, setBookList] = useState<BookInfo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const searchResultRef = useRef<HTMLDivElement>(null);
  const [searchTitleResult, setSearchTitleResult] = useState<BookInfo[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchAuthorResult, setSearchAuthorResult] = useState<BookInfo[]>([]);
  const [searchContentResult, setSearchContentResult] = useState<SearchResult[]>([]);

  const add = () => {
    addBookByFile().then((res) => {
      bookList.push(res as BookInfo);
      setBookList([...bookList]);
    });
  };

  const addFromUrl = async ({ url, title, image, author }: EnBook) => {
    addBookByUrl({ url, title, image, author }).then((res) => {
      bookList.push(res as BookInfo);
      setBookList([...bookList]);
    });
  };

  const getBooks = () => {
    getAllBooks<BookInfo>()
      .then((res) => {
        if (!res.error) {
          setBookList(res.data);
        } else {
          resumeDB().then(() => {
            getBooks();
          });
        }
      })
      .catch(() => {
        resumeDB().then(() => {
          getBooks();
        });
      });
  };

  const clearSearchResult = () => {
    setSearchTitleResult([]);
    setSearchAuthorResult([]);
    setSearchContentResult([]);
  };

  const onChange = debounce((e: Event) => {
    const value = trim((e.target as HTMLInputElement)?.value || '');
    setSearchValue(value);
    setSearchLoading(true);
    if (!value) {
      setSearchLoading(false);
      return;
    }
    clearSearchResult();
    // 搜索功能
    // 1. 搜索书的标题（分页 3 条）
    // 2. 搜索书的作者（分页 3 条）
    // 3. 搜索书内容（分页 3 条）
    searchBooksByTitle<BookInfo>(value).then((res) => {
      if (!res.error) {
        setSearchTitleResult(res.data);
      }
      setTimeout(() => {
        setSearchLoading(false);
      }, 500);
    });
    searchBooksByAuthor<BookInfo>(value).then((res) => {
      if (!res.error) {
        setSearchAuthorResult(res.data);
      }
      setTimeout(() => {
        setSearchLoading(false);
      }, 500);
    });
    searchBooksByContent<SearchResult>(value).then((res) => {
      if (!res.error) {
        setSearchContentResult(res.data);
      }
      setTimeout(() => {
        setSearchLoading(false);
      }, 500);
    });
  }, 500);

  const handleNativeClick = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const id = target.getAttribute('item-id');
    if (id) {
      window.location.href = `${ROUTE_PATH.BOOK_DETAIL}?id=${id}`;
    }
  };

  useEffect(() => {
    // 默认添加的书籍，只添加一次
    if (!localStorage.getItem(BOOKS_ADD_BY_DEFAULT)) {
      ensampleConfigs.forEach((config: EnBook) => {
        addFromUrl(config);
      });
      localStorage.setItem(BOOKS_ADD_BY_DEFAULT, 'true');
    }
    // 查询所有书籍，进行展示
    getBooks();
    // 监听搜索框的 change 事件
    inputRef.current?.addEventListener('change', onChange);
    searchResultRef.current?.addEventListener('click', handleNativeClick);
    return () => {
      inputRef.current?.removeEventListener('change', onChange);
      searchResultRef.current?.removeEventListener('click', handleNativeClick);
    };
  }, []);

  return (
    <div>
      <div className="w-full bg-front-bg-color-2">
        <div className="w-full min-h-72 pt-28">
          <r-input
            className="w-1/2 min-w-2xs h-14 block mx-auto"
            icon="search"
            style={DESKTOP_INPUT_STYLE}
            placeholder={t('search')}
            ref={inputRef}
          ></r-input>
          <div
            className="w-full transition-all duration-500 overflow-hidden mt-6 pb-6"
            style={{ height: searchValue ? 'calc(100vh - var(--spacing) * 48)' : '0px' }}
            ref={searchResultRef}
          >
            <div className="overflow-y-auto h-full">
              {searchTitleResult.length > 0 && !searchLoading && (
                <div className="w-1/2 min-w-2xs block mx-auto bg-front-bg-color-3 rounded-xl py-5 mb-6">
                  <div>
                    <div className="text-text-color-2 text-base font-medium px-5 pb-1.5">{t('ebook')}</div>
                    <div>
                      {searchTitleResult.map((book) => {
                        const { title, author, image } = book;
                        const strList = title.split(searchValue) || [];
                        return (
                          <div
                            className="py-3.5 px-5 flex flex-row flex-nowrap items-center shrink-0 cursor-pointer hover:bg-blue-50 min-h-32"
                            key={book.id + 'title'}
                            item-id={book.id}
                          >
                            {image && <img className="w-16 mr-5" src={image} item-id={book.id} />}
                            <div>
                              <div className="text-lg text-text-color-1 font-medium break-all" item-id={book.id}>
                                {strList.map((item, index) => (
                                  <span key={item + index} item-id={book.id}>
                                    {item}
                                    {index === strList.length - 1 ? (
                                      ''
                                    ) : (
                                      <span item-id={book.id} className="text-blue-500">
                                        {searchValue}
                                      </span>
                                    )}
                                  </span>
                                ))}
                              </div>
                              <div className="text-base text-text-color-2 font-medium mt-1 break-all" item-id={book.id}>
                                {author}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {searchContentResult.length > 0 && !searchLoading && (
                <div className="w-1/2 min-w-2xs block mx-auto bg-front-bg-color-3 rounded-xl py-5">
                  <div>
                    <div className="text-text-color-2 text-base font-medium px-5 pb-1.5">
                      {t('search_result_1')} <span className="text-blue-500">{searchValue}</span> {t('search_result_2')}
                      {t('search_result_3')}
                      {searchContentResult.length}
                    </div>
                    <div>
                      {searchContentResult.map((book) => {
                        const { title, author, image, matchedText = [] } = book;
                        const [str] = matchedText || [];
                        const strList = str.split(searchValue) || [];
                        return (
                          <div
                            className="py-3.5 px-5 flex flex-row flex-nowrap items-center shrink-0 cursor-pointer hover:bg-blue-50 min-h-32"
                            key={book.id + 'content'}
                            item-id={book.id}
                          >
                            {image && <img className="w-16 mr-5" src={image} item-id={book.id} />}
                            <div>
                              <div className="text-lg text-text-color-1 font-medium break-all" item-id={book.id}>
                                {title}
                              </div>
                              <div className="text-base text-text-color-2 font-medium mt-1 break-all" item-id={book.id}>
                                {author}
                              </div>
                              <div className="text-base text-text-color-2 font-medium mt-1 break-all" item-id={book.id}>
                                {strList.map((item, index) => (
                                  <span key={item + index} item-id={book.id}>
                                    {item}
                                    {index === strList.length - 1 ? (
                                      ''
                                    ) : (
                                      <span item-id={book.id} className="text-blue-500">
                                        {searchValue}
                                      </span>
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {searchTitleResult.length === 0 &&
                searchAuthorResult.length === 0 &&
                searchContentResult.length === 0 &&
                !searchLoading && (
                  <div className="h-full">
                    <div className="flex flex-col items-center justify-center h-full">
                      <r-icon name="without-content" className="text-text-color-2" style={DESKTOP_ICON_STYLE}></r-icon>
                      <div className="text-text-color-2 font-normal text-xl">{t('no_result')}</div>
                    </div>
                  </div>
                )}
              {searchLoading && (
                <div className="h-full">
                  <div className="flex flex-col items-center justify-center h-full">
                    <r-loading
                      name="circle-fold"
                      className="text-2xl"
                      style={{
                        '--loading-circle-fold-item-before-background': 'var(--brand-blue-color-1)',
                        '--loading-circle-fold-item-after-background': 'var(--brand-blue-color-1)',
                      }}
                    ></r-loading>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {!searchValue && (
        <div className="w-full bg-front-bg-color-1 min-h-svh">
          <div className="max-w-7xl mx-auto pt-12 flex flex-row justify-between items-center">
            <div className="flex justify-start items-center">
              <div className="cursor-pointer text-text-color-1 text-2xl font-medium">{t('my_bookcase')}</div>
              <r-icon className="-rotate-90 cursor-pointer" name="more" style={DESKTOP_MORE_ICON_STYLE}></r-icon>
            </div>
          </div>
          <div className="max-w-7xl mx-auto flex flex-row flex-wrap justify-start items-center">
            <div className="w-2xs h-40 bg-front-bg-color-3 p-5 cursor-pointer justify-center rounded-xl mr-6 items-center flex hover:scale-110 transition-all mt-5">
              <r-icon name="plus" style={DESKTOP_PLUS_ICON_STYLE} onClick={add}></r-icon>
            </div>
            {bookList.map((book) => (
              <BookCard book={book} key={book.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MOBILE_INPUT_STYLE = {
  '--ran-input-border-radius': '2rem',
  '--ran-input-content-border-radius': '2rem',
  '--ran-input-content-padding': '10px',
  '--ran-input-content-font-size': '16px',
  '--ran-input-content-font-weight': '400',
  '--ran-icon-font-size': '16px',
  '--ran-input-padding': '0px 10px',
};

export const MOBILE_PLUS_ICON_STYLE = {
  '--ran-icon-font-size': '54px',
  '--ran-icon-color': 'var(--icon-color-2)',
  '--ran-icon-margin': '0px',
};

export const MobileHome = (): React.JSX.Element => {
  const [bookList, setBookList] = useState<BookInfo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const searchResultRef = useRef<HTMLDivElement>(null);
  const [searchTitleResult, setSearchTitleResult] = useState<BookInfo[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchAuthorResult, setSearchAuthorResult] = useState<BookInfo[]>([]);
  const [searchContentResult, setSearchContentResult] = useState<SearchResult[]>([]);

  const add = () => {
    addBookByFile().then((res) => {
      bookList.push(res as BookInfo);
      setBookList([...bookList]);
    });
  };

  const addFromUrl = async ({ url, title, image, author }: EnBook) => {
    addBookByUrl({ url, title, image, author }).then((res) => {
      bookList.push(res as BookInfo);
      setBookList([...bookList]);
    });
  };

  const getBooks = () => {
    getAllBooks<BookInfo>()
      .then((res) => {
        if (!res.error) {
          setBookList(res.data);
        } else {
          resumeDB().then(() => {
            getBooks();
          });
        }
      })
      .catch(() => {
        resumeDB().then(() => {
          getBooks();
        });
      });
  };

  const clearSearchResult = () => {
    setSearchTitleResult([]);
    setSearchAuthorResult([]);
    setSearchContentResult([]);
  };

  const onChange = debounce((e: Event) => {
    const value = trim((e.target as HTMLInputElement)?.value || '');
    setSearchValue(value);
    setSearchLoading(true);
    if (!value) {
      setSearchLoading(false);
      return;
    }
    clearSearchResult();
    // 搜索功能
    // 1. 搜索书的标题（分页 3 条）
    // 2. 搜索书的作者（分页 3 条）
    // 3. 搜索书内容（分页 3 条）
    searchBooksByTitle<BookInfo>(value).then((res) => {
      if (!res.error) {
        setSearchTitleResult(res.data);
      }
      setTimeout(() => {
        setSearchLoading(false);
      }, 500);
    });
    searchBooksByAuthor<BookInfo>(value).then((res) => {
      if (!res.error) {
        setSearchAuthorResult(res.data);
      }
      setTimeout(() => {
        setSearchLoading(false);
      }, 500);
    });
    searchBooksByContent<SearchResult>(value).then((res) => {
      if (!res.error) {
        setSearchContentResult(res.data);
      }
      setTimeout(() => {
        setSearchLoading(false);
      }, 500);
    });
  }, 500);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const id = target.getAttribute('item-id');
    if (id) {
      window.location.href = `${ROUTE_PATH.BOOK_DETAIL}?id=${id}`;
    }
  };

  const handleNativeClick = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    const id = target.getAttribute('item-id');
    if (id) {
      window.location.href = `${ROUTE_PATH.BOOK_DETAIL}?id=${id}`;
    }
  };

  useEffect(() => {
    // 默认添加的书籍，只添加一次
    if (!localStorage.getItem(BOOKS_ADD_BY_DEFAULT)) {
      ensampleConfigs.forEach((config: EnBook) => {
        addFromUrl(config);
      });
      localStorage.setItem(BOOKS_ADD_BY_DEFAULT, 'true');
    }
    // 查询所有书籍，进行展示
    getBooks();
    // 监听搜索框的 change 事件
    inputRef.current?.addEventListener('change', onChange);
    searchResultRef.current?.addEventListener('click', handleNativeClick);
    return () => {
      inputRef.current?.removeEventListener('change', onChange);
      searchResultRef.current?.removeEventListener('click', handleNativeClick);
    };
  }, []);

  return (
    <div className="w-full min-h-svh bg-front-bg-color-2">
      <div className="p-5">
        <r-input
          className="w-full h-9 block mx-auto"
          icon="search"
          style={MOBILE_INPUT_STYLE}
          placeholder={t('search')}
          ref={inputRef}
        ></r-input>
      </div>
      {searchValue && (
        <div
          className="w-full transition-all duration-500 overflow-hidden pb-6"
          style={{ height: searchValue ? 'calc(100vh - var(--spacing) * 48)' : '0px' }}
          ref={searchResultRef}
          onClick={handleClick}
        >
          <div className="overflow-y-auto h-full px-5">
            {searchTitleResult.length > 0 && !searchLoading && (
              <div className="block mx-auto bg-front-bg-color-3 rounded-xl mb-6">
                <div>
                  <div className="text-text-color-2 text-base font-medium px-5 py-1.5">{t('ebook')}</div>
                  <div>
                    {searchTitleResult.map((book) => {
                      const { title, author, image } = book;
                      const strList = title.split(searchValue) || [];
                      return (
                        <div
                          className="py-3.5 px-5 flex flex-row flex-nowrap items-center shrink-0 cursor-pointer hover:bg-blue-50 min-h-32"
                          key={book.id + 'title'}
                          item-id={book.id}
                        >
                          {image && <img className="w-16 mr-5" src={image} item-id={book.id} />}
                          <div>
                            <div className="text-lg text-text-color-1 font-medium break-all" item-id={book.id}>
                              {strList.map((item, index) => (
                                <span key={item + index} item-id={book.id}>
                                  {item}
                                  {index === strList.length - 1 ? (
                                    ''
                                  ) : (
                                    <span item-id={book.id} className="text-blue-500">
                                      {searchValue}
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                            <div className="text-base text-text-color-2 font-medium mt-1 break-all" item-id={book.id}>
                              {author}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {searchContentResult.length > 0 && !searchLoading && (
              <div className="block mx-auto bg-front-bg-color-3 rounded-xl py-5">
                <div>
                  <div className="text-text-color-2 text-base font-medium px-5 pb-1.5">
                    {t('search_result_1')} <span className="text-blue-500">{searchValue}</span> {t('search_result_2')} ·{' '}
                    {searchContentResult.length}
                  </div>
                  <div>
                    {searchContentResult.map((book) => {
                      const { title, author, image, matchedText = [] } = book;
                      const [str] = matchedText || [];
                      const strList = str.split(searchValue) || [];
                      return (
                        <div
                          className="py-3.5 px-5 flex flex-row flex-nowrap items-center shrink-0 cursor-pointer hover:bg-blue-50 min-h-32"
                          key={book.id + 'content'}
                          item-id={book.id}
                        >
                          {image && <img className="w-16 mr-5" src={image} item-id={book.id} />}
                          <div>
                            <div className="text-lg text-text-color-1 font-medium break-all" item-id={book.id}>
                              {title}
                            </div>
                            <div className="text-base text-text-color-2 font-medium mt-1 break-all" item-id={book.id}>
                              {author}
                            </div>
                            <div className="text-base text-text-color-2 font-medium mt-1 break-all" item-id={book.id}>
                              {strList.map((item, index) => (
                                <span key={item + index} item-id={book.id}>
                                  {item}
                                  {index === strList.length - 1 ? (
                                    ''
                                  ) : (
                                    <span item-id={book.id} className="text-blue-500">
                                      {searchValue}
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {searchTitleResult.length === 0 &&
              searchAuthorResult.length === 0 &&
              searchContentResult.length === 0 &&
              !searchLoading && (
                <div className="h-full">
                  <div className="flex flex-col items-center justify-center h-full">
                    <r-icon name="without-content" className="text-text-color-2" style={DESKTOP_ICON_STYLE}></r-icon>
                    <div className="text-text-color-2 font-normal text-xl">{t('no_result')}</div>
                  </div>
                </div>
              )}
            {searchLoading && (
              <div className="h-full">
                <div className="flex flex-col items-center justify-center h-full">
                  <r-loading
                    name="circle-fold"
                    className="text-2xl"
                    style={{
                      '--loading-circle-fold-item-before-background': 'var(--brand-blue-color-1)',
                      '--loading-circle-fold-item-after-background': 'var(--brand-blue-color-1)',
                    }}
                  ></r-loading>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {!searchValue && (
        <div className="px-5">
          <div className="flex flex-row flex-wrap justify-start items-center">
            <div className="w-24 h-36 bg-front-bg-color-3 p-5 cursor-pointer justify-center rounded-xl mr-6 items-center flex hover:scale-110 transition-all mt-5">
              <r-icon name="plus" style={MOBILE_PLUS_ICON_STYLE} onClick={add}></r-icon>
            </div>
            {bookList.map((book) => (
              <BookCard book={book} key={book.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
