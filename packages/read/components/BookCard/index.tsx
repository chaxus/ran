import type { BookInfo } from "@/store/books";
interface BookCardProps {
  book: BookInfo
}
export const BookCard = ({ book }: BookCardProps): React.JSX.Element => {
  const { id, image, title = '', author = '' } = book || {};
  const toBookDetail = () => {
    window.location.href = `/book-detail/${id}`;
  }
  return (
    <div onClick={toBookDetail} key={id} className='w-2xs h-40 bg-front-bg-color-3 p-5 cursor-pointer rounded-xl mr-6 items-center flex hover:scale-110 transition-all mt-5'>
      <div className="grow-0">
        {image && <img className='h-28 object-cover mr-5' src={image} alt={title}></img>}
      </div>
      <div className='grow shrink basis-0 min-w-36'>
        <div className='text-text-color-1 font-medium truncate break-all'>{title}</div>
        <div className='text-sm text-text-color-2 mt-2'>{author}</div>
      </div>
    </div>
  )
}
