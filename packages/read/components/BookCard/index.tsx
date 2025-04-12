import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BookInfo } from '@/store/books';
import './index.scss';
import { setCurrentBookDetail, setPageNum, setTextSyntaxTree } from '@/lib/subscribe';
interface BookCardProps {
  book: BookInfo;
}

export const BookCard = ({ book }: BookCardProps): React.JSX.Element => {
  const { id, image, title = '', author = '' } = book || {};
  const navigate = useNavigate();
  const ref = useRef<HTMLAnchorElement>(null);

  const clear = () => {
    setPageNum(0);
    setCurrentBookDetail({});
    setTextSyntaxTree({
      sequences: [],
      totalPage: 0,
      pageText: [],
      pageTitleId: [],
      titleIdTitle: [],
      titleIdPage: {},
    });
  };

  const toDetail = () => {
    clear();
    if (document.startViewTransition) {
      ref.current?.style.setProperty('view-transition-name', `book-info-${id}`);
      document.startViewTransition(() => {
        ref.current?.style.setProperty('view-transition-name', '');
        navigate(`/book-detail/${id}`);
      });
    } else {
      navigate(`/book-detail/${id}`);
    }
  };

  useEffect(() => {
    ref.current?.style.setProperty('view-transition-name', `book-info-${id}`);
  }, []);

  return (
    <a
      ref={ref}
      onClick={toDetail}
      style={{
        viewTransitionName: `book-info-${id}`,
      }}
      className="w-2xs h-40 bg-front-bg-color-3 p-5 cursor-pointer rounded-xl mr-6 items-center flex hover:scale-110 transition-all mt-5"
    >
      <div className="grow-0">{image && <img className="h-28 object-cover mr-5" src={image} alt={title}></img>}</div>
      <div className="grow shrink basis-0 min-w-36">
        <div className="text-text-color-1 font-medium truncate break-all">{title}</div>
        <div className="text-sm text-text-color-2 mt-2">{author}</div>
      </div>
    </a>
  );
};
