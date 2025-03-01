import tty from 'node:tty';
import process from 'node:process';

const isColorSupported =
  process?.env &&
  !('NO_COLOR' in process.env || process.argv.includes('--no-color')) &&
  ('FORCE_COLOR' in process.env ||
    process.argv.includes('--color') ||
    process.platform === 'win32' ||
    (tty.isatty(1) && process.env.TERM !== 'dumb') ||
    'CI' in process.env);

export default isColorSupported;
