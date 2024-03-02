export const hsv2hsl = (
    h: number,
    s: number,
    v: number
): { h: number, s: number, l: number } => {
    const hh = ((200 - s) * v) / 100;
    return {
        h: h,
        s: (s * v) / (hh < 100 ? hh : 200 - hh),
        l: hh / 2,
    };
}

export const hex2alpha = (aa: string): number => {
    return Math.round((parseInt('0x' + aa, 16) / 255) * 100);
}

export const hex2hsl = (hex: string): { h: number, s: number, l: number } => {
    const { h, s, v } = hex2hsv(hex);
    return hsv2hsl(h, s, v);
}

export const hex2hsv = (hex: string): { h: number, s: number, v: number } => {
    const { r, g, b } = hex2rgb(hex);
    return rgb2hsv(r, g, b);
}

export const hex2rgb = (hex: string): { r: number, g: number, b: number } => {
    if (hex[0] === '#') hex = hex.substr(1);

    if (hex.length === 3) {
        return {
            r: parseInt(hex[0] + hex[0], 16),
            g: parseInt(hex[1] + hex[1], 16),
            b: parseInt(hex[2] + hex[2], 16),
        };
    }

    return {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16),
    };
}


export const rgb2hsv = (
    r: number,
    g: number,
    b: number
): { h: number, s: number, v: number } => {
    let h;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    if (delta === 0) {
        h = 0;
    } else if (r === max) {
        h = ((g - b) / delta) % 6;
    } else if (g === max) {
        h = (b - r) / delta + 2;
    } else {
        h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    const s = Math.round((max === 0 ? 0 : delta / max) * 100);

    const v = Math.round((max / 255) * 100);

    return { h, s, v };
}

export const hsl2hsv = (
    h: number,
    s: number,
    l: number
): { h: number, s: number, v: number } => {
    s *= (l < 50 ? l : 100 - l) / 100;

    return {
        h: h,
        s: ((2 * s) / (l + s)) * 100,
        v: l + s,
    };
}

export const hsl2rgb = (h: number, s: number, l: number): { r: number, g: number, b: number } => {
    const hsv = hsl2hsv(h, s, l);
    return hsv2rgb(hsv.h, hsv.s, hsv.v);
}

export const hsv2rgb = (
    h: number,
    s: number,
    v: number
): { r: number, g: number, b: number } => {
    s = s / 100;
    v = v / 100;

    let rgb = [];
    const c = v * s;
    const hh = h / 60;
    const x = c * (1 - Math.abs((hh % 2) - 1));
    const m = v - c;

    if (hh >= 0 && hh < 1) {
        rgb = [c, x, 0];
    } else if (hh >= 1 && hh < 2) {
        rgb = [x, c, 0];
    } else if (hh >= 2 && hh < 3) {
        rgb = [0, c, x];
    } else if (h >= 3 && hh < 4) {
        rgb = [0, x, c];
    } else if (h >= 4 && hh < 5) {
        rgb = [x, 0, c];
    } else if (h >= 5 && hh <= 6) {
        rgb = [c, 0, x];
    } else {
        rgb = [0, 0, 0];
    }

    return {
        r: Math.round(255 * (rgb[0] + m)),
        g: Math.round(255 * (rgb[1] + m)),
        b: Math.round(255 * (rgb[2] + m)),
    };
}



const convert = (num: number) => {
    const hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

export const rgb2hex = (r: number, g: number, b: number): string => {
    return '#' + [convert(r), convert(g), convert(b)].join('');
}

export const rgba = (r: number, g: number, b: number, a: number): string => {
    return 'rgba(' + [r, g, b, a / 100].join(',') + ')';
}

export const rgba2hex = (r: number, g: number, b: number, a: number): string => {
    const rgb = rgba2rgb(r, g, b, a);
    return rgb2hex(rgb.r, rgb.g, rgb.b);
}


export const rgba2rgb = (
    r: number,
    g: number,
    b: number,
    a: number
): { r: number, g: number, b: number } => {
    a = a / 100;

    return {
        r: parseInt(`${(1 - a) * 255 + a * r}`, 10),
        g: parseInt(`${(1 - a) * 255 + a * g}`, 10),
        b: parseInt(`${(1 - a) * 255 + a * b}`, 10),
    };
}

export const hexColorRegex = /^#([\da-fA-F]{6}|[\da-fA-F]{3})$/;

export const rgbRegex = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/;

export const rgbaRegex = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d{1,3}(\.\d+)?)\)$/; 