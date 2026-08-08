// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '@/utils';

/** Stands in for the browser's SpeechRecognition, so the events can be driven by hand. */
class FakeRecognition {
  static instances: FakeRecognition[] = [];
  static throwOnStart = false;
  static throwOnConstruct = false;

  lang = '';
  continuous = false;
  interimResults = false;
  maxAlternatives = 0;
  started = false;
  aborted = false;
  onresult: ((e: unknown) => void) | null = null;
  onerror: ((e: { error: string }) => void) | null = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;

  constructor() {
    if (FakeRecognition.throwOnConstruct) throw new Error('Permissions-Policy blocked microphone');
    FakeRecognition.instances.push(this);
  }

  start(): void {
    if (FakeRecognition.throwOnStart) throw new Error('InvalidStateError');
    this.started = true;
    this.onstart?.();
  }

  stop(): void {
    this.started = false;
    this.onend?.();
  }

  abort(): void {
    this.aborted = true;
    this.started = false;
    this.onend?.();
  }

  /**
   * Feed a result the way the platform does: every segment recognized so far, plus (when given)
   * `resultIndex` — the lowest index that changed in this event, per the real API's contract.
   */
  emit(segments: { transcript: string; isFinal?: boolean }[], resultIndex?: number): void {
    this.onresult?.({
      results: segments.map((s) => Object.assign([{ transcript: s.transcript }], { isFinal: s.isFinal ?? true })),
      resultIndex,
    });
  }
}

const install = (): void => {
  FakeRecognition.instances = [];
  FakeRecognition.throwOnStart = false;
  FakeRecognition.throwOnConstruct = false;
  (window as unknown as Record<string, unknown>).SpeechRecognition = FakeRecognition;
};

const uninstall = (): void => {
  delete (window as unknown as Record<string, unknown>).SpeechRecognition;
  delete (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
};

afterEach(uninstall);

describe('isSpeechRecognitionSupported', () => {
  it('detects the unprefixed and the WebKit-prefixed constructor alike', () => {
    expect(isSpeechRecognitionSupported()).toBe(false);
    install();
    expect(isSpeechRecognitionSupported()).toBe(true);
    uninstall();
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition = FakeRecognition;
    expect(isSpeechRecognitionSupported()).toBe(true);
  });
});

describe('createSpeechRecognizer', () => {
  it('reports itself unsupported and stays inert where the API is missing', () => {
    const onStart = vi.fn();
    const mic = createSpeechRecognizer({ onStart });
    expect(mic.supported).toBe(false);
    mic.start();
    mic.toggle();
    expect(mic.active).toBe(false);
    expect(onStart).not.toHaveBeenCalled();
  });

  it('applies the options to the native instance', () => {
    install();
    createSpeechRecognizer({ lang: 'zh-CN', continuous: false, interimResults: false }).start();
    const native = FakeRecognition.instances[0];
    expect(native.lang).toBe('zh-CN');
    expect(native.continuous).toBe(false);
    expect(native.interimResults).toBe(false);
    expect(native.started).toBe(true);
  });

  it('re-reads a function lang at the start of every capture', () => {
    install();
    let locale = 'en-US';
    const mic = createSpeechRecognizer({ lang: () => locale });
    mic.start();
    mic.stop();
    locale = 'ja-JP';
    mic.start();
    expect(FakeRecognition.instances.map((i) => i.lang)).toEqual(['en-US', 'ja-JP']);
  });

  it('reports the whole capture so far, not just the newest fragment', () => {
    install();
    const onResult = vi.fn();
    createSpeechRecognizer({ onResult }).start();
    const native = FakeRecognition.instances[0];

    native.emit([{ transcript: 'hello' }]);
    expect(onResult).toHaveBeenLastCalledWith('hello', true);

    native.emit([{ transcript: 'hello' }, { transcript: ' world', isFinal: false }]);
    expect(onResult).toHaveBeenLastCalledWith('hello world', false);
  });

  it('builds the correct transcript across many events using resultIndex, not just a full rescan', () => {
    // Mirrors how the real API reports a long continuous session: each event only "changes"
    // the result at resultIndex onward — everything before it is done and won't be touched
    // again. The cached-prefix path (resultIndex present) must produce the same transcript as
    // a full rescan would.
    install();
    const onResult = vi.fn();
    createSpeechRecognizer({ onResult }).start();
    const native = FakeRecognition.instances[0];

    // Segment 0 finalizes.
    native.emit([{ transcript: 'one' }], 0);
    expect(onResult).toHaveBeenLastCalledWith('one', true);

    // Segment 1 starts as interim; resultIndex says segment 0 is done and won't change again.
    native.emit([{ transcript: 'one' }, { transcript: ' two', isFinal: false }], 1);
    expect(onResult).toHaveBeenLastCalledWith('one two', false);

    // Segment 1 finalizes; segment 2 starts interim. resultIndex now covers 0 and 1.
    native.emit([{ transcript: 'one' }, { transcript: ' two' }, { transcript: ' three', isFinal: false }], 2);
    expect(onResult).toHaveBeenLastCalledWith('one two three', false);

    // Segment 2 finalizes with revised text (interim results can change up to the moment they
    // finalize) — the cached prefix must not have locked in the old interim wording early.
    native.emit([{ transcript: 'one' }, { transcript: ' two' }, { transcript: ' three!' }], 3);
    expect(onResult).toHaveBeenLastCalledWith('one two three!', true);
  });

  it('classifies the routine non-events apart from a real refusal', () => {
    install();
    const onError = vi.fn();
    createSpeechRecognizer({ onError }).start();
    const native = FakeRecognition.instances[0];

    native.onerror?.({ error: 'not-allowed' });
    expect(onError).toHaveBeenLastCalledWith({ kind: 'denied', detail: 'not-allowed' });

    native.onerror?.({ error: 'service-not-allowed' });
    expect(onError).toHaveBeenLastCalledWith({ kind: 'denied', detail: 'service-not-allowed' });

    native.onerror?.({ error: 'no-speech' });
    expect(onError).toHaveBeenLastCalledWith({ kind: 'noSpeech', detail: 'no-speech' });

    native.onerror?.({ error: 'aborted' });
    expect(onError).toHaveBeenLastCalledWith({ kind: 'aborted', detail: 'aborted' });

    native.onerror?.({ error: 'network' });
    expect(onError).toHaveBeenLastCalledWith({ kind: 'failed', detail: 'network' });
  });

  it('tracks active across start and end, and ignores a redundant start', () => {
    install();
    const onEnd = vi.fn();
    const mic = createSpeechRecognizer({ onEnd });
    expect(mic.active).toBe(false);

    mic.start();
    expect(mic.active).toBe(true);
    mic.start();
    expect(FakeRecognition.instances).toHaveLength(1);

    mic.stop();
    expect(mic.active).toBe(false);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('toggles between starting and stopping', () => {
    install();
    const mic = createSpeechRecognizer();
    mic.toggle();
    expect(mic.active).toBe(true);
    mic.toggle();
    expect(mic.active).toBe(false);
    mic.toggle();
    expect(FakeRecognition.instances).toHaveLength(2);
  });

  it('does not wedge itself active when the platform throws on start', () => {
    install();
    FakeRecognition.throwOnStart = true;
    const onError = vi.fn();
    const onEnd = vi.fn();
    const mic = createSpeechRecognizer({ onError, onEnd });

    mic.start();
    expect(mic.active).toBe(false);
    expect(onError).toHaveBeenCalledWith({ kind: 'failed', detail: 'InvalidStateError' });
    expect(onEnd).toHaveBeenCalledTimes(1);

    // Still usable afterwards.
    FakeRecognition.throwOnStart = false;
    mic.start();
    expect(mic.active).toBe(true);
  });

  it('reports a construction failure through onError instead of throwing out of start()', () => {
    // A Permissions-Policy restriction or an iframe without microphone permission delegation
    // can make the constructor itself throw, not just `.start()`. That throw must be caught
    // and reported the same documented way as a runtime recognition error, not propagate
    // synchronously out of `start()`.
    install();
    FakeRecognition.throwOnConstruct = true;
    const onError = vi.fn();
    const onEnd = vi.fn();
    const mic = createSpeechRecognizer({ onError, onEnd });

    expect(() => mic.start()).not.toThrow();
    expect(mic.active).toBe(false);
    expect(onError).toHaveBeenCalledWith({ kind: 'failed', detail: 'Permissions-Policy blocked microphone' });
    expect(onEnd).toHaveBeenCalledTimes(1);

    // Still usable afterwards.
    FakeRecognition.throwOnConstruct = false;
    mic.start();
    expect(mic.active).toBe(true);
  });

  it('re-resolves the constructor lazily, so a recognizer created before the API exists still works', () => {
    // Simulates SSR / an early module-scope call: createSpeechRecognizer() runs before the
    // vendor API is available, so a naive "resolve once at creation" implementation would
    // freeze `supported`/`start()` as permanently inert even after the API shows up.
    uninstall();
    const onStart = vi.fn();
    const mic = createSpeechRecognizer({ onStart });
    expect(mic.supported).toBe(false);
    mic.start();
    expect(mic.active).toBe(false);

    install();
    expect(mic.supported).toBe(true);
    mic.start();
    expect(mic.active).toBe(true);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('reprocesses from the regressed point when resultIndex goes backwards', () => {
    // Known-quirky Web Speech implementations (WebKit/Safari) can report a resultIndex that
    // regresses below an already-cached prefix. The cache must not skip forward from the stale
    // value, or a newly-changed low-index result is silently dropped from the transcript.
    install();
    const onResult = vi.fn();
    createSpeechRecognizer({ onResult }).start();
    const native = FakeRecognition.instances[0];

    native.emit([{ transcript: 'one' }, { transcript: ' two' }, { transcript: ' three', isFinal: false }], 2);
    expect(onResult).toHaveBeenLastCalledWith('one two three', false);

    // resultIndex regresses from 2 to 1, and segment 1's text is revised — a stale cache would
    // keep serving the old "two" instead of picking up "TWO!".
    native.emit([{ transcript: 'one' }, { transcript: ' TWO!' }, { transcript: ' three', isFinal: false }], 1);
    expect(onResult).toHaveBeenLastCalledWith('one TWO! three', false);
  });

  it('discards pending results on abort', () => {
    install();
    const mic = createSpeechRecognizer();
    mic.start();
    mic.abort();
    expect(FakeRecognition.instances[0].aborted).toBe(true);
    expect(mic.active).toBe(false);
  });
});
