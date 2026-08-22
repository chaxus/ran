---
description: 'A microphone button for a text composer — it reports what was heard and lets the app decide where the text goes, and never sends on the speaker’s behalf.'
---

# Voice Button

Dictation for a text composer, over the Web Speech API.

> **Use when** you want speech as _another_ way to fill a text field — not as a replacement
> for it. Typing must stay available: a voice-only path excludes anyone with a speech
> difference, anyone in a noisy room, and anyone whose browser has no recognition at all.

A microphone button, and nothing else. It owns the capture and reports what was heard; where
that text goes is the caller's decision, because a component that also wrote into an input
would have to know which input, whether to append or replace, and what to do about the
caret — three answers that differ per app.

## Quick Start

```html
<r-voice-button label="Start voice input" active-label="Stop voice input"></r-voice-button>
```

```ts
const mic = document.querySelector('r-voice-button');
const input = document.querySelector('textarea');
let base = '';

mic.addEventListener('voicestart', () => {
  // A space between what was typed and what is said, unless one is already there.
  base = input.value === '' || /\s$/.test(input.value) ? input.value : `${input.value} `;
});

mic.addEventListener('voiceresult', (event) => {
  input.value = base + event.detail.transcript;
});
```

## The decisions behind it

### It reports the whole capture, not the newest fragment

Interim results are **revised** as recognition firms up: "你好" becomes "你好世界", it does
not gain a second event carrying "世界". A consumer that appended each event would end up
with `你好你好世界`. Remember the text that was already in the field and concatenate once.

### It does not send

Recognition is wrong often enough that committing on the speaker's behalf takes away the
review they need. This fills the box and stops there. Sending stays a deliberate act.

### It hides itself where recognition does not exist

Firefox ships no speech recognition, and neither does any browser with the API absent. The
element sets `hidden` rather than `disabled`: **disabled says "not now", absent says "not
here"**, and a button that cannot work is worse than no button — it invites a tap and then
explains itself.

### Only two of four errors are worth showing

| Kind       | What it is                 | Show it?                   |
| ---------- | -------------------------- | -------------------------- |
| `denied`   | the microphone was refused | **yes** — it is actionable |
| `failed`   | anything else went wrong   | **yes**                    |
| `noSpeech` | a silent pause             | no                         |
| `aborted`  | a programmatic stop        | no                         |

The last two arrive through the same channel as a real failure and are not one. Surfacing
them nags after every capture.

### Accessibility

The accessible **name changes with the state**, not only the icon, and `aria-pressed`
carries the toggle — a screen reader announces "Stop voice input, pressed", not an icon.
**Escape discards** a capture rather than committing it, which is what a speaker who
realises mid-sentence that they said the wrong thing wants.

The listening state is carried by border, fill _and_ a ring, so it does not rely on colour
alone. The ring is the only motion and it is decoration; `prefers-reduced-motion` drops it
without losing information.

### Language follows the page

`lang` is read **per capture** and defaults to the document's, so an app that switches
locale mid-session dictates in the language it is showing.

## API Reference

### Properties

| Property      | Type      | Default               | Description                                                    |
| ------------- | --------- | --------------------- | -------------------------------------------------------------- |
| `lang`        | `string`  | the document's        | BCP 47 tag for the language being spoken. Read per capture.    |
| `continuous`  | `boolean` | `true`                | Keep listening across pauses instead of stopping at the first. |
| `disabled`    | `boolean` | `false`               |                                                                |
| `label`       | `string`  | `'Start voice input'` | Accessible name while idle.                                    |
| `activeLabel` | `string`  | `'Stop voice input'`  | Accessible name while listening.                               |
| `listening`   | `boolean` | `false`               | Read-only, reflected — style with `:host([listening])`.        |
| `supported`   | `boolean` | —                     | Read-only. Whether this platform can recognize speech.         |
| `sheet`       | `string`  | `''`                  | CSS injected into the element's shadow DOM.                    |

### Methods

`start()` · `stop()` (keeps what was recognized) · `abort()` (discards it) · `toggle()`.

`toggle()` reads the recognizer's own state rather than the reflected attribute: a capture
that has begun without reporting it would otherwise leave the two disagreeing, and the next
activation would try to open a second capture, be refused, and do nothing.

### Events

| Event         | Detail                    | Fired when                     |
| ------------- | ------------------------- | ------------------------------ |
| `voicestart`  | —                         | a capture begins               |
| `voiceresult` | `{ transcript, isFinal }` | text arrives or is revised     |
| `voiceerror`  | `{ kind, detail }`        | the platform reports a problem |
| `voiceend`    | —                         | the capture ends, however      |

### Parts

`button`, `icon`.

## See also

- [`createSpeechRecognizer`](../../ranuts/utils/) — the recognizer this wraps
- [Conversation](../conversation/) — the transcript a dictated message lands in
