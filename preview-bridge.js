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
if(!ctx){host.remove();old.style.display='';return;}
let time=0,turn=0,drag=false,px=0;
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
 if(!fabricPatterns.has(src))fabricPatterns.set(src,ctx.createPattern(img,'repeat'));
 return fabricPatterns.get(src)||color(item,i);
}
function draw(){
 const bow=result.classList.contains('active') && typeof state!=='undefined' && state.shape==='קשת';
 host.style.display=bow?'none':'';old.style.display=bow?'':'none';
 const rect=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
 const w=Math.round(rect.width*d),h=Math.round(rect.height*d);
 if(w&&h&&(canvas.width!==w||canvas.height!==h)){canvas.width=w;canvas.height=h}
 ctx.clearRect(0,0,w,h);
 const active=result.classList.contains('active');
 if(active && w && h){
 time+=.018;const s=Math.min(w/600,h/350);ctx.save();ctx.translate(w/2,h/2);ctx.scale(s,s);
 ctx.rotate(Math.sin(time*.7)*.04);const shape=(typeof state!=='undefined'&&state.shape)||'משולש';
 
 const triangle=['משולש','בנדנה'].includes(shape),n=(typeof state!=='undefined'&&state.pattern==='single')?1:(typeof state!=='undefined'&&state.pattern==='a')?2:3;
 const fabrics=(typeof state!=='undefined'&&state.fabrics)||[];
 const wide=triangle?155:215,high=triangle?160:(shape==='סרט'?45:95);
 ctx.shadowColor='#805f5960';ctx.shadowBlur=8;ctx.shadowOffsetY=3;
 const steps=48,lines=30;
 for(let j=0;j<lines;j++)for(let i=0;i<steps;i++){
   const u=i/steps,v=j/lines,u2=(i+1)/steps,v2=(j+1)/lines;
   /* Show unfolded square for triangle designs, as in the pattern selector. */
   function point(a,b){const x=(a-.5)*wide*2,y=(b-.5)*high*2+Math.sin(a*10+time+b*3)*13+Math.cos(b*12-time*.8)*7;const z=Math.sin(a*8+time*.6)*22+Math.cos(b*7+time)*12;const spin=turn+time*.13;return [x*Math.cos(spin)+z*Math.sin(spin),y]}
   const p=[point(u,v),point(u2,v),point(u2,v2),point(u,v2)];
   const region=n===1?0:n===2?(triangle?(u>.16&&u<.84&&v>.16&&v<.84?0:1):(v<.5?0:1)):(triangle?(u<.13||u>.87||v<.13||v>.87?2:(u>v?0:1)):(v<.5?0:(u<.5?1:2)));
   ctx.fillStyle=paintFor(fabrics[region],region);ctx.beginPath();ctx.moveTo(...p[0]);for(let k=1;k<4;k++)ctx.lineTo(...p[k]);ctx.closePath();ctx.fill();
   ctx.shadowBlur=0;ctx.strokeStyle='rgba(255,255,255,.06)';ctx.lineWidth=.4;ctx.stroke();
 }
 ctx.restore();
 }
 requestAnimationFrame(draw);
}
canvas.addEventListener('pointerdown',e=>{drag=true;px=e.clientX;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(drag){turn+=(e.clientX-px)*.01;px=e.clientX}});
canvas.addEventListener('pointerup',()=>drag=false);
canvas.addEventListener('pointercancel',()=>drag=false);
draw();
})();