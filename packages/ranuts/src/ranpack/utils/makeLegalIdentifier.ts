const reservedWords =
  'break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public'.split(
    ' ',
  );
const builtins =
  'Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl'.split(
    ' ',
  );

export default function makeLegalIdentifier(str: string): string {
  str = str
    .replace(/-(\w)/g, (_, letter) => letter.toUpperCase())
    .replace(/[^$\w]/g, '_');
  if (reservedWords.concat(builtins).includes(str)) {
    str = `_${str}`;
  }
  return str;
}
