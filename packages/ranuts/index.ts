// Root barrel for `ranuts`.
//
// A plain re-export of `src/utils`, deliberately: this file used to hand-maintain its own
// copy of the export list and had drifted 83 symbols behind — `EventManager`, `createStore`,
// `resolveLocale`, `crc32`, the whole i18n and zip surfaces — all reachable from
// `ranuts/utils` but invisible to anyone importing from `ranuts`. A list that has to be
// edited twice for every new export is a list that will be wrong again by next month.
//
// `export *` re-exports types along with values, so no separate `export type *` is needed.
export * from './src/utils';
