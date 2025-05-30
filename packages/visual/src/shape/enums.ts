// 支持的形状类型
export enum SHAPE_TYPE {
  RECTANGLE = 'rectangle', // 矩形
  POLYGON = 'polygon', // 多边形
  CIRCLE = 'circle', // 圆形
  ELLIPSE = 'ellipse', // 椭圆
  ROUNDED_RECTANGLE = 'rounded rectangle', // 圆角矩形
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
