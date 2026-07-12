import { describe, expect, it, beforeEach } from 'vitest';
import '@/components/colorpicker';

// The colorpicker panel (and its 4 reactive effects) is built once, on first open;
// effects are disposed on every disconnect. This guards that a moved/re-parented
// picker re-arms those effects on reconnect instead of going silently inert.
describe('r-colorpicker reconnect reactivity', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('panel stays reactive after disconnect → reconnect', () => {
    const cp = document.createElement('r-colorpicker') as unknown as {
      openColorPicker(): void;
      context: { hue: { setter(n: number): void } };
      colorPickerSaturation: HTMLElement;
      remove(): void;
    };
    document.body.appendChild(cp as unknown as Node);
    cp.openColorPicker(); // build panel + setupEffects

    cp.context.hue.setter(120); // green
    const green = cp.colorPickerSaturation.style.backgroundColor;
    expect(green).toBe('rgb(0, 255, 0)');

    (cp as unknown as HTMLElement).remove(); // disconnect → disposeEffects
    document.body.appendChild(cp as unknown as Node); // reconnect → re-arm
    cp.openColorPicker(); // early-returns (panel already exists)

    cp.context.hue.setter(240); // blue — must still drive the effect
    expect(cp.colorPickerSaturation.style.backgroundColor).toBe('rgb(0, 0, 255)');
  });
});
