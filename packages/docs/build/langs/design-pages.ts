/**
 * The Ran Design reference pages, published from `design/*.md` in English only (see
 * `build/design-reference.ts`). Pure data, because the locale registry reads it and the
 * client bundle reads the registry.
 */
export const DESIGN_REFERENCE = [
  { file: 'DESIGN.md', page: 'composition', key: 'design_composition', title: 'Visual composition' },
  { file: 'INTERACTION.md', page: 'interaction', key: 'design_interaction', title: 'Interaction' },
  { file: 'ACCEPTANCE.md', page: 'acceptance', key: 'design_acceptance', title: 'Acceptance' },
  { file: 'WORKFLOW_PATTERNS.md', page: 'patterns', key: 'design_patterns', title: 'Product patterns' },
  { file: 'RULES.md', page: 'rules', key: 'design_rules', title: 'Rule index' },
] as const;

/** Their source paths, as structure links and `localeHref` see them. */
export const DESIGN_REFERENCE_LINKS: readonly string[] = DESIGN_REFERENCE.map(({ page }) => `/src/design/${page}`);
