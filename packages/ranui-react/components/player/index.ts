import reactify from '@/utils/reactify';
import 'ranui/player';
import 'ranui/style';

interface RPreview {
  src?: string | Blob | ArrayBuffer;
  onChange?: any;
  ref?: React.MutableRefObject<HTMLDivElement | null>;
  volume?: string | number;
  currentTime?: string | number;
  playbackRate?: string | number;
}

const Player = reactify<RPreview>('r-player');

export default Player;
