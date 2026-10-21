(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('open', !open);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      nav.classList.remove('open');
    }));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        nav.classList.remove('open');
      }
    });
  }

  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  filters.forEach((button) => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    cards.forEach((card) => {
      const visible = category === 'all' || card.dataset.category === category;
      card.hidden = !visible;
    });
  }));

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  const revealTargets = document.querySelectorAll('.work-card,.service-list article,.process-steps>div');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((target) => {
      target.classList.add('will-reveal');
      observer.observe(target);
    });
  }

  // Live art-direction switcher: one set of content, three visual systems.
  const lab = document.querySelector('.lab-shell');
  const moodButtons = [...document.querySelectorAll('.mood-button')];
  const editionNumber = document.querySelector('.lab-edition-number');
  moodButtons.forEach((button) => button.addEventListener('click', () => {
    if (!lab) return;
    const mood = button.dataset.mood;
    lab.dataset.mood = mood;
    moodButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    if (editionNumber) editionNumber.textContent = mood === 'signal' ? '1' : mood === 'form' ? '2' : '3';
  }));


  // Project brief builder: preview answers locally and prepare a mail draft only on submit.
  const briefForm = document.querySelector('#project-brief');
  if (briefForm) {
    const fields = Object.fromEntries(['business','goal','style','website','budget','details'].map((name) => [name, briefForm.elements.namedItem(name)]));
    const title = document.querySelector('#brief-preview-title');
    const goalPreview = document.querySelector('#brief-preview-goal');
    const stylePreview = document.querySelector('#brief-preview-style');
    const shortStyle = (value) => {
      if (!value) return 'Open to ideas';
      if (value.startsWith('Signal')) return 'Signal / Bold';
      if (value.startsWith('Form')) return 'Form / Editorial';
      if (value.startsWith('Play')) return 'Play / Expressive';
      return 'Open to ideas';
    };
    const refreshBrief = () => {
      const business = fields.business.value.trim();
      if (title) title.innerHTML = business ? escapeBrief(business) + '<br><em>takes shape.</em>' : 'A new idea<br><em>takes shape.</em>';
      if (goalPreview) goalPreview.textContent = fields.goal.value || 'Not chosen yet';
      if (stylePreview) stylePreview.textContent = shortStyle(fields.style.value);
    };
    const escapeBrief = (value) => value.replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    Object.values(fields).forEach((field) => field.addEventListener('input', refreshBrief));
    briefForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!briefForm.reportValidity()) return;
      const lines = [
        'Hi Hariom,',
        '',
        'I would like to discuss a website project.',
        '',
        'What I am building: ' + fields.business.value.trim(),
        'Main goal: ' + fields.goal.value,
        'Visual direction: ' + fields.style.value,
        fields.website.value.trim() ? 'Current website: ' + fields.website.value.trim() : '',
        fields.budget.value ? 'Budget range: ' + fields.budget.value : '',
        fields.details.value.trim() ? 'Additional details: ' + fields.details.value.trim() : '',
        '',
        'Please let me know the next step.',
      ].filter(Boolean);
      const subject = 'Website project enquiry — ' + fields.business.value.trim();
      window.location.href = 'mailto:hariompatel73@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    });
  }

})();
