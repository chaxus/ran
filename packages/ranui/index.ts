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
export { Form } from '@/components/form';
export { Card } from '@/components/card';
export { Section } from '@/components/section';
export { Router } from '@/components/router';
export { Route } from '@/components/route';
export { Link } from '@/components/link';
export { RouterCore, createRouter, useRouter, enableMpaViewTransitions, setSSGPath, clearSSGPath, getSSGPath } from '@/utils/router';
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
import '@/components/form';
import '@/components/scratch';
import '@/components/card';
import '@/components/section';
import '@/components/router';
import '@/components/route';
import '@/components/link';
