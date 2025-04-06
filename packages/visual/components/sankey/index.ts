import { addNumSym, transformNumber } from 'ranuts/utils';
import { Application } from '../../src/application';
// import { Graphics } from '@/src/graphics';
interface ISankeyOptions {
  data: ISankeyData;
}

interface ISankeyNode {
  key: string;
  level: number;
  cate: string;
  name?: string;
  value?: string;
  yoy?: string;
  textPosition?: string;
  fontSize?: number;
  width?: number; // 宽度的倍，默认是 1
  children?: ISankeyNode[];
}

interface ISankeyLink {
  source: string;
  target: string;
  value: number;
}

interface ISankeyData {
  nodes: ISankeyNode[];
  links: ISankeyLink[];
  order: string[];
  basis: string;
}

// 有父子节点的数据
// const numchildrenData = {
//   title: '2024 Annual',
//   nodes: [
//     {
//       key: 'bus_158473',
//       name: 'Taobao and Tmall Group',
//       value: '434893000000',
//       yoy: '5.24847170660639',
//       level: 1,
//       cate: 'revenue',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'bus_120129',
//       name: 'All Others',
//       value: '192331000000',
//       yoy: '-2.42700961367729',
//       level: 1,
//       cate: 'revenue',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'bus_158042',
//       name: 'Cloud Intelligence Group',
//       value: '106374000000',
//       yoy: '2.77979071857155',
//       level: 1,
//       cate: 'revenue',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'bus_158474',
//       name: 'Alibaba International Digital Commerce',
//       value: '102598000000',
//       yoy: '45.51669361472782',
//       level: 1,
//       cate: 'revenue',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'bus_158475',
//       name: 'Cainiao Smart Logistics Network Limited',
//       value: '99020000000',
//       yoy: '27.74796160594489',
//       level: 1,
//       cate: 'revenue',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'bus_158472',
//       name: 'Local Services Group',
//       value: '59802000000',
//       yoy: '19.01132360843002',
//       level: 1,
//       cate: 'revenue',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'bus_158041',
//       name: 'Digital Media and Entertainment Group',
//       value: '21145000000',
//       yoy: '14.64432877900672',
//       level: 1,
//       cate: 'revenue',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'bus_119217',
//       name: 'Unallocated',
//       value: '1297000000',
//       yoy: '49.76905311778291',
//       level: 1,
//       cate: 'revenue',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'total_revf',
//       name: '',
//       value: '1017460000000',
//       yoy: '8.34374176199252',
//       level: 2,
//       cate: 'revenue',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       width: 2,
//       children: [
//         {
//           key: 'total_rev',
//           name: 'Total Revenue',
//           value: '941168000000',
//           yoy: '8.34374176199252',
//           level: 2,
//           cate: 'revenue',
//           type: 0,
//           textPosition: 'top',
//           fontSize: 14,
//           children: [],
//         },
//         {
//           key: 'bus_s_119345',
//           name: '',
//           value: '76292000000',
//           yoy: '',
//           level: 2,
//           cate: 'expenses',
//           type: 0,
//           textPosition: '',
//           fontSize: 0,
//           children: [],
//         },
//       ],
//     },
//     {
//       key: 'gp',
//       name: 'Gross Profit',
//       value: '354845000000',
//       yoy: '',
//       level: 3,
//       cate: 'income',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'cost_rev',
//       name: 'Cost Of Revenues',
//       value: '586323000000',
//       yoy: '',
//       level: 3,
//       cate: 'expenses',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'oper_inc',
//       name: 'Operating Income',
//       value: '138718000000',
//       yoy: '',
//       level: 4,
//       cate: 'income',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'oper_fee',
//       name: 'Operating Exp.',
//       value: '216127000000',
//       yoy: '',
//       level: 4,
//       cate: 'expenses',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'ni',
//       name: 'Net Income',
//       value: '80009000000',
//       yoy: '',
//       level: 5,
//       cate: 'income',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'inc_tax',
//       name: 'Income Tax Exp.',
//       value: '22529000000',
//       yoy: '',
//       level: 5,
//       cate: 'expenses',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'sga',
//       name: 'SG& A Exp.',
//       value: '157126000000',
//       yoy: '',
//       level: 5,
//       cate: 'expenses',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'rd_exp',
//       name: 'R&D Exp.',
//       value: '52256000000',
//       yoy: '',
//       level: 5,
//       cate: 'expenses',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'bus_119345',
//       name: 'Inter-Segment Elimination',
//       value: '76292000000',
//       yoy: '',
//       level: 3,
//       cate: 'expenses',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'other_f41',
//       name: 'Other',
//       value: '36180000000',
//       yoy: '',
//       level: 5,
//       cate: 'expenses',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//     {
//       key: 'other_f42',
//       name: 'Other',
//       value: '6745000000',
//       yoy: '',
//       level: 5,
//       cate: 'expenses',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//     },
//   ],
//   links: [
//     {
//       source: 'bus_158473',
//       target: 'total_revf',
//     },
//     {
//       source: 'bus_120129',
//       target: 'total_revf',
//     },
//     {
//       source: 'bus_158042',
//       target: 'total_revf',
//     },
//     {
//       source: 'bus_158474',
//       target: 'total_revf',
//     },
//     {
//       source: 'bus_158475',
//       target: 'total_revf',
//     },
//     {
//       source: 'bus_158472',
//       target: 'total_revf',
//     },
//     {
//       source: 'bus_158041',
//       target: 'total_revf',
//     },
//     {
//       source: 'bus_119217',
//       target: 'total_revf',
//     },
//     {
//       source: 'total_rev',
//       target: 'gp',
//     },
//     {
//       source: 'total_rev',
//       target: 'cost_rev',
//     },
//     {
//       source: 'gp',
//       target: 'oper_inc',
//     },
//     {
//       source: 'gp',
//       target: 'oper_fee',
//     },
//     {
//       source: 'oper_inc',
//       target: 'ni',
//     },
//     {
//       source: 'oper_inc',
//       target: 'inc_tax',
//     },
//     {
//       source: 'oper_fee',
//       target: 'sga',
//     },
//     {
//       source: 'oper_fee',
//       target: 'rd_exp',
//     },
//     {
//       source: 'bus_s_119345',
//       target: 'bus_119345',
//     },
//     {
//       source: 'oper_inc',
//       target: 'other_f41',
//     },
//     {
//       source: 'oper_fee',
//       target: 'other_f42',
//     },
//   ],
//   order: [
//     'bus_158473',
//     'bus_120129',
//     'bus_158042',
//     'bus_158474',
//     'bus_158475',
//     'bus_158472',
//     'bus_158041',
//     'bus_119217',
//     'total_revf',
//     'total_rev',
//     'bus_s_119345',
//     'gp',
//     'cost_rev',
//     'bus_119345',
//     'oper_inc',
//     'oper_fee',
//     'ni',
//     'inc_tax',
//     'other_f41',
//     'sga',
//     'rd_exp',
//     'other_f42',
//   ],
//   basis: '941168000000',
// };
// 节点基础宽度和高度
const NODE_BASE_WIDTH = 10;
const NODE_BASE_HEIGHT = 120;
const FONT_SIZE_DEFAULT = 12; // 文本字体大小
const FONT_FAMILY = 'PingFang SC';
// const GOLDEN_RATIO = 0.382; // 黄金分割比例
const TEXT_MAX_WIDTH = 120; // 文本最大宽度
const LAYER_BASE_SPACE = 80; // 层级间距
const BASE_CROSS_SPACE = 2; // 横向间距
const BASE_VERTICAL_SPACE = 4; // 纵向间距
const FONT_WEIGHT = 'normal';

enum TEXT_POSITION {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

// 无左值节点
// const nochildrenData = {
//   title: '2018 Annual',
//   nodes: [
//     {
//       key: 'total_rev',
//       name: 'Total Revenue',
//       value: '250266000000',
//       yoy: '',
//       level: 2,
//       cate: 'revenue',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//       radio: '',
//     },
//     {
//       key: 'gp',
//       name: 'Gross Profit',
//       value: '144023000000',
//       yoy: '',
//       level: 3,
//       cate: 'income',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//       radio: '',
//     },
//     {
//       key: 'cost_rev',
//       name: 'Cost Of Revenues',
//       value: '106243000000',
//       yoy: '',
//       level: 3,
//       cate: 'expenses',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//       radio: '',
//     },
//     {
//       key: 'oper_inc',
//       name: 'Operating Income',
//       value: '70609000000',
//       yoy: '',
//       level: 4,
//       cate: 'income',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//       radio: '',
//     },
//     {
//       key: 'oper_fee',
//       name: 'Operating Exp.',
//       value: '73414000000',
//       yoy: '',
//       level: 4,
//       cate: 'expenses',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//       radio: '',
//     },
//     {
//       key: 'ni',
//       name: 'Net Income',
//       value: '64093000000',
//       yoy: '',
//       level: 5,
//       cate: 'income',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//       radio: '',
//     },
//     {
//       key: 'inc_tax',
//       name: 'Income Tax Exp.',
//       value: '18199000000',
//       yoy: '',
//       level: 5,
//       cate: 'expenses',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//       radio: '',
//     },
//     {
//       key: 'sga',
//       name: 'SG& A Exp.',
//       value: '43540000000',
//       yoy: '',
//       level: 5,
//       cate: 'expenses',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//       radio: '',
//     },
//     {
//       key: 'rd_exp',
//       name: 'R&D Exp.',
//       value: '22754000000',
//       yoy: '',
//       level: 5,
//       cate: 'expenses',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//       radio: '',
//     },
//     {
//       key: 'other_f41',
//       name: 'Other',
//       value: '11683000000',
//       yoy: '',
//       level: 4,
//       cate: 'income',
//       type: 1,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//       radio: '',
//     },
//     {
//       key: 'other_f42',
//       name: 'Other',
//       value: '7120000000',
//       yoy: '',
//       level: 5,
//       cate: 'expenses',
//       type: 0,
//       textPosition: '',
//       fontSize: 0,
//       children: [],
//       radio: '',
//     },
//   ],
//   links: [
//     {
//       source: 'total_rev',
//       target: 'gp',
//     },
//     {
//       source: 'total_rev',
//       target: 'cost_rev',
//     },
//     {
//       source: 'gp',
//       target: 'oper_inc',
//     },
//     {
//       source: 'gp',
//       target: 'oper_fee',
//     },
//     {
//       source: 'other_f41',
//       target: 'ni',
//     },
//     {
//       source: 'oper_inc',
//       target: 'ni',
//     },
//     {
//       source: 'oper_inc',
//       target: 'inc_tax',
//     },
//     {
//       source: 'oper_fee',
//       target: 'sga',
//     },
//     {
//       source: 'oper_fee',
//       target: 'rd_exp',
//     },
//     {
//       source: 'oper_fee',
//       target: 'other_f42',
//     },
//   ],
//   order: [
//     'total_rev',
//     'gp',
//     'cost_rev',
//     'other_f41',
//     'oper_inc',
//     'oper_fee',
//     'ni',
//     'inc_tax',
//     'sga',
//     'rd_exp',
//     'other_f42',
//   ],
//   basis: '250266000000',
// };

// 桑基图
export class Sankey {
  vessel: Application;
  options: ISankeyOptions;
  layers: ISankeyNode[][] = [];
  layerStats: { width: number; height: number }[] = [];
  ctx: CanvasRenderingContext2D;
  constructor(options: ISankeyOptions) {
    this.options = options;
    this.vessel = new Application();
    this.ctx = this.vessel.view.getContext('2d')!;
    // 计算容器宽高
    const { width, height } = this.computeSize();
    this.vessel.view.width = width;
    this.vessel.view.height = height;
    // 创建图层
    this.createLayer();
  }
  // 文字过长展示省略号
  private textEllipsis = (text: string, width: number): string => {
    const ctx = this.vessel.view.getContext('2d')!;
    const textWidth = ctx.measureText(text).width;
    if (textWidth > width) {
      const ellipsis = '...';
      const ellipsisWidth = ctx.measureText(ellipsis).width;
      const len = text.length;
      for (let i = len; i >= 0; i--) {
        const newText = text.substring(0, i);
        const newWidth = ctx.measureText(newText).width;
        if (newWidth + ellipsisWidth <= width) {
          return newText + ellipsis;
        }
      }
    }
    return text;
  };
  private computeNodeSize = (node: ISankeyNode): { width: number; height: number } => {
    let layerWidth = 0;
    let layerHeight = 0;
    const { data } = this.options;
    const { basis } = data;
    const {
      width = 1,
      name = '',
      value = '',
      yoy = '',
      textPosition = '',
      fontSize = FONT_SIZE_DEFAULT,
      children = [],
    } = node;
    const ctx = this.vessel.view.getContext('2d')!;
    ctx.font = `${FONT_WEIGHT} ${fontSize}px ${FONT_FAMILY}`;
    const nodeWidth = width * NODE_BASE_WIDTH;
    const nodeHeight = NODE_BASE_HEIGHT * (Number(value) / Number(basis));
    const textWidth = Math.max(
      [this.textEllipsis(name, TEXT_MAX_WIDTH), addNumSym(yoy)].reduce((acc, cur) => {
        return acc + ctx.measureText(cur).width;
      }, 0),
      ctx.measureText(transformNumber(value)).width,
    );
    const textHeight = fontSize + BASE_VERTICAL_SPACE + fontSize;
    if (textPosition === TEXT_POSITION.TOP || textPosition === TEXT_POSITION.BOTTOM) {
      layerWidth = Math.max(layerWidth, Math.max(textWidth, nodeWidth)) + BASE_CROSS_SPACE;
      layerHeight += Math.max(layerHeight, nodeHeight + BASE_VERTICAL_SPACE + textHeight) + BASE_VERTICAL_SPACE;
    }
    if (textPosition === TEXT_POSITION.LEFT) {
      layerWidth = Math.max(layerWidth, nodeWidth + BASE_CROSS_SPACE + textWidth) + BASE_CROSS_SPACE;
      layerHeight += Math.max(layerHeight, Math.max(nodeHeight, textHeight)) + BASE_VERTICAL_SPACE;
    }
    if (textPosition === TEXT_POSITION.RIGHT) {
      layerWidth =
        Math.max(layerWidth, Math.max(nodeWidth + BASE_CROSS_SPACE + textWidth, LAYER_BASE_SPACE)) + BASE_CROSS_SPACE;
      layerHeight += Math.max(layerHeight, Math.max(nodeHeight, textHeight)) + BASE_VERTICAL_SPACE;
    }
    if (children.length > 0) {
      children.forEach((child: ISankeyNode) => {
        const { width, height } = this.computeNodeSize(child);
        layerWidth = Math.max(layerWidth, width);
        layerHeight = Math.max(layerHeight, height);
      });
    }
    return { width: layerWidth, height: layerHeight };
  };
  // 根据属性计算容器宽高
  private computeSize = (): { width: number; height: number } => {
    const { data } = this.options;
    const { nodes = [] } = data;
    let width = 0;
    let height = 0;
    this.layers = [];
    this.layerStats = [];
    nodes.forEach((node: ISankeyNode) => {
      // 按照层级归类
      if (this.layers[node.level]) {
        this.layers[node.level].push(node);
      } else {
        this.layers[node.level] = [node];
      }
    });
    this.layers.forEach((layer: ISankeyNode[]) => {
      let layerWidth = 0;
      let layerHeight = 0;
      layer.forEach((node: ISankeyNode) => {
        const { width, height } = this.computeNodeSize(node);
        layerWidth = Math.max(layerWidth, width);
        layerHeight += height;
      });
      width += layerWidth;
      height = Math.max(height, layerHeight);
      this.layerStats.push({ width: layerWidth, height: layerHeight });
    });
    return { width, height };
  };
  // 创建图层
  createLayer = (): void => {
    // TODO: 需要实现 css 布局
    // 1. position: top, bottom, left, right, relative, absolute
    // 2. margin: margin-top, margin-bottom, margin-left, margin-right
    // 3. padding: padding-top, padding-bottom, padding-left, padding-right
    // 4. flex: flex-direction, flex-wrap, justify-content, align-items, align-content
    // 5. getBoundingClientRect
    // const { data } = this.options;
    // const { nodes = [], basis } = data;
    // const { width, height } = this.vessel.view;
    // const ctx = this.vessel.view.getContext('2d')!;
    // const layerStats = this.computeLayerStats();
    // this.layers.forEach((layer: ISankeyNode[], index: number) => {
    //   const startX = layerStats[index].width - layerStats[Math.max(index - 1, 0)].width;
    //   const startY = (height - layerStats[index].height) / 2;
    //   const container = new Graphics();
    //   container.drawRect(startX, startY, layerStats[index].width, layerStats[index].height);
    //   layer.forEach((node: ISankeyNode) => {});
    // });
  };
  // 计算 this.layerStats 的前序和
  private computeLayerStats = (): { width: number; height: number }[] => {
    return this.layerStats.map((_, index) => {
      return this.layerStats.slice(0, index).reduce(
        (acc, cur) => {
          return { width: acc.width + cur.width, height: acc.height + cur.height };
        },
        { width: 0, height: 0 },
      );
    });
  };
}
