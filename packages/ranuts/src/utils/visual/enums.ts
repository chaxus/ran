// Supported shape types
export enum SHAPE_TYPE {
  RECTANGLE = 'rectangle', // rectangle
  POLYGON = 'polygon', // polygon
  CIRCLE = 'circle', // circle
  ELLIPSE = 'ellipse', // ellipse
  ROUNDED_RECTANGLE = 'rounded rectangle', // rounded rectangle
}

export enum LINE_CAP {
  BUTT = 'butt',
  ROUND = 'round',
  SQUARE = 'square',
}

export enum LINE_JOIN {
  MITER = 'miter',
  BEVEL = 'bevel',
  ROUND = 'round',
}

// Renderer types
export enum RENDERER_TYPE {
  WEB_GL = 'webgl',
  CANVAS = 'canvas',
  WEB_GPU = 'webgpu',
}

export const MAX_VERTEX_COUNT = 65536; // maximum supported vertex count

// 2 Float32 for the position plus 4 unsigned bytes for the colour — 12 bytes in total
export const BYTES_PER_VERTEX = 12; // bytes per vertex

export const CONTAINER = 'container';

export const GRAPHICS = 'graphics';

export const OBJECT = 'object';
