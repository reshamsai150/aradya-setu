const { chromium } = require('playwright');
const path = require('path');

async function runFinalMicroAudit() {
  console.log('=== AARADHYA SETU — FINAL MICRO-FUNCTIONALITY QA AUDIT ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const screenshotDir = path.join(__dirname, 'test-results');

  // Track console issues and network errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  // 1. Product Page Verification
  console.log('\n[1. Product Page Tests]');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1a. Images & Thumbnails
  const thumbs = page.locator('[data-thumb-target]');
  const thumbCount = await thumbs.count();
  console.log(`Thumbnails found: ${thumbCount}`);
  await thumbs.nth(2).click(); // Click 3rd thumbnail
  await page.waitForTimeout(300);
  const mainImgSrc = await page.getAttribute('[data-main-image]', 'src');
  console.log('Main image updated from thumbnail:', mainImgSrc.includes('photo-1596704017254'));

  // 1b. Title & Description
  const title = await page.innerText('.as-puja-title');
  const desc = await page.innerText('.as-description');
  console.log(`Product Title: "${title.trim()}"`);
  console.log(`Description loaded: ${desc.length > 50}`);

  // 1c. Quantity limits
  const qtyInput = page.locator('[data-qty-input]');
  console.log('Initial quantity:', await qtyInput.inputValue());
  await page.click('[data-qty-minus]'); // Should not go below 1
  console.log('Quantity after minus at 1:', await qtyInput.inputValue());
  await page.click('[data-qty-plus]'); // Increases to 2
  console.log('Quantity after plus:', await qtyInput.inputValue());

  // 1d. Variants & Add-ons live price update
  const basePriceText = await page.innerText('[data-price-display]');
  console.log('Price with Qty 2 (Individual):', basePriceText);
  await page.locator('[data-variant-card]').nth(1).click(); // Family Seva (7500 * 2 = 15000)
  await page.waitForTimeout(200);
  const familyPrice = await page.innerText('[data-price-display]');
  console.log('Price with Family Seva (Qty 2):', familyPrice);

  await page.locator('[data-addon-checkbox]').nth(0).check(); // +750 per unit => (7500 + 750) * 2 = 16,500
  await page.waitForTimeout(200);
  const priceWithAddon = await page.innerText('[data-price-display]');
  console.log('Price with Bilva Patra Add-on (+750 * 2):', priceWithAddon);

  // 2. Add to Cart Tests
  console.log('\n[2. Add to Cart Tests]');
  await page.fill('[name="properties[Devotee Name]"]', 'Aarav Sharma');
  await page.fill('[name="properties[Gotra]"]', 'Bharadwaja');
  await page.fill('[name="properties[Puja Date]"]', '2026-11-28');
  await page.fill('[name="properties[WhatsApp Number]"]', '+91 98201 44521');
  await page.fill('[name="properties[Sankalp Intent]"]', 'Family peace and prosperity');

  await page.click('[data-add-to-cart-btn]');
  await page.waitForTimeout(800);

  const isDrawerOpen = await page.isVisible('[data-cart-drawer].is-open');
  console.log('Cart drawer opened automatically?', isDrawerOpen);
  const badgeCount = await page.innerText('[data-cart-counter]');
  console.log('Cart badge count:', badgeCount);

  // 3. Shopping Cart In-Drawer Controls
  console.log('\n[3. Shopping Cart Tests]');
  // Verify item image and details appear
  const cartItemImg = await page.isVisible('.as-cart-item-card img');
  console.log('Cart item image rendered?', cartItemImg);

  // Test in-cart quantity increment
  const initialDrawerSubtotal = await page.innerText('[data-drawer-subtotal]');
  console.log('Cart drawer subtotal before in-cart plus:', initialDrawerSubtotal);
  await page.click('[data-cart-qty-plus="0"]');
  await page.waitForTimeout(300);
  const increasedDrawerSubtotal = await page.innerText('[data-drawer-subtotal]');
  console.log('Cart drawer subtotal after in-cart plus (Qty 3):', increasedDrawerSubtotal);

  // Test in-cart quantity decrement
  await page.click('[data-cart-qty-minus="0"]');
  await page.waitForTimeout(300);
  console.log('Cart drawer subtotal after in-cart minus (Qty 2):', await page.innerText('[data-drawer-subtotal]'));

  // Test cart refresh persistence
  console.log('\n[4. Cart Persistence Test]');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  console.log('Cart badge after page refresh:', await page.innerText('[data-cart-counter]'));

  // Open drawer again via header cart button
  await page.click('[data-cart-trigger]');
  await page.waitForTimeout(300);

  // 5. Checkout Navigation & Order Flow
  console.log('\n[5. Checkout Flow Tests]');
  await page.click('[data-checkout-btn]');
  await page.waitForNavigation({ waitUntil: 'networkidle' });
  console.log('Navigated to URL:', page.url());
  const is404 = await page.evaluate(() => document.body.innerText.includes('404 Not Found'));
  console.log('Encountered 404?', is404);

  // Check retained information
  const chkDevotee = await page.inputValue('#cust-name');
  const chkPhone = await page.inputValue('#cust-phone');
  const chkTotal = await page.innerText('#summary-total-val');
  console.log(`Retained Devotee: ${chkDevotee}, Phone: ${chkPhone}, Total: ${chkTotal}`);

  // Submit order
  await page.click('#btn-submit-order');
  await page.waitForTimeout(1200);
  const isSuccess = await page.isVisible('#order-success-view');
  const confirmedOrderId = await page.innerText('#confirmed-order-id');
  console.log(`Order confirmation displayed? ${isSuccess}, Order ID: ${confirmedOrderId}`);

  // Test return to home with empty cart
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    page.click('#order-success-view a')
  ]);
  console.log('Returned to home URL:', page.url());
  console.log('Cart counter after order completed:', await page.innerText('[data-cart-counter]'));

  // Open empty drawer and test Continue Shopping button
  await page.click('[data-cart-trigger]');
  await page.waitForTimeout(300);
  const hasContinueBtn = await page.isVisible('[data-continue-shopping]');
  console.log('Empty cart shows "Continue Offering Browsing" button?', hasContinueBtn);
  await page.click('[data-continue-shopping]');
  await page.waitForTimeout(300);
  const isDrawerClosed = !(await page.isVisible('[data-cart-drawer].is-open'));
  console.log('Drawer closed via Continue Shopping button?', isDrawerClosed);

  // 6. Viewport Audit
  console.log('\n[6. Viewport Responsive Tests]');
  const viewports = [
    { name: 'Mobile (375x812)', w: 375, h: 812 },
    { name: 'Tablet (768x1024)', w: 768, h: 1024 },
    { name: 'Desktop (1440x900)', w: 1440, h: 900 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.waitForTimeout(200);
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientW = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`${vp.name}: client=${clientW}px, scroll=${scrollW}px, overflow=${scrollW > clientW}`);
  }

  console.log(`\nBrowser Console Errors: ${consoleErrors.length === 0 ? 'None (Clean 0 errors)' : consoleErrors}`);

  await browser.close();
  console.log('\n=== FINAL MICRO-FUNCTIONALITY AUDIT COMPLETE ===');
}

runFinalMicroAudit().catch(err => {
  console.error('Audit run error:', err);
  process.exit(1);
});
