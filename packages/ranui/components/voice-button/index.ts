import componentCss from './index.less?inline';
import { ButtonBuilder, createRef, EventManager, View } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  shadowPart,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { createSpeechRecognizer } from 'ranuts/utils';
import type { SpeechError, SpeechRecognizer } from 'ranuts/utils';

/**
 * `<r-voice-button>` — dictation for a text composer.
 *
 * A microphone button, and nothing else. It owns the capture and reports what was heard;
 * where that text goes is the caller's decision, because a component that also wrote into
 * an input would have to know which input, whether to append or replace, and what to do
 * about the caret — three answers that differ per app.
 *
 * ```ts
 * const mic = document.querySelector('r-voice-button');
 * let base = '';
 * mic.addEventListener('voicestart', () => { base = input.value; });
 * mic.addEventListener('voiceresult', (e) => {
 *   input.value = base + e.detail.transcript;   // the whole capture, revised as it firms up
 * });
 * ```
 *
 * **It does not send.** Recognition is wrong often enough that committing on its behalf
 * takes away the review the speaker needs, so this fills the box and stops there.
 *
 * **It hides itself where speech recognition does not exist** — Firefox, and any browser
 * with the API absent. A button that cannot work is worse than no button: it invites a tap
 * and then explains itself.
 *
 * **Two gestures, because two devices want different ones.** With a mouse or pen it is a
 * toggle: click to start, click to stop, Escape to discard — the desktop pattern, and the
 * only one available to a keyboard. Under a finger it is push-to-talk: hold to record,
 * slide away to cancel, release to keep. That is the gesture a decade of voice messaging
 * has taught people, and it costs a touch user nothing to learn.
 *
 * Attributes: `lang` (BCP 47; defaults to the document's), `continuous`, `disabled`,
 * `label`, `active-label`, `hold-hint`, `cancel-hint`, `sheet`. `listening` is reflected
 * while capturing; `holding` and `cancelling` while a press-and-hold is in progress.
 *
 * Events: `voicestart`, `voiceresult` (`{ transcript, isFinal }`), `voiceerror`
 * (`{ kind, detail }`), `voiceend`.
 *
 * @fires voicestart - Capture began.
 * @fires voiceresult - A transcript arrived; interim results are revised, so this carries the whole capture.
 * @fires voiceerror - Capture failed.
 * @fires voiceend - Capture ended.
 */
export class VoiceButton extends RanElement {
  _events = new EventManager();
  _shadowDom!: ShadowRoot;
  _button!: HTMLButtonElement;
  _icon!: HTMLElement;
  _hint!: HTMLElement;

  private _recognizer: SpeechRecognizer | null = null;
  /** Pointer id of a press-and-hold in progress, so a second finger cannot end the first. */
  private _holdPointer: number | null = null;
  /** Where the holding pointer went down, to measure the slide that cancels. */
  private _holdOrigin = 0;

  static get observedAttributes(): string[] {
    return [
      'disabled',
      'label',
      'active-label',
      'hold-hint',
      'cancel-hint',
      'listening',
      'holding',
      'cancelling',
      'sheet',
    ];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);
    const iconRef = createRef<HTMLElement>();
    const hintRef = createRef<HTMLElement>();

    const button = ButtonBuilder()
      .class('ran-voice')
      .attr('part', 'button')
      .attr('type', 'button')
      .attr('aria-pressed', 'false')
      .children(
        View('r-icon').ref(iconRef).attr('name', 'mic').attr('part', 'icon').build(),
        View('span').class('ran-voice-hint').ref(hintRef).attr('part', 'hint').build(),
      )
      .build();
    this._shadowDom.appendChild(button);
    this._button = button as HTMLButtonElement;
    this._icon = shadowPart(iconRef, 'r icon');
    this._hint = shadowPart(hintRef, 'hint');
  }

  // ── Accessors ──────────────────────────────────────────────────────────

  /** Whether a capture is running. Reflected, so `:host([listening])` can style it. */
  get listening(): boolean {
    return this.hasAttribute('listening');
  }

  /** Whether this platform can recognize speech at all. */
  get supported(): boolean {
    return this._ensureRecognizer().supported;
  }

  /**
   * Language being spoken, as a BCP 47 tag.
   *
   * Read per capture rather than once, and defaulting to the document's own language, so an
   * app that switches locale mid-session dictates in the language it is showing.
   */
  get lang(): string {
    return getStringAttribute(this, 'lang') || document.documentElement.lang || navigator.language;
  }
  set lang(value: string) {
    setStringAttribute(this, 'lang', value);
  }

  /** Keep listening across pauses instead of stopping at the first one. */
  get continuous(): boolean {
    return getStringAttribute(this, 'continuous', 'true') !== 'false';
  }
  set continuous(value: boolean) {
    setStringAttribute(this, 'continuous', value ? 'true' : 'false');
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(value: boolean) {
    if (value) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  /** Accessible name while idle. */
  get label(): string {
    return getStringAttribute(this, 'label', 'Start voice input');
  }
  set label(value: string) {
    setStringAttribute(this, 'label', value);
  }

  /** Accessible name while listening; the name has to change, not only the icon. */
  get activeLabel(): string {
    return getStringAttribute(this, 'active-label', 'Stop voice input');
  }
  set activeLabel(value: string) {
    setStringAttribute(this, 'active-label', value);
  }

  /** Shown above the button while a finger is held down. */
  get holdHint(): string {
    return getStringAttribute(this, 'hold-hint', 'Release to keep · slide up to cancel');
  }
  set holdHint(value: string) {
    setStringAttribute(this, 'hold-hint', value);
  }

  /** Replaces {@link holdHint} once the finger has slid far enough to discard. */
  get cancelHint(): string {
    return getStringAttribute(this, 'cancel-hint', 'Release to cancel');
  }
  set cancelHint(value: string) {
    setStringAttribute(this, 'cancel-hint', value);
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }

  // ── Public API ─────────────────────────────────────────────────────────

  /** Starts a capture. Ignored while one is running, or when unsupported or disabled. */
  start(): void {
    if (this.disabled) return;
    this._ensureRecognizer().start();
  }

  /** Ends the capture, keeping what was recognized. */
  stop(): void {
    this._recognizer?.stop();
  }

  /** Ends the capture and discards it — what Escape should do. */
  abort(): void {
    this._recognizer?.abort();
  }

  /**
   * Starts if idle, stops if running.
   *
   * Decided from the recognizer's own state, not the reflected `listening` attribute. The
   * attribute follows the platform's start event, and a capture that has begun but not yet
   * reported it would leave the two disagreeing — the next activation would try to start a
   * second capture, be refused, and the button would sit there doing nothing.
   */
  toggle(): void {
    const recognizer = this._ensureRecognizer();
    if (recognizer.active) recognizer.stop();
    else this.start();
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────

  connectedCallback(): void {
    this.handlerExternalCss();
    this._events.on(this._button, 'click', this._onClick);
    this._events.on(this._button, 'pointerdown', this._onPointerDown as EventListener);
    this._events.on(this._button, 'pointermove', this._onPointerMove as EventListener);
    this._events.on(this._button, 'pointerup', this._onPointerUp as EventListener);
    this._events.on(this._button, 'pointercancel', this._onPointerCancel as EventListener);
    // Escape while listening discards the capture. A speaker who realises mid-sentence that
    // they said the wrong thing wants the text gone, not committed to the box.
    this._events.on(this, 'keydown', this._onKeydown as EventListener);
    this._syncButton();
    // Hidden rather than disabled: disabled says "not now", absent says "not here", and on
    // a browser with no speech recognition the second one is true.
    if (!this.supported) this.hidden = true;
  }

  disconnectedCallback(): void {
    this._events.abort();
    this._endHold();
    this._recognizer?.abort();
  }

  attributeChangedCallback(name: string, old: string | null, next: string | null): void {
    if (old === next) return;
    if (name === 'sheet') this.handlerExternalCss();
    else this._syncButton();
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  // ── Internals ──────────────────────────────────────────────────────────

  /** Distance a finger must travel before releasing discards instead of keeping. */
  private static readonly CANCEL_DISTANCE = 48;

  private _onClick = (): void => {
    // A hold has already decided what happens; the compatibility click that follows a touch
    // would otherwise start a second capture the moment the first one ended.
    if (this._holdPointer !== null) return;
    this.toggle();
  };

  private _onPointerDown = (event: PointerEvent): void => {
    // Only a finger holds. A mouse toggles, which is what a desktop expects and the only
    // gesture a keyboard can reach — press-and-hold has no keyboard equivalent.
    if (event.pointerType !== 'touch' || this.disabled || this.listening) return;
    // Suppresses the compatibility mouse events a touch would otherwise synthesise, which
    // would run this whole gesture a second time as a click.
    event.preventDefault();
    this._holdPointer = event.pointerId;
    this._holdOrigin = event.clientY;
    this.setAttribute('holding', '');
    this._button.setPointerCapture?.(event.pointerId);
    this._syncButton();
    this.start();
  };

  private _onPointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== this._holdPointer) return;
    // Up, not any direction: sliding sideways along a composer is how a thumb rests, and
    // treating that as intent to cancel would discard captures nobody meant to discard.
    const slid = this._holdOrigin - event.clientY > VoiceButton.CANCEL_DISTANCE;
    if (slid === this.hasAttribute('cancelling')) return;
    if (slid) this.setAttribute('cancelling', '');
    else this.removeAttribute('cancelling');
    this._syncButton();
  };

  private _onPointerUp = (event: PointerEvent): void => {
    if (event.pointerId !== this._holdPointer) return;
    const cancelling = this.hasAttribute('cancelling');
    this._endHold();
    if (cancelling) this.abort();
    else this.stop();
  };

  private _onPointerCancel = (event: PointerEvent): void => {
    if (event.pointerId !== this._holdPointer) return;
    // The system took the pointer away mid-gesture. The speaker never released, so they
    // never decided to keep it.
    this._endHold();
    this.abort();
  };

  private _endHold(): void {
    if (this._holdPointer !== null) this._button.releasePointerCapture?.(this._holdPointer);
    this._holdPointer = null;
    this.removeAttribute('holding');
    this.removeAttribute('cancelling');
    this._syncButton();
  }

  private _onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !this.listening) return;
    event.stopPropagation();
    this.abort();
  };

  private _emit(type: string, detail?: unknown): void {
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  }

  private _ensureRecognizer(): SpeechRecognizer {
    this._recognizer ??= createSpeechRecognizer({
      lang: () => this.lang,
      continuous: this.continuous,
      onStart: () => {
        this.setAttribute('listening', '');
        this._syncButton();
        this._emit('voicestart');
      },
      onResult: (transcript: string, isFinal: boolean) => {
        this._emit('voiceresult', { transcript, isFinal });
      },
      onError: (error: SpeechError) => {
        this._emit('voiceerror', error);
      },
      onEnd: () => {
        this.removeAttribute('listening');
        this._syncButton();
        this._emit('voiceend');
      },
    });
    return this._recognizer;
  }

  private _syncButton(): void {
    const listening = this.listening;
    this._button.disabled = this.disabled;
    this._button.setAttribute('aria-pressed', listening ? 'true' : 'false');
    // The name changes with the state, not just the icon: a screen reader reads the name.
    this._button.setAttribute('aria-label', listening ? this.activeLabel : this.label);
    this._icon.setAttribute('name', listening ? 'mic-off' : 'mic');
    this._hint.textContent = this.hasAttribute('cancelling') ? this.cancelHint : this.holdHint;
  }
}

defineSSR('r-voice-button', VoiceButton as unknown as new () => HTMLElement);
export default VoiceButton;
