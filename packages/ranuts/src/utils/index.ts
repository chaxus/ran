

export const getAllQueryString = (url:string):Record<string, string> => {
    if (typeof window !== 'undefined') {
        const r:Record<string, string> = {};
        const href = url || window.location.href;
        if (href.split('?')[1]) {
            const str = href.split('?')[1];
            const strList = str.split('&');
            strList.forEach((item) => {
                const key = item.split('=')[0];
                const val = item.split('=')[1];
                if (key && val) {
                    r[key] = decodeURIComponent(val);
                }
            });
        }
        return r;
    }
    return {};
};

export function getFreshUrl(url:string, params:Record<string, string> = {}):string {
    let _url = url;
    if (_url.indexOf('//') === 0) {
        _url = _url.replace('//', 'https://');
    }
    const urlObj = new URL(_url);
    if (params) {
        Object.keys(params).forEach((key) => {
            params[key] && urlObj.searchParams.set(key, params[key]);
        });
    }
    return urlObj.href;
}

export const debounce = (fn:any, ms = 500):any => {
    let timeout: NodeJS.Timeout;
    return (...args:any) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, args);
        }, ms);
    };
};

export const throttle = (fn:any, wait = 300):any => {
    let timer:NodeJS.Timeout | null;
    return function (this:any) {
        const context = this;
        const args = arguments;
        if (!timer) {
            timer = setTimeout(() => {
                timer = null;
                fn.apply(context, args);
            }, wait);
        }
    };
};
export const requestAnimation = (fn:any):any => {
    let ticking = false;
    return function (this: any) {
        const context = this;
        const args = arguments;
        if (!ticking) {
            window.requestAnimationFrame(function () {
                fn.apply(context, args);
                ticking = false;
            });
            ticking = true;
        }
    };
};