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
  botanical:'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#c8a878"/><path d="M8 78c18-12 18-35 8-50M18 28c12 4 15 13 13 24M48 94c5-23 20-36 34-43M68 51c-4-13 2-23 14-29M70 78c10 0 18 6 21 16" fill="none" stroke="#6d7653" stroke-width="4" stroke-linecap="round"/><circle cx="15" cy="24" r="4" fill="#a95855"/><circle cx="30" cy="52" r="4" fill="#efe0c4"/><circle cx="84" cy="24" r="4" fill="#a95855"/><circle cx="56" cy="75" r="4" fill="#efe0c4"/></svg>',
  waves:'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#4f7885"/><path d="M-10 25Q10 5 30 25T70 25T110 25M-10 55Q10 35 30 55T70 55T110 55M-10 85Q10 65 30 85T70 85T110 85" fill="none" stroke="#cfe0d8" stroke-width="7"/><circle cx="18" cy="42" r="3" fill="#f1d39b"/><circle cx="78" cy="72" r="3" fill="#f1d39b"/></svg>',
  floral:'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#b87573"/><path d="M8 88C25 66 24 42 39 23M58 96C54 70 69 52 88 37" fill="none" stroke="#e9a26f" stroke-width="3"/><g fill="#f2d0bd"><circle cx="34" cy="24" r="5"/><circle cx="27" cy="30" r="5"/><circle cx="41" cy="30" r="5"/><circle cx="34" cy="37" r="5"/></g><g fill="#7d5a52"><circle cx="78" cy="37" r="5"/><circle cx="71" cy="43" r="5"/><circle cx="85" cy="43" r="5"/><circle cx="78" cy="50" r="5"/></g></svg>',
  tropical:'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#718765"/><path d="M12 92C22 67 31 45 49 19M50 95C55 70 70 49 91 34" fill="none" stroke="#d9c58d" stroke-width="3"/><path d="M35 40c-18-3-27 5-29 20 15 2 25-4 29-20M60 64c18-4 28 4 31 18-15 4-26-2-31-18M62 23c-2-15 6-23 19-23 1 13-5 21-19 23" fill="#d9c58d"/><circle cx="82" cy="75" r="7" fill="#c96f68"/></svg>'
};

function renderSwatches(){
  Object.entries(colors).forEach(([group,arr])=>{
    const box=$("#"+(group==="base"?"baseSwatches":group==="print"?"printSwatches":"laceSwatches"));
    if(!box)return;
    box.innerHTML=arr.map(([name,c])=>{
      const style=group==="print"
        ? 'background-color:#ddd;background-image:url("data:image/svg+xml,'+encodeURIComponent(printPatterns[c])+'");background-size:100px 100px;'
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