declare module "*.less"
declare module "*.ts"
declare module "*.svg"
declare module '@/assets'
declare module '@/components'
declare module '@/plugins'
declare module '@/utils'


declare namespace Component {

    type Hint = (options: Prompt) => void
    interface Prompt {
        text: string;
        duration?: number;
        close?: () => void;
    }
    interface Message {
        info: Hint
        success: Hint
        error: Hint
        warning: Hint
        toast: Hint
    }
}


declare interface Window {
    message: Component.Message
}