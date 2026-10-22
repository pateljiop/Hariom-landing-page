(() => {

  // Luxury entry room: choose a direction, then apply it to the whole portfolio.
  const entry = document.querySelector('#landing-entry');
  const entryOptions = document.querySelector('#entry-options');
  const enterButton = document.querySelector('#entry-enter');
  const defaultButton = document.querySelector('#entry-default');
  const gallery = document.querySelector('#template-grid');
  if (entry && entryOptions && enterButton && gallery) {
    const styleButtons = [...gallery.querySelectorAll('[data-template]')];
    let chosen = null;
    styleButtons.forEach(button => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'p-entry-option';
      option.dataset.launchTemplate = button.dataset.template;
      const number = button.querySelector('span')?.textContent || '';
      const name = button.querySelector('b')?.textContent || button.dataset.template;
      const description = button.querySelector('small')?.textContent || 'Explore this direction';
      option.innerHTML = '<span class="p-entry-option-no">' + number + '</span><span class="p-entry-option-copy"><b></b><small></small></span><span class="p-entry-option-arrow">↗</span>';
      option.querySelector('b').textContent = name;
      option.querySelector('small').textContent = description;
      option.addEventListener('click', () => {
        chosen = button.dataset.template;
        entryOptions.querySelectorAll('.p-entry-option').forEach(item => {
          const active = item === option;
          item.classList.toggle('is-selected', active);
          item.setAttribute('aria-pressed', String(active));
        });
        enterButton.disabled = false;
        enterButton.querySelector('span').textContent = '↗';
        enterButton.dataset.chosen = chosen;
      });
      option.setAttribute('aria-pressed', 'false');
      entryOptions.append(option);
    });
    const launch = id => {
      if (!id || !styleButtons.some(button => button.dataset.template === id)) return;
      // Each selection is a real, dedicated HTML page with its own theme and hero content.
      window.location.href = 'worlds/' + encodeURIComponent(id) + '.html';
    };
    enterButton.addEventListener('click', () => launch(chosen));
    defaultButton?.addEventListener('click', () => launch('studio'));
    document.addEventListener('keydown', event => {
      if (!entry.hidden && event.key === 'Escape') { /* keep the selection deliberate */ event.preventDefault(); }
    });
  }

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

  // Build Quest: local decision simulator with trade-off explanations; no analytics or backend.
  const quest=document.querySelector('#build-quest-app');
  if(quest){
    const stages=[
      {question:"Your study tool's quiz generator fails the night before an exam. What do you do first?",context:'Users need a result now, but the root cause is not confirmed.',options:[
        {id:'inspect',title:'Reproduce the failure',detail:'Inspect the error and isolate the failing step.',trail:'Inspect first',impact:'Evidence reduces guesswork, but users may remain blocked while you investigate.'},
        {id:'fallback',title:'Ship a useful fallback',detail:'Offer a clear manual path while investigating.',trail:'Protect the user',impact:'You reduce immediate user pain; make the fallback limits clear.'},
        {id:'rewrite',title:'Rewrite the whole flow',detail:'Replace the integration before more users hit it.',trail:'Replace the flow',impact:'A broad rewrite before diagnosis can introduce new failures.'}]},
      {question:'You found the provider times out only on longer prompts. What is next?',context:'A quick fix could hide the symptom without solving the reliability issue.',options:[
        {id:'timeout',title:'Set a timeout and explain failure',detail:'Give users a retry path and log a safe diagnostic.',trail:'Make failure legible',impact:'Users understand what happened, but a timeout alone does not fix the bottleneck.'},
        {id:'retry',title:'Add bounded retries',detail:'Retry transient errors with a strict limit.',trail:'Retry carefully',impact:'Retries can recover transient errors; unbounded retries amplify load.'},
        {id:'remove',title:'Disable the unreliable mode',detail:'Keep the stable path until the fix is verified.',trail:'Reduce blast radius',impact:'You reduce repeated failures, at the cost of temporarily removing a feature.'}]},
      {question:'The patch seems fixed on your laptop. What earns the release?',context:'“It works for me” is a clue, not release evidence.',options:[
        {id:'test',title:'Test normal and failure paths',detail:'Verify success, timeout, empty input and retry behavior.',trail:'Verify edge cases',impact:'You gather stronger evidence across realistic paths.'},
        {id:'ship',title:'Ship to a small test group',detail:'Release gradually and watch for regressions.',trail:'Release gradually',impact:'A small rollout limits exposure if you can observe failures and roll back.'},
        {id:'announce',title:'Announce the fix immediately',detail:'Tell users it is fixed and move on.',trail:'Communicate quickly',impact:'Fast communication helps, but unverified claims can damage trust.'}]}
    ];
    const picks=[];let step=0;const result=quest.querySelector('#quest-result');
    const renderResult=()=>{
      const chosen=stages.map((s,i)=>s.options.find(o=>o.id===picks[i])).filter(Boolean);if(chosen.length!==3)return;
      result.dataset.complete='true';quest.querySelector('#quest-result-state').textContent='3 DECISIONS MADE';
      const evidence=chosen.filter(o=>['inspect','test'].includes(o.id)).length,user=chosen.filter(o=>['fallback','timeout'].includes(o.id)).length,risk=chosen.filter(o=>['remove','ship'].includes(o.id)).length;
      const profile=evidence>=2?'Evidence-led':user>=2?'User-first':risk>=2?'Risk-aware':'Trade-off explorer';
      quest.querySelector('#quest-result-mark').textContent=profile==='Evidence-led'?'⌕':profile==='User-first'?'♡':profile==='Risk-aware'?'⛨':'↔';
      quest.querySelector('#quest-result-title').textContent=profile+' builder';
      quest.querySelector('#quest-result-copy').textContent='Your choices leaned '+profile.toLowerCase()+'. This reflects this scenario, not a personality diagnosis. Strong engineering means revisiting trade-offs when evidence changes.';
      const trail=quest.querySelector('#quest-trail');trail.replaceChildren(...chosen.map((o,i)=>{const row=document.createElement('div'),n=document.createElement('span'),p=document.createElement('p');n.textContent='0'+(i+1);p.textContent=o.trail+' — '+o.impact;row.append(n,p);return row;}));
      quest.querySelector('#quest-share').disabled=false;quest.querySelector('#quest-share-status').textContent='Your trail is ready to copy and share.';
    };
    const render=()=>{
      const s=stages[step];quest.querySelector('#quest-step-label').textContent='INCIDENT / 0'+(step+1)+' OF 03';quest.querySelector('#quest-progress').textContent=picks.length+' decision'+(picks.length===1?'':'s');
      quest.querySelector('#quest-question').textContent=s.question;quest.querySelector('#quest-context').textContent=s.context;
      quest.querySelector('#quest-options').replaceChildren(...s.options.map((o,i)=>{const b=document.createElement('button'),n=document.createElement('span'),t=document.createElement('b'),d=document.createElement('small');b.type='button';b.dataset.choice=o.id;b.setAttribute('aria-pressed',String(picks[step]===o.id));n.textContent='0'+(i+1);t.textContent=o.title;d.textContent=o.detail;b.append(n,t,d);b.addEventListener('click',()=>{picks[step]=o.id;picks.length=step+1;render();});return b;}));
      quest.querySelector('#quest-back').disabled=step===0;quest.querySelector('#quest-next').disabled=!picks[step];quest.querySelector('#quest-next').textContent=step===2?'Reveal my build trail ↗':'Choose this path ↗';
      if(picks.length===3)renderResult();
    };
    quest.querySelector('#quest-back').addEventListener('click',()=>{if(step>0){step--;render();}});
    quest.querySelector('#quest-next').addEventListener('click',()=>{if(!picks[step])return;if(step<2){step++;render();}else renderResult();});
    quest.querySelector('#quest-share').addEventListener('click',async()=>{if(picks.length!==3)return;const summary='My Build Quest trail: '+picks.map((p,i)=>'Q'+(i+1)+' '+stages[i].options.find(o=>o.id===p).trail).join(' / ')+' — try it at '+location.href.split('#')[0]+'#build-quest';try{if(navigator.clipboard&&isSecureContext)await navigator.clipboard.writeText(summary);else{const f=document.createElement('textarea');f.value=summary;f.readOnly=true;f.style.position='fixed';f.style.opacity='0';document.body.appendChild(f);f.select();const ok=document.execCommand('copy');f.remove();if(!ok)throw Error('copy failed');}quest.querySelector('#quest-share-status').textContent='Copied! Compare your choices with a friend.';}catch{quest.querySelector('#quest-share-status').textContent='Clipboard unavailable. Your choices: '+picks.join(' → ')+'.';}});
    quest.querySelector('#quest-restart').addEventListener('click',()=>{picks.length=0;step=0;delete result.dataset.complete;quest.querySelector('#quest-result-state').textContent='IN PROGRESS';quest.querySelector('#quest-result-mark').textContent='↗';quest.querySelector('#quest-result-title').textContent='Make your first call.';quest.querySelector('#quest-result-copy').textContent='There is no universally perfect answer. The interesting part is what you optimize for and what risk you accept.';quest.querySelector('#quest-trail').replaceChildren(Object.assign(document.createElement('span'),{textContent:'Decision trail appears here.'}));quest.querySelector('#quest-share').disabled=true;quest.querySelector('#quest-share-status').textContent='Finish all three decisions to create a shareable summary.';render();});
    render();
  }

  // Quick Jump command palette: keyboard-accessible navigation, no external dependencies.
  const command=document.querySelector('#command-palette');
  if(command){
    const search=command.querySelector('#command-search'),items=[...command.querySelectorAll('[role="option"]')];
    const open=()=>{if(!command.open)command.showModal();search.value='';filter('');search.focus();};
    const close=()=>{if(command.open)command.close();};
    const filter=value=>{const term=value.trim().toLowerCase();let first=null;items.forEach(item=>{const show=(item.textContent+' '+item.dataset.command).toLowerCase().includes(term);item.hidden=!show;if(show&&!first)first=item;});if(first)first.setAttribute('tabindex','0');items.filter(item=>item!==first).forEach(item=>item.setAttribute('tabindex','-1'));};
    document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();open();}if(event.key==='Escape'&&command.open)close();});
    search.addEventListener('input',()=>filter(search.value));
    search.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();items.find(item=>!item.hidden)?.focus();}if(event.key==='Enter'){const first=items.find(item=>!item.hidden);if(first)first.click();}});
    items.forEach(item=>item.addEventListener('click',()=>close()));
    command.querySelector('#command-close').addEventListener('click',close);
    command.addEventListener('click',event=>{if(event.target===command)close();});
  }

  // Portfolio route selector inspired by viewer-specific portfolio journeys.
  const routeRoot=document.querySelector('#choose-route');
  if(routeRoot){
    const routes={
      recruiter:{overline:'YOUR 3-STOP TOUR',title:"The builder's work, without the fluff.",description:'Start with real projects, inspect one honest case study, then reach out if something clicks.',stops:[['projects','Projects','See what exists today'],['project-autopsy','Project Autopsy','Understand the decisions'],['contact','Contact','Talk about the work']]},
      developer:{overline:'UNDER THE HOOD',title:'Show me the decisions, not just the screenshots.',description:'Trace how ideas connect, explore the interactive lab, and inspect the trade-offs behind the builds.',stops:[['build-atlas','Build Atlas','Trace project connections'],['lab','Build Lab','Explore the interactions'],['project-autopsy','Project Autopsy','Read the evidence and limits']]},
      explorer:{overline:'PLAY YOUR WAY',title:'A portfolio with things to try.',description:'Find your builder style, make a few product calls, and leave with a trail you can share.',stops:[['builder-dna','Builder DNA','Find a playful archetype'],['build-quest','Build Quest','Make three decisions'],['notes','Field Notes','See what I am learning']]}
    };
    const title=routeRoot.querySelector('#route-title'),description=routeRoot.querySelector('#route-description'),overline=routeRoot.querySelector('#route-overline'),stops=routeRoot.querySelector('#route-stops'),buttons=[...routeRoot.querySelectorAll('[data-route]')];
    buttons.forEach(button=>button.addEventListener('click',()=>{
      const route=routes[button.dataset.route];if(!route)return;
      buttons.forEach(item=>{const active=item===button;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',String(active));});
      overline.textContent=route.overline;title.textContent=route.title;description.textContent=route.description;
      stops.replaceChildren(...route.stops.map(([id,label,hint],i)=>{const a=document.createElement('a'),n=document.createElement('span'),b=document.createElement('b'),small=document.createElement('small'),arrow=document.createElement('i');a.href='#'+id;n.textContent='0'+(i+1);b.textContent=label;small.textContent=hint;arrow.textContent='↘';a.append(n,b,small,arrow);return a;}));
    }));
  }

  // Landing Studio: eighteen selectable visual directions, all using the same verified portfolio content.
  // Landing Studio preview: derive options from the real HTML controls to avoid duplicated theme data.
  const templateGrid = document.querySelector('#template-grid');
  if (templateGrid) {
    const buttons = [...templateGrid.querySelectorAll('[data-template]')];
    const preview = document.querySelector('#template-preview');
    const fields = {
      count: document.querySelector('#template-count'),
      label: document.querySelector('#template-preview-label'),
      brand: document.querySelector('#template-brand'),
      eyebrow: document.querySelector('#template-eyebrow'),
      title: document.querySelector('#template-title'),
      description: document.querySelector('#template-description'),
      cta: document.querySelector('#template-cta'),
      footer: document.querySelector('#template-footer'),
      styleTitle: document.querySelector('#template-style-title'),
      styleDescription: document.querySelector('#template-style-description')
    };
    const concepts = {
      studio: ['H / BUILDS','INDEPENDENT BUILDER · PRAYAGRAJ','I make ideas\\ndo something.','Digital products, useful experiments, and small systems built with curiosity.','EXPLORE THE WORK ↗','HARIOM BUILDS / SELECTED WORK','A confident creative portfolio with bold typography and one strong accent.'],
      terminal: ['hariom@builds:~','SYSTEM READY · BUILD / TEST / SHIP','$ make ideas-work','Practical software, experiments and automation. Every change should earn its place.','OPEN PROJECTS ↗','SESSION COMPLETE / EXIT CODE 0','A developer-console direction with monospace type and command-line framing.'],
      editorial: ['HARIOM / JOURNAL','INDEPENDENT BUILDER · FIELD NOTES','Ideas deserve a\nbetter story.','A thoughtful record of digital products, learning and the decisions behind the work.','READ THE WORK ↗','FIELD NOTES / VOL. 01','Typography-led editorial styling with a calmer, print-inspired rhythm.'],
      brutalist: ['HARIOM BUILDS','NO AGENCY. JUST MAKING.','BUILD IT.\nMAKE IT REAL.','Projects, experiments and honest progress. No filler, no invented case studies.','SEE THE WORK ↗','BUILT IN PUBLIC / 2026','Hard edges, oversized type and bold high-contrast framing.'],
      cinema: ['H / ORIGINALS','A BUILDER IN PROGRESS','Every build\nhas a story.','From rough idea to working software: explore the process behind each project.','ROLL THE STORY ↗','AN INDEPENDENT PRODUCTION','A cinematic, poster-inspired direction with dramatic depth and warm highlights.'],
      minimal: ['HARIOM PATEL','DEVELOPER · BUILDER','Less noise.\nMore useful.','A small collection of real products and ideas, presented with clarity.','EXPLORE ↗','SELECTED WORK / 2026','Quiet luxury, generous whitespace and restrained decoration.'],
      playful: ['HARIOM BUILDS ✳','CURIOUS BY DEFAULT','Make a thing.\nLearn a lot.','Small experiments, useful tools and the joy of figuring things out.','LET’S EXPLORE ↗','MADE WHILE LEARNING','Soft shapes, friendly details and a brighter, more playful feel.'],
      retro: ['HARIOM.EXE','WELCOME BACK, BUILDER','Hello,\ninternet.','A retro-inspired window into projects, experiments and lessons learned.','START HERE ▶','SAVE POINT / PROJECTS','Nostalgic web styling, dashed borders and terminal-inspired typography.'],
      swiss: ['H / BUILDS','INDEPENDENT PRACTICE / 2026','Ideas need\na system.','A structured view of products, process and the decisions that make software useful.','VIEW INDEX ↗','INDEX 01—04 / PROJECTS · NOTES','Precise grid alignment and a strong information hierarchy.'],
      neon: ['HARIOM // LAB','EXPERIMENTAL SYSTEMS ONLINE','Curiosity\nafter dark.','AI experiments, automation and digital tools built at the edge of what I know.','ENTER THE LAB ↗','SIGNAL DETECTED · WORK IN PROGRESS','A dark technical atmosphere with electric accents.'],
      nature: ['hariom builds things','GROW SLOW · BUILD WITH CARE','Useful things,\nmade thoughtfully.','A human-first approach to building tools, learning systems and digital experiences.','MEET THE WORK ↗','GROWN THROUGH CURIOSITY','Warm tones, tactile corners and a grounded visual voice.'],
      dashboard: ['BUILD OS / OVERVIEW','WORKSPACE STATUS · ACTIVE','From idea\nto shipped.','A snapshot of projects, systems and experiments moving from concept to reality.','OPEN PROJECT BOARD ↗','PROJECTS / STATUS IS HONEST','A product dashboard aesthetic with compact labels and modular panels.'],
      magazine: ['MADE / BY HARIOM','THE MAKER ISSUE · NO. 001','The internet\nis my workshop.','A visual collection of experiments, products and lessons from building in public.','FLIP THROUGH ↗','FEATURE STORY / INDEPENDENT BUILDER','Editorial typography and asymmetric magazine-like framing.'],
      mono: ['HARIOM / FILE 001','BLACK · WHITE · WORK','Let the work\nspeak.','Useful products, clear decisions and honest progress—without the decoration.','OPEN THE FILE ↗','DOCUMENTED WORK / 001','Strict monochrome contrast and minimal ornament.'],
      pixel: ['HARIOM.EXE','PLAYER 01 · WORLD LOADED','QUEST STARTED.\nBUILD MODE ON.','Explore projects like levels and follow the path from bug to build.','START EXPLORING ▶','SAVE POINT: PROJECTS','Arcade-like frames and pixel-inspired developer nostalgia.'],
      future: ['H / SPATIAL WORKSHOP','DIMENSION 026 · DIGITAL OBJECTS','Build beyond\nthe screen.','A workshop for ideas, interfaces and small systems with a little more dimension.','EXPLORE THE SPACE ↗','SPATIAL THINKING · REAL PROJECTS','Layered depth, sculptural shapes and spatial visual cues.'],
      office: ['HARIOM PATEL / PROFILE','WELCOME TO MY WORKSPACE','Step inside my\ndigital workspace.','Take a guided tour through my developer desk, project wall, tools and workbench.','START THE TOUR ↗','DESK · PROJECT WALL · WORKBENCH','A workspace-first composition inspired by a developer’s digital office.'],
      netflix: ['H / ORIGINALS','A HARIOM BUILDS ORIGINAL SERIES','Ideas become\noriginals.','Every project has a story. Explore the builds, experiments and lessons behind each release.','▶ PLAY THE INTRO','SEASON 01 · REAL PROJECTS','A streaming-inspired cinematic portfolio, not affiliated with Netflix.']
    };
    const renderTemplate = id => {
      const button = buttons.find(item => item.dataset.template === id);
      const data = concepts[id];
      if (!button || !data || !preview) return;
      preview.className = 'p-template-preview theme-' + id;
      buttons.forEach((item,index) => {
        const active = item === button;
        item.classList.toggle('is-active',active);
        item.setAttribute('aria-pressed',String(active));
        if (active && fields.count) fields.count.textContent = String(index+1).padStart(2,'0') + ' / 18';
      });
      const index = buttons.indexOf(button);
      if (fields.label) fields.label.textContent = String(index+1).padStart(2,'0') + ' / ' + button.querySelector('b').textContent.toUpperCase();
      if (fields.brand) fields.brand.textContent = data[0];
      if (fields.eyebrow) fields.eyebrow.textContent = data[1];
      if (fields.title) fields.title.textContent = data[2];
      if (fields.description) fields.description.textContent = data[3];
      if (fields.cta) fields.cta.textContent = data[4];
      if (fields.footer) fields.footer.textContent = data[5];
      if (fields.styleTitle) fields.styleTitle.textContent = String(index+1).padStart(2,'0') + ' — ' + button.querySelector('b').textContent;
      if (fields.styleDescription) fields.styleDescription.textContent = data[6];
    };
    buttons.forEach(button => button.addEventListener('click',() => renderTemplate(button.dataset.template)));
    renderTemplate('studio');
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


  // Dedicated world modules: distinct project index and interaction per themed page.
  const worldPage = document.body.dataset.landingTheme;
  if (worldPage && document.querySelector('.p-hero') && !document.querySelector('.p-world-module')) {
    const worldModules = {
      studio:{label:'THE STUDIO DESK',title:'A little less talk.<br><span>A little more shipped.</span>',intro:'A live index of the way I work: pick a project, inspect the work, then follow the evidence.',items:[['01','Haryomix','A student workspace experiment.','https://haryomix.eu.cc'],['02','Hariom AI','A local-first agent with approval gates.','https://github.com/pateljiop/hariom-ai'],['03','Portfolio','The home for my work and process.','https://hariom-portfolio.pages.dev']]},
      terminal:{label:'~/WORKSPACE/STATUS',title:'$ ls <span>./projects</span>',intro:'Choose a command to inspect a real project. These links open the actual work; no fake terminal execution.',items:[['$ cat haryomix.md','Haryomix','Student workspace · live site','https://haryomix.eu.cc'],['$ git open hariom-ai','Hariom AI','Python · controlled agent workflow','https://github.com/pateljiop/hariom-ai'],['$ open portfolio','Portfolio','Personal site · source available','https://hariom-portfolio.pages.dev']]},
      editorial:{label:'FIELD NOTES / 001',title:'The work behind<br><span>the work.</span>',intro:'A short editorial index: product ideas, implementation decisions and what still needs improvement.',items:[['NOTE 01','Make it useful','Build for a real task before adding decoration.','https://haryomix.eu.cc'],['NOTE 02','Keep humans in control','Approval and verification belong in agent workflows.','https://github.com/pateljiop/hariom-ai'],['NOTE 03','Show the evidence','A repository is more convincing than a big claim.','https://github.com/pateljiop']]},
      brutalist:{label:'NO FLUFF / PROJECT INDEX',title:'PROOF OVER<br><span>PROMISES.</span>',intro:'No fake metrics. No imaginary clients. Just projects you can open and inspect.',items:[['01 / LIVE','Haryomix','Open the live product.','https://haryomix.eu.cc'],['02 / SOURCE','Hariom AI','Inspect the implementation.','https://github.com/pateljiop/hariom-ai'],['03 / SOURCE','Portfolio','See the portfolio source.','https://github.com/pateljiop/Hariom-Professional-Portfolio']]},
      cinema:{label:'NOW SHOWING / FEATURED BUILDS',title:'Every build has<br><span>a second act.</span>',intro:'A small slate of projects in different stages. Select a title to visit the actual work.',items:[['FEATURE 01','Haryomix','A workspace for student tools.','https://haryomix.eu.cc'],['FEATURE 02','Hariom AI','An experiment in controlled computer action.','https://github.com/pateljiop/hariom-ai'],['FEATURE 03','Developer Portfolio','A home for experiments and process.','https://hariom-portfolio.pages.dev']]},
      minimal:{label:'SELECTED WORK / 2026',title:'Three things.<br><span>Still becoming.</span>',intro:'A quiet index of current work. Open a project for the details.',items:[['01','Haryomix','Student workspace.','https://haryomix.eu.cc'],['02','Hariom AI','Local assistant.','https://github.com/pateljiop/hariom-ai'],['03','Portfolio','Personal site.','https://hariom-portfolio.pages.dev']]},
      playful:{label:'THE BUILD PLAYGROUND',title:'Curious? Click<br><span>something.</span>',intro:'Pick a project card, jump into the build and explore how it works.',items:[['✳ 01','Haryomix','Study tools and workspace ideas.','https://haryomix.eu.cc'],['✳ 02','Hariom AI','A personal agent in progress.','https://github.com/pateljiop/hariom-ai'],['✳ 03','Portfolio','My corner of the internet.','https://hariom-portfolio.pages.dev']]},
      retro:{label:'HARIOM.EXE / FILE DIRECTORY',title:'OPEN FILE:<br><span>PROJECTS.DIR</span>',intro:'A retro-style directory of real destinations. Select any file to open it.',items:[['FILE_001.EXE','Haryomix','RUN: open live workspace','https://haryomix.eu.cc'],['FILE_002.PY','Hariom AI','RUN: inspect repository','https://github.com/pateljiop/hariom-ai'],['FILE_003.HTML','Portfolio','RUN: open personal site','https://hariom-portfolio.pages.dev']]},
      swiss:{label:'INDEX / 01—03',title:'A system for<br><span>making things.</span>',intro:'Three projects, clearly indexed. The links lead to the actual product or source.',items:[['01 / PRODUCT','Haryomix','Student workspace experiment.','https://haryomix.eu.cc'],['02 / ENGINEERING','Hariom AI','Controlled local agent.','https://github.com/pateljiop/hariom-ai'],['03 / WEB','Portfolio','Personal development site.','https://hariom-portfolio.pages.dev']]},
      neon:{label:'SIGNAL / ACTIVE PROJECTS',title:'Pick a signal.<br><span>Trace the source.</span>',intro:'Experimental products and tools. Follow the link to see the real implementation.',items:[['SIGNAL_01','Haryomix','Product experiment detected.','https://haryomix.eu.cc'],['SIGNAL_02','Hariom AI','Agent systems in development.','https://github.com/pateljiop/hariom-ai'],['SIGNAL_03','Portfolio','Public build log and identity.','https://hariom-portfolio.pages.dev']]},
      nature:{label:'GROWING / CURRENT BUILDS',title:'Small steps.<br><span>Useful things.</span>',intro:'These projects grow through testing, feedback and steady iteration.',items:[['SEED 01','Haryomix','A useful place for student tools.','https://haryomix.eu.cc'],['SEED 02','Hariom AI','A careful approach to automation.','https://github.com/pateljiop/hariom-ai'],['SEED 03','Portfolio','A living record of learning.','https://hariom-portfolio.pages.dev']]},
      dashboard:{label:'WORKSPACE / PROJECT OVERVIEW',title:'Project <span>control panel.</span>',intro:'A compact overview with direct links. Status labels describe the type of work, not fabricated performance metrics.',items:[['PRODUCT','Haryomix','Student workspace · live URL','https://haryomix.eu.cc'],['ENGINEERING','Hariom AI','Local agent · source repository','https://github.com/pateljiop/hariom-ai'],['PERSONAL','Portfolio','Web portfolio · live URL','https://hariom-portfolio.pages.dev']]},
      magazine:{label:'THE MAKER ISSUE / NO. 001',title:'Inside the<br><span>builder’s notebook.</span>',intro:'Three stories from the workbench—product thinking, agent engineering and the personal web.',items:[['COVER STORY','Haryomix','Designing around student tasks.','https://haryomix.eu.cc'],['THE DEEP DIVE','Hariom AI','Why approvals matter in agent systems.','https://github.com/pateljiop/hariom-ai'],['THE PROFILE','Portfolio','Projects, process and progress.','https://hariom-portfolio.pages.dev']]},
      mono:{label:'FILE 001 / SELECTED WORK',title:'Nothing to hide.<br><span>Inspect the work.</span>',intro:'Minimal interface. Real destinations. Follow any project to its live page or repository.',items:[['01','Haryomix','Live product.','https://haryomix.eu.cc'],['02','Hariom AI','Open-source repository.','https://github.com/pateljiop/hariom-ai'],['03','Portfolio','Live personal site.','https://hariom-portfolio.pages.dev']]},
      pixel:{label:'QUEST BOARD / WORLD 01',title:'Choose your<br><span>next quest.</span>',intro:'Three destinations. Pick a quest and jump into the real project.',items:[['QUEST 01','Explore Haryomix','Visit the student workspace.','https://haryomix.eu.cc'],['QUEST 02','Inspect Hariom AI','Read the agent source.','https://github.com/pateljiop/hariom-ai'],['QUEST 03','Visit Portfolio','Explore the maker’s home base.','https://hariom-portfolio.pages.dev']]},
      future:{label:'SPATIAL WORKSHOP / OBJECT INDEX',title:'Ideas with<br><span>some dimension.</span>',intro:'A spatial-feeling index of real work. Select an object to open its destination.',items:[['OBJECT 01','Haryomix','Student workspace experiment.','https://haryomix.eu.cc'],['OBJECT 02','Hariom AI','Personal agent systems.','https://github.com/pateljiop/hariom-ai'],['OBJECT 03','Portfolio','A living development space.','https://hariom-portfolio.pages.dev']]},
      office:{label:'WORKSPACE TOUR / SELECT A ZONE',title:'Welcome to my<br><span>digital workbench.</span>',intro:'Explore four zones in the workspace. Select a zone to reveal what belongs there; use the links to open the real projects.',items:[['01','The Desk','My day-to-day workflow: plan, build, test and improve.','#about'],['02','Project Wall','Haryomix and Hariom AI, the two main builds.','#projects'],['03','The Lab','Experiments, tools and engineering notes.','#lab'],['04','The Library','Notes, references and learning log.','#notes']]},
      netflix:{label:'HARIOM BUILDS ORIGINALS / SEASON 01',title:'A portfolio of<br><span>ongoing stories.</span>',intro:'Choose a title from the current season. Each episode opens a real project, not a fake video player.',items:[['S01 · E01','Haryomix: The Workspace','A student product experiment.','https://haryomix.eu.cc'],['S01 · E02','Hariom AI: Human in the Loop','An agent with approval gates.','https://github.com/pateljiop/hariom-ai'],['S01 · E03','The Personal Web','Building a home for the work.','https://hariom-portfolio.pages.dev']]}
    };
    const data = worldModules[worldPage];
    if (data) {
      const section = document.createElement('section');
      section.className = 'p-world-module p-world-module-' + worldPage;
      section.id = 'world-feature';
      section.innerHTML = '<div class="p-world-module-head"><p class="p-world-module-label"></p><h2></h2><p class="p-world-module-intro"></p></div><div class="p-world-module-grid"></div><p class="p-world-module-status" aria-live="polite"></p>';
      section.querySelector('.p-world-module-label').textContent = data.label;
      section.querySelector('h2').innerHTML = data.title;
      section.querySelector('.p-world-module-intro').textContent = data.intro;
      const grid = section.querySelector('.p-world-module-grid');
      data.items.forEach((item,index) => {
        const card = document.createElement('article');
        card.className = 'p-world-module-card';
        const eyebrow = document.createElement('span'); eyebrow.className='p-world-card-index'; eyebrow.textContent=item[0];
        const title = document.createElement('h3'); title.textContent=item[1];
        const description = document.createElement('p'); description.textContent=item[2];
        const link = document.createElement('a'); link.href=item[3]; link.textContent=worldPage==='office'?'Explore zone ↗':'Open project ↗';
        if(item[3].startsWith('http')){link.target='_blank';link.rel='noreferrer';}
        else {link.addEventListener('click',()=>{section.querySelector('.p-world-module-status').textContent='Opening '+item[1]+' zone below.';});}
        card.append(eyebrow,title,description,link); grid.append(card);
      });
      document.querySelector('.p-hero').insertAdjacentElement('afterend',section);
      if (worldPage === 'office') {
        section.querySelectorAll('.p-world-module-card').forEach((card,index)=>{
          card.setAttribute('tabindex','0');card.setAttribute('role','button');card.setAttribute('aria-pressed','false');
          const activate=()=>{section.querySelectorAll('.p-world-module-card').forEach(other=>{other.classList.remove('is-active');other.setAttribute('aria-pressed','false');});card.classList.add('is-active');card.setAttribute('aria-pressed','true');section.querySelector('.p-world-module-status').textContent=data.items[index][1]+': '+data.items[index][2];};
          card.addEventListener('click',event=>{if(event.target.closest('a'))return;activate();});
          card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();activate();}});
        });
      }
    }
  }

})();