import type { Button } from '@/components/button';
import type { Icon } from '@/components/icon';
import type { CustomElement as Image } from '@/components/image';
import type { Input } from '@/components/input';
import type { CustomMessage as Message } from '@/components/message';
import type { CustomElement as Skeleton } from '@/components/skeleton';
import type { Tabs } from '@/components/tab';
import type { TabPane } from '@/components/tabpane';
import type { RadarChart as Radar } from '@/components/radar';
import type { RanPlayer as Player } from '@/components/player';
import type { Modal } from '@/components/modal';
import type { Select } from '@/components/select';
import type { Progress } from '@/components/progress';
import type { Checkbox } from '@/components/checkbox';
import type { ColorPicker } from '@/components/colorpicker';
import type { Loading } from '@/components/loading';
import type { Math } from '@/components/math';
import type { Popover } from '@/components/popover';
import type { Content } from '@/components/popover/content';
import type { CustomElement as Form } from '@/components/form';
import type ScratchTicket from '@/components/scratch';
import type { Dropdown } from '@/components/dropdown';
import type { DropdownItem } from '@/components/select/dropdown-item';

declare global {
  interface HTMLElementTagNameMap {
    'r-button': Button;
    'r-icon': Icon;
    'r-img': Image;
    'r-input': Input;
    'r-message': Message;
    'r-skeleton': Skeleton;
    'r-tabs': Tabs;
    'r-tab': TabPane;
    'r-radar': Radar;
    'r-player': Player;
    'r-modal': Modal;
    'r-select': Select;
    'r-progress': Progress;
    'r-checkbox': Checkbox;
    'r-colorpicker': ColorPicker;
    'r-loading': Loading;
    'r-math': Math;
    'r-popover': Popover;
    'r-content': Content;
    'r-form': Form;
    'r-scratch': ScratchTicket;
    'r-dropdown': Dropdown;
    'r-dropdown-item': DropdownItem;
  }
}
