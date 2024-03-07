import styles from './global.less?inline';

export * as icon from '@/shadowless/icon';
export * as input from '@/shadowless/input';
export * as select from '@/shadowless/select';

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = styles;
  document.body.appendChild(style);
}
