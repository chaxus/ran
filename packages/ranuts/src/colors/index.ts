import FMT from '@/colors/fmt';
import isColorSupported from '@/colors/isColorSupported';

const OPEN = 0;
const CLOSE = 1;

type Formatter = (open: string, close: string, replace?: string) => (input: string) => string;

const formatter: Formatter =
  (open, close, replace = open) =>
  (input) => {
    const string = '' + input;
    const index = string.indexOf(close, open.length);
    return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
  };

const replaceClose = (string: string, close: string, replace: string, index: number): string => {
  const start = string.substring(0, index) + replace;
  const end = string.substring(index + close.length);
  const nextIndex = end.indexOf(close);
  return ~nextIndex ? start + replaceClose(end, close, replace, nextIndex) : start + end;
};

const colors = (enabled = isColorSupported) => {
  const result: Record<string, (input: string) => string | StringConstructor> = {};
  Object.keys(FMT).forEach((key) => (result[key] = enabled ? formatter(FMT[key][OPEN], FMT[key][CLOSE]) : String));
  return result;
};

const createColors = (enabled = isColorSupported) => ({
  isColorSupported: enabled,
  reset: enabled ? (s: string) => `${FMT.reset[OPEN]}${s}${FMT.reset[CLOSE]}` : String,
  bold: enabled ? formatter(FMT.bold[OPEN], FMT.bold[CLOSE], `${FMT.bold[CLOSE]}${FMT.bold[OPEN]}`) : String,
  dim: enabled ? formatter(FMT.dim[OPEN], FMT.dim[CLOSE], `${FMT.dim[CLOSE]}${FMT.dim[OPEN]}`) : String,
});

export default Object.assign({}, colors(), createColors());
