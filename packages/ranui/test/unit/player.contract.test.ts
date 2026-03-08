import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@/components/player';

describe('r-player contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('recovers drag state when mouseup happens on document', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);

    player.ctx.duration = 120;
    player.moveProgress.mouseDown = true;
    player.moveProgress.percentage = 0.25;

    const setCurrentTimeSpy = vi.spyOn(player, 'setCurrentTime');
    const playSpy = vi.spyOn(player, 'play').mockImplementation(() => undefined);
    const rafSpy = vi.spyOn(player, 'requestAnimationFrame').mockImplementation(() => undefined);

    document.dispatchEvent(new MouseEvent('mouseup'));

    expect(setCurrentTimeSpy).toHaveBeenCalledWith(30);
    expect(playSpy).toHaveBeenCalled();
    expect(rafSpy).toHaveBeenCalled();
    expect(player.moveProgress.mouseDown).toBe(false);
  });
});
