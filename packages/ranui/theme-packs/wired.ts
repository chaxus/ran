import './wired.less';
import { syncWiredBordersForThemePack } from './wired-overlay';

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => syncWiredBordersForThemePack(), { once: true });
  } else {
    syncWiredBordersForThemePack();
  }
}
