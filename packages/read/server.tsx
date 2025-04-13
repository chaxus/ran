import { renderToString } from 'react-dom/server';
import type { RenderToPipeableStreamOptions } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { App } from './app';
import { base } from './router';
export function render(path: string = '/', options: RenderToPipeableStreamOptions = {}): string {
  return renderToString(
    <StaticRouter location={`${base}${path}`}>
      <App />
    </StaticRouter>,
    options,
  );
}
