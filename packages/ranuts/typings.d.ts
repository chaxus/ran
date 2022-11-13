declare module '@/functions/*'
declare module '@/model/*'
declare module '@/node/*'
declare module '@/sort/*'
declare module '@/library/*'

declare namespace Ranuts {
    interface Identification {
        _identification: boolean;
        message?: string;
        data?:any
    }
}

