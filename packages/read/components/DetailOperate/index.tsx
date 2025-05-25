import { Popover } from '@/components/Popover';
import { BookDetailMenu } from '@/components/DetailMenu';

const MENU_ICON_STYLE = {
  '--ran-icon-font-size': '24px',
};

export const BookDetailOperate = (): React.JSX.Element => {
  return (
    <div className="absolute top-16 right-22">
      <Popover placement="left" trigger="click" overlay={<BookDetailMenu />}>
        <div className="w-12 h-12 bg-front-bg-color-3 rounded-4xl flex items-center justify-center cursor-pointer">
          <r-icon className="hover-icon" name="menu" style={MENU_ICON_STYLE}></r-icon>
        </div>
      </Popover>
    </div>
  );
};

export const MobileBookDetailOperate = (): React.JSX.Element => {
  return (
    <div className="cursor-pointer">
      <Popover placement="top" trigger="click" overlay={<BookDetailMenu />}>
        <div className="bg-front-bg-color-3 rounded-4xl flex items-center justify-center cursor-pointer">
          <r-icon className="hover-icon" name="menu" style={MENU_ICON_STYLE}></r-icon>
        </div>
      </Popover>
    </div>
  );
};
