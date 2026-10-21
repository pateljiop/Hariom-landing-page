(() => {
  const menuButton = document.querySelector('.p-menu');
  const nav = document.querySelector('.p-links');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('open', !isOpen);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        nav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
      }
    });
  }

  const year = document.querySelector('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const progress = document.querySelector('#reading-progress');
  const updateProgress = () => {
    if (!progress) return;
    const root = document.documentElement;
    const max = root.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  const lab = document.querySelector('#signal-lab');
  if (lab) {
    const output = lab.querySelector('.p-lab-output');
    const buttons = [...lab.querySelectorAll('.p-mode')];
    const states = {
      focus: {name:'FOCUS',headline:'One thing<br>at a time.',description:'Reduce the noise. Choose the next useful action. Finish a small loop.',command:'$ focus --one-task',index:'STATE 01 / 03',symbol:'⌁'},
      explore: {name:'EXPLORE',headline:'Follow the<br><em>interesting</em> thread.',description:'Ask a better question. Try a small experiment. Keep the unexpected result.',command:'$ explore --curious',index:'STATE 02 / 03',symbol:'✳'},
      debug: {name:'DEBUG',headline:'Find the<br>actual cause.',description:'Inspect the state. Reproduce the issue. Change one thing and verify the result.',command:'$ debug --trace',index:'STATE 03 / 03',symbol:'⌘'}
    };
    buttons.forEach(button => button.addEventListener('click', () => {
      const mode = button.dataset.mode;
      const state = states[mode];
      if (!state) return;
      output.dataset.mode = mode;
      buttons.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      lab.querySelector('#mode-name').textContent = state.name;
      lab.querySelector('#mode-headline').innerHTML = state.headline;
      lab.querySelector('#mode-description').textContent = state.description;
      lab.querySelector('#mode-command').textContent = state.command;
      lab.querySelector('#mode-index').textContent = state.index;
      lab.querySelector('.p-output-symbol').textContent = state.symbol;
    }));
  }
})();