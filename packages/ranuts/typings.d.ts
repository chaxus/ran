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

