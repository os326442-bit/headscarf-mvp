const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

const state={cover:null,shape:"משולש קטן",pattern:"single",finish:"נקי",price:89,fabrics:[]};

const forms={
  full:[["long","לונג"],["triangle","משולש"]],
  half:[["bandana","בנדנה"],["ribbon","סרט"],["bow","קשת"]],
  both:[["long","לונג"],["triangle","משולש"],["bandana","בנדנה"],["ribbon","סרט"],["bow","קשת"]]
};

function show(id){
  const target=$("#"+id);
  if(!target)return;
  $$(" .screen".trim()).forEach(screen=>{
    screen.classList.remove("active");
    screen.hidden=true;
  });
  target.hidden=false;
  target.classList.add("active");
  if(id!=="landing"){
    document.body.classList.add("flow-started");
    document.getElementById("landing")?.remove();
    document.querySelector(".topbar")?.remove();
  }
  updateProgress();
  window.scrollTo({top:0,behavior:"smooth"});
}

function updateProgress(){
  const ids=["landing","choose","forms","pattern","fabrics","finish","result","feedback"];
  const current=$(".screen.active")?.id||"landing";
  const n=ids.indexOf(current);
  $$(".progress i").forEach((x,i)=>x.classList.toggle("on",i<=Math.min(4,Math.max(0,n-1))));
}

function renderForms(){
  const box=$("#formGrid");
  if(!box)return;
  box.innerHTML=(forms[state.cover]||forms.both).map(([id,name])=>
    `<button type="button" class="form-card" data-shape="${name}">
      <div class="mini"></div><strong>${name}</strong>
      <small>${name==="לונג"||name==="משולש"?"כיסוי מלא":"חצי כיסוי"}</small>
    </button>`
  ).join("");
}

const colors={
  base:[["טבע","#8b7359"],["מרווה","#71806a"],["ים","#557889"],["תכלת","#8bb8c3"],["ורוד","#c48e93"],["שמנת","#e6dccb"],["שחור","#282624"],["אפור","#99958e"]],
  print:[["חול פרחוני","botanical"],["ים מודפס","waves"],["וינטג׳","floral"],["טרופי","tropical"]],
  lace:[["תחרה שמנת","#ded3c0"],["תחרה שחורה","#302d2b"],["תחרה ורודה","#c7a0a0"],["תחרה טבעית","#aa9476"]]
};

const printPatterns={
  botanical:'radial-gradient(circle at 24% 24%,#f4d8a9 0 5%,transparent 6%),radial-gradient(circle at 30% 18%,#f4d8a9 0 5%,transparent 6%),radial-gradient(circle at 76% 70%,#9b4f4f 0 6%,transparent 7%),linear-gradient(115deg,transparent 43%,#65724f 44% 48%,transparent 49%),linear-gradient(60deg,#b99565 0 49%,#c8a878 50% 100%)',
  waves:'repeating-radial-gradient(ellipse at 50% 0%,transparent 0 10px,#d9ebe4 11px 16px),linear-gradient(135deg,#477987 0 48%,#6b9aa2 49% 100%)',
  floral:'radial-gradient(circle at 24% 30%,#f7d5c0 0 6%,transparent 7%),radial-gradient(circle at 31% 23%,#f7d5c0 0 6%,transparent 7%),radial-gradient(circle at 73% 68%,#6f4d4b 0 7%,transparent 8%),linear-gradient(120deg,#e39a70 0 4%,transparent 5% 100%),#b86f72',
  tropical:'radial-gradient(ellipse at 27% 32%,#ead49a 0 8%,transparent 9%),radial-gradient(ellipse at 73% 68%,#ead49a 0 9%,transparent 10%),linear-gradient(135deg,transparent 43%,#d9c58d 44% 50%,transparent 51%),#718765'
};

const lacePatterns={
  cream:'radial-gradient(circle,#fff9ee 0 2px,transparent 2.5px),radial-gradient(circle at 6px 6px,#b9a992 0 2px,transparent 2.5px),#ded3c0',
  black:'radial-gradient(circle,#eee5d8 0 2px,transparent 2.5px),radial-gradient(circle at 6px 6px,#6f6256 0 2px,transparent 2.5px),#302d2b',
  pink:'radial-gradient(circle,#f9e8df 0 2px,transparent 2.5px),radial-gradient(circle at 6px 6px,#a77b7d 0 2px,transparent 2.5px),#c7a0a0',
  natural:'radial-gradient(circle,#d9c9ae 0 2px,transparent 2.5px),radial-gradient(circle at 6px 6px,#806e5c 0 2px,transparent 2.5px),#aa9476'
};

function renderSwatches(){
  Object.entries(colors).forEach(([group,arr])=>{
    const box=$("#"+(group==="base"?"baseSwatches":group==="print"?"printSwatches":"laceSwatches"));
    if(!box)return;
    box.innerHTML=arr.map(([name,c])=>{
      const style=group==="print"
        ? 'background-color:#ddd;background-image:'+printPatterns[c]+';background-size:70px 70px;'
        : group==="lace"
          ? 'background-color:'+c+';background-image:'+lacePatterns[c==='#ded3c0'?'cream':c==='#302d2b'?'black':c==='#c7a0a0'?'pink':'natural']+';background-size:12px 12px;'
          : 'background:'+c;
      return '<button type="button" class="swatch" title="'+name+'" data-group="'+group+'" data-name="'+name+'" style="'+style+'"></button>';
    }).join("");
  });
}

function updatePrice(){
  if($("#price"))$("#price").textContent=state.price;
}

function updateNote(){
  const n=state.fabrics.length;
  if(!$("#designNote"))return;
  $("#designNote").textContent=n<=1
    ?"בחירה נקייה ופשוטה. אם תרצי יותר עומק, אפשר להוסיף בד תומך קטן."
    :n===2
      ?"שני בדים מאפשרים ליצור היררכיה ברורה: אחד מוביל ואחד תומך."
      :"שלושה בדים יוצרים מראה עשיר יותר. כדאי לתת לאחד מהם להיות הצבע המוביל.";
}

function chooseCover(value){
  state.cover=value;
  renderForms();
  show("forms");
}

function choosePattern(value){
  state.pattern=value;
  state.price=value==="single"?89:114;
  updatePrice();
  show("fabrics");
}

function chooseFinish(button){
  state.finish=button.dataset.finish==="none"?"נקי":
    button.dataset.finish==="tiara"?"נזר בד":
    button.dataset.finish==="fringe"?"פרנזים":"שרשרת";
  state.price=(state.pattern==="single"?89:114)+Math.max(0,state.fabrics.length-1)*25+(+button.dataset.add||0);
  $("#finalPrice").textContent=state.price;
  $("#summaryShape").textContent=state.shape;
  $("#summaryPattern").textContent=state.pattern==="single"?"בד ראשוני בלבד":state.pattern==="a"?"תבנית א׳":"תבנית ב׳";
  $("#summaryFinish").textContent=state.finish;
  show("result");
}

document.addEventListener("click",event=>{
  const go=event.target.closest("[data-go]");
  if(go){event.preventDefault();show(go.dataset.go);return;}

  const cover=event.target.closest("[data-cover]");
  if(cover){chooseCover(cover.dataset.cover);return;}

  const form=event.target.closest(".form-card");
  if(form){state.shape=form.dataset.shape;show("pattern");return;}

  const pattern=event.target.closest("[data-pattern]");
  if(pattern){choosePattern(pattern.dataset.pattern);return;}

  const swatch=event.target.closest(".swatch");
  if(swatch){
    swatch.classList.toggle("selected");
    const item=swatch.dataset.group+":"+swatch.dataset.name;
    if(swatch.classList.contains("selected"))state.fabrics.push(item);
    else state.fabrics=state.fabrics.filter(x=>x!==item);
    state.price=(state.pattern==="single"?89:114)+Math.max(0,state.fabrics.length-1)*25;
    updatePrice();updateNote();return;
  }

  const finish=event.target.closest(".finish-card");
  if(finish){chooseFinish(finish);return;}

  const mood=event.target.closest(".mood");
  if(mood){show("choose");return;}

  const rating=event.target.closest(".rating button");
  if(rating){$$(".rating button").forEach(x=>x.classList.remove("active"));rating.classList.add("active");return;}

  const yesno=event.target.closest(".yesno button");
  if(yesno){$$(".yesno button").forEach(x=>x.classList.remove("active"));yesno.classList.add("active");return;}

  if(event.target.closest("#thanks"))alert("תודה! המשוב נשמר כחלק מחוויית ה-MVP.");
  if(event.target.closest("#restart"))location.reload();
});

renderSwatches();
updatePrice();
$$(".screen").forEach(screen=>{screen.hidden=!screen.classList.contains("active");});
updateProgress();