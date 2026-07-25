/**
 * Cross-context messaging: a request/response bridge over `postMessage`.
 *
 * Three layers, smallest first:
 *
 * - **`PostMessageBridge`** — request/response between two windows (page ↔ iframe, opener ↔
 *   popup). Correlates replies by id, isolates unrelated bridges by channel, and refuses to
 *   answer its own requests.
 * - **`BridgeManager` / `Client` / `Platform`** — a singleton registry on top of it, so app
 *   code can `Client.callTo(...)` without threading a bridge instance everywhere.
 * - **`PortBridge`** — the same request/response shape over a `MessagePort`, for a private
 *   channel that does not broadcast to every listener on the window.
 *
 * Split out of `bom.ts`, which had grown to mix URL, cookie, canvas and network helpers with
 * this ~600-line subsystem. Everything is re-exported from `ranuts/utils`, so importing code
 * is unaffected.
 */
import { getRandomString } from './str';
import { isFunction } from './func';

// #region Bridge start

export interface MessageHandler<T = unknown, R = unknown> {
  (payload: T): Promise<R> | R;
}

export interface MessageData<T = unknown> {
  type: string;
  payload: T;
  id?: string;
  isResponse?: boolean;
  isError?: boolean;
  /** Channel id, isolating several bridges on one window (defaults to DEFAULT_CHANNEL) */
  channel?: string;
  /** Sender instance id, so a bridge never answers its own request */
  senderId?: string;
}

export interface PendingRequest<R = unknown> {
  resolve: (value: R) => void;
  reject: (error: unknown) => void;
}

const DEFAULT_TIMEOUT = 120000;
// Protocol marker: only messages carrying it are handled, which is what separates this
// traffic from every other library's postMessage on the page (HMR, DevTools, third-party
// SDKs). Exported so manual interop and tests can match the protocol.
export const BRIDGE_MARKER = '__ranuts_bridge__';
// Default channel: both ends land here when no channel is given, preserving the old behaviour.
export const DEFAULT_CHANNEL = 'default';
// Allowlist
// const whiteList = ['localhost', '127.0.0.1', 'chaxus.github.io']

/** The envelope sent over the wire: MessageData plus the protocol marker */
interface BridgeEnvelope<T = unknown> extends MessageData<T> {
  __bridge: string;
}

/**
 * Global dispatcher: every PostMessageBridge shares **one** window 'message' listener, which
 * then fans events out to the individual bridges. This avoids N bridges meaning N listeners
 * with each message handled N times. The listener is installed when the first bridge
 * registers and removed when the last one unregisters.
 */
class BridgeDispatcher {
  private bridges = new Set<PostMessageBridge>();
  // Track which window currently holds the listener (rather than a boolean), so it can be reinstalled when the window changes.
  private attachedWindow: Window | null = null;

  private handleMessage = (event: MessageEvent): void => {
    // Copy to an array, so a bridge destroying itself inside receive cannot mutate the set being iterated.
    for (const bridge of Array.from(this.bridges)) {
      bridge.receive(event);
    }
  };

  add(bridge: PostMessageBridge): void {
    this.bridges.add(bridge);
    if (typeof window !== 'undefined' && this.attachedWindow !== window) {
      window.addEventListener('message', this.handleMessage);
      this.attachedWindow = window;
    }
  }

  remove(bridge: PostMessageBridge): void {
    this.bridges.delete(bridge);
    if (this.bridges.size === 0 && this.attachedWindow) {
      this.attachedWindow.removeEventListener('message', this.handleMessage);
      this.attachedWindow = null;
    }
  }
}

const bridgeDispatcher = new BridgeDispatcher();

/**
 * Bridge registration event, consumed by the client
 */

export class PostMessageBridge {
  private targetWindow: Window;
  private targetOrigin: string;
  private messageHandlers: Map<string, MessageHandler<any, any>>;
  private pendingRequests: Map<string, PendingRequest<any>>;
  // Channel id, telling bridges on one window apart. It defaults to DEFAULT_CHANNEL, so
  // omitting the channel on both ends behaves exactly as it used to.
  private channel: string;
  // This instance's unique id, so it never handles a request it sent itself.
  private senderId: string;
  // Whether a usable browser environment (a window) is present. Outside one (node/SSR) the
  // instance degrades to a no-op rather than throwing on construction.
  private available: boolean;

  constructor(targetWindow?: Window, targetOrigin = '*', channel: string = DEFAULT_CHANNEL) {
    this.targetOrigin = targetOrigin;
    this.channel = channel;
    this.senderId = getRandomString(12);
    this.messageHandlers = new Map();
    this.pendingRequests = new Map();
    this.available = typeof window !== 'undefined';
    if (!this.available) {
      // No window: the bridge is unusable, so keep an inert instance and degrade every operation.
      this.targetWindow = undefined as unknown as Window;
      return;
    }
    this.targetWindow = targetWindow ?? window;
    // Register with the shared dispatcher instead of calling addEventListener individually.
    bridgeDispatcher.add(this);
  }

  // Send the object directly via structured clone (postMessage's own mechanism), stamped
  // with the protocol marker, the channel and the sender id. No base64/JSON step, so
  // Date/Map/Set/ArrayBuffer survive and nothing is encoded twice.
  private post(target: Window, data: MessageData): void {
    const envelope: BridgeEnvelope = {
      ...data,
      __bridge: BRIDGE_MARKER,
      channel: this.channel,
      senderId: this.senderId,
    };
    target.postMessage(envelope, this.targetOrigin);
  }

  // Called by the shared dispatcher to handle one window message event.
  // @internal — not meant to be called from outside.
  receive = (event: MessageEvent): void => {
    if (!this.available) return;
    // const hostname = new URL(event.origin).hostname
    // if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin && !whiteList.includes(hostname)) return
    if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) return;

    // Check the source window so different windows cannot cross-talk. A null event.source is not filtered.
    if (event.source && event.source !== this.targetWindow) return;

    const data = event.data as BridgeEnvelope | undefined;
    // Protocol-marker filter: traffic that is not ours (another library's postMessage) is
    // ignored outright — nothing decoded, nothing logged.
    if (!data || typeof data !== 'object' || data.__bridge !== BRIDGE_MARKER) return;
    // Channel isolation: only this channel's messages are handled, so several bridges on one window do not cross-talk.
    if ((data.channel ?? DEFAULT_CHANNEL) !== this.channel) return;

    const { type, payload, id, isResponse, isError, senderId } = data;

    // Response messages
    if (isResponse && id) {
      const pendingRequest = this.pendingRequests.get(id);
      if (pendingRequest) {
        // A remote handler that threw sends back isError, which must reject rather than
        // resolve — otherwise the caller treats the error message as a normal result.
        if (isError) {
          pendingRequest.reject(new Error(typeof payload === 'string' ? payload : 'Bridge request failed'));
        } else {
          pendingRequest.resolve(payload);
        }
        this.pendingRequests.delete(id);
      }
      return;
    }

    // Self-answer guard: a bridge never handles a request it sent. For request/response
    // within one window use two bridge instances — differing senderIds are enough.
    if (senderId && senderId === this.senderId) return;

    // Ordinary messages
    if (typeof type !== 'string' || !this.messageHandlers.has(type)) return;
    const handler = this.messageHandlers.get(type);
    if (isFunction(handler)) {
      // Reply to where the message actually came from rather than the fixed targetWindow,
      // so a mismatch between the two cannot send the response to the wrong window.
      const replyWindow = (event.source as Window | null) ?? this.targetWindow;
      Promise.resolve(handler(payload))
        .then((response) => {
          if (id) this.post(replyWindow, { type, payload: response, id, isResponse: true });
        })
        .catch((error) => {
          if (id) {
            this.post(replyWindow, {
              type,
              payload: error instanceof Error ? error.message : String(error),
              id,
              isResponse: true,
              isError: true,
            });
          }
        });
    }
  };

  // Register a message handler
  on = <T = unknown, R = unknown>(type: string, handler: MessageHandler<T, R>): void => {
    this.messageHandlers.set(type, handler as MessageHandler<any, any>);
  };

  // Remove a message handler
  off = (type: string): void => {
    this.messageHandlers.delete(type);
  };

  // Send a message and await the response
  send = async <T = unknown, R = unknown>(type: string, payload: T): Promise<R> => {
    if (!this.available) {
      return Promise.reject(new Error('PostMessageBridge is unavailable outside a browser environment'));
    }
    const id = getRandomString(10);
    return new Promise<R>((rs, reject) => {
      // Backstop: end the request when no response arrives in time
      const timeout = setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, DEFAULT_TIMEOUT);
      const resolve = (value: R) => {
        clearTimeout(timeout);
        rs(value);
      };
      const rejectWith = (error: unknown) => {
        clearTimeout(timeout);
        reject(error);
      };
      // Register the pending entry before sending, so a response cannot arrive first.
      this.pendingRequests.set(id, { resolve, reject: rejectWith });
      try {
        this.post(this.targetWindow, { type, payload, id });
      } catch (error) {
        // A structured-clone failure (a payload holding a function or a DOM node) rejects
        // immediately rather than burning the full timeout. Circular references are fine —
        // structured clone handles those itself.
        this.pendingRequests.delete(id);
        rejectWith(error instanceof Error ? error : new Error('Failed to post message'));
      }
    });
  };

  // Broadcast a message
  broadcast = <T = unknown>(data: { type: string; payload: T }): void => {
    if (!this.available) return;
    try {
      this.post(this.targetWindow, { type: data.type, payload: data.payload });
    } catch {
      // Broadcasting is best-effort; a clone failure is ignored silently.
    }
  };

  // Teardown
  destroy = (): void => {
    bridgeDispatcher.remove(this);
    this.messageHandlers.clear();
    // Reject the pending requests and clear their timeout timers, so nothing is left hanging.
    this.pendingRequests.forEach((pending) => {
      pending.reject(new Error('Bridge destroyed'));
    });
    this.pendingRequests.clear();
  };
}
// #endregion Bridge end

// #region BridgeManager start
export interface BridgeManagerOptions {
  id?: string;
  targetOrigin?: string;
  targetWindow?: Window;
  /** Channel id; set it to isolate several connections on one window. Both ends must agree. */
  channel?: string;
}

export class BridgeManager {
  private static instance: BridgeManager;

  private bridges = new Map<string, PostMessageBridge>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): BridgeManager {
    if (!BridgeManager.instance) {
      BridgeManager.instance = new BridgeManager();
    }
    return BridgeManager.instance;
  }

  // Create a new bridge
  connectClient = ({
    id,
    targetOrigin,
    targetWindow,
    channel,
  }: BridgeManagerOptions): { bridge: PostMessageBridge; id: string } => {
    const bridge = new PostMessageBridge(targetWindow, targetOrigin, channel);
    if (!id) {
      id = getRandomString(10);
    }
    if (this.bridges.has(id)) {
      throw new Error(`Bridge ${id} already exists`);
    }
    this.bridges.set(id, bridge);
    return { bridge, id };
  };

  // Get a bridge by name
  getClient = (id: string): PostMessageBridge | undefined => {
    return this.bridges.get(id);
  };

  // Remove a bridge
  removeClient = (id: string): void => {
    const bridge = this.bridges.get(id);
    if (bridge) {
      bridge.destroy();
      this.bridges.delete(id);
    }
  };

  // Remove every bridge
  removeAllClient = (): void => {
    this.bridges.forEach((bridge) => {
      bridge.destroy();
    });
    this.bridges.clear();
  };

  // Broadcast to every bridge
  broadcast = <T = unknown>(payload: { type: string; payload: T }): void => {
    this.bridges.forEach((bridge) => {
      bridge.broadcast(payload);
    });
  };

  // Send to a named bridge
  sendTo = <T = unknown, R = unknown>(id: string, type: string, payload: T): Promise<R> => {
    const bridge = this.getClient(id);
    if (!bridge) {
      return Promise.reject(new Error(`Bridge ${id} not found`));
    }
    return bridge.send<T, R>(type, payload);
  };
}

// The exported singleton
export const bridgeManager = BridgeManager.getInstance();

// #endregion BridgeManager end

// #region Client start

export interface BroadcastPayload {
  type: string;
  payload: unknown;
}

export interface CallToPayload<T = unknown> {
  id: string;
  type: string;
  payload: T;
}

export const Client = {
  // Connect a client
  connect: ({
    id,
    targetWindow,
    targetOrigin,
    channel,
  }: BridgeManagerOptions): { bridge: PostMessageBridge; id: string } => {
    return bridgeManager.connectClient({ id, targetWindow, targetOrigin, channel });
  },
  // Disconnect a client
  remove: (id: string): void => {
    if (!id) return;
    bridgeManager.removeClient(id);
  },
  // Disconnect every client
  removeAll: (): void => {
    bridgeManager.removeAllClient();
  },
  /** Broadcast to every Platform */
  broadcast: (payload: BroadcastPayload): void => {
    return bridgeManager.broadcast(payload);
  },
  /** Send to a named Platform */
  call: <T = unknown, R = unknown>({ id, type, payload }: CallToPayload<T>): Promise<R> => {
    return bridgeManager.sendTo<T, R>(id, type, payload);
  },
  /** Broadcast to every window that can receive it (discouraged — it is a security risk) */
  broadcastToAll: (payload: BroadcastPayload): void => {
    if (typeof window === 'undefined') return;
    // Matches the bridge protocol: a structured envelope carrying the marker and the default
    // channel, so a receiving PostMessageBridge / Platform recognises it.
    const envelope: BridgeEnvelope = {
      __bridge: BRIDGE_MARKER,
      channel: DEFAULT_CHANNEL,
      type: payload.type,
      payload: payload.payload,
    };
    return window.postMessage(envelope, '*');
  },
};
// #endregion Client end

// #region Platform start
export const initPlatform = <T = unknown, R = unknown>(
  events: Record<string, MessageHandler<T, R>>,
): { destroy: () => void } => {
  const handlers = new Map<string, MessageHandler<T, R>>(
    Object.entries(events).filter((entry): entry is [string, MessageHandler<T, R>] => isFunction(entry[1])),
  );

  // Find the target element, connect, and talk to it. This uses the same envelope protocol
  // as PostMessageBridge (structured object + protocol marker + channel), so a
  // Client(PostMessageBridge) and a Platform interoperate directly.
  const initBridge = async (event: MessageEvent) => {
    // const hostname = new URL(event.origin).hostname
    // if (!whiteList.includes(hostname)) return
    const data = event.data as BridgeEnvelope<T> | undefined;
    // Protocol-marker filter: postMessage traffic that is not ours is ignored.
    if (!data || typeof data !== 'object' || data.__bridge !== BRIDGE_MARKER) return;
    const { type, payload, id } = data;
    const channel = data.channel ?? DEFAULT_CHANNEL;
    if (typeof type !== 'string' || !handlers.has(type)) return;
    const handler = handlers.get(type);
    if (!handler) return;
    const reply = (body: Partial<BridgeEnvelope<unknown>>) => {
      if (!id) return;
      event.source?.postMessage(
        { __bridge: BRIDGE_MARKER, channel, type, id, isResponse: true, ...body },
        { targetOrigin: event.origin },
      );
    };
    try {
      const result = await handler(payload);
      reply({ payload: result });
    } catch (error) {
      // Send the error back so the caller rejects instead of waiting out the timeout.
      reply({ payload: error instanceof Error ? error.message : String(error), isError: true });
    }
  };
  window.removeEventListener('message', initBridge);
  // Establish the connection from inside an iframe
  window.addEventListener('message', initBridge);

  const destroy = () => {
    window.removeEventListener('message', initBridge);
  };

  return {
    destroy,
  };
};

export const Platform = {
  init: initPlatform,
};
// #endregion Platform end

// #region PortBridge start
/**
 * A point-to-point bridge over MessagePort.
 *
 * Unlike PostMessageBridge's broadcast-then-filter model, a MessagePort is a private
 * point-to-point channel provided by the browser: only the two parties holding the port
 * after the handshake can talk. That rules out cross-window leakage, forged origins,
 * cross-talk between bridges on one window and self-answering by construction — with no
 * origin filter, no protocol marker and no base64, since the payload goes straight through
 * structured clone.
 *
 * Typical use:
 *   // Window A (initiator)
 *   const bridge = openPortBridge({ targetWindow: iframe.contentWindow, targetOrigin });
 *   const res = await bridge.send('ping', { n: 1 });
 *
 *   // Window B (acceptor)
 *   const bridge = await acceptPortBridge({ targetOrigin });
 *   bridge.on('ping', ({ n }) => n + 1);
 *
 * It also works where a port already exists (Web Worker / SharedWorker): createPortBridge(port).
 */
export interface PortBridge {
  on: <T = unknown, R = unknown>(type: string, handler: MessageHandler<T, R>) => void;
  off: (type: string) => void;
  send: <T = unknown, R = unknown>(type: string, payload: T) => Promise<R>;
  broadcast: <T = unknown>(data: { type: string; payload: T }) => void;
  destroy: () => void;
}

// Handshake marker, telling the acceptor that a port has been handed over.
const PORT_INIT_MARKER = '__ranuts_port_init__';

export interface OpenPortBridgeOptions {
  targetWindow: Window;
  targetOrigin?: string;
  /** Connection name, telling independent port connections apart on one page. Both ends must agree (defaults to 'default'). */
  name?: string;
}

export interface AcceptPortBridgeOptions {
  targetOrigin?: string;
  name?: string;
}

/**
 * Build a bridge on any MessagePort (a Web Worker, a SharedWorker, or a port from a completed handshake).
 */
export const createPortBridge = (port: MessagePort): PortBridge => {
  const messageHandlers = new Map<string, MessageHandler<any, any>>();
  const pendingRequests = new Map<string, PendingRequest<any>>();

  const onMessage = (event: MessageEvent): void => {
    const data = event.data as MessageData | undefined;
    if (!data || typeof data !== 'object' || typeof data.type !== 'string') return;
    const { type, payload, id, isResponse, isError } = data;

    if (isResponse && id) {
      const pending = pendingRequests.get(id);
      if (pending) {
        if (isError) pending.reject(new Error(typeof payload === 'string' ? payload : 'Bridge request failed'));
        else pending.resolve(payload);
        pendingRequests.delete(id);
      }
      return;
    }

    if (!messageHandlers.has(type)) return;
    const handler = messageHandlers.get(type);
    if (isFunction(handler)) {
      Promise.resolve(handler(payload))
        .then((response) => {
          if (id) port.postMessage({ type, payload: response, id, isResponse: true });
        })
        .catch((error) => {
          if (id) {
            port.postMessage({
              type,
              payload: error instanceof Error ? error.message : String(error),
              id,
              isResponse: true,
              isError: true,
            });
          }
        });
    }
  };

  port.addEventListener('message', onMessage);
  // With addEventListener, start() must be called explicitly before messages arrive.
  port.start();

  return {
    on: (type, handler) => {
      messageHandlers.set(type, handler as MessageHandler<any, any>);
    },
    off: (type) => {
      messageHandlers.delete(type);
    },
    send: <T = unknown, R = unknown>(type: string, payload: T): Promise<R> => {
      const id = getRandomString(10);
      return new Promise<R>((rs, reject) => {
        const timeout = setTimeout(() => {
          if (pendingRequests.has(id)) {
            pendingRequests.delete(id);
            reject(new Error('Request timeout'));
          }
        }, DEFAULT_TIMEOUT);
        const resolve = (value: R) => {
          clearTimeout(timeout);
          rs(value);
        };
        const rejectWith = (error: unknown) => {
          clearTimeout(timeout);
          reject(error);
        };
        pendingRequests.set(id, { resolve, reject: rejectWith });
        try {
          port.postMessage({ type, payload, id });
        } catch (error) {
          pendingRequests.delete(id);
          rejectWith(error instanceof Error ? error : new Error('Failed to post message'));
        }
      });
    },
    broadcast: (data) => {
      try {
        port.postMessage({ type: data.type, payload: data.payload });
      } catch {
        // best-effort
      }
    },
    destroy: () => {
      port.removeEventListener('message', onMessage);
      messageHandlers.clear();
      pendingRequests.forEach((pending) => pending.reject(new Error('Bridge destroyed')));
      pendingRequests.clear();
      port.close();
    },
  };
};

/**
 * Initiator: create a MessageChannel, hand one port to the target window and keep the other.
 */
export const openPortBridge = ({
  targetWindow,
  targetOrigin = '*',
  name = 'default',
}: OpenPortBridgeOptions): PortBridge => {
  const channel = new MessageChannel();
  targetWindow.postMessage({ [PORT_INIT_MARKER]: true, name }, targetOrigin, [channel.port2]);
  return createPortBridge(channel.port1);
};

/**
 * Acceptor: wait for the port the initiator hands over and return the bridge once the
 * handshake completes. The returned promise resolves on a handshake message with a matching
 * name.
 */
export const acceptPortBridge = ({
  targetOrigin = '*',
  name = 'default',
}: AcceptPortBridgeOptions = {}): Promise<PortBridge> => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('acceptPortBridge is unavailable outside a browser environment'));
  }
  return new Promise<PortBridge>((resolve) => {
    const onInit = (event: MessageEvent): void => {
      if (targetOrigin !== '*' && event.origin !== targetOrigin) return;
      const data = event.data as { [PORT_INIT_MARKER]?: boolean; name?: string } | undefined;
      if (!data || typeof data !== 'object' || data[PORT_INIT_MARKER] !== true || data.name !== name) return;
      const port = event.ports?.[0];
      if (!port) return;
      window.removeEventListener('message', onInit);
      resolve(createPortBridge(port));
    };
    window.addEventListener('message', onInit);
  });
};
// #endregion PortBridge end
