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

const textileSvgs={
 botanical:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#b99565"/><g fill="none" stroke="#65724f" stroke-width="4"><path d="M10 90Q25 55 45 15M35 100Q55 55 85 20M55 100Q70 65 98 45"/></g><g fill="#f4d8a9"><circle cx="18" cy="25" r="8"/><circle cx="72" cy="72" r="9"/><circle cx="42" cy="45" r="7"/></g><g fill="#9b4f4f"><circle cx="18" cy="25" r="3"/><circle cx="72" cy="72" r="3"/><circle cx="42" cy="45" r="3"/></g></svg>'),
 waves:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#477987"/><g fill="none" stroke="#d9ebe4" stroke-width="7"><path d="M-10 15Q15 0 40 15T90 15T140 15"/><path d="M-10 40Q15 25 40 40T90 40T140 40"/><path d="M-10 65Q15 50 40 65T90 65T140 65"/><path d="M-10 90Q15 75 40 90T90 90T140 90"/></g></svg>'),
 floral:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#b86f72"/><g fill="#f7d5c0"><circle cx="20" cy="25" r="10"/><circle cx="35" cy="18" r="10"/><circle cx="29" cy="35" r="10"/><circle cx="76" cy="72" r="11"/><circle cx="91" cy="65" r="10"/><circle cx="84" cy="82" r="10"/></g><g fill="#e39a70"><circle cx="28" cy="27" r="4"/><circle cx="84" cy="73" r="4"/></g></svg>'),
 tropical:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#718765"/><g fill="#ead49a"><ellipse cx="22" cy="25" rx="22" ry="8" transform="rotate(-35 22 25)"/><ellipse cx="72" cy="20" rx="24" ry="8" transform="rotate(-25 72 20)"/><ellipse cx="40" cy="72" rx="25" ry="8" transform="rotate(-45 40 72)"/></g><g stroke="#d9c58d" stroke-width="4"><path d="M5 95Q35 55 72 5M25 100Q50 60 98 38"/></g></svg>'),
 laceCream:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#ded3c0"/><g fill="none" stroke="#b9a992" stroke-width="2"><circle cx="25" cy="25" r="15"/><circle cx="75" cy="25" r="15"/><circle cx="25" cy="75" r="15"/><circle cx="75" cy="75" r="15"/><path d="M0 50H100M50 0V100"/></g></svg>'),
 laceBlack:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#302d2b"/><g fill="none" stroke="#9b8c7b" stroke-width="2"><circle cx="25" cy="25" r="15"/><circle cx="75" cy="25" r="15"/><circle cx="25" cy="75" r="15"/><circle cx="75" cy="75" r="15"/><path d="M0 50H100M50 0V100"/></g></svg>'),
 lacePink:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#c7a0a0"/><g fill="none" stroke="#a77b7d" stroke-width="2"><circle cx="25" cy="25" r="15"/><circle cx="75" cy="25" r="15"/><circle cx="25" cy="75" r="15"/><circle cx="75" cy="75" r="15"/><path d="M0 50H100M50 0V100"/></g></svg>'),
 laceNatural:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#aa9476"/><g fill="none" stroke="#806e5c" stroke-width="2"><circle cx="25" cy="25" r="15"/><circle cx="75" cy="25" r="15"/><circle cx="25" cy="75" r="15"/><circle cx="75" cy="75" r="15"/><path d="M0 50H100M50 0V100"/></g></svg>')
};

function renderSwatches(){
  Object.entries(colors).forEach(([group,arr])=>{
    const box=$("#"+(group==="base"?"baseSwatches":group==="print"?"printSwatches":"laceSwatches"));
    if(!box)return;
    box.innerHTML=arr.map(([name,c])=>{
      let src="";
      if(group==="print") src=textileSvgs[{botanical:"botanical",waves:"waves",floral:"floral",tropical:"tropical"}[c]];
      else if(group==="lace") src=textileSvgs[{ "#ded3c0":"laceCream","#302d2b":"laceBlack","#c7a0a0":"lacePink","#aa9476":"laceNatural"}[c]];
      return group==="base"
        ? '<button type="button" class="swatch" title="'+name+'" data-group="'+group+'" data-name="'+name+'"><span style="display:block;width:100%;height:100%;border-radius:50%;background:'+c+'"></span></button>'
        : '<button type="button" class="swatch" title="'+name+'" data-group="'+group+'" data-name="'+name+'"><img src="'+src+'" alt="" style="display:block;width:100%;height:100%;border-radius:50%;object-fit:cover"></button>';
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