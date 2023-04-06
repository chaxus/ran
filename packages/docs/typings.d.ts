interface Window {
  ran_docs: boolean | undefined
}

declare namespace NodeJS {
  interface Process {
    ran_docs: boolean | undefined
  }
}
