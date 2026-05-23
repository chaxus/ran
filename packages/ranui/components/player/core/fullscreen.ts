type FullscreenMethodHost = Record<string, (() => Promise<void> | void) | undefined>;

export function callFirstFullscreenMethod(host: FullscreenMethodHost, methodNames: string[]): Promise<void> {
  const methodName = methodNames.find((name) => typeof host[name] === 'function');
  if (!methodName) return Promise.reject(new Error('fullscreen API is not available'));
  return Promise.resolve(host[methodName]?.call(host));
}

export function requestElementFullscreen(element: Element): Promise<void> {
  return callFirstFullscreenMethod(element as unknown as FullscreenMethodHost, [
    'requestFullscreen',
    'mozRequestFullScreen',
    'msRequestFullscreen',
    'oRequestFullscreen',
    'webkitRequestFullscreen',
    'webkitEnterFullscreen',
  ]);
}

export function exitDocumentFullscreen(doc: Document): Promise<void> {
  return callFirstFullscreenMethod(doc as unknown as FullscreenMethodHost, [
    'exitFullscreen',
    'msExitFullscreen',
    'mozCancelFullScreen',
    'oCancelFullScreen',
    'webkitExitFullscreen',
  ]);
}
