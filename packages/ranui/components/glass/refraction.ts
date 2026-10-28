/**
 * `<r-glass backdrop>`: refraction of a known image or video, drawn with WebGL2.
 *
 * `backdrop-filter` can only blur what is behind a pane; it cannot move a pixel by a computed
 * amount except through an SVG filter, and that path is Chromium-only. When the backdrop is
 * an `<img>` or `<video>` the glass can read its pixels directly, so this shader does what the
 * CSS path cannot: frost by mip level, bend each wavelength by its own amount through the lens
 * profile in `lens.ts`, and reflect the colours just outside the edge into the rim.
 *
 * The source element is never replaced. It stays in the page with its own semantics, and this
 * canvas only paints a refracted copy of the area the pane covers, redrawn when the pane, the
 * source or a parameter moves.
 */
import { bevelWidth } from './lens';
import type { GlassOptics, GlassTone } from './materials';

export type RefractionSource = HTMLImageElement | HTMLVideoElement;

export interface RefractionParams extends GlassOptics {
  radius: number;
  tone: GlassTone;
}

export interface Refraction {
  readonly source: RefractionSource;
  set(params: RefractionParams): void;
  destroy(): void;
}

export interface RefractionEvents {
  /** True once a frame is on screen, false when the source cannot be read. */
  onActive(active: boolean): void;
  /** The tone the covered area's brightness suggests. */
  onTone(tone: GlassTone): void;
}

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D uImage;
uniform vec2 uTexSize;
uniform vec2 uSize;
uniform float uDpr;
// Pane origin relative to the drawn image content, and the content's size, in CSS px.
uniform vec2 uOrigin;
uniform vec2 uContent;
// The source element's box relative to the pane: nothing outside it is sampled.
uniform vec4 uClip;
uniform float uRadius;
uniform float uBevel;
uniform float uDisplace;
uniform float uDispersion;
uniform float uBlur;
uniform float uSaturate;
uniform float uSpecular;
uniform float uTone;
out vec4 outColor;

const int BANDS = 7;

float sdRoundRect(vec2 p, vec2 halfSize, float r) {
  vec2 q = abs(p) - halfSize + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
float bell(float x, float w) { return exp(-(x * x) / (w * w)); }

// One point of the source, at mip level lod; transparent outside the source element.
vec4 source(vec2 q, float lod) {
  vec2 uv = (q + uOrigin) / uContent;
  vec2 local = q - uClip.xy;
  float inside = step(0.0, local.x) * step(0.0, local.y) * step(local.x, uClip.z) * step(local.y, uClip.w);
  inside *= step(0.0, uv.x) * step(0.0, uv.y) * step(uv.x, 1.0) * step(uv.y, 1.0);
  return textureLod(uImage, uv, lod) * inside;
}

// The frosted source: a mip level near the blur radius, smoothed by a ring of taps so the
// level's blocks do not show.
vec4 frost(vec2 q, float radius) {
  float texelsPerPx = uTexSize.x / max(uContent.x, 1.0);
  float lod = log2(max(1.0, radius * texelsPerPx * 0.5));
  vec4 sum = source(q, lod) * 2.0;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.785398;
    sum += source(q + vec2(cos(a), sin(a)) * radius * 0.6, lod);
  }
  return sum / 10.0;
}

// How much of red, green and blue a band of the spectrum carries; t runs red (0) to blue (1).
vec3 spectrum(float t) {
  return vec3(bell(t, 0.42), bell(t - 0.5, 0.3), bell(t - 1.0, 0.42));
}

void main() {
  vec2 q = vec2(gl_FragCoord.x, uSize.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 halfSize = uSize * 0.5;
  vec2 p = q - halfSize;
  float band = clamp(uBevel, 1.0, min(halfSize.x, halfSize.y));
  // Same profile as lens.ts: the lens corner is at least as round as the bevel.
  float r = min(max(uRadius, band), min(halfSize.x, halfSize.y));
  float d = sdRoundRect(p, halfSize, r);
  vec2 n = normalize(vec2(
    sdRoundRect(p + vec2(0.5, 0.0), halfSize, r) - sdRoundRect(p - vec2(0.5, 0.0), halfSize, r),
    sdRoundRect(p + vec2(0.0, 0.5), halfSize, r) - sdRoundRect(p - vec2(0.0, 0.5), halfSize, r)
  ) + 1e-5);
  float u = clamp(1.0 + d / band, 0.0, 1.0);
  float bend = u * u;

  // Each band of the spectrum is pulled inward by its own amount: blue the most.
  float spread = uDispersion / 100.0;
  // The texture is premultiplied, so a band that samples past the source's edge adds
  // transparency, not black.
  vec3 color = vec3(0.0);
  vec3 weight = vec3(0.0);
  float alpha = 0.0;
  for (int i = 0; i < BANDS; i++) {
    float t = float(i) / float(BANDS - 1);
    float pull = uDisplace * bend * (1.0 + (t - 0.5) * spread);
    vec4 ink = frost(q - n * pull, max(uBlur, 0.5));
    vec3 w = spectrum(t);
    color += ink.rgb * w;
    alpha += ink.a;
    weight += w;
  }
  color /= weight;
  alpha /= float(BANDS);
  color /= max(alpha, 1e-4);

  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(luma), color, uSaturate / 100.0) * 1.05;

  // The rim reflects the backdrop just outside it, heavily blurred: a curved edge mirrors
  // its surroundings, which is what makes it read as glass rather than a stroke.
  float specular = uSpecular / 100.0;
  vec4 env = frost(q + n * band * 0.8, max(uBlur, 4.0) * 3.0);
  float fresnel = pow(u, 3.0) * 0.45 * specular;
  color = mix(color, env.rgb / max(env.a, 1e-4) * 1.15 + 0.08 * (1.0 - uTone), fresnel * env.a);
  // Light focused by the bevel lands as a soft band just inside it, brightest under the
  // key light at the top left.
  float key = 0.5 + 0.5 * dot(n, normalize(vec2(-0.6, -0.8)));
  color += bell(u - 0.45, 0.18) * key * 0.08 * specular * (1.0 - 0.6 * uTone);

  float coverage = 1.0 - smoothstep(-0.75, 0.75, d);
  alpha *= coverage;
  outColor = vec4(clamp(color, 0.0, 1.0) * alpha, alpha);
}
`;

/** Above this the extra backing pixels cost fill rate without visible gain on a blurred image. */
const MAX_DPR = 2;
/** The brightness grid the tone is read from. */
const GRID = 24;
/** Mean luminance above which white highlights stop reading and the edge is shaded instead. */
const LIGHT_LUMA = 0.62;
/** Half the dead band around LIGHT_LUMA, so dragging over a mid-grey area does not flip the tone every frame. */
const TONE_HYSTERESIS = 0.04;
/** Larger sources are scaled down before upload: a frosted copy gains nothing from more texels. */
const MAX_TEXTURE = 2048;

const compile = (gl: WebGL2RenderingContext, type: number, text: string): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, text);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
};

interface Pipeline {
  program: WebGLProgram;
  texture: WebGLTexture;
  uniform: (name: string) => WebGLUniformLocation | null;
}

const createPipeline = (gl: WebGL2RenderingContext): Pipeline | null => {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  const texture = gl.createTexture();
  if (!vs || !fs || !program || !texture) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  // One triangle covering the viewport.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  const locations = new Map<string, WebGLUniformLocation | null>();
  const uniform = (name: string): WebGLUniformLocation | null => {
    if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
    return locations.get(name) ?? null;
  };
  return { program, texture, uniform };
};

const naturalSize = (source: RefractionSource): [number, number] =>
  source instanceof HTMLVideoElement
    ? [source.videoWidth, source.videoHeight]
    : [source.naturalWidth, source.naturalHeight];

const isReady = (source: RefractionSource): boolean =>
  source instanceof HTMLVideoElement ? source.readyState >= 2 : source.complete && source.naturalWidth > 0;

/** One `object-position` component as the fraction of free space before the content, or px. */
const position = (value: string | undefined, free: number): number => {
  if (!value) return free / 2;
  if (value.endsWith('%')) return (free * Number.parseFloat(value)) / 100;
  if (value === 'left' || value === 'top') return 0;
  if (value === 'right' || value === 'bottom') return free;
  if (value === 'center') return free / 2;
  const px = Number.parseFloat(value);
  return Number.isFinite(px) ? px : free / 2;
};

/**
 * Where the source's pixels land inside its box, honouring `object-fit` and `object-position`,
 * as `[x, y, width, height]` in page CSS px.
 */
export const contentBox = (
  box: { left: number; top: number; width: number; height: number },
  natural: [number, number],
  fit: string,
  objectPosition: string,
): [number, number, number, number] => {
  const [nw, nh] = natural;
  if (fit === 'fill' || !nw || !nh) return [box.left, box.top, box.width, box.height];
  const contain = Math.min(box.width / nw, box.height / nh);
  const scale =
    fit === 'cover'
      ? Math.max(box.width / nw, box.height / nh)
      : fit === 'none'
        ? 1
        : fit === 'scale-down'
          ? Math.min(1, contain)
          : contain;
  const width = nw * scale;
  const height = nh * scale;
  const [px, py] = objectPosition.split(/\s+/);
  return [box.left + position(px, box.width - width), box.top + position(py, box.height - height), width, height];
};

/**
 * Mounts a canvas into `layer` that refracts `source` under `pane`. Returns null without
 * WebGL2; the pane then keeps its CSS frost. A source that cannot be read (a cross-origin
 * image without CORS) reports `onActive(false)` and draws nothing.
 */
export const createRefraction = (
  layer: HTMLElement,
  pane: HTMLElement,
  source: RefractionSource,
  events: RefractionEvents,
): Refraction | null => {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!gl) return null;
  let pipeline = createPipeline(gl);
  if (!pipeline) return null;
  layer.appendChild(canvas);

  let params: RefractionParams | null = null;
  let destroyed = false;
  let failed = false;
  let uploaded = false;
  let lastKey = '';
  let lastVideoTime = -1;
  let frame = 0;
  let visible = true;
  let luma: Float32Array | null = null;
  let lumaTime = -Infinity;
  let tone: GlassTone | null = null;
  /** The uploaded texture's size, which differs from the source's when it was scaled down. */
  let texSize: [number, number] = [1, 1];

  const fail = (): void => {
    failed = true;
    stop();
    events.onActive(false);
  };

  /**
   * A source larger than the GPU accepts would leave the texture incomplete (a GL error, not
   * an exception) and paint black, so it is drawn into a smaller canvas first.
   */
  const upload = (): boolean => {
    if (!pipeline || !isReady(source)) return false;
    const [nw, nh] = naturalSize(source);
    const limit = Math.min(MAX_TEXTURE, gl.getParameter(gl.MAX_TEXTURE_SIZE) as number);
    const scale = Math.min(1, limit / Math.max(nw, nh));
    try {
      let pixels: TexImageSource = source;
      if (scale < 1) {
        const small = document.createElement('canvas');
        small.width = Math.max(1, Math.floor(nw * scale));
        small.height = Math.max(1, Math.floor(nh * scale));
        small.getContext('2d')?.drawImage(source, 0, 0, small.width, small.height);
        pixels = small;
      }
      gl.bindTexture(gl.TEXTURE_2D, pipeline.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      gl.generateMipmap(gl.TEXTURE_2D);
      texSize = scale < 1 ? [pixels.width as number, pixels.height as number] : [nw, nh];
    } catch {
      // A cross-origin source without CORS approval cannot be read by any API.
      fail();
      return false;
    }
    if (gl.getError() !== gl.NO_ERROR) {
      fail();
      return false;
    }
    uploaded = true;
    return true;
  };

  /** A small brightness grid of the source, for choosing the tone of the covered area. */
  const sampleLuma = (): void => {
    const grid = document.createElement('canvas');
    grid.width = GRID;
    grid.height = GRID;
    const context = grid.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    try {
      context.drawImage(source, 0, 0, GRID, GRID);
      const { data } = context.getImageData(0, 0, GRID, GRID);
      luma = new Float32Array(GRID * GRID);
      for (let i = 0; i < luma.length; i++) {
        luma[i] = (0.2126 * data[i * 4]! + 0.7152 * data[i * 4 + 1]! + 0.0722 * data[i * 4 + 2]!) / 255;
      }
    } catch {
      luma = null;
    }
  };

  const reportTone = (u0: number, v0: number, u1: number, v1: number): void => {
    if (!luma) return;
    let sum = 0;
    let count = 0;
    const x0 = Math.max(0, Math.floor(u0 * GRID));
    const x1 = Math.min(GRID - 1, Math.ceil(u1 * GRID) - 1);
    const y0 = Math.max(0, Math.floor(v0 * GRID));
    const y1 = Math.min(GRID - 1, Math.ceil(v1 * GRID) - 1);
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        sum += luma[y * GRID + x]!;
        count++;
      }
    }
    if (!count) return;
    const next: GlassTone = sum / count > LIGHT_LUMA ? 'light' : 'dark';
    const mean = sum / count;
    if (tone === 'light' && mean > LIGHT_LUMA - TONE_HYSTERESIS) return;
    if (tone === 'dark' && mean < LIGHT_LUMA + TONE_HYSTERESIS) return;
    if (next !== tone) {
      tone = next;
      events.onTone(next);
    }
  };

  const draw = (): void => {
    if (!pipeline || !params || failed) return;
    const width = pane.clientWidth;
    const height = pane.clientHeight;
    if (!width || !height || !canvas.isConnected) return;
    if (!source.isConnected) {
      // The source left the page; the CSS glass takes over until the host finds another.
      events.onActive(false);
      return;
    }
    const isVideo = source instanceof HTMLVideoElement;
    if (isVideo && source.currentTime !== lastVideoTime) {
      lastVideoTime = source.currentTime;
      uploaded = false;
    }
    if (!uploaded && !upload()) return;

    const paneRect = pane.getBoundingClientRect();
    const left = paneRect.left + pane.clientLeft;
    const top = paneRect.top + pane.clientTop;
    const box = source.getBoundingClientRect();
    const style = getComputedStyle(source);
    const [cx, cy, cw, ch] = contentBox(box, naturalSize(source), style.objectFit, style.objectPosition);
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const key = [
      width,
      height,
      dpr,
      left,
      top,
      box.left,
      box.top,
      box.width,
      box.height,
      cx,
      cy,
      cw,
      ch,
      lastVideoTime,
      ...Object.values(params),
    ].join();
    if (key === lastKey) return;
    lastKey = key;

    if (!luma || (isVideo && performance.now() - lumaTime > 1000)) {
      lumaTime = performance.now();
      sampleLuma();
    }
    reportTone((left - cx) / cw, (top - cy) / ch, (left + width - cx) / cw, (top + height - cy) / ch);

    // Assigning a canvas dimension reallocates its buffer even when the value is unchanged.
    const backingWidth = Math.round(width * dpr);
    const backingHeight = Math.round(height * dpr);
    if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
      canvas.width = backingWidth;
      canvas.height = backingHeight;
      gl.viewport(0, 0, backingWidth, backingHeight);
    }
    const { uniform } = pipeline;
    gl.uniform1i(uniform('uImage'), 0);
    gl.uniform2f(uniform('uTexSize'), texSize[0], texSize[1]);
    gl.uniform2f(uniform('uSize'), width, height);
    gl.uniform1f(uniform('uDpr'), dpr);
    gl.uniform2f(uniform('uOrigin'), left - cx, top - cy);
    gl.uniform2f(uniform('uContent'), cw, ch);
    gl.uniform4f(uniform('uClip'), box.left - left, box.top - top, box.width, box.height);
    gl.uniform1f(uniform('uRadius'), params.radius);
    gl.uniform1f(uniform('uBevel'), bevelWidth(width, height, params.bevel));
    gl.uniform1f(uniform('uDisplace'), params.displace);
    gl.uniform1f(uniform('uDispersion'), params.dispersion);
    gl.uniform1f(uniform('uBlur'), params.blur);
    gl.uniform1f(uniform('uSaturate'), params.saturate);
    gl.uniform1f(uniform('uSpecular'), params.specular);
    gl.uniform1f(uniform('uTone'), params.tone === 'light' ? 1 : 0);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    events.onActive(true);
  };

  // The pane and the source can both move without any event the glass could hear (a
  // transform, a sibling's layout, scrolling a container), so each visible frame compares
  // their boxes and draws only when something changed. Offscreen, the loop stops.
  const loop = (): void => {
    frame = requestAnimationFrame(loop);
    draw();
  };
  function stop(): void {
    cancelAnimationFrame(frame);
    frame = 0;
  }
  const start = (): void => {
    if (!frame && visible && !failed && !destroyed) frame = requestAnimationFrame(loop);
  };
  start();

  const io =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver((entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
          if (visible) start();
          else stop();
        })
      : null;
  io?.observe(pane);

  /** A new image or frame, which may also make a source readable that was not before. */
  const onSourceReady = (): void => {
    uploaded = false;
    failed = false;
    luma = null;
    lastKey = '';
    start();
  };
  source.addEventListener('load', onSourceReady);
  source.addEventListener('loadeddata', onSourceReady);

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    pipeline = null;
  });
  canvas.addEventListener('webglcontextrestored', () => {
    if (destroyed) return;
    pipeline = createPipeline(gl);
    uploaded = false;
    lastKey = '';
  });

  return {
    source,
    set(next) {
      params = next;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      stop();
      io?.disconnect();
      source.removeEventListener('load', onSourceReady);
      source.removeEventListener('loadeddata', onSourceReady);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    },
  };
};
