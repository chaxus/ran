import { Popover } from '@/components/popover';
import { BookDetailMenu } from '@/components/DetailMenu';
import type { TextSyntaxTree } from '@/pages/book-detail';
import type { BookInfo } from '@/store/books';

export interface BookDetailOperateProps {
  setPageNum?: (num: number) => void;
  textSyntaxTree: TextSyntaxTree;
  bookDetail?: BookInfo;
}

const MENU_ICON_STYLE = {
  '--ran-icon-font-size': '24px',
};

export const BookDetailOperate = ({
  bookDetail,
  setPageNum,
  textSyntaxTree,
}: BookDetailOperateProps): React.JSX.Element => {
  return (
    <div className="absolute top-16 right-22">
      <Popover
        placement="left"
        trigger="click"
        overlay={<BookDetailMenu bookDetail={bookDetail} setPageNum={setPageNum} textSyntaxTree={textSyntaxTree} />}
      >
        <div className="w-12 h-12 bg-front-bg-color-3 rounded-4xl flex items-center justify-center cursor-pointer">
          <r-icon className="hover-icon" name="menu" style={MENU_ICON_STYLE}></r-icon>
        </div>
      </Popover>
    </div>
  );
};
