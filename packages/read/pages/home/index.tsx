import { useEffect, useRef, useState } from 'react';
import { debounce } from 'ranuts/utils';
import { BookCard } from '@/components/BookCard';
import { addBook, getAllBooks } from '@/store/books';
import { checkEncoding, createReader } from '@/lib/transformText';
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
    const value = (e.target as HTMLInputElement).value;
    console.log(value);
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
      <div className="w-full h-72 bg-front-bg-color-2 justify-center items-center flex flex-col">
        {/* <div className='text-5xl mb-7'>Read Book</div> */}
        <r-input className="w-1/2 min-w-2xs h-14 block" icon="search" style={inputStyle} placeholder="搜索" ref={inputRef}></r-input>
      </div>
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
    </div>
  );
};

export default Home;
