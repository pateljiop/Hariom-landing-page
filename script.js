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


  // Builder DNA: local-only quiz with a reproducible, shareable result URL.
  const dna = document.querySelector('#builder-dna-app');
  if (dna) {
    const questions = [...dna.querySelectorAll('.p-dna-question')];
    const answers = [null, null, null];
    let step = 0;
    const archetypes = {
      spark: {title:'The Chaos Prototyper',symbol:'⚡',code:'DNA / SPARK',description:'You learn by making. Your superpower is turning “what if?” into something people can actually try. Your side quest: ship the tiny version before adding 17 more features.',traits:['IDEA → BUILD','HIGH MOMENTUM','ITERATE FAST'],share:'CHAOS PROTOTYPER'},
      map: {title:'The Systems Cartographer',symbol:'⌘',code:'DNA / MAP',description:'You see the connections other people miss. You turn a pile of moving parts into a system that makes sense. Your side quest: start before the map becomes a whole universe.',traits:['SEE THE SYSTEM','STRUCTURE FIRST','CONNECT DOTS'],share:'SYSTEMS CARTOGRAPHER'},
      break: {title:'The Bug Archaeologist',symbol:'⌕',code:'DNA / DEBUG',description:'You are not scared of the weird edge case. You dig until the real cause shows up. Your side quest: remember that “works on my machine” is a hypothesis, not proof.',traits:['QUESTION EVERYTHING','TRACE THE CAUSE','VERIFY TWICE'],share:'BUG ARCHAEOLOGIST'}
    };
    const resultPanel = dna.querySelector('#dna-result');
    const showStep = () => {
      questions.forEach((q,i) => { q.hidden = i !== step; });
      dna.querySelector('#dna-progress-label').textContent = 'YOUR BUILD DNA / 0'+(step+1)+' OF 03';
      dna.querySelector('#dna-progress-count').textContent = answers.filter(Boolean).length+'/3';
      dna.querySelector('#dna-back').disabled = step === 0;
      dna.querySelector('#dna-next').disabled = !answers[step];
      dna.querySelector('#dna-next').innerHTML = step === 2 ? 'Reveal my type <span>✳</span>' : 'Lock it in <span>↗</span>';
    };
    const showResult = (type, updateUrl = true) => {
      const a = archetypes[type];
      if (!a) return;
      dna.dataset.result = type;
      dna.querySelector('#dna-result-code').textContent = a.code;
      dna.querySelector('#dna-result-art span').textContent = a.symbol;
      dna.querySelector('#dna-result-title').textContent = a.title;
      dna.querySelector('#dna-result-description').textContent = a.description;
      const traits = dna.querySelector('#dna-result-traits');
      traits.replaceChildren(...a.traits.map(label => { const s=document.createElement('span'); s.textContent=label; return s; }));
      dna.querySelector('#dna-share').disabled = false;
      dna.querySelector('#dna-share-status').textContent = 'Result unlocked. Copy the card link and send it to your group chat.';
      resultPanel.dataset.type = type;
      if (updateUrl && window.history && window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.set('dna',type);
        window.history.replaceState({},'',url.toString());
      }
      resultPanel.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
    };
    questions.forEach((question,index) => {
      question.querySelectorAll('[data-value]').forEach(button => button.addEventListener('click',() => {
        answers[index] = button.dataset.value;
        question.querySelectorAll('[data-value]').forEach(option => {
          const active=option===button;
          option.setAttribute('aria-pressed',String(active));
        });
        showStep();
      }));
    });
    dna.querySelector('#dna-back').addEventListener('click',() => { if(step>0){step--;showStep();} });
    dna.querySelector('#dna-next').addEventListener('click',() => {
      if(!answers[step]) return;
      if(step<2){step++;showStep();return;}
      const counts={spark:0,map:0,break:0};
      answers.forEach(answer=>counts[answer]++);
      const max=Math.max(...Object.values(counts));
      const tied=Object.keys(counts).filter(key=>counts[key]===max);
      // Deterministic tie-break based on the final answer, so identical answers always share the same result.
      const type=tied.includes(answers[2])?answers[2]:tied[0];
      showResult(type);
    });
    dna.querySelector('#dna-share').addEventListener('click',async() => {
      const type=resultPanel.dataset.type;
      if(!type) return;
      const url=new URL(window.location.href);
      url.searchParams.set('dna',type);
      const text='My builder DNA is '+archetypes[type].title+'. What’s yours? '+url.toString();
      try {
        if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
        else {
          const field=document.createElement('textarea');field.value=text;field.setAttribute('readonly','');field.style.position='fixed';field.style.opacity='0';document.body.appendChild(field);field.select();
          const copied=document.execCommand('copy');field.remove();if(!copied) throw new Error('Clipboard unavailable');
        }
        dna.querySelector('#dna-share-status').textContent='Copied. Drop it in the group chat 👀';
      } catch {
        dna.querySelector('#dna-share-status').textContent='Copy blocked by this browser. Share this page URL instead: '+url.toString();
      }
    });
    dna.querySelector('#dna-restart').addEventListener('click',() => {
      answers.fill(null);step=0;
      questions.forEach(q=>q.querySelectorAll('[data-value]').forEach(b=>b.setAttribute('aria-pressed','false')));
      dna.removeAttribute('data-result');resultPanel.removeAttribute('data-type');
      dna.querySelector('#dna-result-code').textContent='NOT GENERATED';
      dna.querySelector('#dna-result-art span').textContent='?';
      dna.querySelector('#dna-result-title').textContent='The plot twist is you.';
      dna.querySelector('#dna-result-description').textContent='Answer three questions to reveal your builder type.';
      dna.querySelector('#dna-result-traits').replaceChildren(...['CURIOUS','IN PROGRESS','UNCLASSIFIED'].map(label=>{const s=document.createElement('span');s.textContent=label;return s;}));
      dna.querySelector('#dna-share').disabled=true;
      dna.querySelector('#dna-share-status').textContent='Your result card will appear here.';
      if(window.history && window.history.replaceState){const url=new URL(window.location.href);url.searchParams.delete('dna');window.history.replaceState({},'',url.toString());}
      showStep();
    });
    const sharedType = new URLSearchParams(window.location.search).get('dna');
    if (archetypes[sharedType]) {
      showResult(sharedType,false);
      dna.querySelector('#dna-result-share');
      dna.querySelector('#dna-share-status').textContent='Someone shared this builder DNA. Take the quiz to find your own.';
    }
    showStep();
  }

})();