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

/**
 * @description: Make a `<textarea>` grow and shrink with its content, so a long message is
 * readable without an inner scrollbar.
 *
 * Set the ceiling in CSS with `max-height` rather than here — once the element hits it, the
 * measured `scrollHeight` stops growing and the textarea scrolls internally, which is the
 * behaviour you want at the limit.
 *
 * Two details make this work where the naive version does not: the height is reset to `auto`
 * before each measurement (`scrollHeight` never reports *less* than the current height, so
 * without the reset the box could only ever grow), and `box-sizing` decides what the CSS
 * `height` being set is supposed to mean — `scrollHeight` always includes padding and never
 * the border, but `border-box`'s `height` must cover the border too (so it's added back) while
 * `content-box`'s `height` must exclude the padding `scrollHeight` already baked in (so it's
 * subtracted).
 *
 * @param {HTMLTextAreaElement} element the textarea to manage
 * @return {() => void} detaches the listener and restores the inline height
 * @example
 * ```ts
 * const stop = autosizeTextarea(document.querySelector('textarea')!);
 * // later
 * stop();
 * ```
 */
export const autosizeTextarea = (element: HTMLTextAreaElement): (() => void) => {
  const previousHeight = element.style.height;

  // Border widths can come back as a keyword ('medium', 'thin') rather than a length whenever
  // the value has not been resolved against a layout. parseFloat gives NaN for those, and one
  // NaN turns the whole height into an invalid declaration the browser silently drops.
  const px = (value: string): number => {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const resize = (): void => {
    element.style.height = 'auto';
    const style = getComputedStyle(element);
    // `scrollHeight` always includes padding and never the border, regardless
    // of box-sizing. What the `height` we're about to set needs to *mean*
    // does depend on box-sizing though:
    //  - border-box: height must cover border + padding + content, so the
    //    border (the one thing scrollHeight is missing) is added back. This
    //    was inverted — a border-box textarea with a visible border came out
    //    one border-width short and clipped its last line.
    //  - content-box: height must be content only, so the padding
    //    scrollHeight already includes has to be subtracted back out, or a
    //    padded content-box textarea ends up padding-height taller than its
    //    content needs.
    const extra =
      style.boxSizing === 'border-box'
        ? px(style.borderTopWidth) + px(style.borderBottomWidth)
        : -(px(style.paddingTop) + px(style.paddingBottom));
    element.style.height = `${element.scrollHeight + extra}px`;
  };

  element.addEventListener('input', resize);
  resize();

  return (): void => {
    element.removeEventListener('input', resize);
    element.style.height = previousHeight;
  };
};

// The chainable DOM builder now lives in ./chain, so the vnode entry can reuse one
// implementation without pulling in the rest of this file (setFontSize2html would drag in
// utils/device).
export { Chain, create } from './chain';
