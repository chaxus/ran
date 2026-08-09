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
import { createWebGpuRim, type RimBackend } from './rim-webgpu';

const VERTEX_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_radius;
uniform float u_dpr;

float sdRoundRect(vec2 p, vec2 halfSize, float r) {
  vec2 q = abs(p) - halfSize + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 halfSize = u_resolution * 0.5;
  // gl_FragCoord is bottom-up; flip Y so "light from the top-left" reads as
  // top-left on screen, matching the CSS specular gradient's own highlight.
  vec2 p = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y) - halfSize;
  float r = min(u_radius, min(halfSize.x, halfSize.y));
  float d = sdRoundRect(p, halfSize, r);

  float rimWidth = 6.0 * u_dpr;
  // Outside this band the pixel contributes nothing — skip the rest of the
  // shader for it rather than computing a zero-alpha result.
  if (abs(d) > rimWidth * 1.5) discard;

  float eps = max(u_dpr, 1.0);
  vec2 n = normalize(vec2(
    sdRoundRect(p + vec2(eps, 0.0), halfSize, r) - sdRoundRect(p - vec2(eps, 0.0), halfSize, r),
    sdRoundRect(p + vec2(0.0, eps), halfSize, r) - sdRoundRect(p - vec2(0.0, eps), halfSize, r)
  ));

  vec2 light = normalize(vec2(-0.6, -0.8));
  float lit = clamp(dot(n, light), 0.0, 1.0);

  float rim = 1.0 - smoothstep(0.0, rimWidth, abs(d));
  float glow = rim * mix(0.15, 1.0, lit);

  // Chromatic fringe: split the same rim mask along the surface normal by a
  // couple of device pixels per channel — a cheap stand-in for real light
  // dispersion, since there is no refracted backdrop image here to disperse.
  float off = 1.4 * u_dpr;
  float dR = sdRoundRect(p + n * off, halfSize, r);
  float dB = sdRoundRect(p - n * off, halfSize, r);
  float rimR = 1.0 - smoothstep(0.0, rimWidth, abs(dR));
  float rimB = 1.0 - smoothstep(0.0, rimWidth, abs(dB));

  vec3 color = vec3(mix(glow, rimR, 0.5), glow, mix(glow, rimB, 0.5));
  float alpha = clamp(glow * 0.85 + max(rimR, rimB) * 0.15, 0.0, 1.0);
  gl_FragColor = vec4(color * alpha, alpha);
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
  const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
  const radiusLoc = gl.getUniformLocation(program, 'u_radius');
  const dprLoc = gl.getUniformLocation(program, 'u_dpr');

  gl.useProgram(program);
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  return {
    draw(width, height, radius, dpr) {
      if (width <= 0 || height <= 0) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolutionLoc, width, height);
      gl.uniform1f(radiusLoc, radius * dpr);
      gl.uniform1f(dprLoc, dpr);
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
  /** Corner radius, in CSS px, matching the `radius` attribute. */
  setRadius(radius: number): void;
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
  let radius = 20;
  let destroyed = false;

  const makeCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.className = 'ran-glass-rim';
    canvas.setAttribute('part', 'rim');
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);
    return canvas;
  };

  const glCanvas = makeCanvas();
  let gl: RimBackend | null = createWebGlRim(glCanvas);
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
    const { width, height, dpr } = currentSize();
    (gpu ?? gl)?.draw(width, height, radius, dpr);
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
    });
  }

  return {
    setRadius(r) {
      radius = r;
      redraw();
    },
    destroy() {
      destroyed = true;
      resizeObserver?.disconnect();
      gpu?.destroy();
      gl?.destroy();
      glCanvas.remove();
      gpuCanvas?.remove();
    },
  };
}
