/* Isolated experimental preview. No modifications to selection flow or app state. */
(()=>{
'use strict';
const result=document.getElementById('result');
const old=document.getElementById('finalScarf');
if(!result||!old)return;
const host=document.createElement('div');
host.id='floatingPreviewHost';
host.style.cssText='max-width:720px;margin:0 auto 16px;position:relative';
host.innerHTML='<canvas id="floatingPreviewCanvas" aria-label="הדמיית המטפחת המרחפת" style="display:block;width:100%;height:350px;border-radius:24px;background:radial-gradient(ellipse,#fffdfb,#f3e3df);touch-action:none"></canvas><p style="text-align:center;font-size:12px;color:#937b75">גרסת בדיקה: הדמיית תנועה לפי הבדים שנבחרו</p>';
old.parentNode.insertBefore(host,old);
old.style.display='none';
const canvas=host.querySelector('canvas'),ctx=canvas.getContext('2d');
canvas.setAttribute('role','img');
canvas.setAttribute('tabindex','0');
canvas.setAttribute('aria-description','ניתן לסובב את ההדמיה ימינה ושמאלה וגם למעלה ולמטה באמצעות מקשי החצים או גרירה');
if(!ctx){host.remove();old.style.display='';return;}
let time=0,turn=0,tilt=0,drag=false,px=0,py=0,lastFrame=0;
const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const palette={base:{'טבע':'#8b7359','מרווה':'#71806a','ים':'#557889','תכלת':'#8bb8c3','ורוד':'#c48e93','שמנת':'#e6dccb','שחור':'#282624','אפור':'#99958e'}};
function color(item,i){
 if(!item)return ['#dcb3ad','#b88781','#f0d4c8'][i%3];
 const [group,...rest]=item.split(':');const name=rest.join(':');
 if(group==='base')return palette.base[name]||'#dcb3ad';
 if(group==='lace')return name.includes('שחור')?'#46403e':name.includes('שמנת')?'#e5dac8':'#cca7a5';
 return ['#bc8d78','#718c82','#caa19b','#9a8795'][i%4];
}
const fabricImages=new Map();
const fabricPatterns=new Map();
function paintFor(item,i){
 if(!item||typeof fabricVisual!=='function')return color(item,i);
 const src=fabricVisual(item);
 if(!src||src.startsWith('#'))return color(item,i);
 if(!fabricImages.has(src)){
  const img=new Image();fabricImages.set(src,img);img.src=src;
 }
 const img=fabricImages.get(src);
 if(!img.complete||!img.naturalWidth)return color(item,i);
 if(!fabricPatterns.has(src)){
  try{fabricPatterns.set(src,ctx.createPattern(img,'repeat'));}
  catch(error){return color(item,i);}
 }
 return fabricPatterns.get(src)||color(item,i);
}
function draw(timestamp=0){
 if(timestamp && timestamp-lastFrame<32){requestAnimationFrame(draw);return;}
 lastFrame=timestamp;
 const bow=result.classList.contains('active') && typeof state!=='undefined' && state.shape==='קשת';
 host.style.display=bow?'none':'';old.style.display=bow?'':'none';
 const rect=canvas.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);
 const w=Math.round(rect.width*d),h=Math.round(rect.height*d);
 if(w&&h&&(canvas.width!==w||canvas.height!==h)){
  canvas.width=w;canvas.height=h;
  fabricPatterns.clear();
}
 if(w&&h)ctx.clearRect(0,0,w,h);
 const active=result.classList.contains('active') && !document.hidden;
 if(active && !bow && w && h){
 if(!reduceMotion)time+=.018;const s=Math.min(w/600,h/350);ctx.save();
 // Gentle vertical floating (roughly 22px peak-to-peak) and visible rocking.
 const bob=reduceMotion?0:Math.sin(time*1.45)*12;
 ctx.translate(w/2,h/2+bob*s);ctx.scale(s,s);
 ctx.rotate(reduceMotion?0:Math.sin(time*.85)*.085);const shape=(typeof state!=='undefined'&&state.shape)||'משולש';
 
 const triangle=['משולש','בנדנה'].includes(shape),n=(typeof state!=='undefined'&&state.pattern==='single')?1:(typeof state!=='undefined'&&state.pattern==='a')?2:3;
 const fabrics=(typeof state!=='undefined'&&state.fabrics)||[];
 const wide=shape==='בנדנה'?112:triangle?155:215,high=shape==='בנדנה'?115:triangle?160:(shape==='סרט'?45:95);
 ctx.shadowColor='#805f5960';ctx.shadowBlur=8;ctx.shadowOffsetY=3;
 const steps=48,lines=30;
 for(let j=0;j<lines;j++)for(let i=0;i<steps;i++){
   const u=i/steps,v=j/lines,u2=(i+1)/steps,v2=(j+1)/lines;
   /* Fold square textile coordinates into a triangular drape while preserving fabric regions. */
   function point(a,b){const x=(a-.5)*wide*2;const fold=triangle?Math.max(.02,1-Math.abs(2*a-1)):1;const y=(triangle?-high+b*2*high*fold:(b-.5)*high*2)+Math.sin(a*10+time+b*3)*13*fold+Math.cos(b*12-time*.8)*7*fold;const z=(Math.sin(a*8+time*.6)*22+Math.cos(b*7+time)*12)*fold;const spin=turn+(reduceMotion?0:Math.sin(time*.58)*.55);
   const pitch=tilt+(reduceMotion?0:Math.sin(time*.73)*.72);
   const rotatedX=x*Math.cos(spin)+z*Math.sin(spin);
   const depth=-x*Math.sin(spin)+z*Math.cos(spin);
   const rotatedY=y*Math.cos(pitch)-depth*Math.sin(pitch);
   const rotatedZ=y*Math.sin(pitch)+depth*Math.cos(pitch);
   const perspective=650/(650+rotatedZ);
   return [rotatedX*perspective,rotatedY*perspective]}
   const p=[point(u,v),point(u2,v),point(u2,v2),point(u,v2)];
   if(p.some(q=>!Number.isFinite(q[0])||!Number.isFinite(q[1])))continue;
   const region=n===1?0:n===2?(triangle?(u>.16&&u<.84&&v>.16&&v<.84?0:1):(v<.5?0:1)):(triangle?(u<.13||u>.87||v<.13||v>.87?2:(u>v?0:1)):(v<.5?0:(u<.5?1:2)));
   ctx.fillStyle=paintFor(fabrics[region],region);ctx.beginPath();ctx.moveTo(...p[0]);for(let k=1;k<4;k++)ctx.lineTo(...p[k]);ctx.closePath();ctx.fill();
   ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.strokeStyle='rgba(255,255,255,.06)';ctx.lineWidth=.4;ctx.stroke();
 }
 // Decorative finish is drawn above the fabric, without changing the chosen materials.
 const finish=(typeof state!=='undefined'&&state.finish)||'נקי';
 ctx.save();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.lineCap='round';
 if(finish==='פרנזים'){
   ctx.strokeStyle='#bda194';ctx.lineWidth=1.5;
   for(let x=-wide+5;x<wide;x+=9){
     const edge=triangle?(-high+2*high*Math.max(.02,1-Math.abs(x/wide))):high;
     const y=edge+Math.sin((x/wide+1)*5+time)*8;
     ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(time+x)*3,y+15);ctx.stroke();
   }
 }else if(finish==='שרשרת'){
   ctx.strokeStyle='#c4a064';ctx.lineWidth=3;
   ctx.beginPath();ctx.moveTo(-wide*.8,-high*.72);
   ctx.quadraticCurveTo(0,-high*.2,wide*.8,-high*.72);ctx.stroke();
   ctx.fillStyle='#c4a064';
   for(let x=-wide*.7;x<=wide*.7;x+=14){
     const y=-high*.72+(.7-Math.pow(x/(wide*.8),2)*.7)*high*.52;
     ctx.beginPath();ctx.arc(x,y,2.4,0,Math.PI*2);ctx.fill();
   }
 }else if(finish==='נזר בד'){
   ctx.strokeStyle='#e9d0c4';ctx.lineWidth=10;
   ctx.beginPath();ctx.moveTo(-wide*.75,-high*.72);
   ctx.quadraticCurveTo(0,-high*1.08,wide*.75,-high*.72);ctx.stroke();
 }
 ctx.restore();
 ctx.restore();
 }
 requestAnimationFrame(draw);
}
canvas.addEventListener('pointerdown',e=>{drag=true;px=e.clientX;py=e.clientY;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft'||e.key==='ArrowRight')turn+=(e.key==='ArrowLeft'?-1:1)*.16;else tilt=Math.max(-1.15,Math.min(1.15,tilt+(e.key==='ArrowUp'?-1:1)*.18));}});
canvas.addEventListener('pointermove',e=>{if(drag){turn+=(e.clientX-px)*.01;tilt=Math.max(-1.15,Math.min(1.15,tilt+(e.clientY-py)*.012));px=e.clientX;py=e.clientY}});
canvas.addEventListener('pointerup',()=>drag=false);
canvas.addEventListener('pointercancel',()=>drag=false);
canvas.addEventListener('lostpointercapture',()=>drag=false);
draw();
})();