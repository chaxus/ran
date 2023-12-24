import reactify from '@/utils/reactify';
import 'ranui/player';
import 'ranui/style';

interface RPlayer {
  src?: string | Blob | ArrayBuffer;
  onChange?: any;
  ref?: React.MutableRefObject<HTMLDivElement | null>;
  volume?: string | number;
  currentTime?: string | number;
  playbackRate?: string | number;
}

const Player = reactify<RPlayer>('r-player');

export default Player;
