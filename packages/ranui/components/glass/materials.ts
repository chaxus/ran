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
 *
 * Tuned from Apple's macOS 27 Liquid Glass Figma (`GLASS` effect on Large/Medium/Small):
 * radius → blur, refraction 0.7 → displace scale, depth 30 → bevel band,
 * dispersion 0.2 → 20%, lightIntensity 0.25 → specular. Tint stays thin so the SVG lip
 * stays visible under backdrop-filter (Figma stacks blend modes we cannot copy 1:1).
 */
export const GLASS_MATERIALS: Record<GlassMaterial, GlassOptics & { tint: string }> = {
  // Large / Medium UI Liquid Glass — GLASS radius 16, refraction 0.7, depth 30, dispersion 0.2.
  // Displace sits a touch above a linear 0.7 map so the lip still reads after CSS blur softens it.
  regular: { blur: 16, saturate: 170, displace: 78, bevel: 24, dispersion: 20, specular: 100, tint: '0.12' },
  // Small UI Liquid Glass — GLASS radius 6, same refraction / dispersion coefficients.
  thin: { blur: 6, saturate: 160, displace: 48, bevel: 14, dispersion: 20, specular: 100, tint: '0.08' },
  // Heavier frost (closer to Materials Thick vibrancy) while keeping a readable lip.
  thick: { blur: 22, saturate: 180, displace: 56, bevel: 28, dispersion: 20, specular: 90, tint: '0.2' },
  // Clearest pane: keep frost minimal, push the convex rim.
  clear: { blur: 4, saturate: 150, displace: 90, bevel: 20, dispersion: 25, specular: 110, tint: '0.03' },
};
