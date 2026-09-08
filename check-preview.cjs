// Local scene-navigation acceptance checks. Set PLAYWRIGHT_PATH if needed.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

(async () => {
  const output = path.join(__dirname, 'preview-checks', 'v3');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const results = [];
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 320, height: 812 }]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.scene:visible').count(), 1);
    assert.equal(await page.locator('.scene:visible').getAttribute('id'), 'work');
    await page.screenshot({ path: path.join(output, viewport.width + '-hub.png'), animations: 'disabled' });
    for (const scene of ['work', 'partnership', 'operations', 'brand', 'practice', 'about']) {
      if (scene !== 'work') {
        await page.evaluate(route => { location.hash = route; }, scene);
        await page.waitForFunction(route => document.querySelector('.scene:not([hidden])')?.id === route, scene);
      }
      assert.equal(await page.locator('.scene:visible').count(), 1);
      assert.equal(await page.locator('h1:visible').count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Horizontal overflow: ' + scene + ' / ' + viewport.width);
      if (scene === 'brand') {
        assert.equal(await page.locator('[data-route="brand"]').getAttribute('aria-current'), 'step');
        assert.equal(await page.locator('.context-metrics strong').allTextContents().then(values => values.join(' / ')), '34% / 48%');
        assert.equal(await page.locator('.next-chapter').getAttribute('href'), '#practice');
      }
      await page.locator('.scene:visible').screenshot({ path: path.join(output, viewport.width + '-' + scene + '.png'), animations: 'disabled' });
    }
    // Keyboard navigation from the global nav into a card and then its scene.
    await page.locator('[data-nav="work"]').focus();
    await page.keyboard.press('Enter');
    await page.locator('.tile-partnership').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.scene:visible').getAttribute('id'), 'partnership');
    assert.equal(await page.locator('#partnership-title').evaluate(el => document.activeElement === el), true);
    assert.equal(new URL(page.url()).hash, '#partnership');
    await page.goBack();
    await page.waitForFunction(() => document.querySelector('.scene:not([hidden])')?.id === 'work');
    await page.goForward();
    await page.waitForFunction(() => document.querySelector('.scene:not([hidden])')?.id === 'partnership');
    // Deep-link reload preserves the case.
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.scene:visible').getAttribute('id'), 'partnership');
    await page.locator('[data-nav="practice"]').click();
    for (const lens of ['people', 'operations', 'brand']) {
      const button = page.locator('[data-lens="' + lens + '"]');
      await button.focus();
      await page.keyboard.press('Enter');
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('.lens-button[aria-pressed="true"]').count(), 1);
      assert.equal(await page.locator('.follow-work').getAttribute('data-active-lens'), lens);
      assert.equal(await page.locator('.lens-label').textContent(), 'The ' + lens + ' perspective');
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('[data-lens="operations"]').click();
    assert.equal(await page.locator('.stage-symbol').first().evaluate(el => getComputedStyle(el).animationName), 'none');
    await page.locator('[data-nav="about"]').click();
    assert.equal(await page.locator('.scene:visible').evaluate(el => getComputedStyle(el).animationName), 'none');
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    assert.equal(await page.locator('.profile-links a').first().getAttribute('href'), 'https://www.linkedin.com/in/johncota-go/');
    await page.locator('.skip').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.scene:visible').getAttribute('id'), 'about', 'Skip link must retain active scene');
    assert.deepEqual(errors, []);
    results.push({ width: viewport.width, scenes: 6, overflow: false, keyboard: 'pass', historyAndDeepLinks: 'pass', reducedMotion: 'pass', errors });
    await page.close();
  }
  const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noJS.goto('http://127.0.0.1:4173');
  assert.equal(await noJS.locator('.scene:visible').count(), 6);
  await noJS.locator('.tile-partnership').click();
  assert.equal(new URL(noJS.url()).hash, '#partnership');
  await noJS.close();
  await browser.close();
  console.log(JSON.stringify({ results, noJavaScriptFallback: 'pass' }, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
