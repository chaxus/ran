import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import type { PipeableStream, RenderToPipeableStreamOptions } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import type { Context } from 'koa';
import App from '@/client/app';

export function render(ctx: Context, options: RenderToPipeableStreamOptions = {}): PipeableStream {
  return renderToPipeableStream(
    <StaticRouter location={ctx.path}>
      <App />
    </StaticRouter>,
    options,
  );
}
