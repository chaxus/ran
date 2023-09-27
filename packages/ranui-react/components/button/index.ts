import reactify from '@/utils/reactify';
import 'ranui/button';

interface RButton {
  type?: 'primary' | 'warning' | 'text';
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Button = reactify<RButton>('r-button');

export default Button;
