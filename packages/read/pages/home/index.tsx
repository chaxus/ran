import 'ranui/input'
import 'ranui/icon'
import jschardet from 'jschardet';
import { BookCard } from '@/components/BookCard'
import { addBook } from '@/store/books';

const inputStyle = {
  '--ran-input-border-radius': '2rem',
  '--ran-input-content-border-radius': '2rem',
  '--ran-input-content-padding': '10px',
  '--ran-input-content-font-size': '16px',
  '--ran-input-content-font-weight': '400',
  '--ran-icon-font-size': '24px',
  '--ran-icon-color': '#8c8c8c',
  '--ran-icon-margin': '4px 0px 0px 16px',
}
const moreIconStyle = {
  '--ran-icon-font-size': '24px',
  '--ran-icon-color': '#8c8c8c',
}

const plusIconStyle = {
  '--ran-icon-font-size': '64px',
  '--ran-icon-color': '#bfbfbf',
  '--ran-icon-margin': '0px',
}

const createReader = (file: File): Promise<string | ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result);
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.onabort = (abort) => {
      reject(abort);
    };
  });
};

export const Home = (): React.JSX.Element => {

  const bookList = [
    {
      id: 1,
      title: '金字塔原理（麦肯锡 40 年经典培训教材）',
      image: 'https://wfqqreader-1252317822.image.myqcloud.com/cover/333/834333/t6_834333.jpg',
      author: '[美] 芭芭拉·明托'
    },
    {
      id: 2,
      title: '金字塔原理（麦肯锡 40 年经典培训教材）',
      image: 'https://wfqqreader-1252317822.image.myqcloud.com/cover/333/834333/t6_834333.jpg',
      author: '[美] 芭芭拉·明托'
    },
    {
      id: 3,
      title: '金字塔原理（麦肯锡 40 年经典培训教材）',
      image: 'https://wfqqreader-1252317822.image.myqcloud.com/cover/333/834333/t6_834333.jpg',
      author: '[美] 芭芭拉·明托'
    },

  ]

  const add = () => {
    console.log('add')
    const uploadFile = document.createElement('input');
    uploadFile.setAttribute('type', 'file');
    uploadFile.click();
    uploadFile.onchange = () => {
      const { files = [] } = uploadFile;
      if (files && files?.length > 0) {
        const file = files[0];
        createReader(file).then((result) => {
          if (result instanceof ArrayBuffer) {
            const uint8Array = new Uint8Array(result);
            const asciiString = String.fromCharCode.apply(null, uint8Array as unknown as number[]);
            const detected = jschardet.detect(asciiString);
            const encoding = detected.encoding || 'utf-8';
            const text = new TextDecoder(encoding).decode(result);
            if(detected.encoding && text){
              addBook({
                title: file.name,
                encoding: detected.encoding,
                content: text,
              })
            }
          } else {
            console.error('Unexpected result type:', typeof result);
          }
        });
      }
    };
  }

  return (
    <div>
      <div className="w-full h-72 bg-front-bg-color-2 justify-center items-center flex flex-col">
        <div className='text-5xl mb-7'>Read Book</div>
        <r-input className="w-1/2 min-w-2xs h-14 block" icon="search" style={inputStyle} placeholder="搜索"></r-input>
      </div>
      <div className="w-full bg-front-bg-color-1 min-h-svh">
        <div className='max-w-7xl mx-auto pt-12 flex flex-row justify-between items-center'>
          <div className='flex justify-start items-center'>
            <div className='cursor-pointer text-text-color-1 text-2xl font-medium'>我的书架</div>
            <r-icon className="-rotate-90 cursor-pointer" name="more" style={moreIconStyle}></r-icon>
          </div>
        </div>
        <div className='max-w-7xl mx-auto flex flex-row flex-wrap justify-start items-center'>
          {bookList.map((book) => <BookCard book={book} key={book.id} />)}
          <div className='w-2xs h-40 bg-front-bg-color-3 p-5 cursor-pointer justify-center rounded-xl mr-6 items-center flex hover:scale-110 transition-all mt-5'>
            <r-icon name="plus" style={plusIconStyle} onClick={add}></r-icon>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
