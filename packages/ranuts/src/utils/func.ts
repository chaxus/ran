export const isFunction = (handler: unknown): handler is Function => {
  return typeof handler === 'function';
};
