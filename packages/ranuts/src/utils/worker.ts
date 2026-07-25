/**
 * A request/response wrapper over a Web Worker.
 *
 * A native worker only knows "post a message" and "receive a message" — there is no notion
 * of a request and its response: send two tasks concurrently, get two messages back, and
 * there is no way to tell which is which. The standard fix is to number each request and
 * echo that number in the response; this class packages that correlation logic (ids, a
 * pending table, progress events, rejecting every in-flight request when the worker
 * crashes) into something reusable.
 *
 * It also owns the worker's lifecycle: **the worker is created on the first `send`** (heavy
 * work should not start at page load), and `dispose()` terminates it and rejects in-flight
 * requests; a later `send` rebuilds it.
 */

/** A response must at least echo the request id so the two can be paired */
export interface WorkerResponseBase {
  operationId: number;
  type?: string;
}

export interface WorkerClientOptions<Res extends WorkerResponseBase, Progress> {
  /** How to create the worker, e.g. `() => new Worker(new URL('./my.worker.ts', import.meta.url), { type: 'module' })` */
  create: () => Worker;
  /** Whether this is a progress message — it does not settle the request, it only calls onProgress. Defaults to `type === 'progress'` */
  isProgress?: (response: Res) => boolean;
  /** Extract the progress payload from a progress message. Defaults to `response.progress` */
  getProgress?: (response: Res) => Progress;
  /** Whether this is an error message. Defaults to `type === 'error'` */
  isError?: (response: Res) => boolean;
  /** Error message text. Defaults to `response.message` */
  getErrorMessage?: (response: Res) => string;
  /** Per-request timeout in milliseconds; omit for none. A timeout only rejects that request, it does not terminate the worker */
  timeout?: number;
}

interface Pending<Res, Progress> {
  resolve: (response: Res) => void;
  reject: (error: Error) => void;
  onProgress?: (progress: Progress) => void;
  timer?: ReturnType<typeof setTimeout>;
}

/**
 * @description: A worker client with request ids. The request type `Req` is defined by the
 * caller; the client only fills in `operationId` and routes each response back to the right
 * promise.
 *
 * @example
 * ```ts
 * const client = new WorkerClient<MyRequest, MyResponse, { progress: number }>({
 *   create: () => new Worker(new URL('./nlp.worker.ts', import.meta.url), { type: 'module' }),
 * });
 * const loaded = await client.send({ type: 'load', modelId }, (p) => render(p.progress));
 * client.dispose();
 * ```
 * The worker side only has to echo the `operationId` it received:
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

  /** Whether the worker has been created (it is created on the first `send`) */
  get active(): boolean {
    return this.worker !== null;
  }

  /** Number of in-flight requests */
  get pendingCount(): number {
    return this.pending.size;
  }

  /**
   * @description: Send one request and await its matching response
   * @param {Req} request request body (`operationId` is filled in by the client — do not pass it)
   * @param {Function} onProgress progress callback, fired on progress messages without settling the request
   * @param {Transferable[]} transfer objects whose ownership is transferred (ArrayBuffer and friends, avoiding the structured-clone copy)
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

  /** @description: Terminate the worker and reject every in-flight request; the next `send` rebuilds it */
  dispose = (): void => {
    this.worker?.terminate();
    this.worker = null;
    this.rejectAll(new Error('worker disposed'));
  };

  private getWorker = (): Worker => {
    if (!this.worker) {
      this.worker = this.options.create();
      this.worker.onmessage = (event: MessageEvent<Res>) => this.handleMessage(event.data);
      // An uncaught error inside the worker carries no operationId, so it cannot be
      // attributed to one request — everything in flight has to be rejected.
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
    if (!entry) return; // late response for a timed-out / disposed request — drop it
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
