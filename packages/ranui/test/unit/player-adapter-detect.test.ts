import { describe, expect, it } from 'vitest';
import { detectFormat } from '@/components/player/core/adapters/detect';

describe('detectFormat', () => {
  it('detects hls from .m3u8', () => {
    expect(detectFormat('https://cdn.example.com/stream/master.m3u8')).toBe('hls');
  });

  it('detects dash from .mpd', () => {
    expect(detectFormat('https://cdn.example.com/stream/manifest.mpd')).toBe('dash');
  });

  it('detects flv from .flv', () => {
    expect(detectFormat('https://cdn.example.com/live/stream.flv')).toBe('flv');
  });

  it('detects flv from raw .ts (mpegts.js also demuxes this)', () => {
    expect(detectFormat('https://cdn.example.com/live/stream.ts')).toBe('flv');
  });

  it('falls back to native for an unrecognized extension', () => {
    expect(detectFormat('https://cdn.example.com/video.mp4')).toBe('native');
  });

  it('falls back to native when src is empty', () => {
    expect(detectFormat('')).toBe('native');
  });

  it('strips query string and hash before matching the extension', () => {
    expect(detectFormat('https://cdn.example.com/master.m3u8?token=abc&exp=123')).toBe('hls');
    expect(detectFormat('https://cdn.example.com/manifest.mpd#t=10')).toBe('dash');
  });

  it('is case-insensitive on the extension', () => {
    expect(detectFormat('https://cdn.example.com/MASTER.M3U8')).toBe('hls');
  });

  it('an explicit typeHint overrides extension sniffing', () => {
    expect(detectFormat('https://cdn.example.com/signed-url-no-extension', 'dash')).toBe('dash');
    expect(detectFormat('https://cdn.example.com/video.mp4', 'hls')).toBe('hls');
  });

  it('is case-insensitive and trims whitespace on typeHint', () => {
    expect(detectFormat('https://cdn.example.com/x', ' DASH ')).toBe('dash');
  });

  it('an invalid typeHint falls through to extension sniffing', () => {
    expect(detectFormat('https://cdn.example.com/master.m3u8', 'video/mp4')).toBe('hls');
    expect(detectFormat('https://cdn.example.com/master.m3u8', '')).toBe('hls');
  });
});
