import { once } from '@/utils/memoize';
import { noop } from '@/utils/noop';
/**
 * @description: Serialise an object into a URL query string
 * @param {*} data
 * @return {*}
 */
export function querystring(data = {}): string {
  if (typeof data !== 'object') {
    throw new TypeError('param must be object');
  }
  return Object.entries(data)
    .reduce(
      (searchParams, [name, value]) =>
        value === undefined || value == null
          ? searchParams
          : (searchParams.append(decodeURIComponent(name), decodeURIComponent(value)), searchParams),
      new URLSearchParams(),
    )
    .toString();
}

/**
 * @description: Pretty-print JSON. Accepts an object or a JSON string (single quotes are
 * tolerated and normalized to double quotes, which is common in hand-written config).
 *
 * This is `JSON.stringify(value, null, indent)` with lenient parsing in front. It replaces a
 * ~90-line hand-rolled formatter that rebuilt the layout by regex-injecting newlines around
 * every brace, bracket and comma, then tried to undo the damage inside string literals by
 * counting quotes per line — which mis-handled escaped quotes, and treated a brace or comma
 * inside a string value as structure. The platform serializer has none of those problems and
 * is orders of magnitude faster.
 *
 * @param {string | object} value object, or a JSON string to reformat
 * @param {Function} onError called with the parse/serialize error; the function returns `''`
 * @param {number} indent spaces per level, default 4
 * @return {string} formatted JSON, or `''` when the input could not be parsed
 * @example
 * ```ts
 * formatJson({ a: 1, b: [2, 3] });
 * formatJson("{'a': 1}");          // single quotes tolerated
 * formatJson('nope', (e) => log(e)); // '' + the error handed to the callback
 * ```
 */
export const formatJson = (
  value: string | object,
  onError: (error: Error) => void = noop,
  indent: number = 4,
): string => {
  try {
    // A string input is re-parsed rather than echoed: that validates it and normalizes the
    // formatting instead of trusting whatever spacing the caller happened to have.
    const data = typeof value === 'string' ? JSON.parse(value.replace(/'/g, '"')) : value;
    return JSON.stringify(data, null, indent) ?? '';
  } catch (error) {
    onError(error as Error);
    return '';
  }
};

/**
 * @description: Return a new object without the properties whose values appear in `list` — typically used to drop empty strings and nulls
 * @param {Object} obj source object
 * @param {Array} list values to remove
 * @return {Object}
 */

export const filterObj = (obj: Record<string, unknown>, list: Array<string>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  Object.keys(obj).forEach((item) => {
    if (!list.includes(item)) {
      result[item] = obj[item];
    }
  });
  return result;
};

type Obj = Record<string, any>;
/**
 * @description: Merge objects
 * @param {Obj} a
 * @param {Obj} b
 * @return {*}
 */
export const merge = (a: Obj, b?: Obj): Obj => {
  if (a && b) {
    for (const key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

/**
 * @description: Replace a property on an object, wrapping whatever was there before.
 *
 * Returns a **restore function**. Patching a global is a one-way door without it: tests cannot
 * clean up after themselves, two instrumentation layers cannot be unwound in order, and a hot
 * reload stacks wrapper on wrapper until the call is nested a dozen deep. Always keep the
 * returned function and call it on teardown.
 *
 * @param {any} source object to patch
 * @param {string} name key to patch
 * @param {Function} replacement receives the original value, returns the wrapper
 * @param {boolean} isForced patch even when the key does not exist yet
 * @return {Function} restore — puts the original value back; safe to call more than once
 */
export function replaceOld(
  source: any,
  name: string,
  replacement: (...args: unknown[]) => unknown,
  isForced?: boolean,
): () => void {
  if (typeof source === 'undefined') return noop;
  if (!(name in source) && !isForced) return noop;
  const existed = name in source;
  const original = source[name];
  const wrapped = replacement(original);
  if (typeof wrapped !== 'function') return noop;
  source[name] = wrapped;
  let restored = false;
  return () => {
    if (restored) return;
    restored = true;
    // Only undo our own patch: if something patched on top of us afterwards, blindly writing
    // the original back would silently uninstall that layer too.
    if (source[name] !== wrapped) return;
    if (existed) source[name] = original;
    else delete source[name];
  };
}

/**
 * @description: Copy an exports object onto `obj`, then freeze it
 * @param {Object} obj
 * @param {Object} exports
 * @return {Object}
 */
export const mergeExports = (obj: Record<string, string>, exports: Record<string, string>): Record<string, string> => {
  const descriptors = Object.getOwnPropertyDescriptors(exports);
  for (const name of Object.keys(descriptors)) {
    const descriptor = descriptors[name];
    if (descriptor.get) {
      const fn = descriptor.get;
      Object.defineProperty(obj, name, {
        configurable: false,
        enumerable: true,
        get: once(fn),
      });
    } else if (typeof descriptor.value === 'object') {
      Object.defineProperty(obj, name, {
        configurable: false,
        enumerable: true,
        writable: false,
        value: mergeExports({}, descriptor.value),
      });
    } else {
      throw new Error('Exposed values must be either a getter or an nested object');
    }
  }
  return Object.freeze(obj);
};

/**
 * Deep-compare two values, in the manner of Lodash's isEqual.
 */

/**
 * Whether the value is object-like
 */
export function isObjectLike(value: any): boolean {
  return typeof value === 'object' && value !== null;
}

/**
 * The object's internal [[Class]] tag
 */
export function getTag(value: any): string {
  return Object.prototype.toString.call(value);
}

/**
 * Whether the value is array-like
 */
export function isArrayLike(value: any): boolean {
  if (value == null) {
    return false;
  }

  const length = value.length;
  return typeof length === 'number' && length >= 0 && length % 1 === 0 && length <= Number.MAX_SAFE_INTEGER;
}

/**
 * Deep-compare two values.
 * @param value first value
 * @param other second value
 * @param seen objects already compared, so circular references terminate
 * @returns whether the two are equal
 */
export function isEqual(value: any, other: any, seen = new Map()): boolean {
  // Same reference
  if (value === other) {
    return true;
  }

  // One is null/undefined and the other is not
  if (value == null || other == null) {
    return value === other;
  }

  // NaN
  if (value !== value && other !== other) {
    return true;
  }

  // Different types
  const valueType = typeof value;
  const otherType = typeof other;

  if (valueType !== otherType) {
    return false;
  }

  // Non-object types
  if (valueType !== 'object') {
    return value === other;
  }

  // Special object types
  const valueTag = getTag(value);
  const otherTag = getTag(other);

  if (valueTag !== otherTag) {
    return false;
  }

  // Circular reference check
  if (seen.has(value)) {
    return seen.get(value) === other;
  }

  // Record the pair being compared
  seen.set(value, other);

  // Arrays
  if (valueTag === '[object Array]') {
    if (value.length !== other.length) {
      return false;
    }

    for (let i = 0; i < value.length; i++) {
      if (!isEqual(value[i], other[i], seen)) {
        return false;
      }
    }

    return true;
  }

  // Date
  if (valueTag === '[object Date]') {
    return +value === +other;
  }

  // RegExp
  if (valueTag === '[object RegExp]') {
    return value.toString() === other.toString();
  }

  // Map
  if (valueTag === '[object Map]') {
    if (value.size !== other.size) {
      return false;
    }

    // Compare the entries
    let matched = true;
    value.forEach((val: any, key: any) => {
      if (matched) {
        if (!other.has(key) || !isEqual(val, other.get(key), seen)) {
          matched = false;
        }
      }
    });

    return matched;
  }

  // Set
  if (valueTag === '[object Set]') {
    if (value.size !== other.size) {
      return false;
    }

    // A Set has no guaranteed iteration order, so compare via arrays
    const valueArray = Array.from(value);
    const otherArray = Array.from(other);

    // Find a match for every element
    return valueArray.every((item) => {
      return otherArray.some((otherItem) => isEqual(item, otherItem, seen));
    });
  }

  // Plain objects
  const valueKeys = Object.keys(value);
  const otherKeys = Object.keys(other);

  if (valueKeys.length !== otherKeys.length) {
    return false;
  }

  // Every key must exist on both sides with an equal value
  for (const key of valueKeys) {
    if (!Object.prototype.hasOwnProperty.call(other, key) || !isEqual(value[key], other[key], seen)) {
      return false;
    }
  }

  return true;
}

// Example usage
// const obj1 = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
// const obj2 = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
// console.log(isEqual(obj1, obj2)); // true

/**
 * Deep clone, covering the complex built-in types and circular references.
 * @param value value to clone
 * @param cloneMap objects already cloned, so circular references terminate
 * @returns the cloned value
 */
export const cloneDeep = <T>(value: T, cloneMap = new WeakMap<object, any>()): T => {
  // Non-object types and null
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Circular reference check
  if (cloneMap.has(value as object)) {
    return cloneMap.get(value as object);
  }

  // Date
  if (value instanceof Date) {
    return new Date(value.getTime()) as unknown as T;
  }

  // RegExp
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as unknown as T;
  }

  // Arrays
  if (Array.isArray(value)) {
    const result: any[] = [];
    // Register the result before recursing, so circular references resolve to it
    cloneMap.set(value as object, result);

    // Clone each element
    for (let i = 0; i < value.length; i++) {
      result[i] = cloneDeep(value[i], cloneMap);
    }

    return result as unknown as T;
  }

  // Map
  if (value instanceof Map) {
    const result = new Map();
    cloneMap.set(value as object, result);

    value.forEach((val, key) => {
      // Clone both the key and the value
      result.set(typeof key === 'object' && key !== null ? cloneDeep(key, cloneMap) : key, cloneDeep(val, cloneMap));
    });

    return result as unknown as T;
  }

  // Set
  if (value instanceof Set) {
    const result = new Set();
    cloneMap.set(value as object, result);

    value.forEach((val) => {
      // Clone every member
      result.add(cloneDeep(val, cloneMap));
    });

    return result as unknown as T;
  }

  // Objects carrying symbol-keyed properties
  if (typeof value === 'object' && (value as object).constructor === Object) {
    const result: Record<string | symbol, any> = {};
    cloneMap.set(value as object, result);

    // String keys and symbol keys alike
    [...Object.getOwnPropertyNames(value), ...Object.getOwnPropertySymbols(value)].forEach((key) => {
      const objValue = value as Record<string | symbol, unknown>;
      result[key] = cloneDeep(objValue[key], cloneMap);
    });

    return result as unknown as T;
  }

  // Everything else (Error, Blob, File, …)
  try {
    // Try to build a new instance via the constructor
    const prototype = Object.getPrototypeOf(value);
    const Constructor = prototype.constructor;
    const result = new Constructor();

    cloneMap.set(value as object, result);

    // Copy every enumerable property
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const objValue = value as Record<string, unknown>;
        result[key] = cloneDeep(objValue[key], cloneMap);
      }
    }

    return result;
  } catch {
    // Not constructible this way — fall back to a shallow copy
    console.warn(
      `Unable to deeply clone object of type ${Object.prototype.toString.call(value)}. Fallback to shallow copy.`,
    );
    return { ...(value as object) } as unknown as T;
  }
};
