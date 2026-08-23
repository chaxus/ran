/**
 * `ranui/testing` — reaching into a component from a test.
 *
 * Every ranui component renders into a **closed** shadow root. That is a deliberate choice
 * with a documented cost: page CSS cannot leak in, and nothing outside can look in either.
 * Playwright's locators are part of that "nothing" — `getByRole`, `getByText` and
 * `querySelector` all stop at the boundary and quietly find *nothing at all*, so a spec
 * written against them passes while asserting on elements it never saw. Two suites in this
 * repository were written that way before anyone noticed.
 *
 * The instance property `_shadowDom` does cross, because it is a JS property rather than a
 * DOM lookup. These helpers are that seam, given a name and a reason, so a consumer testing
 * against ranui does not have to rediscover it.
 *
 * Typed against the shape of a Playwright page rather than against Playwright itself: a
 * component library that made every consumer install a test runner to import a type would
 * be charging them for our own convenience.
 *
 * @module ranui/testing
 */

/** The part of a Playwright `Page` these helpers use. */
export interface PageLike {
  /**
   * Runs a function in the page.
   *
   * @param fn - the function to run, serialised across the process boundary.
   * @param arg - its single argument, structured-cloned across.
   * @returns whatever `fn` returned.
   */
  evaluate<Result, Argument>(fn: (arg: Argument) => Result, arg: Argument): Promise<Result>;
  /**
   * Polls a function in the page until it returns truthy.
   *
   * @param fn - the predicate to poll.
   * @param arg - its single argument.
   * @returns once the predicate has passed.
   */
  waitForFunction<Argument>(fn: (arg: Argument) => unknown, arg: Argument): Promise<unknown>;
}

/**
 * Reads a measurement from inside one component's shadow root.
 *
 * @param page - the page under test.
 * @param host - selector for the component, in the document.
 * @param read - runs against the component's shadow root; must return something
 *   structured-cloneable, since it crosses a process boundary on the way back.
 * @returns whatever `read` returned.
 * @throws when the selector matches nothing, or matches something that is not a ranui
 *   component — a silent `undefined` there would read as "the thing under test is missing"
 *   and send the reader looking in the wrong place.
 */
export async function insideShadow<T>(page: PageLike, host: string, read: (root: ShadowRoot) => T): Promise<T> {
  return page.evaluate(
    ({ selector, source }) => {
      const element = document.querySelector(selector) as (HTMLElement & { _shadowDom?: ShadowRoot }) | null;
      if (element === null) throw new Error(`ranui/testing: nothing matches ${selector}`);
      if (element._shadowDom === undefined) throw new Error(`ranui/testing: ${selector} has no shadow root`);
      // eslint-disable-next-line no-new-func -- a function cannot be structured-cloned, so
      // it crosses as source text; this is the only way to pass one in.
      return (new Function(`return (${source})`)() as (root: ShadowRoot) => unknown)(element._shadowDom);
    },
    { selector: host, source: read.toString() },
  ) as Promise<T>;
}

/**
 * Waits until every matching component reports itself painted.
 *
 * `settled` runs inside each element's shadow root and answers for that one element.
 *
 * Use this instead of a fixed wait. A `waitForTimeout` passes whether the work finished or
 * not, so a screenshot taken after one captures a half-built component on a slow run — and
 * if that run happened to be the recording, the half-built frame becomes the baseline every
 * later run is measured against. Two baselines in this repository were recorded that way:
 * blank swatches on a colour picker that declares a colour.
 *
 * @param page - the page under test.
 * @param selector - the components to wait for; matching none never settles.
 * @param settled - runs against one element's shadow root; true when that element is done.
 * @returns once every match has settled.
 */
export async function settlePainted(
  page: PageLike,
  selector: string,
  settled: (root: ShadowRoot) => boolean,
): Promise<void> {
  await page.waitForFunction(
    ({ sel, source }) => {
      const nodes = [...document.querySelectorAll(sel)] as Array<HTMLElement & { _shadowDom?: ShadowRoot }>;
      if (nodes.length === 0) return false;
      // eslint-disable-next-line no-new-func -- see the note in `insideShadow`.
      const done = new Function(`return (${source})`)() as (root: ShadowRoot) => boolean;
      return nodes.every((node) => node._shadowDom !== undefined && done(node._shadowDom));
    },
    { sel: selector, source: settled.toString() },
  );
}
