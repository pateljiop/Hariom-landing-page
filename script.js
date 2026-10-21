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

  // Build Atlas: project connections are explicit content, not simulated live data.
  const atlas = document.querySelector('#build-atlas-interaction');
  if (atlas) {
    const entries = {
      builder: {category:'START HERE / 00',title:'The builder is the connection.',description:'I like turning messy ideas into things people can try. Each project explores a different angle: useful tools, controlled automation, or showing the work honestly.',question:'Can I make an idea useful, understandable, and real?',link:'#projects',label:'Explore the projects'},
      haryomix: {category:'PRODUCT / 01',title:'Make useful tools easier to reach.',description:'Haryomix explores a student-focused digital workspace: bringing study and productivity utilities together. Its scope should be judged by what actually works on the live site.',question:'Can one focused workspace reduce the friction of everyday study tasks?',link:'https://haryomix.eu.cc',label:'Visit Haryomix ↗'},
      hariomai: {category:'AUTOMATION / 02',title:'Give automation guardrails.',description:'Hariom AI explores a Windows-first personal assistant with tool use, explicit approvals for risky actions, and verification after execution. The important part is controlled action—not just a convincing chat.',question:'How can an assistant act usefully while keeping the human in control?',link:'https://github.com/pateljiop/hariom-ai',label:'Inspect the repository ↗'},
      portfolio: {category:'IDENTITY / 03',title:'Show the work behind the work.',description:'This page is itself an experiment: make the developer, decisions, projects, and unfinished edges visible without pretending to be an agency or a finished startup.',question:'Can a portfolio feel like a living workbench rather than a static résumé?',link:'https://github.com/pateljiop/Hariom-landing-page',label:'Explore this repository ↗'},
      principle: {category:'METHOD / 04',title:'Build. Verify. Be honest.',description:'A feature is not finished because a button looks right. It should respond, handle edge cases, work on a phone, and clearly communicate its limits.',question:'What evidence shows that this feature works outside the mockup?',link:'#lab',label:'Try the Build Lab'}
    };
    const buttons = [...atlas.querySelectorAll('[data-atlas]')];
    buttons.forEach(button => button.addEventListener('click', () => {
      const item = entries[button.dataset.atlas];
      if (!item) return;
      buttons.forEach(node => {
        const active = node === button;
        node.classList.toggle('active', active);
        node.setAttribute('aria-pressed', String(active));
      });
      atlas.querySelector('#atlas-category').textContent = item.category;
      atlas.querySelector('#atlas-title').textContent = item.title;
      atlas.querySelector('#atlas-description').textContent = item.description;
      atlas.querySelector('#atlas-question').textContent = item.question;
      const link = atlas.querySelector('#atlas-link');
      link.href = item.link;
      link.textContent = item.label;
      const arrow = document.createElement('span');
      arrow.textContent = '↗';
      link.append(' ', arrow);
      if (item.link.startsWith('https://')) {
        link.target = '_blank';
        link.rel = 'noreferrer';
      } else {
        link.removeAttribute('target');
        link.removeAttribute('rel');
      }
    }));
  }

})();