const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

const state={cover:null,shape:"משולש קטן",pattern:"single",finish:"נקי",price:109,fabrics:[]};
function basePrice(){const first=state.fabrics[0]||"";return first.startsWith("print:")||first.startsWith("lace:")?119:109;}

const forms={
  full:[["long","לונג"],["triangle","משולש"]],
  half:[["bandana","בנדנה"],["ribbon","סרט"],["bow","קשת"]],
  both:[["long","לונג"],["triangle","משולש"],["bandana","בנדנה"],["ribbon","סרט"],["bow","קשת"]]
};

const backStack=[];

function restartDesign(){
  state.cover=null;state.shape="משולש קטן";state.pattern="single";state.finish="נקי";state.price=109;state.fabrics=[];
  backStack.length=0;
  $$(".swatch.selected").forEach(x=>x.classList.remove("selected"));
  $$(".rating button.active,.yesno button.active").forEach(x=>x.classList.remove("active"));
  show("landing");
}

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
      <div class="mini mini-${id}">${id==="triangle"||id==="bandana"?'<img class="shape-scarf-img" src="data:image/webp;base64,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" alt="">':""}</div><strong>${name}</strong>
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

function renderPatterns(){
  const box=document.querySelector("#pattern .pattern-grid");
  if(!box)return;
  box.classList.toggle("single-option",state.shape==="קשת");
  const isTriangle=state.shape==="משולש";
  const isBandana=state.shape==="בנדנה";
  if(isTriangle || isBandana){
    const sizeClass=isBandana?" bandana-pattern":"";
    box.innerHTML=`<button class="pattern-card" data-pattern="single"><div class="pattern-visual triangle-pattern${sizeClass} pattern-1"></div><strong>תבנית 1 — בד אחד</strong><span>ריבוע שלם מבד אחד.</span></button>
       <button class="pattern-card" data-pattern="a"><div class="pattern-visual triangle-pattern${sizeClass} pattern-2"></div><strong>תבנית 2 — שני בדים</strong><span>בד מרכזי עם מסגרת חיצונית מבד שני.</span></button>
       <button class="pattern-card" data-pattern="b"><div class="pattern-visual triangle-pattern${sizeClass} pattern-3"></div><strong>תבנית 3 — שלושה בדים</strong><span>שני משולשים שווים ומסגרת חיצונית דקה מבד שלישי.</span></button>`;
    return;
  }
  if(state.shape==="קשת"){
    box.innerHTML=`<button class="pattern-card" data-pattern="single"><div class="pattern-visual bow-pattern"></div><strong>קשת חלקה</strong><span>בד אחד, ללא חלוקה.</span></button>`;
    return;
  }
  const isRibbon=state.shape==="סרט";
  const longSizeClass=isRibbon?" ribbon-pattern":"";
  box.innerHTML=`<button class="pattern-card" data-pattern="single"><div class="pattern-visual long-pattern${longSizeClass} pattern-1"></div><strong>תבנית 1 — מלבן פשוט</strong><span>מלבן אחד, בד אחד.</span></button>
       <button class="pattern-card" data-pattern="a"><div class="pattern-visual long-pattern${longSizeClass} pattern-2"></div><strong>תבנית 2 — חלוקה אופקית</strong><span>חלק עליון בד אחד, חלק תחתון בד שני.</span></button>
       <button class="pattern-card" data-pattern="b"><div class="pattern-visual long-pattern${longSizeClass} pattern-3"></div><strong>תבנית 3 — חלוקה משולבת</strong><span>החלק העליון בד אחד, והתחתון מתחלק 50/50 לשני בדים.</span></button>`;
}

function choosePattern(value){
  state.pattern=value;
  state.fabrics=[];
  state.price=109;
  show("fabrics");
  updatePrice();
  renderLivePreview();
}

function fabricVisual(item){
  if(!item)return "";
  const parts=item.split(":");
  const group=parts[0], name=parts.slice(1).join(":");
  if(group==="base"){const found=colors.base.find(x=>x[0]===name);return found?found[1]:"";}
  const arr=group==="print"?colors.print:colors.lace;
  const found=arr.find(x=>x[0]===name);
  if(!found)return "";
  const map={print_botanical:"botanical",print_waves:"waves",print_vintage:"floral",print_tropical:"tropical",print_softflowers:"softflowers",print_geo:"geo",print_leaves:"leaves",print_abstract:"abstract",lace_cream:"laceCream",lace_black:"laceBlack",lace_pink:"lacePink",lace_natural:"laceNatural"};
  return textileSvgs[map[found[1]]]||"";
}
function previewSlots(){return state.pattern==="single"?1:state.pattern==="a"?2:3;}
function renderLivePreview(){
  const box=$("#livePreview");if(!box)return;
  const count=previewSlots();
  const cls=(state.shape==="משולש"||state.shape==="בנדנה")?"live-square":state.shape==="קשת"?"live-bow":state.shape==="סרט"?"live-ribbon":"live-long";
  box.className="live-preview "+cls+" slots-"+count;
  box.innerHTML=Array.from({length:count},(_,i)=>{const fill=fabricVisual(state.fabrics[i]);const style=fill?(fill.startsWith("#")?"background:"+fill:"background-image:url(\'"+fill+"\');background-size:cover;background-position:center"):"";return '<div class="live-part part-'+(i+1)+'" style="'+style+'"><span>'+(fill?"":"בד "+(i+1))+'</span></div>';}).join("");
}

function chooseFinish(button){
  state.finish=button.dataset.finish==="none"?"נקי":
    button.dataset.finish==="tiara"?"נזר בד":
    button.dataset.finish==="fringe"?"פרנזים":"שרשרת";
  state.price=basePrice()+(state.fabrics.length>=2?45:0)+(state.fabrics.length>=3?35:0)+(+button.dataset.add||0);
  $("#finalPrice").textContent=state.price;
  $("#summaryShape").textContent=state.shape;
  $("#summaryPattern").textContent=state.pattern==="single"?"בד ראשוני בלבד":state.pattern==="a"?"תבנית א׳":"תבנית ב׳";
  $("#summaryFinish").textContent=state.finish;
  const live=$("#livePreview"), final=$("#finalScarf");
  if(live&&final){final.className=live.className;final.innerHTML=live.innerHTML;}
  show("result");
}

document.addEventListener("click",event=>{
  const restart=event.target.closest("[data-restart-design]");
  if(restart){event.preventDefault();restartDesign();return;}

  const back=event.target.closest("[data-back]");
  if(back){event.preventDefault();goBack();return;}

  const go=event.target.closest("[data-go]");
  if(go){event.preventDefault();show(go.dataset.go);return;}

  const cover=event.target.closest("[data-cover]");
  if(cover){chooseCover(cover.dataset.cover);return;}

  const form=event.target.closest(".form-card");
  if(form){state.shape=form.dataset.shape;renderPatterns();show("pattern");return;}

  const pattern=event.target.closest("[data-pattern]");
  if(pattern){choosePattern(pattern.dataset.pattern);return;}

  const swatch=event.target.closest(".swatch");
  if(swatch){
    swatch.classList.toggle("selected");
    const item=swatch.dataset.group+":"+swatch.dataset.name;
    if(swatch.classList.contains("selected"))state.fabrics.push(item);
    else state.fabrics=state.fabrics.filter(x=>x!==item);
    state.price=basePrice()+(state.fabrics.length>=2?45:0)+(state.fabrics.length>=3?35:0);
    updatePrice();updateNote();renderLivePreview();return;
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