// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { mountComponents } from '../client/components';

vi.mock('ranui/markdown', () => {
  customElements.define('r-markdown', class extends HTMLElement {});
  return {};
});
vi.mock('ranui/math', () => {
  customElements.define('r-math', class extends HTMLElement {});
  return {};
});
vi.mock('ranui/player', () => {
  customElements.define('r-player', class extends HTMLElement {});
  return {};
});
vi.mock('ranui/mermaid', () => {
  customElements.define('r-mermaid', class extends HTMLElement {});
  return {};
});

let stop: (() => void) | undefined;
afterEach(() => {
  stop?.();
  stop = undefined;
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

const viewport = () => {
  let callback!: IntersectionObserverCallback;
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(onIntersection: IntersectionObserverCallback) {
        callback = onIntersection;
      }
      observe = observe;
      unobserve = unobserve;
      disconnect = disconnect;
    },
  );
  return {
    observe,
    unobserve,
    disconnect,
    enter: (element: Element, isIntersecting = true) =>
      callback([{ target: element, isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver),
  };
};

it('keeps offscreen Markdown unloaded until it approaches the viewport', async () => {
  const observer = viewport();
  document.body.innerHTML = '<r-markdown content="example"></r-markdown>';
  const element = document.querySelector('r-markdown')!;
  stop = mountComponents();
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(customElements.get('r-markdown')).toBeUndefined();
  expect(observer.observe).toHaveBeenCalledWith(element);
  observer.enter(element, false);
  expect(customElements.get('r-markdown')).toBeUndefined();
  observer.enter(element);
  await customElements.whenDefined('r-markdown');
  await vi.waitFor(() => expect(observer.unobserve).toHaveBeenCalledWith(element));
});

it('prepares encoded Markdown through an attribute without shadowing the component property', async () => {
  viewport();
  document.body.innerHTML = '<r-markdown data-content="%23%20Hello%0A%0A%2A%2Abold%2A%2A"></r-markdown>';
  stop = mountComponents();
  const element = document.querySelector('r-markdown')!;
  expect(element.getAttribute('content')).toBe('# Hello\n\n**bold**');
  expect(Object.hasOwn(element, 'content')).toBe(false);
  document.body.insertAdjacentHTML('beforeend', '<r-markdown data-content="Later%20example"></r-markdown>');
  await vi.waitFor(() =>
    expect(document.querySelector('r-markdown:last-child')!.getAttribute('content')).toBe('Later example'),
  );
});

it('loads heavy components eagerly when IntersectionObserver is unavailable', async () => {
  vi.stubGlobal('IntersectionObserver', undefined);
  document.body.innerHTML = '<r-math latex="x^2"></r-math>';
  stop = mountComponents();
  await customElements.whenDefined('r-math');
  expect(customElements.get('r-math')).toBeDefined();
});

it('observes dynamically inserted players and ignores a player removed before intersection', async () => {
  const observer = viewport();
  stop = mountComponents();
  const element = document.createElement('r-player');
  document.body.append(element);
  await vi.waitFor(() => expect(observer.observe).toHaveBeenCalledWith(element));
  element.remove();
  observer.enter(element);
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(customElements.get('r-player')).toBeUndefined();
  document.body.append(element);
  await vi.waitFor(() => expect(observer.observe).toHaveBeenCalledTimes(2));
  observer.enter(element);
  await customElements.whenDefined('r-player');
});

it('disconnects viewport work and ignores queued callbacks after unmount', async () => {
  const observer = viewport();
  document.body.innerHTML = '<r-mermaid code="graph%20LR%3BA--%3EB"></r-mermaid>';
  const element = document.querySelector('r-mermaid')!;
  stop = mountComponents();
  stop();
  observer.enter(element);
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(customElements.get('r-mermaid')).toBeUndefined();
  expect(observer.disconnect).toHaveBeenCalled();
});
