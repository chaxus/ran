import { afterEach, describe, expect, it, vi } from 'vitest';
import { Glass } from '@/components/glass';
import '@/components/glass';
import { createRimRenderer } from '@/components/glass/rim';
import { createWebGpuRim } from '@/components/glass/rim-webgpu';

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
function gpuFixture() {
  const lost = deferred<GPUDeviceLostInfo>();
  const device = {
    lost: lost.promise,
    destroy: vi.fn(),
    createShaderModule: vi.fn(() => ({})),
    createRenderPipeline: vi.fn(() => ({ getBindGroupLayout: vi.fn() })),
    createBuffer: vi.fn(() => ({ destroy: vi.fn() })),
    createBindGroup: vi.fn(),
    queue: { writeBuffer: vi.fn(), submit: vi.fn() },
    createCommandEncoder: vi.fn(() => ({
      beginRenderPass: () => ({ setPipeline() {}, setBindGroup() {}, draw() {}, end() {} }),
      finish() {},
    })),
  };
  const context = { configure: vi.fn(), unconfigure: vi.fn(), getCurrentTexture: () => ({ createView() {} }) };
  const requestDevice = vi.fn(async () => device);
  Object.defineProperty(navigator, 'gpu', {
    configurable: true,
    value: {
      requestAdapter: vi.fn(async () => ({ requestDevice })),
      getPreferredCanvasFormat: () => 'bgra8unorm',
    },
  });
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(((kind: string) =>
    kind === 'webgpu' ? context : null) as never);
  return { device, context, lost, requestDevice };
}
afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(navigator, 'gpu');
});

describe('Glass resource lifecycle (mock GPU protocol, not rendering)', () => {
  it('defers rim allocation until connection and releases observer/canvas on removal, recreating on reconnect', () => {
    const disconnect = vi.fn();
    const observe = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = observe;
        disconnect = disconnect;
      },
    );
    const element = document.createElement('r-glass') as Glass;
    element.rim = true;
    expect(element._shadowDom.querySelectorAll('canvas')).toHaveLength(0);
    expect(observe).not.toHaveBeenCalled();
    document.body.append(element);
    const first = element._shadowDom.querySelector('canvas');
    expect(first).not.toBeNull();
    element.remove();
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(element._shadowDom.querySelectorAll('canvas')).toHaveLength(0);
    element.rim = false;
    element.rim = true;
    expect(observe).toHaveBeenCalledTimes(1);
    document.body.append(element);
    expect(element._shadowDom.querySelector('canvas')).not.toBe(first);
    expect(observe).toHaveBeenCalledTimes(2);
  });

  it('disposes a GPU device arriving after the owning component disconnected', async () => {
    const { device, requestDevice } = gpuFixture();
    const pending = deferred<typeof device>();
    requestDevice.mockReturnValue(pending.promise);
    const element = document.createElement('r-glass') as Glass;
    element.rim = true;
    document.body.append(element);
    await Promise.resolve();
    element.remove();
    pending.resolve(device);
    await vi.waitFor(() => expect(device.destroy).toHaveBeenCalledTimes(1));
    expect(element._shadowDom.querySelectorAll('canvas')).toHaveLength(0);
  });

  it('ignores queued resize work and device loss after renderer destruction', async () => {
    const { device, lost, context } = gpuFixture();
    let resize!: () => void;
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    const container = document.createElement('div');
    const renderer = createRimRenderer(container);
    await vi.waitFor(() => expect(container.children).toHaveLength(1));
    renderer.destroy();
    const draws = device.queue.submit.mock.calls.length;
    resize();
    renderer.setRadius(42);
    lost.resolve({ reason: 'destroyed', message: 'intentional cleanup' });
    await Promise.resolve();
    expect(device.queue.submit).toHaveBeenCalledTimes(draws);
    expect(device.destroy).toHaveBeenCalledTimes(1);
    expect(context.unconfigure).toHaveBeenCalledTimes(1);
    expect(container.children).toHaveLength(0);
  });

  it('cleans a device when canvas setup is unavailable or throws', async () => {
    const { device, context } = gpuFixture();
    const canvas = document.createElement('canvas');
    vi.mocked(canvas.getContext).mockReturnValueOnce(null);
    expect(await createWebGpuRim(canvas)).toBeNull();
    expect(device.destroy).toHaveBeenCalledTimes(1);
    context.configure.mockImplementationOnce(() => {
      throw new Error('configuration failed');
    });
    expect(await createWebGpuRim(canvas)).toBeNull();
    expect(device.destroy).toHaveBeenCalledTimes(2);
  });

  it('falls back to a fresh WebGL/CSS canvas after successful WebGPU device loss', async () => {
    const { device, lost, context } = gpuFixture();
    const container = document.createElement('div');
    document.body.append(container);
    const renderer = createRimRenderer(container);
    await vi.waitFor(() => expect(container.children).toHaveLength(1));
    const gpuCanvas = container.firstElementChild;
    lost.resolve({ reason: 'unknown', message: 'test loss' });
    await vi.waitFor(() => expect(container.firstElementChild).not.toBe(gpuCanvas));
    expect(container.children).toHaveLength(1);
    expect(context.unconfigure).toHaveBeenCalledTimes(1);
    expect(device.destroy).toHaveBeenCalledTimes(1);
    renderer.destroy();
    renderer.destroy();
    expect(device.destroy).toHaveBeenCalledTimes(1);
    expect(container.children).toHaveLength(0);
  });
});
