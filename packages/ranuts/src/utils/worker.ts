/**
 * Web Worker 的请求/响应封装。
 *
 * 原生 worker 只有「发消息」和「收消息」，没有请求 - 响应的概念：并发发两个任务回来两条消息，
 * 分不清哪条对应哪个。业界通行解法是给每条请求编号、响应带回同一个编号——这个类把这套
 * 关联逻辑（编号、pending 表、进度事件、worker 崩溃时拒绝全部在途请求）做成通用件。
 *
 * 同时管 worker 的生命周期：**首次 send 才创建 worker**（重活不该在页面加载时就起），
 * `dispose()` 终止并拒绝在途请求，之后再 send 会重建。
 */

/** 响应至少要带回请求编号，才能与请求配对 */
export interface WorkerResponseBase {
  operationId: number;
  type?: string;
}

export interface WorkerClientOptions<Res extends WorkerResponseBase, Progress> {
  /** 如何创建 worker，例如 `() => new Worker(new URL('./my.worker.ts', import.meta.url), { type: 'module' })` */
  create: () => Worker;
  /** 是否为「进度」消息——不结束请求，只回调 onProgress。默认 `type === 'progress'` */
  isProgress?: (response: Res) => boolean;
  /** 从进度消息里取出进度负载。默认取 `response.progress` */
  getProgress?: (response: Res) => Progress;
  /** 是否为错误消息。默认 `type === 'error'` */
  isError?: (response: Res) => boolean;
  /** 错误消息文案。默认取 `response.message` */
  getErrorMessage?: (response: Res) => string;
  /** 单个请求的超时（毫秒）；省略即不超时。超时只拒绝该请求，不终止 worker */
  timeout?: number;
}

interface Pending<Res, Progress> {
  resolve: (response: Res) => void;
  reject: (error: Error) => void;
  onProgress?: (progress: Progress) => void;
  timer?: ReturnType<typeof setTimeout>;
}

/**
 * @description: 带请求编号的 Worker 客户端。请求类型 `Req` 由调用方定义，客户端只负责
 * 补上 `operationId` 并把响应路由回对应的 promise。
 *
 * @example
 * ```ts
 * const client = new WorkerClient<MyRequest, MyResponse, { progress: number }>({
 *   create: () => new Worker(new URL('./nlp.worker.ts', import.meta.url), { type: 'module' }),
 * });
 * const loaded = await client.send({ type: 'load', modelId }, (p) => render(p.progress));
 * client.dispose();
 * ```
 * worker 侧只需把收到的 `operationId` 原样带回：
 * ```ts
 * self.onmessage = ({ data }) => self.postMessage({ operationId: data.operationId, type: 'result', ... });
 * ```
 */
export class WorkerClient<Req extends object, Res extends WorkerResponseBase, Progress = unknown> {
  private worker: Worker | null = null;
  private nextOperationId = 1;
  private pending = new Map<number, Pending<Res, Progress>>();
  private options: WorkerClientOptions<Res, Progress>;

  constructor(options: WorkerClientOptions<Res, Progress>) {
    this.options = options;
  }

  /** worker 是否已创建（首次 send 时才创建） */
  get active(): boolean {
    return this.worker !== null;
  }

  /** 在途请求数 */
  get pendingCount(): number {
    return this.pending.size;
  }

  /**
   * @description: 发一条请求，等它对应的响应
   * @param {Req} request 请求体（`operationId` 由客户端补上，不要自己传）
   * @param {Function} onProgress 进度回调，收到进度消息时触发，不结束请求
   * @param {Transferable[]} transfer 需要转移所有权的对象（ArrayBuffer 等，避免结构化克隆的拷贝开销）
   * @return {Promise<Res>}
   */
  send = (request: Req, onProgress?: (progress: Progress) => void, transfer?: Transferable[]): Promise<Res> => {
    const operationId = this.nextOperationId++;
    return new Promise<Res>((resolve, reject) => {
      const entry: Pending<Res, Progress> = { resolve, reject, onProgress };
      if (this.options.timeout) {
        entry.timer = setTimeout(() => {
          this.pending.delete(operationId);
          reject(new Error(`worker request timed out after ${this.options.timeout}ms`));
        }, this.options.timeout);
      }
      this.pending.set(operationId, entry);
      try {
        this.getWorker().postMessage({ ...request, operationId }, transfer ?? []);
      } catch (e) {
        this.settle(operationId);
        reject(e instanceof Error ? e : new Error(String(e)));
      }
    });
  };

  /** @description: 终止 worker 并拒绝所有在途请求；下次 send 会重建 */
  dispose = (): void => {
    this.worker?.terminate();
    this.worker = null;
    this.rejectAll(new Error('worker disposed'));
  };

  private getWorker = (): Worker => {
    if (!this.worker) {
      this.worker = this.options.create();
      this.worker.onmessage = (event: MessageEvent<Res>) => this.handleMessage(event.data);
      // worker 内的未捕获错误不带 operationId，无法归属到某条请求，只能整体拒绝。
      this.worker.onerror = (event: ErrorEvent) => this.rejectAll(new Error(event.message || 'worker crashed'));
    }
    return this.worker;
  };

  private settle = (operationId: number): Pending<Res, Progress> | undefined => {
    const entry = this.pending.get(operationId);
    if (entry?.timer) clearTimeout(entry.timer);
    this.pending.delete(operationId);
    return entry;
  };

  private handleMessage = (response: Res): void => {
    const entry = this.pending.get(response.operationId);
    if (!entry) return; // 已超时/已 dispose 的请求，迟到的响应直接丢弃
    const { isProgress, getProgress, isError, getErrorMessage } = this.options;
    if (isProgress ? isProgress(response) : response.type === 'progress') {
      const progress = getProgress
        ? getProgress(response)
        : ((response as unknown as { progress: Progress }).progress as Progress);
      entry.onProgress?.(progress);
      return;
    }
    this.settle(response.operationId);
    if (isError ? isError(response) : response.type === 'error') {
      const message = getErrorMessage
        ? getErrorMessage(response)
        : (response as unknown as { message?: string }).message;
      entry.reject(new Error(message || 'worker error'));
    } else {
      entry.resolve(response);
    }
  };

  private rejectAll = (error: Error): void => {
    for (const [operationId, entry] of this.pending) {
      if (entry.timer) clearTimeout(entry.timer);
      entry.reject(error);
      this.pending.delete(operationId);
    }
  };
}
