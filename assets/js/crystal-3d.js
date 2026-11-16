/* FLUX Studios — World Forge. Real-time perspective-projected 3D crystal,
   orbiting energy paths and pointer/keyboard controls. Zero remote dependencies. */
(()=>{
'use strict';
const scene=document.getElementById('portalScene'), canvas=document.getElementById('crystalCanvas');
if(!scene || !canvas || !canvas.getContext)return;
const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let w=1,h=1,dpr=1,shown=true,dragging=false,dragId=null;
let targetX=-.08,targetY=.22,rotX=targetX,rotY=targetY,angle=0;
let oldX=0,oldY=0,oldRX=0,oldRY=0,last=0;
const hexToRgb=s=>{let v=s.trim().replace('#','');if(v.length!==6)return [80,224,245];return [0,2,4].map(i=>parseInt(v.slice(i,i+2),16))};
const rgb=(a,alpha=1)=>`rgba(${a.map(x=>Math.round(x)).join(',')},${alpha})`;
const mix=(a,b,v)=>a.map((n,i)=>n*(1-v)+b[i]*v);
let palette={cyan:[77,219,243],green:[183,255,101],blue:[75,132,252]};
function theme(){const cs=getComputedStyle(document.documentElement),type=document.documentElement.dataset.theme;const accent=hexToRgb(cs.getPropertyValue('--accent')||'#56e4f4');
 if(type==='elemental-spectrum')palette={cyan:[70,200,244],green:[246,178,73],blue:[246,112,97]};
 else if(type==='midnight-violet')palette={cyan:[147,127,255],green:[219,144,255],blue:[100,137,255]};
 else palette={cyan:accent,green:[186,255,105],blue:[88,146,249]};
}
theme();new MutationObserver(theme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
function resize(){const r=scene.getBoundingClientRect();w=Math.max(250,r.width);h=Math.max(200,r.height);dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
new ResizeObserver(resize).observe(scene);resize();
function rotate(v){let [x,y,z]=v;const yy=rotY+(prefersReduced?0:Math.sin(angle*.18)*.075),xx=rotX;let co=Math.cos(yy),si=Math.sin(yy);[x,z]=[x*co+z*si,z*co-x*si];co=Math.cos(xx);si=Math.sin(xx);[y,z]=[y*co-z*si,y*si+z*co];return [x,y,z]}
function project(v){const [x,y,z]=rotate(v),perspective=5.9/(5.9-z),scale=Math.min(w/4.7,h/4.55);return {x:w*.5+x*scale*perspective,y:h*.48-y*scale*perspective,z,scale:scale*perspective}}
function polygon(vertices,bright,kind){const p=vertices.map(project);const d=p.reduce((a,b)=>a+b.z,0)/p.length;return {z:d,kind,draw(){ctx.beginPath();ctx.moveTo(p[0].x,p[0].y);for(let i=1;i<p.length;i++)ctx.lineTo(p[i].x,p[i].y);ctx.closePath();const c=kind==='green'?palette.green:palette.cyan;const base=mix([7,18,28],c,bright);const grad=ctx.createLinearGradient(p[0].x,p[0].y,p[2].x,p[2].y);grad.addColorStop(0,rgb(mix(base,[255,255,255],.38),.94));grad.addColorStop(.48,rgb(base,.92));grad.addColorStop(1,rgb(mix(base,[3,8,18],.6),.88));ctx.fillStyle=grad;ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle=rgb(mix(c,[240,255,255],.22),.65);ctx.shadowColor=rgb(c,.42);ctx.shadowBlur=12;ctx.stroke();ctx.shadowBlur=0;}}}
const top=[0,1.65,0],bot=[0,-1.67,0],left=[-1.58,-.09,0],right=[1.58,-.09,0],front=[0,.10,1.16],back=[0,.10,-1.16];
const faces=[
 [[top,left,front],.56,'cyan'],[[top,front,right],.54,'green'],[[top,right,back],.31,'green'],[[top,back,left],.22,'cyan'],
 [[bot,front,left],.32,'cyan'],[[bot,right,front],.44,'green'],[[bot,back,right],.22,'green'],[[bot,left,back],.21,'cyan']
];
function ringPoint(t,mode,phase){const c=Math.cos(t),s=Math.sin(t);let x=c*2.0,y=s*(mode===0?.86:.67),z=0;
 const pitch=(mode===0?.72:-.88);let u=y*Math.cos(pitch)-z*Math.sin(pitch),v=y*Math.sin(pitch)+z*Math.cos(pitch);y=u;z=v;
 const roll=(mode===0?-.29:.45);u=x*Math.cos(roll)-y*Math.sin(roll);v=x*Math.sin(roll)+y*Math.cos(roll);x=u;y=v;
 return [x,y+.04,z];}
function drawLine(p1,p2,color,front){ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.lineCap='round';ctx.lineWidth=front?2.9:1.55;ctx.strokeStyle=rgb(color,front?.88:.36);ctx.shadowColor=rgb(color,front?.9:.35);ctx.shadowBlur=front?16:8;ctx.stroke();if(front){ctx.lineWidth=.65;ctx.strokeStyle='rgba(252,255,255,.78)';ctx.shadowBlur=0;ctx.stroke()}ctx.shadowBlur=0}
function render(t){ctx.clearRect(0,0,w,h);const cn=palette.cyan,gr=palette.green;
 // Ambient light field and distant planet halo.
 const radial=ctx.createRadialGradient(w*.52,h*.45,14,w*.52,h*.48,Math.min(w,h)*.52);radial.addColorStop(0,rgb(cn,.16));radial.addColorStop(.45,rgb(gr,.055));radial.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=radial;ctx.fillRect(0,0,w,h);
 ctx.save();ctx.translate(w*.5,h*.86);ctx.scale(1,.15);const ground=ctx.createRadialGradient(0,0,5,0,0,Math.min(w,h)*.43);ground.addColorStop(0,rgb(gr,.3));ground.addColorStop(.5,rgb(cn,.08));ground.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=ground;ctx.beginPath();ctx.arc(0,0,Math.min(w,h)*.43,0,Math.PI*2);ctx.fill();ctx.restore();
 // Fine orbital atmosphere, rendered behind the faceted geometry.
 ctx.save();ctx.strokeStyle=rgb(cn,.17);ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(w*.5,h*.48,Math.min(w,h)*.425,Math.min(w,h)*.425,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([2,7]);ctx.strokeStyle=rgb(gr,.2);ctx.beginPath();ctx.ellipse(w*.5,h*.48,Math.min(w,h)*.34,Math.min(w,h)*.34,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
 const draws=[];
 for(const [v,b,k] of faces)draws.push(polygon(v,b,k));
 const N=132;
 for(let ring=0;ring<2;ring++)for(let i=0;i<N;i++){
  const a=(i/N)*Math.PI*2 + (prefersReduced?0:Math.sin(t*.00016)*(ring?-.15:.11));const b=((i+1)/N)*Math.PI*2 + (prefersReduced?0:Math.sin(t*.00016)*(ring?-.15:.11));const p1=project(ringPoint(a,ring)),p2=project(ringPoint(b,ring));const avg=(p1.z+p2.z)*.5;
  const color=ring===0?mix(cn,gr,(Math.sin(a)*.5+.5)):mix(gr,cn,(Math.cos(a)*.5+.5));
  draws.push({z:avg-.025,kind:'ring',draw:()=>drawLine(p1,p2,color,avg>0.15)});
 }
 draws.sort((a,b)=>a.z-b.z);for(const obj of draws)obj.draw();
 // Crystal core: central diamond is visible from both directions.
 const core=project([0,.03,1.27]);const size=Math.min(w,h)*.075;
 ctx.save();const glow=ctx.createRadialGradient(core.x,core.y,0,core.x,core.y,size*2.8);glow.addColorStop(0,'rgba(240,255,247,.9)');glow.addColorStop(.18,rgb(gr,.6));glow.addColorStop(.5,rgb(cn,.17));glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(core.x-size*2.8,core.y-size*2.8,size*5.6,size*5.6);
 ctx.translate(core.x,core.y);const len=size*(.95+(prefersReduced?0:Math.sin(t*.002)*.08));const starGrad=ctx.createRadialGradient(0,0,0,0,0,len);starGrad.addColorStop(0,'#fff');starGrad.addColorStop(.45,rgb(gr,.95));starGrad.addColorStop(1,rgb(cn,.06));ctx.fillStyle=starGrad;ctx.shadowBlur=21;ctx.shadowColor=rgb(cn,.85);ctx.beginPath();ctx.moveTo(0,-len*1.5);ctx.quadraticCurveTo(len*.26,-len*.23,len*.92,0);ctx.quadraticCurveTo(len*.23,len*.24,0,len*1.5);ctx.quadraticCurveTo(-len*.26,len*.2,-len*.92,0);ctx.quadraticCurveTo(-len*.2,-len*.24,0,-len*1.5);ctx.fill();ctx.shadowBlur=0;ctx.restore();
 // Orbital glints travel in the projected 3D rings.
 for(let j=0;j<5;j++){const rr=j%2,aa=((t*.00016*(rr===0?1:-.65)+j*1.71)%(Math.PI*2));const p=project(ringPoint(aa,rr));const r=j%3===0?3.2:2;ctx.fillStyle='#efffff';ctx.shadowColor=rgb(j%2?gr:cn,1);ctx.shadowBlur=16;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
 // Minimal technical crosshair so it feels engineered rather than decorative.
 const cx=w*.5,cy=h*.48;ctx.strokeStyle=rgb(cn,.17);ctx.lineWidth=.7;for(const [dx,dy] of [[0,-.38],[0,.38],[-.38,0],[.38,0]]){const q=Math.min(w,h);ctx.beginPath();ctx.arc(cx+dx*q,cy+dy*q,3,0,Math.PI*2);ctx.stroke();}
 }
function frame(timestamp){const delta=last?Math.min(50,timestamp-last):16;last=timestamp;rotX+=(targetX-rotX)*.095;rotY+=(targetY-rotY)*.095;if(!prefersReduced&&!dragging)angle+=delta*.001;render(timestamp);if(!prefersReduced&&shown)requestAnimationFrame(frame)}
function refresh(){if(prefersReduced)render(0)}
scene.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;dragging=true;dragId=e.pointerId;oldX=e.clientX;oldY=e.clientY;oldRX=targetX;oldRY=targetY;scene.setPointerCapture?.(e.pointerId);scene.classList.add('dragging')});
scene.addEventListener('pointermove',e=>{if(!dragging||e.pointerId!==dragId)return;targetY=Math.max(-1.2,Math.min(1.2,oldRY+(e.clientX-oldX)*.004));targetX=Math.max(-.84,Math.min(.84,oldRX-(e.clientY-oldY)*.004));refresh()});
const end=()=>{dragging=false;dragId=null;scene.classList.remove('dragging')};['pointerup','pointercancel','lostpointercapture'].forEach(ev=>scene.addEventListener(ev,end));
scene.addEventListener('keydown',e=>{const val={ArrowLeft:[0,-.13],ArrowRight:[0,.13],ArrowUp:[-.13,0],ArrowDown:[.13,0]}[e.key];if(!val)return;e.preventDefault();targetX=Math.max(-.84,Math.min(.84,targetX+val[0]));targetY=Math.max(-1.2,Math.min(1.2,targetY+val[1]));refresh()});
scene.addEventListener('dblclick',()=>{targetX=-.08;targetY=.22;refresh()});
new IntersectionObserver(entries=>{const visible=entries[0].isIntersecting;if(visible&&!shown){shown=true;last=0;requestAnimationFrame(frame)}else if(!visible)shown=false},{threshold:.01}).observe(scene);
scene.classList.add('crystal-ready');requestAnimationFrame(frame);
})();
