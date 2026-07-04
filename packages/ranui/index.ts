export { setTheme, getTheme, setThemeToken, clearThemeToken, setThemeTokens, initTheme } from '@/utils/theme';
export type { RanThemeName, ThemeTarget, ThemeTokenMap } from '@/utils/theme';
export { Button } from '@/components/button';
export { Icon, registerIcon, registerIcons } from '@/components/icon';
export { ImageElement } from '@/components/image';
export { Input } from '@/components/input';
export { CustomMessage } from '@/components/message';
export { Skeleton } from '@/components/skeleton';
export { TabPane } from '@/components/tabpane';
export { Tabs } from '@/components/tab';
export { RadarChart } from '@/components/radar';
export { default as RanPlayer } from '@/components/player';
export { default as RanModal } from '@/components/modal';
export { Select } from '@/components/select';
export { Progress } from '@/components/progress';
export { default as RanCheckbox } from '@/components/checkbox';
export { default as RanColorPicker } from '@/components/colorpicker';
export { ICON_NAME_AMP, Loading } from '@/components/loading';
export { Math } from '@/components/math';
export { PLACEMENT_TYPE, Popover } from '@/components/popover';
export type { PlacementDirection } from '@/components/popover';
export { ARROW_TYPE, Dropdown } from '@/components/dropdown';
export { Form } from '@/components/form';
export { Card } from '@/components/card';
export { Section } from '@/components/section';
export { Router } from '@/components/router';
export { Route } from '@/components/route';
export { Link } from '@/components/link';
export {
  RouterCore,
  createRouter,
  useRouter,
  enableMpaViewTransitions,
  setSSGPath,
  clearSSGPath,
  getSSGPath,
} from '@/utils/router';
export type {
  RouterConfig,
  RouteConfig,
  RouteLocation,
  NavigationGuard,
  RouteChangeHandler,
  ViewTransitionMode,
  PageSwapEvent,
  PageRevealEvent,
} from '@/utils/router';
export { renderStaticPage, generateStaticPages } from '@/utils/ssg';
export type { SSGPage } from '@/utils/ssg';
export { I18nCore, createI18n, useI18n } from '@/utils/i18n';
export type { I18nConfig, MessageDict, LocaleMessages, TranslateParams, LocaleChangeHandler } from '@/utils/i18n';

// Side effects for registration
import '@/components/button';
import '@/components/icon';
import '@/components/image';
import '@/components/input';
import '@/components/message';
import '@/components/skeleton';
import '@/components/tabpane';
import '@/components/tab';
import '@/components/radar';
import '@/components/player';
import '@/components/modal';
import '@/components/select';
import '@/components/progress';
import '@/components/checkbox';
import '@/components/colorpicker';
import '@/components/loading';
import '@/components/math';
import '@/components/popover';
import '@/components/dropdown';
import '@/components/form';
import '@/components/scratch';
import '@/components/card';
import '@/components/section';
import '@/components/router';
import '@/components/route';
import '@/components/link';

// ── Typed custom elements ───────────────────────────────────────────────────
// Augment the DOM tag map so `document.querySelector('r-select')` and
// `document.createElement('r-input')` are typed as the component class — no
// `as` casts needed to read `.value` and other component properties.
import type { Button as TButton } from '@/components/button';
import type { Icon as TIcon } from '@/components/icon';
import type { ImageElement as TImage } from '@/components/image';
import type { Input as TInput } from '@/components/input';
import type { CustomMessage as TMessage } from '@/components/message';
import type { Skeleton as TSkeleton } from '@/components/skeleton';
import type { TabPane as TTabPane } from '@/components/tabpane';
import type { Tabs as TTabs } from '@/components/tab';
import type { RadarChart as TRadar } from '@/components/radar';
import type { RanPlayer as TPlayer } from '@/components/player';
import type TModal from '@/components/modal';
import type { Select as TSelect } from '@/components/select';
import type { Progress as TProgress } from '@/components/progress';
import type TCheckbox from '@/components/checkbox';
import type TColorPicker from '@/components/colorpicker';
import type { Loading as TLoading } from '@/components/loading';
import type { Math as TMath } from '@/components/math';
import type { Popover as TPopover } from '@/components/popover';
import type { Dropdown as TDropdown } from '@/components/dropdown';
import type { Form as TForm } from '@/components/form';
import type { Card as TCard } from '@/components/card';
import type { Section as TSection } from '@/components/section';
import type { Router as TRouter } from '@/components/router';
import type { Route as TRoute } from '@/components/route';
import type { Link as TLink } from '@/components/link';

declare global {
  interface HTMLElementTagNameMap {
    'r-button': TButton;
    'r-icon': TIcon;
    'r-img': TImage;
    'r-input': TInput;
    'r-message': TMessage;
    'r-skeleton': TSkeleton;
    'r-tab': TTabPane;
    'r-tabs': TTabs;
    'r-radar': TRadar;
    'r-player': TPlayer;
    'r-modal': TModal;
    'r-select': TSelect;
    'r-progress': TProgress;
    'r-checkbox': TCheckbox;
    'r-colorpicker': TColorPicker;
    'r-loading': TLoading;
    'r-math': TMath;
    'r-popover': TPopover;
    'r-dropdown': TDropdown;
    'r-form': TForm;
    'r-card': TCard;
    'r-section': TSection;
    'r-router': TRouter;
    'r-route': TRoute;
    'r-link': TLink;
  }
}
