import { describe, expect, it } from 'vitest';
import { buildManifestLevels, deriveLevelName } from '@/components/player/core/levels';

describe('player manifest level helpers', () => {
  it('derives display names from explicit name, height, then bitrate', () => {
    expect(deriveLevelName({ name: 'HD', height: 1080, bitrate: 5_000_000 })).toBe('HD');
    expect(deriveLevelName({ height: 720, bitrate: 3_000_000 })).toBe('720p');
    expect(deriveLevelName({ bitrate: 850_000 })).toBe('850k');
    expect(deriveLevelName({})).toBe('');
  });

  it('normalizes manifest levels and appends Auto fallback', () => {
    const result = buildManifestLevels({
      manifestUrl: 'https://cdn.example.com/master.m3u8',
      levels: [
        { height: 1080, url: 'https://cdn.example.com/1080.m3u8' },
        { bitrate: 480_000, url: 'https://cdn.example.com/480.m3u8' },
      ],
      existingLevelMap: new Map(),
    });

    expect(result.levels.map((item) => item.name)).toEqual(['1080p', '480k', 'Auto']);
    expect(result.levelMapEntries).toEqual([
      ['1080p', 'https://cdn.example.com/1080.m3u8'],
      ['480k', 'https://cdn.example.com/480.m3u8'],
      ['Auto', 'https://cdn.example.com/master.m3u8'],
    ]);
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
