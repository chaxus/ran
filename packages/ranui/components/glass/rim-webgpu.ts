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
  bevel: f32,
  strength: f32,
  tone: f32,
  pad: f32,
};
@group(0) @binding(0) var<uniform> u: Uniforms;

fn sdRoundRect(p: vec2<f32>, halfSize: vec2<f32>, r: f32) -> f32 {
  let q = abs(p) - halfSize + r;
  return length(max(q, vec2<f32>(0.0, 0.0))) + min(max(q.x, q.y), 0.0) - r;
}
fn hash(n: f32) -> f32 { return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
fn noise(v: f32) -> f32 {
  let i = floor(v);
  let f = fract(v);
  return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f));
}
fn bell(x: f32, w: f32) -> f32 { return exp(-(x * x) / (w * w)); }

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

// A line-for-line port of FRAGMENT_SRC in rim.ts; the comments there explain each term.
@fragment
fn fs_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
  let halfSize = u.resolution * 0.5;
  // WGSL's @builtin(position) already has origin top-left, Y down — the CSS
  // convention rim.ts's GLSL flips to explicitly. No flip needed here.
  let p = fragCoord.xy - halfSize;
  let r = min(u.radius, min(halfSize.x, halfSize.y));
  let d = sdRoundRect(p, halfSize, r);
  let band = max(u.bevel * u.dpr, 4.0 * u.dpr);
  if (d > 2.0 * u.dpr || d < -band) {
    discard;
  }

  let eps = max(u.dpr, 1.0);
  let n = normalize(vec2<f32>(
    sdRoundRect(p + vec2<f32>(eps, 0.0), halfSize, r) - sdRoundRect(p - vec2<f32>(eps, 0.0), halfSize, r),
    sdRoundRect(p + vec2<f32>(0.0, eps), halfSize, r) - sdRoundRect(p - vec2<f32>(0.0, eps), halfSize, r),
  ) + vec2<f32>(1e-5, 1e-5));

  let arc = atan2(p.y, p.x) * length(halfSize);
  let grain = 10.0 * u.dpr;
  let thickness = 0.7 + 0.6 * noise(arc / (grain * 3.0) + 13.0);
  let shimmer = 0.6 + 0.8 * noise(arc / grain);

  let rim = bell(d + u.dpr, 1.2 * u.dpr * thickness + 0.5);
  let inner = bell(d + band * 0.55, 1.4 * u.dpr / thickness + 0.5) * smoothstep(0.2, 0.85, noise(arc / (grain * 9.0) + 41.0));

  let key = pow(clamp(dot(n, normalize(vec2<f32>(-0.6, -0.8))), 0.0, 1.0), 1.6);
  let fill = pow(clamp(dot(n, normalize(vec2<f32>(0.7, 0.7))), 0.0, 1.0), 3.0);

  let spacing = grain * 5.0;
  let cell = floor(arc / spacing);
  let glintAt = (cell + 0.2 + 0.6 * hash(cell + 17.0)) * spacing;
  let glint = step(0.72, hash(cell + 7.0)) * bell(arc - glintAt, grain * 0.9) * bell(d + u.dpr, u.dpr) * key;

  let light = rim * (0.2 + 0.8 * key + 0.35 * fill) * shimmer + inner * (0.45 * key * key + 0.2 * fill) + glint * 1.4;

  let off = 1.2 * u.dpr;
  let rimR = bell(d + u.dpr - off, 1.2 * u.dpr + 0.5);
  let rimB = bell(d + u.dpr + off, 1.2 * u.dpr + 0.5);
  let fringe = vec3<f32>(rimR, 0.0, rimB) * 0.3 * (key + fill);

  let shade = u.tone * (rim * 0.55 + inner * 0.12) * (1.0 - 0.7 * key);
  let highlight = mix(light, light * key, u.tone);
  let color = vec3<f32>(highlight) + fringe * (1.0 - u.tone) + vec3<f32>(0.18, 0.23, 0.33) * shade;
  let alpha = clamp(highlight + shade + max(rimR, rimB) * 0.1 * (1.0 - u.tone), 0.0, 1.0);
  let strength = clamp(u.strength, 0.0, 2.0);
  let outAlpha = clamp(alpha * strength, 0.0, 1.0);
  return vec4<f32>(min(color * strength, vec3<f32>(outAlpha)), outAlpha);
}
`;

/** What the rim shader needs to know about the pane, in CSS px. */
export interface RimParams {
  radius: number;
  bevel: number;
  /** 1 is the material's normal light. */
  strength: number;
  tone: 'dark' | 'light';
}

export interface RimBackend {
  /** Resolves when an active device is lost; renderer restores its fallback. */
  lost?: Promise<unknown>;
  /** Draws once at the given backing-store size (already dpr-scaled). */
  draw(width: number, height: number, params: RimParams, dpr: number): void;
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

  let device: GPUDevice | undefined;
  let context: GPUCanvasContext | null = null;
  let uniformBuffer: GPUBuffer | undefined;
  let destroyed = false;
  const destroy = (): void => {
    if (destroyed) return;
    destroyed = true;
    context?.unconfigure();
    uniformBuffer?.destroy();
    device?.destroy();
  };

  try {
    const adapter = await gpu.requestAdapter();
    device = await adapter?.requestDevice();
    if (!device) return null;

    // No canvas-specific `getContext("webgpu")` overload in every lib.dom.d.ts
    // snapshot either — the generic `getContext(id: string)` fallback types the
    // result as the full `RenderingContext` union, so this narrows it back down.
    context = canvas.getContext('webgpu') as GPUCanvasContext | null;
    if (!context) {
      destroy();
      return null;
    }

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

    // Eight f32s: resolution (vec2, align 8), radius, dpr, bevel, strength, tone and one
    // pad, 32 bytes, a multiple of the struct's 8-byte alignment.
    uniformBuffer = device.createBuffer({
      size: 32,
      usage: BUFFER_USAGE_UNIFORM | BUFFER_USAGE_COPY_DST,
    });
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });
    const uniformData = new Float32Array(8);

    const activeDevice = device;
    const activeContext = context;
    const activeBuffer = uniformBuffer;
    return {
      lost: device.lost,
      draw(width, height, params, dpr) {
        if (destroyed || width <= 0 || height <= 0) return;
        canvas.width = width;
        canvas.height = height;
        uniformData.set([
          width,
          height,
          params.radius * dpr,
          dpr,
          params.bevel,
          params.strength,
          params.tone === 'light' ? 1 : 0,
          0,
        ]);
        activeDevice.queue.writeBuffer(activeBuffer, 0, uniformData);

        const encoder = activeDevice.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: activeContext.getCurrentTexture().createView(),
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
        activeDevice.queue.submit([encoder.finish()]);
      },
      destroy,
    };
  } catch {
    destroy();
    // Adapter/device negotiation can reject for reasons with no actionable
    // recovery here (GPU process crashed, driver blocklisted, out of memory) —
    // every one of them means the same thing: stay on the WebGL rim.
    return null;
  }
}
