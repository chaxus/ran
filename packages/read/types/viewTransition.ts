export interface ViewTransition {
  readonly ready: Promise<void>;
  readonly finished: Promise<void>;
  readonly updateCallbackDone: Promise<void>;
  skipTransition(): void;
}

declare global {
  interface Document {
    startViewTransition(updateCallback: () => Promise<void> | void): ViewTransition;
  }
  interface CSSStyleDeclaration {
    viewTransitionName: string;
  }
}
