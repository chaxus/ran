import { handleError } from '@/utils/error';
import { getPerformance } from '@/utils/performance';
import { createData, report, setReportUrl } from '@/utils/report';
import { handleFetchHook, handleXhrHook } from '@/utils/request';
import { handleConsole } from '@/utils/console';
import { throttle } from '@/utils/throttle';
import { handleClick } from '@/utils/behavior';
import { noop } from '@/utils/noop';

export interface Payload {
  payload: Record<string, unknown>;
  type?: string;
}

export interface MonitorOptions {
  /** Telemetry endpoint. Required — without it nothing is sent. */
  url: string;
  /** Cookie holding the user id, included in every envelope */
  userIdCookie?: string;
  /** Minimum interval between beacons, ms. Default 300 */
  throttleMs?: number;
  /** Which channels to instrument. Everything except `console` is on by default. */
  channels?: Partial<Record<MonitorChannel, boolean>>;
}

export type MonitorChannel = 'click' | 'error' | 'fetch' | 'xhr' | 'performance' | 'console';

const DEFAULT_CHANNELS: Record<MonitorChannel, boolean> = {
  click: true,
  error: true,
  fetch: true,
  xhr: true,
  performance: true,
  // Off by default: `handleConsole` patches the global console, and every hooked call is
  // itself reported, so switching it on with a console-logging backend loops forever.
  console: false,
};

/**
 * @description: Front-end telemetry: page-load performance, clicks, errors, fetch/XHR traffic
 * and (optionally) console output, all beaconed to one endpoint.
 *
 * @example
 * ```ts
 * const monitor = new Monitor({ url: 'https://telemetry.example.com/collect' });
 * const stop = monitor.start();
 * monitor.log({ event: 'checkout' }); // manual event
 * // on teardown (HMR, SPA route with a different config, tests)
 * stop();
 * ```
 */
export class Monitor {
  private options: MonitorOptions;
  private teardown: Array<() => void> = [];
  private send: (payload: Payload) => void = noop;

  constructor(options: MonitorOptions) {
    this.options = options;
    setReportUrl({ url: options.url, userIdCookie: options.userIdCookie });
    this.send = throttle((data: Payload) => report(data), options.throttleMs ?? 300);
  }

  /** Whether instrumentation is currently installed */
  get running(): boolean {
    return this.teardown.length > 0;
  }

  /**
   * @description: Install the configured channels. Idempotent — calling it twice does not
   * double-instrument.
   * @return {Function} stop — removes every listener and global patch
   */
  start = (): (() => void) => {
    if (this.running) return this.stop;
    const channels = { ...DEFAULT_CHANNELS, ...this.options.channels };
    if (channels.performance) this.reportPerformance();
    if (channels.click) this.teardown.push(this.reportClick());
    if (channels.error) this.teardown.push(this.reportError());
    if (channels.fetch) this.teardown.push(this.reportFetch());
    if (channels.xhr) this.teardown.push(this.reportXhr());
    if (channels.console) this.teardown.push(this.reportConsole());
    return this.stop;
  };

  /** @description: Remove every listener and restore every patched global */
  stop = (): void => {
    const fns = this.teardown.splice(0, this.teardown.length);
    for (const fn of fns) fn();
  };

  /**
   * Build one event. `createData()` is called **per event**, not once at install time — the
   * old version captured it when the hook was registered, so every later click reported the
   * URL and timestamp of page load rather than of the click.
   */
  private event = (type: string, data: Record<string, unknown>): Payload => ({
    payload: { ...createData(), data, type },
  });

  /** @description: Report a one-off event with the standard envelope */
  log = (payload: Record<string, unknown>): void => {
    this.send({ payload: { ...createData(), ...payload } });
  };

  /** @description: Page-load performance metrics; fires once, so it is not throttled */
  reportPerformance = (): void => {
    report({ payload: { ...getPerformance(), ...createData(), type: 'performance' } });
  };

  /** @description: Click tracking */
  reportClick = (): (() => void) => {
    const hook = (event: MouseEvent): void => {
      const { pageX, pageY, screenX, screenY, type } = event;
      this.send(this.event('click', { pageX, pageY, screenX, screenY, type }));
    };
    return handleClick(hook);
  };

  /** @description: Uncaught errors and unhandled rejections */
  reportError = (): (() => void) => {
    return handleError((...args: unknown[]) => this.send(this.event('error', { ...args })));
  };

  /** @description: fetch traffic */
  reportFetch = (): (() => void) =>
    handleFetchHook({
      requestHook: (...args) => this.send(this.event('fetchRequest', { ...args })),
      responseHook: (...args) => this.send(this.event('fetchResponse', { ...args })),
      errorHook: (...args) => this.send(this.event('fetchError', { ...args })),
    });

  /** @description: XMLHttpRequest traffic */
  reportXhr = (): (() => void) =>
    handleXhrHook({
      requestHook: (...args) => this.send(this.event('xhrRequest', { ...args })),
      responseHook: (...args) => this.send(this.event('xhrResponse', { ...args })),
      errorHook: (...args) => this.send(this.event('xhrError', { ...args })),
    });

  /**
   * @description: console output. Off by default — see `DEFAULT_CHANNELS`; a backend that
   * logs to the console would loop.
   */
  reportConsole = (): (() => void) =>
    handleConsole((...args: unknown[]) => this.send(this.event('console', { ...args })));
}
