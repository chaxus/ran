import reactify from '@/utils/reactify';
import 'ranui/select';
import 'ranui/style';

interface TypeSelect {
  value?: string | Blob | ArrayBuffer;
  defaultValue?: string | number;
  showSearch?: string | number;
  type?: string | number;
  placement?: string | number;
  getPopupContainerId?: string;
  dropdownclass?: string;
  action?: string;
  sheet?: string;
  disabled?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  onChange?: React.MouseEventHandler<HTMLDivElement> | undefined;
  ref?: React.MutableRefObject<HTMLDivElement | null>;
}

const Select = reactify<TypeSelect>('r-select');

export default Select;
