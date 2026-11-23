const { chromium } = require('playwright');
const path = require('path');

async function testCheckoutFlow() {
  console.log('--- Testing Complete Checkout Navigation & Preservation Flow ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const screenshotDir = path.join(__dirname, 'test-results');

  // Track page errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  // 1. Visit Product Page
  console.log('Step 1: Navigating to product page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 2. Select Add-ons & Fill Devotee Particulars
  console.log('Step 2: Selecting add-on and entering Sankalp details...');
  await page.locator('[data-addon-checkbox]').nth(0).check(); // +₹750
  await page.fill('[name="properties[Devotee Name]"]', 'Aarav Sharma');
  await page.fill('[name="properties[Gotra]"]', 'Bharadwaja');
  await page.fill('[name="properties[Puja Date]"]', '2026-11-28');
  await page.fill('[name="properties[WhatsApp Number]"]', '+91 98201 44521');
  await page.fill('[name="properties[Sankalp Intent]"]', 'Family peace and wellness');

  // 3. Add to Cart
  console.log('Step 3: Submitting to cart...');
  await page.click('[data-add-to-cart-btn]');
  await page.waitForTimeout(1000);

  // Verify Cart Drawer is Open
  const isDrawerOpen = await page.isVisible('[data-cart-drawer].is-open');
  console.log('Cart drawer open?', isDrawerOpen);

  // 4. Click Proceed to Checkout
  console.log('Step 4: Clicking Proceed to Checkout button...');
  await page.click('[data-checkout-btn]');

  // Wait for navigation
  await page.waitForNavigation({ waitUntil: 'networkidle' });
  const currentUrl = page.url();
  console.log('Navigated URL:', currentUrl);

  const title = await page.title();
  console.log('Page title after checkout click:', title);

  // Check HTTP response code by verifying non-404 content
  const is404 = await page.evaluate(() => document.body.innerText.includes('404 Not Found'));
  console.log('Encountered 404 error?', is404);

  // 5. Verify Checkout displays correct order items, prices, and devotee info
  console.log('\nStep 5: Verifying items and information preservation in Checkout...');
  const devoteeName = await page.inputValue('#cust-name');
  const gotra = await page.inputValue('#cust-gotra');
  const phone = await page.inputValue('#cust-phone');
  const totalDakshina = await page.innerText('#summary-total-val');
  const itemsText = await page.innerText('#summary-items-list');

  console.log('Retained Devotee Name:', devoteeName);
  console.log('Retained Gotra:', gotra);
  console.log('Retained WhatsApp:', phone);
  console.log('Retained Total Dakshina:', totalDakshina);
  console.log('Items list contains Add-on?', itemsText.includes('1008 Bilva Patra Archana'));
  console.log('Items list contains Devotee?', itemsText.includes('Aarav Sharma'));

  await page.screenshot({ path: path.join(screenshotDir, 'checkout_page_desktop.png') });
  console.log('Saved: checkout_page_desktop.png');

  // 6. Test Page Refresh on Checkout
  console.log('\nStep 6: Testing Checkout Page Refresh Persistence...');
  await page.reload({ waitUntil: 'networkidle' });
  const totalAfterReload = await page.innerText('#summary-total-val');
  console.log('Total Dakshina after page reload:', totalAfterReload);
  const isReloadPreserved = totalAfterReload === totalDakshina;
  console.log('Preserved across reload?', isReloadPreserved);

  // 7. Complete Demo Order Submission
  console.log('\nStep 7: Testing Order Submission on Checkout...');
  await page.click('#btn-submit-order');
  await page.waitForTimeout(1500);

  const isSuccessVisible = await page.isVisible('#order-success-view');
  console.log('Order confirmation view displayed?', isSuccessVisible);
  const orderId = await page.innerText('#confirmed-order-id');
  console.log('Generated Order ID:', orderId);

  await page.screenshot({ path: path.join(screenshotDir, 'checkout_order_confirmed.png') });
  console.log('Saved: checkout_order_confirmed.png');

  // 8. Mobile Viewport Checkout Check
  console.log('\nStep 8: Testing Checkout on Mobile Viewport (390x844)...');
  // First add another item to view checkout with cart
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.fill('[name="properties[Devotee Name]"]', 'Priya Sundaram');
  await page.fill('[name="properties[WhatsApp Number]"]', '+91 94440 18239');
  await page.click('[data-add-to-cart-btn]');
  await page.waitForTimeout(800);

  // Switch to mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/checkout', { waitUntil: 'networkidle' });
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`Mobile Checkout Viewport: client=${clientWidth}px, scroll=${scrollWidth}px, hasOverflow=${scrollWidth > clientWidth}`);
  await page.screenshot({ path: path.join(screenshotDir, 'checkout_page_mobile.png') });
  console.log('Saved: checkout_page_mobile.png');

  console.log('\nConsole Errors:', errors.length === 0 ? 'None (Clean)' : errors);
  await browser.close();
  console.log('--- Checkout Verification Complete ---');
}

testCheckoutFlow().catch(err => {
  console.error('Error during checkout test:', err);
  process.exit(1);
});
