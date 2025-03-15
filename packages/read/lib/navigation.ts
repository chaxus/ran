import type { ViewTransition } from '@/types/viewTransition';
import type { NavigationActivation } from '@/types/navigation';
import { ROUTE_PATH } from '@/router';

declare global {
  interface Event {
    viewTransition: ViewTransition;
    activation: NavigationActivation;
  }
}

const setTemporaryViewTransitionNames = async (entries: [HTMLElement, string][], vtPromise: Promise<void>) => {
  for (const [$el, name] of entries) {
    $el.style.viewTransitionName = name;
  }
  await vtPromise;
  for (const [$el] of entries) {
    $el.style.viewTransitionName = '';
  }
};

const isBookDetailPage = (url: URL) => {
  return url.pathname.includes(ROUTE_PATH.BOOK_DETAIL);
};

const extractProfileNameFromUrl = (url: URL) => {
  return url.pathname.split('/').pop();
};

const isHomePage = (url: URL) => {
  return url.pathname.includes(ROUTE_PATH.HOME);
};
// OLD PAGE LOGIC
window.addEventListener('pageswap', async (e: Event) => {
  if (e.viewTransition) {
    const targetUrl = new URL(e.activation?.entry?.url || '');
    // Navigating to a profile page
    if (isBookDetailPage(targetUrl)) {
      const profile = extractProfileNameFromUrl(targetUrl);
      // Set view-transition-name values on the clicked row
      // Clean up after the page got replaced
      const $el: HTMLElement | null = document.querySelector(`#${profile}-swap`);
      if (!$el) return;
      setTemporaryViewTransitionNames([[$el, 'name']], e.viewTransition.finished);
    }
  }
});

// NEW PAGE LOGIC
window.addEventListener('pagereveal', async (e) => {
  if (e.viewTransition) {
    const fromURL = new URL(window.navigation?.activation?.from?.url || '');
    const currentURL = new URL(window.navigation?.activation?.entry?.url || '');
    // Navigating from a profile page back to the homepage
    if (isBookDetailPage(fromURL) && isHomePage(currentURL)) {
      const profile = extractProfileNameFromUrl(currentURL);
      // Set view-transition-name values on the elements in the list
      // Clean up after the snapshots have been taken
      const $el: HTMLElement | null = document.querySelector(`#${profile}-reveal`);
      if (!$el) return;
      setTemporaryViewTransitionNames([[$el, 'name']], e.viewTransition.ready);
    }
  }
});
