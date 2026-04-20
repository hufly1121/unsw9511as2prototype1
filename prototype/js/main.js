/* ============================================================
   Consumer Rights Hub — Main JavaScript
   COMP9511 Assignment 2 Prototype
   ============================================================ */

/* ---------- Accessibility Settings ---------- */
(function () {
  const body = document.body;

  // Load saved preferences
  const savedContrast  = localStorage.getItem('crh-contrast');
  const savedTextSize  = localStorage.getItem('crh-textsize');

  if (savedContrast === 'high')  body.classList.add('high-contrast');
  if (savedTextSize === 'lg')    body.classList.add('text-lg');
  if (savedTextSize === 'xl')    body.classList.add('text-xl');

  // Update button states on load
  function syncA11yButtons() {
    const hcBtn   = document.getElementById('btn-contrast');
    const szBtns  = document.querySelectorAll('.a11y-btn[data-size]');
    if (hcBtn) hcBtn.classList.toggle('active', body.classList.contains('high-contrast'));
    szBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.size === localStorage.getItem('crh-textsize'));
    });
    // Sync settings page toggles/buttons if present
    const settingContrast = document.getElementById('setting-contrast');
    if (settingContrast) settingContrast.checked = body.classList.contains('high-contrast');
    const settingSizes = document.querySelectorAll('.font-size-btn');
    settingSizes.forEach(b => {
      b.classList.toggle('active', b.dataset.size === (localStorage.getItem('crh-textsize') || 'default'));
    });
  }

  window.toggleContrast = function () {
    body.classList.toggle('high-contrast');
    localStorage.setItem('crh-contrast', body.classList.contains('high-contrast') ? 'high' : 'normal');
    syncA11yButtons();
  };

  window.setTextSize = function (size) {
    body.classList.remove('text-lg', 'text-xl');
    if (size === 'lg') body.classList.add('text-lg');
    if (size === 'xl') body.classList.add('text-xl');
    localStorage.setItem('crh-textsize', size === 'default' ? '' : size);
    syncA11yButtons();
  };

  document.addEventListener('DOMContentLoaded', syncA11yButtons);
})();


/* ---------- Multi-Step Rights Checker ---------- */
window.RightsChecker = (function () {
  let currentStep = 1;
  const totalSteps = 4;

  function updateUI() {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(el => {
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
    });
    // Show current step
    const active = document.getElementById('step-' + currentStep);
    if (active) {
      active.style.display = 'block';
      active.setAttribute('aria-hidden', 'false');
      active.querySelector('h2, h3')?.focus?.();
    }

    // Progress bar
    const fill = document.getElementById('progress-fill');
    const label = document.getElementById('progress-label');
    if (fill) fill.style.width = ((currentStep - 1) / totalSteps * 100) + '%';
    if (label) label.textContent = 'Step ' + currentStep + ' of ' + totalSteps;

    // Step circles
    document.querySelectorAll('.step-circle').forEach((el, i) => {
      el.classList.remove('active', 'done');
      if (i + 1 === currentStep) el.classList.add('active');
      if (i + 1 < currentStep)  el.classList.add('done');
    });
    document.querySelectorAll('.step-label').forEach((el, i) => {
      el.classList.remove('active', 'done');
      if (i + 1 === currentStep) el.classList.add('active');
      if (i + 1 < currentStep)  el.classList.add('done');
    });
    document.querySelectorAll('.step-connector').forEach((el, i) => {
      el.classList.toggle('done', i + 1 < currentStep);
    });

    // Back button
    const backBtn = document.getElementById('btn-back');
    if (backBtn) backBtn.style.visibility = currentStep > 1 ? 'visible' : 'hidden';
  }

  function next() {
    if (currentStep < totalSteps) {
      currentStep++;
      updateUI();
    } else {
      // Navigate to result page
      window.location.href = 'result.html';
    }
  }

  function back() {
    if (currentStep > 1) { currentStep--; updateUI(); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('step-1')) {
      updateUI();
      // Auto-select first option in each step for demo
      document.querySelectorAll('.wizard-step').forEach(step => {
        const items = step.querySelectorAll('.choice-item');
        if (items.length) items[0].classList.add('selected');
        const radios = step.querySelectorAll('input[type="radio"]');
        if (radios.length) radios[0].checked = true;
      });
    }
  });

  return { next, back };
})();


/* ---------- Choice Card Interaction ---------- */
document.addEventListener('DOMContentLoaded', function () {
  // Radio choice items
  document.querySelectorAll('.choice-item').forEach(item => {
    item.addEventListener('click', function () {
      const name = item.querySelector('input')?.name;
      if (name) {
        document.querySelectorAll(`.choice-item input[name="${name}"]`).forEach(r => {
          r.closest('.choice-item')?.classList.remove('selected');
        });
      }
      item.classList.add('selected');
      const radio = item.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Issue category cards
  document.querySelectorAll('.issue-card').forEach(card => {
    card.addEventListener('click', function () {
      document.querySelectorAll('.issue-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // Accordion items
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function () {
      const body = header.nextElementSibling;
      const isOpen = header.classList.contains('open');
      header.classList.toggle('open', !isOpen);
      body?.classList.toggle('open', !isOpen);
    });
  });

  // Pathway toggles
  document.querySelectorAll('.pathway-header').forEach(header => {
    header.addEventListener('click', function () {
      const body = header.nextElementSibling;
      if (body) body.classList.toggle('hidden');
      const chevron = header.querySelector('.chevron');
      if (chevron) chevron.textContent = body?.classList.contains('hidden') ? '▼' : '▲';
    });
  });
});


/* ---------- Accessibility Settings Page ---------- */
document.addEventListener('DOMContentLoaded', function () {
  const contrastToggle = document.getElementById('setting-contrast');
  if (contrastToggle) {
    contrastToggle.addEventListener('change', function () {
      window.toggleContrast();
    });
  }
});
