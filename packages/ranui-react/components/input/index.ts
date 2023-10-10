import reactify from '@/utils/reactify';
import 'ranui/input';

interface RInput {
  onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
  label?: string;
  ref?: React.MutableRefObject<HTMLInputElement | null>;
}

const Input = reactify<RInput>('r-input');

export default Input;
