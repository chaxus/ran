declare module "*.less";
declare module "*.ts";
declare module "*.svg";
declare module "@/assets";
declare module "@/components";
declare module "@/plugins";
declare module "@/utils";

declare namespace Ran {
  interface Prompt {
    content: string;
    duration?: number;
    close?: () => void;
  }
  type Hint = (options: Prompt | string) => void;

  interface Message {
    info: Hint;
    success: Hint;
    error: Hint;
    warning: Hint;
    toast: Hint;
  }
}

declare interface Window {
  message: Ran.Message;
}
