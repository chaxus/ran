/**
 * The client bundle — everything on this site that genuinely needs script.
 *
 * The bar for adding to this file is high: every page renders, navigates, themes and
 * reads correctly with the bundle blocked. What is here either cannot be done in CSS
 * or is a convenience that is fine to lose.
 *
 * Notably *not* here: cross-document view transitions. ranui offers
 * `enableMpaViewTransitions()`, but reading it shows it injects one CSS at-rule and
 * hands back a teardown function. For a multi-page site that rule belongs in the
 * stylesheet, where it applies before this script has even been fetched.
 */
import '../styles/site.css';
// Registers <r-theme-switch>, which the page shell already rendered. Until this loads
// the element is an unknown tag with no box, so nothing shifts when it upgrades.
import 'ranui/theme-switch';
// ranui's design tokens, which the component's shadow styles read.
import 'ranui/style';

/**
 * A copy button on every code block.
 *
 * Added from script rather than emitted by the generator on purpose: a button that
 * cannot work without `navigator.clipboard` should not exist in the markup a reader
 * with no JavaScript gets. Delegated from `document` so it costs one listener
 * regardless of how many blocks a post has.
 */
const COPY_LABEL = '复制';
const COPIED_LABEL = '已复制';

const addCopyButtons = (): void => {
  if (!navigator.clipboard) return;
  for (const figure of document.querySelectorAll<HTMLElement>('figure.code')) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = COPY_LABEL;
    // The language chip sits top-right too; the button replaces it while present.
    figure.dataset.hasCopy = 'true';
    figure.append(button);
  }
};

document.addEventListener('click', (event) => {
  const button = (event.target as Element | null)?.closest?.('.code-copy');
  if (!(button instanceof HTMLButtonElement)) return;
  const code = button.parentElement?.querySelector('pre')?.textContent ?? '';
  navigator.clipboard
    .writeText(code)
    .then(() => {
      button.textContent = COPIED_LABEL;
      button.classList.add('is-copied');
      window.setTimeout(() => {
        button.textContent = COPY_LABEL;
        button.classList.remove('is-copied');
      }, 1400);
    })
    .catch(() => {
      // A denied clipboard permission is the reader's choice, not an error to shout
      // about. Say it failed on the button itself and move on.
      button.textContent = '复制失败';
      window.setTimeout(() => (button.textContent = COPY_LABEL), 1400);
    });
});

addCopyButtons();
