// 支持的形状类型
export enum ShapeType {
  Rectangle = 'rectangle',
  Polygon = 'polygon',
  Circle = 'circle',
  Ellipse = 'ellipse',
  RoundedRectangle = 'rounded rectangle',
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
