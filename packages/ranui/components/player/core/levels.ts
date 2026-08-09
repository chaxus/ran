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

/** Highest-quality-first rank for sorting: a manifest's own level order is
 * whatever it happened to be authored/declared in, not necessarily by
 * resolution — reported as-is by hls.js, it renders as a visually random
 * quality menu (e.g. 720p, 240p, 380p, 480p, 1080p). Height and bitrate
 * aren't on a comparable numeric scale (a 480kbps stream's raw bitrate
 * number can easily exceed a 1080p stream's raw height number), so a level
 * with a known height always outranks a bitrate-only one — comparing within
 * each group only, never across — rather than comparing the two raw numbers
 * directly. */
const levelRank = (level: ManifestLevelLike): [tier: number, metric: number] =>
  level.height ? [1, level.height] : [0, level.bitrate ?? 0];

export function buildManifestLevels<TLevel extends ManifestLevelLike>(
  input: BuildManifestLevelsInput<TLevel>,
): BuildManifestLevelsResult<TLevel> {
  const levels: Array<TLevel & { name: string; url: string }> = [];
  const levelMapEntries: Array<[string, string]> = [];

  const sortedLevels = [...input.levels].sort((a, b) => {
    const [tierA, metricA] = levelRank(a);
    const [tierB, metricB] = levelRank(b);
    return tierA !== tierB ? tierB - tierA : metricB - metricA;
  });

  sortedLevels.forEach((item) => {
    const name = deriveLevelName(item);
    if (!name) return;

    const url = item.url || input.manifestUrl;
    if (input.existingLevelMap.get(name) === url) return;

    levels.push({ ...item, name, url });
    levelMapEntries.push([name, url]);
  });

  // `Auto` leads the menu, matching the convention modern players (YouTube,
  // Twitch) use — it's the recommended/default choice, not an also-ran at
  // the bottom of a quality list.
  if (!input.existingLevelMap.get('Auto')) {
    levels.unshift({ name: 'Auto', url: input.manifestUrl } as TLevel & { name: string; url: string });
    levelMapEntries.unshift(['Auto', input.manifestUrl]);
  }

  return { levels, levelMapEntries };
}
