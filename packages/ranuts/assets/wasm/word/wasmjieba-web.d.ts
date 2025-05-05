/* tslint:disable */
/* eslint-disable */
/**
 * @param {string} text
 * @param {boolean} hmm
 * @returns {any[]}
 */
export function cut(text: string, hmm: boolean): any[];
/**
 * @param {string} text
 * @returns {any[]}
 */
export function cutAll(text: string): any[];
/**
 * @param {string} text
 * @param {boolean} hmm
 * @returns {any[]}
 */
export function cutForSearch(text: string, hmm: boolean): any[];
/**
 * @param {string} text
 * @param {number | undefined} mode
 * @param {boolean} hmm
 * @returns {any[]}
 */
export function tokenize(text: string, mode: number | undefined, hmm: boolean): any[];
/**
 * @param {string} sentence
 * @param {boolean} hmm
 * @returns {any[]}
 */
export function tag(sentence: string, hmm: boolean): any[];
/**
 * @param {string} segment
 * @returns {number}
 */
export function suggestFreq(segment: string): number;
/**
 * @param {string} word
 * @param {number | undefined} freq
 * @param {string | undefined} tag
 * @returns {number}
 */
export function addWord(word: string, freq?: number, tag?: string): number;
/**
 * @param {string} dict
 */
export function loadDict(dict: string): void;
/**
 */
export enum TokenizeMode {
  Default = 0,
  Search = 1,
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly cut: (a: number, b: number, c: number, d: number) => void;
  readonly cutAll: (a: number, b: number, c: number) => void;
  readonly cutForSearch: (a: number, b: number, c: number, d: number) => void;
  readonly tokenize: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly tag: (a: number, b: number, c: number, d: number) => void;
  readonly suggestFreq: (a: number, b: number) => number;
  readonly addWord: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly loadDict: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {SyncInitInput} module
 *
 * @returns {InitOutput}
 */
export function initSync(module: SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {InitInput | Promise<InitInput>} module_or_path
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
