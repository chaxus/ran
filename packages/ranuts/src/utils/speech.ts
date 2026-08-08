/**
 * Speech recognition (dictation) over the Web Speech API.
 *
 * This is the counterpart to `AudioRecorder`, which captures audio *bytes*; this one asks the
 * platform to turn speech into *text*. The browser API is still prefixed on WebKit, is absent
 * from `lib.dom`, and reports several routine non-events (a silent pause, a programmatic stop)
 * through the same error channel as a denied microphone — so it is worth wrapping once.
 */

/** The slice of the Web Speech API this module uses; it is not in `lib.dom`. */
interface NativeRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: NativeResultEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface NativeResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal?: boolean }>;
  /** Lowest index whose result changed in this event — everything before it is guaranteed
   * unchanged since the previous `onresult` call. Absent only on nonstandard implementations. */
  resultIndex?: number;
}

type RecognitionConstructor = new () => NativeRecognition;

/**
 * `denied` means the user or the browser refused the microphone — worth surfacing.
 * `noSpeech` and `aborted` are routine (a silent pause, a programmatic `stop()`) and are
 * usually not worth showing anyone; they are reported rather than swallowed so the caller
 * decides. Everything else is `failed`.
 */
export type SpeechErrorKind = 'denied' | 'noSpeech' | 'aborted' | 'failed';

export interface SpeechError {
  kind: SpeechErrorKind;
  /** The raw `error` string from the platform event. */
  detail: string;
}

export interface SpeechRecognizerOptions {
  /**
   * BCP 47 tag for the language being spoken, e.g. `'en-US'`, `'zh-CN'`. Pass a function to
   * have it read at the start of each capture, which is what an app whose UI language can
   * change mid-session wants.
   */
  lang?: string | (() => string);
  /** Keep listening across pauses instead of stopping at the first one. Default `true`. */
  continuous?: boolean;
  /** Emit partial results as the speaker talks. Default `true`. */
  interimResults?: boolean;
  /**
   * Called as text arrives, with the transcript of the **whole capture so far** — not just
   * the newest fragment — because interim results are revised as recognition firms up.
   */
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: SpeechError) => void;
  onStart?: () => void;
  /** Fires once per capture, however it ended: stopped, timed out, or errored. */
  onEnd?: () => void;
}

export interface SpeechRecognizer {
  /** `false` when the platform has no speech recognition; every method is then a no-op. */
  readonly supported: boolean;
  /** Whether a capture is currently running. */
  readonly active: boolean;
  /** Begin a capture. Ignored if one is already running. */
  start(): void;
  /** End the current capture; results already recognized are kept. `onEnd` follows. */
  stop(): void;
  /** End the current capture and discard pending results. */
  abort(): void;
  /** Start if idle, stop if running — the behaviour a single microphone button wants. */
  toggle(): void;
}

const getConstructor = (): RecognitionConstructor | undefined => {
  if (typeof window === 'undefined') return undefined;
  const scope = window as unknown as {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition;
};

const classify = (error: string): SpeechErrorKind => {
  if (error === 'not-allowed' || error === 'service-not-allowed') return 'denied';
  if (error === 'no-speech') return 'noSpeech';
  if (error === 'aborted') return 'aborted';
  return 'failed';
};

/**
 * @description: Whether this runtime can recognize speech. Checked at call time, so it is safe
 * to import this module during server-side rendering.
 * @return {boolean}
 */
export const isSpeechRecognitionSupported = (): boolean => getConstructor() !== undefined;

/**
 * @description: Create a dictation session over the Web Speech API.
 *
 * A recognizer is reusable: `start` builds a fresh native instance each time, so options read
 * through a function (notably `lang`) are re-read per capture.
 *
 * On a platform without speech recognition this returns an inert recognizer with
 * `supported === false` rather than throwing — check that field to hide your microphone button.
 *
 * @param {SpeechRecognizerOptions} options
 * @return {SpeechRecognizer}
 * @example
 * ```ts
 * const mic = createSpeechRecognizer({
 *   lang: () => currentLocale(),
 *   onResult: (text) => { input.value = text; },
 *   onError: (e) => { if (e.kind === 'denied') toast('Microphone access was refused'); },
 *   onEnd: () => button.classList.remove('recording'),
 *   onStart: () => button.classList.add('recording'),
 * });
 * if (!mic.supported) button.style.display = 'none';
 * button.addEventListener('click', () => mic.toggle());
 * ```
 */
export const createSpeechRecognizer = (options: SpeechRecognizerOptions = {}): SpeechRecognizer => {
  const { lang, continuous = true, interimResults = true, onResult, onError, onStart, onEnd } = options;
  let current: NativeRecognition | null = null;

  const finish = (): void => {
    current = null;
    onEnd?.();
  };

  const recognizer: SpeechRecognizer = {
    // Re-checked on every access rather than captured once at creation time: capturing it here
    // would freeze `undefined` for the lifetime of this recognizer if `createSpeechRecognizer`
    // is called before `window`/the vendor-prefixed API is available (SSR, an early
    // module-scope call before hydration), even after the real constructor shows up later.
    get supported(): boolean {
      return getConstructor() !== undefined;
    },
    get active(): boolean {
      return current !== null;
    },

    start(): void {
      // Resolved fresh on every call, for the same reason `supported` is a getter above.
      const Constructor = getConstructor();
      if (!Constructor || current) return;

      try {
        // Instantiation itself can throw — e.g. a Permissions-Policy restriction or an iframe
        // without microphone permission delegation — so it has to be inside this try/catch
        // alongside `native.start()` rather than ahead of it, or that throw would propagate
        // straight out of the library past the documented onError/onEnd channel.
        const native = new Constructor();
        native.lang = typeof lang === 'function' ? lang() : (lang ?? '');
        native.continuous = continuous;
        native.interimResults = interimResults;
        native.maxAlternatives = 1;

        // Per-capture cache: results before `resultIndex` are guaranteed unchanged since the
        // previous event, so they're folded in here at most once instead of being
        // re-concatenated on every single interim update — turning the naive O(n) rebuild per
        // event (O(n^2) over a long `continuous: true` session) into amortized O(1) per event
        // for the stable prefix, with only the small live tail re-scanned each time.
        // Depends on the platform actually populating `resultIndex`: on an implementation that
        // doesn't (`?? 0` below), `finalizedUpTo` never advances and this degrades to the naive
        // full-rescan — still correct, just not the optimization. Every implementation this has
        // been tested against provides it.
        let finalizedTranscript = '';
        let finalizedUpTo = 0;

        native.onresult = (event): void => {
          const results = event.results;
          const stableEnd = Math.min(event.resultIndex ?? 0, results.length);
          if (stableEnd < finalizedUpTo) {
            // Known-quirky implementations (WebKit/Safari) can report a `resultIndex` that
            // regresses below what was already cached. Trusting the stale `finalizedUpTo` here
            // would start the tail loop past the true divergence point and silently drop any
            // newly-changed low-index results. `results` carries the full session history on
            // every event, so it is always safe to fold back in from the start.
            finalizedUpTo = 0;
            finalizedTranscript = '';
          }
          for (; finalizedUpTo < stableEnd; finalizedUpTo++) {
            finalizedTranscript += results[finalizedUpTo]?.[0]?.transcript ?? '';
          }

          let tail = '';
          let isFinal = true;
          for (let i = finalizedUpTo; i < results.length; i++) {
            const result = results[i];
            tail += result?.[0]?.transcript ?? '';
            if (result?.isFinal === false) isFinal = false;
          }
          onResult?.(finalizedTranscript + tail, isFinal);
        };
        native.onerror = (event): void => onError?.({ kind: classify(event.error), detail: event.error });
        native.onstart = (): void => onStart?.();
        native.onend = finish;

        current = native;
        native.start();
      } catch (error) {
        // Either construction or `start()` can throw (Chrome throws InvalidStateError if a
        // capture is somehow already in flight). Report it and reset, rather than leaving the
        // recognizer wedged in a permanently "active" state or letting the throw escape past
        // the documented error channel.
        current = null;
        onError?.({ kind: 'failed', detail: error instanceof Error ? error.message : String(error) });
        onEnd?.();
      }
    },

    stop(): void {
      current?.stop();
    },

    abort(): void {
      current?.abort();
    },

    toggle(): void {
      if (current) recognizer.stop();
      else recognizer.start();
    },
  };

  return recognizer;
};
