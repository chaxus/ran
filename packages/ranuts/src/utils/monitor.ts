import { handleError } from '@/utils/error';
import { getPerformance } from '@/utils/performance';
import { createData, report } from '@/utils/report';
import { handleFetchHook, handleXhrHook } from '@/utils/request';
import { handleConsole } from '@/utils/console';
import { throttle } from '@/utils/throttle';
import { handleClick } from '@/utils/behavior';

export interface Payload {
  payload: Record<string, unknown>;
  type?: string;
}
export class Monitor {
  constructor() {
    this.initialize();
  }
  /**
   * @description: 页面加载性能上报
   * @param {Payload} param1
   */
  reportPerformance(): void {
    const params = getPerformance();
    const payload = createData();
    report({
      payload: {
        ...params,
        ...payload,
      },
    });
  }
  /**
   * @description: 手动触发的上报
   * @param {Record} payload
   * @param {*} unknown
   */
  log(payload: Record<string, unknown>): void {
    report({ payload });
  }
  /**
   * @description: 点击上报
   * @return {*}
   */
  reportClick(): void {
    const throttleReport = throttle(report);
    const payload = createData();
    const hook = (event: MouseEvent) => {
      const { pageX, pageY, screenX, screenY, type } = event;
      throttleReport({
        payload: {
          ...payload,
          data: { pageX, pageY, screenX, screenY, type },
          type: 'click',
        },
      });
    };
    handleClick(hook);
  }
  // ajax 上报
  reportXhr(): void {
    const throttleReport = throttle(report);
    const payload = createData();
    const requestHook = (...args: unknown[]) => {
      throttleReport({
        payload: { ...payload, data: { ...args }, type: 'xhrRequest' },
      });
    };
    const responseHook = (...args: unknown[]) => {
      throttleReport({
        payload: { ...payload, data: { ...args }, type: 'xhrResponse' },
      });
    };
    const errorHook = (...args: unknown[]) => {
      throttleReport({
        payload: { ...payload, data: { ...args }, type: 'xhrError' },
      });
    };
    handleXhrHook({ requestHook, responseHook, errorHook });
  }
  /**
   * @description: fetch上报
   */
  reportFetch(): void {
    const throttleReport = throttle(report);
    const payload = createData();
    const requestHook = (...args: unknown[]) => {
      throttleReport({
        payload: { ...payload, data: { ...args }, type: 'fetchRequest' },
      });
    };
    const responseHook = (...args: unknown[]) => {
      throttleReport({
        payload: { ...payload, data: { ...args }, type: 'fetchResponse' },
      });
    };
    const errorHook = (...args: unknown[]) => {
      throttleReport({
        payload: { ...payload, data: { ...args }, type: 'fetchError' },
      });
    };
    handleFetchHook({ requestHook, responseHook, errorHook });
  }
  /**
   * @description: 错误上报
   */
  reportError(): void {
    const throttleReport = throttle(report);
    const payload = createData();
    const hook = (...args: unknown[]) => {
      throttleReport({
        payload: { ...payload, data: { ...args }, type: 'error' },
      });
    };
    handleError(hook);
  }
  /**
   * @description: 上报console
   */
  reportConsole(): void {
    const throttleReport = throttle(report);
    const payload = createData();
    const hook = (...args: unknown[]) => {
      throttleReport({
        payload: { ...payload, data: { ...args }, type: 'console' },
      });
    };
    handleConsole(hook);
  }
  init = (): void => {
    this.reportClick();
    this.reportError();
    this.reportFetch();
    this.reportPerformance();
    this.reportXhr();
  };
  initialize(): void {
    if (typeof window !== 'undefined' && !window.ranlog) {
      window.ranlog = true;
      this.init();
    }
    if (typeof process !== 'undefined' && !process.ranlog) {
      process.ranlog = true;
      this.init();
    }
  }
}
