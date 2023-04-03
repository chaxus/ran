import tty from 'node:tty'

const OPEN = 0
const CLOSE = 1

const FMT:Record<string, Array<string>> = {
	reset: ["\x1b[0m", "\x1b[0m"],
	bold: ["\x1b[1m", "\x1b[22m"],
	dim: ["\x1b[2m", "\x1b[22m"],
	italic: ["\x1b[3m", "\x1b[23m"],
	underline: ["\x1b[4m", "\x1b[24m"],
	inverse: ["\x1b[7m", "\x1b[27m"],
	hidden: ["\x1b[8m", "\x1b[28m"],
	strikethrough: ["\x1b[9m", "\x1b[29m"],
	black: ["\x1b[30m", "\x1b[39m"],
	red: ["\x1b[31m", "\x1b[39m"],
	green: ["\x1b[32m", "\x1b[39m"],
	yellow: ["\x1b[33m", "\x1b[39m"],
	blue: ["\x1b[34m", "\x1b[39m"],
	magenta: ["\x1b[35m", "\x1b[39m"],
	cyan: ["\x1b[36m", "\x1b[39m"],
	white: ["\x1b[37m", "\x1b[39m"],
	gray: ["\x1b[90m", "\x1b[39m"],
	bgBlack: ["\x1b[40m", "\x1b[49m"],
	bgRed: ["\x1b[41m", "\x1b[49m"],
	bgGreen: ["\x1b[42m", "\x1b[49m"],
	bgYellow: ["\x1b[43m", "\x1b[49m"],
	bgBlue: ["\x1b[44m", "\x1b[49m"],
	bgMagenta: ["\x1b[45m", "\x1b[49m"],
	bgCyan: ["\x1b[46m", "\x1b[49m"],
	bgWhite: ["\x1b[47m", "\x1b[49m"],
}

const isColorSupported =
  !('NO_COLOR' in process.env || process.argv.includes('--no-color')) &&
  ('FORCE_COLOR' in process.env ||
    process.argv.includes('--color') ||
    process.platform === 'win32' ||
    (tty.isatty(1) && process.env.TERM !== 'dumb') ||
    'CI' in process.env)

type Formatter = (open: string, close: string, replace?: string) => (input: string) => string

const formatter =
  (open: string, close: string, replace = open) =>
  (input: string) => {
    const string = '' + input
    const index = string.indexOf(close, open.length)
    return ~index
      ? open + replaceClose(string, close, replace, index) + close
      : open + string + close
  }

const replaceClose = (
  string: string,
  close: string,
  replace: string,
  index: number,
): string => {
  const start = string.substring(0, index) + replace
  const end = string.substring(index + close.length)
  const nextIndex = end.indexOf(close)
  return ~nextIndex
    ? start + replaceClose(end, close, replace, nextIndex)
    : start + end
}

const createColors = (enabled = isColorSupported) => ({
  isColorSupported: enabled,
  reset: enabled ? (s: string) => `${FMT.reset[OPEN]}${s}${FMT.reset[CLOSE]}` : String,
  bold: enabled ? formatter('\x1b[1m', '\x1b[22m', '\x1b[22m\x1b[1m') : String,
  dim: enabled ? formatter('\x1b[2m', '\x1b[22m', '\x1b[22m\x1b[2m') : String,
  italic: enabled ? formatter('\x1b[3m', '\x1b[23m') : String,
  underline: enabled ? formatter('\x1b[4m', '\x1b[24m') : String,
  inverse: enabled ? formatter('\x1b[7m', '\x1b[27m') : String,
  hidden: enabled ? formatter('\x1b[8m', '\x1b[28m') : String,
  strikethrough: enabled ? formatter('\x1b[9m', '\x1b[29m') : String,
  black: enabled ? formatter('\x1b[30m', '\x1b[39m') : String,
  red: enabled ? formatter('\x1b[31m', '\x1b[39m') : String,
  green: enabled ? formatter('\x1b[32m', '\x1b[39m') : String,
  yellow: enabled ? formatter('\x1b[33m', '\x1b[39m') : String,
  blue: enabled ? formatter('\x1b[34m', '\x1b[39m') : String,
  magenta: enabled ? formatter('\x1b[35m', '\x1b[39m') : String,
  cyan: enabled ? formatter('\x1b[36m', '\x1b[39m') : String,
  white: enabled ? formatter('\x1b[37m', '\x1b[39m') : String,
  gray: enabled ? formatter('\x1b[90m', '\x1b[39m') : String,
  bgBlack: enabled ? formatter('\x1b[40m', '\x1b[49m') : String,
  bgRed: enabled ? formatter('\x1b[41m', '\x1b[49m') : String,
  bgGreen: enabled ? formatter('\x1b[42m', '\x1b[49m') : String,
  bgYellow: enabled ? formatter('\x1b[43m', '\x1b[49m') : String,
  bgBlue: enabled ? formatter('\x1b[44m', '\x1b[49m') : String,
  bgMagenta: enabled ? formatter('\x1b[45m', '\x1b[49m') : String,
  bgCyan: enabled ? formatter('\x1b[46m', '\x1b[49m') : String,
  bgWhite: enabled ? formatter('\x1b[47m', '\x1b[49m') : String,
})

export default createColors()
