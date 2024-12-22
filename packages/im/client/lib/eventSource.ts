interface RequestOption {
  onopen?: () => void
  onmessage?: (data: string) => void
  onclose?: () => void
  onerror?: (e: Error) => void
}

enum EventSourceStatus {
  CONNECTING,
  OPEN,
  CLOSED,
  ERROR
}

export class EventStreamFetch {
  controller?: AbortController;
  status: EventSourceStatus;
  constructor() {
    this.controller = undefined
    this.status = EventSourceStatus.CLOSED
  }
  // 建立 FETCH-SSE 连接
  public fetchStream = (url: string, body: Record<string, string> = {}): Promise<void> => {
    this.controller = new AbortController()
    const headers = {
      'content-type': 'application/json',
      'Accept': 'text/event-stream',
      'Connection': 'keep-alive',
    }
    return this.fetchEventSource(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: this.controller.signal,
      onopen: () => {
        this.status = EventSourceStatus.OPEN
        console.log('FETCH 连接打开');
      },
      onclose: () => {
        this.status = EventSourceStatus.CLOSED
        console.log('FETCH 连接关闭');
      },
      onmessage: (event) => {
        this.status = EventSourceStatus.CONNECTING
        const data = JSON.parse(event)
        console.log('FETCH 接收到消息：', data);
      },
      onerror: (e) => {
        this.status = EventSourceStatus.ERROR
        console.log(e)
      }
    })
  }
  // 断开 FETCH-SSE 连接
  public close = (): void => {
    if (this.controller) {
      this.status = EventSourceStatus.CLOSED
      this.controller.abort()
      this.controller = undefined
    }
  }
  private fetchEventSource = (url: string, options: RequestOption & RequestInit): Promise<void> => {
    return fetch(url, options)
      .then(response => {
        if (response.status === 200) {
          options.onopen && options.onopen()
          return response.body
        }
      })
      .then(rb => {
        // eslint-disable-next-line n/no-unsupported-features/node-builtins
        const reader = rb?.pipeThrough(new TextDecoderStream()).getReader()
        const push = (): Promise<void> | undefined => {
          // done 为数据流是否接收完成，boolean
          // value 为返回数据，Uint8Array
          return reader?.read().then(({ done, value }) => {
            if (done) {
              options.onclose && options.onclose()
              return
            }
            options.onmessage && options.onmessage(value)
            // 持续读取流信息
            return push()
          })
        }
        // 开始读取流信息
        return push()
      })
      .catch((e) => {
        options.onerror && options.onerror(e)
      })
  }
}


export class EventStreamSource {
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  eventSource?: EventSource;
  status: EventSourceStatus;
  constructor() {
    this.status = EventSourceStatus.CLOSED
  }
  // 建立 SSE 连接
  public connectSSE = (url: string): void => {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    this.eventSource = new EventSource(url)
    this.eventSource.onopen = () => {
      this.status = EventSourceStatus.OPEN
      console.log('SSE 连接打开');
    }
    this.eventSource.onerror = () => {
      this.status = EventSourceStatus.ERROR
      console.log('SSE 连接错误');
    }
    this.eventSource.onmessage = (event) => {
      this.status = EventSourceStatus.CONNECTING
      const data = JSON.parse(event.data)
      console.log('SSE 接收到消息：', data);
    }
  }

  // 断开 SSE 连接
  public closeSSE = (): void => {
    this.status = EventSourceStatus.CLOSED
    this.eventSource?.close()
  }
}
