import { replaceOld } from '@/utils/obj';
import { noop } from '@/utils/noop';

export type Hooks = (...args: unknown[]) => void;

export interface Options {
  requestHook: Hooks;
  responseHook: Hooks;
  errorHook: Hooks;
}
/**
 * @description: fetch
 * @param {Partial} options
 */
export const handleFetchHook = (options: Partial<Options> = {}): void => {
  if (typeof window !== 'undefined') {
    const { requestHook = noop, responseHook = noop, errorHook = noop } = options;
    const replacement = (originalFetch: any) => {
      return (url: string, config?: any) => {
        requestHook(url, config);
        return originalFetch
          .apply(window, [url, config])
          .then((response: Response) => {
            responseHook(url, config, response);
            return response;
          })
          .catch((error: Error) => {
            errorHook(url, error);
            throw error;
          });
      };
    };
    replaceOld(window, 'fetch', replacement);
  }
};
/**
 * @description: xhr
 * @param {Partial} options
 * @return {*}
 */
export const handleXhrHook = (options: Partial<Options> = {}): void => {
  if (typeof window !== 'undefined') {
    const originalXhrProto = XMLHttpRequest.prototype;
    const { requestHook = noop, responseHook = noop, errorHook = noop } = options;
    const replacementXhrOpen = (originalOpen: any) => {
      return function (this: XMLHttpRequest, ...args: unknown[]): void {
        requestHook(args);
        originalOpen.apply(this, args);
      };
    };
    replaceOld(originalXhrProto, 'open', replacementXhrOpen);
    const replacementXhrSend = (originalSend: any) => {
      return function (this: any, ...args: any[]): void {
        this.addEventListener('loadend', function (this: unknown) {
          responseHook(this);
        });
        this.addEventListener('error', function (this: unknown) {
          errorHook(this);
        });
        originalSend.apply(this, args);
      };
    };
    replaceOld(originalXhrProto, 'send', replacementXhrSend);
  }
};
