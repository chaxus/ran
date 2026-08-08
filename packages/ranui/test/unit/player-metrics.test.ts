import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMetricsController } from '@/components/player/core/metrics';
import '@/components/player';

describe('core/metrics createMetricsController', () => {
  it('starts with zeroed counters and a null firstFrameMs', () => {
    const metrics = createMetricsController(() => 0);
    expect(metrics.getMetrics()).toEqual({
      rebufferCount: 0,
      rebufferDuration: 0,
      firstFrameMs: null,
      qualitySwitchCount: 0,
      errorCount: 0,
    });
  });

  it('records first-frame time from onLoadStart to the first canplay', () => {
    let t = 0;
    const metrics = createMetricsController(() => t);
    metrics.onLoadStart();
    t = 120;
    metrics.record('canplay', new Event('canplay'));
    expect(metrics.getMetrics().firstFrameMs).toBe(120);
    // A later playing event must not overwrite the already-recorded first frame.
    t = 500;
    metrics.record('playing', new Event('playing'));
    expect(metrics.getMetrics().firstFrameMs).toBe(120);
  });

  it('accumulates rebuffer count/duration across waiting→playing pairs', () => {
    let t = 0;
    const metrics = createMetricsController(() => t);
    metrics.onLoadStart();
    t = 10;
    metrics.record('canplay', new Event('canplay'));

    t = 100;
    metrics.record('waiting', new Event('waiting'));
    t = 250;
    metrics.record('playing', new Event('playing'));

    t = 300;
    metrics.record('waiting', new Event('waiting'));
    t = 380;
    metrics.record('playing', new Event('playing'));

    const result = metrics.getMetrics();
    expect(result.rebufferCount).toBe(2);
    expect(result.rebufferDuration).toBe(150 + 80);
  });

  it('counts qualityswitch and error/sourceerror events', () => {
    const metrics = createMetricsController(() => 0);
    metrics.onLoadStart();
    metrics.record('qualityswitch', { level: '720p' });
    metrics.record('qualityswitch', { level: 'Auto' });
    metrics.record('error', new Event('error'));
    metrics.record('sourceerror', { fatal: true, detail: {} });

    const result = metrics.getMetrics();
    expect(result.qualitySwitchCount).toBe(2);
    expect(result.errorCount).toBe(2);
  });

  it('onLoadStart resets every counter for a fresh source', () => {
    let t = 0;
    const metrics = createMetricsController(() => t);
    metrics.onLoadStart();
    t = 50;
    metrics.record('canplay', new Event('canplay'));
    metrics.record('error', new Event('error'));
    expect(metrics.getMetrics().errorCount).toBe(1);

    t = 1000;
    metrics.onLoadStart();
    expect(metrics.getMetrics()).toEqual({
      rebufferCount: 0,
      rebufferDuration: 0,
      firstFrameMs: null,
      qualitySwitchCount: 0,
      errorCount: 0,
    });
  });

  it('ignores unrecognized change names', () => {
    const metrics = createMetricsController(() => 0);
    metrics.onLoadStart();
    expect(() => metrics.record('volumechange', 50)).not.toThrow();
    expect(metrics.getMetrics()).toEqual({
      rebufferCount: 0,
      rebufferDuration: 0,
      firstFrameMs: null,
      qualitySwitchCount: 0,
      errorCount: 0,
    });
  });
});

const makePlayer = (): any => {
  const player = document.createElement('r-player') as any;
  document.body.appendChild(player);
  player._video = document.createElement('video');
  player.listenEvent();
  return player;
};

describe('r-player getMetrics()', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('exposes a metrics snapshot that updates as change() events fire', () => {
    const player = makePlayer();
    player._video.dispatchEvent(new Event('canplay'));
    player._video.dispatchEvent(new Event('waiting'));
    player._video.dispatchEvent(new Event('playing'));

    const metrics = player.getMetrics();
    expect(metrics.rebufferCount).toBe(1);
    expect(metrics.firstFrameMs).not.toBeNull();
  });

  it('resets metrics on every updatePlayer() (a fresh src load)', () => {
    const player = makePlayer();
    player._video.dispatchEvent(new Event('error'));
    expect(player.getMetrics().errorCount).toBe(1);

    const resetSpy = vi.spyOn(player._metrics, 'onLoadStart');
    player.updatePlayer();
    expect(resetSpy).toHaveBeenCalledTimes(1);
    expect(player.getMetrics().errorCount).toBe(0);
  });

  it('counts a user-triggered quality switch via changeClarity', () => {
    const player = makePlayer();
    player._engine = { setQuality: vi.fn(), destroy: vi.fn(), reloadsOnQualityChange: false };
    player.ctx.levelMap.set('720p', 'level-id-720p');

    player.changeClarity({ detail: { value: '720p' } } as unknown as Event);

    expect(player.getMetrics().qualitySwitchCount).toBe(1);
  });
});
