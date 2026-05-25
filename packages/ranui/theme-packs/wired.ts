import './wired.less';
import { activateWiredBorders } from './wired-overlay';

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activateWiredBorders, { once: true });
  } else {
    activateWiredBorders();
  }
}
