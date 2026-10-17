import { test, expect } from '@playwright/test';
import { DEV_SERVER } from '../../build/config';
import { isolatedSetup, insideShadow, mount } from './helpers';

test('tabs preserve active key and real keyboard focus through keyed slot changes', async ({ page, baseURL }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await isolatedSetup(page, baseURL ?? DEV_SERVER, 'r-tabs');
  await mount(
    page,
    `<r-tabs id="tabs"><r-tab r-key="a" label="A">A</r-tab>
    <r-tab r-key="b" label="B">B</r-tab><r-tab r-key="c" label="C">C</r-tab></r-tabs><button id="outside">Outside</button>`,
  );
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#tabs')).toHaveAttribute('active', 'b');
  const state = async () =>
    insideShadow(page, '#tabs', (root) => ({
      keys: [...root.querySelectorAll('.tab-header-nav-item')].map((header) => header.getAttribute('r-key')),
      focused: root.activeElement?.getAttribute('r-key'),
    }));
  await page.locator('#tabs').evaluate((tabs) => {
    const pane = document.createElement('r-tab');
    pane.setAttribute('r-key', 'd');
    pane.setAttribute('label', 'D');
    tabs.append(pane);
  });
  await expect.poll(state).toEqual({ keys: ['a', 'b', 'c', 'd'], focused: 'b' });
  await page.locator('#tabs').evaluate((tabs) => tabs.prepend(tabs.children[1]));
  await expect.poll(state).toEqual({ keys: ['b', 'a', 'c', 'd'], focused: 'b' });
  await expect(page.locator('#tabs')).toHaveAttribute('active', 'b');
  await page.locator('#tabs').evaluate((tabs) => tabs.children[0].remove());
  await expect.poll(state).toEqual({ keys: ['a', 'c', 'd'], focused: 'a' });
  await expect(page.locator('#tabs')).toHaveAttribute('active', 'a');
  await page.locator('#tabs').evaluate((tabs) => tabs.children[0].setAttribute('disabled', ''));
  await expect.poll(state).toEqual({ keys: ['a', 'c', 'd'], focused: 'c' });
  await expect(page.locator('#tabs')).toHaveAttribute('active', 'c');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#tabs')).toHaveAttribute('active', 'd');
  await page.locator('#outside').focus();
  await page.locator('#tabs').evaluate((tabs) => tabs.append(tabs.children[1]));
  await expect(page.locator('#outside')).toBeFocused();
  expect(errors).toEqual([]);
});

for (const type of ['flat', 'line']) {
  for (const method of ['attribute', 'property']) {
    test(`programmatic active ${method} synchronizes ${type} tab presentation`, async ({ page }) => {
      await isolatedSetup(page, DEV_SERVER, 'r-tabs');
      await mount(
        page,
        `<r-tabs id="tabs" type="${type}" active="a" style="width:500px; --ran-tab-active-color:rgb(12,34,56); --ran-tab-line-color:rgb(12,34,56)">
          <r-tab r-key="a" label="A">A panel</r-tab><r-tab r-key="b" label="B">B panel</r-tab>
        </r-tabs><button id="outside">Outside</button>`,
      );
      const tabs = page.locator('#tabs');
      await page.locator('#outside').focus();
      await tabs.evaluate((node, method) => {
        if (method === 'attribute') node.setAttribute('active', 'b');
        else (node as HTMLElement & { active: string }).active = 'b';
      }, method);
      await expect(tabs).toHaveAttribute('active', 'b');
      const presentation = () =>
        insideShadow(page, '#tabs', (root) => {
          const headers = [...root.querySelector('[part="nav"]')!.children] as Array<
            HTMLElement & { _btn: HTMLElement }
          >;
          const selected = headers[1].getBoundingClientRect();
          const indicator = root.querySelector('[part="indicator"]')!.getBoundingClientRect();
          return {
            colored: headers
              .filter((header) => getComputedStyle(header).color === 'rgb(12, 34, 56)')
              .map((header) => header.textContent),
            aria: headers.map((header) => header._btn.getAttribute('aria-selected')),
            indicatorAligned:
              Math.abs(selected.left - indicator.left) < 1 && Math.abs(selected.width - indicator.width) < 1,
          };
        });
      await expect.poll(presentation).toEqual({ colored: ['B'], aria: ['false', 'true'], indicatorAligned: true });
      if (type === 'line') {
        expect(
          await insideShadow(page, '#tabs', (root) =>
            [...root.querySelector('[part="nav"]')!.children].map((header) => getComputedStyle(header).borderTopWidth),
          ),
        ).toEqual(['0px', '1px']);
      }
      await expect(tabs.locator('r-tab[r-key="a"]')).toHaveAttribute('aria-hidden', 'true');
      await expect(tabs.locator('r-tab[r-key="b"]')).not.toHaveAttribute('aria-hidden');
      await expect(page.locator('#outside')).toBeFocused();
    });
  }
}

for (const tabindex of [undefined, '0']) {
  test(`last focused tab removal hands focus to its host (${tabindex ?? 'default tabindex'})`, async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-tabs');
    await mount(
      page,
      `<r-tabs id="tabs" ${tabindex === undefined ? '' : `tabindex="${tabindex}"`}>
        <r-tab r-key="only" label="Only">Only panel</r-tab>
      </r-tabs><input id="outside" aria-label="Outside" />`,
    );
    await insideShadow(page, '#tabs', (root) => {
      const header = root.querySelector('[part="nav"]')!.firstElementChild as HTMLElement & { _btn: HTMLElement };
      header._btn.focus();
    });
    const tabs = page.locator('#tabs');
    await tabs.evaluate((node) => node.querySelector('r-tab')!.remove());
    await expect(tabs).toBeFocused();
    expect(await insideShadow(page, '#tabs', (root) => root.activeElement)).toBeNull();
    await expect(tabs).toHaveAttribute('tabindex', tabindex ?? '-1');
    await expect(tabs).not.toHaveAttribute('active');
    await page.keyboard.press('Tab');
    await expect(page.locator('#outside')).toBeFocused();
  });
}

for (const handoff of ['already outside', 'change handler']) {
  test(`empty tabs respect external focus ownership (${handoff})`, async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-tabs');
    await mount(
      page,
      '<r-tabs id="tabs"><r-tab r-key="only" label="Only">Only</r-tab></r-tabs><button id="outside">Outside</button>',
    );
    if (handoff === 'already outside') await page.locator('#outside').focus();
    else {
      await insideShadow(page, '#tabs', (root) => {
        (root.querySelector('[part="nav"]')!.firstElementChild as HTMLElement & { _btn: HTMLElement })._btn.focus();
      });
      await page.locator('#tabs').evaluate((node) => {
        node.addEventListener('change', () => {
          if (!node.hasAttribute('active')) document.querySelector<HTMLButtonElement>('#outside')!.focus();
        });
      });
    }
    await page.locator('#tabs').evaluate((node) => node.querySelector('r-tab')!.remove());
    await expect(page.locator('#tabs')).not.toHaveAttribute('active');
    await expect(page.locator('#outside')).toBeFocused();
    await expect(page.locator('#tabs')).not.toHaveAttribute('tabindex');
  });
}

for (const outside of [false, true]) {
  test(`nested empty tabs ${outside ? 'preserve document focus handoff' : 'focus their host'}`, async ({ page }) => {
    await isolatedSetup(page, DEV_SERVER, 'r-tabs');
    await mount(page, '<div id="container"></div><button id="outside">Outside</button>');
    await page.locator('#container').evaluate((container, outside) => {
      const root = container.attachShadow({ mode: 'open' });
      root.innerHTML = '<r-tabs id="tabs"><r-tab r-key="only" label="Only">Only</r-tab></r-tabs>';
      const tabs = root.querySelector<HTMLElement & { _shadowDom: ShadowRoot }>('r-tabs')!;
      if (outside)
        tabs.addEventListener('change', () => {
          if (!tabs.hasAttribute('active')) document.querySelector<HTMLButtonElement>('#outside')!.focus();
        });
    }, outside);
    const tabs = page.locator('#container').locator('r-tabs');
    await tabs.evaluate((node) => {
      const root = (node as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom;
      (root.querySelector('[part="nav"]')!.firstElementChild as HTMLElement & { _btn: HTMLElement })._btn.focus();
      node.querySelector('r-tab')!.remove();
    });
    if (outside) {
      await expect(page.locator('#outside')).toBeFocused();
      await expect(tabs).not.toHaveAttribute('tabindex');
    } else {
      await expect(tabs).toBeFocused();
      await expect(tabs).toHaveAttribute('tabindex', '-1');
    }
  });
}

for (const nested of [false, true]) {
  for (const action of ['remove', 'disable']) {
    test(`replacement tabs preserve explicit outside focus (${action}, ${nested ? 'nested' : 'document'})`, async ({
      page,
    }) => {
      await isolatedSetup(page, DEV_SERVER, 'r-tabs');
      await mount(page, '<div id="container"></div><button id="outside">Outside</button>');
      await page.locator('#container').evaluate((container, nested) => {
        const root = nested ? container.attachShadow({ mode: 'open' }) : container;
        root.innerHTML =
          '<r-tabs id="tabs"><r-tab r-key="a" label="A">A</r-tab><r-tab r-key="b" label="B">B</r-tab></r-tabs>';
      }, nested);
      const tabs = page.locator('#container').locator('r-tabs');
      await tabs.evaluate((node) => {
        const root = (node as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom;
        (root.querySelector('[part="nav"]')!.firstElementChild as HTMLElement & { _btn: HTMLElement })._btn.focus();
        node.addEventListener('change', () => document.querySelector<HTMLButtonElement>('#outside')!.focus());
      });
      await tabs.evaluate((node, action) => {
        const pane = node.querySelector('r-tab')!;
        if (action === 'remove') pane.remove();
        else pane.setAttribute('disabled', '');
      }, action);
      await expect(tabs).toHaveAttribute('active', 'b');
      await expect(page.locator('#outside')).toBeFocused();
      await expect(tabs).not.toHaveAttribute('tabindex');
    });
  }
}

for (const handoff of [false, true]) {
  test(`static tabs disabled reaction ${handoff ? 'respects outside handoff' : 'recovers header focus'}`, async ({
    page,
  }) => {
    await page.route('**/static-tab-regression', (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: `<!doctype html><html><body><r-tabs id="tabs"><r-tab r-key="a" label="A">A</r-tab><r-tab r-key="b" label="B">B</r-tab></r-tabs><button id="outside">Outside</button><script type="module">import '/index.ts';</script></body></html>`,
      }),
    );
    await page.goto(`${DEV_SERVER}/static-tab-regression`);
    await page.waitForFunction(
      () =>
        (document.querySelector('r-tab') as HTMLElement & { parent?: HTMLElement })?.parent ===
        document.querySelector('#tabs'),
    );
    await page.locator('#tabs').evaluate((node, handoff) => {
      const root = (node as HTMLElement & { _shadowDom: ShadowRoot })._shadowDom;
      (root.querySelector('[part="nav"]')!.firstElementChild as HTMLElement & { _btn: HTMLElement })._btn.focus();
      if (handoff)
        node.addEventListener('change', () => document.querySelector<HTMLButtonElement>('#outside')!.focus());
      node.querySelector('r-tab')!.setAttribute('disabled', 'true');
    }, handoff);
    await expect(page.locator('#tabs')).toHaveAttribute('active', 'b');
    if (handoff) await expect(page.locator('#outside')).toBeFocused();
    else expect(await insideShadow(page, '#tabs', (root) => root.activeElement?.getAttribute('r-key'))).toBe('b');
  });
}
