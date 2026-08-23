import componentCss from './index.less?inline';
import { ButtonBuilder, Div, EventManager, Span, View } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  mountShadowTree,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { formatBytes } from 'ranuts/utils';

/** One file staged for sending. */
export interface Attachment {
  /** Stable for this attachment's life; what `remove` takes and events report. */
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  /**
   * Object URL for an image preview, or null for anything else.
   *
   * An object URL, not a data URL: previewing costs a reference to bytes the browser
   * already holds, while reading a 10 MB photo into a base64 string to show a 40px
   * thumbnail costs the string. The data URL is built later, once, by whoever sends.
   */
  previewUrl: string | null;
}

/** Why a file was not accepted. */
export type AttachmentRejection = 'too-large' | 'type-not-accepted' | 'too-many' | 'duplicate';

/** Bytes allowed per file unless `max-size` says otherwise. */
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;

let sequence = 0;

/**
 * `<r-attachments>` — the files staged alongside a message.
 *
 * It holds the list, previews it, validates what arrives, and owns the object URLs it
 * creates. It does not collect files: paste, drag-and-drop and a file picker are three
 * gestures belonging to three different elements of a composer, and which of them an app
 * offers is the app's decision. Call {@link add} from whichever it wires.
 *
 * ```ts
 * const strip = document.querySelector('r-attachments');
 * input.addEventListener('paste', (e) => {
 *   if (e.clipboardData?.files.length) strip.add(e.clipboardData.files);
 * });
 * strip.addEventListener('attachmentrejected', (e) => toast(explain(e.detail.reason)));
 * ```
 *
 * **Rejection is reported, never silent.** A file that vanishes because it was 3 MB over a
 * limit nobody mentioned reads as a bug in the page.
 *
 * Attributes: `accept` (as `<input accept>`), `max-size` (bytes), `max-count`, `sheet`.
 * `count` is reflected so an empty strip can take no space.
 *
 * Events: `attachmentschange` (`{ attachments }`), `attachmentrejected`
 * (`{ file, reason }`).
 */
export class Attachments extends RanElement {
  _events = new EventManager();
  _shadowDom!: ShadowRoot;
  _list!: HTMLElement;

  private _attachments: Attachment[] = [];

  static get observedAttributes(): string[] {
    return ['sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);
    this._list = mountShadowTree(this._shadowDom, () =>
      Div().class('ran-attachments').attr('part', 'list').attr('role', 'list').build(),
    );
  }

  // ── Accessors ──────────────────────────────────────────────────────────

  /** The staged files, in the order they arrived. */
  get attachments(): readonly Attachment[] {
    return this._attachments;
  }

  /** Just the files, for building a request body. */
  get files(): File[] {
    return this._attachments.map((attachment) => attachment.file);
  }

  /** Comma-separated types or extensions, in the form `<input accept>` takes. */
  get accept(): string {
    return getStringAttribute(this, 'accept');
  }
  set accept(value: string) {
    setStringAttribute(this, 'accept', value);
  }

  /** Largest file accepted, in bytes. */
  get maxSize(): number {
    const raw = Number(getStringAttribute(this, 'max-size'));
    return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_MAX_SIZE;
  }
  set maxSize(value: number) {
    setStringAttribute(this, 'max-size', String(value));
  }

  /** Most files that may be staged at once; unlimited when unset. */
  get maxCount(): number {
    const raw = Number(getStringAttribute(this, 'max-count'));
    return Number.isFinite(raw) && raw > 0 ? raw : Number.POSITIVE_INFINITY;
  }
  set maxCount(value: number) {
    setStringAttribute(this, 'max-count', String(value));
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }

  // ── Public API ─────────────────────────────────────────────────────────

  /**
   * Stages files, rejecting what does not qualify.
   *
   * @param files Anything iterable of `File` — a `FileList` from a picker, a drop, or a
   *   paste.
   * @returns The attachments that were accepted, in arrival order.
   */
  add(files: Iterable<File>): Attachment[] {
    const accepted: Attachment[] = [];
    for (const file of files) {
      const reason = this._reject(file);
      if (reason !== null) {
        this._emit('attachmentrejected', { file, reason });
        continue;
      }
      const attachment: Attachment = {
        id: `attachment-${(sequence += 1)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      };
      this._attachments.push(attachment);
      accepted.push(attachment);
    }
    if (accepted.length > 0) this._render();
    return accepted;
  }

  /**
   * Removes one attachment and releases its preview.
   *
   * Named `detach` rather than `remove` because every element already has a `remove()` that
   * takes no arguments and takes itself out of the document. Shadowing it with different
   * semantics is a trap for anyone who reaches for the standard method.
   *
   * @param id The attachment id.
   * @returns Whether anything was removed.
   */
  detach(id: string): boolean {
    const at = this._attachments.findIndex((attachment) => attachment.id === id);
    if (at === -1) return false;
    const [removed] = this._attachments.splice(at, 1);
    this._release(removed);
    this._render();
    return true;
  }

  /** Removes everything and releases every preview — what sending should call. */
  clear(): void {
    if (this._attachments.length === 0) return;
    for (const attachment of this._attachments) this._release(attachment);
    this._attachments = [];
    this._render();
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────

  connectedCallback(): void {
    this.handlerExternalCss();
    this._render();
  }

  disconnectedCallback(): void {
    this._events.abort();
    // Every object URL created here is released here. A page that stages a dozen photos and
    // navigates away would otherwise hold their bytes until it is closed.
    for (const attachment of this._attachments) this._release(attachment);
  }

  attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (old === next) return;
    if (name === 'sheet') this.handlerExternalCss();
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  // ── Internals ──────────────────────────────────────────────────────────

  private _release(attachment: Attachment): void {
    if (attachment.previewUrl !== null) URL.revokeObjectURL(attachment.previewUrl);
  }

  private _emit(type: string, detail: unknown): void {
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  }

  /**
   * Decides whether a file may be staged.
   *
   * @param file The candidate.
   * @returns The reason to refuse it, or null to accept.
   */
  private _reject(file: File): AttachmentRejection | null {
    if (this._attachments.length >= this.maxCount) return 'too-many';
    if (file.size > this.maxSize) return 'too-large';
    if (!this._accepts(file)) return 'type-not-accepted';
    // Pasting the same screenshot twice is a slip, not an instruction. Name, size and
    // modification time together are what a file manager treats as the same file.
    const duplicate = this._attachments.some(
      (a) => a.name === file.name && a.size === file.size && a.file.lastModified === file.lastModified,
    );
    return duplicate ? 'duplicate' : null;
  }

  /**
   * Matches a file against the `accept` list, the way a file picker does.
   *
   * @param file The candidate.
   * @returns Whether its type or extension is listed.
   */
  private _accepts(file: File): boolean {
    const accept = this.accept.trim();
    if (accept === '') return true;
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();
    return accept.split(',').some((raw) => {
      const rule = raw.trim().toLowerCase();
      if (rule === '') return false;
      if (rule.startsWith('.')) return name.endsWith(rule);
      if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
      return type === rule;
    });
  }

  private _render(): void {
    this._events.abort();
    this._list.replaceChildren();

    for (const attachment of this._attachments) {
      const row = Div().class('ran-attachment').attr('part', 'attachment').attr('role', 'listitem').build();
      row.dataset.id = attachment.id;

      if (attachment.previewUrl !== null) {
        const thumb = View('img').class('ran-attachment-thumb').attr('part', 'thumb').build() as HTMLImageElement;
        thumb.src = attachment.previewUrl;
        // The name, not "image": a screen reader reading "image" for each of four
        // attachments has told the reader nothing about which is which.
        thumb.alt = attachment.name;
        row.appendChild(thumb);
      } else {
        row.appendChild(View('r-icon').class('ran-attachment-icon').attr('part', 'icon').attr('name', 'book').build());
      }

      const meta = Div().class('ran-attachment-meta').build();
      meta.appendChild(Span().class('ran-attachment-name').attr('part', 'name').text(attachment.name).build());
      meta.appendChild(
        Span().class('ran-attachment-size').attr('part', 'size').text(formatBytes(attachment.size)).build(),
      );
      row.appendChild(meta);

      const remove = ButtonBuilder()
        .class('ran-attachment-remove')
        .attr('part', 'remove')
        .attr('type', 'button')
        // Named with the file, so a list of four remove buttons is four distinct commands.
        .attr('aria-label', `Remove ${attachment.name}`)
        .children(View('r-icon').attr('name', 'close').build())
        .build();
      this._events.on(remove, 'click', () => this.detach(attachment.id));
      row.appendChild(remove);

      this._list.appendChild(row);
    }

    // `removeEmpty` is what actually removes the attribute — passing null alone sets it to
    // the empty string, and `:host(:not([count]))` would then never match.
    setStringAttribute(this, 'count', this._attachments.length === 0 ? null : String(this._attachments.length), {
      removeEmpty: true,
    });
    this._emit('attachmentschange', { attachments: this.attachments });
  }
}

defineSSR('r-attachments', Attachments as unknown as new () => HTMLElement);
export default Attachments;
