import reactify from '@/utils/reactify';
import 'ranui/option'
import 'ranui/style';

interface RPreview {
    value?: string
    sheet?: string
    disabled?: string
    ref?: React.MutableRefObject<HTMLDivElement | null>;
}

const Option = reactify<RPreview>('r-option');

export default Option;
