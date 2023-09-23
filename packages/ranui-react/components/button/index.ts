import reactify from '@/utils/reactify';
import 'ranui/button';

interface RButton {
  type?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const Button = reactify('r-button') as React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  RButton;

export default Button;
