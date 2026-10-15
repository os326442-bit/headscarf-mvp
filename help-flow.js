(()=>{
const root=document.getElementById("helpWizard");if(!root)return;
let step=0, answers={},selected=0;
const choices=[
["purpose","בשביל מה את מעצבת את המטפחת?",[["event","לאירוע מיוחד"],["outfit","להתאים לבגד מסוים"],["everyday","ליומיום"],["shabbat","לשבת או לחג"],["explore","בא לי להתחדש"]]],
["hasOutfit","כבר בחרת מה תלבשי?",[["yes","כן, הבגד כבר אצלי"],["idea","יש לי כיוון, אבל עדיין לא בחרתי"]]],
["color","מה הצבע המרכזי של הבגד?",[["sage","ירוק"],["navy","כחול"],["burgundy","בורדו / אדום"],["black","שחור"],["cream","שמנת / לבן"],["pink","ורוד"],["brown","חום / בז׳"],["other","צבע אחר או עדיין לא החלטתי"]]],
["garment","איך נראה הבגד שלך?",[["plain","חלק, בלי הדפסים"],["pattern","עם הדפס או דוגמה"],["decorated","עם רקמה, תחרה או עיטורים"],["unsure","עוד לא החלטתי"]]],
["match","איך תרצי שהמטפחת תשתלב עם הבגד?",[["same","בגוונים דומים"],["complement","בצבעים משלימים"],["contrast","בצבע שונה שיוסיף עניין"],["unsure","תציעו לי מה שהכי מתאים"]]],
["presence","מה היית רוצה שהמטפחת תוסיף ללוק?",[["subtle","שתשתלב בעדינות"],["balanced","קצת צבע ועניין"],["statement","שתהיה הפריט הבולט"]]],
["texture","איזה שילוב בדים את מדמיינת?",[["plain","בד חלק ונקי"],["mix","בד חלק עם בד מיוחד"],["print","הדפסים וצבעים"],["lace","תחרה ומרקמים עדינים"],["unsure","אשמח להצעה"]]],
["coverage","איזה סוג כיסוי מתאים לך?",[["full","כיסוי מלא"],["half","חצי כיסוי"],["unsure","אני לא בטוחה, תראו לי אפשרויות"]]]
];
const questionList=()=>choices.filter(q=>!["hasOutfit","color","garment","match"].includes(q[0])||["event","outfit"].includes(answers.purpose));
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function render(){
const qs=questionList();step=Math.min(step,qs.length);
if(step===qs.length){renderResults();return;}
const [key,title,options]=qs[step];
root.innerHTML='<div class="help-counter">שאלה '+(step+1)+' מתוך '+qs.length+'</div><div class="help-progress"><span style="width:'+Math.round(step/qs.length*100)+'%"></span></div><h3>'+title+'</h3><div class="help-options">'+options.map(([v,label])=>'<button type="button" class="help-option'+(answers[key]===v?' chosen':'')+'" data-help-value="'+v+'">'+esc(label)+'</button>').join('')+'</div><div class="help-nav"><button type="button" data-help-prev '+(step===0?'disabled':'')+'>לשאלה הקודמת</button><button type="button" class="primary" data-help-next '+(!answers[key]?'disabled':'')+'>'+(step===qs.length-1?'לראות את ההצעות שלי':'ממשיכים')+'</button></div>';
root.querySelectorAll('[data-help-value]').forEach(b=>b.addEventListener('click',()=>{answers[key]=b.dataset.helpValue;render();}));
root.querySelector('[data-help-prev]').addEventListener('click',()=>{if(step>0){step--;render();}});
root.querySelector('[data-help-next]').addEventListener('click',()=>{step++;render();});
}
const colorBase={sage:"מרווה",navy:"ים",burgundy:"ורוד",black:"שמנת",cream:"טבע",pink:"שמנת",brown:"תכלת",other:"מרווה"};
function proposals(){
const primary=colorBase[answers.color]||"מרווה";
const dominant=answers.presence==="statement"||answers.texture==="print";
const special=answers.texture==="lace"?"lace:תחרה שמנת":dominant?"print:פרחים עדינים":answers.garment==="decorated"?"lace:תחרה טבעית":"print:חול פרחוני";
const bases=[primary,primary==="שמנת"?"ורוד":"שמנת",primary==="מרווה"?"טבע":"מרווה"];
const shapes=answers.coverage==="half"?["בנדנה","סרט","קשת"]:answers.coverage==="full"?["משולש","לונג","משולש"]:["משולש","בנדנה","לונג"];
return [
{name:"עדינה ומדויקת",shape:shapes[0],fabrics:["base:"+bases[0],special]},
{name:"נגיעה רומנטית",shape:shapes[1],fabrics:["base:"+bases[1],answers.garment==="decorated"?"lace:תחרה שמנת":"print:פרחים עדינים"]},
{name:"טבעית ומיוחדת",shape:shapes[2],fabrics:["base:"+bases[2],answers.texture==="plain"?"base:"+bases[0]:"lace:תחרה טבעית"]}
];}
function renderResults(){
const opts=proposals();selected=Math.min(selected,2);
root.innerHTML='<div class="help-counter">ההצעות שלך</div><h3>יש לנו כמה רעיונות בשבילך...</h3><p>הרכבנו לך שלוש נקודות פתיחה לפי התשובות שלך. תוכלי לשנות כל פרט בעורך האישי.</p><div class="help-recs">'+opts.map((o,i)=>'<button type="button" data-help-rec="'+i+'" class="help-rec'+(i===selected?' chosen':'')+'"><strong>'+o.name+'</strong><span>'+o.shape+'</span><span>'+o.fabrics.map(x=>esc(x.split(':')[1])).join(' + ')+'</span></button>').join('')+'</div><p class="help-hint">ההצעות מבוססות על כללי התאמה ראשוניים ועל הבדים הקיימים. אין כאן ניתוח תמונה או התאמה אוטומטית לבגד מצולם.</p><div class="help-nav"><button type="button" data-help-prev>לערוך תשובות</button><button type="button" class="primary" data-help-apply>אהבתי, אני רוצה לעצב את זה בעצמי</button></div>';
root.querySelectorAll('[data-help-rec]').forEach(b=>b.addEventListener('click',()=>{selected=+b.dataset.helpRec;renderResults();}));
root.querySelector('[data-help-prev]').addEventListener('click',()=>{step=questionList().length-1;render();});
root.querySelector('[data-help-apply]').addEventListener('click',()=>{
const o=opts[selected];state.cover=["משולש","לונג"].includes(o.shape)?"full":"half";state.shape=o.shape;
state.pattern=o.shape==="קשת"?"single":"a";state.fabrics=o.shape==="קשת"?o.fabrics.slice(0,1):o.fabrics.slice();
state.finish="נקי";state.price=basePrice()+(state.fabrics.length>=2?45:0);
renderForms();renderPatterns();renderSwatches();
document.querySelectorAll(".swatch").forEach(el=>el.classList.toggle("selected",state.fabrics.includes(el.dataset.group+":"+el.dataset.name)));
updatePrice();updateNote();renderLivePreview();show("fabrics");
});
}
document.addEventListener("click",e=>{if(e.target.closest('[data-go="help"]')){step=0;answers={};selected=0;render();}});
render();
})();