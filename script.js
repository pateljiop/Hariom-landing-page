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
      if (!id) return;
      const selected = styleButtons.find(button => button.dataset.template === id);
      if (!selected) return;
      document.body.dataset.landingTheme = id;
      document.body.classList.add('has-selected-world');
      let worldSwitcher = document.querySelector('#world-switcher');
      if (!worldSwitcher) {
        worldSwitcher = document.createElement('button');
        worldSwitcher.type = 'button';
        worldSwitcher.id = 'world-switcher';
        worldSwitcher.className = 'p-world-switcher';
        worldSwitcher.innerHTML = '<span>H.</span> CHANGE WORLD <b>↗</b>';
        worldSwitcher.setAttribute('aria-label','Change landing page style');
        document.body.append(worldSwitcher);
        worldSwitcher.addEventListener('click', () => {
          entry.hidden = false;
          entry.classList.remove('is-exiting');
          chosen = null;
          enterButton.disabled = true;
          enterButton.dataset.chosen = '';
          entryOptions.querySelectorAll('.p-entry-option').forEach(item => {
            item.classList.remove('is-selected');
            item.setAttribute('aria-pressed','false');
          });
          window.scrollTo({top:0,behavior:'smooth'});
        });
      }

      selected.click();
      entry.classList.add('is-exiting');
      window.setTimeout(() => { entry.hidden = true; document.querySelector('#home')?.scrollIntoView({behavior:'instant'}); }, 520);
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
  const templateGrid=document.querySelector('#template-grid');
  if(templateGrid){
    const templates={
      studio:{name:'The Independent Studio',label:'STUDIO',brand:'H / BUILDS',eyebrow:'INDEPENDENT BUILDER · PRAYAGRAJ',title:'I make ideas\\ndo something.',description:'Digital products, useful experiments, and small systems built with curiosity.',cta:'EXPLORE THE WORK ↗',footer:'HARIOM PATEL / SELECTED WORK',blurb:'A confident creative portfolio with bold typography, a clear point of view and one strong accent.'},
      terminal:{name:'The Developer Terminal',label:'TERMINAL',brand:'hariom@builds:~
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

})();,eyebrow:'SYSTEM READY · NODE 026',title:'$ build\\n--something-real',description:'Code, tools, experiments. Run the idea, inspect the output, repeat.',cta:'$ ls ./projects ↗',footer:'EXIT CODE 0 · BUILD CONTINUES',blurb:'A command-line inspired interface for people who want to see the engineering first.'},
      editorial:{name:'The Design Journal',label:'EDITORIAL',brand:'THE BUILD JOURNAL',eyebrow:'ISSUE Nº 026 / DEVELOPER NOTES',title:'A practice of\\nmaking things.',description:'An ongoing record of useful ideas, technical curiosity and the work between drafts.',cta:'READ THE WORK ↗',footer:'VOL. 01 — ALWAYS IN PROGRESS',blurb:'Large typography, generous whitespace and the feeling of a thoughtfully art-directed journal.'},
      brutalist:{name:'The Digital Brutalist',label:'BRUTALIST',brand:'HARIOM®',eyebrow:'NO AGENCY. NO PRETEND. JUST BUILD.',title:'MAKE IT.\\nBREAK IT.\\nMAKE IT BETTER.',description:'Independent developer building real tools and learning in public.',cta:'LOOK AT THE BUILDS ↗',footer:'BUILT BY A HUMAN / WORK IN PROGRESS',blurb:'Hard edges, oversized type and unapologetic contrast for a high-impact first impression.'},
      cinema:{name:'The Opening Credits',label:'CINEMATIC',brand:'HARIOM / ORIGINALS',eyebrow:'AN INDEPENDENT BUILDER PRESENTS',title:'Every build\\nstarts somewhere.',description:'A story of ideas becoming products—one experiment, one bug, one release at a time.',cta:'ROLL THE STORY ↗',footer:'CHAPTER 01 · THE BUILDER',blurb:'A film-poster-like hero with a dramatic focal point and a story-led path into the work.'},
      minimal:{name:'The Quiet Portfolio',label:'MINIMAL',brand:'hariom.',eyebrow:'DEVELOPER / STUDENT / BUILDER',title:'Less noise.\\nMore useful.',description:'I build small, purposeful digital products and systems that solve real problems.',cta:'SELECTED WORK ↗',footer:'INDEPENDENTLY MADE · INDIA',blurb:'Calm spacing, restrained colour and carefully edited copy for a quiet, premium feel.'},
      playful:{name:'The Playful Internet',label:'PLAYFUL',brand:'hey, internet! ✳',eyebrow:'CURIOSITY LEVEL: TOO HIGH',title:'Oops, I built\\nanother thing.',description:'A curious builder making tools, trying weird ideas and learning out loud.',cta:'COME PLAY ↗',footer:'MADE WITH CURIOSITY + TOO MUCH COFFEE',blurb:'Friendly shapes, bright accents and a less formal tone aimed at curious Gen Z visitors.'},
      retro:{name:'The Retro Web',label:'RETRO WEB',brand:'★ HARIOM'S HOME PAGE ★',eyebrow:'WELCOME, INTERNET TRAVELLER!',title:'YOU FOUND\\nMY CORNER.',description:'Projects, experiments and notes from one developer's corner of the web.',cta:'ENTER THE SITE >>>',footer:'BEST VIEWED WITH CURIOSITY · WEB 1.0 SPIRIT',blurb:'A nostalgic web-ring mood with pixel details and intentionally playful interface language.'},
      swiss:{name:'The Swiss System',label:'SWISS GRID',brand:'HP / DIGITAL PRACTICE',eyebrow:'INDEPENDENT PRACTICE / 2026',title:'Ideas need\\na system.',description:'A structured view of products, process and the decisions that make software useful.',cta:'VIEW INDEX ↗',footer:'INDEX 01—04 / PROJECTS · PROCESS · NOTES',blurb:'A disciplined grid, strong alignment and concise information hierarchy.'},
      neon:{name:'The Neon Lab',label:'NEON LAB',brand:'HARIOM // LAB',eyebrow:'EXPERIMENTAL SYSTEMS ONLINE',title:'Curiosity\\nafter dark.',description:'AI experiments, automation and digital tools built at the edge of what I know.',cta:'ENTER THE LAB ↗',footer:'SIGNAL DETECTED · WORK IN PROGRESS',blurb:'A dark, technical atmosphere with neon accents for experimental and AI-focused work.'},
      nature:{name:'The Organic Maker',label:'ORGANIC',brand:'hariom builds things',eyebrow:'GROW SLOW · BUILD WITH CARE',title:'Useful things,\\nmade thoughtfully.',description:'A human-first approach to building tools, learning systems and digital experiences.',cta:'MEET THE WORK ↗',footer:'GROWN THROUGH CURIOSITY · MADE IN INDIA',blurb:'Warm tones, soft corners and a grounded, human voice instead of a cold tech aesthetic.'},
      dashboard:{name:'The Product Dashboard',label:'DASHBOARD',brand:'BUILD OS / OVERVIEW',eyebrow:'WORKSPACE STATUS · ACTIVE',title:'From idea\\nto shipped.',description:'A snapshot of projects, systems and experiments currently moving from concept to reality.',cta:'OPEN PROJECT BOARD ↗',footer:'3 ACTIVE PROJECTS · STATUS IS HONEST',blurb:'A product-like interface with compact labels and clear project-oriented navigation.'},
      magazine:{name:'The Visual Magazine',label:'MAGAZINE',brand:'MADE / BY HARIOM',eyebrow:'THE MAKER ISSUE · NO. 001',title:'The internet\\nis my workshop.',description:'A visual collection of experiments, products and lessons from building in public.',cta:'FLIP THROUGH ↗',footer:'FEATURE STORY / THE INDEPENDENT BUILDER',blurb:'Magazine-inspired typography and editorial framing for a visual, narrative portfolio.'},
      mono:{name:'The Monochrome File',label:'MONOCHROME',brand:'HARIOM / FILE 001',eyebrow:'BLACK · WHITE · WORK',title:'Let the work\\nspeak.',description:'No loud gradients. Just useful products, clear decisions and honest progress.',cta:'OPEN THE FILE ↗',footer:'DOCUMENTED WORK / NO DECORATION NEEDED',blurb:'Strict black-and-white contrast with minimal decoration and an evidence-first tone.'},
      pixel:{name:'The Pixel World',label:'PIXEL WORLD',brand:'HARIOM.EXE',eyebrow:'PLAYER 01 · WORLD LOADED',title:'QUEST STARTED.\\nBUILD MODE ON.',description:'Explore projects like levels, collect ideas and follow the path from bug to build.',cta:'START EXPLORING ▶',footer:'SAVE POINT: PROJECTS / NO XP FARMING',blurb:'Game-like framing and pixel details for visitors who prefer exploration over a résumé.'},
      future:{name:'The Spatial Workshop',label:'FUTURE CRAFT',brand:'H / SPATIAL WORKSHOP',eyebrow:'DIMENSION 026 · DIGITAL OBJECTS',title:'Build beyond\\nthe screen.',description:'A workshop for ideas, interfaces and small systems with a little more dimension.',cta:'EXPLORE THE SPACE ↗',footer:'SPATIAL THINKING · REAL PROJECTS',blurb:'Layered depth, sculptural shapes and a spatial-computing mood without requiring heavy 3D assets.'},
      office:{name:'The Office Tour',label:'OFFICE TOUR',brand:'HARIOM PATEL / PROFILE',eyebrow:'WELCOME TO MY WORKSPACE · TAKE A LOOK AROUND',title:'Step inside my\\ndigital workspace.',description:'Take a guided tour through my developer desk, project wall, tools and the workbench where ideas turn into real projects.',cta:'START THE TOUR ↗',footer:'DESK · PROJECT WALL · WORKBENCH · CONTACT',blurb:'An interactive virtual office walkthrough: a welcome desk, workspace overview, project wall, tools shelf and a workbench, designed to feel like stepping into a developer’s office rather than viewing a corporate profile.'},
      netflix:{name:'The Builder Series',label:'NETFLIX SERIES',brand:'H / ORIGINALS',eyebrow:'A HARIOM BUILDS ORIGINAL SERIES',title:'Ideas become\\noriginals.',description:'Every project has a story. Explore the builds, experiments and lessons behind each release.',cta:'▶ PLAY THE INTRO',footer:'SEASON 01 · PROJECTS THAT ARE REAL',blurb:'A streaming-inspired cinematic portfolio with a featured title, episode-like project journeys and a dark visual atmosphere. Inspired by streaming layouts, not affiliated with Netflix.'}
    };
    const buttons=[...templateGrid.querySelectorAll('[data-template]')],preview=document.querySelector('#template-preview');
    const fields={count:document.querySelector('#template-count'),label:document.querySelector('#template-preview-label'),brand:document.querySelector('#template-brand'),eyebrow:document.querySelector('#template-eyebrow'),title:document.querySelector('#template-title'),description:document.querySelector('#template-description'),cta:document.querySelector('#template-cta'),footer:document.querySelector('#template-footer'),styleTitle:document.querySelector('#template-style-title'),styleDescription:document.querySelector('#template-style-description')};
    const renderTemplate=id=>{const t=templates[id];if(!t)return;preview.className='p-template-preview theme-'+id;buttons.forEach((b,i)=>{const active=b.dataset.template===id;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));if(active)fields.count.textContent=String(i+1).padStart(2,'0')+' / 18';});fields.label.textContent=String(buttons.findIndex(b=>b.dataset.template===id)+1).padStart(2,'0')+' / '+t.label;for(const key of ['brand','eyebrow','description','footer','styleDescription'])fields[key].textContent=key==='styleDescription'?t.blurb:t[key];fields.title.textContent=t.title.replace(/\\n/g,'\\n');fields.cta.textContent=t.cta;fields.styleTitle.textContent=String(buttons.findIndex(b=>b.dataset.template===id)+1).padStart(2,'0')+' — '+t.name;};
    buttons.forEach(button=>button.addEventListener('click',()=>renderTemplate(button.dataset.template)));
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