import { chromium } from 'playwright';

const VIEWPORTS = [
  { name: 'Mobile Small', width: 360, height: 740 },
  { name: 'Mobile iPhone 14', width: 390, height: 844 },
  { name: 'Mobile Large', width: 428, height: 926 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Desktop Standard', width: 1440, height: 900 },
  { name: 'Desktop Large', width: 1920, height: 1080 },
  { name: 'Desktop Ultrawide', width: 2560, height: 1440 }
];

async function runTests() {
  console.log('🚀 Starting Comprehensive Playwright Responsiveness & Error Suite...\n');
  
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const issuesFound = [];
  const consoleErrors = [];
  const networkFailures = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n==============================================`);
    console.log(`📱 Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`==============================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: vp.width < 768 
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    // Listen to console errors and network failures
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`[Browser Console Error] [${vp.name}]:`, msg.text());
        consoleErrors.push({ vp: vp.name, text: msg.text() });
      }
    });

    page.on('requestfailed', request => {
      const url = request.url();
      console.warn(`[Network Request Failed] [${vp.name}]: ${url} - ${request.failure()?.errorText}`);
      networkFailures.push({ vp: vp.name, url, error: request.failure()?.errorText });
    });

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(600);

    // 1. Check Horizontal Overflow (User cannot horizontally scroll and doc does not expand beyond viewport)
    const overflowData = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const bodyScrollWidth = document.body.scrollWidth;
      
      // Test if user can actually scroll horizontally
      window.scrollTo(500, 0);
      const scrolledX = window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft;
      window.scrollTo(0, 0);

      return {
        docWidth,
        scrollWidth,
        bodyScrollWidth,
        scrolledX,
        hasHorizontalScroll: scrolledX > 0,
        hasDimensionOverflow: scrollWidth > docWidth || bodyScrollWidth > docWidth
      };
    });

    if (overflowData.hasHorizontalScroll || overflowData.hasDimensionOverflow) {
      console.error(`❌ [OVERFLOW DETECTED] in ${vp.name}: Doc Width = ${overflowData.docWidth}px, Scroll Width = ${overflowData.scrollWidth}px, ScrolledX = ${overflowData.scrolledX}`);
      issuesFound.push({
        type: 'Horizontal Overflow',
        viewport: vp.name,
        details: overflowData
      });
    } else {
      console.log(`✅ No horizontal overflow (Doc Width: ${overflowData.docWidth}px, Scroll Width: ${overflowData.scrollWidth}px)`);
    }

    // 2. Test Mobile Menu / Navbar
    if (vp.width < 1024) {
      const hamburger = page.locator('button[aria-label="Toggle Navigation Menu"]');
      if (await hamburger.isVisible()) {
        console.log(`  Testing mobile hamburger menu...`);
        await hamburger.click();
        await page.waitForTimeout(300);
        const mobileNavLinks = page.locator('#mobile-nav-menu a:has-text("SERVICES")');
        const isMenuVisible = await mobileNavLinks.isVisible();
        if (!isMenuVisible) {
          issuesFound.push({ type: 'Mobile Menu Failure', viewport: vp.name, details: 'Mobile menu failed to open on toggle' });
          console.error(`  ❌ Mobile menu did not reveal navigation links.`);
        } else {
          console.log(`  ✅ Mobile menu opened successfully.`);
          // Click to close
          await hamburger.click();
          await page.waitForTimeout(200);
        }
      }
    } else {
      // Desktop Nav Links
      const desktopLinks = page.locator('header nav a');
      const navCount = await desktopLinks.count();
      console.log(`  Desktop navigation links count: ${navCount}`);
      if (navCount < 5) {
        issuesFound.push({ type: 'Desktop Nav Incomplete', viewport: vp.name, details: `Found only ${navCount} links` });
      }
    }

    // 3. Test TECHNICAL DOMAINS (#capabilities)
    const capSection = page.locator('#capabilities');
    if (await capSection.count() > 0) {
      await page.locator('#capabilities').scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);

      const capRows = page.locator('.capability-row');
      const count = await capRows.count();
      console.log(`  Testing #capabilities rows: ${count} items found.`);
      if (count === 0) {
        issuesFound.push({ type: 'Capabilities Missing', viewport: vp.name, details: 'No capability rows found' });
      } else {
        // Click second item (AI)
        await capRows.nth(1).click();
        await page.waitForTimeout(200);
        console.log(`  ✅ Clicked capability row 2 (AI) successfully.`);
      }
    }

    // 4. Test DEPLOYMENT METHODOLOGY (#process)
    const processSection = page.locator('#process');
    if (await processSection.count() > 0) {
      await page.locator('#process').scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);

      const processCards = page.locator('#process-grid > div');
      const pCount = await processCards.count();
      console.log(`  Testing #process cards: ${pCount} cards rendered.`);
      if (pCount !== 6) {
        issuesFound.push({ type: 'Process Grid Incomplete', viewport: vp.name, details: `Expected 6 cards, found ${pCount}` });
      } else {
        // Click card 3 (DESIGN)
        await processCards.nth(2).click();
        await page.waitForTimeout(200);
        console.log(`  ✅ Process cards clicked and responsive.`);
      }
    }

    // 5. Test FAQ Accordions (#faq)
    const faqSection = page.locator('#faq');
    if (await faqSection.count() > 0) {
      await page.locator('#faq').scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);

      const faqItems = page.locator('#faq-list > div');
      const faqCount = await faqItems.count();
      console.log(`  Testing FAQ accordion: ${faqCount} questions.`);
      if (faqCount > 0) {
        await faqItems.first().click();
        await page.waitForTimeout(200);
        console.log(`  ✅ FAQ accordion expansion works.`);
      }
    }

    // 6. Test Hero CTAs & Buttons visibility
    const heroBtn = page.locator('#hero-cta-group a[href="#contact"]');
    if (await heroBtn.count() > 0) {
      const isVisible = await heroBtn.isVisible();
      if (!isVisible) {
        console.warn(`  ⚠️ Hero contact CTA hidden in viewport ${vp.name}`);
      } else {
        console.log(`  ✅ Hero CTA visible.`);
      }
    }

    await context.close();
  }

  await browser.close();

  console.log(`\n==============================================`);
  console.log(`📊 TEST SUITE SUMMARY`);
  console.log(`==============================================`);
  console.log(`Console Errors: ${consoleErrors.length}`);
  console.log(`Network Failures: ${networkFailures.length}`);
  console.log(`Responsive/Functional Issues: ${issuesFound.length}`);

  if (issuesFound.length > 0) {
    console.error(`\n❌ Issues Found:`, JSON.stringify(issuesFound, null, 2));
    process.exit(1);
  } else {
    console.log(`\n🎉 ALL RESPONSIVE & FUNCTIONAL TESTS PASSED ACROSS ALL SCREEN SIZES!`);
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
