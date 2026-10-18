(()=>{
const root=document.getElementById("helpWizard");if(!root)return;
let step=0,answers={},history=[],current=0;
const questions=[
{key:"purpose",title:"בשביל מה את יוצרת את המטפחת שלך?",options:[["outfit","להתאים אותה לבגד מסוים"],["event","ליצור משהו מיוחד לאירוע"],["new","פשוט להתחדש במשהו יפה"]]},
{key:"style",title:"איזה מראה היית רוצה ליצור?",options:[["delicate","עדין ונקי"],["balanced","מאוזן ומעניין"],["bold","עשיר ובולט"]]},
{key:"color",title:"יש צבעים שחשוב לך לשלב במטפחת?",options:[["specific","כן, יש לי צבע או כמה צבעים שאני רוצה לשלב"],["outfit","אני רוצה שהצבעים יתאימו לבגד מסוים"],["unsure","אין לי צבעים בראש, אשמח להמלצה"]]},
{key:"palette",title:"איזה שילוב צבעים הכי מדבר אלייך?",options:[["harmonious","צבעים הרמוניים"],["complementary","צבעים משלימים"],["bold","צבעים נועזים ובולטים"]]},
{key:"fabric",title:"איזה שילוב בדים הכי מדבר אלייך?",options:[["subtle","נגיעה עדינה של ייחודיות"],["balanced","שילוב מאוזן של בדים"],["rich","מראה עשיר ומלא אופי"],["surprise","תפתיעו אותי!"]]}
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function syncOutfit(){if(answers.purpose==="outfit"){answers.color="outfit";}else if(answers.color==="outfit" && !answers.outfitColor)answers.color="unsure";}
function extraNeeded(){return step===2&&(answers.color==="specific"||answers.color==="outfit");}
function render(){
if(step>=questions.length){renderRecommendation();return;}
const q=questions[step],isOutfit=step===2&&answers.purpose==="outfit";
if(isOutfit)answers.color="outfit";
root.innerHTML='<div class="help-counter">שאלה '+(step+1)+' מתוך 5</div><div class="help-progress"><span style="width:'+((step+1)*20)+'%"></span></div><h3>'+esc(isOutfit?"מה הצבע של הבגד שאליו תרצי להתאים את המטפחת?":q.title)+'</h3>'+
(isOutfit?'':('<div class="help-options">'+q.options.map(([value,label])=>'<button type="button" class="help-option'+(answers[q.key]===value?' chosen':'')+'" data-answer="'+value+'">'+esc(label)+'</button>').join('')+'</div>'))+
(extraNeeded()||isOutfit?'<label class="help-text-label">'+(isOutfit||answers.color==="outfit"?"צבע הבגד":"הצבעים שתרצי לשלב")+'<input id="guidedColor" type="text" maxlength="100" placeholder="למשל: ירוק מרווה, שמנת, בורדו" value="'+esc(answers.outfitColor||"")+'"></label>':'')+
'<div class="help-nav"><button type="button" data-prev '+(step===0?'disabled':'')+'>לשאלה הקודמת</button><button type="button" class="primary" data-next>ממשיכים</button></div>';
root.querySelectorAll("[data-answer]").forEach(b=>b.addEventListener("click",()=>{answers[q.key]=b.dataset.answer;if(step===0)syncOutfit();render();}));
root.querySelector("[data-prev]").addEventListener("click",()=>{if(step){step--;render();}});
root.querySelector("[data-next]").addEventListener("click",()=>{
if(isOutfit)answers.color="outfit";
if(!answers[q.key]){root.querySelector(".help-hint")?.remove();root.insertAdjacentHTML("beforeend",'<p class="help-hint">בחרי אפשרות כדי להמשיך.</p>');return;}
if(extraNeeded()||isOutfit){const value=root.querySelector("#guidedColor")?.value.trim();if(!value){root.querySelector("#guidedColor")?.focus();return;}answers.outfitColor=value;}
step++;render();
});
}
function available(){return Object.entries(colors).flatMap(([type,arr])=>arr.map(([name])=>type+":"+name));}
function preferredBases(){
const input=(answers.outfitColor||"").toLowerCase();
const matches=colors.base.filter(([name])=>input.includes(name.toLowerCase())).map(([name])=>name);
if(input.includes("ירוק"))matches.push("מרווה");
if(input.includes("כחול"))matches.push("ים");
if(input.includes("אדום")||input.includes("בורדו"))matches.push("ורוד");
if(input.includes("לבן")||input.includes("בז"))matches.push("שמנת");
if(input.includes("שחור"))matches.push("שחור");
return [...new Set([...matches,...(answers.palette==="bold"?["ים","ורוד","מרווה"]:answers.palette==="harmonious"?["מרווה","טבע","שמנת"]:["מרווה","שמנת","ורוד","ים"] )])].filter(n=>colors.base.some(c=>c[0]===n));
}
function build(){
const pool=available(),bases=preferredBases(),prints=colors.print.map(([n])=>"print:"+n),laces=colors.lace.map(([n])=>"lace:"+n);
const special=answers.fabric==="rich"?prints.concat(laces):answers.fabric==="subtle"?laces.concat(prints):prints.concat(laces);
const count=state.shape==="קשת"?1:answers.fabric==="rich"||answers.style==="bold"?3:2;
const pattern=count===1?"single":count===3?"b":"a";
const candidates=[];
for(let i=0;i<Math.max(5,bases.length);i++){
 const b="base:"+bases[i%bases.length];
 const other="base:"+bases[(i+1)%bases.length];
 const a=special[(i*2)%special.length],c=special[(i*2+3)%special.length];
 const fabrics=count===1?[i%3===0?a:b]:count===2?[b,a]:[b,a,answers.fabric==="rich"?c:other];
 if(fabrics.every(x=>pool.includes(x)))candidates.push({name:["נגיעה של צבע","שילוב עם אופי","רכות מיוחדת","מראה עשיר","משהו קצת אחר"][i%5],shape:state.shape,pattern,fabrics});
}
const unique=[...new Map(candidates.map(p=>[p.pattern+"|"+p.fabrics.join("|"),p])).values()];
return unique.slice(0,5);
}
function preview(p){
const fills=p.fabrics.map(f=>fabricVisual(f));
return '<div class="guided-samples">'+fills.map((fill,i)=>'<div class="guided-sample" title="'+esc(p.fabrics[i].split(":")[1])+'" style="'+(fill.startsWith("#")?"background:"+fill:"background-image:url(&quot;"+fill+"&quot;);background-size:cover;background-position:center")+'"></div>').join("")+'</div>';
}
function renderRecommendation(){
if(!history.length){history=build();current=0;}
const p=history[current];if(!p){root.innerHTML="<p>לא נמצאו שילובים מתאימים כרגע.</p>";return;}
root.innerHTML='<div class="help-counter">הצעה '+(current+1)+' מתוך '+history.length+'</div><h3>יצרנו לך התחלה יפה</h3><p>בחרנו עבורך שילוב מתוך הבדים והתבניות שבאתר. עכשיו הוא בידיים שלך.</p>'+
preview(p)+'<h4>'+esc(p.name)+'</h4><p>'+esc(p.shape)+' · '+esc(p.fabrics.map(x=>x.split(":")[1]).join(" + "))+'</p>'+
'<div class="help-nav"><button type="button" data-previous '+(current===0?'disabled':'')+'>ההצעה הקודמת</button><button type="button" data-following '+(current>=history.length-1?'disabled':'')+'>ההצעה הבאה</button></div>'+
'<div class="help-nav"><button type="button" class="secondary" data-again '+(current===history.length-1?'disabled':'')+'>תציעו לי שילוב אחר</button><button type="button" class="primary" data-apply>אהבתי! בואי נדייק</button></div>'+
'<p class="help-hint">אפשר לערוך את התשובות או לדייק את העיצוב בעורך הקיים.</p><button type="button" class="secondary" data-edit-answers>עריכת התשובות</button>';
root.querySelector("[data-previous]").onclick=()=>{current--;renderRecommendation();};
root.querySelector("[data-following]").onclick=()=>{current++;renderRecommendation();};
root.querySelector("[data-again]").onclick=()=>{current++;renderRecommendation();};
root.querySelector("[data-edit-answers]").onclick=()=>{step=0;history=[];render();};
root.querySelector("[data-apply]").onclick=()=>{
state.pattern=p.pattern;state.fabrics=p.fabrics.slice();state.finish="נקי";state.price=basePrice()+(state.fabrics.length>=2?45:0)+(state.fabrics.length>=3?35:0);
renderPatterns();renderSwatches();
document.querySelectorAll(".swatch").forEach(el=>el.classList.toggle("selected",state.fabrics.includes(el.dataset.group+":"+el.dataset.name)));
updatePrice();updateNote();renderLivePreview();
show("fabrics");
};
}
window.startGuidedWizard=()=>{step=0;answers={};history=[];current=0;render();};
render();
})();