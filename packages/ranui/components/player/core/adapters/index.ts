import { createHlsAdapter } from './hls';
import { createDashAdapter } from './dash';
import { createFlvAdapter } from './flv';
import { createWebrtcAdapter } from './webrtc';
import type { EngineAdapter, EngineFormat } from './types';

const registry: Partial<Record<Exclude<EngineFormat, 'native'>, () => EngineAdapter>> = {
  hls: createHlsAdapter,
  dash: createDashAdapter,
  flv: createFlvAdapter,
  webrtc: createWebrtcAdapter,
};

/**
 * The one place format detection turns into an actual engine — `core/media.ts`
 * and `core/clarity.ts` never branch on format themselves. A format with no
 * registry entry (native, or a not-yet-wired engine) falls back to `undefined`,
 * which `loadVideoSource` treats the same as an unsupported HLS build always
 * did: bind `video.src` directly.
 */
export function createEngineAdapter(format: EngineFormat): EngineAdapter | undefined {
  if (format === 'native') return undefined;
  return registry[format]?.();
}

export * from './types';
export { detectFormat } from './detect';
