import { useEffect, useRef, useState } from 'react';
import { debounce } from 'ranuts/utils';
import { BookCard } from '@/components/BookCard';
import { addBook, getAllBooks, searchBooksByAuthor, searchBooksByTitle  } from '@/store/books';
import { checkEncoding, createReader, trim } from '@/lib/transformText';
import { resumeDB } from '@/store';
import { BOOKS_ADD_BY_DEFAULT, ensampleConfigs } from '@/lib/ensample';
import type { EnBook } from '@/lib/ensample';
import type { BookInfo } from '@/store/books';
import 'ranui/input';
import 'ranui/icon';

const inputStyle = {
  '--ran-input-border-radius': '2rem',
  '--ran-input-content-border-radius': '2rem',
  '--ran-input-content-padding': '10px',
  '--ran-input-content-font-size': '16px',
  '--ran-input-content-font-weight': '400',
  '--ran-icon-font-size': '24px',
  '--ran-icon-color': 'var(--icon-color-1)',
  '--ran-icon-margin': '4px 0px 0px 16px',
};
const moreIconStyle = {
  '--ran-icon-font-size': '24px',
  '--ran-icon-color': 'var(--icon-color-1)',
};

const plusIconStyle = {
  '--ran-icon-font-size': '64px',
  '--ran-icon-color': 'var(--icon-color-2)',
  '--ran-icon-margin': '0px',
};

export const Home = (): React.JSX.Element => {
  const [bookList, setBookList] = useState<BookInfo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');


  const add = () => {
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
              bookList.push(res.data as BookInfo);
              setBookList([...bookList]);
            }
          });
        });
      }
    };
  };

  const addFromUrl = async ({ url, title, image, author }: EnBook) => {
    const response = await fetch(url);
    const blob = await response.blob();
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
          bookList.push(res.data as BookInfo);
          setBookList([...bookList]);
        }
      });
    });
  };

  const getBooks = () => {
    getAllBooks<BookInfo>()
      .then((res) => {
        if (!res.error) setBookList(res.data);
      })
      .catch(() => {
        resumeDB().then(() => {
          getBooks();
        });
      });
  };

  const onChange = debounce((e: Event) => {
    const value = trim((e.target as HTMLInputElement)?.value || '');
    setSearchValue(value);
    if (!value) return;
    // 搜索功能
    // 1. 搜索书的标题（分页 3 条）
    // 2. 搜索书的作者（分页 3 条）
    // 3. 搜索书内容（分页 3 条）
    console.log(value);
    searchBooksByTitle<BookInfo>(value).then((res) => {
      if (!res.error) {
        console.log('res title---->', res);
      }
    });
    searchBooksByAuthor<BookInfo>(value).then((res) => {
      if (!res.error) {
        console.log('res author---->', res);
      }
    });
  });

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
    return () => {
      inputRef.current?.removeEventListener('change', onChange);
    };
  }, []);

  return (
    <div>
      <div className="w-full bg-front-bg-color-2">
        {/* <div className='text-5xl mb-7'>Read Book</div> */}
        <div className="w-full min-h-72 pt-28">
          <r-input
            className="w-1/2 min-w-2xs h-14 block mx-auto"
            icon="search"
            style={inputStyle}
            placeholder="搜索"
            ref={inputRef}
          ></r-input>
          <div className="w-full transition-all overflow-hidden mt-6" style={{ height: searchValue ? '100vh' : '0px' }}>
            {/* <r-loading name="circle-fold"></r-loading> */}
            <div className="w-1/2 min-w-2xs block mx-auto bg-front-bg-color-3 rounded-xl px-3.5 py-5">
              <div>
                <div className="text-text-color-2 text-sm font-medium">电子书</div>
                <div>
                  {/* <div className="px-7 py-2 flex flex-row flex-nowrap items-center shrink-0">
                    {bookDetail.image && <img className="w-14 mr-5" src={bookDetail.image} />}
                    <div>
                      <div className="text-lg text-text-color-1 font-medium break-all">{bookDetail.title}</div>
                      <div className="text-sm text-text-color-2 font-medium mt-1 break-all">{bookDetail.author}</div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!searchValue && (
        <div className="w-full bg-front-bg-color-1 min-h-svh">
          <div className="max-w-7xl mx-auto pt-12 flex flex-row justify-between items-center">
            <div className="flex justify-start items-center">
              <div className="cursor-pointer text-text-color-1 text-2xl font-medium">我的书架</div>
              <r-icon className="-rotate-90 cursor-pointer" name="more" style={moreIconStyle}></r-icon>
            </div>
          </div>
          <div className="max-w-7xl mx-auto flex flex-row flex-wrap justify-start items-center">
            {bookList.map((book) => (
              <BookCard book={book} key={book.id} />
            ))}
            <div className="w-2xs h-40 bg-front-bg-color-3 p-5 cursor-pointer justify-center rounded-xl mr-6 items-center flex hover:scale-110 transition-all mt-5">
              <r-icon name="plus" style={plusIconStyle} onClick={add}></r-icon>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
