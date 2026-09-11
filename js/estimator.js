/**
 * VerHost - Project Scope & Cost Estimator
 * Calculates real-time engineering estimates and syncs with the contact inquiry form.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjectEstimator();
});

function initProjectEstimator() {
  const estimatorContainer = document.querySelector('#projectEstimator');
  if (!estimatorContainer) return;

  const serviceChoices = estimatorContainer.querySelectorAll('[data-service]');
  const scaleChoices = estimatorContainer.querySelectorAll('[data-scale]');
  const timelineChoices = estimatorContainer.querySelectorAll('[data-timeline]');
  const addonChoices = estimatorContainer.querySelectorAll('[data-addon]');

  const priceVal = estimatorContainer.querySelector('#estimatePrice');
  const durationVal = estimatorContainer.querySelector('#estimateDuration');
  const applyBtn = estimatorContainer.querySelector('#applyEstimateBtn');

  // Pricing Matrix Base (USD)
  const serviceRates = {
    'web': 1800,
    'ads': 950,
    'posters': 650,
    'analytics': 1500,
    'ml': 2800,
    'chatbot': 1900
  };

  const scaleMultipliers = {
    'starter': 1.0,
    'growth': 1.8,
    'enterprise': 3.2
  };

  const timelineMultipliers = {
    'standard': 1.0,
    'expedited': 1.3
  };

  const addonRates = {
    'sla': 450,
    'hipaa': 850,
    'vector': 600
  };

  function calculate() {
    let baseSum = 0;
    const selectedServices = [];

    serviceChoices.forEach(c => {
      if (c.classList.contains('selected')) {
        const key = c.getAttribute('data-service');
        baseSum += serviceRates[key] || 0;
        selectedServices.push(c.querySelector('.choice-title')?.textContent.trim() || key);
      }
    });

    if (baseSum === 0) baseSum = 1800; // default baseline

    let scaleMult = 1.0;
    let selectedScale = 'Growth Platform';
    scaleChoices.forEach(c => {
      if (c.classList.contains('selected')) {
        const key = c.getAttribute('data-scale');
        scaleMult = scaleMultipliers[key] || 1.0;
        selectedScale = c.querySelector('.choice-title')?.textContent.trim() || key;
      }
    });

    let timeMult = 1.0;
    let baseWeeks = 4;
    timelineChoices.forEach(c => {
      if (c.classList.contains('selected')) {
        const key = c.getAttribute('data-timeline');
        timeMult = timelineMultipliers[key] || 1.0;
        if (key === 'expedited') baseWeeks = 2;
      }
    });

    let addonsSum = 0;
    addonChoices.forEach(c => {
      if (c.classList.contains('selected')) {
        const key = c.getAttribute('data-addon');
        addonsSum += addonRates[key] || 0;
      }
    });

    const total = Math.round((baseSum * scaleMult * timeMult) + addonsSum);
    const durationWeeks = Math.max(2, Math.round(baseWeeks * (scaleMult > 2 ? 1.5 : 1)));

    if (priceVal) priceVal.textContent = `$${total.toLocaleString()}`;
    if (durationVal) durationVal.textContent = `Est. ${durationWeeks}-${durationWeeks + 2} Weeks`;

    return { total, durationWeeks, selectedServices, selectedScale };
  }

  // Bind single-choice groups
  function setupChoiceGroup(group, allowMulti = false) {
    group.forEach(el => {
      el.addEventListener('click', () => {
        if (!allowMulti) {
          group.forEach(other => other.classList.remove('selected'));
          el.classList.add('selected');
        } else {
          el.classList.toggle('selected');
        }
        calculate();
      });
    });
  }

  setupChoiceGroup(serviceChoices, true);
  setupChoiceGroup(scaleChoices, false);
  setupChoiceGroup(timelineChoices, false);
  setupChoiceGroup(addonChoices, true);

  // Initialize calculation
  calculate();

  // "Apply to Form" handler
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const { total, durationWeeks, selectedServices, selectedScale } = calculate();
      const messageField = document.querySelector('#contactForm [name="message"]');
      const serviceSelect = document.querySelector('#contactForm [name="service"]');

      if (messageField) {
        const autoSummary = `[Estimated Scope via Calculator: $${total.toLocaleString()} (~${durationWeeks} wks)]\n` +
          `Services: ${selectedServices.join(', ')}\n` +
          `Tier: ${selectedScale}\n` +
          `I would like to discuss this technical scope with VerHost.`;
        messageField.value = autoSummary;
      }

      if (serviceSelect && selectedServices.length > 0) {
        serviceSelect.value = 'consultation';
      }

      window.showToast('Calculator parameters applied to your inquiry form below!');
      document.querySelector('#contactForm')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}
