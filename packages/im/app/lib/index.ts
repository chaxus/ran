import { Writable } from 'node:stream';

export const noop = (): void => {};

export class HtmlWritable extends Writable {
  chunks: Uint8Array[];
  html: string;
  constructor() {
    super();
    this.chunks = [];
    this.html = '';
  }

  getHtml(): string {
    return this.html;
  }

  getFragment(): string {
    return Buffer.concat(this.chunks).toString();
  }

  _write(chunk: Uint8Array, _: string, callback = noop): void {
    this.chunks.push(chunk);
    callback();
  }

  _final(callback = noop): void {
    this.html = Buffer.concat(this.chunks).toString();
    callback();
  }
}

/**
 * @description: Gets the current environment configuration
 * @return {string}
 */
export const getEnv = (): string => {
  const env = process.env.NODE_ENV;
  switch (env) {
    case 'development':
    case 'dev':
    case 'local':
      return 'dev';
    case 'test':
      return 'test';
    case 'staging':
      return 'staging';
    case 'production':
    case 'prod':
      return 'prod';
    default:
      return 'prod';
  }
};
