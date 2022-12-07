import fs, { Stats } from 'node:fs';
import { join, normalize, resolve } from 'node:path';
import { traverseSync } from '@/node/http/traverse'
import parse from '@/node/http/paresUrl';
import { lookup } from '@/node/http/mimeType';
import type { IncomingMessage, ServerResponse } from 'node:http';

type ArrayAble<T> = T | T[];

interface Options {
    dev?: boolean;
    etag?: boolean;
    maxAge?: number;
    immutable?: boolean;
    single?: string | boolean;
    ignores?: false | ArrayAble<string | RegExp>;
    extensions?: string[];
    dotfiles?: boolean;
    brotli?: boolean;
    gzip?: boolean;
    onNoMatch?: (req: IncomingMessage, res: ServerResponse) => void;
    setHeaders?: (res: ServerResponse, pathname: string, stats: Stats) => void;
}

type NextHandler = () => void | Promise<void>;

type RequestHandler = (req: IncomingMessage, res: ServerResponse, next?: NextHandler) => void;

const noop = () => { };

function isMatch(uri: string, arr: Array<RegExp>) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].test(uri)) return true;
    }
}

function toAssume(uri: string, extns: string | any[]) {
    let i = 0, x, len = uri.length - 1;
    if (uri.charCodeAt(len) === 47) {
        uri = uri.substring(0, len);
    }

    let arr = [], tmp = `${uri}/index`;
    for (; i < extns.length; i++) {
        x = extns[i] ? `.${extns[i]}` : '';
        if (uri) arr.push(uri + x);
        arr.push(tmp + x);
    }

    return arr;
}

function viaCache(cache: { [x: string]: any; }, uri: any, extns: any) {
    let i = 0, data, arr = toAssume(uri, extns);
    for (; i < arr.length; i++) {
        if (data = cache[arr[i]]) return data;
    }
}

function viaLocal(dir: string, isEtag: boolean, uri: any, extns: any) {
    let i = 0, arr = toAssume(uri, extns);
    let abs, stats, name, headers;
    for (; i < arr.length; i++) {
        abs = normalize(join(dir, name = arr[i]));
        if (abs.startsWith(dir) && fs.existsSync(abs)) {
            stats = fs.statSync(abs);
            if (stats.isDirectory()) continue;
            headers = toHeaders(name, stats, isEtag);
            headers['Cache-Control'] = isEtag ? 'no-cache' : 'no-store';
            return { abs, stats, headers };
        }
    }
}

function is404(req: any, res: { statusCode: number; end: () => any; }) {
    return (res.statusCode = 404, res.end());
}

function send(req: IncomingMessage, res: ServerResponse<IncomingMessage>, file: fs.PathLike, stats: { size: number; }, headers: { [x: string]: string; }) {
    let code = 200, tmp: string | undefined, opts: Record<string, number> = {};
    headers = { ...headers };

    for (let key in headers) {
        tmp = res.getHeader(key)?.toString();
        if (tmp) headers[key] = tmp;
    }

    if (tmp = res.getHeader('content-type')?.toString()) {
        headers['Content-Type'] = tmp;
    }

    if (req.headers.range) {
        code = 206;
        let [x, y] = req.headers.range.replace('bytes=', '').split('-');
        let end = opts.end = parseInt(y, 10) || stats.size - 1;
        let start = opts.start = parseInt(x, 10) || 0;

        if (start >= stats.size || end >= stats.size) {
            res.setHeader('Content-Range', `bytes */${stats.size}`);
            res.statusCode = 416;
            return res.end();
        }

        headers['Content-Range'] = `bytes ${start}-${end}/${stats.size}`;
        headers['Content-Length'] = (end - start + 1).toString();
        headers['Accept-Ranges'] = 'bytes';
    }

    res.writeHead(code, headers);
    fs.createReadStream(file, opts).pipe(res);
}


const ENCODING = new Map([
    ['.br', 'br'],
    ['.gz', 'gzip',]
])


function toHeaders(name: string, stats: fs.Stats, isEtag: boolean) {
    let enc: string | undefined = ENCODING.get(name.slice(-3));

    let ctype: string = lookup(name.slice(0, enc?.length && -3)) || '';
    if (ctype === 'text/html') ctype += ';charset=utf-8';

    let headers: Record<string, string | number> = {
        'Content-Length': stats.size,
        'Content-Type': ctype,
        'Last-Modified': stats.mtime.toUTCString(),
    };

    if (enc) headers['Content-Encoding'] = enc;
    if (isEtag) headers['ETag'] = `W/"${stats.size}-${stats.mtime.getTime()}"`;

    return headers;
}

export default function (dir: string, opts: Options = {}) {
    dir = resolve(dir || '.');

    let isNotFound = opts.onNoMatch || is404;
    let setHeaders = opts.setHeaders || noop;

    let extensions = opts.extensions || ['html', 'htm'];
    let gzips = opts.gzip && extensions.map(x => `${x}.gz`).concat('gz');
    let brots = opts.brotli && extensions.map(x => `${x}.br`).concat('br');

    const FILES: any = {};

    let fallback = '/';
    let isEtag = !!opts.etag;
    let isSPA = !!opts.single;
    if (typeof opts.single === 'string') {
        let idx = opts.single.lastIndexOf('.');
        fallback += !!~idx ? opts.single.substring(0, idx) : opts.single;
    }

    let ignores: Array<RegExp> = [];
    if (opts.ignores !== false) {
        ignores.push(/[/]([A-Za-z\s\d~$._-]+\.\w+){1,}$/); // any extn
        if (opts.dotfiles) ignores.push(/\/\.\w/);
        else ignores.push(/\/\.well-known/);
        if (Array.isArray(opts.ignores)) {
            opts.ignores.forEach(x => {
                if (Array.isArray(ignores)) ignores.push(new RegExp(x, 'i'));
            });
        }

    }


    let cc = opts.maxAge != null && `public,max-age=${opts.maxAge}`;
    if (cc && opts.immutable) cc += ',immutable';
    else if (cc && opts.maxAge === 0) cc += ',must-revalidate';

    if (!opts.dev) {
        traverseSync(dir, (name: string, abs: any, stats: any) => {
            if (/\.well-known[\\+\/]/.test(name)) { } // keep
            else if (!opts.dotfiles && /(^\.|[\\+|\/+]\.)/.test(name)) return;

            let headers = toHeaders(name, stats, isEtag);
            if (cc) headers['Cache-Control'] = cc;

            FILES['/' + name.normalize().replace(/\\+/g, '/')] = { abs, stats, headers };
        });
    }

    let lookup = opts.dev ? viaLocal.bind(0, dir, isEtag) : viaCache.bind(0, FILES);

    return function (req: IncomingMessage, res: ServerResponse, next?: NextHandler) {
        let extns = [''];
        let pathname = parse(req).pathname;
        let val = req.headers['accept-encoding']?.toString() || '';
        if (gzips && val.includes('gzip')) extns.unshift(...gzips);
        if (brots && /(br|brotli)/i.test(val)) extns.unshift(...brots);
        extns.push(...extensions); // [...br, ...gz, orig, ...exts]

        if (pathname.indexOf('%') !== -1) {
            try { pathname = decodeURIComponent(pathname) }
            catch (err) { /* malform uri */ }
        }

        let data = lookup(pathname, extns) || isSPA && !isMatch(pathname, ignores) && lookup(fallback, extns);
        if (!data) return next ? next() : isNotFound(req, res);

        if (isEtag && req.headers['if-none-match'] === data.headers['ETag']) {
            res.writeHead(304);
            return res.end();
        }

        if (gzips || brots) {
            res.setHeader('Vary', 'Accept-Encoding');
        }

        setHeaders(res, pathname, data.stats);
        send(req, res, data.abs, data.stats, data.headers);
    };
}