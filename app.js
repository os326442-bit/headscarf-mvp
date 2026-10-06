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

const printSvgs={
  botanical:'<svg viewBox="0 0 60 60" aria-hidden="true"><rect width="60" height="60" fill="#b99565"/><path d="M8 10c8 8 8 18 0 28M18 5c8 8 8 18 0 28M38 12c-7 8-7 18 0 28M48 6c-7 8-7 18 0 28" stroke="#65724f" stroke-width="3" fill="none"/><circle cx="12" cy="12" r="5" fill="#f4d8a9"/><circle cx="42" cy="42" r="5" fill="#9b4f4f"/></svg>',
  waves:'<svg viewBox="0 0 60 60" aria-hidden="true"><rect width="60" height="60" fill="#477987"/><path d="M-5 12Q10 2 25 12T55 12T85 12M-5 27Q10 17 25 27T55 27T85 27M-5 42Q10 32 25 42T55 42T85 42M-5 57Q10 47 25 57T55 57T85 57" stroke="#d9ebe4" stroke-width="5" fill="none"/><circle cx="15" cy="19" r="3" fill="#f0c77c"/><circle cx="45" cy="49" r="3" fill="#f0c77c"/></svg>',
  floral:'<svg viewBox="0 0 60 60" aria-hidden="true"><rect width="60" height="60" fill="#b86f72"/><g fill="#f7d5c0"><circle cx="13" cy="15" r="5"/><circle cx="22" cy="10" r="5"/><circle cx="17" cy="23" r="5"/></g><circle cx="17" cy="16" r="2" fill="#e39a70"/><g fill="#6f4d4b"><circle cx="44" cy="43" r="5"/><circle cx="53" cy="38" r="5"/><circle cx="48" cy="51" r="5"/></g><circle cx="48" cy="44" r="2" fill="#e39a70"/></svg>',
  tropical:'<svg viewBox="0 0 60 60" aria-hidden="true"><rect width="60" height="60" fill="#718765"/><path d="M8 48Q22 25 34 7M19 52Q28 29 49 20M31 58Q39 38 57 35" stroke="#d9c58d" stroke-width="6" fill="none"/><ellipse cx="13" cy="28" rx="7" ry="4" fill="#ead49a" transform="rotate(-35 13 28)"/><ellipse cx="43" cy="14" rx="8" ry="4" fill="#ead49a" transform="rotate(-25 43 14)"/></svg>'
};

const laceSvgs={
  cream:'<svg viewBox="0 0 60 60" aria-hidden="true"><rect width="60" height="60" fill="#ded3c0"/><path d="M0 0L60 60M60 0L0 60M30 0V60M0 30H60" stroke="#b9a992" stroke-width="2" opacity=".8"/><circle cx="15" cy="15" r="5" fill="#fff9ee"/><circle cx="45" cy="15" r="5" fill="#fff9ee"/><circle cx="15" cy="45" r="5" fill="#fff9ee"/><circle cx="45" cy="45" r="5" fill="#fff9ee"/></svg>',
  black:'<svg viewBox="0 0 60 60" aria-hidden="true"><rect width="60" height="60" fill="#302d2b"/><path d="M0 0L60 60M60 0L0 60M30 0V60M0 30H60" stroke="#6f6256" stroke-width="2"/><circle cx="15" cy="15" r="5" fill="#eee5d8"/><circle cx="45" cy="15" r="5" fill="#eee5d8"/><circle cx="15" cy="45" r="5" fill="#eee5d8"/><circle cx="45" cy="45" r="5" fill="#eee5d8"/></svg>',
  pink:'<svg viewBox="0 0 60 60" aria-hidden="true"><rect width="60" height="60" fill="#c7a0a0"/><path d="M0 0L60 60M60 0L0 60M30 0V60M0 30H60" stroke="#a77b7d" stroke-width="2"/><circle cx="15" cy="15" r="5" fill="#f9e8df"/><circle cx="45" cy="15" r="5" fill="#f9e8df"/><circle cx="15" cy="45" r="5" fill="#f9e8df"/><circle cx="45" cy="45" r="5" fill="#f9e8df"/></svg>',
  natural:'<svg viewBox="0 0 60 60" aria-hidden="true"><rect width="60" height="60" fill="#aa9476"/><path d="M0 0L60 60M60 0L0 60M30 0V60M0 30H60" stroke="#806e5c" stroke-width="2"/><circle cx="15" cy="15" r="5" fill="#d9c9ae"/><circle cx="45" cy="15" r="5" fill="#d9c9ae"/><circle cx="15" cy="45" r="5" fill="#d9c9ae"/><circle cx="45" cy="45" r="5" fill="#d9c9ae"/></svg>'
};

function renderSwatches(){
  Object.entries(colors).forEach(([group,arr])=>{
    const box=$("#"+(group==="base"?"baseSwatches":group==="print"?"printSwatches":"laceSwatches"));
    if(!box)return;
    box.innerHTML=arr.map(([name,c])=>{
      let visual='';
      if(group==="print") visual=printSvgs[c];
      else if(group==="lace"){
        const key=c==="#ded3c0"?"cream":c==="#302d2b"?"black":c==="#c7a0a0"?"pink":"natural";
        visual=laceSvgs[key];
      } else visual='<span style="display:block;width:100%;height:100%;border-radius:50%;background:'+c+'"></span>';
      return '<button type="button" class="swatch" title="'+name+'" data-group="'+group+'" data-name="'+name+'">'+visual+'</button>';
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