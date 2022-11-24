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
// ranuts 声明文件
declare module '@/file/*'
declare module '@/designMode/*'
declare module '@/node/*'
declare module '@/sort/*'
declare module '@/astParser/*'
declare module '@/utils/*'

declare namespace Ranuts {
    interface Identification {
        _identification: boolean;
        message?: string;
        data?:any
    }
}


