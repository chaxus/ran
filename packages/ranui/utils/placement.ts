// The flip/shift placement algorithm lives in ranuts — it's pure geometry (numbers/interfaces
// in, numbers out), never touches the DOM or a component, and `getBoundingClientRect()` is
// always called by the ranui component itself before handing the rect in. ranui keeps this
// module path so `@/utils/placement` (popover, select) stays importable unchanged.
export { computePlacement } from 'ranuts/utils';
export type { ComputePlacementOptions, ComputedPlacement, Placement, PlacementRect } from 'ranuts/utils';
