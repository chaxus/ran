import { describe, expect, it } from 'vitest';
import { Graphics } from '@/utils/visual/graphics/graphics';
import { Container } from '@/utils/visual/vertex/container';
import { BatchRenderer } from '@/utils/visual/render/batchRenderer';
import { BYTES_PER_VERTEX } from '@/utils/visual/enums';
import type { IApplicationOptions } from '@/utils/visual/types';

// 用一个不依赖 GPU 的假渲染器驱动共享批处理管线（updateChildrenTransform → buildArray
// → Graphics.buildBatches → 三角剖分 → packData），从而在 node 环境下测真实的几何/打包逻辑。
class FakeRenderer extends BatchRenderer {
  public drawCount = 0;
  protected draw(): void {
    this.drawCount++;
  }
  protected updateBuffer(): void {}
  protected setProjectionMatrix(): void {}
  protected setRootTransform(): void {}

  get verts(): Float32Array {
    return this.vertFloatView;
  }
  get indices(): Uint32Array {
    return this.indexBuffer;
  }
  get vCount(): number {
    return this.vertexCount;
  }
  get iCount(): number {
    return this.indexCount;
  }
}

const fakeCanvas = { width: 200, height: 200 } as HTMLCanvasElement;
const opts: IApplicationOptions = { view: fakeCanvas };

const filledRect = (): Container => {
  const stage = new Container();
  const g = new Graphics();
  g.beginFill('#ff0000').drawRect(0, 0, 10, 10).endFill();
  stage.addChild(g);
  return stage;
};

describe('visual/BatchRenderer pipeline', () => {
  it('triangulates a filled rect into a valid vertex/index buffer', () => {
    const r = new FakeRenderer(opts);
    r.render(filledRect());

    expect(r.drawCount).toBe(1);
    expect(r.vCount).toBeGreaterThan(0);
    expect(r.iCount).toBeGreaterThan(0);
    // 索引必须成三角形组，且都指向有效顶点
    expect(r.iCount % 3).toBe(0);
    for (let i = 0; i < r.iCount; i++) {
      expect(r.indices[i]).toBeLessThan(r.vCount);
    }
    // 大数组每个顶点占 BYTES_PER_VERTEX 字节（position 2×f32 + color 1×u32）
    const floatsPerVertex = BYTES_PER_VERTEX / 4;
    expect(r.verts.length).toBeGreaterThanOrEqual(r.vCount * floatsPerVertex);
  });

  it('keeps rendering on subsequent frames via the update path', () => {
    const r = new FakeRenderer(opts);
    const stage = filledRect();
    r.render(stage);
    r.render(stage); // 第二帧走 updateArray 分支，不应崩
    expect(r.drawCount).toBe(2);
  });

  it('rebuilds the batch array when a node is added after the first frame', () => {
    const r = new FakeRenderer(opts);
    const stage = new Container();
    const g1 = new Graphics();
    g1.beginFill('#ffffff').drawRect(0, 0, 10, 10).endFill();
    stage.addChild(g1);
    r.render(stage);
    const afterFirst = r.iCount;
    expect(afterFirst).toBeGreaterThan(0);

    // 首帧之后再添加节点：必须触发重建，索引数增加
    const g2 = new Graphics();
    g2.beginFill('#ff0000').drawRect(0, 0, 10, 10).endFill();
    stage.addChild(g2);
    r.render(stage);
    expect(r.iCount).toBeGreaterThan(afterFirst);
  });

  it('rebuilds when a node is removed after the first frame', () => {
    const r = new FakeRenderer(opts);
    const stage = new Container();
    const g1 = new Graphics();
    g1.beginFill('#ffffff').drawRect(0, 0, 10, 10).endFill();
    const g2 = new Graphics();
    g2.beginFill('#ff0000').drawRect(0, 0, 10, 10).endFill();
    stage.addChild(g1);
    stage.addChild(g2);
    r.render(stage);
    const both = r.iCount;

    stage.removeChild(g2);
    r.render(stage);
    expect(r.iCount).toBeLessThan(both);
    expect(r.iCount).toBeGreaterThan(0);
  });

  it('clear() drops a graphics geometry and redraw brings it back (no stale data)', () => {
    const r = new FakeRenderer(opts);
    const stage = new Container();
    const g = new Graphics();
    g.beginFill('#ffffff').drawRect(0, 0, 10, 10).endFill();
    stage.addChild(g);
    r.render(stage);
    expect(r.iCount).toBeGreaterThan(0);

    g.clear();
    r.render(stage);
    expect(r.iCount).toBe(0); // 清空后重建，没有残留

    g.beginFill('#00ff00').drawCircle(0, 0, 20).endFill();
    r.render(stage);
    expect(r.iCount).toBeGreaterThan(0); // 重绘后又有内容
  });

  it('builds independently per renderer instance (version compare, not a shared flag)', () => {
    const r1 = new FakeRenderer(opts);
    r1.render(filledRect());

    // 旧实现里 needBuildArr 是 static，r1 构建后会把它置 false，导致 r2 跳过构建、缓冲区为空。
    const r2 = new FakeRenderer(opts);
    r2.render(filledRect());

    expect(r1.iCount).toBeGreaterThan(0);
    expect(r2.iCount).toBeGreaterThan(0);
  });

  it('Renderer.init() resolves so Application.create can await any backend', async () => {
    const r = new FakeRenderer(opts);
    await expect(r.init()).resolves.toBeUndefined();
  });
});

describe('visual/Transform via Container', () => {
  it('keeps a finite world transform after scale/skew/rotation (ObservablePoint forwards x/y)', () => {
    const c = new Container();
    c.position.set(100, 50);
    c.scale.set(2, 3); // 旧 bug：set 不转发 x/y → onScaleChange 收到 undefined → 整个矩阵 NaN
    c.skew.set(0.1, 0.2);
    c.rotation = Math.PI / 6;
    c.updateTransform();

    const wt = c.worldTransform;
    for (const v of [wt.a, wt.b, wt.c, wt.d, wt.tx, wt.ty]) {
      expect(Number.isFinite(v)).toBe(true);
    }
    // 平移（pivot 为 0）应原样体现在世界矩阵里
    expect(wt.tx).toBeCloseTo(100, 6);
    expect(wt.ty).toBeCloseTo(50, 6);
  });
});
