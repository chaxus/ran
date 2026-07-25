import { describe, expect, it } from 'vitest';
import { GraphicsBatch } from '@/utils/visual/render/utils/batch/index';
import type { Graphics } from '@/utils/visual/graphics';

// Each vertex occupies 3 32-bit slots in the big array: [x(float), y(float), rgba(uint)]
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

/** A minimal Graphics stub carrying only what packVertices / packIndices / updateVertices need */
const makeGraphics = (vertices: number[], indices: number[], worldTransform: FakeTransform = IDENTITY): Graphics => {
  return {
    geometry: {
      vertices: { data: new Float32Array(vertices) },
      indices: { data: new Uint32Array(indices) },
    },
    worldTransform,
  } as unknown as Graphics;
};

/** Paired float / int views over one ArrayBuffer, matching the real big array's layout */
const makeViews = (vertexSlots: number) => {
  const buffer = new ArrayBuffer(vertexSlots * STEP * 4);
  return { floatView: new Float32Array(buffer), intView: new Uint32Array(buffer) };
};

describe('GraphicsBatch.packIndices', () => {
  it('shifts every index by vertexStart and writes from indexStart', () => {
    const batch = new GraphicsBatch();
    batch.graphics = makeGraphics([], [0, 1, 2, 0, 2, 3]);
    batch.indexOffset = 3; // take only the second triangle
    batch.indexCount = 3;
    batch.indexStart = 10; // where writing into the big array starts
    batch.vertexStart = 5; // where this batch's vertices start in the big array

    const int32 = new Uint32Array(16);
    batch.packIndices(int32);

    // indices[3,4,5] = [0,2,3], each + vertexStart(5) => [5,7,8], landing at [10,11,12]
    expect(Array.from(int32.slice(10, 13))).toEqual([5, 7, 8]);
    // Nothing before indexStart is touched
    expect(int32[9]).toBe(0);
  });

  it('copies the indices verbatim when vertexStart and indexStart are 0', () => {
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
  it('identity transform: positions are copied to the vertexStart offset and the colour lands in the third slot', () => {
    const batch = new GraphicsBatch();
    batch.graphics = makeGraphics([10, 20, 30, 40], []);
    batch.vertexCount = 2;
    batch.vertexOffset = 0;
    batch.vertexStart = 1; // one vertex (3 slots) already taken
    batch.rgba = 0x11223344;

    const { floatView, intView } = makeViews(3); // 1 placeholder + 2 in this batch
    batch.packVertices(floatView, intView);

    // vertex 0 -> slots 3,4,5
    expect(floatView[3]).toBe(10);
    expect(floatView[4]).toBe(20);
    expect(intView[5]).toBe(0x11223344);
    // vertex 1 -> slots 6,7,8
    expect(floatView[6]).toBe(30);
    expect(floatView[7]).toBe(40);
    expect(intView[8]).toBe(0x11223344);
  });

  it('applies worldTransform: realX=a*x+c*y+tx, realY=b*x+d*y+ty', () => {
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

  it('vertexOffset skips the leading vertices in the geometry', () => {
    const batch = new GraphicsBatch();
    // The geometry has 2 vertices; this batch takes only the second
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
  it('recomputes positions only, leaving the written colour alone', () => {
    const batch = new GraphicsBatch();
    batch.graphics = makeGraphics([10, 20], []);
    batch.vertexCount = 1;
    batch.vertexOffset = 0;
    batch.vertexStart = 0;
    batch.rgba = 0xdeadbeef;

    const { floatView, intView } = makeViews(1);
    batch.packVertices(floatView, intView);
    expect(intView[2]).toBe(0xdeadbeef);

    // A transform update moves positions and nothing else
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
    expect(intView[2]).toBe(0xdeadbeef); // the colour slot was untouched
  });
});
