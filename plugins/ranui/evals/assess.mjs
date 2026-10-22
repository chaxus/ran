import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { browserTools, runtimeHash, settle, runtimeState } from './evidence.mjs';
import { hash } from './hash.mjs';
import { serve } from './serve.mjs';
import { codePayload, streamPayload } from './scenarios.mjs';
export async function assess(dir, { screenshot = true } = {}) {
  const { scenario } = JSON.parse(readFileSync(path.join(dir, 'run.json')));
  const { chromium } = browserTools(dir);
  const { server, url } = await serve(dir);
  const browser = await chromium.launch();
  const result = {
    scenario,
    checks: [],
    visualJudgmentRequired: scenario === '04-effects',
    humanDecision: 'not-observed',
  };
  const check = (name, pass, observed) => result.checks.push({ name, pass: !!pass, observed });
  try {
    const context = await browser.newContext({
      viewport: { width: scenario === '03-label' ? 320 : 760, height: 640 },
      permissions: ['clipboard-read', 'clipboard-write'],
    });
    const page = await context.newPage();
    page.setDefaultTimeout(3000);
    const errors = [];
    const responses = [];
    page.on('response', (r) => {
      if (r.status() === 200)
        responses.push(
          r
            .body()
            .then((body) => ({ url: new URL(r.url()).pathname + new URL(r.url()).search, sha256: hash(body) }))
            .catch(() => null),
        );
    });
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(url);
    await page.waitForFunction(() => !!document.querySelector('main') && !!customElements.get('r-button'));
    await settle(page);
    result.state = await runtimeState(page, browser);
    check('real ranui custom element registered', await page.evaluate(() => !!customElements.get('r-button')));
    if (scenario === '01-text') {
      const geom = await page.evaluate(() => {
        const range = (s) => {
          const r = document.createRange();
          r.selectNodeContents(document.querySelector(s));
          const b = r.getBoundingClientRect();
          return { left: b.left, width: b.width, height: b.height };
        };
        const main = document.querySelector('main'),
          row = document.querySelector('.setting');
        const expected =
          main.getBoundingClientRect().left +
          parseFloat(getComputedStyle(main).paddingLeft) +
          parseFloat(getComputedStyle(row).paddingLeft) +
          parseFloat(getComputedStyle(row).borderLeftWidth);
        return { heading: range('.heading-text'), description: range('.description-text'), expected };
      });
      check(
        'visible text alignment',
        [geom.heading, geom.description].every(
          (r) => r.width > 0 && r.height > 0 && Math.abs(r.left - geom.expected) <= 0.5,
        ),
        geom,
      );
      check(
        'content and action retained',
        (await page.locator('r-button').count()) === 1 &&
          (await page.getByText('Choose how you hear from us.').count()) === 1,
      );
    }
    if (scenario === '02-back') {
      const commands = page.locator('a[href="#project"],a[href="#workspace"]');
      const detail = await commands.evaluateAll((els) =>
        els
          .filter(
            (e) =>
              e.getBoundingClientRect().width &&
              !e.closest('[aria-label*="breadcrumb" i]') &&
              !e.closest('nav')?.querySelector('[aria-current="page"]'),
          )
          .map((e) => ({ href: e.getAttribute('href'), text: e.textContent })),
      );
      check('one contextual return level', detail.length <= 1, detail);
      const duplicates = await commands.evaluateAll((els) => {
        const hrefs = els.filter((e) => e.getBoundingClientRect().width).map((e) => e.getAttribute('href'));
        return hrefs.length - new Set(hrefs).size;
      });
      check('no duplicated visible destination', duplicates === 0, duplicates);
      for (const mode of ['pointer', 'keyboard']) {
        const activate = async (link) => {
          if (mode === 'pointer') await link.click();
          else {
            await link.focus();
            await page.keyboard.press('Enter');
          }
        };
        await page.goto(url);
        await page.waitForSelector('a[href="#project"]');
        const workspaceOnDetail = await page
          .locator('a[href="#workspace"]')
          .isVisible()
          .catch(() => false);
        await activate(page.locator('a[href="#project"]').first());
        await page.waitForURL('**/#project');
        await page.waitForFunction(() => document.querySelector('h1')?.textContent === 'Project');
        let reached = false;
        if (workspaceOnDetail) {
          // A hierarchy breadcrumb legitimately exposes both ancestors on the detail view.
          await page.locator('a[href="#detail"]').first().click();
          await page.waitForURL('**/#detail');
          await activate(page.locator('a[href="#workspace"]').first());
        } else if (await page.locator('a[href="#workspace"]').count()) {
          await activate(page.locator('a[href="#workspace"]').first());
        }
        if (new URL(page.url()).hash === '#workspace') {
          await page.waitForFunction(() => document.querySelector('h1')?.textContent === 'Workspace');
          reached = true;
          await activate(page.locator('a[href="#detail"]').first());
          await page.waitForURL('**/#detail');
          await page.waitForSelector('a[href="#project"]');
        }
        check(`${mode} route hierarchy and return`, reached);
      }
    }
    if (scenario === '03-label') {
      const geometry = await page.evaluate(() => {
        const el = document.querySelector('.return-label');
        if (!el) return { missing: true };
        const boxes = [];
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = walker.nextNode())) {
          for (let i = 0; i < n.length; i++) {
            const r = document.createRange();
            r.setStart(n, i);
            r.setEnd(n, i + 1);
            boxes.push(
              ...[...r.getClientRects()].map((b) => ({ left: b.left, right: b.right, top: b.top, bottom: b.bottom })),
            );
          }
        }
        const clips = [];
        for (let a = el; a; a = a.parentElement) {
          const s = getComputedStyle(a);
          if (/hidden|clip|auto|scroll/.test(s.overflowX + ' ' + s.overflowY)) {
            const b = a.getBoundingClientRect();
            clips.push({
              left: b.left,
              right: b.right,
              top: b.top,
              bottom: b.bottom,
              x: /hidden|clip|auto|scroll/.test(s.overflowX),
              y: /hidden|clip|auto|scroll/.test(s.overflowY),
            });
          }
        }
        return {
          text: el.textContent,
          boxes,
          clips,
          viewport: innerWidth,
          viewportHeight: innerHeight,
          pageWidth: document.documentElement.scrollWidth,
        };
      });
      check(
        'full translated destination visible',
        !geometry.missing &&
          geometry.text.trim().length > 0 &&
          geometry.boxes.length > 0 &&
          geometry.boxes.some((b) => b.right > b.left && b.bottom > b.top) &&
          geometry.boxes.every(
            (b) =>
              b.left >= 0 &&
              b.right <= geometry.viewport + 0.5 &&
              b.top >= 0 &&
              b.bottom <= geometry.viewportHeight + 0.5 &&
              geometry.clips.every(
                (c) =>
                  (!c.x || (b.left >= c.left - 0.5 && b.right <= c.right + 0.5)) &&
                  (!c.y || (b.top >= c.top - 0.5 && b.bottom <= c.bottom + 0.5)),
              ),
          ),
        geometry,
      );
      check('no horizontal document overflow', geometry.pageWidth <= 320, geometry.pageWidth);
      if (geometry.text !== 'Zurück zu Projekteinstellungen') result.destinationMeaningReviewRequired = true;
      for (const mode of ['pointer', 'keyboard']) {
        await page.goto(url);
        await page.waitForSelector('a[href="#project"]');
        const link = page.locator('a[href="#project"]').first();
        try {
          if (mode === 'pointer') await link.click({ timeout: 1500 });
          else {
            await link.focus();
            await page.keyboard.press('Enter');
          }
          await page.waitForURL('**/#project', { timeout: 1500 });
          await page.waitForSelector('a[href="#detail"]');
          const back = page.locator('a[href="#detail"]').first();
          if (mode === 'pointer') await back.click({ timeout: 1500 });
          else {
            await back.focus();
            await page.keyboard.press('Enter');
          }
          await page.waitForURL('**/#detail', { timeout: 1500 });
          await page.waitForSelector('.return-label');
          check(`${mode} translated navigation round trip`, true);
        } catch (e) {
          check(`${mode} translated navigation round trip`, false, e.message);
        }
      }
    }
    if (scenario === '04-effects') {
      const surfaces = await page.locator('main *').evaluateAll((els) =>
        els
          .map((e) => ({
            tag: e.tagName,
            class: e.className,
            shadow: getComputedStyle(e).boxShadow,
            border: parseFloat(getComputedStyle(e).borderTopWidth),
            background: getComputedStyle(e).backgroundImage,
          }))
          .filter((e) => e.shadow !== 'none' || e.border > 0 || e.background !== 'none'),
      );
      check('effects serve a limited hierarchy', surfaces.length <= 2, surfaces);
      check(
        'activity information and action retained',
        (await page.getByText('Mia changed the workspace description.').count()) === 1 &&
          (await page.locator('r-button').count()) === 1,
      );
      result.visualReview =
        'Independent reviewer must inspect assessor.png and judge grouping, hierarchy, and purposes of remaining effects; this count alone is not visual acceptance.';
    }
    if (scenario === '05-freshness') {
      result.independentReportReviewRequired = true;
      const evidence = path.join(dir, 'evidence');
      const files = existsSync(evidence)
        ? readdirSync(evidence).filter((x) => x.endsWith('.json') && !x.startsWith('prior'))
        : [];
      const observedResources = (await Promise.all(responses)).filter(Boolean);
      const canonical = (u) => {
        const parsed = new URL(u, 'http://localhost');
        parsed.searchParams.delete('v');
        parsed.searchParams.delete('t');
        return parsed.pathname + parsed.search;
      };
      let valid = false,
        uncertain = false;
      const details = [];
      for (const file of files) {
        try {
          const cap = JSON.parse(readFileSync(path.join(evidence, file)));
          const captures = cap.captures || [
            { media: cap.media || cap.mediaPath || cap.screenshot, mediaHash: cap.mediaHash || cap.screenshotHash },
          ];
          if (!captures.some((c) => c.media)) continue;
          const mediaOK = captures.every(
            (c) => c.media && c.mediaHash === hash(readFileSync(path.join(evidence, c.media))),
          );
          const scopeOK = Array.isArray(cap.scope) && cap.scope.includes(scenario);
          let runtimeOK = false,
            manual = false;
          if (cap.sourceHashes) {
            const required = [
              'runtime.js',
              ...readdirSync(path.join(dir, 'surface'), { recursive: true, withFileTypes: true })
                .filter((e) => e.isFile())
                .map((e) => path.relative(dir, path.join(e.parentPath, e.name))),
            ];
            const sourceOK = required.every((p) => cap.sourceHashes[p] === hash(readFileSync(path.join(dir, p))));
            const declared = new Map((cap.loadedResources || []).map((r) => [canonical(r.url), r.sha256]));
            const stable = observedResources.filter((r) => !r.url.startsWith('/@vite/client'));
            const mismatches = stable.filter(
              (r) => declared.has(canonical(r.url)) && declared.get(canonical(r.url)) !== r.sha256,
            );
            const resourcesOK = stable.length > 0 && stable.every((r) => declared.get(canonical(r.url)) === r.sha256);
            runtimeOK = sourceOK && resourcesOK;
            manual = sourceOK && !resourcesOK && mismatches.length === 0;
          } else runtimeOK = cap.runtimeHash === runtimeHash(dir);
          const pass = mediaOK && scopeOK && runtimeOK;
          const needsManual = mediaOK && scopeOK && manual;
          details.push({ file, pass, needsManual, mediaOK, scopeOK, runtimeOK });
          valid ||= pass;
          uncertain ||= needsManual;
        } catch (e) {
          details.push({ file, error: e.message });
        }
      }
      if (!valid && uncertain) {
        result.manualAssessmentRequired = true;
        result.checks.push({
          name: 'runtime/media/scope binding requires independent alternate-format verification',
          pass: null,
          observed: details,
        });
      } else check('current runtime/media/scope binding', valid, details);
      const prior = JSON.parse(readFileSync(path.join(evidence, 'prior.capture.json')));
      check('prior evidence actually predates style follow-up', prior.runtimeHash !== runtimeHash(dir));
    }
    if (scenario === '06-code') {
      for (const streamed of [false, true]) {
        if (streamed) await page.locator('#stream').click();
        const expected = codePayload + (streamed ? streamPayload : '');
        await page.locator('#copy').click();
        const clipboard = await page.evaluate(() => navigator.clipboard.readText());
        check(`exact clipboard ${streamed ? 'streamed' : 'initial'}`, clipboard === expected, {
          expected: JSON.stringify(expected),
          actual: JSON.stringify(clipboard),
        });
        const selection = await page.locator('#source').evaluate((el) => {
          const r = document.createRange();
          r.selectNodeContents(el);
          const s = getSelection();
          s.removeAllRanges();
          s.addRange(r);
          const blocked = [];
          for (let n = el; n; n = n.parentElement)
            if (getComputedStyle(n).userSelect === 'none') blocked.push(n.tagName);
          return { text: s.toString(), rangeText: r.toString(), userSelect: getComputedStyle(el).userSelect, blocked };
        });
        check(
          `native selectable payload ${streamed ? 'streamed' : 'initial'}`,
          selection.rangeText === expected &&
            (selection.text === expected || selection.text === expected.replace(/\n$/, '')) &&
            selection.userSelect !== 'none' &&
            selection.blocked.length === 0,
          { ...selection, text: JSON.stringify(selection.text) },
        );
      }
      await page.locator('pre').evaluate((el) => (el.scrollLeft = 0));
      const glyph = await page.locator('#source').evaluate((el) => {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const n = walker.nextNode();
        if (!n || n.length < 20) return null;
        const r = document.createRange();
        r.setStart(n, 1);
        r.setEnd(n, 20);
        const b = r.getBoundingClientRect();
        getSelection().removeAllRanges();
        return { left: b.left, right: b.right, y: b.top + b.height / 2 };
      });
      if (glyph) {
        await page.mouse.move(glyph.left + 1, glyph.y);
        await page.mouse.down();
        await page.mouse.move(glyph.right - 1, glyph.y, { steps: 12 });
        await page.mouse.up();
        const picked = await page.evaluate(() => getSelection().toString());
        check(
          'real mouse source selection',
          picked.length > 5 && (codePayload + streamPayload).includes(picked),
          picked,
        );
      } else check('real mouse source selection', false, 'missing visible text');
      const overflow = await page.locator('pre').evaluate((el) => {
        el.scrollLeft = 100;
        return {
          client: el.clientWidth,
          scroll: el.scrollWidth,
          position: el.scrollLeft,
          whiteSpace: getComputedStyle(el).whiteSpace,
          overflow: getComputedStyle(el).overflowX,
          page: document.documentElement.scrollWidth,
          viewport: innerWidth,
        };
      });
      check(
        'long lines scroll within code',
        overflow.scroll > overflow.client &&
          overflow.position > 0 &&
          ['auto', 'scroll'].includes(overflow.overflow) &&
          overflow.page <= overflow.viewport,
        overflow,
      );
    }
    check('no browser runtime errors', errors.length === 0, errors);
    if (screenshot) {
      mkdirSync(path.join(dir, 'evidence'), { recursive: true });
      await page.screenshot({ path: path.join(dir, 'evidence/assessor.png'), fullPage: true });
    }
    result.mechanicalPass = result.checks.some((c) => c.pass === null) ? null : result.checks.every((c) => c.pass);
    return result;
  } catch (e) {
    result.checks.push({ name: 'assessor completion', pass: false, observed: e.message });
    result.mechanicalPass = false;
    return result;
  } finally {
    await browser.close();
    await server.close();
  }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = path.resolve(process.argv[2]);
  const result = await assess(dir);
  writeFileSync(path.join(dir, 'assessment.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.mechanicalPass === null ? 2 : result.mechanicalPass ? 0 : 1;
}
