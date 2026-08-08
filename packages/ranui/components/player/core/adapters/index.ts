import { createHlsAdapter } from './hls';
// import { createDashAdapter } from './dash'; // wired in M2
// import { createFlvAdapter } from './flv';   // wired in M3
import type { EngineAdapter, EngineFormat } from './types';

const registry: Partial<Record<Exclude<EngineFormat, 'native'>, () => EngineAdapter>> = {
  hls: createHlsAdapter,
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
