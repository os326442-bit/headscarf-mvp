const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

const state={cover:null,shape:"משולש קטן",pattern:"single",finish:"נקי",price:89,fabrics:[]};
function basePrice(){const first=state.fabrics[0]||"";return first.startsWith("print:")||first.startsWith("lace:")?100:89;}

const forms={
  full:[["long","לונג"],["triangle","משולש"]],
  half:[["bandana","בנדנה"],["ribbon","סרט"],["bow","קשת"]],
  both:[["long","לונג"],["triangle","משולש"],["bandana","בנדנה"],["ribbon","סרט"],["bow","קשת"]]
};

const backStack=[];

function show(id,fromBack=false){
  const target=$("#"+id);
  if(!target)return;
  const current=$(".screen.active")?.id;
  if(!fromBack && current && current!==id) backStack.push(current);
  $$(".screen").forEach(screen=>{
    screen.classList.remove("active");
    screen.hidden=true;
  });
  target.hidden=false;
  target.classList.add("active");
  const topbar=document.querySelector(".topbar");
  if(id!=="landing"){
    document.body.classList.add("flow-started");
    if(topbar)topbar.style.display="none";
  }else{
    document.body.classList.remove("flow-started");
    if(topbar)topbar.style.display="";
  }
  updateProgress();
  window.scrollTo({top:0,behavior:"smooth"});
}

function goBack(){
  const previous=backStack.pop();
  if(previous) show(previous,true);
}

function addBackButtons(){
  document.querySelectorAll(".screen").forEach(screen=>{
    if(screen.id==="landing" || screen.querySelector(".back-button")) return;
    const button=document.createElement("button");
    button.type="button";
    button.className="back-button";
    button.textContent="← חזרה";
    button.addEventListener("click",goBack);
    screen.insertBefore(button,screen.firstChild);
  });
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
  print:[
    ["חול פרחוני","print_botanical"],
    ["ים מודפס","print_waves"],
    ["וינטג׳","print_vintage"],
    ["טרופי","print_tropical"],
    ["פרחים עדינים","print_softflowers"],
    ["גאומטרי","print_geo"],
    ["עלים","print_leaves"],
    ["אבסטרקט","print_abstract"]
  ],
  lace:[
    ["תחרה שמנת","lace_cream"],
    ["תחרה שחורה","lace_black"],
    ["תחרה ורודה","lace_pink"],
    ["תחרה טבעית","lace_natural"]
  ]
};

const textileSvgs={
 botanical:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#b99565"/><g fill="none" stroke="#65724f" stroke-width="4"><path d="M10 90Q25 55 45 15M35 100Q55 55 85 20M55 100Q70 65 98 45"/></g><g fill="#f4d8a9"><circle cx="18" cy="25" r="8"/><circle cx="72" cy="72" r="9"/><circle cx="42" cy="45" r="7"/></g><g fill="#9b4f4f"><circle cx="18" cy="25" r="3"/><circle cx="72" cy="72" r="3"/><circle cx="42" cy="45" r="3"/></g></svg>'),
 waves:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#477987"/><g fill="none" stroke="#d9ebe4" stroke-width="7"><path d="M-10 15Q15 0 40 15T90 15T140 15"/><path d="M-10 40Q15 25 40 40T90 40T140 40"/><path d="M-10 65Q15 50 40 65T90 65T140 65"/><path d="M-10 90Q15 75 40 90T90 90T140 90"/></g></svg>'),
 floral:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#b86f72"/><g fill="#f7d5c0"><circle cx="20" cy="25" r="10"/><circle cx="35" cy="18" r="10"/><circle cx="29" cy="35" r="10"/><circle cx="76" cy="72" r="11"/><circle cx="91" cy="65" r="10"/><circle cx="84" cy="82" r="10"/></g><g fill="#e39a70"><circle cx="28" cy="27" r="4"/><circle cx="84" cy="73" r="4"/></g></svg>'),
 tropical:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#718765"/><g fill="#ead49a"><ellipse cx="22" cy="25" rx="22" ry="8" transform="rotate(-35 22 25)"/><ellipse cx="72" cy="20" rx="24" ry="8" transform="rotate(-25 72 20)"/><ellipse cx="40" cy="72" rx="25" ry="8" transform="rotate(-45 40 72)"/></g><g stroke="#d9c58d" stroke-width="4"><path d="M5 95Q35 55 72 5M25 100Q50 60 98 38"/></g></svg>'),
  softflowers:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#d5a9a2"/><g fill="#f7e4d2"><circle cx="20" cy="25" r="10"/><circle cx="32" cy="16" r="10"/><circle cx="30" cy="31" r="10"/><circle cx="78" cy="72" r="11"/><circle cx="91" cy="64" r="10"/><circle cx="87" cy="82" r="10"/></g><g fill="#9d6b62"><circle cx="28" cy="24" r="4"/><circle cx="85" cy="72" r="4"/></g></svg>'),
  geo:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#7d8f98"/><path d="M0 0L25 25L50 0L75 25L100 0M0 50L25 75L50 50L75 75L100 50M0 100L25 75L50 100L75 75L100 100" fill="none" stroke="#e7d7b8" stroke-width="8"/><circle cx="25" cy="25" r="5" fill="#b66f70"/><circle cx="75" cy="75" r="5" fill="#b66f70"/></svg>'),
  leaves:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#8a9670"/><g fill="#d8c48e"><ellipse cx="20" cy="25" rx="20" ry="7" transform="rotate(35 20 25)"/><ellipse cx="70" cy="20" rx="22" ry="7" transform="rotate(-35 70 20)"/><ellipse cx="45" cy="70" rx="24" ry="8" transform="rotate(25 45 70)"/></g><g stroke="#53624d" stroke-width="3"><path d="M0 90Q35 55 85 10M15 100Q45 65 100 50"/></g></svg>'),
  abstract:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#b97872"/><circle cx="25" cy="30" r="22" fill="#e5b27f"/><circle cx="75" cy="65" r="28" fill="#657d76"/><path d="M0 80Q30 55 55 80T110 70" fill="none" stroke="#f1dcc2" stroke-width="9"/><circle cx="70" cy="20" r="9" fill="#d8c58f"/></svg>'),
 laceCream:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#ded3c0"/><g fill="none" stroke="#b9a992" stroke-width="2"><circle cx="25" cy="25" r="15"/><circle cx="75" cy="25" r="15"/><circle cx="25" cy="75" r="15"/><circle cx="75" cy="75" r="15"/><path d="M0 50H100M50 0V100"/></g></svg>'),
 laceBlack:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#302d2b"/><g fill="none" stroke="#9b8c7b" stroke-width="2"><circle cx="25" cy="25" r="15"/><circle cx="75" cy="25" r="15"/><circle cx="25" cy="75" r="15"/><circle cx="75" cy="75" r="15"/><path d="M0 50H100M50 0V100"/></g></svg>'),
 lacePink:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#c7a0a0"/><g fill="none" stroke="#a77b7d" stroke-width="2"><circle cx="25" cy="25" r="15"/><circle cx="75" cy="25" r="15"/><circle cx="25" cy="75" r="15"/><circle cx="75" cy="75" r="15"/><path d="M0 50H100M50 0V100"/></g></svg>'),
 laceNatural:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#aa9476"/><g fill="none" stroke="#806e5c" stroke-width="2"><circle cx="25" cy="25" r="15"/><circle cx="75" cy="25" r="15"/><circle cx="25" cy="75" r="15"/><circle cx="75" cy="75" r="15"/><path d="M0 50H100M50 0V100"/></g></svg>')
};

function renderSwatches(){
  const printKeys={
    print_botanical:"botanical",
    print_waves:"waves",
    print_vintage:"floral",
    print_tropical:"tropical",
    print_softflowers:"softflowers",
    print_geo:"geo",
    print_leaves:"leaves",
    print_abstract:"abstract"
  };
  const laceKeys={
    lace_cream:"laceCream",
    lace_black:"laceBlack",
    lace_pink:"lacePink",
    lace_natural:"laceNatural"
  };
  Object.entries(colors).forEach(([group,arr])=>{
    const box=$("#"+(group==="base"?"baseSwatches":group==="print"?"printSwatches":"laceSwatches"));
    if(!box)return;
    box.innerHTML=arr.map(([name,key])=>{
      if(group==="base"){
        return '<button type="button" class="swatch" title="'+name+'" data-group="'+group+'" data-name="'+name+'"><span style="display:block;width:100%;height:100%;border-radius:50%;background:'+key+'"></span></button>';
      }
      const src=group==="print" ? textileSvgs[printKeys[key]] : textileSvgs[laceKeys[key]];
      return '<button type="button" class="swatch" title="'+name+'" data-group="'+group+'" data-name="'+name+'"><img src="'+src+'" alt="'+name+'" style="display:block!important;width:100%!important;height:100%!important;border-radius:50%;object-fit:cover;opacity:1!important"></button>';
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
  state.price=basePrice();
  updatePrice();
  show("fabrics");
}

function chooseFinish(button){
  state.finish=button.dataset.finish==="none"?"נקי":
    button.dataset.finish==="tiara"?"נזר בד":
    button.dataset.finish==="fringe"?"פרנזים":"שרשרת";
  state.price=basePrice()+Math.max(0,state.fabrics.length-1)*40+(+button.dataset.add||0);
  $("#finalPrice").textContent=state.price;
  $("#summaryShape").textContent=state.shape;
  $("#summaryPattern").textContent=state.pattern==="single"?"בד ראשוני בלבד":state.pattern==="a"?"תבנית א׳":"תבנית ב׳";
  $("#summaryFinish").textContent=state.finish;
  show("result");
}

document.addEventListener("click",event=>{
  const back=event.target.closest("[data-back]");
  if(back){event.preventDefault();goBack();return;}

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
    state.price=basePrice()+Math.max(0,state.fabrics.length-1)*40;
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

  if(event.target.closest("#thanks")){    event.preventDefault();    const rating=$(".rating button.active")?.textContent?.trim()||"לא נבחר";    const favorite=document.getElementById("feedbackFavorite")?.value?.trim()||"לא נכתב";    const improvement=document.getElementById("feedbackImprovement")?.value?.trim()||"לא נכתב";    const interest=$("#feedback .yesno button.active")?.textContent?.trim()||"לא נבחר";    const name=document.getElementById("feedbackName")?.value?.trim()||"לא נכתב";    const contact=document.getElementById("feedbackContact")?.value?.trim()||"לא נכתב";    const message=["משוב חדש — עיצוב אישי","","⭐ דירוג: "+rating+"/5","","מה הכי אהבת בתהליך?",favorite,"","הערות לשיפור השירות או החוויה:",improvement,"","האם היית רוצה לעצב מטפחת כזו באמת?",interest,"","שם:",name,"","טלפון / אימייל:",contact].join("\n");    window.location.href="https://wa.me/972506334993?text="+encodeURIComponent(message);    return;  }  if(event.target.closest("#restart"))location.reload();
});

renderSwatches();
updatePrice();
$$(".screen").forEach(screen=>{screen.hidden=!screen.classList.contains("active");});
updateProgress();