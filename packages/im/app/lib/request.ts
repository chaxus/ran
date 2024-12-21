import url from 'node:url';
import type { UrlWithParsedQuery } from 'node:url';
import type { IncomingMessage } from 'node:http';

export function parseURL(requestUrl: string): { query: UrlWithParsedQuery['query']; params: Record<string, string> } {
  const parsedUrl = url.parse(requestUrl, true);
  const pathname = parsedUrl.pathname || '';
  const query = parsedUrl.query;

  const params = extractParams(pathname, requestUrl);

  return { query, params };
}

export function extractParams(pathname: string, pathPattern: string): Record<string, string> {
  const pathParts = pathname.split('/').filter(Boolean);
  const patternParts = pathPattern.split('/').filter(Boolean);
  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      const paramName = patternParts[i].slice(1);
      params[paramName] = pathParts[i];
    }
  }
  return params;
}

// // 示例使用
// const requestUrl = '/user/123?name=John';
// const pathPattern = '/user/:id';

// const result = parseURL(requestUrl, pathPattern);
// console.log(result);

// // 输出：
// // { query: { name: 'John' }, params: { id: '123' } }

export const handlerQueryParams = (
  req: IncomingMessage,
): { query: UrlWithParsedQuery['query']; params: Record<string, string> } => {
  const url = req.url || '';
  if (url) {
    // 根据 url 处理请求的 params 和 query
    return parseURL(url);
  }
  return { params: {}, query: {} };
};
