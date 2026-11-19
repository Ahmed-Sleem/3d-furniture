(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],T=THREE;
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const fmt=n=>'$'+n.toLocaleString('en-US');

const items=[
 {id:'sofa',n:'Leather sofa',c:'Seating',p:640,m:'Leather and carved wood',z:'181 × 71 × 82 cm',finish:'Deep charcoal leather',d:'A generous leather sofa with a sculpted timber frame and deep cushioning. Designed as the grounding piece for a calm living room.'},
 {id:'armchair',n:'Armchair',c:'Seating',p:520,m:'Leather and solid wood',z:'82 × 102 × 99 cm',finish:'Black leather, natural timber',d:'A relaxed armchair with broad timber arms and a softly structured leather seat. Comfortable from every angle.'},
 {id:'lounge',n:'Lounge chair',c:'Seating',p:390,m:'Upholstery and timber',z:'101 × 117 × 119 cm',finish:'Original model finish',d:'A low lounge chair built for long, unhurried sitting. Its wide profile gives it presence without visual weight.'},
 {id:'dining',n:'Dining chair',c:'Seating',p:240,m:'Wood and upholstery',z:'43 × 97 × 58 cm',finish:'Original model finish',d:'A compact dining chair with balanced proportions and a supportive back, made to work around tables large or small.'},
 {id:'roundtable',n:'Round table',c:'Tables',p:310,m:'Wood and metal',z:'130 × 49 × 130 cm',finish:'Original model finish',d:'A broad round table that keeps conversation open and movement easy. Its low profile works especially well in lounge settings.'},
 {id:'coffeetable',n:'Coffee table',c:'Tables',p:450,m:'Solid wood',z:'120 × 39 × 60 cm',finish:'Natural wood',d:'A clean rectangular coffee table with enough surface for books, objects and the everyday rituals of a living room.'},
 {id:'sidetable',n:'Side table',c:'Tables',p:280,m:'Wood',z:'55 × 55 × 45 cm',finish:'Natural wood',d:'A compact companion table sized for a lamp, a cup or a favourite book. Easy to move wherever it is needed.'},
 {id:'shelves',n:'Shelving unit',c:'Storage',p:360,m:'Solid wood',z:'108 × 156 × 37 cm',finish:'Natural wood',d:'Open timber shelving that gives useful storage without closing off the room. Display objects, books and plants together.'}
].map(x=>({...x,glb:'models/'+x.id+'.glb',usdz:'models/'+x.id+'.usdz'}));

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
 const fl=document.createElement('div');fl.className='fl';const r=(n,m)=>((rnd(i*11+n)-.5)*m).toFixed(0)+'px';
 fl.style.cssText=`--fx:${r(1,140)};--fy:${r(2,150)};--gx:${r(3,140)};--gy:${r(4,150)};--t:${(8+rnd(i+3)*9).toFixed(1)}s;--dl:${(-rnd(i+5)*14).toFixed(1)}s`;
 const o=cssObject([f[0],f[1],f[2],f[3]],f[8]);o.style.setProperty('--sp',(16+rnd(i+7)*20).toFixed(0)+'s');fl.appendChild(o);wrap.appendChild(fl);$('#field').appendChild(wrap);
 const rad=(f[0]==='orb'?f[1]:f[0]==='box'?Math.max(f[1],f[2],f[3])*.62:f[0]==='cyl'?Math.max(f[1],f[2]/2):Math.max(f[1],f[2])*.6)*f[6];
 heroObjects.push({el:wrap,x:f[4],y:f[5],r:rad,ox:0,oy:0,vx:0,vy:0});
});

/* Product grid */
const cubeMarkup='<div class="load-stage"><div class="load-cube"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>';
const grid=$('#grid'),cards=[];
items.forEach((it,i)=>{
 const card=document.createElement('article');card.className='card';card.tabIndex=0;card.dataset.c=it.c;card.dataset.i=i;card.setAttribute('role','button');card.setAttribute('aria-label',`${it.n}, ${fmt(it.p)}. Open details`);
 card.innerHTML=`<span class="tag">${it.c}</span><span class="go" aria-hidden="true">↗</span><div class="stage"><div class="card-loader">${cubeMarkup}<span>Loading 0%</span></div><b class="sd"></b></div><div class="meta"><div><h3>${it.n}</h3><p>${it.m}</p></div><span>${fmt(it.p)}</span></div>`;
 grid.appendChild(card);cards.push(card);
});
const chips=$('#chips');
['All',...new Set(items.map(i=>i.c))].forEach((c,i)=>{
 const b=document.createElement('button');b.textContent=c;b.setAttribute('aria-pressed',i===0);
 b.onclick=()=>{chips.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));cards.forEach(k=>k.classList.toggle('hide',c!=='All'&&k.dataset.c!==c))};chips.appendChild(b);
});

/* Shared model loading */
const gltfLoader=new T.GLTFLoader();
const modelStates=items.map(()=>({progress:0,listeners:new Set(),promise:null,master:null,fit:1,realH:1,size:null,error:null}));
function notifyModel(st,p){st.progress=Math.round(clamp(p,0,100));st.listeners.forEach(fn=>fn(st.progress))}
function ensureModel(i,onProgress){
 const st=modelStates[i];if(onProgress){st.listeners.add(onProgress);onProgress(st.progress)}
 if(!st.promise){
  st.promise=new Promise((resolve,reject)=>{
   let synthetic=0;const timer=setInterval(()=>{synthetic=Math.min(90,synthetic+5);notifyModel(st,Math.max(st.progress,synthetic))},90);
   gltfLoader.load(items[i].glb,g=>{
    clearInterval(timer);const obj=g.scene,box=new T.Box3().setFromObject(obj),center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());
    obj.position.sub(center);obj.traverse(n=>{if(n.isMesh){n.castShadow=false;n.receiveShadow=false}});
    const master=new T.Group(),fit=2.6/Math.max(size.x,size.y,size.z);master.add(obj);master.scale.setScalar(fit);
    st.master=master;st.fit=fit;st.realH=size.y;st.size=size;notifyModel(st,100);resolve(st);
   },e=>{if(e.total)notifyModel(st,Math.max(st.progress,e.loaded/e.total*100))},e=>{clearInterval(timer);st.error=e;reject(e)});
  });
 }
 return st.promise.finally(()=>{if(onProgress)st.listeners.delete(onProgress)});
}

/* One WebGL renderer draws all product cards */
const cardRenderer=new T.WebGLRenderer({canvas:$('#cardgl'),antialias:true,alpha:true});
cardRenderer.setPixelRatio(Math.min(devicePixelRatio,1.5));cardRenderer.outputEncoding=T.sRGBEncoding;cardRenderer.setClearColor(0x000000,0);cardRenderer.autoClear=false;
const cardPMREM=new T.PMREMGenerator(cardRenderer),cardEnv=cardPMREM.fromScene(new T.RoomEnvironment(),.04).texture;cardPMREM.dispose();
function litScene(env){
 const s=new T.Scene();s.environment=env;s.add(new T.HemisphereLight(0xffffff,0x9aa2ac,.42));
 const key=new T.DirectionalLight(0xffffff,.9);key.position.set(3,5,4);s.add(key);const fill=new T.DirectionalLight(0xffffff,.24);fill.position.set(-4,-1,2);s.add(fill);return s;
}
const cardViews=items.map(()=>{const scene=litScene(cardEnv),root=new T.Group(),camera=new T.PerspectiveCamera(32,1,.01,50);scene.add(root);camera.position.set(0,0,5.7);return{scene,root,camera,ready:false,hover:false,angle:-.55}});
function sizeCardRenderer(){cardRenderer.setSize(innerWidth,innerHeight,false)}sizeCardRenderer();
async function prepareCard(i){
 const view=cardViews[i],card=cards[i];if(view.ready||view.loading)return;view.loading=true;
 try{const st=await ensureModel(i,p=>{const t=card.querySelector('.card-loader span');if(t)t.textContent='Loading '+p+'%'});view.root.add(st.master.clone(true));view.ready=true;card.classList.add('loaded')}
 catch(e){const t=card.querySelector('.card-loader span');if(t)t.textContent='Model unavailable'}
}
cards.forEach((card,i)=>{card.addEventListener('pointerenter',()=>cardViews[i].hover=true);card.addEventListener('pointerleave',()=>cardViews[i].hover=false)});

/* Interactive detail viewer */
const viewerArea=$('#viewerArea'),viewCanvas=$('#viewer');
const viewRenderer=new T.WebGLRenderer({canvas:viewCanvas,antialias:true,alpha:true});
viewRenderer.setPixelRatio(Math.min(devicePixelRatio,2));viewRenderer.outputEncoding=T.sRGBEncoding;viewRenderer.setClearColor(0x000000,0);
const viewPMREM=new T.PMREMGenerator(viewRenderer),viewEnv=viewPMREM.fromScene(new T.RoomEnvironment(),.04).texture;viewPMREM.dispose();
const viewScene=litScene(viewEnv),viewRoot=new T.Group(),viewCamera=new T.PerspectiveCamera(32,1,.01,50);viewScene.add(viewRoot);
let viewIndex=-1,viewToken=0,viewX=.28,viewY=-.55,viewDistance=5.8,viewAuto=!RM,viewDragging=false,viewW=0,viewH=0;
function baseDistance(){return viewCamera.aspect<.9?6.3:5.5}
function sizeViewer(){const w=Math.max(1,viewerArea.clientWidth),h=Math.max(1,viewerArea.clientHeight);if(w===viewW&&h===viewH)return;viewW=w;viewH=h;viewRenderer.setSize(w,h,false);viewCamera.aspect=w/h;viewCamera.updateProjectionMatrix()}
function updateAutoButton(){$('#autoView').textContent=viewAuto?'Pause rotation':'Resume rotation'}
function resetViewer(){sizeViewer();viewX=.28;viewY=-.55;viewDistance=baseDistance();viewAuto=!RM;updateAutoButton()}
function viewProgress(p){$('#modelPct').textContent=p+'%';$('#modelFill').style.width=p+'%'}
async function showViewerModel(i){
 const token=++viewToken;viewIndex=i;while(viewRoot.children.length)viewRoot.remove(viewRoot.children[0]);$('#modelLoad').classList.remove('off');$('.viewer-shadow').style.opacity=0;viewProgress(0);resetViewer();
 try{const st=await ensureModel(i,viewProgress);if(token!==viewToken)return;viewRoot.add(st.master.clone(true));viewProgress(100);setTimeout(()=>{if(token===viewToken){$('#modelLoad').classList.add('off');$('.viewer-shadow').style.opacity=1}},160)}
 catch(e){if(token!==viewToken)return;$('#modelLoad small').textContent='Could not load model';showToast('The 3D model could not be loaded.')}
}
$('#resetView').onclick=e=>{e.stopPropagation();resetViewer()};
$('#autoView').onclick=e=>{e.stopPropagation();viewAuto=!viewAuto;updateAutoButton()};
const pointers=new Map();let lastPoint=null,pinchStart=0,pinchZoom=0;
viewerArea.addEventListener('pointerdown',e=>{
 if(e.target.closest('button,a'))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});viewerArea.setPointerCapture(e.pointerId);viewDragging=true;viewerArea.classList.add('drag');viewAuto=false;updateAutoButton();
 if(pointers.size===1)lastPoint={x:e.clientX,y:e.clientY};
 if(pointers.size===2){const p=[...pointers.values()];pinchStart=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);pinchZoom=viewDistance}
});
viewerArea.addEventListener('pointermove',e=>{
 if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pointers.size===2){const p=[...pointers.values()],d=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);if(d>10)viewDistance=clamp(pinchZoom*pinchStart/d,3.4,9)}
 else if(lastPoint){viewY+=(e.clientX-lastPoint.x)*.012;viewX=clamp(viewX+(e.clientY-lastPoint.y)*.01,-1.2,1.2);lastPoint={x:e.clientX,y:e.clientY}}
});
function endPointer(e){pointers.delete(e.pointerId);if(pointers.size===1){const p=[...pointers.values()][0];lastPoint={x:p.x,y:p.y}}else if(!pointers.size){lastPoint=null;viewDragging=false;viewerArea.classList.remove('drag')}}
viewerArea.addEventListener('pointerup',endPointer);viewerArea.addEventListener('pointercancel',endPointer);
viewerArea.addEventListener('wheel',e=>{if(!$('#sheet').classList.contains('show'))return;e.preventDefault();viewAuto=false;updateAutoButton();viewDistance=clamp(viewDistance+e.deltaY*.006,3.4,9)},{passive:false});

/* Details: card expands into a full-screen sheet */
const sheet=$('#sheet');let currentCard=null,detailBusy=false;
const rect=el=>{const r=el.getBoundingClientRect();return{left:r.left,top:r.top,width:r.width,height:r.height}};
const setSheetBox=(b,r)=>Object.assign(sheet.style,{left:b.left+'px',top:b.top+'px',width:b.width+'px',height:b.height+'px',borderRadius:r+'px'});
const full=()=>{const m=Math.min(20,innerWidth*.02),b={left:m,top:m,width:innerWidth-2*m,height:innerHeight-2*m};document.documentElement.style.setProperty('--W',b.width+'px');document.documentElement.style.setProperty('--H',b.height+'px');return b};
function fillDetails(i){
 const it=items[i];$('#s-cat').textContent=it.c;$('#s-name').textContent=it.n;$('#s-price').textContent=fmt(it.p);$('#s-desc').textContent=it.d;$('#s-finish').textContent=it.finish;
 $('#s-spec').innerHTML=`<dt>Material</dt><dd>${it.m}</dd><dt>Size</dt><dd>${it.z}</dd><dt>AR scale</dt><dd>1:1 real size</dd>`;$('#viewSize').textContent=it.z;$('#arLink').href=it.usdz+'#allowsContentScaling=0';
 const add=$('#add');add.classList.remove('ok');add.textContent='Add to cart';showViewerModel(i);
}
function openDetails(card){
 if(detailBusy)return;detailBusy=true;currentCard=card;const i=+card.dataset.i;fillDetails(i);sheet.classList.add('show');sheet.classList.remove('open');sheet.style.transition='none';full();setSheetBox(rect(card),30);sheet.offsetWidth;sheet.style.transition='';card.classList.add('gone');document.body.classList.add('lock','detail-open');
 requestAnimationFrame(()=>{sheet.classList.add('open');setSheetBox(full(),32)});setTimeout(()=>{detailBusy=false;$('#close').focus()},780);
}
function closeDetails(){
 if(!currentCard||detailBusy)return;detailBusy=true;sheet.classList.remove('open');setSheetBox(rect(currentCard),30);
 setTimeout(()=>{sheet.classList.remove('show');currentCard.classList.remove('gone');currentCard.focus({preventScroll:true});currentCard=null;document.body.classList.remove('lock','detail-open');detailBusy=false},760);
}
grid.addEventListener('click',e=>{const c=e.target.closest('.card');if(c)openDetails(c)});
grid.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('card')){e.preventDefault();openDetails(e.target)}});
$('#close').onclick=closeDetails;

/* Local, persistent cart */
let cartData={};try{cartData=JSON.parse(localStorage.getItem('3d-furniture-cart-v1'))||{}}catch(e){}
function saveCart(){try{localStorage.setItem('3d-furniture-cart-v1',JSON.stringify(cartData))}catch(e){}renderCart()}
function renderCart(){
 let count=0,total=0;for(const [id,q] of Object.entries(cartData)){const it=items.find(x=>x.id===id);if(it&&q>0){count+=q;total+=it.p*q}else delete cartData[id]}
 $('#cart b').textContent=count;$('#subtotal').textContent=fmt(total);const box=$('#cartItems');
 if(!count){box.innerHTML='<div class="cart-empty"><strong>Your cart is empty</strong><span>Choose a piece from the collection.</span></div>';return}
 box.innerHTML=items.filter(it=>cartData[it.id]).map((it,i)=>`<div class="cart-row" data-id="${it.id}"><div class="cart-num">${String(items.indexOf(it)+1).padStart(2,'0')}</div><div class="cart-copy"><strong>${it.n}</strong><small>${fmt(it.p)}</small></div><div class="cart-actions"><button data-act="minus" aria-label="Remove one ${it.n}">−</button><b>${cartData[it.id]}</b><button data-act="plus" aria-label="Add one ${it.n}">+</button><button class="cart-remove" data-act="remove" aria-label="Remove ${it.n}">✕</button></div></div>`).join('');
}
let cartOpen=false;
function openCart(){cartOpen=true;renderCart();$('#cartShade').classList.add('show');$('#cartShade').setAttribute('aria-hidden','false');document.body.classList.add('cart-open');setTimeout(()=>$('#cartClose').focus(),400)}
function closeCart(){if(!cartOpen)return;cartOpen=false;$('#cartShade').classList.remove('show');$('#cartShade').setAttribute('aria-hidden','true');document.body.classList.remove('cart-open');$('#cart').focus({preventScroll:true})}
$('#cart').onclick=openCart;$('#cartClose').onclick=closeCart;$('#cartBackdrop').onclick=closeCart;
$('#cartItems').onclick=e=>{const b=e.target.closest('button[data-act]');if(!b)return;const id=b.closest('.cart-row').dataset.id,act=b.dataset.act;if(act==='plus')cartData[id]++;else if(act==='minus'){cartData[id]--;if(cartData[id]<=0)delete cartData[id]}else delete cartData[id];saveCart()};
$('#add').onclick=function(){if(viewIndex<0)return;const it=items[viewIndex];cartData[it.id]=(cartData[it.id]||0)+1;saveCart();$('#cart').classList.add('pop');setTimeout(()=>$('#cart').classList.remove('pop'),300);this.classList.add('ok');this.textContent='Added to cart';$('#announce').textContent=it.n+' added to cart';setTimeout(()=>{this.classList.remove('ok');this.textContent='Add to cart'},1200)};
$('#checkout').onclick=()=>showToast('Checkout will be connected in the next store phase.');renderCart();

/* Toast */
let toastTimer=0;function showToast(message){const t=$('#toast');t.textContent=message;t.classList.add('s');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('s'),3400)}

/* Mobile AR: Quick Look on iPhone, WebXR/Scene Viewer on Android */
let quickLook=false;try{quickLook=document.createElement('a').relList.supports('ar')}catch(e){}
const coarse=matchMedia('(pointer:coarse)').matches||innerWidth<=820;
if(coarse)(quickLook?$('#arLink'):$('#arBtn')).classList.add('ok');
let arRenderer=null,arScene=null,arCamera=null,arRoot=null,reticle=null,hitSource=null,arSession=null,arState=null;
function initARRenderer(){
 if(arRenderer)return;arRenderer=new T.WebGLRenderer({canvas:$('#arCanvas'),antialias:true,alpha:true});arRenderer.setPixelRatio(Math.min(devicePixelRatio,2));arRenderer.setSize(innerWidth,innerHeight);arRenderer.outputEncoding=T.sRGBEncoding;arRenderer.xr.enabled=true;arRenderer.setClearColor(0x000000,0);
 arScene=new T.Scene();arCamera=new T.PerspectiveCamera(60,innerWidth/innerHeight,.01,50);arScene.add(new T.HemisphereLight(0xffffff,0x9aa2ac,.7));const light=new T.DirectionalLight(0xffffff,.9);light.position.set(3,5,4);arScene.add(light);
 arRoot=new T.Group();arScene.add(arRoot);reticle=new T.Mesh(new T.RingGeometry(.07,.095,32).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0xffffff}));reticle.matrixAutoUpdate=false;reticle.visible=false;arScene.add(reticle);
}
function openSceneViewer(it){const file=new URL(it.glb,location.href).href;location.href='intent://arvr.google.com/scene-viewer/1.0?file='+encodeURIComponent(file)+'&mode=ar_only&resizable=false&title='+encodeURIComponent(it.n)+'#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url='+encodeURIComponent(location.href)+';end;'}
async function startAR(){
 if(viewIndex<0)return;const it=items[viewIndex],android=/Android/i.test(navigator.userAgent);
 if(!navigator.xr){if(android)openSceneViewer(it);else showToast('AR is available in Safari on iPhone or Chrome on a supported Android phone.');return}
 let pendingSession=null;
 try{
  /* Request the camera session immediately inside the tap gesture. */
  pendingSession=await navigator.xr.requestSession('immersive-ar',{requiredFeatures:['hit-test'],optionalFeatures:['dom-overlay'],domOverlay:{root:$('#xr')}});
  const st=await ensureModel(viewIndex);initARRenderer();while(arRoot.children.length)arRoot.remove(arRoot.children[0]);arRoot.add(st.master.clone(true));arRoot.scale.setScalar(1/st.fit);arRoot.rotation.set(0,viewY,0);arRoot.position.set(0,0,0);arRoot.visible=false;arState=st;
  const s=pendingSession;arSession=s;document.body.classList.add('ar-mode');arRenderer.xr.setReferenceSpaceType('local');await arRenderer.xr.setSession(s);
  hitSource=await s.requestHitTestSource({space:await s.requestReferenceSpace('viewer')});
  s.addEventListener('select',()=>{if(reticle.visible){arRoot.position.setFromMatrixPosition(reticle.matrix);arRoot.position.y+=arState.realH/2;arRoot.visible=true}});
  s.addEventListener('end',endAR);arRenderer.setAnimationLoop(renderAR);showToast('Move your phone to find the floor, then tap to place.');
 }catch(e){if(pendingSession&&!arSession)pendingSession.end().catch(()=>{});document.body.classList.remove('ar-mode');if(android&&(!e||e.name==='NotSupportedError'))openSceneViewer(it);else showToast('Could not start AR. Check camera permission and try again.')}
}
function renderAR(t,frame){
 if(frame&&hitSource){const hits=frame.getHitTestResults(hitSource);if(hits.length){const pose=hits[0].getPose(arRenderer.xr.getReferenceSpace());reticle.visible=true;reticle.matrix.fromArray(pose.transform.matrix)}else reticle.visible=false}
 arRenderer.render(arScene,arCamera);
}
function endAR(){if(hitSource&&hitSource.cancel)hitSource.cancel();hitSource=null;reticle&&(reticle.visible=false);arRoot&&(arRoot.visible=false);arRenderer&&arRenderer.setAnimationLoop(null);arSession=null;document.body.classList.remove('ar-mode')}
$('#arBtn').onclick=startAR;$('#exitAR').addEventListener('beforexrselect',e=>e.preventDefault());$('#exitAR').onclick=()=>arSession&&arSession.end();

/* Intro/store scroll hand-off */
const intro=$('#intro'),hd=$('#hd');let scrollLock=false,scrollTick=0;
const go=y=>{scrollLock=true;scrollTo({top:y,behavior:RM?'auto':'smooth'});setTimeout(()=>scrollLock=false,RM?50:950)},introEnd=()=>intro.offsetHeight-44;
function direction(down,e){
 if(currentCard||cartOpen||arSession||RM)return;const y=scrollY,h=introEnd();if(scrollLock){e.cancelable&&e.preventDefault();return}if(down&&y<h-4){e.cancelable&&e.preventDefault();go(h)}else if(!down&&y>h-40&&y<h+60){e.cancelable&&e.preventDefault();go(0)}
}
addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>2)direction(e.deltaY>0,e)},{passive:false});let touchY=0;
addEventListener('touchstart',e=>touchY=e.touches[0].clientY,{passive:true});addEventListener('touchmove',e=>{const d=touchY-e.touches[0].clientY;if(Math.abs(d)>24){direction(d>0,e);touchY=e.touches[0].clientY}},{passive:false});
addEventListener('keydown',e=>{
 if(e.key==='Escape'){if(arSession)arSession.end();else if(cartOpen)closeCart();else closeDetails();return}
 if(['ArrowDown','PageDown',' '].includes(e.key)&&!/BUTTON|ARTICLE/.test(document.activeElement.tagName))direction(true,e);else if(['ArrowUp','PageUp'].includes(e.key))direction(false,e)
});
$('#cue').onclick=()=>go(introEnd());$('#nav').onclick=e=>{e.preventDefault();go(introEnd())};
addEventListener('scroll',()=>{if(scrollTick)return;scrollTick=1;requestAnimationFrame(()=>{scrollTick=0;const y=scrollY;if(y<innerHeight*1.1)intro.style.setProperty('--p',Math.min(y/innerHeight,1).toFixed(3));hd.classList.toggle('sc',y>innerHeight*.8)})},{passive:true});

/* Hero cursor physics */
let heroScale=1,heroW=0,heroH=0,cursorX=-9999,cursorY=-9999,heroRAF=0;
function physics(){
 let live=false;for(const o of heroObjects){const dx=o.x*heroW/100+o.ox-cursorX,dy=o.y*heroH/100+o.oy-cursorY,d=Math.hypot(dx,dy)||1,R=o.r*heroScale+80;if(d<R){const f=(1-d/R)**2*3.4;o.vx+=dx/d*f;o.vy+=dy/d*f}o.vx-=o.ox*.016;o.vy-=o.oy*.016;o.vx*=.9;o.vy*=.9;o.ox+=o.vx;o.oy+=o.vy;if(Math.abs(o.vx)+Math.abs(o.vy)+Math.abs(o.ox)+Math.abs(o.oy)>.08){live=true;const s=o.el.style;s.setProperty('--ox',o.ox.toFixed(1));s.setProperty('--oy',o.oy.toFixed(1));s.setProperty('--rz',(o.vx*1.6).toFixed(1))}}
 heroRAF=live&&!intro.classList.contains('off')?requestAnimationFrame(physics):0;
}
const aim=e=>{if(RM||intro.classList.contains('off'))return;const r=intro.getBoundingClientRect();cursorX=e.clientX-r.left;cursorY=e.clientY-r.top;if(!heroRAF)heroRAF=requestAnimationFrame(physics)},away=()=>{cursorX=cursorY=-9999};
addEventListener('pointermove',aim,{passive:true});addEventListener('pointerdown',aim,{passive:true});addEventListener('pointerup',away);document.documentElement.addEventListener('mouseleave',away);new IntersectionObserver(([e])=>intro.classList.toggle('off',!e.isIntersecting)).observe(intro);
function fitHero(){heroScale=Math.min(Math.max(Math.min(innerWidth/1300,innerHeight/780),.5),1.15);document.documentElement.style.setProperty('--k',heroScale.toFixed(2));heroW=intro.clientWidth;heroH=intro.clientHeight}

/* Card entrance and lazy model loading */
const cardObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const card=e.target,i=+card.dataset.i;card.style.transitionDelay=(i%4*70)+'ms';card.classList.add('v');prepareCard(i);setTimeout(()=>card.style.transitionDelay='',900);cardObserver.unobserve(card)}}),{threshold:.08,rootMargin:'180px 0px'});cards.forEach(c=>cardObserver.observe(c));

/* Render card previews and the selected detail model */
let previous=performance.now();
function animate(now){
 const dt=Math.min((now-previous)/1000,.05);previous=now;cardRenderer.setScissorTest(false);cardRenderer.clear(true,true,true);cardRenderer.setScissorTest(true);
 if(!document.body.classList.contains('detail-open')){
  cardViews.forEach((v,i)=>{if(!v.ready||cards[i].classList.contains('hide'))return;const r=cards[i].querySelector('.stage').getBoundingClientRect();if(r.bottom<=0||r.top>=innerHeight||r.right<=0||r.left>=innerWidth)return;const l=Math.max(0,r.left),rr=Math.min(innerWidth,r.right),top=Math.max(0,r.top),bottom=Math.min(innerHeight,r.bottom);if(rr<=l||bottom<=top)return;
   if(!RM)v.angle+=dt*(v.hover?.95:.12);v.root.rotation.set(.25,v.angle,0);v.camera.aspect=r.width/r.height;v.camera.updateProjectionMatrix();cardRenderer.setViewport(r.left,innerHeight-r.bottom,r.width,r.height);cardRenderer.setScissor(l,innerHeight-bottom,rr-l,bottom-top);cardRenderer.render(v.scene,v.camera)
  });
 }
 cardRenderer.setScissorTest(false);
 if(sheet.classList.contains('show')){sizeViewer();if(viewAuto&&!viewDragging)viewY+=dt*.32;viewRoot.rotation.set(viewX,viewY,0);viewCamera.position.set(0,0,viewDistance);viewRenderer.render(viewScene,viewCamera)}
 requestAnimationFrame(animate);
}

function resize(){sizeCardRenderer();sizeViewer();fitHero();if(currentCard&&!detailBusy)setSheetBox(full(),32);if(arRenderer)arRenderer.setSize(innerWidth,innerHeight)}
addEventListener('resize',resize);fitHero();sizeViewer();updateAutoButton();requestAnimationFrame(animate);
})();
