const { chromium } = require('playwright');
const path = require('path');

async function runAudit() {
  console.log('--- Starting Playwright Full Automated QA Audit ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const screenshotDir = path.join(__dirname, 'test-results');

  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  // Navigate to local server
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. Desktop Screenshot
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: path.join(screenshotDir, 'desktop_product_page.png'), fullPage: false });
  console.log('Saved: desktop_product_page.png');

  // TEST A: Image selection & zoom
  console.log('\n--- Running TEST A: Image selection & Gallery Zoom ---');
  const initialSrc = await page.getAttribute('[data-main-image]', 'src');
  console.log('Initial main image:', initialSrc.substring(0, 50));

  // Click 2nd thumbnail
  const thumbs = page.locator('[data-thumb-target]');
  await thumbs.nth(1).click();
  await page.waitForTimeout(400);
  const updatedSrc = await page.getAttribute('[data-main-image]', 'src');
  console.log('Updated main image after thumb 2 click:', updatedSrc.substring(0, 50));
  const isImageChanged = initialSrc !== updatedSrc;
  console.log('Image changed successfully?', isImageChanged);

  // Click main image to open zoom lightbox
  await page.click('.as-main-image-wrap');
  await page.waitForTimeout(400);
  const isZoomOpen = await page.isVisible('[data-zoom-modal].is-open');
  console.log('Zoom modal opened?', isZoomOpen);
  await page.screenshot({ path: path.join(screenshotDir, 'gallery_zoom_modal.png') });
  console.log('Saved: gallery_zoom_modal.png');
  await page.click('[data-zoom-close]');
  await page.waitForTimeout(300);

  // TEST B: Variant & Pricing
  console.log('\n--- Running TEST B: Seva Tier Variant & Pricing ---');
  const initialPriceText = await page.innerText('[data-price-display]');
  console.log('Initial price display:', initialPriceText);

  // Click Family Seva tier
  const familyCard = page.locator('[data-variant-card]').nth(1);
  await familyCard.click();
  await page.waitForTimeout(300);
  const familyPriceText = await page.innerText('[data-price-display]');
  console.log('Price after Family Seva selection:', familyPriceText);
  const isVariantPriceUpdated = familyPriceText.includes('7,500');
  console.log('Variant updated correctly?', isVariantPriceUpdated);

  // Switch back to Individual
  await page.locator('[data-variant-card]').nth(0).click();
  await page.waitForTimeout(200);

  // TEST C: Offering Add-on Selector
  console.log('\n--- Running TEST C: Offering Add-on Selector ---');
  const addon1 = page.locator('[data-addon-checkbox]').nth(0); // 1008 Bilva Patra (+750)
  await addon1.check();
  await page.waitForTimeout(300);
  const priceWithAddon = await page.innerText('[data-price-display]');
  console.log('Price with 1 add-on (+750):', priceWithAddon);
  const isAddonPriceCorrect = priceWithAddon.includes('5,850');
  console.log('Add-on price calculated correctly?', isAddonPriceCorrect);

  // TEST D: Quantity adjustment
  console.log('\n--- Running TEST D: Quantity Selector ---');
  await page.click('[data-qty-plus]'); // 2
  await page.waitForTimeout(300);
  const qty2Price = await page.innerText('[data-price-display]');
  console.log('Price for Qty 2 (5,850 * 2 = 11,700):', qty2Price);
  const isQtyCorrect = qty2Price.includes('11,700');
  console.log('Quantity price calculation correct?', isQtyCorrect);

  // Test negative quantity prevention
  await page.fill('[data-qty-input]', '-5');
  await page.locator('[data-qty-input]').blur();
  await page.waitForTimeout(200);
  const clampedQty = await page.inputValue('[data-qty-input]');
  console.log('Negative quantity input clamped to:', clampedQty);

  // Reset to qty 1
  await page.fill('[data-qty-input]', '1');
  await page.locator('[data-qty-input]').blur();
  await page.waitForTimeout(200);

  // TEST E: Devotee Sankalp Form Validation & Add To Cart
  console.log('\n--- Running TEST E: Add to Cart & Sankalp Validation ---');
  // Fill form
  await page.fill('[name="properties[Devotee Name]"]', 'Aarav Sharma');
  await page.fill('[name="properties[Gotra]"]', 'Bharadwaja');
  await page.fill('[name="properties[Puja Date]"]', '2026-11-28');
  await page.fill('[name="properties[WhatsApp Number]"]', '+91 98201 44521');
  await page.fill('[name="properties[Sankalp Intent]"]', 'Health, prosperity, and divine blessings for parents');

  // Submit form
  await page.click('[data-add-to-cart-btn]');
  console.log('Clicked Book Puja & Add to Cart button...');
  await page.waitForTimeout(1000);

  // Verify Cart Drawer Opened
  const isDrawerOpen = await page.isVisible('[data-cart-drawer].is-open');
  console.log('Cart drawer opened automatically?', isDrawerOpen);
  const drawerSubtotal = await page.innerText('[data-drawer-subtotal]');
  console.log('Cart drawer subtotal:', drawerSubtotal);
  const cartBadgeCount = await page.innerText('[data-cart-counter]');
  console.log('Navbar Cart badge count:', cartBadgeCount);

  await page.screenshot({ path: path.join(screenshotDir, 'cart_drawer_added.png') });
  console.log('Saved: cart_drawer_added.png');

  // TEST F: Cart Persistence Across Page Reload
  console.log('\n--- Running TEST F: Cart Persistence Across Reload ---');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const reloadedBadge = await page.innerText('[data-cart-counter]');
  console.log('Navbar Cart badge after page reload:', reloadedBadge);
  const isPersisted = reloadedBadge === '1';
  console.log('Cart persistent after reload?', isPersisted);

  // TEST G: Responsive Mobile Viewports
  console.log('\n--- Running TEST G: Responsive Viewport Checks ---');
  const viewports = [
    { name: '320x640', width: 320, height: 640 },
    { name: '375x812', width: 375, height: 812 },
    { name: '390x844', width: 390, height: 844 },
    { name: '768x1024', width: 768, height: 1024 },
    { name: '1024x768', width: 1024, height: 768 },
    { name: '1440x900', width: 1440, height: 900 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(300);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const hasHorizontalOverflow = scrollWidth > clientWidth;
    console.log(`Viewport ${vp.name}: client=${clientWidth}px, scroll=${scrollWidth}px, overflow=${hasHorizontalOverflow}`);
    if (vp.name === '390x844') {
      await page.screenshot({ path: path.join(screenshotDir, 'mobile_product_page_390x844.png') });
      console.log('Saved: mobile_product_page_390x844.png');
    }
  }

  console.log('\nConsole Errors Logged:', consoleErrors.length === 0 ? 'None (Clean)' : consoleErrors);

  await browser.close();
  console.log('--- Automated QA Audit Finished Successfully ---');
}

runAudit().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
