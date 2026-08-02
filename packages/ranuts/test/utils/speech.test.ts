// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '@/utils';

/** Stands in for the browser's SpeechRecognition, so the events can be driven by hand. */
class FakeRecognition {
  static instances: FakeRecognition[] = [];
  static throwOnStart = false;

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

  /** Feed a result the way the platform does: every segment recognized so far. */
  emit(segments: { transcript: string; isFinal?: boolean }[]): void {
    this.onresult?.({
      results: segments.map((s) => Object.assign([{ transcript: s.transcript }], { isFinal: s.isFinal ?? true })),
    });
  }
}

const install = (): void => {
  FakeRecognition.instances = [];
  FakeRecognition.throwOnStart = false;
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

  it('discards pending results on abort', () => {
    install();
    const mic = createSpeechRecognizer();
    mic.start();
    mic.abort();
    expect(FakeRecognition.instances[0].aborted).toBe(true);
    expect(mic.active).toBe(false);
  });
});
