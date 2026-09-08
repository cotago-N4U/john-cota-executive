// Local acceptance check. Set PLAYWRIGHT_PATH if Playwright is not on NODE_PATH.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

(async () => {
  const output = path.join(__dirname, 'preview-checks');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const results = [];
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 320, height: 812 }]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.project').count(), 3);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Horizontal overflow at ' + viewport.width);
    await page.screenshot({ path: path.join(output, viewport.width + '-full.png'), fullPage: true });
    await page.screenshot({ path: path.join(output, viewport.width + '-hero.png') });
    for (const lens of ['people', 'operations', 'brand']) {
      const button = page.locator('[data-lens="' + lens + '"]');
      await button.focus();
      await page.keyboard.press('Enter');
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('.lens-button[aria-pressed="true"]').count(), 1);
      assert.equal(await page.locator('.follow-work').getAttribute('data-active-lens'), lens);
      assert.equal(await page.locator('.lens-label').textContent(), 'The ' + lens + ' perspective');
    }
    await page.locator('#approach').screenshot({ path: path.join(output, viewport.width + '-interaction.png') });
    for (const detail of await page.locator('.case-details').all()) {
      await detail.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.equal(await detail.getAttribute('open'), '');
      await page.keyboard.press('Enter');
      assert.equal(await detail.getAttribute('open'), null);
    }
    if (viewport.width < 761) {
      await page.locator('.menu').click();
      assert.equal(await page.locator('#mobile-nav').isVisible(), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#mobile-nav').isVisible(), false);
      assert.equal(await page.locator('.menu').evaluate(el => document.activeElement === el), true);
      await page.locator('.menu').click();
      await page.locator('#mobile-nav a[href="#work"]').click();
      assert.equal(await page.locator('#mobile-nav').isVisible(), false);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('[data-lens="operations"]').click();
    assert.equal(await page.locator('.workflow-stage').first().evaluate(el => getComputedStyle(el).animationName), 'none');
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    assert.deepEqual(errors, []);
    results.push({ width: viewport.width, horizontalOverflow: false, keyboardInteraction: 'pass', reducedMotion: 'pass', scriptErrors: errors });
    await page.close();
  }
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
