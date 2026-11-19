(()=>{
'use strict';
const $=s=>document.querySelector(s),T=THREE;
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const CAN_HOVER=matchMedia('(hover:hover) and (pointer:fine)').matches;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const fmt=n=>'LE\u00a0'+n.toLocaleString('en-US');
const splashStarted=performance.now();
function splashProgress(p){p=Math.round(clamp(p,0,100));$('#splashPct').textContent=p+'%';$('#splashFill').style.width=p+'%'}
splashProgress(6);
if(!CAN_HOVER)$('.top p').textContent='Seven pieces, each prepared in 3D. Tap one to inspect it and place it in your room.';

/* Product facts and prices are based on the matching Right Furniture listings. */
const items=[
 {id:'flick',n:'FLICK',c:'Armchair',g:'Seating',p:17800,m:'Linen, high-density foam and solid beechwood',z:'Approx. 85 × 79 × 84 cm',finish:'Walnut / natural linen',d:'A nostalgic lounge chair with a sturdy beechwood frame, generous high-density foam and soft linen upholstery. Its angled timber arms and relaxed seat are made for long, comfortable pauses.'},
 {id:'right-sofa',n:'RIGHT SOFA',c:'Sofa',g:'Seating',p:34900,m:'Soft linen, high-density foam and solid beechwood',z:'280 × 80 × 95 cm',finish:'Greige',d:'A modular sofa with clean architectural lines and balanced proportions. The generous three-seat form brings a refined, serene presence to uncluttered living spaces.'},
 {id:'right-bed',n:'RIGHT BED',c:'Bed',g:'Bedroom',m:'Premium beechwood, plywood slats and upholstered pillow board',finish:'Natural / off-white',d:'A zero-tools platform bed engineered around free Japanese joints. Flexible curved plywood slats support the mattress, while the removable pillow board keeps the profile calm and minimal.',variants:[
  {id:'full',label:'Full',p:25100,z:'Full — 151 W × 216 L cm',scale:[151/191,1,1],glb:'models/right-bed-full.glb',usdz:'models/right-bed-full.usdz'},
  {id:'queen',label:'Queen',p:26750,z:'Queen — 171 W × 216 L cm',scale:[171/191,1,1],glb:'models/right-bed-queen.glb',usdz:'models/right-bed-queen.usdz'},
  {id:'king',label:'King',p:28400,z:'King — 191 W × 216 L cm',scale:[1,1,1],glb:'models/right-bed.glb',usdz:'models/right-bed.usdz'}]},
 {id:'tri',n:'TRI',c:'Armchair',g:'Seating',p:15800,m:'Fine linen, high-density foam and solid beechwood',z:'79 × 74 × 84 cm',finish:'Blue shown · also Grey / Maroon',d:'A jumbo lounge chair with room to settle in. High-density foam and fine linen sit on a sturdy beechwood frame for a compact piece with unusually generous comfort.'},
 {id:'ety',n:'ETY',c:'Dining set',g:'Dining',p:39800,m:'Premium solid beechwood',z:'140 × 90 × 75 cm',finish:'Natural brown',d:'A dining table and chair set designed to bring functional warmth to the room. Solid beechwood gives the light Scandinavian profile lasting strength and a timeless natural finish.'},
 {id:'drobe-3',n:'DROBE 3',c:'Wardrobe',g:'Storage',m:'Premium MDF with natural wood veneer',finish:'Walnut brown',d:'An elegant four-door wardrobe with integrated drawers, spacious storage and smooth recessed handles. The clean veneer front is designed for contemporary bedrooms.',variants:[
  {id:'160',label:'160 cm',p:28000,z:'160 × 200 × 60 cm',scale:[1,1,1],glb:'models/drobe-3.glb',usdz:'models/drobe-3.usdz'},
  {id:'180',label:'180 cm',p:30000,z:'180 × 200 × 60 cm',scale:[180/160,1,1],glb:'models/drobe-3-180.glb',usdz:'models/drobe-3-180.usdz'}]},
 {id:'couchy',n:'COUCHY',c:'Sofa',g:'Seating',m:'Linen, high-density foam and solid beechwood',finish:'Blue',d:'A cushion-shaped sofa with soft geometric lines, deep high-density foam and neatly stitched linen. Relaxed back cushions and padded arms make the compact frame especially welcoming.',variants:[
  {id:'180',label:'180 cm',p:27900,z:'180 × 70 × 95 cm',scale:[1,1,1],glb:'models/couchy.glb',usdz:'models/couchy.usdz'},
  {id:'200',label:'200 cm',p:29900,z:'200 × 70 × 95 cm',scale:[200/180,1,1],glb:'models/couchy-200.glb',usdz:'models/couchy-200.usdz'}]}
].map(x=>{x.glb='models/'+x.id+'.glb';x.usdz='models/'+x.id+'.usdz';x.poster='posters/'+x.id+'.webp';x.variants=(x.variants||[{id:'standard',label:'Standard',p:x.p,z:x.z,scale:[1,1,1],glb:x.glb,usdz:x.usdz}]);x.variants.forEach(v=>{v.finish=v.finish||x.finish;v.glb=v.glb||x.glb;v.usdz=v.usdz||x.usdz});x.p=Math.min(...x.variants.map(v=>v.p));x.z=x.variants[0].z;return x});
const cardPrice=it=>new Set(it.variants.map(v=>v.p)).size>1?'From '+fmt(it.p):fmt(it.p);

/* Decorative CSS objects in the hero */
function face(w,h,tr,s,cls,extra){return `<i class="${cls||''}" style="width:${w}px;height:${h}px;margin:${-h/2}px 0 0 ${-w/2}px;transform:${tr};--s:${s};${extra||''}"></i>`}
function shape(t,a,b,c){
 let h='';
 if(t==='box'){const w=a,hh=b,d=c;h=face(w,hh,`translateZ(${d/2}px)`,.12)+face(w,hh,`rotateY(180deg) translateZ(${d/2}px)`,.4)+face(d,hh,`rotateY(90deg) translateZ(${w/2}px)`,.22)+face(d,hh,`rotateY(-90deg) translateZ(${w/2}px)`,.3)+face(w,d,`rotateX(90deg) translateZ(${hh/2}px)`,0)+face(w,d,`rotateX(-90deg) translateZ(${hh/2}px)`,.4)}
 else if(t==='cyl'){const r=a,hh=b,n=14,w=2*r*Math.tan(Math.PI/n)+1,ap=r*Math.cos(Math.PI/n);for(let i=0;i<n;i++)h+=face(w,hh,`rotateY(${i*360/n}deg) translateZ(${ap}px)`,(.05+.35*Math.abs(Math.sin(i*2*Math.PI/n))).toFixed(2));h+=face(2*r,2*r,`rotateX(90deg) translateZ(${hh/2}px)`,0,'r')+face(2*r,2*r,`rotateX(-90deg) translateZ(${hh/2}px)`,.4,'r')}
 else if(t==='pyr'){const bs=a,hh=b,s=Math.hypot(hh,bs/2),ang=Math.atan(bs/2/hh)*180/Math.PI;for(let i=0;i<4;i++)h+=`<i style="width:${bs}px;height:${s}px;margin:${hh/2-s}px 0 0 ${-bs/2}px;transform-origin:50% 100%;transform:rotateY(${i*90}deg) translateZ(${bs/2}px) rotateX(${ang}deg);clip-path:polygon(50% 0,0 100%,100% 100%);--s:${[.05,.25,.4,.18][i]}"></i>`;h+=face(bs,bs,`rotateX(-90deg) translateZ(${hh/2}px)`,.4)}
 else{const r=a,bw=Math.max(3,r/9);['rotateY(0)','rotateY(90deg)','rotateX(90deg)'].forEach(tr=>h+=face(2*r,2*r,tr,0,'r ring',`border-width:${bw}px`))}
 return h;
}
const cssObject=(type,col)=>{const o=document.createElement('div');o.className='o';o.style.setProperty('--c',col);o.innerHTML=shape(...type);return o};
const field=[
 ['orb',62,0,0,14,22,1,1.4,'#FF5A2B'],['box',110,60,110,83,19,1,1.8,'#0A0C10'],['cyl',40,120,0,91,62,1.1,1,'#F4F5F7',1],
 ['pyr',100,120,0,8,70,1,1.6,'#FF5A2B',1],['box',150,40,90,30,84,.9,.8,'#F4F5F7'],['orb',40,0,0,71,84,1,2,'#0A0C10'],
 ['cyl',28,76,0,41,13,1,.6,'#0A0C10'],['pyr',62,84,0,21,47,.9,.5,'#7B818A'],['cyl',52,30,0,79,42,1,1.2,'#FF5A2B'],
 ['box',92,92,42,4,31,.9,.7,'#7B818A'],['orb',26,0,0,54,8,1,.5,'#FF5A2B'],['pyr',70,92,0,95,32,.8,.4,'#0A0C10'],
 ['box',64,64,64,59,88,.9,1.1,'#0A0C10'],['cyl',34,46,0,66,9,.8,.9,'#F4F5F7']
];
const rnd=i=>{const x=Math.sin(i*12.9898+1.7)*43758.5453;return x-Math.floor(x)},heroObjects=[];
field.forEach((f,i)=>{
 const wrap=document.createElement('div');wrap.className='f'+(f[9]?' front':'');wrap.style.cssText=`left:${f[4]}%;top:${f[5]}%;--s:${f[6]};--d:${f[7]}`;
 const fl=document.createElement('div');fl.className='fl';const r=(n,m)=>((rnd(i*11+n)-.5)*m).toFixed(0)+'px';fl.style.cssText=`--fx:${r(1,140)};--fy:${r(2,150)};--gx:${r(3,140)};--gy:${r(4,150)};--t:${(8+rnd(i+3)*9).toFixed(1)}s;--dl:${(-rnd(i+5)*14).toFixed(1)}s`;
 const o=cssObject([f[0],f[1],f[2],f[3]],f[8]);o.style.setProperty('--sp',(16+rnd(i+7)*20).toFixed(0)+'s');fl.appendChild(o);wrap.appendChild(fl);$('#field').appendChild(wrap);
 const rad=(f[0]==='orb'?f[1]:f[0]==='box'?Math.max(f[1],f[2],f[3])*.62:f[0]==='cyl'?Math.max(f[1],f[2]/2):Math.max(f[1],f[2])*.6)*f[6];heroObjects.push({el:wrap,x:f[4],y:f[5],r:rad,ox:0,oy:0,vx:0,vy:0});
});
splashProgress(14);

/* Product grid: static posters scroll with the cards; one shared canvas appears only on hover. */
const grid=$('#grid'),cards=[];
items.forEach((it,i)=>{
 const card=document.createElement('article');card.className='card';if(new Set(it.variants.map(v=>v.p)).size>1)card.classList.add('multi-price');card.tabIndex=0;card.dataset.g=it.g;card.dataset.i=i;card.setAttribute('role','button');card.setAttribute('aria-label',`${it.n}, ${cardPrice(it)}. Open details`);
 card.innerHTML=`<span class="tag">${it.c}</span><span class="go" aria-hidden="true">↗</span><div class="stage"><img class="product-poster" src="${it.poster}" alt="" width="800" height="600" loading="eager" decoding="async"><b class="sd"></b></div><div class="meta"><div><h3>${it.n}</h3><p>${it.m}</p></div><span>${cardPrice(it)}</span></div>`;
 grid.appendChild(card);cards.push(card);
});
const chips=$('#chips');
['All',...new Set(items.map(i=>i.g))].forEach((group,i)=>{
 const b=document.createElement('button');b.textContent=group;b.setAttribute('aria-pressed',i===0);
 b.onclick=()=>{stopHover();chips.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));cards.forEach(k=>k.classList.toggle('hide',group!=='All'&&k.dataset.g!==group))};chips.appendChild(b);
});
splashProgress(20);

/* Shared model cache. Models are fetched only when a card is hovered or opened. */
const gltfLoader=new T.GLTFLoader();
const modelStates=items.map(()=>({progress:0,listeners:new Set(),promise:null,master:null,fit:1,realH:1,size:null,error:null}));
function notifyModel(st,p){st.progress=Math.round(clamp(p,0,100));st.listeners.forEach(fn=>fn(st.progress))}
function ensureModel(i,onProgress){
 const st=modelStates[i];if(onProgress){st.listeners.add(onProgress);onProgress(st.progress)}
 if(!st.promise){st.promise=new Promise((resolve,reject)=>{let synthetic=0;const timer=setInterval(()=>{synthetic=Math.min(90,synthetic+5);notifyModel(st,Math.max(st.progress,synthetic))},90);
  gltfLoader.load(items[i].glb,g=>{clearInterval(timer);const obj=g.scene;obj.traverse(node=>{if(!node.isMesh)return;node.castShadow=true;node.receiveShadow=true;const materials=Array.isArray(node.material)?node.material:[node.material];materials.forEach(m=>{if(!m||m.userData.rfEnhanced)return;m.userData.rfEnhanced=true;if(m.color)m.color.multiplyScalar(.96);if('roughness'in m)m.roughness=.72;if('envMapIntensity'in m)m.envMapIntensity=1.08;if(m.map){m.map.anisotropy=8;m.map.needsUpdate=true}m.dithering=true;m.needsUpdate=true})});const box=new T.Box3().setFromObject(obj),center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());obj.position.sub(center);const master=new T.Group(),fit=2.6/Math.max(size.x,size.y,size.z);master.add(obj);master.scale.setScalar(fit);st.master=master;st.fit=fit;st.realH=size.y;st.size=size;notifyModel(st,100);resolve(st)},e=>{if(e.total)notifyModel(st,Math.max(st.progress,e.loaded/e.total*100))},e=>{clearInterval(timer);st.error=e;reject(e)})});}
 return st.promise.finally(()=>{if(onProgress)st.listeners.delete(onProgress)});
}
function configureRenderer(renderer,dpr){renderer.setPixelRatio(Math.min(devicePixelRatio,dpr));renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.92;renderer.physicallyCorrectLights=true;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.setClearColor(0x000000,0)}
function litScene(env,shadowSize){const s=new T.Scene();s.environment=env;s.add(new T.HemisphereLight(0xfffbf3,0x647084,.38));const key=new T.DirectionalLight(0xffead4,2.15);key.position.set(4.5,6,4.5);key.castShadow=true;key.shadow.mapSize.set(shadowSize,shadowSize);key.shadow.radius=4;Object.assign(key.shadow.camera,{left:-4,right:4,top:4,bottom:-4,near:.1,far:18});key.shadow.camera.updateProjectionMatrix();key.shadow.bias=-.00025;s.add(key);const fill=new T.DirectionalLight(0xc5dcff,.55);fill.position.set(-4,2,3);s.add(fill);const rim=new T.DirectionalLight(0xffcfaa,.72);rim.position.set(-3,4,-5);s.add(rim);return s}
function environment(renderer){const pmrem=new T.PMREMGenerator(renderer),texture=pmrem.fromScene(new T.RoomEnvironment(),.02).texture;pmrem.dispose();return texture}

/* Demand-rendered card hover preview — zero WebGL frames while scrolling. */
const hoverCanvas=$('#hovergl');
let hoverRenderer=null,hoverScene=null,hoverRoot=null,hoverCamera=null,hoverCard=null,hoverStage=null,hoverRAF=0,hoverToken=0,hoverAngle=0,hoverLast=0;
function initHover(){if(hoverRenderer)return;hoverRenderer=new T.WebGLRenderer({canvas:hoverCanvas,antialias:true,alpha:true,powerPreference:'high-performance'});configureRenderer(hoverRenderer,1.5);hoverScene=litScene(environment(hoverRenderer),512);hoverRoot=new T.Group();hoverScene.add(hoverRoot);hoverCamera=new T.PerspectiveCamera(28,1,.01,50);hoverCamera.position.set(0,0,6.4)}
function hoverFrame(now){if(!hoverCard||document.hidden){hoverRAF=0;return}const dt=Math.min((now-hoverLast)/1000,.05);hoverLast=now;hoverAngle+=dt*.9;hoverRoot.rotation.set(.12,hoverAngle,0);hoverRenderer.render(hoverScene,hoverCamera);hoverRAF=requestAnimationFrame(hoverFrame)}
function stopHover(){hoverToken++;if(hoverRAF)cancelAnimationFrame(hoverRAF);hoverRAF=0;if(hoverStage)hoverStage.classList.remove('hover-live');hoverCard=hoverStage=null;if(hoverCanvas.parentElement!==document.body)document.body.appendChild(hoverCanvas)}
async function startHover(i,card){
 if(!CAN_HOVER||RM||currentCard)return;stopHover();const token=++hoverToken;hoverCard=card;hoverStage=card.querySelector('.stage');
 try{const st=await ensureModel(i);if(token!==hoverToken||!card.matches(':hover'))return;initHover();while(hoverRoot.children.length)hoverRoot.remove(hoverRoot.children[0]);hoverRoot.add(st.master.clone(true));hoverAngle=0;hoverRoot.rotation.set(.12,0,0);hoverStage.appendChild(hoverCanvas);const w=Math.max(1,hoverStage.clientWidth),h=Math.max(1,hoverStage.clientHeight);hoverRenderer.setSize(w,h,false);hoverCamera.aspect=w/h;hoverCamera.updateProjectionMatrix();hoverRenderer.render(hoverScene,hoverCamera);requestAnimationFrame(()=>hoverStage&&hoverStage.classList.add('hover-live'));hoverLast=performance.now();hoverRAF=requestAnimationFrame(hoverFrame)}
 catch(e){if(token===hoverToken)showToast('The 3D preview could not be loaded.')}
}
cards.forEach((card,i)=>{card.addEventListener('pointerenter',()=>startHover(i,card));card.addEventListener('pointerleave',stopHover)});
addEventListener('scroll',()=>{if(hoverCard)stopHover()},{passive:true});

/* Interactive product viewer, created lazily and rendered only while the sheet is open. */
const viewerArea=$('#viewerArea'),viewCanvas=$('#viewer');
let viewRenderer=null,viewScene=null,viewRoot=null,viewCamera=null,viewModel=null,viewIndex=-1,selectedVariantIndex=0,selectedVariant=null,viewToken=0,viewX=.28,viewY=-.55,viewDistance=5.8,viewAuto=!RM,viewDragging=false,viewW=0,viewH=0,viewRAF=0,viewLast=0;
function initViewer(){if(viewRenderer)return;viewRenderer=new T.WebGLRenderer({canvas:viewCanvas,antialias:true,alpha:true,powerPreference:'high-performance'});configureRenderer(viewRenderer,innerWidth<=820?1.65:2);viewScene=litScene(environment(viewRenderer),1024);viewRoot=new T.Group();viewScene.add(viewRoot);viewCamera=new T.PerspectiveCamera(32,1,.01,50)}
function baseDistance(){return viewCamera&&viewCamera.aspect<.9?7:5.5}
function sizeViewer(){if(!viewRenderer)return;const w=Math.max(1,viewerArea.clientWidth),h=Math.max(1,viewerArea.clientHeight);if(w===viewW&&h===viewH)return;viewW=w;viewH=h;viewRenderer.setSize(w,h,false);viewCamera.aspect=w/h;viewCamera.updateProjectionMatrix()}
function updateAutoButton(){$('#autoView').textContent=viewAuto?'Pause rotation':'Resume rotation'}
function resetViewer(){initViewer();sizeViewer();viewX=.28;viewY=-.55;viewDistance=baseDistance();viewAuto=!RM;updateAutoButton()}
function viewProgress(p){$('#modelPct').textContent=p+'%';$('#modelFill').style.width=p+'%'}
function viewFrame(now){if(!sheet.classList.contains('show')||document.hidden){viewRAF=0;return}const dt=Math.min((now-viewLast)/1000,.05);viewLast=now;sizeViewer();if(viewAuto&&!viewDragging)viewY+=dt*.32;viewRoot.rotation.set(viewX,viewY,0);viewCamera.position.set(0,0,viewDistance);viewRenderer.render(viewScene,viewCamera);viewRAF=requestAnimationFrame(viewFrame)}
function startViewerLoop(){if(viewRAF)return;viewLast=performance.now();viewRAF=requestAnimationFrame(viewFrame)}
function stopViewerLoop(){if(viewRAF)cancelAnimationFrame(viewRAF);viewRAF=0}
function applyViewerVariant(){if(!viewModel||viewIndex<0||!selectedVariant)return;const st=modelStates[viewIndex],s=selectedVariant.scale;viewModel.scale.set(st.fit*s[0],st.fit*s[1],st.fit*s[2])}
async function showViewerModel(i){
 initViewer();const token=++viewToken;viewIndex=i;viewModel=null;while(viewRoot.children.length)viewRoot.remove(viewRoot.children[0]);$('#modelLoad small').textContent='Loading model';$('#modelLoad').classList.remove('off');$('.viewer-shadow').style.opacity=0;viewProgress(0);resetViewer();startViewerLoop();
 try{const st=await ensureModel(i,viewProgress);if(token!==viewToken)return;viewModel=st.master.clone(true);applyViewerVariant();viewRoot.add(viewModel);viewProgress(100);setTimeout(()=>{if(token===viewToken){$('#modelLoad').classList.add('off');$('.viewer-shadow').style.opacity=.55}},160)}
 catch(e){if(token!==viewToken)return;$('#modelLoad small').textContent='Could not load model';showToast('The 3D model could not be loaded.')}
}
$('#resetView').onclick=e=>{e.stopPropagation();resetViewer()};
$('#autoView').onclick=e=>{e.stopPropagation();viewAuto=!viewAuto;updateAutoButton()};
const pointers=new Map();let lastPoint=null,pinchStart=0,pinchZoom=0;
viewerArea.addEventListener('pointerdown',e=>{if(e.target.closest('button,a'))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});viewerArea.setPointerCapture(e.pointerId);viewDragging=true;viewerArea.classList.add('drag');viewAuto=false;updateAutoButton();if(pointers.size===1)lastPoint={x:e.clientX,y:e.clientY};if(pointers.size===2){const p=[...pointers.values()];pinchStart=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);pinchZoom=viewDistance}});
viewerArea.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const p=[...pointers.values()],d=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);if(d>10)viewDistance=clamp(pinchZoom*pinchStart/d,3.4,9)}else if(lastPoint){viewY+=(e.clientX-lastPoint.x)*.012;viewX=clamp(viewX+(e.clientY-lastPoint.y)*.01,-1.2,1.2);lastPoint={x:e.clientX,y:e.clientY}}});
function endPointer(e){pointers.delete(e.pointerId);if(pointers.size===1){const p=[...pointers.values()][0];lastPoint={x:p.x,y:p.y}}else if(!pointers.size){lastPoint=null;viewDragging=false;viewerArea.classList.remove('drag')}}
viewerArea.addEventListener('pointerup',endPointer);viewerArea.addEventListener('pointercancel',endPointer);
viewerArea.addEventListener('wheel',e=>{if(!sheet.classList.contains('show'))return;e.preventDefault();viewAuto=false;updateAutoButton();viewDistance=clamp(viewDistance+e.deltaY*.006,3.4,9)},{passive:false});

/* Details: a product card grows into the full viewer and information sheet. */
const sheet=$('#sheet');let currentCard=null,detailBusy=false;
const rect=el=>{const r=el.getBoundingClientRect();return{left:r.left,top:r.top,width:r.width,height:r.height}};
const setSheetBox=(b,r)=>Object.assign(sheet.style,{left:b.left+'px',top:b.top+'px',width:b.width+'px',height:b.height+'px',borderRadius:r+'px'});
const full=()=>{const m=Math.min(20,innerWidth*.02),b={left:m,top:m,width:innerWidth-2*m,height:innerHeight-2*m};document.documentElement.style.setProperty('--W',b.width+'px');document.documentElement.style.setProperty('--H',b.height+'px');return b};
function setVariant(i,vi){
 const it=items[i],v=it.variants[vi]||it.variants[0];selectedVariantIndex=it.variants.indexOf(v);selectedVariant=v;$('#s-price').textContent=fmt(v.p);$('#s-finish').textContent=v.finish;$('#viewSize').textContent=v.z;$('#arLink').href=v.usdz+'#allowsContentScaling=0';
 $('#s-spec').innerHTML=`<dt>Material</dt><dd>${it.m}</dd><dt>Dimensions</dt><dd>${v.z}</dd><dt>Delivery</dt><dd>14–21 days</dd><dt>Warranty</dt><dd>2 years</dd><dt>AR scale</dt><dd>1:1 real size</dd>`;$('#variantOptions').querySelectorAll('button').forEach((b,n)=>b.setAttribute('aria-pressed',n===selectedVariantIndex));applyViewerVariant();
}
function fillDetails(i){
 const it=items[i];viewIndex=i;$('#s-cat').textContent=it.c;$('#s-name').textContent=it.n;$('#s-desc').textContent=it.d;const variants=$('#variants');variants.hidden=it.variants.length<2;$('#variantOptions').innerHTML=it.variants.map((v,n)=>`<button type="button" data-variant="${n}" aria-pressed="${n===0}">${v.label}</button>`).join('');setVariant(i,0);
 const add=$('#add');add.classList.remove('ok');add.textContent='Add to cart';showViewerModel(i);
}
$('#variantOptions').onclick=e=>{const b=e.target.closest('button[data-variant]');if(b&&viewIndex>=0)setVariant(viewIndex,+b.dataset.variant)};
function openDetails(card){
 if(detailBusy)return;stopHover();detailBusy=true;currentCard=card;const i=+card.dataset.i;fillDetails(i);sheet.classList.add('show');sheet.classList.remove('open');sheet.style.transition='none';full();setSheetBox(rect(card),30);sheet.offsetWidth;sheet.style.transition='';card.classList.add('gone');document.body.classList.add('lock','detail-open');requestAnimationFrame(()=>{sheet.classList.add('open');setSheetBox(full(),32)});setTimeout(()=>{detailBusy=false;$('#close').focus()},780);
}
function closeDetails(){if(!currentCard||detailBusy)return;detailBusy=true;sheet.classList.remove('open');setSheetBox(rect(currentCard),30);setTimeout(()=>{sheet.classList.remove('show');currentCard.classList.remove('gone');currentCard.focus({preventScroll:true});currentCard=null;document.body.classList.remove('lock','detail-open');detailBusy=false;stopViewerLoop()},760)}
grid.addEventListener('click',e=>{const c=e.target.closest('.card');if(c)openDetails(c)});
grid.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('card')){e.preventDefault();openDetails(e.target)}});$('#close').onclick=closeDetails;

/* Local, persistent cart */
let cartData={};try{cartData=JSON.parse(localStorage.getItem('3d-furniture-cart-v3'))||{}}catch(e){}
function cartEntry(key){const split=key.split('::'),it=items.find(x=>x.id===split[0]);if(!it)return null;const variant=it.variants.find(v=>v.id===split[1])||it.variants[0];return{it,variant}}
function saveCart(){try{localStorage.setItem('3d-furniture-cart-v3',JSON.stringify(cartData))}catch(e){}renderCart()}
function renderCart(){
 let count=0,total=0,rows=[];for(const [key,raw] of Object.entries(cartData)){const q=Math.max(0,Math.floor(+raw||0)),entry=cartEntry(key);if(entry&&q){cartData[key]=q;count+=q;total+=entry.variant.p*q;rows.push({key,q,...entry})}else delete cartData[key]}$('#cart b').textContent=count;$('#subtotal').textContent=fmt(total);const box=$('#cartItems');
 if(!count){box.innerHTML='<div class="cart-empty"><strong>Your cart is empty</strong><span>Choose a piece from the collection.</span></div>';return}
 box.innerHTML=rows.map(({key,q,it,variant})=>`<div class="cart-row" data-key="${key}"><div class="cart-num">${String(items.indexOf(it)+1).padStart(2,'0')}</div><div class="cart-copy"><strong>${it.n}</strong><small>${it.variants.length>1?variant.label+' · ':''}${fmt(variant.p)}</small></div><div class="cart-actions"><button data-act="minus" aria-label="Remove one ${it.n}">−</button><b>${q}</b><button data-act="plus" aria-label="Add one ${it.n}">+</button><button class="cart-remove" data-act="remove" aria-label="Remove ${it.n}">✕</button></div></div>`).join('');
}
let cartOpen=false;
function openCart(){cartOpen=true;stopHover();renderCart();$('#cartShade').classList.add('show');$('#cartShade').setAttribute('aria-hidden','false');document.body.classList.add('cart-open');setTimeout(()=>$('#cartClose').focus(),400)}
function closeCart(){if(!cartOpen)return;cartOpen=false;$('#cartShade').classList.remove('show');$('#cartShade').setAttribute('aria-hidden','true');document.body.classList.remove('cart-open');$('#cart').focus({preventScroll:true})}
$('#cart').onclick=openCart;$('#cartClose').onclick=closeCart;$('#cartBackdrop').onclick=closeCart;
$('#cartItems').onclick=e=>{const b=e.target.closest('button[data-act]');if(!b)return;const key=b.closest('.cart-row').dataset.key,act=b.dataset.act;if(act==='plus')cartData[key]++;else if(act==='minus'){cartData[key]--;if(cartData[key]<=0)delete cartData[key]}else delete cartData[key];saveCart()};
$('#add').onclick=function(){if(viewIndex<0||!selectedVariant)return;const it=items[viewIndex],key=it.id+'::'+selectedVariant.id;cartData[key]=(cartData[key]||0)+1;saveCart();$('#cart').classList.add('pop');setTimeout(()=>$('#cart').classList.remove('pop'),300);this.classList.add('ok');this.textContent='Added to cart';$('#announce').textContent=it.n+' '+(it.variants.length>1?selectedVariant.label+' ':'')+'added to cart';setTimeout(()=>{this.classList.remove('ok');this.textContent='Add to cart'},1200)};
$('#checkout').onclick=()=>showToast('Checkout will be connected in the next store phase.');renderCart();

/* Toast */
let toastTimer=0;function showToast(message){const t=$('#toast');t.textContent=message;t.classList.add('s');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('s'),3400)}

/* Mobile AR: Quick Look on iPhone, WebXR or Scene Viewer on Android. */
let quickLook=false;try{quickLook=document.createElement('a').relList.supports('ar')}catch(e){}
const coarse=matchMedia('(pointer:coarse)').matches||innerWidth<=820;if(coarse)(quickLook?$('#arLink'):$('#arBtn')).classList.add('ok');
let arRenderer=null,arScene=null,arCamera=null,arRoot=null,reticle=null,hitSource=null,arSession=null,arState=null;
function initARRenderer(){if(arRenderer)return;arRenderer=new T.WebGLRenderer({canvas:$('#arCanvas'),antialias:true,alpha:true,powerPreference:'high-performance'});configureRenderer(arRenderer,1.65);arRenderer.setSize(innerWidth,innerHeight);arRenderer.xr.enabled=true;arScene=new T.Scene();arCamera=new T.PerspectiveCamera(60,innerWidth/innerHeight,.01,50);arScene.add(new T.HemisphereLight(0xfffbf3,0x59677a,.62));const light=new T.DirectionalLight(0xffecd8,1.55);light.position.set(3,5,4);arScene.add(light);const fill=new T.DirectionalLight(0xc9dcff,.38);fill.position.set(-3,2,2);arScene.add(fill);arRoot=new T.Group();arScene.add(arRoot);reticle=new T.Mesh(new T.RingGeometry(.07,.095,32).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0xffffff}));reticle.matrixAutoUpdate=false;reticle.visible=false;arScene.add(reticle)}
function openSceneViewer(it,variant){const file=new URL((variant||it.variants[0]).glb,location.href).href;location.href='intent://arvr.google.com/scene-viewer/1.0?file='+encodeURIComponent(file)+'&mode=ar_only&resizable=false&title='+encodeURIComponent(it.n+' '+(variant?variant.label:''))+'#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url='+encodeURIComponent(location.href)+';end;'}
async function startAR(){
 if(viewIndex<0)return;const it=items[viewIndex],variant=selectedVariant||it.variants[0],android=/Android/i.test(navigator.userAgent);if(!navigator.xr){if(android)openSceneViewer(it,variant);else showToast('AR is available in Safari on iPhone or Chrome on a supported Android phone.');return}let pendingSession=null;
 try{pendingSession=await navigator.xr.requestSession('immersive-ar',{requiredFeatures:['hit-test'],optionalFeatures:['dom-overlay'],domOverlay:{root:$('#xr')}});const st=await ensureModel(viewIndex);initARRenderer();while(arRoot.children.length)arRoot.remove(arRoot.children[0]);arRoot.add(st.master.clone(true));arRoot.scale.set(variant.scale[0]/st.fit,variant.scale[1]/st.fit,variant.scale[2]/st.fit);arRoot.rotation.set(0,viewY,0);arRoot.position.set(0,0,0);arRoot.visible=false;arState={...st,variant};const s=pendingSession;arSession=s;document.body.classList.add('ar-mode');stopViewerLoop();arRenderer.xr.setReferenceSpaceType('local');await arRenderer.xr.setSession(s);hitSource=await s.requestHitTestSource({space:await s.requestReferenceSpace('viewer')});s.addEventListener('select',()=>{if(reticle.visible){arRoot.position.setFromMatrixPosition(reticle.matrix);arRoot.position.y+=arState.realH*arState.variant.scale[1]/2;arRoot.visible=true}});s.addEventListener('end',endAR);arRenderer.setAnimationLoop(renderAR);showToast('Move your phone to find the floor, then tap to place.')}
 catch(e){if(pendingSession&&!arSession)pendingSession.end().catch(()=>{});document.body.classList.remove('ar-mode');if(android&&(!e||e.name==='NotSupportedError'))openSceneViewer(it,variant);else showToast('Could not start AR. Check camera permission and try again.')}
}
function renderAR(t,frame){if(frame&&hitSource){const hits=frame.getHitTestResults(hitSource);if(hits.length){const pose=hits[0].getPose(arRenderer.xr.getReferenceSpace());reticle.visible=true;reticle.matrix.fromArray(pose.transform.matrix)}else reticle.visible=false}arRenderer.render(arScene,arCamera)}
function endAR(){if(hitSource&&hitSource.cancel)hitSource.cancel();hitSource=null;reticle&&(reticle.visible=false);arRoot&&(arRoot.visible=false);arRenderer&&arRenderer.setAnimationLoop(null);arSession=null;document.body.classList.remove('ar-mode');sheet.classList.contains('show')&&startViewerLoop()}
$('#arBtn').onclick=startAR;$('#exitAR').addEventListener('beforexrselect',e=>e.preventDefault());$('#exitAR').onclick=()=>arSession&&arSession.end();

/* Intro/store scroll hand-off */
const intro=$('#intro'),hd=$('#hd');let scrollLock=false,scrollTick=0;
const go=y=>{scrollLock=true;scrollTo({top:y,behavior:RM?'auto':'smooth'});setTimeout(()=>scrollLock=false,RM?50:950)},introEnd=()=>intro.offsetHeight-44;
function direction(down,e){if(currentCard||cartOpen||arSession||RM)return;const y=scrollY,h=introEnd();if(scrollLock){e.cancelable&&e.preventDefault();return}if(down&&y<h-4){e.cancelable&&e.preventDefault();go(h)}else if(!down&&y>h-40&&y<h+60){e.cancelable&&e.preventDefault();go(0)}}
addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>2)direction(e.deltaY>0,e)},{passive:false});let touchY=0;
addEventListener('touchstart',e=>touchY=e.touches[0].clientY,{passive:true});addEventListener('touchmove',e=>{const d=touchY-e.touches[0].clientY;if(Math.abs(d)>24){direction(d>0,e);touchY=e.touches[0].clientY}},{passive:false});
addEventListener('keydown',e=>{if(e.key==='Escape'){if(arSession)arSession.end();else if(cartOpen)closeCart();else closeDetails();return}if(['ArrowDown','PageDown',' '].includes(e.key)&&!/BUTTON|ARTICLE/.test(document.activeElement.tagName))direction(true,e);else if(['ArrowUp','PageUp'].includes(e.key))direction(false,e)});
$('#nav').onclick=e=>{e.preventDefault();go(introEnd())};
addEventListener('scroll',()=>{if(scrollTick)return;scrollTick=1;requestAnimationFrame(()=>{scrollTick=0;const y=scrollY;if(y<innerHeight*1.1)intro.style.setProperty('--p',Math.min(y/innerHeight,1).toFixed(3));hd.classList.toggle('sc',y>innerHeight*.8)})},{passive:true});

/* Hero cursor physics — scheduled only while the pointer is disturbing an object. */
let heroScale=1,heroW=0,heroH=0,cursorX=-9999,cursorY=-9999,heroRAF=0;
function physics(){let live=false;for(const o of heroObjects){const dx=o.x*heroW/100+o.ox-cursorX,dy=o.y*heroH/100+o.oy-cursorY,d=Math.hypot(dx,dy)||1,R=o.r*heroScale+80;if(d<R){const f=(1-d/R)**2*3.4;o.vx+=dx/d*f;o.vy+=dy/d*f}o.vx-=o.ox*.016;o.vy-=o.oy*.016;o.vx*=.9;o.vy*=.9;o.ox+=o.vx;o.oy+=o.vy;if(Math.abs(o.vx)+Math.abs(o.vy)+Math.abs(o.ox)+Math.abs(o.oy)>.08){live=true;const s=o.el.style;s.setProperty('--ox',o.ox.toFixed(1));s.setProperty('--oy',o.oy.toFixed(1));s.setProperty('--rz',(o.vx*1.6).toFixed(1))}}heroRAF=live&&!intro.classList.contains('off')?requestAnimationFrame(physics):0}
const aim=e=>{if(RM||intro.classList.contains('off'))return;const r=intro.getBoundingClientRect();cursorX=e.clientX-r.left;cursorY=e.clientY-r.top;if(!heroRAF)heroRAF=requestAnimationFrame(physics)},away=()=>{cursorX=cursorY=-9999};addEventListener('pointermove',aim,{passive:true});addEventListener('pointerdown',aim,{passive:true});addEventListener('pointerup',away);document.documentElement.addEventListener('mouseleave',away);new IntersectionObserver(([e])=>intro.classList.toggle('off',!e.isIntersecting)).observe(intro);
function fitHero(){heroScale=Math.min(Math.max(Math.min(innerWidth/1300,innerHeight/780),.5),1.15);document.documentElement.style.setProperty('--k',heroScale.toFixed(2));heroW=intro.clientWidth;heroH=intro.clientHeight}

/* Card entrance only; no 3D is downloaded or rendered here. */
const cardObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const card=e.target,i=+card.dataset.i;card.style.transitionDelay=(i%4*70)+'ms';card.classList.add('v');setTimeout(()=>card.style.transitionDelay='',900);cardObserver.unobserve(card)}}),{threshold:.08,rootMargin:'180px 0px'});cards.forEach(c=>cardObserver.observe(c));

function resize(){fitHero();if(viewRenderer){viewW=viewH=0;sizeViewer()}if(currentCard&&!detailBusy)setSheetBox(full(),32);if(arRenderer)arRenderer.setSize(innerWidth,innerHeight);if(hoverCard)stopHover()}
addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{if(document.hidden){stopHover();stopViewerLoop()}else if(sheet.classList.contains('show'))startViewerLoop()});fitHero();updateAutoButton();

/* The opening splash waits for the lightweight collection posters and page assets, not the on-demand GLBs. */
async function finishSplash(){
 const images=cards.map(c=>c.querySelector('.product-poster'));let done=0;await Promise.all(images.map(img=>(img.complete?Promise.resolve():new Promise(r=>{img.addEventListener('load',r,{once:true});img.addEventListener('error',r,{once:true})})).then(()=>img.decode?img.decode().catch(()=>{}):null).finally(()=>{done++;splashProgress(20+done/images.length*70)})));
 if(document.readyState!=='complete')await new Promise(r=>addEventListener('load',r,{once:true}));splashProgress(100);await new Promise(r=>setTimeout(r,Math.max(120,900-(performance.now()-splashStarted))));requestAnimationFrame(()=>{$('#splash').classList.add('off');document.body.classList.remove('is-loading')});
}
finishSplash();
})();
