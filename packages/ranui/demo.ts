import arrowDown from './assets/icons/arrow-down.svg?raw';
import home from './assets/icons/home.svg?raw';
import loading from './assets/icons/loading.svg?raw';
import lock from './assets/icons/lock.svg?raw';
import setting from './assets/icons/setting.svg?raw';
import { registerIcons } from './components/icon/index';

registerIcons({
  'arrow-down': arrowDown,
  home,
  loading,
  lock,
  setting,
});

// Register icons first, then bootstrap all components/examples.
import('./index');
