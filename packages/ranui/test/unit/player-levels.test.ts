import { describe, expect, it } from 'vitest';
import { buildManifestLevels, deriveLevelName } from '@/components/player/core/levels';

describe('player manifest level helpers', () => {
  it('derives display names from explicit name, height, then bitrate', () => {
    expect(deriveLevelName({ name: 'HD', height: 1080, bitrate: 5_000_000 })).toBe('HD');
    expect(deriveLevelName({ height: 720, bitrate: 3_000_000 })).toBe('720p');
    expect(deriveLevelName({ bitrate: 850_000 })).toBe('850k');
    expect(deriveLevelName({})).toBe('');
  });

  it('normalizes manifest levels, sorts them highest-quality-first, and leads with Auto', () => {
    const result = buildManifestLevels({
      manifestUrl: 'https://cdn.example.com/master.m3u8',
      levels: [
        // Deliberately out of order — a manifest's own level order isn't
        // necessarily sorted by resolution (mirrors real HLS manifests).
        { bitrate: 480_000, url: 'https://cdn.example.com/480.m3u8' },
        { height: 1080, url: 'https://cdn.example.com/1080.m3u8' },
      ],
      existingLevelMap: new Map(),
    });

    expect(result.levels.map((item) => item.name)).toEqual(['Auto', '1080p', '480k']);
    expect(result.levelMapEntries).toEqual([
      ['Auto', 'https://cdn.example.com/master.m3u8'],
      ['1080p', 'https://cdn.example.com/1080.m3u8'],
      ['480k', 'https://cdn.example.com/480.m3u8'],
    ]);
  });

  it('sorts unsorted manifest levels highest-resolution-first', () => {
    const result = buildManifestLevels({
      manifestUrl: 'https://cdn.example.com/master.m3u8',
      levels: [
        { height: 720, url: 'https://cdn.example.com/720.m3u8' },
        { height: 240, url: 'https://cdn.example.com/240.m3u8' },
        { height: 480, url: 'https://cdn.example.com/480.m3u8' },
        { height: 1080, url: 'https://cdn.example.com/1080.m3u8' },
      ],
      existingLevelMap: new Map(),
    });

    expect(result.levels.map((item) => item.name)).toEqual(['Auto', '1080p', '720p', '480p', '240p']);
  });

  it('skips levels already mapped to the same URL', () => {
    const result = buildManifestLevels({
      manifestUrl: 'https://cdn.example.com/master.m3u8',
      levels: [
        { name: '720p', url: 'https://cdn.example.com/720.m3u8' },
        { name: '1080p', url: 'https://cdn.example.com/1080.m3u8' },
      ],
      existingLevelMap: new Map([
        ['720p', 'https://cdn.example.com/720.m3u8'],
        ['Auto', 'https://cdn.example.com/master.m3u8'],
      ]),
    });

    expect(result.levels.map((item) => item.name)).toEqual(['1080p']);
    expect(result.levelMapEntries).toEqual([['1080p', 'https://cdn.example.com/1080.m3u8']]);
  });
});
