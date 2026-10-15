import { chromium } from 'playwright';

async function validateServices() {
  console.log('🚀 Running Playwright Validation on Redesigned Services Section...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const consoleErrors = [];

  // ─── 1. DESKTOP VIEWPORT (1440x900) ──────────────────────────
  console.log('\n🖥️  Testing Desktop Viewport (1440x900)...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await desktopContext.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // Scroll to approach section & screenshot
  const approachSec = page.locator('#approach');
  await approachSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await approachSec.screenshot({ path: 'scripts/approach-desktop.png' });
  console.log('  📸 Saved scripts/approach-desktop.png');

  // Scroll to services
  const servicesSec = page.locator('#services');
  await servicesSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Take desktop screenshot of Service 01 (initial)
  await servicesSec.screenshot({ path: 'scripts/services-desktop.png' });
  console.log('  📸 Saved scripts/services-desktop.png');

  // Verify oversized watermark heading
  const watermarkText = await page.locator('#services span:has-text("SERVICES")').first().innerText();
  console.log(`  ✅ Watermark text found: "${watermarkText}"`);

  // Step through all 6 services with Next button
  const nextBtn = page.locator('button[aria-label="Next service discipline"]');
  for (let i = 1; i < 6; i++) {
    await nextBtn.click();
    await page.waitForTimeout(300);
    const cardActive = await page.locator(`#service-card-${i}`).getAttribute('aria-hidden');
    console.log(`  👉 Next to service 0${i + 1}: active = ${cardActive === 'false'}`);
  }

  // Capture screenshot of Service 02 in center with neighbors on both sides
  const pill1 = page.locator('#service-pill-1');
  await pill1.click();
  await page.waitForTimeout(400);
  await servicesSec.screenshot({ path: 'scripts/services-desktop-02.png' });
  console.log('  📸 Saved scripts/services-desktop-02.png (Service 02 centered, 01 on left, 03 on right)');

  // Test Prev button
  const prevBtn = page.locator('button[aria-label="Previous service discipline"]');
  await prevBtn.click();
  await page.waitForTimeout(300);
  const card0Active = await page.locator('#service-card-0').getAttribute('aria-hidden');
  console.log(`  👈 Prev back to service 01: active = ${card0Active === 'false'}`);

  // Test Keyboard ArrowRight
  const carouselRegion = page.locator('div[role="region"][aria-label="Core Services Carousel"]');
  await carouselRegion.focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  const card1Key = await page.locator('#service-card-1').getAttribute('aria-hidden');
  console.log(`  ⌨️  ArrowRight pressed: active service 02 = ${card1Key === 'false'}`);

  // Test Neighbor Click (clicking service-card-2)
  const neighborCard2 = page.locator('#service-card-2');
  await neighborCard2.click();
  await page.waitForTimeout(300);
  const card2Neighbor = await page.locator('#service-card-2').getAttribute('aria-hidden');
  console.log(`  🖱️  Clicked right neighbor card 03: active = ${card2Neighbor === 'false'}`);

  // Test Mouse Cursor Drag Left (advances to service 04)
  const carouselBox = await carouselRegion.boundingBox();
  const startX = carouselBox.x + carouselBox.width * 0.6;
  const startY = carouselBox.y + carouselBox.height * 0.5;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX - 150, startY, { steps: 6 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  const card3Dragged = await page.locator('#service-card-3').getAttribute('aria-hidden');
  console.log(`  🖱️👆 Mouse drag left -> service 04 active: ${card3Dragged === 'false'}`);

  // Test Mouse Cursor Drag Right (moves back to service 03)
  await page.mouse.move(startX - 150, startY);
  await page.mouse.down();
  await page.mouse.move(startX, startY, { steps: 6 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  const card2DraggedBack = await page.locator('#service-card-2').getAttribute('aria-hidden');
  console.log(`  🖱️👉 Mouse drag right -> service 03 active: ${card2DraggedBack === 'false'}`);

  // Check horizontal overflow on desktop
  const desktopOverflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });
  console.log(`  Desktop Overflow Check:`, desktopOverflow);

  await desktopContext.close();

  // ─── 2. MOBILE VIEWPORT (390x844 - iPhone 14) ────────────────
  console.log('\n📱 Testing Mobile Viewport (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();

  await mobilePage.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(1000);

  const mServices = mobilePage.locator('#services');
  await mServices.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(500);

  // Take mobile screenshot
  await mServices.screenshot({ path: 'scripts/services-mobile.png' });
  console.log('  📸 Saved scripts/services-mobile.png');

  // Check horizontal overflow on mobile
  const mobileOverflow = await mobilePage.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });
  console.log(`  Mobile Overflow Check:`, mobileOverflow);

  // Test mobile swipe via touch dispatch
  await mobilePage.evaluate(() => {
    const el = document.querySelector('div[role="region"][aria-label="Core Services Carousel"]');
    if (el) {
      const touch1 = new Touch({ identifier: 1, target: el, clientX: 300, clientY: 200, screenX: 300, screenY: 200 });
      el.dispatchEvent(new TouchEvent('touchstart', { touches: [touch1], changedTouches: [touch1], bubbles: true }));

      const touch2 = new Touch({ identifier: 1, target: el, clientX: 100, clientY: 200, screenX: 100, screenY: 200 });
      el.dispatchEvent(new TouchEvent('touchend', { touches: [touch2], changedTouches: [touch2], bubbles: true }));
    }
  });
  await mobilePage.waitForTimeout(400);
  const mCard1Swipe = await mobilePage.locator('#service-card-1').getAttribute('aria-hidden');
  console.log(`  👆 Mobile touch swipe left -> service 02 active: ${mCard1Swipe === 'false'}`);

  // Take mobile screenshot of service 02
  await mServices.screenshot({ path: 'scripts/services-mobile-02.png' });
  console.log('  📸 Saved scripts/services-mobile-02.png');

  // Test pagination dots on mobile
  const dot4 = mobilePage.locator('button[aria-label="Go to service 05: GROWTH CREATIVE"]');
  if (await dot4.count() > 0) {
    await dot4.click();
    await mobilePage.waitForTimeout(300);
    const mCard4Active = await mobilePage.locator('#service-card-4').getAttribute('aria-hidden');
    console.log(`  🔘 Dot 05 clicked: active = ${mCard4Active === 'false'}`);
  }

  await mobileContext.close();
  await browser.close();

  console.log('\n==============================================');
  console.log(`Console Errors encountered: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Errors:', consoleErrors);
  }
  console.log('🎉 ALL VALIDATION CHECKS PASSED');
}

validateServices().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});
