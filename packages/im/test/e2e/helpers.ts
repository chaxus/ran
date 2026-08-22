import type { Page } from '@playwright/test';

/**
 * Reads a measurement from inside a component's shadow root.
 *
 * ranui components use **closed** shadow roots, which Playwright's locators cannot pierce —
 * `getByRole`, `getByText` and `querySelector` all stop at the boundary and find nothing.
 * The instance property `_shadowDom` does cross, and is the seam ranui's own tests use.
 *
 * @param page The page under test.
 * @param host Selector for the component in the document.
 * @param read Runs against the component's shadow root; must return a serialisable value.
 * @returns Whatever `read` returned.
 */
export async function insideShadow<T>(page: Page, host: string, read: (root: ShadowRoot) => T): Promise<T> {
  return page.evaluate(
    ({ selector, source }) => {
      const element = document.querySelector(selector) as (HTMLElement & { _shadowDom?: ShadowRoot }) | null;
      if (element?._shadowDom === undefined) throw new Error(`no shadow root on ${selector}`);
      // eslint-disable-next-line no-new-func -- the function is authored in this repo and
      // serialised across the page boundary, which is the only way to pass one in.
      return (new Function(`return (${source})`)() as (root: ShadowRoot) => unknown)(element._shadowDom);
    },
    { selector: host, source: read.toString() },
  ) as Promise<T>;
}

/**
 * Opens the app on an empty conversation, with nothing carried over from another spec.
 *
 * Conversations live in IndexedDB, which survives a reload and would otherwise let one spec
 * decide what another one opens on.
 *
 * @param page The page under test.
 */
export async function freshApp(page: Page): Promise<void> {
  await page.goto('/', { waitUntil: 'load' });
  await page.evaluate(async () => {
    indexedDB.deleteDatabase('ran-im');
    localStorage.clear();
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => customElements.get('r-conversation') !== undefined);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

/**
 * Sends one message and waits for the answer to finish.
 *
 * Waits for the transcript to grow by two rows *and* the stop button to go inert. Waiting on
 * the button alone does not work: it is already inert before anything is sent, so the wait
 * returns immediately and the assertions run against a transcript with no answer in it. The
 * row count is what says the answer actually arrived; the button is what says it finished.
 *
 * No fixed timeout anywhere — the demo answer takes as long as it takes, and a sleep is a
 * flake waiting for a slower machine.
 *
 * @param page The page under test.
 * @param text What to type.
 */
export async function send(page: Page, text: string): Promise<void> {
  const before = (await rows(page)).length;
  await page.evaluate((value) => {
    (document.querySelector('#question') as HTMLElement & { value: string }).value = value;
    (document.querySelector('#composer') as HTMLFormElement).requestSubmit();
  }, text);
  await page.waitForFunction(
    (target) => {
      const chat = document.querySelector('#chat') as (HTMLElement & { _shadowDom?: ShadowRoot }) | null;
      const drawn = chat?._shadowDom?.querySelectorAll('.ran-conversation-row').length ?? 0;
      const idle = (document.querySelector('#stop') as HTMLButtonElement | null)?.disabled === true;
      return drawn >= target && idle;
    },
    before + 2,
    { timeout: 30_000 },
  );
}

/**
 * The rows currently in the transcript, as `kind` plus the text each carries.
 *
 * An assistant answer is read from `r-markdown`'s `content` property, not from
 * `textContent`: the rendered markdown lives in that element's *own* closed shadow root, so
 * `textContent` on the row returns the action-bar labels and nothing else. A user bubble is
 * plain text and reads directly.
 *
 * @param page The page under test.
 * @returns One entry per row, in transcript order.
 */
export async function rows(page: Page): Promise<{ kind: string; text: string }[]> {
  return insideShadow(page, '#chat', (root) =>
    [...root.querySelectorAll('.ran-conversation-row')].map((row) => {
      const bubble = row.querySelector('.turn-bubble');
      const markdown = row.querySelector('r-markdown') as (HTMLElement & { content?: string }) | null;
      const text = bubble?.textContent ?? markdown?.content ?? row.textContent ?? '';
      return { kind: (row as HTMLElement).dataset.kind ?? '', text: text.trim() };
    }),
  );
}
