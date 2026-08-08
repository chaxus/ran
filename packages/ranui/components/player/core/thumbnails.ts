/**
 * Thumbnail scrubbing preview — parses a WebVTT sprite-sheet manifest, the
 * same convention YouTube/Video.js use: a cue's text is
 * `spritesheet.jpg#xywh=x,y,w,h` (`docs/PLAYER_ROADMAP.md` Phase 3). No
 * existing ranui WebVTT parser to reuse — subtitles/CC (`core/tracks.ts`)
 * hand cue parsing off entirely to the browser's native `<track>` element;
 * this feature needs the sprite coordinates for itself, so it's genuinely
 * new parsing code.
 */
export interface ThumbnailCue {
  start: number;
  end: number;
  url: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const TIMESTAMP_PATTERN = /(?:(\d{2,}):)?(\d{2}):(\d{2})\.(\d{3})/;

function parseTimestamp(raw: string): number | undefined {
  const match = raw.trim().match(TIMESTAMP_PATTERN);
  if (!match) return undefined;
  const [, hours, minutes, seconds, millis] = match;
  return (hours ? Number(hours) * 3600 : 0) + Number(minutes) * 60 + Number(seconds) + Number(millis) / 1000;
}

function parseCueTiming(line: string): { start: number; end: number } | undefined {
  const [startRaw, endRaw] = line.split('-->');
  if (!startRaw || !endRaw) return undefined;
  const start = parseTimestamp(startRaw);
  // The end timestamp may be followed by cue settings (`align:start line:0`) — only the first token matters.
  const end = parseTimestamp(endRaw.trim().split(/\s+/)[0] ?? '');
  if (start === undefined || end === undefined) return undefined;
  return { start, end };
}

function parseSpriteReference(
  line: string,
  baseUrl: string,
): { url: string; x: number; y: number; w: number; h: number } | undefined {
  const [urlPart, fragment] = line.trim().split('#xywh=');
  if (!urlPart || !fragment) return undefined;
  const [x, y, w, h] = fragment.split(',').map(Number);
  if ([x, y, w, h].some((n) => !Number.isFinite(n))) return undefined;
  let url = urlPart;
  try {
    url = new URL(urlPart, baseUrl).href;
  } catch {
    // Relative URL with no usable base (e.g. a test calling this with a bare filename) — keep it as-is.
  }
  return { url, x, y, w, h };
}

/**
 * Parses a WebVTT sprite-sheet manifest into thumbnail cues, resolving each
 * cue's image reference against `baseUrl` (the VTT file's own URL, so
 * relative sprite paths work). Malformed cues are skipped, never thrown —
 * the caller treats this as a best-effort enhancement. Result is sorted by
 * `start` (VTT files are normally authored in order already).
 */
export function parseThumbnailVtt(vttText: string, baseUrl: string): ThumbnailCue[] {
  const cues: ThumbnailCue[] = [];
  const blocks = vttText.replace(/\r\n/g, '\n').split(/\n{2,}/);
  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const timingIndex = lines.findIndex((line) => line.includes('-->'));
    if (timingIndex === -1) continue;
    const timing = parseCueTiming(lines[timingIndex]);
    if (!timing) continue;
    const spriteLine = lines[timingIndex + 1];
    if (!spriteLine) continue;
    const sprite = parseSpriteReference(spriteLine, baseUrl);
    if (!sprite) continue;
    cues.push({ ...timing, ...sprite });
  }
  return cues.sort((a, b) => a.start - b.start);
}

/**
 * Finds the cue covering `time` (seconds) — the last cue whose `start` is
 * `<= time`, falling back to the first cue for anything before it (matches
 * how a scrub before the first cue should still show *a* thumbnail rather
 * than none). Assumes `cues` is sorted, as `parseThumbnailVtt` returns it.
 */
export function findThumbnailCue(cues: ThumbnailCue[], time: number): ThumbnailCue | undefined {
  let result: ThumbnailCue | undefined;
  for (const cue of cues) {
    if (cue.start > time) break;
    result = cue;
  }
  return result ?? cues[0];
}

/** Fetches and parses a thumbnail VTT manifest. Never throws — resolves to `[]` on any network/parse failure. */
export async function loadThumbnailCues(url: string): Promise<ThumbnailCue[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const text = await response.text();
    return parseThumbnailVtt(text, url);
  } catch {
    return [];
  }
}

/** Renders (or hides, when `cue` is `undefined`) a cropped sprite thumbnail into `el` via `background-position`. */
export function applyThumbnailPreview(el: HTMLElement, cue: ThumbnailCue | undefined): void {
  if (!cue) {
    el.style.setProperty('display', 'none');
    return;
  }
  el.style.setProperty('display', 'block');
  el.style.setProperty('width', `${cue.w}px`);
  el.style.setProperty('height', `${cue.h}px`);
  el.style.setProperty('background-image', `url("${cue.url}")`);
  el.style.setProperty('background-position', `-${cue.x}px -${cue.y}px`);
}
