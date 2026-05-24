export interface ManifestLevelLike {
  bitrate?: number;
  height?: number;
  name?: string;
  url?: string;
}

export interface BuildManifestLevelsInput<TLevel extends ManifestLevelLike> {
  existingLevelMap: Map<string, string>;
  levels: TLevel[];
  manifestUrl: string;
}

export interface BuildManifestLevelsResult<TLevel extends ManifestLevelLike> {
  levelMapEntries: Array<[string, string]>;
  levels: Array<TLevel & { name: string; url: string }>;
}

export function deriveLevelName(level: ManifestLevelLike): string {
  return (
    level.name ||
    (level.height ? `${level.height}p` : '') ||
    (level.bitrate ? `${Math.round(level.bitrate / 1000)}k` : '')
  );
}

export function buildManifestLevels<TLevel extends ManifestLevelLike>(
  input: BuildManifestLevelsInput<TLevel>,
): BuildManifestLevelsResult<TLevel> {
  const levels: Array<TLevel & { name: string; url: string }> = [];
  const levelMapEntries: Array<[string, string]> = [];

  input.levels.forEach((item) => {
    const name = deriveLevelName(item);
    if (!name) return;

    const url = item.url || input.manifestUrl;
    if (input.existingLevelMap.get(name) === url) return;

    levels.push({ ...item, name, url });
    levelMapEntries.push([name, url]);
  });

  if (!input.existingLevelMap.get('Auto')) {
    levels.push({ name: 'Auto', url: input.manifestUrl } as TLevel & { name: string; url: string });
    levelMapEntries.push(['Auto', input.manifestUrl]);
  }

  return { levels, levelMapEntries };
}
