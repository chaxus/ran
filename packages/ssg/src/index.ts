/**
 * The static site generator behind chaxus.com and, in time, ran.chaxus.com.
 *
 * It is mechanism, not policy. It knows how to parse frontmatter, render markdown to
 * documentation-grade HTML, walk a content tree, put bytes on disk in the right order,
 * serve them the way the host will, and refuse to publish output that contradicts
 * itself. It has no opinion about what a page is, what URL it gets, or what it looks
 * like — those live in each site, which is why two very different sites can share this.
 */
export { parseFrontmatter, readString, readList, readBoolean } from './frontmatter.ts';
export type { Frontmatter, FrontmatterValue, ParsedFile } from './frontmatter.ts';

export { createMarkdown, slugify, stripCustomAnchor, truncate, DEFAULT_LANGS } from './markdown.ts';
export type { MarkdownOptions, MarkdownRenderer, RenderedMarkdown, TocEntry } from './markdown.ts';

export { readSources, walkMarkdown } from './discover.ts';
export type { SourceFile, WalkOptions } from './discover.ts';

export { prepareDist, resolveAssets, writeOut, dropViteManifest } from './driver.ts';
export type { Assets, PrepareOptions } from './driver.ts';

export { verifyDist, verifyOrExit } from './verify.ts';
export type { VerifyOptions, Failure } from './verify.ts';

export { createDevServer } from './dev.ts';
export type { DevServerOptions } from './dev.ts';

export { renderSitemap, renderFeed, renderRobotsTxt } from './feeds.ts';
export type { FeedItem, FeedOptions, SitemapEntry } from './feeds.ts';

export { buildIndex, createIndex, tokenize, SEARCH_FIELDS } from './search.ts';
export type { IndexablePage, SearchDoc } from './search.ts';
export type { Section } from './markdown.ts';
