/**
 * The Ran Design guide, published from `design/DESIGN.md` (see `build/design-reference.ts`).
 * Pure data, because the locale registry reads it and the client bundle reads the registry.
 */
export const DESIGN_REFERENCE = [
  { file: 'DESIGN.md', page: 'guide', key: 'design_guide', title: 'Design guide', translated: ['cn'] },
] as const;

/** Their source paths, as structure links and `localeHref` see them. */
export const DESIGN_REFERENCE_LINKS: readonly string[] = DESIGN_REFERENCE.map(({ page }) => `/src/design/${page}`);

/**
 * A guide page a locale has no translation of; its links stay on the English page. Must agree
 * with the files in `design-i18n/`, which `check:langs` holds.
 */
export const designPageUntranslated = (link: string, dir: string): boolean =>
  DESIGN_REFERENCE.some(
    ({ page, translated }) =>
      (link === `/src/design/${page}` || link.startsWith(`/src/design/${page}#`)) &&
      !(translated as readonly string[]).includes(dir),
  );
