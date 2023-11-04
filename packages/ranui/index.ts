import styles from './base.less?inline';

export * as button from '@/components/button';
export * as icon from '@/components/icon';
export * as image from '@/components/image';
export * as input from '@/components/input';
export * as message from '@/components/message';
// export * as preview from '@/components/preview';
export * as skeleton from '@/components/skeleton';
export * as tabpane from '@/components/tabpane';
export * as tab from '@/components/tab';
export * as radar from '@/components/radar';
export * as video from '@/components/video';
export * as modal from '@/components/modal';
export * as select from '@/components/select';

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = styles;
  document.body.appendChild(style);
}
