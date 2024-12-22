interface Polygon {
  path: string;
  color: string;
}
/**
 * @description: 随机的主题色
 */
export const themes = [
  '520339-780650-9e1068-c41d7f-eb2f96'.split('-').map((a) => `#${a}`), // Magenta / 法式洋红
  '120338-22075e-391085-531dab-722ed1'.split('-').map((a) => `#${a}`), // Golden Purple / 酱紫
  'd1f0b1-b6cb9e-92b4a7-8c8a93-81667a'.split('-').map((a) => `#${a}`), // Geek Blue / 极客蓝
  '030852-061178-10239e-1d39c4-2f54eb'.split('-').map((a) => `#${a}`), // Polar Green / 极光绿
  '5c0011-820014-a8071a-cf1322-f5222d'.split('-').map((a) => `#${a}`), // Dust Red / 薄暮
  '613400-874d00-ad6800-d48806-faad14'.split('-').map((a) => `#${a}`), // Calendula Gold / 金盏花
  '000000-141414-1f1f1f-262626-434343'.split('-').map((a) => `#${a}`), // gray
  '002329-00474f-006d75-08979c-13c2c2'.split('-').map((a) => `#${a}`), // Cyan / 明青
  '002766-003a8c-0050b3-096dd9-1890ff'.split('-').map((a) => `#${a}`), // Daybreak Blue / 拂晓蓝
  '254000-3f6600-5b8c00-7cb305-a0d911'.split('-').map((a) => `#${a}`), // Lime / 青柠
];
/**
 * @description: 含最大值，含最小值的随机数
 * @param {number} minimum
 * @param {number} maximum
 * @return {*}
 */
export const getRandomNumberForRange = (minimum: number, maximum: number): number => {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * @description: 随机生成毛玻璃特效背景
 * @param {number} number 背景多边形的个数
 * @param {number} maxSides 多边形的边数
 * @return {*}
 */
export const randomGeneratePolygon = (number: number = 3, maxSides: number = 10): Array<Polygon> => {
  // 渲染几个多边形（这里只有 3 个）
  const polygonList = new Array(number).fill([]);
  // 随机这几个多边形的颜色数组
  const polygonColorArray = getRandomNumberForRange(0, themes.length - 1);
  // 遍历每个多边形
  return polygonList.map((_, index) => {
    // 1.首先获取每个多边形随机的边数
    const num = new Array(getRandomNumberForRange(3, maxSides)).fill([]);
    // 2.然后计算每个角的坐标
    const coordinates = num.map(() => {
      // 获取 x 坐标（这里三个图形各三分之一，所以使用三等分）
      const x = getRandomNumberForRange((100 / number) * index, (100 / number) * (index + 1));
      // 获取 y 坐标
      const y = getRandomNumberForRange(0, 100);

      return [`${x}%`, `${y}%`];
    });

    // 3.根据得到的坐标，生成 clip-path 字符串，n 条边即是 n 个角，n 个坐标，坐标范围要在画布最大最小的范围内
    let clipPathStr = '';
    coordinates.forEach((i) => {
      const str = `${i[0]} ${i[1]},`;
      clipPathStr += str;
    });

    return {
      path: `polygon(${clipPathStr.slice(0, clipPathStr.length - 1)})`,
      color: themes[polygonColorArray][index],
    };
  });
};

