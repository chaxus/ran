/**
 * These image helpers now live in ranuts (`getImage` / `cutRound` / `opacity` /
 * `getMatrix`). The test stays here because it needs a DOM — ranuts' own suite runs
 * in the node environment with no jsdom, so it could only cover the pure `getMatrix`.
 *
 * `getBase64Image` is gone: ranuts already had `readFileAsDataURL` (and
 * `convertImageToBase64`) doing exactly the same FileReader dance.
 */
import { describe, expect, it, vi } from 'vitest';
import { getImage, getMatrix, readFileAsDataURL } from 'ranuts/utils';

describe('ranuts image helpers', () => {
  it('creates a normalized gaussian matrix', () => {
    const matrix = getMatrix(1, 1);
    const total = matrix.reduce((sum: number, value: number) => sum + value, 0);

    expect(matrix).toHaveLength(9);
    expect(total).toBeCloseTo(1);
    expect(matrix[4]).toBeGreaterThan(matrix[0]);
  });

  it('uses radius / 3 as the default sigma', () => {
    expect(getMatrix(3)).toEqual(getMatrix(3, 1));
  });

  it('resolves image elements on load', async () => {
    const OriginalImage = globalThis.Image;
    const created: Array<HTMLImageElement> = [];
    vi.stubGlobal(
      'Image',
      class ImageMock {
        onload: (() => void) | null = null;
        onerror: ((error: unknown) => void) | null = null;
        src = '';
        constructor() {
          created.push(this as unknown as HTMLImageElement);
        }
      },
    );

    const promise = getImage('/ok.png');
    expect(created[0].src).toBe('/ok.png');
    created[0].onload?.(new Event('load'));

    await expect(promise).resolves.toBe(created[0]);
    vi.stubGlobal('Image', OriginalImage);
  });

  it('rejects image elements on error', async () => {
    const OriginalImage = globalThis.Image;
    const created: Array<HTMLImageElement> = [];
    vi.stubGlobal(
      'Image',
      class ImageMock {
        onload: (() => void) | null = null;
        onerror: ((error: unknown) => void) | null = null;
        src = '';
        constructor() {
          created.push(this as unknown as HTMLImageElement);
        }
      },
    );

    const error = new Event('error');
    const promise = getImage('/missing.png');
    created[0].onerror?.(error);

    await expect(promise).rejects.toBe(error);
    vi.stubGlobal('Image', OriginalImage);
  });

  it('reads files as base64 data URLs', async () => {
    const file = new File(['ranui'], 'ranui.txt', { type: 'text/plain' });

    await expect(readFileAsDataURL(file)).resolves.toBe('data:text/plain;base64,cmFudWk=');
  });
});
