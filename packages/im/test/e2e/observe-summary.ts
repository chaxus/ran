/** Installed in the page: observe only the real summary response, without global stream hooks. */
export function observeSummary(options: { fragmentBytes?: number; readerOnly?: boolean } = {}): void {
  const fetch = window.fetch;
  let received = '';
  const reads: { bytes: number; at: number }[] = [];
  let waiting = false;
  let nativeBytes = 0;
  let pendingBytes = 0;
  Reflect.set(window, '__compactionStreamProbe', () => ({ received, reads, waiting, nativeBytes, pendingBytes }));
  window.fetch = async function (input, init) {
    const response = await fetch.call(this, input, init);
    let summary = false;
    try {
      const body = typeof init?.body === 'string' ? JSON.parse(init.body) : undefined;
      summary = body?.messages?.[0]?.content?.startsWith('下面是一段对话的早期部分') === true;
    } catch {
      // Unrelated requests retain their normal response and error semantics.
    }
    if (!summary || !response.body) return response;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let previous: Uint8Array | undefined;
    let bytes = 0;
    let pending: Uint8Array | undefined;
    let notified = false;
    let closed = false;
    const body = new ReadableStream<Uint8Array>(
      {
        async pull(controller) {
          // With no prefetch, the next pull means the application has processed the
          // previous chunk. A native read alone does not prove the SSE fold accepted it.
          if (previous) {
            received += decoder.decode(previous, { stream: true });
            bytes += previous.byteLength;
            reads.push({ bytes: previous.byteLength, at: performance.now() });
            previous = undefined;
            pendingBytes = 0;
            if (!notified && received.includes('"total_tokens":45}}\n\n')) {
              notified = true;
              void Reflect.get(window, '__summaryConsumed')({ bytes, complete: true }).catch(() => {});
            }
          }
          try {
            if (!pending?.byteLength) {
              waiting = true;
              const chunk = await reader.read();
              waiting = false;
              if (closed) return;
              if (chunk.done) {
                received += decoder.decode();
                reader.releaseLock();
                controller.close();
                return;
              }
              pending = chunk.value;
              nativeBytes += chunk.value.byteLength;
            }
            // Deterministic byte boundaries, independent of TCP coalescing. The
            // native response and application SSE decoder remain in the path.
            const chunk = pending.subarray(0, options.fragmentBytes ?? pending.byteLength);
            pending = pending.subarray(chunk.byteLength);
            previous = chunk;
            pendingBytes = chunk.byteLength;
            controller.enqueue(chunk);
          } catch (error) {
            waiting = false;
            reader.releaseLock();
            throw error;
          }
        },
        async cancel(reason) {
          closed = true;
          try {
            await reader.cancel(reason);
          } finally {
            reader.releaseLock();
          }
        },
      },
      { highWaterMark: 0 },
    );
    if (options.readerOnly) {
      // Exercise the parser's native getReader fallback on this response only.
      Object.defineProperty(body, Symbol.asyncIterator, { value: undefined });
    }
    return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
  };
}
