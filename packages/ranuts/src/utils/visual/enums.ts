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
}
