import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyThumbnailPreview,
  findThumbnailCue,
  loadThumbnailCues,
  parseThumbnailVtt,
  type ThumbnailCue,
} from '@/components/player/core/thumbnails';

const SAMPLE_VTT = `WEBVTT

00:00:00.000 --> 00:00:05.000
sprite.jpg#xywh=0,0,160,90

00:00:05.000 --> 00:00:10.000
sprite.jpg#xywh=160,0,160,90

00:00:10.000 --> 00:00:15.000
sprite.jpg#xywh=0,90,160,90
`;

describe('core/thumbnails parseThumbnailVtt', () => {
  it('parses cues with timing and sprite rects, resolving the URL against baseUrl', () => {
    const cues = parseThumbnailVtt(SAMPLE_VTT, 'https://cdn.example.com/video/thumbs.vtt');
    expect(cues).toHaveLength(3);
    expect(cues[0]).toEqual({
      start: 0,
      end: 5,
      url: 'https://cdn.example.com/video/sprite.jpg',
      x: 0,
      y: 0,
      w: 160,
      h: 90,
    });
    expect(cues[1].x).toBe(160);
    expect(cues[2].y).toBe(90);
  });

  it('parses HH:MM:SS.mmm timestamps with an hours component', () => {
    const vtt = `WEBVTT\n\n01:00:00.000 --> 01:00:05.000\nsprite.jpg#xywh=0,0,10,10\n`;
    const cues = parseThumbnailVtt(vtt, 'https://cdn.example.com/thumbs.vtt');
    expect(cues[0].start).toBe(3600);
    expect(cues[0].end).toBe(3605);
  });

  it('skips a numeric cue-identifier line before the timing line', () => {
    const vtt = `WEBVTT\n\n1\n00:00:00.000 --> 00:00:05.000\nsprite.jpg#xywh=0,0,10,10\n`;
    const cues = parseThumbnailVtt(vtt, 'https://cdn.example.com/thumbs.vtt');
    expect(cues).toHaveLength(1);
  });

  it('tolerates cue settings after the end timestamp', () => {
    const vtt = `WEBVTT\n\n00:00:00.000 --> 00:00:05.000 align:start line:0\nsprite.jpg#xywh=0,0,10,10\n`;
    const cues = parseThumbnailVtt(vtt, 'https://cdn.example.com/thumbs.vtt');
    expect(cues).toHaveLength(1);
    expect(cues[0].end).toBe(5);
  });

  it('skips malformed blocks instead of throwing', () => {
    const vtt = `WEBVTT\n\nnot a timing line\nsprite.jpg#xywh=0,0,10,10\n\n00:00:05.000 --> 00:00:10.000\nno sprite fragment here\n\n00:00:10.000 --> 00:00:15.000\nsprite.jpg#xywh=0,0,10,10\n`;
    const cues = parseThumbnailVtt(vtt, 'https://cdn.example.com/thumbs.vtt');
    expect(cues).toHaveLength(1);
    expect(cues[0].start).toBe(10);
  });

  it('returns cues sorted by start time regardless of source order', () => {
    const vtt = `WEBVTT\n\n00:00:10.000 --> 00:00:15.000\nsprite.jpg#xywh=0,0,10,10\n\n00:00:00.000 --> 00:00:05.000\nsprite.jpg#xywh=10,0,10,10\n`;
    const cues = parseThumbnailVtt(vtt, 'https://cdn.example.com/thumbs.vtt');
    expect(cues.map((c) => c.start)).toEqual([0, 10]);
  });
});

describe('core/thumbnails findThumbnailCue', () => {
  const cues: ThumbnailCue[] = [
    { start: 0, end: 5, url: 'a', x: 0, y: 0, w: 10, h: 10 },
    { start: 5, end: 10, url: 'b', x: 0, y: 0, w: 10, h: 10 },
    { start: 10, end: 15, url: 'c', x: 0, y: 0, w: 10, h: 10 },
  ];

  it('returns undefined for an empty cue list', () => {
    expect(findThumbnailCue([], 3)).toBeUndefined();
  });

  it('finds the cue covering the given time', () => {
    expect(findThumbnailCue(cues, 0)?.url).toBe('a');
    expect(findThumbnailCue(cues, 4.9)?.url).toBe('a');
    expect(findThumbnailCue(cues, 5)?.url).toBe('b');
    expect(findThumbnailCue(cues, 12)?.url).toBe('c');
  });

  it('falls back to the first cue for a time before every cue starts', () => {
    expect(findThumbnailCue(cues, -1)?.url).toBe('a');
  });

  it('falls back to the last cue for a time past every cue', () => {
    expect(findThumbnailCue(cues, 999)?.url).toBe('c');
  });
});

describe('core/thumbnails loadThumbnailCues', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and parses the manifest on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(SAMPLE_VTT) }),
    );
    const cues = await loadThumbnailCues('https://cdn.example.com/video/thumbs.vtt');
    expect(cues).toHaveLength(3);
  });

  it('resolves to an empty array on a non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, text: () => Promise.resolve('') }));
    const cues = await loadThumbnailCues('https://cdn.example.com/missing.vtt');
    expect(cues).toEqual([]);
  });

  it('resolves to an empty array when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')));
    const cues = await loadThumbnailCues('https://cdn.example.com/thumbs.vtt');
    expect(cues).toEqual([]);
  });
});

describe('core/thumbnails applyThumbnailPreview', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('hides the element when there is no cue', () => {
    const el = document.createElement('div');
    applyThumbnailPreview(el, undefined);
    expect(el.style.display).toBe('none');
  });

  it('sizes and crops the background image to the cue rect', () => {
    const el = document.createElement('div');
    applyThumbnailPreview(el, { start: 0, end: 5, url: 'https://cdn.example.com/sprite.jpg', x: 20, y: 40, w: 160, h: 90 });
    expect(el.style.display).toBe('block');
    expect(el.style.width).toBe('160px');
    expect(el.style.height).toBe('90px');
    expect(el.style.backgroundImage).toBe('url("https://cdn.example.com/sprite.jpg")');
    expect(el.style.backgroundPosition).toBe('-20px -40px');
  });
});
