const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={cover:null,shape:"משולש קטן",pattern:"single",finish:"נקי",price:89,fabrics:[]};
const forms={full:[["long","לונג"],["triangle","משולש"]],half:[["bandana","בנדנה"],["ribbon","סרט"],["bow","קשת"]],both:[["long","לונג"],["triangle","משולש"],["bandana","בנדנה"],["ribbon","סרט"],["bow","קשת"]]};
function show(id){$$(".screen").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");updateProgress();scrollTo(0,0)}
function updateProgress(){const ids=["landing","choose","forms","pattern","fabrics","finish","result","feedback"],cur=$$(".screen.active")[0]?.id||"landing",n=ids.indexOf(cur);$$(".progress i").forEach((x,i)=>x.classList.toggle("on",i<=Math.min(4,Math.max(0,n-1))))}
function renderForms(){const box=$("#formGrid");box.innerHTML=forms[state.cover].map(([id,name])=>`<button class="form-card" data-shape="${name}"><div class="mini"></div><strong>${name}</strong><small>${name==="לונג"||name==="משולש"?"כיסוי מלא":"חצי כיסוי"}</small></button>`).join("");$$(".form-card").forEach(b=>b.onclick=()=>{state.shape=b.dataset.shape;show("pattern")})}
$$("[data-go]").forEach(b=>b.onclick=()=>show(b.dataset.go));
$$("[data-cover]").forEach(b=>b.onclick=()=>{state.cover=b.dataset.cover;renderForms();show("forms")});
$$(".pattern-card").forEach(b=>b.onclick=()=>{state.pattern=b.dataset.pattern;state.price=state.pattern==="single"?89:114;show("fabrics");updatePrice()});
const colors={base:[["טבע","#8b7359"],["מרווה","#71806a"],["ים","#557889"],["תכלת","#8bb8c3"],["ורוד","#c48e93"],["שמנת","#e6dccb"],["שחור","#282624"],["אפור","#99958e"]],print:[["חול פרחוני","#c7a777"],["ים מודפס","#537d88"],["וינטג׳","#b87973"],["טרופי","#758b68"]],lace:[["תחרה שמנת","#ded3c0"],["תחרה שחורה","#302d2b"],["תחרה ורודה","#c7a0a0"],["תחרה טבעית","#aa9476"]]};
function renderSwatches(){Object.entries(colors).forEach(([group,arr])=>{const box=$("#"+(group==="base"?"baseSwatches":group==="print"?"printSwatches":"laceSwatches"));box.innerHTML=arr.map(([name,c])=>`<button class="swatch" title="${name}" data-group="${group}" data-name="${name}" style="background:${c}"></button>`).join("")});$$(".swatch").forEach(b=>b.onclick=()=>{b.classList.toggle("selected");const item=b.dataset.group+":"+b.dataset.name;if(b.classList.contains("selected"))state.fabrics.push(item);else state.fabrics=state.fabrics.filter(x=>x!==item);state.price=(state.pattern==="single"?89:114)+Math.max(0,state.fabrics.length-1)*25;updatePrice();updateNote()})}
renderSwatches();
function updatePrice(){$("#price").textContent=state.price}
function updateNote(){const n=state.fabrics.length;if(n<=1)$("#designNote").textContent="בחירה נקייה ופשוטה. אם תרצי יותר עומק, אפשר להוסיף בד תומך קטן.";else if(n===2)$("#designNote").textContent="שני בדים מאפשרים ליצור היררכיה ברורה: אחד מוביל ואחד תומך.";else $("#designNote").textContent="שלושה בדים יוצרים מראה עשיר יותר. כדאי לתת לאחד מהם להיות הצבע המוביל."; }
$$(".finish-card").forEach(b=>b.onclick=()=>{state.finish=b.dataset.finish==="none"?"נקי":b.dataset.finish==="tiara"?"נזר בד":b.dataset.finish==="fringe"?"פרנזים":"שרשרת";state.price+=(+b.dataset.add);$("#finalPrice").textContent=state.price;$("#summaryShape").textContent=state.shape;$("#summaryPattern").textContent=state.pattern==="single"?"בד ראשוני בלבד":state.pattern==="a"?"תבנית א׳":"תבנית ב׳";$("#summaryFinish").textContent=state.finish;show("result")});
$$(".mood").forEach(b=>b.onclick=()=>show("choose"));
$$(".rating button").forEach(b=>b.onclick=()=>{ $$(".rating button").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
$$(".yesno button").forEach(b=>b.onclick=()=>{$$(".yesno button").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
$("#thanks").onclick=()=>{alert("תודה! המשוב נשמר כחלק מחוויית ה-MVP.");};
$("#restart").onclick=()=>location.reload();
updateProgress();
