// transmitnotice
export const DDTOKEN = '4e6add99ad420323a61b0ad4caa4940ec2806670a20ff00d32adbe84b5346b6c';
export const ADMINISTRATOR = 1;
// serverRenderServer
const HTML_PATH_DEV = '../../views/index.html';
export const FORMAT = 'utf-8';
export const TEMPLATE_REPLACE = '<!--ssr-outlet-->';
const RENDER_PATH_DEV = '/client/server.tsx';
const HTML_PATH_PROD = '../../dist/client/views/index.html';
const RENDER_PATH_PROD = '../../dist/server/server.js';
export const HTML_PATH_MAP: Record<string, string> = {
  dev: HTML_PATH_DEV,
  prod: HTML_PATH_PROD,
};
export const RENDER_PATH_MAP: Record<string, string> = {
  dev: RENDER_PATH_DEV,
  prod: RENDER_PATH_PROD,
};
// serverRender
export const PRODUCTION = 'production';
// static server dir
export const PRODUCTION_DIR = '../../dist/';
export const DEVELOPMENT_DIR = '../../dist/views/';

export const PORT = 30102;
export const LOCAL_URL = `http://localhost:${PORT}`;
