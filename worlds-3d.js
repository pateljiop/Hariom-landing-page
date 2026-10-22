/* Hariom Builds — procedural 3D worlds. No model downloads required. */
(() => {
  const body = document.body;
  if (!body || body.dataset.world3dReady) return;
  body.dataset.world3dReady = "true";
  const theme = body.dataset.landingTheme || "studio";
  const office = theme === "office";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const host = document.querySelector(".p-workspace") || document.querySelector(".p-hero");
  if (!host) return;

  const mount = document.createElement("div");
  mount.className = "p-3d-stage" + (office ? " p-3d-office" : "");
  mount.setAttribute("role", "img");
  mount.setAttribute("aria-label", office ? "Animated 3D office with a walking character" : "Interactive animated 3D model for the " + theme + " portfolio theme");
  mount.innerHTML = '<div class="p-3d-label"><span>3D / ' + theme.toUpperCase() + '</span><span class="p-3d-live">● LIVE SCENE</span></div><div class="p-3d-loading" aria-hidden="true">BUILDING SCENE…</div>';
  host.appendChild(mount);
  host.classList.add("p-has-3d");

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
    scene.background = new THREE.Color(office ? 0xc6e5f1 : 0x0b1015);
    scene.fog = new THREE.Fog(office ? 0xc6e5f1 : 0x0b1015, 8, 22);
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
    camera.position.set(0, office ? 3.1 : 2.4, office ? 9.2 : 8.3);
    camera.lookAt(0, office ? 1.15 : 0.2, 0);
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
    const grid = new THREE.GridHelper(16,32,office?0x789ba1:config.color,office?0x9ab3b3:0x26313b);
    grid.position.y=-.065; grid.material.transparent=true; grid.material.opacity=office?.22:.32; scene.add(grid);
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
      // Walkable miniature office: desk, monitor, plant, windows and a rigged procedural character.
      const wallMat=mat(0xe7efec,.05,.92), wood=mat(0x9c7757,.05,.72), glass= new THREE.MeshStandardMaterial({color:0x8fc5dc,roughness:.18,metalness:.15,transparent:true,opacity:.7});
      mesh(new THREE.BoxGeometry(7,.12,4.5),wood,0,0,0,1,1,1,root);
      for(let i=0;i<3;i++){
        mesh(new THREE.BoxGeometry(1.25,2.05,.08),glass,-2.2+i*2.2,2.35,-2.05);
        mesh(new THREE.BoxGeometry(.07,2.15,.12),darkMat,-2.2+i*2.2,2.35,-1.98);
      }
      mesh(new THREE.BoxGeometry(2.2,.13,.9),wood,-1.25,1.05,-.65);
      mesh(new THREE.BoxGeometry(.12,.98,.12),darkMat,-2, .5,-.65);
      mesh(new THREE.BoxGeometry(.12,.98,.12),darkMat,-.5,.5,-.65);
      mesh(new THREE.BoxGeometry(.85,.55,.07),darkMat,-1.25,1.43,-.85);
      mesh(new THREE.BoxGeometry(.72,.42,.025),glass,-1.25,1.44,-.8);
      mesh(new THREE.CylinderGeometry(.08,.12,.45,12),mat(0x5e9e70),.05,.22,-.8);
      for(let i=0;i<5;i++){const leaf=mesh(new THREE.ConeGeometry(.09,.34,7),mat(i%2?0x2b966c:0x65b879),.05+Math.cos(i*1.25)*.15,.48+Math.sin(i*1.25)*.1,-.8);leaf.rotation.z=Math.cos(i*1.25)*.65;}
      // A simple low-poly human rig with pivoted limbs, animated stride and arm swing.
      const person=new THREE.Group();scene.add(person);person.position.set(1.45,0,1.2);
      const skin=mat(0xb97d5b,.05,.65), shirt=mat(0x245d70,.12,.55), pants=mat(0x273447,.12,.6), shoes=mat(0xf0d5ad,.08,.6);
      mesh(new THREE.CapsuleGeometry(.25,.52,5,10),shirt,0,1.25,0,1,1,1,person);
      mesh(new THREE.SphereGeometry(.23,18,14),skin,0,1.93,0,1,1,1,person);
      mesh(new THREE.CylinderGeometry(.025,.035,.22,8),skin,0,1.68,.02,1,1,1,person);
      const limb=(x,y,length,material)=>{const pivot=new THREE.Group();pivot.position.set(x,y,0);person.add(pivot);mesh(new THREE.CapsuleGeometry(.095,length*.42,4,8),material,0,-length*.42,0,1,1,1,pivot);return pivot;};
      const armL=limb(-.31,1.48,.56,shirt),armR=limb(.31,1.48,.56,shirt);
      const legL=limb(-.14,.92,.67,pants),legR=limb(.14,.92,.67,pants);
      // Shoes are parented to the leg pivots so the feet follow the stride.
      mesh(new THREE.BoxGeometry(.19,.1,.34),shoes,0,-.66,.12,1,1,1,legL);
      mesh(new THREE.BoxGeometry(.19,.1,.34),shoes,0,-.66,.12,1,1,1,legR);
      const shadow=mesh(new THREE.CircleGeometry(.42,32),new THREE.MeshBasicMaterial({color:0x435c63,transparent:true,opacity:.22}),0,.012,0,1.1,1,1,person);shadow.rotation.x=-Math.PI/2;
      movers.push(t=>{
        // Walk continuously along the office aisle, turning with the direction of travel.
        const phase=t*.48, direction=Math.cos(phase), stride=Math.sin(t*5.2);
        person.position.x=1.45+Math.sin(phase)*1.05;
        person.position.z=1.15+Math.cos(phase)*.18;
        person.rotation.y=direction>=0?Math.PI/2:-Math.PI/2;
        legL.rotation.x=stride*.52;
        legR.rotation.x=-stride*.52;
        armL.rotation.x=-stride*.38;
        armR.rotation.x=stride*.38;
        person.position.y=Math.abs(stride)*.035;
        person.rotation.z=-direction*.035;
      });
      // Chair and desk accessories make the room read as a small designed workspace.
      const chair=mesh(new THREE.CylinderGeometry(.38,.4,.12,20),darkMat,.95,.52,-.1);mesh(new THREE.BoxGeometry(.12,.72,.12),darkMat,.95,.22,-.1);mesh(new THREE.BoxGeometry(.7,.7,.1),shirt,.95,.91,-.2);
      for(let i=0;i<4;i++)mesh(new THREE.BoxGeometry(.05,.5,.05),wood,-2.7+i*.15,.28,1.7);
      mesh(new THREE.BoxGeometry(.7,.5,.04),wallMat,2.7,1.3,-1.95);
      mesh(new THREE.BoxGeometry(1.5,.08,.45),wood,1.8,.5,-1.15);
      const mug=mesh(new THREE.CylinderGeometry(.1,.09,.18,16),mat(0xf4eee5,.05,.2),2,.64,-1.1);
      movers.push(t=>{mug.rotation.y=Math.sin(t*1.2)*.08;});
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
