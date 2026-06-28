// Registered as the very first import in the demo entry so the demo's icons are
// in the registry before any component module loads and before r-router renders
// route content. Otherwise an r-icon can connect after another component (e.g.
// r-message) has flipped the registry's "registration started" flag but before
// these icons are registered, producing spurious "icon not registered" warnings.
import home from '@/assets/icons/home.svg?raw';
import setting from '@/assets/icons/setting.svg?raw';
import loading from '@/assets/icons/loading.svg?raw';
import lock from '@/assets/icons/lock.svg?raw';
import search from '@/assets/icons/search.svg?raw';
import github from '@/assets/icons/github.svg?raw';
import issue from '@/assets/icons/issue.svg?raw';
import globe from '@/assets/icons/globe.svg?raw';
import { registerIcons } from '@/components/icon';

registerIcons({ home, setting, loading, lock, search, github, issue, globe });
