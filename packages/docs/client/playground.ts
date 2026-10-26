/**
 * The `r-option` value that stands for "attribute not written". `r-select` cannot select an
 * option whose value is empty, so the unset choice needs a value of its own.
 */
export const UNSET = '__unset';

/**
 * The attribute playground (`build/playground.ts`): each control writes one attribute of the
 * stage's element, and the readout shows the element's markup as it now stands.
 *
 * The controls are `r-checkbox`, `r-select` and `r-input`, which may still be loading here:
 * their state is written as attributes (a property set before upgrade would shadow the
 * element's setter) and read from their `change` / `input` event detail.
 */
export const mountPlaygrounds = (root: ParentNode = document): void => {
  for (const playground of root.querySelectorAll<HTMLElement>('[data-playground]')) {
    const element = playground.querySelector<HTMLElement>(`.playground__stage ${playground.dataset.playground}`);
    const readout = playground.querySelector<HTMLElement>('.playground__markup code');
    if (!element || !readout) continue;
    const render = (): void => {
      readout.textContent = element.outerHTML;
    };
    const write = (name: string, value: string): void => {
      if (value && value !== UNSET) element.setAttribute(name, value);
      else element.removeAttribute(name);
      render();
    };
    for (const control of playground.querySelectorAll<HTMLElement>('[data-attr]')) {
      const name = control.dataset.attr!;
      const value = element.getAttribute(name);
      if (control.localName === 'r-checkbox') {
        // A default-on switch is turned off with `="false"`, not by removing it.
        const defaultOn = control.hasAttribute('data-default-on');
        control.toggleAttribute('checked', value === null ? defaultOn : value !== 'false');
        control.addEventListener('change', (event) => {
          const { checked } = (event as CustomEvent<{ checked: boolean }>).detail;
          if (defaultOn) write(name, checked ? '' : 'false');
          else if (checked) {
            element.setAttribute(name, '');
            render();
          } else write(name, '');
        });
      } else {
        if (value) control.setAttribute('value', value);
        const kind = control.localName === 'r-select' ? 'change' : 'input';
        control.addEventListener(kind, (event) => {
          // r-input re-dispatches the inner input's native `input` too; only its own event has a detail.
          const detail = (event as CustomEvent<{ value: string } | null>).detail;
          if (!detail) return;
          // Back to the placeholder, which names the default, like an empty text field.
          if (detail.value === UNSET) control.removeAttribute('value');
          write(name, detail.value);
        });
      }
    }
    render();
  }
};
