import { Noop, replaceOld } from './utils';

export const handleConsole = (
  hooks: (...args: unknown[]) => void = Noop,
): void => {
  const consoleTypeList = ['log', 'info', 'warn', 'error', 'assert'];
  consoleTypeList.forEach((type: string) => {
    const replacement = (originalConsole: any) => {
      return function (...args: any[]): void {
        if (originalConsole) {
          hooks(type, ...args);
          originalConsole.apply(console, args);
        }
      };
    };
    replaceOld(console, type, replacement);
  });
};