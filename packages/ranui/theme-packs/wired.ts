import './wired.less';
import { installWiredThemePackSync } from './wired-overlay';

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => installWiredThemePackSync(), { once: true });
  } else {
    installWiredThemePackSync();
  }
}
