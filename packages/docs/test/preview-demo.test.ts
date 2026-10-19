// @vitest-environment jsdom
import { expect, it, vi } from 'vitest';
import { mountPreviewDemo } from '../client/preview';

it('never opens the file chooser for a target that is not r-preview', () => {
  document.body.innerHTML = '<button data-preview-upload="foreign">Choose</button><iframe id="foreign"></iframe>';
  const click = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
  const stop = mountPreviewDemo();
  try {
    document.querySelector('button')!.click();
    expect(click).not.toHaveBeenCalled();
  } finally {
    stop();
    click.mockRestore();
    document.body.replaceChildren();
  }
});
