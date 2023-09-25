export const keys = Object.keys;
export const values = Object.values;

export const hasOwnProp = Object.prototype.hasOwnProperty;

export function has(obj: any, prop: string): boolean {
  return hasOwnProp.call(obj, prop);
}
