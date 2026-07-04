import { describe, expect, it, beforeEach, vi } from 'vitest';
import '@/components/image';

describe('r-img contract', () => {
  const sleep = (ms = 10) => new Promise((r) => setTimeout(r, ms));

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders shadow DOM with .ran-image container', () => {
    const img = document.createElement('r-img');
    document.body.appendChild(img);

    const shadow = (img as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();
    expect(shadow.querySelector('.ran-image')).not.toBeNull();
  });

  it('reflects fallback property to attributes', () => {
    const img = document.createElement('r-img');
    document.body.appendChild(img);

    img.setAttribute('fallback', 'https://example.com/fallback.png');
    expect((img as any).fallback).toBe('https://example.com/fallback.png');

    img.removeAttribute('fallback');
    // should fall back to built-in failImage data URI
    expect(typeof (img as any).fallback).toBe('string');
    expect((img as any).fallback.length).toBeGreaterThan(0);
  });

  it('sets fallback via property setter', () => {
    const img = document.createElement('r-img');
    document.body.appendChild(img);

    (img as any).fallback = 'https://cdn.example.com/error.png';
    expect(img.getAttribute('fallback')).toBe('https://cdn.example.com/error.png');

    (img as any).fallback = '';
    expect(img.hasAttribute('fallback')).toBe(false);
  });

  it('appends img element to container on load', async () => {
    const img = document.createElement('r-img');
    img.setAttribute('src', 'https://example.com/photo.jpg');
    document.body.appendChild(img);

    const container = (img as any)._container as HTMLElement;
    const innerImg = (img as any)._image as HTMLImageElement;
    expect(innerImg).not.toBeUndefined();

    innerImg.dispatchEvent(new Event('load'));
    await sleep(10);

    expect(container.contains(innerImg)).toBe(true);
  });

  it('replaces src with fallback on error', async () => {
    const img = document.createElement('r-img');
    img.setAttribute('src', 'https://example.com/broken.jpg');
    img.setAttribute('fallback', 'https://example.com/fallback.jpg');
    document.body.appendChild(img);

    const innerImg = (img as any)._image as HTMLImageElement;
    innerImg.dispatchEvent(new Event('error'));
    await sleep(10);

    expect(innerImg.src).toContain('fallback.jpg');
  });

  it('forwards alt to the inner img; defaults to empty (decorative)', () => {
    const img = document.createElement('r-img') as any;
    img.setAttribute('src', 'https://example.com/photo.jpg');
    img.setAttribute('alt', 'A red bicycle');
    document.body.appendChild(img);

    expect(img._image.alt).toBe('A red bicycle');
  });

  it('gives the inner img an empty alt when none is set (skips the URL)', () => {
    const img = document.createElement('r-img') as any;
    img.setAttribute('src', 'https://example.com/photo.jpg');
    document.body.appendChild(img);

    expect(img._image.alt).toBe('');
  });

  it('updates inner img alt when the alt attribute changes', () => {
    const img = document.createElement('r-img') as any;
    img.setAttribute('src', 'https://example.com/photo.jpg');
    document.body.appendChild(img);

    img.setAttribute('alt', 'Updated description');
    expect(img._image.alt).toBe('Updated description');

    img.alt = 'Via property';
    expect(img.getAttribute('alt')).toBe('Via property');
    expect(img._image.alt).toBe('Via property');
  });

  it('applies sheet via handlerExternalCss', () => {
    const img = document.createElement('r-img');
    document.body.appendChild(img);

    img.setAttribute('sheet', '.ran-image { border: 1px solid red; }');
    expect(img.getAttribute('sheet')).toBe('.ran-image { border: 1px solid red; }');
  });

  it('listenFallback updates img fallback attribute when attribute changes', () => {
    const img = document.createElement('r-img') as any;
    document.body.appendChild(img);

    img._image = document.createElement('img');

    img.listenFallback('fallback', 'https://new-fallback.com/img.png');
    expect(img._image.getAttribute('fallback')).toBe('https://new-fallback.com/img.png');

    img.listenFallback('fallback', '');
    expect(img._image.hasAttribute('fallback')).toBe(false);
  });

  it('sheet property setter sets attribute', () => {
    const img = document.createElement('r-img') as any;
    document.body.appendChild(img);

    img.sheet = '.ran-image { background: blue; }';
    expect(img.getAttribute('sheet')).toBe('.ran-image { background: blue; }');
    expect(img.sheet).toBe('.ran-image { background: blue; }');
  });

  it('attributeChangedCallback handles sheet change', () => {
    const img = document.createElement('r-img') as any;
    document.body.appendChild(img);

    const spy = vi.spyOn(img, 'handlerExternalCss');
    img.sheet = '.ran-image { color: red; }';
    img.attributeChangedCallback('sheet', '', '.ran-image { color: red; }');
    expect(spy).toHaveBeenCalled();
  });
});
