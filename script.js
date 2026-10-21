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


  const progressBar = document.querySelector('.scroll-progress span');
  const updateProgress = () => {
    if (!progressBar) return;
    const doc = document.documentElement;
    const available = doc.scrollHeight - window.innerHeight;
    const percentage = available > 0 ? (window.scrollY / available) * 100 : 0;
    progressBar.style.width = Math.min(100, Math.max(0, percentage)) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();


  // Live landing-page playground: business type and art direction are independent controls.
  const playground = document.querySelector('#site-playground');
  if (playground) {
    const stage = playground.querySelector('.playground-stage');
    const siteButtons = [...playground.querySelectorAll('.play-option')];
    const energyButtons = [...playground.querySelectorAll('.energy-option')];
    const copy = {
      product: {brand:'NEXORA', eyebrow:'A BETTER WAY TO BUILD', first:'Ideas deserve', second:'better tools.', description:'A product experience that makes the value clear before the second scroll.', cta:'MAKE IT REAL', tag:"BUILT FOR<br>WHAT'S NEXT"},
      brand: {brand:'GOODFORM', eyebrow:'OBJECTS FOR EVERY DAY', first:'Make room for', second:'good things.', description:'A brand world with its own point of view, built to turn browsing into belonging.', cta:'FIND YOUR THING', tag:'MADE WITH<br>INTENTION'},
      service: {brand:'FORM / STUDIO', eyebrow:'THOUGHTFUL BY DESIGN', first:'Expertise, made', second:'impossible to miss.', description:'A clear story that turns what you know into why the right people should choose you.', cta:'START A PROJECT', tag:'BUILT AROUND<br>YOUR EXPERTISE'}
    };
    const updateStage = () => {
      const data = copy[stage.dataset.site] || copy.product;
      stage.querySelector('.stage-brand').innerHTML = data.brand + '<span>®</span>';
      stage.querySelector('.stage-eyebrow').textContent = data.eyebrow;
      stage.querySelector('.stage-title').innerHTML = data.first + '<br><em>' + data.second + '</em>';
      stage.querySelector('.stage-description').textContent = data.description;
      stage.querySelector('.stage-cta').innerHTML = data.cta + ' <span>↗</span>';
      stage.querySelector('.stage-art-tag').innerHTML = data.tag;
      const index = stage.dataset.site === 'product' ? '001' : stage.dataset.site === 'brand' ? '002' : '003';
      stage.querySelector('.stage-bottom span').textContent = 'CONCEPT PREVIEW / ' + index;
    };
    siteButtons.forEach(button => button.addEventListener('click', () => {
      stage.dataset.site = button.dataset.site;
      siteButtons.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
      updateStage();
    }));
    energyButtons.forEach(button => button.addEventListener('click', () => {
      stage.dataset.energy = button.dataset.energy;
      energyButtons.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    }));
  }

})();
