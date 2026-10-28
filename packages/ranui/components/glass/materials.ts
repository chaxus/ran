/**
 * The glass materials, in a module with no imports so the documentation build can read the
 * same values the component uses.
 */

export type GlassMaterial = 'regular' | 'thin' | 'thick' | 'clear';
export type GlassTone = 'dark' | 'light';

/** The numbers a material sets; an attribute of the same name overrides one of them. */
export interface GlassOptics {
  blur: number;
  saturate: number;
  displace: number;
  bevel: number;
  dispersion: number;
  specular: number;
}

/**
 * The four materials. `regular` is the default, and its values are also the stylesheet's
 * fallbacks (index.less), so a server-rendered pane looks the same before the script runs.
 */
export const GLASS_MATERIALS: Record<GlassMaterial, GlassOptics & { tint: string }> = {
  regular: { blur: 16, saturate: 180, displace: 18, bevel: 28, dispersion: 25, specular: 100, tint: '' },
  thin: { blur: 8, saturate: 160, displace: 12, bevel: 20, dispersion: 20, specular: 80, tint: '0.08' },
  thick: { blur: 28, saturate: 200, displace: 22, bevel: 32, dispersion: 25, specular: 100, tint: '0.24' },
  clear: { blur: 2, saturate: 130, displace: 28, bevel: 40, dispersion: 40, specular: 120, tint: '0.03' },
};
