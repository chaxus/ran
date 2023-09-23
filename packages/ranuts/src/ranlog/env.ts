import { isString } from './utils';
/**
 * @description: Gets the current environment configuration
 * @return {string}
 */
export const getHost = (env?: string): string | undefined => {
  if (typeof window !== 'undefined') {
    let host = '';
    if (env && isString(env)) {
      if (/trunk|neibu|release/.test(env)) {
        host = `.${env}`;
      } else if (/test/.test(env)) {
        host = env;
      } else if (/prod/.test(env)) {
        host = '';
      } else {
        host = '';
      }
    } else {
      const env = /\w(\.trunk|\.neibu|\.release|test)\./.exec(
        window.location.hostname,
      );
      if (env) {
        host = env[1];
      }
    }
    // return host ? `https://log${host}.chaxus.com` : 'https://log.chaxus.com'
    return '//log.chaxus.com';
  }
};
