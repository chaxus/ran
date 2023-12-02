import reactify from '@/utils/reactify';
import 'ranui/progress'
import 'ranui/style';

interface RPreview {
  src?: string | Blob | ArrayBuffer;
  percent?: string | number;
  total?: string | number;
  type?: string | number;
  animation?: string | number;
  dot?: string | boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  ref?: React.MutableRefObject<HTMLDivElement | null>;
}

const Progress = reactify<RPreview>('r-progress');

export default Progress;
