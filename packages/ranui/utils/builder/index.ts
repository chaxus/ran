/**
 * The builder now lives in its own package, `ranview`.
 *
 * This file stays as a re-export so nothing in ranui had to change: 84 modules import
 * `@/utils/builder`, and `ranui/builder` is a published entry point that consumers use.
 * Both keep resolving here, and here forwards.
 *
 * It moved because it had grown into a general-purpose library wearing a component
 * library's clothes — 1,831 lines, its own 434-line manual, its own test suite, and
 * exactly one external import. Anyone wanting framework-free reactive DOM had to install
 * ranui, and with it a video player, a diagram renderer and a maths typesetter: 242 MB of
 * transitive dependencies for a file that depends on one function.
 */
export * from '@chaxus/ranview';
