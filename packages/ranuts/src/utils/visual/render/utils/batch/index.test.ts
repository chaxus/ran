import { describe, expect, it } from 'vitest';
import { GraphicsBatch } from '@/utils/visual/render/utils/batch/index';
import type { Graphics } from '@/utils/visual/graphics';

// 每个顶点在大数组中占 3 个 32 位槽：[x(float), y(float), rgba(uint)]
const STEP = 3;

interface FakeTransform {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

const IDENTITY: FakeTransform = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };

/** 构造一个仅含 packVertices / packIndices / updateVertices 所需字段的最小 Graphics 桩 */
const makeGraphics = (vertices: number[], indices: number[], worldTransform: FakeTransform = IDENTITY): Graphics => {
  return {
    geometry: {
      vertices: { data: new Float32Array(vertices) },
      indices: { data: new Uint32Array(indices) },
    },
    worldTransform,
  } as unknown as Graphics;
};

/** 共享同一 ArrayBuffer 的 float / int 双视图，与真实大数组布局一致 */
const makeViews = (vertexSlots: number) => {
  const buffer = new ArrayBuffer(vertexSlots * STEP * 4);
  return { floatView: new Float32Array(buffer), intView: new Uint32Array(buffer) };
};

describe('GraphicsBatch.packIndices', () => {
  it('索引整体平移 vertexStart，并从 indexStart 处写入', () => {
    const batch = new GraphicsBatch();
    batch.graphics = makeGraphics([], [0, 1, 2, 0, 2, 3]);
    batch.indexOffset = 3; // 只取第二个三角形
    batch.indexCount = 3;
    batch.indexStart = 10; // 写入大数组的起点
    batch.vertexStart = 5; // 该 batch 顶点在大数组里的起点

    const int32 = new Uint32Array(16);
    batch.packIndices(int32);

    // indices[3,4,5] = [0,2,3]，各自 + vertexStart(5) => [5,7,8]，落在 [10,11,12]
    expect(Array.from(int32.slice(10, 13))).toEqual([5, 7, 8]);
    // indexStart 之前的位置不被污染
    expect(int32[9]).toBe(0);
  });

  it('vertexStart=0 / indexStart=0 时索引原样拷贝', () => {
    const batch = new GraphicsBatch();
    batch.graphics = makeGraphics([], [0, 1, 2]);
    batch.indexOffset = 0;
    batch.indexCount = 3;
    batch.indexStart = 0;
    batch.vertexStart = 0;

    const int32 = new Uint32Array(4);
    batch.packIndices(int32);
    expect(Array.from(int32.slice(0, 3))).toEqual([0, 1, 2]);
  });
});

describe('GraphicsBatch.packVertices', () => {
  it('恒等变换：顶点位置拷贝到 vertexStart 偏移处，颜色写入第 3 个槽', () => {
    const batch = new GraphicsBatch();
    batch.graphics = makeGraphics([10, 20, 30, 40], []);
    batch.vertexCount = 2;
    batch.vertexOffset = 0;
    batch.vertexStart = 1; // 前面已占 1 个顶点（3 个槽）
    batch.rgba = 0x11223344;

    const { floatView, intView } = makeViews(3); // 1 占位 + 2 本批
    batch.packVertices(floatView, intView);

    // 顶点 0 -> 槽 3,4,5
    expect(floatView[3]).toBe(10);
    expect(floatView[4]).toBe(20);
    expect(intView[5]).toBe(0x11223344);
    // 顶点 1 -> 槽 6,7,8
    expect(floatView[6]).toBe(30);
    expect(floatView[7]).toBe(40);
    expect(intView[8]).toBe(0x11223344);
  });

  it('应用 worldTransform：realX=a*x+c*y+tx, realY=b*x+d*y+ty', () => {
    const transform: FakeTransform = { a: 2, b: 0, c: 0, d: 2, tx: 5, ty: 7 };
    const batch = new GraphicsBatch();
    batch.graphics = makeGraphics([10, 20], [], transform);
    batch.vertexCount = 1;
    batch.vertexOffset = 0;
    batch.vertexStart = 0;
    batch.rgba = 0;

    const { floatView, intView } = makeViews(1);
    batch.packVertices(floatView, intView);

    expect(floatView[0]).toBe(2 * 10 + 0 * 20 + 5); // 25
    expect(floatView[1]).toBe(0 * 10 + 2 * 20 + 7); // 47
  });

  it('vertexOffset 跳过 geometry 中前置顶点', () => {
    const batch = new GraphicsBatch();
    // geometry 有 2 个顶点，本批只取第二个
    batch.graphics = makeGraphics([1, 2, 99, 88], []);
    batch.vertexCount = 1;
    batch.vertexOffset = 1;
    batch.vertexStart = 0;
    batch.rgba = 0;

    const { floatView, intView } = makeViews(1);
    batch.packVertices(floatView, intView);
    expect(floatView[0]).toBe(99);
    expect(floatView[1]).toBe(88);
  });
});

describe('GraphicsBatch.updateVertices', () => {
  it('仅重算位置，保留已写入的颜色', () => {
    const batch = new GraphicsBatch();
    batch.graphics = makeGraphics([10, 20], []);
    batch.vertexCount = 1;
    batch.vertexOffset = 0;
    batch.vertexStart = 0;
    batch.rgba = 0xdeadbeef;

    const { floatView, intView } = makeViews(1);
    batch.packVertices(floatView, intView);
    expect(intView[2]).toBe(0xdeadbeef);

    // 变换更新后只动位置
    (batch.graphics as unknown as { worldTransform: FakeTransform }).worldTransform = {
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      tx: 100,
      ty: 200,
    };
    batch.updateVertices(floatView);

    expect(floatView[0]).toBe(110); // 10 + 100
    expect(floatView[1]).toBe(220); // 20 + 200
    expect(intView[2]).toBe(0xdeadbeef); // 颜色槽未被触碰
  });
});
