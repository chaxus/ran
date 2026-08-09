/**
 * WebGPU backend for `<r-glass rim>` — the exact same shape-only SDF rim +
 * chromatic fringe as the WebGL backend in `rim.ts`, reimplemented in WGSL.
 * See the module doc in `rim.ts` for what this draws and why it never
 * samples the backdrop; this file is purely an alternate rendering backend
 * for the identical effect, not a different one.
 *
 * WHY THIS EXISTS, GIVEN THE WEBGL PATH ALREADY WORKS EVERYWHERE:
 * It doesn't make this draw any faster. A single draw call, reissued only on
 * resize/radius change, has no per-frame or many-draw-call overhead for
 * WebGPU's command-buffer model to amortize, and the GPU-side shader work (a
 * handful of distance-field evaluations over a thin band of pixels) is
 * microseconds either way — the bottleneck for this workload was never the
 * choice of API. This backend exists because it was explicitly requested,
 * not because it measurably helps this effect; if `rim` ever grows into a
 * heavier multi-pass effect (real per-frame refraction, multiple blur
 * passes), that's the scenario where WebGPU's model would actually start to
 * matter.
 *
 * WHY IT'S A SEPARATE, OPTIONAL UPGRADE INSTEAD OF REPLACING WEBGL:
 * `GPUAdapter`/`GPUDevice` negotiation (`requestAdapter`/`requestDevice`) is
 * asynchronous — unlike `canvas.getContext('webgl')`, which returns
 * synchronously. Blocking the rim's first appearance on that Promise would
 * make an optional decorative layer show up later than the WebGL path does
 * today, for a visually identical result — a real regression for zero gain.
 * So `createRimRenderer` in `rim.ts` always shows the WebGL canvas first and
 * only swaps to this backend if/when the negotiation here resolves.
 */

// TypeScript's DOM lib ships full WebGPU interface types, but not the
// `GPUBufferUsage`/`GPUTextureUsage`/etc. flag namespaces as global values in
// every lib snapshot — so these are the literal bit values from the WebGPU
// spec (§ GPUBufferUsage) rather than symbolic constants.
const BUFFER_USAGE_UNIFORM = 0x40;
const BUFFER_USAGE_COPY_DST = 0x08;

const SHADER_SRC = `
struct Uniforms {
  resolution: vec2<f32>,
  radius: f32,
  dpr: f32,
};
@group(0) @binding(0) var<uniform> u: Uniforms;

fn sdRoundRect(p: vec2<f32>, halfSize: vec2<f32>, r: f32) -> f32 {
  let q = abs(p) - halfSize + r;
  return length(max(q, vec2<f32>(0.0, 0.0))) + min(max(q.x, q.y), 0.0) - r;
}

@vertex
fn vs_main(@builtin(vertex_index) idx: u32) -> @builtin(position) vec4<f32> {
  // Same one-triangle-covers-the-viewport trick as the WebGL vertex shader —
  // clip space is identical between the two APIs, so this half needs no change.
  var pos = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(3.0, -1.0),
    vec2<f32>(-1.0, 3.0),
  );
  return vec4<f32>(pos[idx], 0.0, 1.0);
}

@fragment
fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
  let halfSize = u.resolution * 0.5;
  // Unlike WebGL's gl_FragCoord (origin bottom-left, Y increasing upward),
  // WGSL's fragment-stage @builtin(position) already has origin top-left with
  // Y increasing downward — the same convention as CSS/screen space. No flip
  // needed here; contrast with rim.ts's GLSL, which flips explicitly to match
  // this same convention so the light vector means the same thing in both shaders.
  let p = fragCoord.xy - halfSize;
  let r = min(u.radius, min(halfSize.x, halfSize.y));
  let d = sdRoundRect(p, halfSize, r);

  let rimWidth = 6.0 * u.dpr;
  if (abs(d) > rimWidth * 1.5) {
    discard;
  }

  let eps = max(u.dpr, 1.0);
  let n = normalize(vec2<f32>(
    sdRoundRect(p + vec2<f32>(eps, 0.0), halfSize, r) - sdRoundRect(p - vec2<f32>(eps, 0.0), halfSize, r),
    sdRoundRect(p + vec2<f32>(0.0, eps), halfSize, r) - sdRoundRect(p - vec2<f32>(0.0, eps), halfSize, r),
  ));

  let light = normalize(vec2<f32>(-0.6, -0.8));
  let lit = clamp(dot(n, light), 0.0, 1.0);

  let rim = 1.0 - smoothstep(0.0, rimWidth, abs(d));
  let glow = rim * mix(0.15, 1.0, lit);

  // Chromatic fringe: same trick as the WebGL backend — split the rim mask
  // along the surface normal by a couple of device pixels per channel.
  let off = 1.4 * u.dpr;
  let dR = sdRoundRect(p + n * off, halfSize, r);
  let dB = sdRoundRect(p - n * off, halfSize, r);
  let rimR = 1.0 - smoothstep(0.0, rimWidth, abs(dR));
  let rimB = 1.0 - smoothstep(0.0, rimWidth, abs(dB));

  let color = vec3<f32>(mix(glow, rimR, 0.5), glow, mix(glow, rimB, 0.5));
  let alpha = clamp(glow * 0.85 + max(rimR, rimB) * 0.15, 0.0, 1.0);
  return vec4<f32>(color * alpha, alpha);
}
`;

export interface RimBackend {
  /** Draws once at the given backing-store size (already dpr-scaled) plus CSS-px radius and dpr. */
  draw(width: number, height: number, radius: number, dpr: number): void;
  /** Frees the GPU device — browsers cap how many WebGPU/WebGL contexts can be live at once. */
  destroy(): void;
}

/**
 * Negotiates a WebGPU device and configures `canvas` for it. Resolves to
 * `null` — never rejects — if WebGPU isn't present, adapter/device
 * negotiation fails, or the canvas context can't be configured. Every one of
 * those cases means the same thing to the caller: keep showing the WebGL rim.
 */
export async function createWebGpuRim(canvas: HTMLCanvasElement): Promise<RimBackend | null> {
  // Cast, not an optional-chaining check against the type alone: some lib.dom.d.ts
  // snapshots type `Navigator.gpu` as always present, but real browsers without
  // WebGPU simply don't have the property (it reads as `undefined`, not a typed
  // absence) — the runtime check must not trust the ambient type here.
  const gpu = (navigator as unknown as { gpu?: GPU }).gpu;
  if (!gpu) return null;

  try {
    const adapter = await gpu.requestAdapter();
    const device = await adapter?.requestDevice();
    if (!device) return null;

    // No canvas-specific `getContext("webgpu")` overload in every lib.dom.d.ts
    // snapshot either — the generic `getContext(id: string)` fallback types the
    // result as the full `RenderingContext` union, so this narrows it back down.
    const context = canvas.getContext('webgpu') as GPUCanvasContext | null;
    if (!context) return null;

    const format = gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: 'premultiplied' });

    const module = device.createShaderModule({ code: SHADER_SRC });
    const pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module, entryPoint: 'vs_main' },
      fragment: {
        module,
        entryPoint: 'fs_main',
        targets: [
          {
            format,
            // Premultiplied-alpha "over" blend — matches the WebGL backend's
            // blendFunc(ONE, ONE_MINUS_SRC_ALPHA) and the shader's premultiplied output.
            blend: {
              color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
              alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
            },
          },
        ],
      },
      primitive: { topology: 'triangle-list' },
    });

    // vec2<f32> resolution (8B, align 8) + f32 radius (4B) + f32 dpr (4B) = 16B,
    // already a multiple of the largest member's alignment — no padding needed.
    const uniformBuffer = device.createBuffer({
      size: 16,
      usage: BUFFER_USAGE_UNIFORM | BUFFER_USAGE_COPY_DST,
    });
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });
    const uniformData = new Float32Array(4);

    return {
      draw(width, height, radius, dpr) {
        if (width <= 0 || height <= 0) return;
        canvas.width = width;
        canvas.height = height;
        uniformData.set([width, height, radius * dpr, dpr]);
        device.queue.writeBuffer(uniformBuffer, 0, uniformData);

        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              clearValue: { r: 0, g: 0, b: 0, a: 0 },
              loadOp: 'clear',
              storeOp: 'store',
            },
          ],
        });
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.draw(3);
        pass.end();
        device.queue.submit([encoder.finish()]);
      },
      destroy() {
        device.destroy();
      },
    };
  } catch {
    // Adapter/device negotiation can reject for reasons with no actionable
    // recovery here (GPU process crashed, driver blocklisted, out of memory) —
    // every one of them means the same thing: stay on the WebGL rim.
    return null;
  }
}
