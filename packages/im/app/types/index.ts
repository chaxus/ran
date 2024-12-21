import type { IncomingMessage, ServerResponse } from 'node:http';
import type { UrlWithParsedQuery } from 'node:url';

export type Controller = Record<string, Record<string, Function>>;

export type Chemical = Record<string, string>;

export type RequestBody = any;

export type ResponseWriteChunk = any;

export interface ContextRquest {
  query: UrlWithParsedQuery['query'];
  params: Chemical;
  body: RequestBody;
  path: string;
  url: string;
}

export interface ContextResponse {
  setHeader: ServerResponse['setHeader'];
  write: (chunk: ResponseWriteChunk, callback?: (error: Error | null | undefined) => void) => boolean;
  type: string;
}

export interface Context {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
  controller: Controller;
  request: ContextRquest;
  response: ContextResponse;
}
