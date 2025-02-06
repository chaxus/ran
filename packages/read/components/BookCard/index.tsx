interface BookCardProps {
  book: {
    id: string | number;
    image: string;
    title: string;
    author: string;
  }
}
export const BookCard = ({ book }: BookCardProps): React.JSX.Element => {
  const { id, image, title, author } = book || {};
  return (
    <div key={id} className='w-2xs h-40 bg-front-bg-color-3 p-5 cursor-pointer rounded-xl mr-6 items-center flex hover:scale-110 transition-all mt-5'>
      <div>
        <img className='w-24 h-28 object-cover' src={image} alt={title}></img>
      </div>
      <div className='ml-5 grow shrink basis-0 w-36'>
        <div className='text-text-color-1 font-medium truncate break-all w-36'>{title}</div>
        <div className='text-sm text-text-color-2 mt-2'>{author}</div>
      </div>
    </div>
  )
}
