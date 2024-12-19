import type { IncomingMessage, ServerResponse } from 'node:http';

export type Controller = Record<string, Record<string, Function>>;

export interface Context {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
  controller: Controller;
  path: string;
}
