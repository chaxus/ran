import styles from './global.less?inline';

export * as button from '@/components/button';
export * as icon from '@/components/icon';
export * as image from '@/components/image';
export * as input from '@/components/input';
export * as message from '@/components/message';
export * as preview from '@/components/preview';
export * as skeleton from '@/components/skeleton';
export * as tabpane from '@/components/tabpane';
export * as tab from '@/components/tab';
export * as radar from '@/components/radar';
export * as player from '@/components/player';
export * as modal from '@/components/modal';
export * as select from '@/components/select';
export * as selectShadowless from '@/shadowless/select';
export * as progress from '@/components/progress';
export * as checkbox from '@/components/checkbox';
export * as colorpicker from '@/components/colorpicker';
export * as popover from '@/components/popover';
export * as content from '@/components/content';

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = styles;
  document.body.appendChild(style);
}
