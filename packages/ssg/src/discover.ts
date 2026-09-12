/**
 * Walking a content tree and splitting each file into frontmatter and body.
 *
 * Deliberately stops there. What a file *is* — a post, a landing page, a 404 — and what
 * URL it gets are decisions a site makes about its own shape, and putting them here
 * would mean every new site either matches this one's conventions or fights them.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseFrontmatter } from './frontmatter.ts';
import type { Frontmatter } from './frontmatter.ts';

export interface SourceFile {
  /** Path relative to the content directory, with forward slashes. `blog/foo.md`. */
  rel: string;
  /** A label for error messages — the path as a human would type it. */
  label: string;
  data: Frontmatter;
  /** The body, frontmatter removed. */
  content: string;
}

export interface WalkOptions {
  /** Directory names to skip entirely. */
  ignore?: readonly string[];
  /** Filenames to skip. `CLAUDE.md` is orientation for maintainers, not a page. */
  ignoreFiles?: readonly string[];
  /** Prefix for `label`. Defaults to the directory's own name. */
  labelPrefix?: string;
}

/** Every `.md` under `dir`, depth-first, sorted so the build is reproducible. */
export const walkMarkdown = (
  dir: string,
  ignore: readonly string[] = [],
  ignoreFiles: readonly string[] = [],
): string[] => {
  const out: string[] = [];
  for (const name of readdirSync(dir).sort()) {
    if (ignore.includes(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walkMarkdown(full, ignore, ignoreFiles));
    else if (name.endsWith('.md') && !ignoreFiles.includes(name)) out.push(full);
  }
  return out;
};

export const readSources = (contentDir: string, options: WalkOptions = {}): SourceFile[] =>
  walkMarkdown(contentDir, options.ignore, options.ignoreFiles).map((full) => {
    const rel = relative(contentDir, full).split('\\').join('/');
    const label = `${options.labelPrefix ?? 'content'}/${rel}`;
    const { data, content } = parseFrontmatter(readFileSync(full, 'utf8'), label);
    return { rel, label, data, content };
  });
