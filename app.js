// Termin-App v2 – Phase 1: Reiter, Wochen- und Monatsansicht, Muster-Monatsrhythmus (Beispieldaten).
// Ohne Anmeldung zeigt die App keine Termine (keine Beispieldaten). Kategorien und To-dos kommen in den Phasen 3 und 4.

{
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad=n=>String(n).padStart(2,"0");
const sod=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x};
const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const monday=d=>{const x=sod(d);return addD(x,-((x.getDay()+6)%7))};
const ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fT=d=>d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});
const fD=(d,o)=>d.toLocaleDateString("de-DE",o);
const isoWeek=d=>{const x=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const n=x.getUTCDay()||7;x.setUTCDate(x.getUTCDate()+4-n);const y=new Date(Date.UTC(x.getUTCFullYear(),0,1));return Math.ceil(((x-y)/864e5+1)/7)};
const store={get(k,f){try{const v=localStorage.getItem(k);return v==null?f:JSON.parse(v)}catch(e){return f}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* ---------- Nutzerin, Reiter, Kategorien ---------- */
const CFG=window.TERMIN_CONFIG||{};
let ME=Object.values(CFG.USERS||{})[0]||{name:"Alicia",tabs:["ich","familie","fabi"]};
const TABS={ich:"Ich",familie:"Familie",fabi:"Fabi",todo:"To-dos"};
const CATS={arbeit:{n:"Arbeit"},content:{n:"Content"},familie:{n:"Familienleben"},fabian:{n:"Fabian"},persoenlich:{n:"Persönlich"},ferien:{n:"Ferien"}};
const K=window.Kategorien;
const SYS=/#(weeknum|holiday)@/; // Kalenderwochen und Feiertage von Google: nie als Reiter-Kalender wählbar
const cv=c=>`var(--c-${c})`;
const IMPORTANT=/prüfung|klausur|abgabe|frist|arzt|gespräch|supervision/i;
const isImp=e=>/!/.test(e.title)||(e.cat==="arbeit"&&!e.allDay)||IMPORTANT.test(e.title);
const clean=t=>t.replace(/\s*!+\s*/g," ").trim();

/* ---------- Muster: 5 Konzepte × 3 Farben, Wechsel am 1. jedes Monats ---------- */
const svgUrl=s=>`url("data:image/svg+xml,${encodeURIComponent(s)}")`;
const rng=s=>()=>{s=(s*16807)%2147483647;return(s-1)/2147483646};
function flowers(base,petal,center,leaf){const fl=(cx,cy,r,rot)=>{let g=`<g transform="translate(${cx} ${cy}) rotate(${rot})">`;
  if(leaf)g+=`<ellipse cx="${r*1.95}" cy="${r*.5}" rx="${r*1.05}" ry="${r*.42}" fill="${leaf}" transform="rotate(25)"/><ellipse cx="${-r*1.9}" cy="${r*.6}" rx="${r*.95}" ry="${r*.38}" fill="${leaf}" transform="rotate(-20)"/>`;
  for(let i=0;i<5;i++){const a=(i*72)*Math.PI/180;g+=`<ellipse cx="${(Math.cos(a)*r).toFixed(1)}" cy="${(Math.sin(a)*r).toFixed(1)}" rx="${(r*.78).toFixed(1)}" ry="${(r*.62).toFixed(1)}" transform="rotate(${i*72} ${(Math.cos(a)*r).toFixed(1)} ${(Math.sin(a)*r).toFixed(1)})" fill="${petal}"/>`}
  return g+`<circle r="${(r*.55).toFixed(1)}" fill="${center}"/><circle r="${(r*.22).toFixed(1)}" fill="${petal}" opacity=".35"/></g>`};
 return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="180" height="180" fill="${base}"/>${fl(45,45,13,8)}${fl(135,135,13,40)}${fl(135,45,7,20)}${fl(45,135,7,60)}<circle cx="90" cy="90" r="3.5" fill="${petal}"/><circle cx="0" cy="90" r="3.5" fill="${petal}"/><circle cx="180" cy="90" r="3.5" fill="${petal}"/><circle cx="90" cy="0" r="3.5" fill="${petal}"/><circle cx="90" cy="180" r="3.5" fill="${petal}"/></svg>`)}
function aquarell(base,cols,op,seed){const size=420,r=rng(seed);let c="";for(let i=0;i<13;i++){const x=r()*size,y=r()*size,rad=22+r()*60,col=cols[i%cols.length];
  for(const dx of[0,-size,size])for(const dy of[0,-size,size]){if((dx||dy)&&(x+dx+rad<0||x+dx-rad>size||y+dy+rad<0||y+dy-rad>size))continue;
   c+=`<circle cx="${(x+dx).toFixed(1)}" cy="${(y+dy).toFixed(1)}" r="${rad.toFixed(1)}" fill="${col}" fill-opacity="${op}" stroke="${col}" stroke-opacity="${Math.min(1,op*1.5)}" stroke-width="3"/>`}}
 return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${base}"/><defs><filter id="w" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="20"/><feGaussianBlur stdDeviation="1.2"/></filter></defs><g filter="url(#w)">${c}</g></svg>`)}
const dots=(dot,base,s=100,r=6)=>`radial-gradient(circle,${dot} ${r}px,transparent ${r+1}px) 0 0/${s}px ${s*.92}px,radial-gradient(circle,${dot} ${r}px,transparent ${r+1}px) ${s/2}px ${s*.46}px/${s}px ${s*.92}px,${base}`;
const stripes=(a,b,w1=52,w2=64)=>`repeating-linear-gradient(90deg,${a} 0 ${w1}px,${b} ${w1}px ${w1+w2}px)`;
const BUB='url("bubbles.jpg") center/cover no-repeat,#eef0f6';
/* Deine Muster in dieser Reihenfolge, jedes 4 Wochen lang. Bilder liegen in muster/. Die Schriftfarbe (ink, accent) ist je Muster angepasst. */
const dotTile=(w,h,pts,r,dot,base)=>svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${base}"/>${pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${dot}"/>`).join("")}</svg>`);
const IMG=f=>`url("muster/${f}") center top/cover no-repeat,#fff`;
const NEW=[
 {n:"Rot-weiße Punkte",v:[{n:"Bordeaux",bg:dotTile(54,88,[[16,33],[39,77]],6,"#ffffff","#531717"),card:"#fffaf3",ink:"#3a0a12",accent:"#7a0c1a"}]},
 {n:"Schwarz-weiße Punkte",v:[{n:"Schwarz-Weiß",bg:dotTile(106,80,[[26,34],[79,69]],7,"#000000","#ffffff"),card:"#ffffff",ink:"#141414",accent:"#141414"}]},
 {n:"Hellblaue Streifen",v:[{n:"Hellblau",bg:stripes("#f5f0eb","#c0ccd6",12,17),card:"#fbfaf8",ink:"#1b2d47",accent:"#3a5f8f"}]},
 {n:"Blaue Wellen",v:[{n:"Blau-Weiß",bg:IMG("4-blaue-wellen.jpg"),card:"#ffffff",ink:"#0f2a55",accent:"#1f64b4"}]},
 {n:"Aquarell-Seifenblasen",v:[{n:"Blau",bg:IMG("5-aquarell-seifenblasen.jpg"),card:"rgba(255,255,255,.92)",ink:"#1d3550",accent:"#3f78a8"}]},
 {n:"Bunte Aquarellkreise",v:[{n:"Bunt",bg:IMG("6-bunte-aquarellkreise.jpg"),card:"rgba(255,252,246,.95)",ink:"#2b1d3a",accent:"#7b3fa0"}]}];
const OLD=[
 {n:"Punkte",v:[
  {n:"Creme & Bordeaux",bg:dots("#64000a","#f3e6d6"),card:"#fffaf3",ink:"#3a0a12",accent:"#7a0c1a"},
  {n:"Rosa & Bordeaux",bg:dots("#7d1120","#ffd6ec"),card:"#fff7fb",ink:"#45091a",accent:"#7d1120"},
  {n:"Schwarz-Weiß",bg:dots("#141414","#f7f5f0"),card:"#ffffff",ink:"#141414",accent:"#141414"}]},
 {n:"Streifen",v:[
  {n:"Bordeaux & Rosa",bg:stripes("#7d1120","#ffaddb"),card:"#fff6fa",ink:"#45091a",accent:"#7d1120"},
  {n:"Schwarz-Weiß",bg:stripes("#141414","#f7f5f0"),card:"#ffffff",ink:"#141414",accent:"#141414"},
  {n:"Creme & Rot",bg:stripes("#b3132b","#f3e6d6",44,56),card:"#fffaf3",ink:"#3a0a12",accent:"#a3112a"}]},
 {n:"Seifenblasen",v:[
  {n:"Perlmutt",bg:BUB,card:"rgba(255,255,255,.86)",ink:"#2b2340",accent:"#7b55d6"},
  {n:"Rosé-Perlmutt",bg:BUB,card:"rgba(255,250,252,.88)",ink:"#45091a",accent:"#c2185b",tint:"#ff9cc5",blend:"multiply",tintop:.42},
  {n:"Schwarz-Weiß",bg:BUB,card:"rgba(255,255,255,.9)",ink:"#141414",accent:"#141414",tint:"#000",blend:"saturation",tintop:1}]},
 {n:"Blumen",v:[
  {n:"Creme & rote Blüten",bg:flowers("#f3e6d6","#9c0f22","#f0bd4f"),card:"#fffaf3",ink:"#3a0a12",accent:"#7a0c1a"},
  {n:"Rosa & Grün",bg:flowers("#ffd6ec","#d9486a","#fff1a8","#5c8a5a"),card:"#fff8fb",ink:"#45091a",accent:"#b0204a"},
  {n:"Schwarz-Weiß",bg:flowers("#141414","#f7f5f0","#141414"),card:"#ffffff",ink:"#141414",accent:"#141414",ring:"rgba(255,255,255,.35)"}]},
 {n:"Aquarellkreise",v:[
  {n:"Beeren",bg:aquarell("#f6ece0",["#c0405a","#e8899a","#8a1426","#f3b5a8"],.42,11),card:"#fffaf3",ink:"#3a0a12",accent:"#8a1426"},
  {n:"Pfirsich",bg:aquarell("#fff3e8",["#f4a38c","#e8738a","#f7c59f","#d9485f"],.45,23),card:"#fffaf6",ink:"#4a1610",accent:"#c2364f"},
  {n:"Tusche",bg:aquarell("#fafafa",["#141414","#555","#8a8a8a"],.3,37),card:"#ffffff",ink:"#141414",accent:"#141414"}]}];
const CONCEPTS=[...NEW,...OLD];
/* Wechsel alle 4 Wochen von selbst. Start: Montag 23.11.2026 mit den rot-weißen Punkten, danach in der Reihenfolge von NEW. */
const NOW0=new Date();
const weekIdx=Math.floor((monday(NOW0)-new Date(2026,10,23))/(7*864e5));
const phase=Math.floor(weekIdx/4),phaseWeek=((weekIdx%4)+4)%4+1;
const phaseEnd=addD(monday(NOW0),(4-phaseWeek)*7+6);
const CUR=[((phase%NEW.length)+NEW.length)%NEW.length,0];let shown=[...CUR];
function applyPattern(ci,vi){const v=CONCEPTS[ci].v[vi],r=document.documentElement.style;shown=[ci,vi];
 r.setProperty("--pattern",v.bg);r.setProperty("--card",v.card);r.setProperty("--ink",v.ink);r.setProperty("--accent",v.accent);r.setProperty("--ring",v.ring||"rgba(255,255,255,.55)");
 r.setProperty("--tint",v.tint||"transparent");r.setProperty("--blend",v.blend||"normal");r.setProperty("--tintop",v.tintop||0);
 const isCur=ci===CUR[0]&&vi===CUR[1];
 $("patSub").textContent=isCur?`Aktuell: ${CONCEPTS[ci].n} – Woche ${phaseWeek} von 4. Am ${fD(addD(phaseEnd,1),{day:"numeric",month:"long"})} kommt das nächste Muster: ${CONCEPTS[(CUR[0]+1)%NEW.length].n}.`:`Vorschau: ${CONCEPTS[ci].n} · ${v.n}. Aktuell ist ${CONCEPTS[CUR[0]].n} · ${CONCEPTS[CUR[0]].v[CUR[1]].n}.`;
 renderCatalog()}
function renderCatalog(){$("catGrid").innerHTML=CONCEPTS.map((c,ci)=>`<div class="crow"><h3>${c.n}</h3>${c.v.map((v,vi)=>`<button type="button" class="sw${ci===shown[0]&&vi===shown[1]?" sel":""}${ci===CUR[0]&&vi===CUR[1]?" cur":""}" data-c="${ci}" data-v="${vi}" style="--swb:${esc(v.bg)};--swf:${v.blend==="saturation"?"grayscale(1)":v.tint?"sepia(.35) saturate(2.2) hue-rotate(-35deg)":"none"}" aria-label="${c.n} ${v.n}"><span>${v.n}</span></button>`).join("")}</div>`).join("")}
$("catGrid").addEventListener("click",e=>{const b=e.target.closest(".sw");if(b)applyPattern(+b.dataset.c,+b.dataset.v)});
$("patReset").addEventListener("click",()=>applyPattern(CUR[0],CUR[1]));
$("patOpen").addEventListener("click",()=>{const open=$("pPattern").hidden;$("pPattern").hidden=!open;$("patOpen").setAttribute("aria-expanded",String(open));if(open)$("pPattern").scrollIntoView({behavior:"smooth",block:"start"})});

/* ---------- Zustand der Daten (t = Reiter) ---------- */
let events=[],mode="demo",settings={cal:{}},calList=[],updatedAt=null,loading=false;
const done=new Set(store.get("ta-done",[]));
const doneKey=e=>`${e.id}|${ymd(e.start)}`;
// To-dos (t="todo") erscheinen nur im Reiter „To-dos", nie als Termine.
const inTab=(e,tab)=>tab==="todo"?e.t==="todo":e.t==="todo"?false:tab==="fabi"?(e.t==="fabi"||e.cat==="fabian"):e.t===tab;

/* ---------- Zustand ---------- */
let tab=store.get("ta-tab","ich");if(!ME.tabs.includes(tab))tab=ME.tabs[0];
let view=store.get("ta-view","woche"),monthCur=new Date(),selDay=null;
const expandedDays=new Set();
const tabEvents=()=>events.filter(e=>inTab(e,tab)).sort((a,b)=>a.start-b.start);
const onDay=d=>{const a=sod(d),b=addD(a,1);return tabEvents().filter(e=>e.start<b&&e.end>a)};

/* ---------- Anzeige ---------- */
function inTxt(e){const now=new Date();if(e.start<=now)return"läuft gerade";
 const d=Math.round((sod(e.start)-sod(now))/864e5),min=Math.round((e.start-now)/6e4);
 if(e.allDay)return d===0?"heute ganztägig":d===1?"morgen ganztägig":`in ${d} Tagen, ${fD(e.start,{weekday:"short",day:"numeric",month:"numeric"})}`;
 if(d===0)return min<60?`in ${min} Min.`:`in ${Math.floor(min/60)} Std. ${min%60} Min.`;
 return d===1?`morgen ${fT(e.start)}`:`in ${d} Tagen, ${fD(e.start,{weekday:"short"})} ${fT(e.start)}`}
const tTxt=e=>e.allDay?"ganztägig":`${fT(e.start)}–${fT(e.end)}`;
function renderTabs(){$("tabs").innerHTML=ME.tabs.map(k=>`<button type="button" role="tab" data-t="${k}" aria-selected="${k===tab}">${esc(TABS[k])}</button>`).join("")}
const noCd=e=>e.cat==="persoenlich"||e.cat==="ferien"||(CFG.NO_COUNTDOWN||[]).some(w=>e.title.toLowerCase().includes(String(w).toLowerCase()));
function renderNow(){if(tab==="todo")return;const now=new Date(),nx=tabEvents().find(e=>e.end>now&&!(e.allDay&&e.start<now)&&!done.has(doneKey(e))&&!noCd(e));const lab=$("nowLabel");
 if(!nx){lab.style.removeProperty("--cc");lab.innerHTML="<i></i>Jetzt dran";$("nowTitle").textContent=mode==="demo"?"Noch nicht angemeldet":"Nichts offen";$("nowMeta").textContent=mode==="demo"?"Melde dich an, dann steht hier dein nächster Termin.":"Alles erledigt oder frei. Zeit für dich.";["cdD","cdH","cdM"].forEach(i=>$(i).textContent="0");$("cdNote").textContent="";return}
 lab.style.setProperty("--cc",cv(nx.cat));lab.innerHTML=`<i></i>Jetzt dran · ${esc(CATS[nx.cat].n)}`;$("nowTitle").textContent=clean(nx.title);
 $("nowMeta").textContent=`${fD(nx.start,{weekday:"long",day:"numeric",month:"long"})} · ${tTxt(nx)}${nx.location?" · "+nx.location:""}`;
 const ms=Math.max(0,nx.start-now);$("cdD").textContent=Math.floor(ms/864e5);$("cdH").textContent=Math.floor(ms%864e5/36e5);$("cdM").textContent=Math.floor(ms%36e5/6e4);
 $("cdNote").textContent=inTxt(nx)}
/* Prozent und Balken gibt es nur für To-dos, nicht für Termine. Gezählt wird: fällig diese Woche, plus offene aus früheren Tagen. */
const todoSet=()=>{const m=monday(new Date()),end=addD(m,7);return events.filter(e=>e.t==="todo"&&((e.start>=m&&e.start<end)||(!e.done&&e.start<m)))};
function renderProg(){const m=monday(new Date()),td=tab==="todo";
 $("swW").textContent=`${fD(m,{day:"numeric",month:"numeric"})}–${fD(addD(m,6),{day:"numeric",month:"numeric"})}`;$("swM").textContent=fD(monthCur,{month:"long"});
 document.querySelector(".now").hidden=td;document.querySelector(".switch").hidden=td;document.querySelector(".prog").hidden=!td;
 if(!td)return;
 const set=todoSet(),d=set.filter(e=>e.done).length,p=set.length?Math.round(d/set.length*100):0;
 $("fill").style.width=p+"%";$("pct").textContent=`${p} %${set.length?` · ${d} von ${set.length}`:""}`;
 $("statL").innerHTML=set.length?`<b>${d} von ${set.length}</b> To-dos diese Woche geschafft`:"Noch keine To-dos diese Woche";
 $("statR").textContent=set.length-d?`${set.length-d} offen`:set.length?"Woche geschafft":""}
function dayCard(d,i,expanded){const today=sod(new Date()),l=onDay(d),isT=+d===+today,past=d<today,dn=l.filter(e=>done.has(doneKey(e))).length;
 const show=expanded?l:[...l].sort((a,b)=>isImp(b)-isImp(a)||a.start-b.start).slice(0,4).sort((a,b)=>a.start-b.start);
 return`<article class="card day${past?" past":""}${isT?" today":""}" style="animation-delay:${i*.04}s" ${isT?'id="todayCard"':""}>
 <div class="dh"><div class="dn">${d.getDate()}</div><div class="dw">${esc(fD(d,{weekday:"long"}))}<small>${isT?"heute":esc(fD(d,{day:"numeric",month:"long"}))}</small></div><div class="dots">${l.map(e=>`<i class="${done.has(doneKey(e))?"on":""}"></i>`).join("")}</div></div>
 ${l.length?`<ul class="items">${show.map(e=>`<li><label class="it" style="--cc:${cv(e.cat)}"><input type="checkbox" data-k="${esc(doneKey(e))}" ${done.has(doneKey(e))?"checked":""}><span><span class="it-m">${e.allDay?"ganztägig":esc(fT(e.start))} · ${esc(CATS[e.cat].n)}${isImp(e)?'<span class="star" aria-label="wichtig">★</span>':""}</span><span class="it-t">${esc(clean(e.title))}</span></span>${e.unsure?`<button type="button" class="q" data-q="${esc(e.id)}" aria-label="Kategorie wählen">?</button>`:""}</label></li>`).join("")}</ul>`:'<div class="free">frei – Zeit für dich</div>'}
 ${l.length>show.length?`<button type="button" class="more" data-more="${ymd(d)}">+ ${l.length-show.length} weitere</button>`:""}
 ${l.length&&dn===l.length?'<div class="alldone">Alles erledigt – stark!</div>':""}</article>`}
function sumCard(){const m=monday(new Date()),wk=tabEvents().filter(e=>e.start>=m&&e.start<addD(m,7)),by={};wk.forEach(e=>by[e.cat]=(by[e.cat]||0)+1);
 return`<article class="card day sumcard" style="animation-delay:.3s"><h3>Woche im Blick</h3><p>${wk.length} ${wk.length===1?"Termin":"Termine"}</p>
 <div class="cnt">${Object.keys(CATS).filter(k=>by[k]).map(k=>`<span style="--cc:${cv(k)}"><i></i>${by[k]} ${CATS[k].n}</span>`).join("")||"<span>frei</span>"}</div></article>`}
function renderWeek(){const m=monday(new Date());$("view").innerHTML=`<div class="week">${[0,1,2,3,4,5,6].map(i=>dayCard(addD(m,i),i,expandedDays.has(ymd(addD(m,i))))).join("")}${sumCard()}</div>`}
function renderMonth(){const f=new Date(monthCur.getFullYear(),monthCur.getMonth(),1),s=monday(f),today=sod(new Date());
 let g="";for(let i=0;i<42;i++){const d=addD(s,i);if(i===35&&d.getMonth()!==f.getMonth())break;const l=onDay(d);
  g+=`<button type="button" class="md${d.getMonth()!==f.getMonth()?" out":""}${+d===+today?" today":""}${selDay&&+d===+selDay?" sel":""}" data-day="${ymd(d)}" aria-label="${esc(fD(d,{day:"numeric",month:"long"}))}: ${l.length} Termine"><b>${d.getDate()}</b>${l[0]?`<span class="mt">${esc(clean(l[0].title))}</span>`:""}<span class="md-dots">${l.slice(0,5).map(e=>`<i style="--cc:${cv(e.cat)}"></i>`).join("")}</span></button>`}
 $("view").innerHTML=`<section class="card"><div class="mtop"><h2>${esc(fD(f,{month:"long",year:"numeric"}))}</h2><div class="nav"><button type="button" id="mPrev" aria-label="Voriger Monat">‹</button><button type="button" id="mToday">Heute</button><button type="button" id="mNext" aria-label="Nächster Monat">›</button></div></div>
 <div class="mh">${["Mo","Di","Mi","Do","Fr","Sa","So"].map(x=>`<div>${x}</div>`).join("")}</div><div class="mg" style="margin-top:6px">${g}</div>
 <p class="mhint">Tipp auf einen Tag, um ihn als Liste zu sehen.</p></section>${selDay?`<div class="mdetail">${dayCard(selDay,0,true)}</div>`:""}`;
 $("mPrev").onclick=()=>moveMonth(-1);$("mNext").onclick=()=>moveMonth(1);$("mToday").onclick=()=>{monthCur=new Date();selDay=sod(new Date());renderAll()}}
function moveMonth(n){monthCur=new Date(monthCur.getFullYear(),monthCur.getMonth()+n,1);selDay=null;renderAll()}
/* ---------- To-dos: Zeitleiste nach Fälligkeit ---------- */
function todoLine(e){const t=e.week?"ohne festen Tag":e.allDay?"ganztägig":fT(e.start);
 return`<li><label class="it" style="--cc:${cv(e.cat)}"><input type="checkbox" data-td="${esc(e.id)}" ${e.done?"checked":""}><span><span class="it-m">${t} · ${esc(CATS[e.cat].n)}</span><span class="it-t">${esc(clean(e.title))}</span></span></label></li>`}
function renderTodo(){const today=sod(new Date()),m=monday(today),all=events.filter(e=>e.t==="todo").sort((a,b)=>a.start-b.start),groups=[];
 const over=all.filter(e=>!e.done&&e.start<today&&!e.week);if(over.length)groups.push({cls:"over",label:"Überfällig",sub:`${over.length} offen`,items:over});
 const weekGroup=w=>{const ws=addD(m,7*w),wk=all.filter(e=>e.week&&e.start>=ws&&e.start<addD(ws,7));
  if(wk.length)groups.push({cls:"",label:w===0?"Diese Woche":w===1?"Nächste Woche":`Woche ab ${fD(ws,{day:"numeric",month:"long"})}`,sub:"ohne festen Tag",items:wk})};
 weekGroup(0);
 for(let i=0;i<=Math.round((addD(today,13)-m)/864e5);i++){const d=addD(m,i),items=all.filter(e=>!e.week&&+sod(e.start)===+d&&(e.start>=today||e.done));if(!items.length)continue;
  const n=Math.round((d-today)/864e5);groups.push({cls:n===0?"today":n<0?"past":"",label:n===0?"Heute":n===1?"Morgen":fD(d,{weekday:"long"}),sub:fD(d,{day:"numeric",month:"long"}),items})}
 for(let w=1;w<5;w++)weekGroup(w);
 $("view").innerHTML=groups.length?`<section class="card todo"><div class="tl">${groups.map(g=>`<div class="tl-day ${g.cls}"><div class="tl-dot"></div><h3>${esc(g.label)}<small>${esc(g.sub)}</small></h3><ul class="items">${g.items.map(todoLine).join("")}</ul></div>`).join("")}</div></section>`
  :`<section class="card todo"><h2>${mode==="demo"?"Noch nicht angemeldet":"Noch keine To-dos"}</h2><p class="sub">${mode==="demo"?"Melde dich an, dann siehst du hier deine To-dos.":"Schreib Claude im Chat, was diese Woche ansteht. Claude legt jedes To-do an, und es erscheint hier."}</p></section>`}
async function toggleTodo(id,checked){const e=events.find(x=>x.id===id);if(!e)return;e.done=checked;renderAll();
 const wk=todoSet();toast(checked?(wk.length&&wk.every(x=>x.done)?"Alles geschafft – stark!":"Geschafft"):"Wieder offen");
 try{await G.patchEvent(e.calId,e.eid,{summary:(checked?"✓ ":"")+e.prefix+e.title})}
 catch(err){e.done=!checked;renderAll();toast("Speichern in Google hat nicht geklappt. Bitte nochmal tippen.")}}
function renderAll(){document.querySelectorAll(".switch button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===view));renderTabs();renderNow();renderProg();tab==="todo"?renderTodo():view==="monat"?renderMonth():renderWeek();
 if(mode==="live"&&tab!=="ich"&&tab!=="todo"&&!settings.cal[tab])$("view").insertAdjacentHTML("afterbegin",`<section class="card"><h2>Noch kein Kalender</h2><p class="sub">Für „${esc(TABS[tab])}" ist in Google noch kein Kalender zugeordnet. Lege in Google Kalender einen an oder lass ihn mit dir teilen. Dann wählst du ihn unter „Kalender zuordnen".</p></section>`)}
function toast(t){const el=$("toast");el.textContent=t;el.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove("on"),2600)}

/* ---------- Bedienung ---------- */
$("tabs").addEventListener("click",e=>{const b=e.target.closest("button[data-t]");if(!b)return;tab=b.dataset.t;store.set("ta-tab",tab);selDay=null;renderAll()});
document.querySelector(".switch").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;view=b.dataset.v;store.set("ta-view",view);if(view==="monat"&&!selDay)selDay=sod(new Date());renderAll()});
$("view").addEventListener("change",e=>{const td=e.target.closest("input[data-td]");if(td){toggleTodo(td.dataset.td,td.checked);return}const c=e.target.closest("input[data-k]");if(!c)return;c.checked?done.add(c.dataset.k):done.delete(c.dataset.k);store.set("ta-done",[...done].slice(-500));
 const m=monday(new Date()),wk=tabEvents().filter(x=>x.start>=m&&x.start<addD(m,7));
 toast(c.checked&&wk.length&&wk.every(x=>done.has(doneKey(x)))?"Woche geschafft – stark!":c.checked?"Abgehakt":"Wieder offen");setTimeout(renderAll,250)});
/* ---------- „?": Kategorie wählen, einmal fragen, Regel merken ---------- */
let qEv=null,qCat=null,qWord="";
function openQ(id){qEv=events.find(x=>x.id===id);if(!qEv)return;qCat=null;qWord="";$("qTitle").textContent=clean(qEv.title);
 $("qCats").innerHTML=["arbeit","content","familie","fabian","persoenlich"].map(k=>`<button type="button" class="btn qc" data-c="${k}" style="--cc:${cv(k)}">${esc(CATS[k].n)}</button>`).join("");
 $("qAsk").hidden=true;$("pQ").hidden=false;$("pQ").scrollIntoView({behavior:"smooth",block:"center"})}
async function applyQ(always){settings.manual=settings.manual||{};settings.manual[qEv.key]=qCat;
 if(always&&qWord){settings.rules=settings.rules||{};settings.rules[qWord]=qCat}
 $("pQ").hidden=true;recat();renderAll();toast(always&&qWord?`Gemerkt: „${qWord}" ist ${CATS[qCat].n}`:`Eingeordnet: ${CATS[qCat].n}`);
 if(G.signedIn())try{await G.saveSettings(settings)}catch(e){toast("Speichern in Google hat nicht geklappt. Gilt nur bis zum Neuladen.")}}
$("qCats").addEventListener("click",e=>{const b=e.target.closest("[data-c]");if(!b||!qEv)return;qCat=b.dataset.c;qWord=K.suggestWord(qEv.title);
 if(!qWord)return applyQ(false);$("qAskTxt").textContent=`Immer so für „${qWord}"?`;$("qAsk").hidden=false});
$("qYes").addEventListener("click",()=>applyQ(true));$("qNo").addEventListener("click",()=>applyQ(false));
$("view").addEventListener("click",e=>{const q=e.target.closest("[data-q]");if(q){openQ(q.dataset.q);return}const m=e.target.closest("[data-more]");if(m){expandedDays.add(m.dataset.more);renderWeek();return}
 const d=e.target.closest("[data-day]");if(d){const[y,mo,da]=d.dataset.day.split("-").map(Number);selDay=new Date(y,mo-1,da);renderMonth();setTimeout(()=>{const x=document.querySelector(".mdetail");if(x)x.scrollIntoView({behavior:"smooth",block:"nearest"})},50)}});

/* ---------- Google: Anmeldung, Kalender, Zuordnung (Phase 2) ---------- */
const G=window.TerminGoogle;
function hello(){const hr=new Date().getHours();$("hello").textContent=`${hr<11?"Guten Morgen":hr<17?"Hallo":hr<22?"Guten Abend":"Gute Nacht"}, ${ME.name} · ${fD(new Date(),{weekday:"long",day:"numeric",month:"long"})} · KW ${isoWeek(new Date())}`}
function setStatus(kind,text,btn,fn){const s=$("status");s.className="pill"+(kind==="live"?" live":"");s.innerHTML=`<i></i><span>${esc(text)}</span>`+(btn?`<button type="button" id="connBtn">${esc(btn)}</button>`:"");if(btn)$("connBtn").addEventListener("click",fn)}
function useDemo(text,btn,fn){mode="demo";events=[];$("calOpen").hidden=true;setStatus("demo",text,btn,fn);renderAll()}
const signInBtn=()=>G.signIn(false);
function onInitFail(e){const c=e&&e.code;
 if(c==="noid")return useDemo("Noch keine Google-Client-ID in config.js. Nächster Schritt: README Schritt 3 und 4.");
 if(c==="nolib")return useDemo("Google-Anmeldung konnte nicht geladen werden. Internet prüfen, dann neu laden.","Neu laden",()=>location.reload());
 if(c==="denied")return useDemo("Zugriff abgelehnt. Ohne Erlaubnis kann die App keine Termine zeigen.","Mit Google anmelden",signInBtn);
 useDemo("Anmeldung nicht abgeschlossen.","Mit Google anmelden",signInBtn)}
function onApiErr(e){const c=e&&e.code,live=mode==="live";
 if(c==="auth")return live?setStatus("demo","Anmeldung abgelaufen. Tippe auf Neu anmelden.","Neu anmelden",()=>G.signIn(true)):useDemo("Anmeldung abgelaufen.","Neu anmelden",()=>G.signIn(true));
 const why=c==="net"?"Keine Verbindung zu Google. Neuer Versuch in 2 Min.":e.status===403?"Google lehnt den Zugriff ab (403). Prüfe: Calendar API, Tasks API und Drive API sind in der Google Cloud aktiv und deine Adresse ist Testnutzer.":`Google meldet: ${String(e&&e.message||"Unbekannter Fehler").slice(0,100)}`;
 if(live)setStatus("live",`${why} Stand ${updatedAt?fT(updatedAt):""}`,"Abmelden",signOut);else useDemo(why,"Erneut versuchen",()=>connect())}
function signOut(){G.signOut();ME=Object.values(CFG.USERS||{})[0]||ME;useDemo("Abgemeldet.","Mit Google anmelden",signInBtn)}
function norm(o,k,calId){if(o.status==="cancelled")return null;const sr=o.start&&(o.start.dateTime||o.start.date);if(!sr)return null;const allDay=!o.start.dateTime;
 const start=allDay?new Date(sr+"T00:00:00"):new Date(sr),er=o.end&&(o.end.dateTime||o.end.date);let end=er?(allDay?new Date(er+"T00:00:00"):new Date(er)):new Date(+start+36e5);if(isNaN(start))return null;if(isNaN(end))end=new Date(+start+36e5);
 /* To-do = Eintrag im Kalender „To-dos" oder Titel mit „To-do:" bzw. „Woche:". Erledigt = Titel beginnt mit ✓. */
 const s=(o.summary||"(ohne Titel)").replace(/^\s*✓\s*/,""),dn=s!==(o.summary||"(ohne Titel)"),pm=s.match(/^\s*(to-?do|woche)\s*:\s*/i),todo=k==="todo"||!!pm;
 const e={id:`${k}:${o.id}`,eid:o.id,calId,key:o.recurringEventId||o.id,source:todo?"ich":k,t:todo?"todo":k,todo,week:!!pm&&/^\s*woche/i.test(pm[0]),done:todo&&dn,prefix:pm?pm[0]:"",title:todo?s.slice(pm?pm[0].length:0):(o.summary||"(ohne Titel)"),start,end,allDay,location:o.location||""};
 const r=K.categorize(e,settings);e.cat=r.cat;e.unsure=todo?false:r.unsure;return e}
function recat(){events.forEach(e=>{const r=K.categorize(e,settings);e.cat=r.cat;e.unsure=e.todo?false:r.unsure})}
async function refresh(){if(!G.signedIn()||loading)return;loading=true;
 const from=monday(addD(new Date(),-35)),to=addD(new Date(),150),out=[];
 try{for(const k of ME.tabs){const id=settings.cal[k];if(!id)continue;for(const o of await G.events(id,from,to)){const e=norm(o,k,id);if(e)out.push(e)}}
  events=out.sort((a,b)=>a.start-b.start);mode="live";updatedAt=new Date();setStatus("live",`Live mit Google · aktualisiert ${fT(updatedAt)}`,"Abmelden",signOut);renderAll()}
 catch(e){onApiErr(e)}finally{loading=false}}
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,"0")).join("");
async function connect(){
 try{calList=await G.calendars();const prim=calList.find(c=>c.primary),uh=prim?await sha(prim.id.toLowerCase()):"";
  ME=CFG.USERS&&CFG.USERS[uh]?CFG.USERS[uh]:{name:"du",tabs:["ich","familie"]};
  if(!ME.tabs.includes(tab)){tab=ME.tabs[0]}
  settings=await G.loadSettings();settings.cal=settings.cal||{};if(!("ich" in settings.cal))settings.cal.ich="primary";
  let fixed=false;for(const k of Object.keys(settings.cal))if(k!=="ich"&&SYS.test(settings.cal[k]||"")){delete settings.cal[k];fixed=true}
  if(fixed)try{await G.saveSettings(settings)}catch(e){}
  $("calOpen").hidden=ME.tabs.length<2;hello();await refresh();
  if(mode==="live"&&ME.tabs.some(k=>k!=="ich"&&!(k in settings.cal))&&calList.some(c=>!c.primary&&!SYS.test(c.id)))openCal(true)}
 catch(e){onApiErr(e)}}
function renderCal(){$("calRows").innerHTML=ME.tabs.filter(k=>k!=="ich").map(k=>`<label class="calrow">${esc(TABS[k])}<select data-k="${k}"><option value="">– kein Kalender –</option>${calList.filter(c=>!c.primary&&!SYS.test(c.id)).map(c=>`<option value="${esc(c.id)}"${settings.cal[k]===c.id?" selected":""}>${esc(c.name)}</option>`).join("")}</select></label>`).join("")}
function openCal(first){renderCal();$("calSub").textContent=first?"Erster Start: Wähle einmal, welcher Google-Kalender zu welchem Reiter gehört. Das gilt danach auf allen deinen Geräten.":"Welcher Google-Kalender gehört zu welchem Reiter?";$("calMsg").textContent="";$("pCal").hidden=false;$("calOpen").setAttribute("aria-expanded","true");$("pCal").scrollIntoView({behavior:"smooth",block:"start"})}
$("calOpen").addEventListener("click",()=>{if($("pCal").hidden)openCal(false);else{$("pCal").hidden=true;$("calOpen").setAttribute("aria-expanded","false")}});
$("calSave").addEventListener("click",async()=>{const msg=$("calMsg");$("calRows").querySelectorAll("select").forEach(s=>{settings.cal[s.dataset.k]=s.value});
 $("calSave").disabled=true;msg.className="msg";msg.textContent="Speichere …";
 try{await G.saveSettings(settings);msg.className="msg ok";msg.textContent="Gespeichert. Termine werden geladen.";await refresh();toast("Kalender zugeordnet")}
 catch(e){msg.className="msg err";msg.textContent=e.status===403?"Speichern abgelehnt (403). Prüfe: Drive API ist in der Google Cloud aktiv.":`Speichern hat nicht geklappt: ${String(e.message).slice(0,100)}`}
 $("calSave").disabled=false});
/* Aktualisierung: alle 2 Minuten, beim Zurückkehren, Ziehen nach unten */
setInterval(()=>{if(!document.hidden&&mode==="live")refresh()},120000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&mode==="live"&&updatedAt&&Date.now()-updatedAt>30000)refresh()});
let pullY=null;
document.addEventListener("touchstart",e=>{pullY=window.scrollY<=0?e.touches[0].clientY:null},{passive:true});
document.addEventListener("touchend",e=>{if(pullY!=null&&mode==="live"&&e.changedTouches[0].clientY-pullY>110){toast("Aktualisiere …");refresh()}pullY=null},{passive:true});

/* ---------- Start ---------- */
{const v=$("ver");if(v)v.textContent="Version 9 · 24.11.2026"}
hello();
setStatus("demo","Lade …");applyPattern(CUR[0],CUR[1]);renderAll();setInterval(renderNow,30000);
function boot(){G.init(connect,onInitFail);if(G.hasId()&&!G.remembered())useDemo("Melde dich an, um deine Termine zu sehen.","Mit Google anmelden",signInBtn)}
if(document.readyState==="complete")boot();else window.addEventListener("load",boot);
if(matchMedia("(max-width:760px)").matches&&view==="woche")setTimeout(()=>{const t=$("todayCard");if(t)t.scrollIntoView({block:"center"})},400);
if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(()=>{});
}
