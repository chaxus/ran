import { md5 } from '@/utils/str';

/** Fingerprints of already-injected scripts, so the same code is never evaluated twice */
const loadedScripts = new Set<string>();

export interface LoadScriptOptions {
  /** `'url'` loads via `src`; `'content'` inlines the script text directly */
  type: 'url' | 'content';
  /** The URL when type is `'url'`, the script body when it is `'content'` */
  content: string;
}

/**
 * @description: Inject one script dynamically, de-duplicated by content.
 *
 * How this differs from `scriptOnLoad`: that one loads a batch of URLs at once (routing
 * .css through a link tag), while this one handles a single script, supports an inline body,
 * and **guarantees the same script is evaluated only once** — injecting a third-party SDK
 * twice usually means its initialisation side effects ran twice.
 *
 * The de-duplication key is the md5 of `type + content`, so a URL and an identically named inline script cannot be confused.
 *
 * @param {LoadScriptOptions} options
 * @return {Promise<{ success: boolean }>} rejects with `{ success: false, error }` on failure
 */
export const loadScript = ({ type, content }: LoadScriptOptions): Promise<{ success: boolean }> => {
  return new Promise((resolve, reject) => {
    const scriptKey = md5(`${type}:${content}`);

    // Already loaded — short-circuit rather than inserting a second tag
    if (loadedScripts.has(scriptKey)) {
      resolve({ success: true });
      return;
    }

    const script = document.createElement('script');
    script.onload = function () {
      loadedScripts.add(scriptKey);
      resolve({ success: true });
    };
    script.onerror = function (error) {
      reject({ success: false, error });
    };

    if (type === 'content') {
      script.textContent = content;
      document.body.append(script);
      // An inline script is evaluated synchronously the moment it is appended and never
      // dispatches a load event afterwards. Waiting only on onload would leave this promise
      // pending forever in a real browser (jsdom does dispatch one, so a unit test would not
      // catch it). Returning from append therefore counts as done.
      loadedScripts.add(scriptKey);
      resolve({ success: true });
      return;
    }

    script.src = content;
    document.body.append(script);
  });
};

/**
 * Insert script/link tags dynamically
 * @param {Array | String} url the script/link URLs to load
 * @param {Element} append parent element to insert into, defaults to body
 * @param {Function} callback fired once every script has loaded; the returned promise works too
 */
export const scriptOnLoad = (urls: string[], append?: HTMLElement, callback?: () => void): Promise<void> => {
  urls = Array.isArray(urls) ? urls : [urls];
  const array = urls.map((src) => {
    // Check if the URL ends with .css using string operations instead of regex
    const isCss = src.toLowerCase().endsWith('.css');
    let script: HTMLLinkElement | HTMLScriptElement;
    if (isCss) {
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = src;
      script = link;
    } else {
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
    }
    const bodyElement = document.getElementsByTagName('body')[0];
    const currentAppend = append || bodyElement;
    currentAppend.appendChild(script);
    return new Promise<void>((resolve) => {
      script.onload = () => {
        resolve();
      };
    });
  });

  return new Promise((resolve) => {
    Promise.all(array).then(() => {
      if (callback) {
        // oxlint-disable-next-line promise/no-callback-in-promise
        callback();
      }
      resolve();
    });
  });
};
