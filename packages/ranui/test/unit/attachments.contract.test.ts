import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Attachments } from '@/components/attachments';
import '@/components/attachments';

let created: string[] = [];
let revoked: string[] = [];

/**
 * A file with a real size and modification time, since both take part in duplicate
 * detection and neither survives a bare `new File([], name)`.
 *
 * @param name File name.
 * @param type MIME type.
 * @param size Byte length.
 * @param lastModified Modification time.
 * @returns The file.
 */
function makeFile(name: string, type: string, size = 10, lastModified = 1): File {
  const file = new File([new Uint8Array(size)], name, { type, lastModified });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

/**
 * Mounts an attachment strip.
 *
 * @returns The element, its shadow root, and the list container.
 */
function mount(): { strip: Attachments; shadow: ShadowRoot; list: HTMLElement } {
  const strip = document.createElement('r-attachments') as Attachments;
  document.body.appendChild(strip);
  const shadow = (strip as unknown as { _shadowDom: ShadowRoot })._shadowDom;
  return { strip, shadow, list: shadow.querySelector<HTMLElement>('.ran-attachments')! };
}

describe('r-attachments contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    created = [];
    revoked = [];
    // jsdom implements neither, and the whole point of the preview is the pair.
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: (file: File) => {
        const url = `blob:${file.name}#${created.length}`;
        created.push(url);
        return url;
      },
      revokeObjectURL: (url: string) => revoked.push(url),
    });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // ── Staging ─────────────────────────────────────────────────────────────

  it('stages files and reports them in arrival order', () => {
    const { strip } = mount();
    strip.add([makeFile('a.png', 'image/png'), makeFile('b.pdf', 'application/pdf')]);
    expect(strip.attachments.map((a) => a.name)).toEqual(['a.png', 'b.pdf']);
    expect(strip.files).toHaveLength(2);
  });

  it('previews an image and shows a placeholder for anything else', () => {
    const { strip, list } = mount();
    strip.add([makeFile('a.png', 'image/png'), makeFile('b.pdf', 'application/pdf')]);
    const rows = [...list.querySelectorAll('.ran-attachment')];
    expect(rows[0].querySelector('img')).not.toBeNull();
    expect(rows[1].querySelector('img')).toBeNull();
    expect(rows[1].querySelector('r-icon')).not.toBeNull();
  });

  it('names the thumbnail after the file, not "image"', () => {
    // Four attachments all announced as "image" have told the reader nothing about which
    // is which.
    const { strip, list } = mount();
    strip.add([makeFile('receipt.png', 'image/png')]);
    expect(list.querySelector('img')?.getAttribute('alt')).toBe('receipt.png');
  });

  it('shows a readable size rather than a byte count', () => {
    const { strip, list } = mount();
    strip.add([makeFile('big.png', 'image/png', 1536)]);
    expect(list.querySelector('.ran-attachment-size')?.textContent).toBe('1.5 KB');
  });

  it('announces the change once per batch, not once per file', () => {
    const { strip } = mount();
    const changes: number[] = [];
    strip.addEventListener('attachmentschange', (e) => changes.push((e as CustomEvent).detail.attachments.length));
    strip.add([makeFile('a.png', 'image/png'), makeFile('b.png', 'image/png')]);
    expect(changes).toEqual([2]);
  });

  // ── Object URL lifecycle ────────────────────────────────────────────────

  it('releases a preview when its attachment goes', () => {
    const { strip } = mount();
    const [attachment] = strip.add([makeFile('a.png', 'image/png')]);
    expect(created).toHaveLength(1);

    strip.detach(attachment.id);
    expect(revoked).toEqual(created);
  });

  it('releases every preview on clear', () => {
    const { strip } = mount();
    strip.add([makeFile('a.png', 'image/png'), makeFile('b.png', 'image/png')]);
    strip.clear();
    expect(revoked).toHaveLength(2);
    expect(strip.attachments).toHaveLength(0);
  });

  it('releases every preview when it leaves the document', () => {
    // A page that stages a dozen photos and navigates away would otherwise hold their bytes
    // until it is closed.
    const { strip } = mount();
    strip.add([makeFile('a.png', 'image/png'), makeFile('b.png', 'image/png')]);
    strip.remove();
    expect(revoked).toHaveLength(2);
  });

  it('creates no preview for a file it cannot show', () => {
    const { strip } = mount();
    strip.add([makeFile('a.pdf', 'application/pdf')]);
    expect(created).toHaveLength(0);
  });

  // ── Rejection ───────────────────────────────────────────────────────────

  it('refuses a file over the size limit, and says so', () => {
    const { strip } = mount();
    const rejected: { reason: string; file: File }[] = [];
    strip.addEventListener('attachmentrejected', (e) => rejected.push((e as CustomEvent).detail));

    strip.maxSize = 100;
    strip.add([makeFile('big.png', 'image/png', 200)]);

    // A file that vanishes because it was over a limit nobody mentioned reads as a bug.
    expect(rejected).toHaveLength(1);
    expect(rejected[0].reason).toBe('too-large');
    expect(strip.attachments).toHaveLength(0);
  });

  it('matches accept the way a file picker does', () => {
    const { strip } = mount();
    strip.accept = 'image/*,.pdf,text/csv';
    strip.add([
      makeFile('a.png', 'image/png'),
      makeFile('b.pdf', 'application/pdf'),
      makeFile('c.csv', 'text/csv'),
      makeFile('d.exe', 'application/x-msdownload'),
    ]);
    expect(strip.attachments.map((a) => a.name)).toEqual(['a.png', 'b.pdf', 'c.csv']);
  });

  it('accepts anything when accept is unset', () => {
    const { strip } = mount();
    strip.add([makeFile('d.exe', 'application/x-msdownload')]);
    expect(strip.attachments).toHaveLength(1);
  });

  it('refuses more than the count allows', () => {
    const { strip } = mount();
    strip.maxCount = 2;
    strip.add([makeFile('a.png', 'image/png'), makeFile('b.png', 'image/png'), makeFile('c.png', 'image/png')]);
    expect(strip.attachments).toHaveLength(2);
  });

  it('refuses the same file twice, because pasting it again is a slip', () => {
    const { strip } = mount();
    const rejected: string[] = [];
    strip.addEventListener('attachmentrejected', (e) => rejected.push((e as CustomEvent).detail.reason));

    strip.add([makeFile('shot.png', 'image/png', 10, 5)]);
    strip.add([makeFile('shot.png', 'image/png', 10, 5)]);
    expect(strip.attachments).toHaveLength(1);
    expect(rejected).toEqual(['duplicate']);

    // Same name, different file: a second screenshot taken a moment later.
    strip.add([makeFile('shot.png', 'image/png', 10, 6)]);
    expect(strip.attachments).toHaveLength(2);
  });

  // ── Presence ────────────────────────────────────────────────────────────

  it('reflects a count so an empty strip can take no space', () => {
    const { strip } = mount();
    expect(strip.hasAttribute('count')).toBe(false);
    strip.add([makeFile('a.png', 'image/png')]);
    expect(strip.getAttribute('count')).toBe('1');
    strip.clear();
    expect(strip.hasAttribute('count')).toBe(false);
  });

  // ── Removing ────────────────────────────────────────────────────────────

  it('names each remove button after its file', () => {
    const { strip, list } = mount();
    strip.add([makeFile('a.png', 'image/png'), makeFile('b.png', 'image/png')]);
    expect([...list.querySelectorAll('.ran-attachment-remove')].map((b) => b.getAttribute('aria-label'))).toEqual([
      'Remove a.png',
      'Remove b.png',
    ]);
  });

  it('removes the attachment its button belongs to', () => {
    const { strip, list } = mount();
    strip.add([makeFile('a.png', 'image/png'), makeFile('b.png', 'image/png')]);
    list.querySelectorAll<HTMLElement>('.ran-attachment-remove')[0].click();
    expect(strip.attachments.map((a) => a.name)).toEqual(['b.png']);
  });

  it('reports nothing removed for an id it does not hold', () => {
    const { strip } = mount();
    expect(strip.detach('attachment-nope')).toBe(false);
  });
});
