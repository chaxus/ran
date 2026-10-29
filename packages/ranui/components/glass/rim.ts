/**
 * Optional GPU-accelerated enhancement for `<r-glass rim>`: a shape-only
 * specular rim + a subtle chromatic fringe around the panel's rounded-rect
 * border, lit from a fixed top-left light direction.
 *
 * Deliberately does NOT sample the backdrop — it never captures or rasterizes
 * the DOM behind the glass (see the class-level doc in `index.ts` for why that
 * matters: rasterizing would cost `backdrop-filter`'s free interactivity and
 * accessibility). Both backends only know the panel's own
 * width/height/corner radius; frosting and refracting real content behind the
 * panel stays on `backdrop-filter` + the SVG displacement filter. This layer
 * purely adds a more physically-lit edge on top, drawn on a transparent
 * canvas, redrawn only on resize/radius change — never a per-frame loop.
 *
 * Two backends render the identical effect:
 * - WebGL (this file): synchronous to set up (`canvas.getContext('webgl')`
 *   returns immediately) and works in effectively every browser — this is
 *   what renders first, always, guaranteeing the rim's first paint isn't
 *   delayed by anything.
 * - WebGPU (`rim-webgpu.ts`): negotiated asynchronously and not yet universal,
 *   so `createRimRenderer` below tries it in the background and swaps to it
 *   (freeing the WebGL context) only if/when it becomes ready. See that
 *   file's module doc for why this exists despite not making the single draw
 *   call this renders any faster.
 */
import { createWebGpuRim, type RimBackend, type RimParams } from './rim-webgpu';

const VERTEX_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
// The hash below multiplies values in the thousands; at fp16 mediump that is noise, and the
// edge texture would no longer match the WebGPU backend's f32.
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_radius;
uniform float u_dpr;
uniform float u_bevel;
uniform float u_strength;
uniform float u_tone;

float sdRoundRect(vec2 p, vec2 halfSize, float r) {
  vec2 q = abs(p) - halfSize + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
float hash(float n) { return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
// Smooth 1D value noise: glass light varies slowly along an edge instead of being one stroke.
float noise(float u) {
  float i = floor(u);
  float f = fract(u);
  return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f));
}
float bell(float x, float w) { return exp(-(x * x) / (w * w)); }

void main() {
  vec2 halfSize = u_resolution * 0.5;
  // gl_FragCoord is bottom-up; flip Y so "light from the top-left" reads as
  // top-left on screen, matching the CSS specular gradient's own highlight.
  vec2 p = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y) - halfSize;
  float r = min(u_radius, min(halfSize.x, halfSize.y));
  float d = sdRoundRect(p, halfSize, r);
  float band = max(u_bevel * u_dpr, 4.0 * u_dpr);
  if (d > 2.0 * u_dpr || d < -band) discard;

  float eps = max(u_dpr, 1.0);
  vec2 n = normalize(vec2(
    sdRoundRect(p + vec2(eps, 0.0), halfSize, r) - sdRoundRect(p - vec2(eps, 0.0), halfSize, r),
    sdRoundRect(p + vec2(0.0, eps), halfSize, r) - sdRoundRect(p - vec2(0.0, eps), halfSize, r)
  ) + 1e-5);

  // Arc length around the pane, so texture along the edge keeps its scale at any size.
  float arc = atan(p.y, p.x) * length(halfSize);
  float grain = 10.0 * u_dpr;
  float thickness = 0.7 + 0.6 * noise(arc / (grain * 3.0) + 13.0);
  float shimmer = 0.6 + 0.8 * noise(arc / grain);

  // Two walls: the outer rim, and a fainter line where the bevel meets the flat face.
  float rim = bell(d + u_dpr, 1.2 * u_dpr * thickness + 0.5);
  float inner = bell(d + band * 0.55, 1.4 * u_dpr / thickness + 0.5) * smoothstep(0.2, 0.85, noise(arc / (grain * 9.0) + 41.0));

  // A key light from the top left and a dim, cool fill from the bottom right.
  float key = pow(clamp(dot(n, normalize(vec2(-0.6, -0.8))), 0.0, 1.0), 1.6);
  float fill = pow(clamp(dot(n, normalize(vec2(0.7, 0.7))), 0.0, 1.0), 3.0);

  // Short glints where the key light catches an uneven patch of the rim.
  float spacing = grain * 5.0;
  float cell = floor(arc / spacing);
  float glintAt = (cell + 0.2 + 0.6 * hash(cell + 17.0)) * spacing;
  float glint = step(0.72, hash(cell + 7.0)) * bell(arc - glintAt, grain * 0.9) * bell(d + u_dpr, u_dpr) * key;

  float light = rim * (0.2 + 0.8 * key + 0.35 * fill) * shimmer + inner * (0.45 * key * key + 0.2 * fill) + glint * 1.4;

  // Chromatic fringe: the rim line split along the normal, warm outside and cool inside.
  float off = 1.2 * u_dpr;
  float rimR = bell(d + u_dpr - off, 1.2 * u_dpr + 0.5);
  float rimB = bell(d + u_dpr + off, 1.2 * u_dpr + 0.5);
  vec3 fringe = vec3(rimR, 0.0, rimB) * 0.3 * (key + fill);

  // On a pale backdrop a white line vanishes, so the walls are shaded with a cool ink and
  // only the key-lit part keeps a highlight.
  float shade = u_tone * (rim * 0.55 + inner * 0.12) * (1.0 - 0.7 * key);
  float highlight = mix(light, light * key, u_tone);
  vec3 color = vec3(highlight) + fringe * (1.0 - u_tone) + vec3(0.18, 0.23, 0.33) * shade;
  float alpha = clamp(highlight + shade + max(rimR, rimB) * 0.1 * (1.0 - u_tone), 0.0, 1.0);
  float strength = clamp(u_strength, 0.0, 2.0);
  // Premultiplied output: no channel may exceed alpha.
  float outAlpha = clamp(alpha * strength, 0.0, 1.0);
  gl_FragColor = vec4(min(color * strength, vec3(outAlpha)), outAlpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** Returns `null` when WebGL isn't available (old browser, disabled, SSR) — the
 * caller keeps the plain CSS specular layer as the only highlight in that case. */
function createWebGlRim(canvas: HTMLCanvasElement): RimBackend | null {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // One full-viewport triangle (clip-space corners at -1/-1, 3/-1, -1/3) —
  // cheaper than a two-triangle quad, identical visible result.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const positionLoc = gl.getAttribLocation(program, 'a_position');
  const loc = (name: string) => gl.getUniformLocation(program, name);
  const resolutionLoc = loc('u_resolution');
  const radiusLoc = loc('u_radius');
  const dprLoc = loc('u_dpr');
  const bevelLoc = loc('u_bevel');
  const strengthLoc = loc('u_strength');
  const toneLoc = loc('u_tone');

  gl.useProgram(program);
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  return {
    draw(width, height, params, dpr) {
      if (width <= 0 || height <= 0) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolutionLoc, width, height);
      gl.uniform1f(radiusLoc, params.radius * dpr);
      gl.uniform1f(dprLoc, dpr);
      gl.uniform1f(bevelLoc, params.bevel);
      gl.uniform1f(strengthLoc, params.strength);
      gl.uniform1f(toneLoc, params.tone === 'light' ? 1 : 0);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    destroy() {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}

export interface RimRenderer {
  /** Redraws with the pane's current shape and light. */
  set(params: RimParams): void;
  /** Tears down whichever backend is active and removes its canvas(es). */
  destroy(): void;
}

// A decorative few-pixel-wide edge glow, not content — a 3x/4x phone backing
// buffer would burn fill-rate for no visible gain.
const MAX_DPR = 2;

/**
 * Mounts the rim canvas(es) into `container` (the `.ran-glass-specular` div)
 * and keeps them sized to it via `ResizeObserver`. Always returns a working
 * renderer object — even when neither backend is available the returned
 * object is just inert (its canvas stays blank, so the plain CSS specular
 * gradient remains the only highlight; there's nothing for the caller to
 * branch on).
 */
export function createRimRenderer(container: HTMLElement): RimRenderer {
  let params: RimParams = { radius: 20, bevel: 22, strength: 1, tone: 'dark' };
  let destroyed = false;

  const makeCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.className = 'ran-glass-rim';
    canvas.setAttribute('part', 'rim');
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);
    return canvas;
  };

  /**
   * A WebGL context can be lost at any time (memory pressure, a GPU reset, too many
   * contexts). Its program and buffers die with it, so on restore the backend is rebuilt.
   * `preventDefault` on loss is what tells the browser to attempt the restore at all.
   */
  const makeGlCanvas = (): HTMLCanvasElement => {
    const canvas = makeCanvas();
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      if (gl && glCanvas === canvas) gl = null;
    });
    canvas.addEventListener('webglcontextrestored', () => {
      if (destroyed || gpu || glCanvas !== canvas) return;
      gl = createWebGlRim(canvas);
      redraw();
    });
    return canvas;
  };

  let gl: RimBackend | null = null;
  let glCanvas = makeGlCanvas();
  gl = createWebGlRim(glCanvas);
  let gpu: RimBackend | null = null;
  let gpuCanvas: HTMLCanvasElement | null = null;

  const currentSize = (): { width: number; height: number; dpr: number } => {
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, MAX_DPR);
    return {
      width: Math.max(1, Math.round(rect.width * dpr)),
      height: Math.max(1, Math.round(rect.height * dpr)),
      dpr,
    };
  };

  const redraw = (): void => {
    if (destroyed) return;
    const { width, height, dpr } = currentSize();
    (gpu ?? gl)?.draw(width, height, params, dpr);
  };

  const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(redraw) : null;
  resizeObserver?.observe(container);
  redraw();

  // Cheap synchronous existence check — most browsers today don't advertise
  // `navigator.gpu` at all, and skipping the second canvas entirely in that
  // (common) case avoids mounting a permanent unused DOM node per instance.
  // Only browsers that at least *have* the API pay the cost of the attempt.
  if (typeof navigator !== 'undefined' && (navigator as unknown as { gpu?: unknown }).gpu) {
    gpuCanvas = makeCanvas();
    gpuCanvas.style.display = 'none';
    createWebGpuRim(gpuCanvas).then((handle) => {
      if (destroyed) {
        handle?.destroy();
        return;
      }
      if (!handle) {
        // Advertised but negotiation failed (blocklisted driver, out of
        // memory, etc.) — remove the speculative canvas, stay on WebGL.
        gpuCanvas?.remove();
        gpuCanvas = null;
        return;
      }
      gpu = handle;
      gl?.destroy();
      gl = null;
      glCanvas.remove();
      (gpuCanvas as HTMLCanvasElement).style.display = '';
      redraw();
      void handle.lost?.then(() => {
        if (destroyed || gpu !== handle) return;
        handle.destroy();
        gpu = null;
        gpuCanvas?.remove();
        gpuCanvas = null;
        glCanvas = makeGlCanvas();
        gl = createWebGlRim(glCanvas);
        redraw();
      });
    });
  }

  return {
    set(next) {
      params = next;
      redraw();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      resizeObserver?.disconnect();
      gpu?.destroy();
      gl?.destroy();
      glCanvas.remove();
      gpuCanvas?.remove();
    },
  };
}
