import reactify from '@/utils/reactify';
import 'ranui/preview';
import 'ranui/style';

interface RPreview {
  src?: string | Blob | ArrayBuffer;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  ref?: React.MutableRefObject<HTMLDivElement | null>;
}

const Preview = reactify<RPreview>('r-preview');

export default Preview;
