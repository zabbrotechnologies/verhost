/**
 * VerHost - Portfolio & Case Studies Interactive Filtering & Modal Inspector
 */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolio();
});

function initPortfolio() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const projectCards = document.querySelectorAll('[data-category]');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active filter button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || category.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.3s ease';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Project Detail Modals
  const inspectBtns = document.querySelectorAll('.inspect-case-btn');
  inspectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-title') || 'Case Study Architecture';
      const desc = btn.getAttribute('data-desc') || 'Full operational telemetry and deployment blueprint.';
      const metric = btn.getAttribute('data-metric') || '300% efficiency gain';
      openCaseModal(title, desc, metric);
    });
  });
}

function openCaseModal(title, description, metric) {
  let modalOverlay = document.querySelector('.case-modal-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'mobile-drawer-overlay case-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="card-glass" style="max-width: 600px; width: 90%; margin: auto; padding: var(--space-xl); position: relative; border: 1px solid var(--color-border-bright);">
        <button class="modal-close-btn" style="position: absolute; top: 16px; right: 16px; color: var(--color-text-secondary); cursor: pointer;">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="chip chip-emerald" style="margin-bottom: var(--space-sm);">CASE STUDY BLUEPRINT</div>
        <h3 class="modal-case-title headline-sm" style="color: var(--color-text-primary); margin-bottom: var(--space-sm);"></h3>
        <p class="modal-case-desc body-md" style="margin-bottom: var(--space-md);"></p>
        <div style="padding: var(--space-md); background: var(--color-surface-container-lowest); border-radius: var(--radius-xl); border: 1px solid var(--color-border); margin-bottom: var(--space-lg);">
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-primary-light);">VERIFIED COMMERCIAL METRIC:</div>
          <div class="modal-case-metric" style="font-family: var(--font-headline); font-size: 1.25rem; font-weight: 700; color: #ffffff; margin-top: 4px;"></div>
        </div>
        <div style="display: flex; gap: var(--space-md);">
          <a href="contact.html" class="btn btn-primary btn-sm">Build Similar System</a>
          <button class="btn btn-secondary btn-sm modal-dismiss">Dismiss</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    const close = () => {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    modalOverlay.querySelector('.modal-close-btn').addEventListener('click', close);
    modalOverlay.querySelector('.modal-dismiss').addEventListener('click', close);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) close();
    });
  }

  modalOverlay.querySelector('.modal-case-title').textContent = title;
  modalOverlay.querySelector('.modal-case-desc').textContent = description;
  modalOverlay.querySelector('.modal-case-metric').textContent = metric;

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
