import fs from 'node:fs';
import { strParse } from '@/utils/str';
import type { Context, MiddlewareFunction, Next } from '@/node/server';

// describe('encodeUrl(url)', function () {
//     it('should keep URL the same', function () {

interface ServerBody {
  uploadDir: string; // Sets the directory for placing file uploads in, default os.tmpDir()
  encoding: BufferEncoding; // Sets encoding for incoming form fields, default utf-8
  urlencoded: boolean; // Parse urlencoded bodies, default true
  json: boolean; // Parse JSON bodies, default true
}

const bodyMiddleware = (options: Partial<ServerBody> = {}): MiddlewareFunction => {
  const { uploadDir = '.', encoding = '', json = true } = options;
  return (ctx: Context, next: Next) => {
    const { req, res } = ctx;
    const { url, method } = req;
    // 处理 URL 上的 query 参数
    const [path = '', search = ''] = url?.split('?') || [];
    const query = search ? new URLSearchParams(search) : {};
    if (!ctx.request) {
      ctx.request = {};
    }
    // 添加到 request 上
    ctx.request.method = method;
    ctx.request.path = path;
    ctx.request.url = url;
    ctx.request.query = query;
    // 处理 contentType
    const contentType = req.headers['content-type'];
    // application/json
    if (contentType === 'application/json') {
      if (encoding) {
        req.setEncoding(encoding);
      } else {
        req.setEncoding('utf-8');
      }
      let body = '';
      req.on('data', (data) => {
        body += data;
      });
      req.on('end', () => {
        res.setHeader('content-type', 'application/json;charset=UTF-8');
        try {
          ctx.request.body = json ? JSON.parse(body) : body;
        } catch (_error) {
          ctx.request.body = body;
        }
        next();
      });
    }
    // multipart/form-data
    if (contentType?.includes('multipart/form-data;')) {
      const [__, boundaryStr] = req.headers['content-type']?.split(';').map((item) => item.trim()) || [];
      const [_, boundary] = boundaryStr.split('=');
      // const fileSize = req.headers['content-length']
      if (encoding) {
        req.setEncoding(encoding);
      } else {
        req.setEncoding('binary');
      }
      let body = '';
      // let curSize = 0
      req.on('data', (data) => {
        body += data;
        // curSize += data.length
        // fileSize && res.write(`${Number((curSize / Number(fileSize)).toFixed(2)) * 100}%`)
      });
      req.on('end', () => {
        const payload: Record<string, string> = {};
        body
          .split('\r\n')
          .slice(0, 4)
          .forEach((item) => {
            Object.assign(payload, strParse(item, ';', /=|:/));
          });
        const fileContentType = payload['Content-Type'];
        const fileName = Buffer.from(payload['filename'], 'latin1').toString('utf8');
        const fileDataIndex = body.indexOf(fileContentType) + fileContentType.length;
        const fileData = body.substring(fileDataIndex).replace(/^\s+/, '');
        const finalData = fileData.substring(0, fileData.indexOf(`--${boundary}--`));
        fs.writeFile(`${uploadDir}/${fileName}`, finalData, { encoding: 'binary' }, (error) => {
          if (!error) {
            res.setHeader('content-type', 'application/json;charset=UTF-8');
            next();
          } else {
            throw error;
          }
        });
      });
    }
    // TODO
    // application/x-www-form-urlencoded
    // application/json-patch+json
    // application/vnd.api+json
    // application/csp-report
    // text/xml
  };
};

export default bodyMiddleware;
