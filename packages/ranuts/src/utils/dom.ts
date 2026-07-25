import { DEVICE, currentDevice } from '@/utils/device';
/**
 * @description: Add a class to an element
 * @param {Element} element
 * @param {string} addClass
 */
export const addClassToElement = (element: Element, addClass: string): void => {
  if (typeof document === 'undefined') return undefined;
  const classList = element.classList;
  if (!classList.contains(addClass)) {
    classList.add(addClass);
  }
};
/**
 * @description: Remove a class from an element
 * @param {Element} element
 * @param {string} removeClass
 */
export const removeClassToElement = (element: Element, removeClass: string): void => {
  if (typeof document === 'undefined') return undefined;
  const classList = element.classList;
  if (classList.contains(removeClass)) {
    classList.remove(removeClass);
  }
};

/**
 * @description: Create a DocumentFragment
 * @param {Element} list
 * @return {*}
 */
export const createDocumentFragment = (list: Element[]): DocumentFragment | undefined => {
  if (typeof document === 'undefined') return undefined;
  const Fragment = document.createDocumentFragment();
  list.forEach((item) => Fragment.appendChild(item));
  return Fragment;
};

const matchHtmlRegExp = /["'&<>]/;

export function escapeHtml(string?: string | number | null): string {
  const str = '' + string;
  const match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  let escape;
  let html = '';
  let index = 0;
  let lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}
/**
 * @description: Set the root font size from the design mock's width
 * @param {*} void
 * @return {*}
 */
export const setFontSize2html = (designWidth: number = 375): void => {
  let base = designWidth;
  const { documentElement } = document;
  const mediaQuery = window.matchMedia('(orientation: portrait)'); // portrait orientation?
  let timer: string | number | NodeJS.Timeout | undefined;
  let standardRatio = 667 / 375; // design mock aspect ratio
  if (currentDevice() === DEVICE.IPAD) {
    standardRatio = 1024 / 768; // iPad design mock aspect ratio
    base = 768;
  }
  function setFontSize() {
    const isLandscape = !mediaQuery.matches;
    let screenWidth = window.screen.width;
    let screenHeight = window.screen.height;

    if (screenWidth < screenHeight) {
      [screenWidth, screenHeight] = [screenHeight, screenWidth];
    }

    let width = documentElement.clientWidth;
    let height = screenHeight;

    const realRatio = width / height;

    // Base the font size on whichever of width/height is smaller relative to the mock
    if (realRatio >= standardRatio) {
      width = height * standardRatio;
      documentElement.classList.remove('adjustHeight');
      documentElement.classList.add('adjustWidth');
    } else {
      height = width / standardRatio;
      documentElement.classList.remove('adjustWidth');
      documentElement.classList.add('adjustHeight');
    }

    // window.adjustWidth = width;
    // window.adjustHeight = height;
    // fontSize = (adapted width / original width) * initial fontSize
    let target = (width / base) * 16;
    if (isLandscape) {
      target /= standardRatio;
    }
    documentElement.style.fontSize = `${target}px`;
    const currentSize = window.getComputedStyle(documentElement).fontSize.replace('px', '') || 0;
    if (target !== currentSize) {
      documentElement.style.fontSize = `${(target / Number(currentSize)) * target}px`;
    }
  }
  window.addEventListener(
    'resize',
    function () {
      clearTimeout(timer);
      timer = setTimeout(setFontSize, 300);
    },
    !1,
  );
  window.addEventListener(
    'pageshow',
    function (e) {
      if (e.persisted) {
        clearTimeout(timer);
        timer = setTimeout(setFontSize, 300);
      }
    },
    !1,
  );

  window.addEventListener(
    'orientationchange',
    function () {
      console.log('device orientation changed');
      setFontSize();
    },
    false,
  );
  setFontSize();
};

// The chainable DOM builder now lives in ./chain, so the vnode entry can reuse one
// implementation without pulling in the rest of this file (setFontSize2html would drag in
// utils/device).
export { Chain, create } from './chain';
