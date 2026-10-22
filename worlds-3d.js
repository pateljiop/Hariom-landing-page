/* Hariom Builds — procedural 3D worlds. No model downloads required. */
(() => {
  const body = document.body;
  if (!body || body.dataset.world3dReady) return;
  body.dataset.world3dReady = "true";
  const theme = body.dataset.landingTheme || "studio";
  const office = theme === "office";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const host = office ? document.body : (document.querySelector(".p-workspace") || document.querySelector(".p-hero"));
  if (!host) return;

  const mount = document.createElement("div");
  mount.className = "p-3d-stage" + (office ? " p-3d-office p-3d-office-world" : "");
  mount.dataset.theme = theme;
  mount.setAttribute("role", "img");
  mount.setAttribute("aria-label", office ? "Animated 3D office with a walking character" : "Interactive animated 3D model for the " + theme + " portfolio theme");
  mount.innerHTML = '<div class="p-3d-label"><span>3D / ' + theme.toUpperCase() + '</span><span class="p-3d-live">● LIVE SCENE</span></div><div class="p-3d-loading" aria-hidden="true">BUILDING SCENE…</div>';
  host.appendChild(mount);
  if (!office) host.classList.add("p-has-3d");

  // A small, accessible room directory connects the 3D set to real page sections.
  if (office) {
    const dock = document.createElement("nav");
    dock.className = "p-office-dock";
    dock.setAttribute("aria-label", "Explore the office");
    dock.innerHTML = '<span class="p-office-dock-label">EXPLORE THE SPACE</span><a href="#projects"><span aria-hidden="true">▣</span> Projects</a><a href="#lab"><span aria-hidden="true">⌘</span> Build lab</a><a href="#notes"><span aria-hidden="true">▤</span> Notes</a><a href="#about"><span aria-hidden="true">◉</span> About</a><a href="#contact"><span aria-hidden="true">↗</span> Contact</a>';
    document.body.appendChild(dock);
  }

  const css = document.createElement("style");
  css.textContent = `
    .p-has-3d{position:relative!important;overflow:hidden}
    .p-3d-stage{position:relative;width:100%;height:clamp(220px,32vw,390px);min-height:220px;isolation:isolate;background:radial-gradient(ellipse at 50% 65%,color-mix(in srgb,var(--acid,#a7ff5a) 13%,transparent),transparent 65%);border:1px solid color-mix(in srgb,var(--acid,#a7ff5a) 24%,transparent);border-radius:inherit;overflow:hidden}
    .p-3d-stage canvas{display:block;width:100%;height:100%;outline:none}
    .p-3d-label{position:absolute;z-index:2;left:14px;right:14px;top:12px;display:flex;justify-content:space-between;gap:8px;font:10px/1.3 'DM Mono',monospace;letter-spacing:.12em;color:var(--acid,#a7ff5a);pointer-events:none}
    .p-3d-live{opacity:.75}.p-3d-loading{position:absolute;inset:0;display:grid;place-items:center;font:11px 'DM Mono',monospace;letter-spacing:.12em;color:var(--acid,#a7ff5a);opacity:.7;pointer-events:none}
    .p-3d-stage.p-3d-ready .p-3d-loading{display:none}
    .p-3d-office{height:clamp(280px,38vw,440px);background:linear-gradient(180deg,#c6e5f1 0%,#e7f0e9 62%,#c2a985 62%,#9b8064 100%);border-color:#a4c4d1}
    .p-3d-office .p-3d-label{color:#234c60}.p-3d-office .p-3d-live{color:#176b51}
    .p-3d-office-world{position:fixed!important;inset:0!important;z-index:0!important;width:100vw!important;height:100vh!important;min-height:100vh!important;border:0!important;border-radius:0!important;pointer-events:none!important;overflow:hidden!important;background:linear-gradient(180deg,#a9d5e7 0%,#e4ece5 48%,#c5a883 100%)!important}
    .p-3d-office-world canvas{position:absolute;inset:0;width:100%!important;height:100%!important}
    body.personal-site[data-landing-theme="office"]{background:transparent!important}
    body[data-landing-theme="office"] main,body[data-landing-theme="office"] footer{position:relative;z-index:1}
    body[data-landing-theme="office"] main>section{position:relative;background:linear-gradient(135deg,rgba(9,18,27,.82),rgba(12,25,34,.60))!important;border:1px solid rgba(209,235,237,.19);border-radius:16px;backdrop-filter:blur(12px);box-shadow:0 22px 70px rgba(3,12,18,.22);margin-top:24px;margin-bottom:24px;padding-left:clamp(18px,3vw,38px);padding-right:clamp(18px,3vw,38px)}
    body[data-landing-theme="office"] .p-hero{background:linear-gradient(135deg,rgba(9,18,27,.84),rgba(12,25,34,.62))!important}
    body[data-landing-theme="office"] .p-nav{background:rgba(8,16,24,.78)!important;border-color:rgba(210,236,238,.18)!important}
    body[data-landing-theme="office"] .p-workspace{visibility:hidden;box-shadow:none!important;border:0!important;background:transparent!important}
    body[data-landing-theme="office"] .p-footer{background:rgba(7,15,22,.86)!important;border-color:rgba(210,236,238,.18)!important}
    body[data-landing-theme="office"] .p-world-switcher{background:rgba(9,18,27,.88)!important;border-color:rgba(210,236,238,.24)!important;backdrop-filter:blur(14px)}
    body[data-landing-theme="office"] .p-section-label{color:#b7d2dc}
    .p-office-dock{position:fixed;z-index:20;left:50%;bottom:max(16px,env(safe-area-inset-bottom));transform:translateX(-50%);display:flex;align-items:center;gap:5px;max-width:calc(100vw - 24px);padding:8px;border:1px solid rgba(207,231,235,.22);border-radius:18px;background:rgba(7,15,23,.88);box-shadow:0 14px 42px rgba(0,0,0,.3);backdrop-filter:blur(18px);color:#eaf4f4;font:500 11px/1.2 'DM Sans',sans-serif;white-space:nowrap;overflow-x:auto;scrollbar-width:none}
    .p-office-dock::-webkit-scrollbar{display:none}
    .p-office-dock-label{padding:0 9px;color:#9ebbc4;font:9px/1.2 'DM Mono',monospace;letter-spacing:.1em}
    .p-office-dock a{display:inline-flex;align-items:center;gap:6px;padding:10px 12px;border:1px solid transparent;border-radius:11px;color:inherit;text-decoration:none;transition:background .2s,border-color .2s,transform .2s}
    .p-office-dock a span{color:#8ce0c9;font-size:13px}
    .p-office-dock a:hover,.p-office-dock a:focus-visible{background:rgba(132,211,204,.13);border-color:rgba(132,211,204,.28);outline:none;transform:translateY(-1px)}
    .p-office-dock a:focus-visible{outline:2px solid #8ce0c9;outline-offset:2px}
    body[data-landing-theme="office"]{scroll-behavior:smooth}
    @media(prefers-reduced-motion:reduce){body[data-landing-theme="office"]{scroll-behavior:auto}.p-office-dock a{transition:none}}
    @media(max-width:700px){body[data-landing-theme="office"] main>section{border-radius:12px;margin-top:14px;margin-bottom:14px;padding-left:16px;padding-right:16px}.p-3d-office-world{height:100dvh!important}.p-office-dock{left:12px;right:12px;bottom:max(10px,env(safe-area-inset-bottom));transform:none;max-width:none;justify-content:flex-start;border-radius:14px}.p-office-dock-label{display:none}.p-office-dock a{padding:10px 11px}.p-office-dock a span{font-size:12px}}
    .p-3d-stage[data-theme="terminal"]{background:radial-gradient(ellipse at 50% 75%,#163a2a 0%,#07120f 68%);border-color:#286344}
    .p-3d-stage[data-theme="editorial"],.p-3d-stage[data-theme="magazine"]{background:linear-gradient(135deg,#292019,#100e0d 72%);border-color:#7d6143}
    .p-3d-stage[data-theme="brutalist"]{background:linear-gradient(145deg,#4a2518,#17110f 72%);border-color:#a64c2c}
    .p-3d-stage[data-theme="cinema"],.p-3d-stage[data-theme="netflix"]{background:radial-gradient(ellipse at 50% 20%,#45131f,#10070d 72%);border-color:#6e1c2a}
    .p-3d-stage[data-theme="minimal"],.p-3d-stage[data-theme="swiss"]{background:linear-gradient(145deg,#f7f6f2,#deddd8);border-color:#c9c6bf}
    .p-3d-stage[data-theme="minimal"] .p-3d-label,.p-3d-stage[data-theme="swiss"] .p-3d-label{color:#393a38}
    .p-3d-stage[data-theme="playful"]{background:radial-gradient(ellipse at 35% 35%,#542343,#20101e 72%);border-color:#a74782}
    .p-3d-stage[data-theme="retro"]{background:linear-gradient(180deg,#55281c,#28130f 65%,#1c100e);border-color:#b76531}
    .p-3d-stage[data-theme="neon"]{background:radial-gradient(ellipse at 50% 60%,#102b43,#030911 70%);border-color:#1c8f8a}
    .p-3d-stage[data-theme="nature"]{background:linear-gradient(180deg,#1d3024,#101c15 70%);border-color:#52784a}
    .p-3d-stage[data-theme="dashboard"]{background:linear-gradient(135deg,#102a43,#07111d 70%);border-color:#316eaa}
    .p-3d-stage[data-theme="mono"]{background:linear-gradient(135deg,#292929,#090909 70%);border-color:#777}
    .p-3d-stage[data-theme="pixel"]{background-color:#111b09;background-image:linear-gradient(#a9ed2920 1px,transparent 1px),linear-gradient(90deg,#a9ed2920 1px,transparent 1px);background-size:18px 18px;border-color:#83a52c}
    .p-3d-stage[data-theme="future"]{background:radial-gradient(ellipse at 50% 50%,#123c59,#050d19 72%);border-color:#347da1}
    @media(max-width:600px){.p-3d-stage{height:260px;min-height:260px}.p-3d-office{height:300px}}
    @media(prefers-reduced-motion:reduce){.p-3d-stage canvas{opacity:.92}}
  `;
  document.head.appendChild(css);

  const themes = {
    studio:{shape:"torus",color:0xa7ff5a,accent:0xf0f4e9},
    terminal:{shape:"cube",color:0x8bff74,accent:0x45b9ff},
    editorial:{shape:"rings",color:0xd4b58b,accent:0xf5e9d6},
    brutalist:{shape:"blocks",color:0xff5a36,accent:0xf4eee5},
    cinema:{shape:"orb",color:0xff4b65,accent:0x6c7cff},
    minimal:{shape:"sphere",color:0xe8e8e8,accent:0x999999},
    playful:{shape:"bouncy",color:0xff78bb,accent:0xffd166},
    retro:{shape:"retro",color:0xffa64d,accent:0x65e0d5},
    swiss:{shape:"grid",color:0xff3030,accent:0xf2eee8},
    neon:{shape:"neon",color:0x5bffea,accent:0xe35bff},
    nature:{shape:"leaf",color:0x80bd69,accent:0xe0d3a3},
    dashboard:{shape:"bars",color:0x5da9ff,accent:0x83e0c0},
    magazine:{shape:"sculpture",color:0xff8d50,accent:0xe7c7a2},
    mono:{shape:"wire",color:0xf0f0f0,accent:0x999999},
    pixel:{shape:"pixels",color:0xbaff3b,accent:0xff6f91},
    future:{shape:"crystal",color:0x63e5ff,accent:0x9c83ff},
    office:{shape:"office",color:0x2b9d83,accent:0xffc879},
    netflix:{shape:"reels",color:0xf04444,accent:0xf9bd4a}
  };
  const config = themes[theme] || themes.studio;

  import("https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js").then(THREE => {
    if (!mount.isConnected) return;
    const scene = new THREE.Scene();
    const scenePalettes = {
      studio:0x10170d, terminal:0x06120e, editorial:0x201a17, brutalist:0x21140f,
      cinema:0x100711, minimal:0xf0f0ed, playful:0x281126, retro:0x29140c,
      swiss:0xf1eee8, neon:0x050d18, nature:0x142019, dashboard:0x081625,
      magazine:0x24170f, mono:0x101010, pixel:0x111b09, future:0x071526,
      office:0xc6e5f1, netflix:0x17080a
    };
    const sceneColor = scenePalettes[theme] ?? scenePalettes.studio;
    scene.background = new THREE.Color(sceneColor);
    scene.fog = new THREE.Fog(sceneColor, 8, theme === "office" ? 22 : 26);
    const camera = new THREE.PerspectiveCamera(office ? 46 : 36, 1, 0.1, 100);
    camera.position.set(0, office ? 5.2 : 2.4, office ? 17.5 : 8.3);
    camera.lookAt(0, office ? 2.2 : 0.2, 0);
    const renderer = new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"low-power"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.setAttribute("aria-hidden","true");
    mount.insertBefore(renderer.domElement, mount.firstChild);
    const color = new THREE.Color(config.color), accent = new THREE.Color(config.accent);
    scene.add(new THREE.HemisphereLight(0xffffff, office ? 0x79624d : 0x172233, office ? 2.1 : 1.4));
    const key = new THREE.DirectionalLight(0xffffff, office ? 3.1 : 2.5);
    key.position.set(-4,7,5); key.castShadow=true; scene.add(key);
    const rim = new THREE.PointLight(config.color, office ? 1.1 : 2.2, 14);
    rim.position.set(3,2,2); scene.add(rim);
    const floorMat = new THREE.MeshStandardMaterial({color:office?0xb99b79:0x111923,roughness:.86,metalness:.08});
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30,30),floorMat);
    floor.rotation.x=-Math.PI/2; floor.position.y=-.08; floor.receiveShadow=true; scene.add(floor);
    const grid = new THREE.GridHelper(16,32,office?0x789ba1:(theme==="minimal"||theme==="swiss"?0xb9b5ae:config.color),office?0x9ab3b3:(theme==="minimal"||theme==="swiss"?0xd6d2ca:0x26313b));
    grid.position.y=-.065; grid.material.transparent=true; grid.material.opacity=office ? .22 : ((theme==="minimal" || theme==="swiss") ? .2 : .32); scene.add(grid);
    const mat=(c,metal=.2,rough=.34)=>new THREE.MeshStandardMaterial({color:c,metalness:metal,roughness:rough});
    const mainMat=mat(config.color,.45,.25), accentMat=mat(config.accent,.3,.3), darkMat=mat(office?0x29465a:0x202c3a,.25,.48);
    const root=new THREE.Group(); scene.add(root);
    const geo={
      box:new THREE.BoxGeometry(1,1,1),
      sphere:new THREE.SphereGeometry(.7,40,28),
      torus:new THREE.TorusGeometry(.8,.2,18,90),
      ico:new THREE.IcosahedronGeometry(.85,1),
      octa:new THREE.OctahedronGeometry(.9,0),
      cone:new THREE.ConeGeometry(.72,1.5,6),
      cylinder:new THREE.CylinderGeometry(.45,.55,1.2,12),
      capsule:new THREE.CapsuleGeometry(.25,.7,5,10)
    };
    function mesh(g,m,x=0,y=0,z=0,sx=1,sy=1,sz=1,parent=root){
      const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;
    }
    function ring(radius,tube,m,x,y,z,rx=0,rz=0){
      const o=mesh(new THREE.TorusGeometry(radius,tube,12,72),m,x,y,z);o.rotation.x=rx;o.rotation.z=rz;return o;
    }
    const movers=[];
    if (office) {
      // A full-room miniature office that stays behind every section of the page.
      const wallMat=mat(0xe5edf0,.04,.94), wood=mat(0x9b7656,.05,.72);
      const glass=new THREE.MeshStandardMaterial({color:0x8fc9df,roughness:.18,metalness:.12,transparent:true,opacity:.72});
      const frame=mat(0x314b5b,.28,.48), plantGreen=mat(0x3e9b6d,.04,.8);
      // Room shell and broad daylight windows.
      mesh(new THREE.BoxGeometry(14,.16,11),wood,0,-.12,0,1,1,1,root);
      mesh(new THREE.BoxGeometry(14,6,.16),wallMat,0,2.9,-4.7);
      mesh(new THREE.BoxGeometry(.16,6,10),wallMat,-6.9,2.9,.1);
      mesh(new THREE.BoxGeometry(.16,6,10),wallMat,6.9,2.9,.1);
      mesh(new THREE.BoxGeometry(14,.18,11),mat(0xc6d0cf,.02,.95),0,5.9,0);
      for(let i=0;i<4;i++){
        const x=-4.65+i*3.1;
        mesh(new THREE.BoxGeometry(2.7,2.45,.05),glass,x,3.65,-4.58);
        mesh(new THREE.BoxGeometry(.09,2.62,.12),frame,x-1.38,3.65,-4.5);
        mesh(new THREE.BoxGeometry(.09,2.62,.12),frame,x+1.38,3.65,-4.5);
        mesh(new THREE.BoxGeometry(2.82,.09,.12),frame,x,4.96,-4.5);
        mesh(new THREE.BoxGeometry(2.82,.09,.12),frame,x,2.34,-4.5);
        mesh(new THREE.BoxGeometry(.07,2.45,.12),frame,x,3.65,-4.49);
      }
      // Soft ceiling beams and warm office lights.
      for(let i=0;i<5;i++){
        mesh(new THREE.BoxGeometry(.12,.12,10),wood,-5.6+i*2.8,5.78,.1);
        const lamp=mesh(new THREE.BoxGeometry(1.25,.06,.34),mat(0xfff1c6,.04,.28),-4.2+i*2.1,5.66,-.6);
        const glow=new THREE.PointLight(0xffe4ad,.28,6);glow.position.set(-4.2+i*2.1,5.2,-.6);scene.add(glow);
        movers.push(t=>{glow.intensity=.24+Math.sin(t*.8+i)*.025;});
      }
      // Main desk and a working monitor, keyboard, mug and desk lamp.
      mesh(new THREE.BoxGeometry(3.6,.16,1.45),wood,-2.35,1.22,-.1);
      for(const x of [-3.85,-.85])for(const z of [-.62,.42])mesh(new THREE.BoxGeometry(.12,1.2,.12),darkMat,x,.6,z);
      mesh(new THREE.BoxGeometry(1.5,.9,.1),darkMat,-2.35,1.82,-.53);
      mesh(new THREE.BoxGeometry(1.36,.75,.025),glass,-2.35,1.83,-.46);
      mesh(new THREE.BoxGeometry(1.18,.04,.02),mat(0x4cdec0,.15,.3),-2.35,1.9,-.43);
      mesh(new THREE.BoxGeometry(.85,.035,.32),mat(0x263440,.18,.55),-2.3,1.34,.08);
      for(let i=0;i<8;i++)mesh(new THREE.BoxGeometry(.075,.012,.025),mat(0x9db8c1,.12,.55),-2.62+i*.09,1.365,.09);
      mesh(new THREE.CylinderGeometry(.1,.12,.2,16),mat(0xf1e8d7,.04,.25),-1.15,1.39,.1);
      const lampArm=mesh(new THREE.CylinderGeometry(.035,.035,.68,10),frame,-.7,1.64,-.18);lampArm.rotation.z=-.38;
      mesh(new THREE.ConeGeometry(.22,.26,12),mat(0xd9b47b,.18,.38),-.58,1.98,-.18,1,1,1,root).rotation.z=Math.PI;
      const deskLight=new THREE.PointLight(0xffc978,.35,3);deskLight.position.set(-.58,1.85,-.1);scene.add(deskLight);
      // Bookshelf with books and a trailing plant on the right wall.
      mesh(new THREE.BoxGeometry(1.55,3.4,.35),wood,5.55,1.7,-3.35);
      for(let i=0;i<4;i++)mesh(new THREE.BoxGeometry(1.35,.09,.45),darkMat,5.55,.55+i*.82,-3.08);
      const bookMats=[mat(0x477d8b,.02,.8),mat(0xc58c57,.02,.8),mat(0x4e9c77,.02,.8),mat(0x52657f,.02,.8)];
      for(let row=0;row<3;row++)for(let i=0;i<5;i++){
        const b=mesh(new THREE.BoxGeometry(.16,.38+(i%2)*.12,.2),bookMats[(i+row)%bookMats.length],4.98+i*.23,.78+row*.82,-3.08);
        b.rotation.z=(i%2?-.04:.035);
      }
      mesh(new THREE.CylinderGeometry(.16,.2,.36,12),mat(0xb77c58,.02,.8),4.75,.32,-1.7);
      for(let i=0;i<6;i++){
        const leaf=mesh(new THREE.ConeGeometry(.12,.62,7),i%2?plantGreen:mat(0x65b879,.02,.82),4.75+Math.cos(i*1.05)*.22,.72+Math.sin(i*1.05)*.16,-1.7);
        leaf.rotation.z=Math.cos(i*1.05)*.55;
      }
      // Meeting table and two chairs make the rest of the office visible behind the content.
      mesh(new THREE.CylinderGeometry(1.25,1.3,.14,32),wood,2.45,.9,-2.05);
      mesh(new THREE.CylinderGeometry(.12,.18,.85,12),darkMat,2.45,.42,-2.05);
      for(let i=0;i<3;i++){
        const a=i*Math.PI*2/3;
        const x=2.45+Math.cos(a)*1.55,z=-2.05+Math.sin(a)*1.15;
        mesh(new THREE.BoxGeometry(.72,.13,.66),darkMat,x,.54,z);
        mesh(new THREE.BoxGeometry(.7,.7,.12),frame,x,.94,z-.24);
        mesh(new THREE.CylinderGeometry(.045,.05,.45,8),darkMat,x,.28,z);
      }
      // Procedural walking character, rigged at the hips and shoulders.
      const person=new THREE.Group();scene.add(person);person.position.set(1.3,0,2.5);
      const skin=mat(0xb97d5b,.05,.65),shirt=mat(0x245d70,.12,.55),pants=mat(0x273447,.12,.6),shoes=mat(0xf0d5ad,.08,.6);
      mesh(new THREE.CapsuleGeometry(.25,.52,5,10),shirt,0,1.25,0,1,1,1,person);
      mesh(new THREE.SphereGeometry(.23,18,14),skin,0,1.93,0,1,1,1,person);
      mesh(new THREE.CylinderGeometry(.025,.035,.22,8),skin,0,1.68,.02,1,1,1,person);
      const limb=(x,y,length,material)=>{const pivot=new THREE.Group();pivot.position.set(x,y,0);person.add(pivot);mesh(new THREE.CapsuleGeometry(.095,length*.42,4,8),material,0,-length*.42,0,1,1,1,pivot);return pivot;};
      const armL=limb(-.31,1.48,.56,shirt),armR=limb(.31,1.48,.56,shirt);
      const legL=limb(-.14,.92,.67,pants),legR=limb(.14,.92,.67,pants);
      mesh(new THREE.BoxGeometry(.19,.1,.34),shoes,0,-.66,.12,1,1,1,legL);
      mesh(new THREE.BoxGeometry(.19,.1,.34),shoes,0,-.66,.12,1,1,1,legR);
      const shadow=mesh(new THREE.CircleGeometry(.42,32),new THREE.MeshBasicMaterial({color:0x435c63,transparent:true,opacity:.22}),0,.012,0,1.1,1,1,person);shadow.rotation.x=-Math.PI/2;
      movers.push(t=>{
        const phase=t*.32, stride=Math.sin(t*5.2), direction=Math.cos(phase);
        person.position.x=Math.sin(phase)*3.6;
        person.position.z=2.45+Math.cos(phase*.72)*.38;
        person.rotation.y=direction>=0?Math.PI/2:-Math.PI/2;
        legL.rotation.x=stride*.52;legR.rotation.x=-stride*.52;
        armL.rotation.x=-stride*.38;armR.rotation.x=stride*.38;
        person.position.y=Math.abs(stride)*.035;
        person.rotation.z=-direction*.035;
      });
      // Subtle animated screens and a plant sway add life to the whole room.
      const screenGlow=mesh(new THREE.BoxGeometry(1.28,.04,.02),mat(0x62e5ce,.15,.25),-2.35,2.04,-.43);
      movers.push(t=>{screenGlow.material.emissive.setHex(0x164b43);screenGlow.material.emissiveIntensity=.25+Math.sin(t*1.8)*.1;});
      // Long aisle runner and floor guides make the space feel walkable.
      mesh(new THREE.BoxGeometry(2.8,.025,5.4),mat(0x718c8e,.02,.9),.35,-.015,1.25);
      for(let i=0;i<8;i++)mesh(new THREE.BoxGeometry(.035,.012,.28),mat(0xd8e4dc,.02,.9),.35,-.001,-1.05+i*.62);
      // Ambient dust motes drift through the room.
      for(let i=0;i<36;i++){
        const x=((i*17)%13-6)*.72,y=1.1+(i%6)*.68,z=((i*11)%9-4)*.72;
        const dot=mesh(new THREE.SphereGeometry(.018+(i%3)*.008,8,8),i%4?accentMat:mainMat,x,y,z);
        movers.push(t=>{dot.position.x=x+Math.sin(t*.22+i)*.16;dot.position.y=y+Math.sin(t*.7+i)*.12;});
      }
    } else {
      // Theme-specific, procedural hero sculpture — each theme gets a distinct silhouette.
      switch(config.shape){
        case "torus": ring(1,.22,mainMat,0,.2,0);ring(.62,.09,accentMat,0,.2,0,Math.PI/2);mesh(geo.ico,accentMat,0,.2,0,.5,.5,.5);break;
        case "cube": mesh(geo.box,mainMat,0,.25,0,1.25,1.25,1.25);ring(1.12,.035,accentMat,0,.25,0,Math.PI/3);mesh(geo.box,accentMat,.48,.73,.42,.2,.2,.2);break;
        case "rings": ring(.95,.13,mainMat,0,.2,0,.35,.3);ring(.65,.09,accentMat,0,.2,0,1.3,.8);mesh(geo.sphere,mainMat,0,.2,0,.48,.48,.48);break;
        case "blocks": mesh(geo.box,mainMat,-.35,.05,0,.95,.95,.95);mesh(geo.box,accentMat,.45,.38,.15,.78,.78,.78);mesh(geo.box,darkMat,.15,.96,-.1,.48,.48,.48);break;
        case "orb": mesh(geo.sphere,mainMat,0,.2,0,1.05,1.05,1.05);ring(1.3,.025,accentMat,0,.2,0,1.2,.25);ring(1.45,.018,mainMat,0,.2,0,.5,.8);break;
        case "sphere": mesh(geo.sphere,mainMat,0,.2,0,1.1,1.1,1.1);mesh(geo.sphere,accentMat,-.8,.8,.3,.12,.12,.12);break;
        case "bouncy": mesh(geo.sphere,mainMat,-.42,.2,0,.62,.62,.62);mesh(geo.sphere,accentMat,.45,.55,.1,.48,.48,.48);mesh(geo.sphere,darkMat,.25,-.05,.15,.25,.25,.25);break;
        case "retro": mesh(geo.cone,mainMat,0,.35,0,1.1,1.1,1.1);ring(1,.08,accentMat,0,.05,0);mesh(geo.box,accentMat,0,-.25,0,.9,.08,.9);break;
        case "grid": mesh(geo.box,mainMat,0,.25,0,1.25,.08,1.25);mesh(geo.box,accentMat,0,.85,0,.08,1.2,.08);mesh(geo.box,darkMat,-.5,.4,0,.08,.8,.08);break;
        case "neon": mesh(geo.torus,mainMat,0,.2,0,1.1,1.1,1.1);ring(.6,.055,accentMat,0,.2,0,Math.PI/2);mesh(geo.ico,accentMat,0,.2,0,.35,.35,.35);break;
        case "leaf": {const leaf=mesh(new THREE.SphereGeometry(.75,24,16),mainMat,0,.25,0,.55,1.25,.18);leaf.rotation.z=-.5;mesh(geo.cylinder,accentMat,0,-.25,.05,.08,1.5,.08);ring(.8,.025,accentMat,0,.2,0,.5,.3);break;}
        case "bars": for(let i=0;i<5;i++)mesh(geo.box,i%2?accentMat:mainMat,-1+i*.5,(-.1+i*.18)+.55,0,.32,.7+i*.2,.42);break;
        case "sculpture": mesh(geo.ico,mainMat,0,.35,0,.9,1.2,.55);mesh(geo.octa,accentMat,.48,.7,.1,.42,.42,.42);ring(.95,.04,accentMat,0,.2,0,.8,.4);break;
        case "wire": {const wire=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.05,1)),new THREE.LineBasicMaterial({color:config.color}));wire.position.y=.2;root.add(wire);ring(.72,.025,accentMat,0,.2,0,Math.PI/2);break;}
        case "pixels": for(let i=0;i<12;i++){const x=(i%4-1.5)*.42,y=(Math.floor(i/4)-1)*.42;mesh(geo.box,i%3?mainMat:accentMat,x,y+.35,0,.3,.3,.3);}break;
        case "crystal": mesh(geo.octa,mainMat,0,.3,0,.95,1.4,.85);mesh(geo.octa,accentMat,.55,.35,.2,.38,.58,.38);ring(1.2,.025,accentMat,0,.3,0,.9,.2);break;
        case "reels": for(let i=0;i<3;i++){const reel=mesh(geo.cylinder,i===1?accentMat:mainMat,-.75+i*.75,.25,0,.32,1.2,.32);reel.rotation.z=.25*(i-1);for(let j=0;j<5;j++)mesh(new THREE.SphereGeometry(.07,8,8),darkMat,-.75+i*.75,.25+(j-2)*.22,.3,.7,.7,.7);}break;
      }
      // Build a distinct environment for each art direction, not just a floating sculpture.
      const environment = new THREE.Group(); scene.add(environment);
      const envBox = (x,y,z,sx,sy,sz,material) => mesh(geo.box,material,x,y,z,sx,sy,sz,environment);
      const envRing = (r,tube,material,x,y,z,rx=0,rz=0) => { const o=mesh(new THREE.TorusGeometry(r,tube,12,72),material,x,y,z,1,1,1,environment); o.rotation.x=rx; o.rotation.z=rz; return o; };
      const paleMat = mat(theme==="minimal"||theme==="swiss"?0xfaf9f5:config.accent,.08,.72);
      switch(theme) {
        case "studio":
          envRing(2.35,.035,accentMat,-2,.85,-1.3,.18,.12);
          envBox(-2.15,.55,-1.2,.08,1.1,.08,darkMat); envBox(2.15,.55,-1.2,.08,1.1,.08,darkMat);
          envBox(0,1.85,-1.8,3.8,.06,.08,accentMat); break;
        case "terminal":
          for(let i=0;i<5;i++){envBox(-2.5+i*.18,.3+i*.36,-1.4,.045,.22,.045,mainMat);envBox(1.65+i*.16,.2+i*.26,-1.25,.04,.18,.04,accentMat);}
          envBox(-1.7,1.7,-1.8,1.8,.04,.04,mainMat); envBox(1.5,1.25,-1.8,1.1,.04,.04,accentMat); break;
        case "editorial":
          for(let i=0;i<4;i++){envBox(-2.3+i*.16,.48+i*.04,-1.1,.09,.95+i*.08,.48,i%2?accentMat:mainMat);}
          envBox(2,1.05,-1.2,.04,2,.04,accentMat); envBox(2.35,.35,-1.2,.04,.7,.04,mainMat); break;
        case "brutalist":
          envBox(-2.1,.8,-1.5,.72,1.6,.65,darkMat);envBox(2.05,.55,-1.2,.9,1.1,.8,mainMat);
          envBox(-1.2,1.7,-1.8,1.7,.12,.7,accentMat);envBox(1.25,.16,-1.7,1.4,.3,.55,darkMat); break;
        case "cinema":
          envBox(0,1.3,-2.1,3.7,2.25,.12,darkMat);
          envBox(0,1.3,-2,2.8,1.45,.035,mainMat);
          for(let i=0;i<5;i++){envBox(-2+i,0.18,-.9,.48,.36,.42,darkMat);}
          envRing(1.8,.035,accentMat,0,1.2,-.7,Math.PI/2,0); break;
        case "minimal":
          envBox(-2.3,.75,-1.4,.08,1.5,.08,darkMat);envBox(2.3,.75,-1.4,.08,1.5,.08,darkMat);
          envBox(0,1.55,-1.4,4.7,.06,.08,paleMat); break;
        case "playful":
          for(let i=0;i<7;i++){const b=envBox(-2.8+i*.9,.12+(i%3)*.18,-1.3,.25,.25,.25,i%2?accentMat:mainMat);b.rotation.set(i*.2,i*.3,i*.18);}
          envRing(.48,.12,accentMat,2,.95,-.8,.7,.2);break;
        case "retro":
          envBox(0,.45,-2,4.8,.05,.05,accentMat);
          for(let i=0;i<7;i++)envBox(-2.5+i*.8,.08,-1.8,.025,.9,.025,mainMat);
          envRing(2.15,.025,accentMat,0,.25,-1.4,Math.PI/2,0);break;
        case "swiss":
          for(let i=0;i<6;i++){envBox(-2.4+i*.8,.04,-1.5,.018,2.5,.018,darkMat);envBox(0,.15+i*.3,-1.5,4.8,.018,.018,darkMat);}
          envBox(-1.75,1.35,-1.3,.65,.65,.04,mainMat);break;
        case "neon":
          for(let i=0;i<8;i++){const h=.5+(i*37%13)*.11;envBox(-3+i*.85,h/2,-1.7,.48,h,.25,i%3?darkMat:mainMat);envBox(-3+i*.85,h+.08,-1.7,.32,.035,.27,accentMat);}
          envRing(2.1,.04,accentMat,0,1.25,-1.1,.5,.2);break;
        case "nature":
          for(let i=0;i<5;i++){const x=-2.8+i*1.4;envBox(x,.55,-1.5,.12,1.1,.12,darkMat);const crown=mesh(new THREE.ConeGeometry(.52,1.05,7),i%2?mainMat:accentMat,x,1.35,-1.5,1,1,1,environment);crown.rotation.z=(i%2?.1:-.1);}
          envRing(1.8,.025,accentMat,0,.3,-.9,.7,.15);break;
        case "dashboard":
          for(let i=0;i<6;i++){envBox(-2.5+i*.85,.35+(i%4)*.18,-1.3,.48,.7+(i%4)*.36,.16,i%2?accentMat:mainMat);}
          envBox(0,1.9,-1.5,4.8,.035,.035,accentMat);break;
        case "magazine":
          envBox(-2.2,.95,-1.45,.06,1.9,.06,accentMat);envBox(2.2,.95,-1.45,.06,1.9,.06,accentMat);
          envBox(0,1.85,-1.45,4.4,.06,.06,mainMat);envBox(0,.15,-1.45,4.4,.06,.06,mainMat);break;
        case "mono":
          for(let i=0;i<4;i++){const wire=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(.55,.55,.55)),new THREE.LineBasicMaterial({color:config.color}));wire.position.set(-2+i*1.3,.5,-1.3);environment.add(wire);}
          envRing(1.9,.018,accentMat,0,.6,-1.2,Math.PI/2,.2);break;
        case "pixel":
          for(let i=0;i<18;i++){const x=(i%6-2.5)*.72,y=.15+Math.floor(i/6)*.55;envBox(x,y,-1.5,.28,.28,.28,i%4===0?accentMat:mainMat);}
          break;
        case "future":
          for(let i=0;i<5;i++){const p=mesh(geo.octa,i%2?accentMat:mainMat,-2.4+i*1.2,.35+(i%2)*.35,-1.3,.28,.6,.28,environment);p.rotation.y=i*.4;}
          envRing(2.3,.018,accentMat,0,1,-1.2,.9,.25);break;
        case "netflix":
          envBox(0,1.2,-2,4.1,2.1,.08,darkMat);
          for(let i=0;i<3;i++){const reel=mesh(geo.cylinder,mainMat,-1.1+i*1.1,.55,-1.5,.22,.7,.22,environment);reel.rotation.z=.16*(i-1);}
          envRing(1.9,.03,accentMat,0,.9,-.9,Math.PI/2,.15);break;
      }
      // Orbiting motes create depth without stealing attention from the page.
      for(let i=0;i<28;i++){
        const a=i*2.399,rad=1.7+(i%5)*.18,y=((i%7)-3)*.19;
        const dot=mesh(new THREE.SphereGeometry(.025+(i%3)*.008,8,8),i%4?accentMat:mainMat,Math.cos(a)*rad,y,Math.sin(a)*rad);
        movers.push(t=>{dot.position.y=y+Math.sin(t*1.1+i)*.12;});
      }
    }
    const resize=()=>{
      const w=Math.max(1,mount.clientWidth),h=Math.max(1,mount.clientHeight);
      renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
    };
    resize();
    const observer=new ResizeObserver(resize);observer.observe(mount);
    let frame=0,raf=0,alive=true;
    const animate=()=>{
      if(!alive)return;
      raf=requestAnimationFrame(animate);
      const t=performance.now()*.001;
      if(office && !reduceMotion){
        // Let the camera travel gently across the workspace as the visitor scrolls.
        const maxScroll=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
        const progress=Math.min(1,Math.max(0,window.scrollY/maxScroll));
        const eased=progress*progress*(3-2*progress);
        camera.position.x=-.7+eased*1.4;
        camera.position.y=5.05-Math.sin(progress*Math.PI)*.22;
        camera.position.z=17.5-progress*1.15;
        camera.lookAt(-.45+eased*.9,2.15,0);
      } else if(office) {
        camera.position.set(0,5.2,17.5);
        camera.lookAt(0,2.2,0);
      }
      if(!office){root.rotation.y=reduceMotion?-.12:Math.sin(t*.25)*.24;root.rotation.x=reduceMotion?0:Math.sin(t*.35)*.035;}
      movers.forEach(fn=>fn(reduceMotion?0:t));
      if(!office && !reduceMotion){root.position.y=.15+Math.sin(t*.8)*.07;}
      renderer.render(scene,camera);frame++;
      if(frame===1)mount.classList.add("p-3d-ready");
    };
    animate();
    document.addEventListener("visibilitychange",()=>{if(document.hidden){cancelAnimationFrame(raf);}else if(alive)animate();});
    window.addEventListener("pagehide",()=>{alive=false;cancelAnimationFrame(raf);observer.disconnect();renderer.dispose();},{once:true});
  }).catch(err=>{
    mount.classList.add("p-3d-fallback");
    const loading=mount.querySelector(".p-3d-loading");
    if(loading)loading.textContent="3D NEEDS WEBGL / CDN ACCESS";
    console.warn("Portfolio 3D scene could not start:",err);
  });
})();
