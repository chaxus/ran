import reactify from '@/utils/reactify';
import 'ranui/button';

interface RButton {
  type?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const Button = reactify('r-button')

export default Button;
