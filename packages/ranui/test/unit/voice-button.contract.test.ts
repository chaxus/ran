import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { VoiceButton } from '@/components/voice-button';
import '@/components/voice-button';

/** The slice of the native API the recognizer wraps. */
interface FakeRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: unknown) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

let instances: FakeRecognition[] = [];
/** Makes the fake begin a capture without reporting it, the way a platform with no
 *  microphone does — the native object exists and is running, but `onstart` never fires. */
let suppressStartEvent = false;

/**
 * Installs a fake Web Speech implementation.
 *
 * jsdom ships none, so without this the component would correctly hide itself and every
 * assertion below would be about a button that is not there.
 */
function installSpeech(): void {
  class Fake implements FakeRecognition {
    lang = '';
    continuous = false;
    interimResults = false;
    maxAlternatives = 1;
    onresult: ((event: unknown) => void) | null = null;
    onerror: ((event: { error: string }) => void) | null = null;
    onstart: (() => void) | null = null;
    onend: (() => void) | null = null;
    constructor() {
      instances.push(this);
    }
    start = (): void => {
      if (!suppressStartEvent) this.onstart?.();
    };
    stop = (): void => {
      this.onend?.();
    };
    abort = (): void => {
      this.onend?.();
    };
  }
  vi.stubGlobal('SpeechRecognition', Fake);
}

/**
 * Delivers a recognition result the way the platform does — the whole capture so far.
 *
 * @param text The transcript.
 * @param isFinal Whether recognition has firmed up.
 */
function speak(text: string, isFinal = false): void {
  const native = instances.at(-1)!;
  native.onresult?.({ resultIndex: 0, results: [Object.assign([{ transcript: text }], { isFinal })] });
}

/**
 * Mounts a voice button.
 *
 * @returns The element, its shadow root, and the inner button.
 */
function mount(): { mic: VoiceButton; shadow: ShadowRoot; button: HTMLButtonElement } {
  const mic = document.createElement('r-voice-button') as VoiceButton;
  document.body.appendChild(mic);
  const shadow = (mic as unknown as { _shadowDom: ShadowRoot })._shadowDom;
  return { mic, shadow, button: shadow.querySelector<HTMLButtonElement>('.ran-voice')! };
}

/**
 * Dispatches one pointer event on the inner button.
 *
 * @param button The shadow button.
 * @param type Event type.
 * @param init Pointer init; `pointerType` decides which gesture the component runs.
 * @returns The dispatched event, so a caller can inspect `defaultPrevented`.
 */
function pointer(button: HTMLElement, type: string, init: PointerEventInit = {}): PointerEvent {
  const event = new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 1, ...init });
  button.dispatchEvent(event);
  return event;
}

describe('r-voice-button contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    instances = [];
    suppressStartEvent = false;
    installSpeech();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // ── Structure ───────────────────────────────────────────────────────────

  it('renders a real button carrying a microphone icon', () => {
    const { shadow, button } = mount();
    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');
    expect(shadow.querySelector('r-icon')?.getAttribute('name')).toBe('mic');
  });

  it('exports part attributes', () => {
    const { shadow } = mount();
    expect(shadow.querySelector('.ran-voice')?.getAttribute('part')).toBe('button');
    expect(shadow.querySelector('r-icon')?.getAttribute('part')).toBe('icon');
  });

  // ── Capture lifecycle ───────────────────────────────────────────────────

  it('toggles the capture on activation', () => {
    const { mic, button } = mount();
    button.click();
    expect(mic.listening).toBe(true);
    button.click();
    expect(mic.listening).toBe(false);
  });

  it('reports the whole capture so far, not only the newest fragment', () => {
    const { mic, button } = mount();
    const results: { transcript: string; isFinal: boolean }[] = [];
    mic.addEventListener('voiceresult', (e) => results.push((e as CustomEvent).detail));

    button.click();
    speak('你好');
    speak('你好世界', true);

    // Interim results are revised as recognition firms up, so a consumer that appended each
    // event would end up with "你好你好世界".
    expect(results).toEqual([
      { transcript: '你好', isFinal: false },
      { transcript: '你好世界', isFinal: true },
    ]);
  });

  it('announces the start and the end of a capture', () => {
    const { mic, button } = mount();
    const seen: string[] = [];
    for (const type of ['voicestart', 'voiceend']) mic.addEventListener(type, () => seen.push(type));
    button.click();
    button.click();
    expect(seen).toEqual(['voicestart', 'voiceend']);
  });

  it('stops a capture whose start the platform has not reported yet', () => {
    // The reflected `listening` attribute follows the platform's start event. A capture that
    // has begun without reporting it — no audio device, a permission prompt still open —
    // leaves the attribute and the recognizer disagreeing, and a toggle decided from the
    // attribute would try to open a second capture, be refused, and do nothing at all.
    suppressStartEvent = true;
    const { mic, button } = mount();
    const ended: string[] = [];
    mic.addEventListener('voiceend', () => ended.push('end'));

    button.click();
    expect(mic.listening).toBe(false);

    button.click();
    expect(ended).toEqual(['end']);
  });

  it('discards the capture on Escape rather than committing it', () => {
    const { mic, button } = mount();
    button.click();
    expect(mic.listening).toBe(true);
    mic.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(mic.listening).toBe(false);
  });

  it('ignores Escape when it is not listening, so it does not swallow the key', () => {
    const { mic } = mount();
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    const stop = vi.spyOn(event, 'stopPropagation');
    mic.dispatchEvent(event);
    expect(stop).not.toHaveBeenCalled();
  });

  it('does nothing while disabled', () => {
    const { mic, button } = mount();
    mic.disabled = true;
    button.click();
    expect(mic.listening).toBe(false);
    expect(button.disabled).toBe(true);
  });

  it('ends any capture still running when it is removed', () => {
    const { mic, button } = mount();
    button.click();
    mic.remove();
    expect(mic.listening).toBe(false);
  });

  // ── Errors ──────────────────────────────────────────────────────────────

  it('reports a refused microphone as denied, distinct from routine ends', () => {
    const { mic, button } = mount();
    const errors: { kind: string }[] = [];
    mic.addEventListener('voiceerror', (e) => errors.push((e as CustomEvent).detail));

    button.click();
    instances.at(-1)!.onerror?.({ error: 'not-allowed' });
    expect(errors[0]).toMatchObject({ kind: 'denied', detail: 'not-allowed' });

    // A silent pause and a programmatic stop travel the same channel and are not failures;
    // a consumer that showed every one of these would nag on every capture.
    instances.at(-1)!.onerror?.({ error: 'no-speech' });
    instances.at(-1)!.onerror?.({ error: 'aborted' });
    expect(errors.map((e) => e.kind)).toEqual(['denied', 'noSpeech', 'aborted']);
  });

  // ── Accessibility ───────────────────────────────────────────────────────

  it('changes its accessible name with its state, not only its icon', () => {
    const { mic, shadow, button } = mount();
    mic.label = '开始语音输入';
    mic.activeLabel = '停止语音输入';

    expect(button.getAttribute('aria-label')).toBe('开始语音输入');
    expect(button.getAttribute('aria-pressed')).toBe('false');

    button.click();
    expect(button.getAttribute('aria-label')).toBe('停止语音输入');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(shadow.querySelector('r-icon')?.getAttribute('name')).toBe('mic-off');
  });

  it('dictates in the document language unless told otherwise', () => {
    document.documentElement.lang = 'zh-CN';
    const { mic, button } = mount();
    button.click();
    expect(instances.at(-1)!.lang).toBe('zh-CN');

    mic.stop();
    mic.lang = 'en-US';
    button.click();
    // Read per capture, so an app that switches locale mid-session dictates in what it shows.
    expect(instances.at(-1)!.lang).toBe('en-US');
  });
});

describe('r-voice-button where speech recognition does not exist', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.stubGlobal('SpeechRecognition', undefined);
    vi.stubGlobal('webkitSpeechRecognition', undefined);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('hides itself rather than offering a button that cannot work', () => {
    const mic = document.createElement('r-voice-button') as VoiceButton;
    document.body.appendChild(mic);
    expect(mic.supported).toBe(false);
    expect(mic.hidden).toBe(true);
  });

  it('stays inert when driven anyway', () => {
    const mic = document.createElement('r-voice-button') as VoiceButton;
    document.body.appendChild(mic);
    expect(() => mic.start()).not.toThrow();
    expect(mic.listening).toBe(false);
  });
});

describe('r-voice-button push-to-talk, under a finger', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    instances = [];
    suppressStartEvent = false;
    installSpeech();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('records while held and keeps the capture on release', () => {
    const { mic, button } = mount();
    pointer(button, 'pointerdown', { pointerType: 'touch', clientY: 300 });
    expect(mic.listening).toBe(true);
    expect(mic.hasAttribute('holding')).toBe(true);

    speak('你好世界', true);
    pointer(button, 'pointerup', { pointerType: 'touch', clientY: 300 });

    expect(mic.listening).toBe(false);
    expect(mic.hasAttribute('holding')).toBe(false);
  });

  it('discards the capture when the finger slides up before releasing', () => {
    const { mic, button } = mount();
    const ended: string[] = [];
    mic.addEventListener('voiceend', () => ended.push('end'));

    pointer(button, 'pointerdown', { pointerType: 'touch', clientY: 300 });
    pointer(button, 'pointermove', { pointerType: 'touch', clientY: 240 });
    expect(mic.hasAttribute('cancelling')).toBe(true);

    pointer(button, 'pointerup', { pointerType: 'touch', clientY: 240 });
    expect(ended).toEqual(['end']);
    expect(mic.hasAttribute('cancelling')).toBe(false);
  });

  it('does not treat a sideways drift as intent to cancel', () => {
    // A thumb resting on a composer wanders horizontally; discarding for that would throw
    // away captures nobody meant to throw away.
    const { mic, button } = mount();
    pointer(button, 'pointerdown', { pointerType: 'touch', clientX: 100, clientY: 300 });
    pointer(button, 'pointermove', { pointerType: 'touch', clientX: 300, clientY: 300 });
    expect(mic.hasAttribute('cancelling')).toBe(false);
  });

  it('lets the finger come back down to un-cancel', () => {
    const { mic, button } = mount();
    pointer(button, 'pointerdown', { pointerType: 'touch', clientY: 300 });
    pointer(button, 'pointermove', { pointerType: 'touch', clientY: 200 });
    expect(mic.hasAttribute('cancelling')).toBe(true);
    pointer(button, 'pointermove', { pointerType: 'touch', clientY: 295 });
    expect(mic.hasAttribute('cancelling')).toBe(false);
  });

  it('ends the hold when the system takes the pointer away', () => {
    const { mic, button } = mount();
    pointer(button, 'pointerdown', { pointerType: 'touch', clientY: 300 });
    pointer(button, 'pointercancel', { pointerType: 'touch' });
    expect(mic.listening).toBe(false);
    expect(mic.hasAttribute('holding')).toBe(false);
  });

  it('ignores a second finger arriving mid-hold', () => {
    const { mic, button } = mount();
    pointer(button, 'pointerdown', { pointerType: 'touch', pointerId: 1, clientY: 300 });
    // A second touch releasing must not end the first one's capture.
    pointer(button, 'pointerup', { pointerType: 'touch', pointerId: 2, clientY: 300 });
    expect(mic.listening).toBe(true);

    pointer(button, 'pointerup', { pointerType: 'touch', pointerId: 1, clientY: 300 });
    expect(mic.listening).toBe(false);
  });

  it('prevents the default so the touch is not replayed as a click', () => {
    const { button } = mount();
    const event = pointer(button, 'pointerdown', { pointerType: 'touch', clientY: 300 });
    expect(event.defaultPrevented).toBe(true);
  });

  it('leaves a mouse press to the click toggle', () => {
    const { mic, button } = mount();
    pointer(button, 'pointerdown', { pointerType: 'mouse', clientY: 300 });
    expect(mic.hasAttribute('holding')).toBe(false);
    expect(mic.listening).toBe(false);

    button.click();
    expect(mic.listening).toBe(true);
  });

  it('says what releasing will do, and changes its mind with the finger', () => {
    const { mic, shadow, button } = mount();
    mic.holdHint = '松开发送 · 上滑取消';
    mic.cancelHint = '松开取消';
    const hint = (): string | null | undefined => shadow.querySelector('.ran-voice-hint')?.textContent;

    pointer(button, 'pointerdown', { pointerType: 'touch', clientY: 300 });
    expect(hint()).toBe('松开发送 · 上滑取消');
    pointer(button, 'pointermove', { pointerType: 'touch', clientY: 200 });
    expect(hint()).toBe('松开取消');
  });
});
