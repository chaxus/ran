interface Window {
  ran_docs: boolean | undefined;
  uploadFile: Function;
}

declare namespace NodeJS {
  interface Process {
    ran_docs: boolean | undefined;
  }
}