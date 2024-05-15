export interface BaseReturn<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface RenderOptions {
  dom: HTMLElement;
  onError?: (msg: BaseReturn) => void;
  onLoad?: (msg: BaseReturn) => void;
}
