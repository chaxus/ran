import { describe, expect, it } from 'vitest';
import { getRgb, toRgbArray, toRgbaLittleEndian } from '@/utils/visual/render/utils/index';

describe('getRgb', () => {
  it('解析 #rrggbb', () => {
    expect(getRgb('#ff8040')).toEqual([255, 128, 64]);
    expect(getRgb('#000000')).toEqual([0, 0, 0]);
    expect(getRgb('#ffffff')).toEqual([255, 255, 255]);
  });

  it('解析不带 # 的 rrggbb', () => {
    expect(getRgb('ff8040')).toEqual([255, 128, 64]);
  });

  it('大小写不敏感', () => {
    expect(getRgb('#AABBCC')).toEqual(getRgb('#aabbcc'));
  });

  it('解析 #rgb 简写并扩展成 #rrggbb', () => {
    expect(getRgb('#fff')).toEqual([255, 255, 255]);
    expect(getRgb('#000')).toEqual([0, 0, 0]);
    // a->aa(170) b->bb(187) c->cc(204)
    expect(getRgb('#abc')).toEqual([170, 187, 204]);
  });

  it('对同一颜色重复解析结果一致（命中缓存）', () => {
    expect(getRgb('#123456')).toEqual(getRgb('#123456'));
  });

  it('非十六进制颜色不抛错，返回 [r,g,b] 三元组', () => {
    // node 环境无 document，CSS 颜色走兜底返回黑色；浏览器中会交给 canvas 解析成真实颜色
    const rgb = getRgb('red');
    expect(rgb).toHaveLength(3);
    rgb.forEach((c) => {
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThanOrEqual(255);
    });
  });
});

describe('toRgbArray', () => {
  it('归一化到 0~1', () => {
    expect(toRgbArray('#ffffff')).toEqual([1, 1, 1]);
    expect(toRgbArray('#000000')).toEqual([0, 0, 0]);
    expect(toRgbArray('#ff8040')).toEqual([1, 128 / 255, 64 / 255]);
  });
});

describe('toRgbaLittleEndian', () => {
  it('按小端序 RGBA 打包进一个 u32', () => {
    const packed = toRgbaLittleEndian('#ff8040', 1) >>> 0;
    expect(packed & 0xff).toBe(255); // r 在最低字节
    expect((packed >>> 8) & 0xff).toBe(128); // g
    expect((packed >>> 16) & 0xff).toBe(64); // b
    expect((packed >>> 24) & 0xff).toBe(255); // a 在最高字节
  });

  it('alpha 预乘到 rgb（配合 GPU 后端的 premultiplied alpha 混合）', () => {
    const packed = toRgbaLittleEndian('#ff8040', 0.5) >>> 0;
    expect(packed & 0xff).toBe(Math.round(255 * 0.5)); // r 预乘
    expect((packed >>> 8) & 0xff).toBe(Math.round(128 * 0.5)); // g 预乘
    expect((packed >>> 16) & 0xff).toBe(Math.round(64 * 0.5)); // b 预乘
    expect((packed >>> 24) & 0xff).toBe(Math.round(0.5 * 255)); // a 不预乘
  });

  it('alpha 为 0 时整个 u32 为 0', () => {
    expect(toRgbaLittleEndian('#ffffff', 0) >>> 0).toBe(0);
  });
});
