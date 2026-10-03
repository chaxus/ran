// @vitest-environment jsdom
import { expect, it, vi } from 'vitest';
import { mountComponents } from '../client/components';

vi.mock('ranui', () => {
  customElements.define('r-button', class extends HTMLElement {});
  customElements.define('r-player', class extends HTMLElement {});
  return {};
});
vi.mock('ranui/button', () => {
  customElements.define('r-button', class extends HTMLElement {});
  return {};
});
vi.mock('ranui/icon', () => {
  customElements.define('r-icon', class extends HTMLElement {});
  return {};
});

it('upgrades only components in use and upgrades components added later', async () => {
  document.body.innerHTML = '<r-button>Save</r-button>';
  const stop = mountComponents();
  await customElements.whenDefined('r-button');
  expect(customElements.get('r-player')).toBeUndefined();
  document.body.insertAdjacentHTML('beforeend', '<r-icon name="add"></r-icon>');
  await customElements.whenDefined('r-icon');
  if (typeof stop === 'function') stop();
});
