// 支持的形状类型
export enum ShapeType {
  Rectangle = 'rectangle', // 矩形
  Polygon = 'polygon', // 多边形
  Circle = 'circle', // 圆形
  Ellipse = 'ellipse', // 椭圆
  RoundedRectangle = 'rounded rectangle', // 圆角矩形
}

export enum LineCap {
  Butt = 'butt',
  Round = 'round',
  Square = 'square',
}

export enum LineJoin {
  Miter = 'miter',
  Bevel = 'bevel',
  Round = 'round',
}

// 渲染器类型
export enum RendererType {
  WebGl = 'webgl',
  Canvas = 'canvas',
  WEB_GPU = 'webgpu',
}

export const MAX_VERTEX_COUNT = 65536; // 支持的最大的顶点数量

// 顶点位置 2 个 Float32，顶点颜色 4 个 Unsigned Byte，一共 12 个 byte
export const BYTES_PER_VERTEX = 12; // 每个顶点占多少字节
