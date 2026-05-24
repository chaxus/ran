import { describe, expect, it, vi } from 'vitest';
import { getBase64Image, getImage, getMatrix } from '@/utils/image';

describe('utils/image', () => {
  it('creates a normalized gaussian matrix', () => {
    const matrix = getMatrix(1, 1);
    const total = matrix.reduce((sum, value) => sum + value, 0);

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

    await expect(getBase64Image(file)).resolves.toEqual({
      base64: 'data:text/plain;base64,cmFudWk=',
    });
  });
});
