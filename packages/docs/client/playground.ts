/**
 * The attribute playground (`build/playground.ts`): each control writes one attribute of the
 * stage's element, and the readout shows the element's markup as it now stands.
 */
export const mountPlaygrounds = (root: ParentNode = document): void => {
  for (const playground of root.querySelectorAll<HTMLElement>('[data-playground]')) {
    const element = playground.querySelector<HTMLElement>(`.playground__stage ${playground.dataset.playground}`);
    const readout = playground.querySelector<HTMLElement>('.playground__markup code');
    if (!element || !readout) continue;
    const render = (): void => {
      readout.textContent = element.outerHTML;
    };
    for (const control of playground.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-attr]')) {
      const name = control.dataset.attr!;
      if (control instanceof HTMLInputElement && control.type === 'checkbox') {
        // A default-on switch is turned off with `="false"`, not by removing it.
        const defaultOn = control.hasAttribute('data-default-on');
        const value = element.getAttribute(name);
        control.checked = value === null ? defaultOn : value !== 'false';
        control.addEventListener('change', () => {
          if (defaultOn) {
            if (control.checked) element.removeAttribute(name);
            else element.setAttribute(name, 'false');
          } else element.toggleAttribute(name, control.checked);
          render();
        });
      } else {
        control.value = element.getAttribute(name) ?? '';
        control.addEventListener(control instanceof HTMLSelectElement ? 'change' : 'input', () => {
          if (control.value) element.setAttribute(name, control.value);
          else element.removeAttribute(name);
          render();
        });
      }
    }
    render();
  }
};
