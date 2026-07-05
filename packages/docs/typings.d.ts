declare module '*.vue';
declare module '*.less';
declare module '*.css';
declare module 'ranui/style';

// Vite build-time macro (this package doesn't pull in vite/client globally).
interface ImportMeta {
  glob: (pattern: string, options?: Record<string, unknown>) => Record<string, unknown>;
}

interface Window {
  ran_docs: boolean | undefined;
  uploadFile: Function;
}

declare namespace NodeJS {
  interface Process {
    ran_docs: boolean | undefined;
  }
}
