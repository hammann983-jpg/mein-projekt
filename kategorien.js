// Automatische Kategorisierung ohne KI: deterministisch, nachvollziehbar. Die erste Regel gewinnt.
// 1. Quelle (Fabis Kalender -> fabian, Kalender „Familie" -> familie)
// 2. manuelle Zuordnung (gilt für diesen Termin für immer)
// 3. Titel-Präfix (Arbeit:, Content:, Familie:, Fabi:, Privat:)
// 4. Stichwörter (eigene Regeln der Nutzerin zuerst, dann die Liste unten)
// 5. Standard: persoenlich. Passt keine Regel und kein Persönlich-Stichwort, ist der Termin unsicher („?").
// Stichwort mit * am Ende passt auf alle Wörter, die so beginnen (reel* -> Reels). Ohne * muss das ganze Wort passen.

(function(root){
const KW={
 arbeit:["hpt","dienst","frühdienst","spätdienst","nachtdienst","mitarbeitergespräch*","supervision*","teamsitzung*","teambesprechung*","förderkonferenz*","elterngespräch*","hilfeplan*","lebenshilfe","praktikantin*","anleitung*","fortbildung*","hausunterricht"],
 content:["content*","reel*","tiktok*","instagram*","story","stories","karussell*","dreh*","videodreh*","filmen","schneiden","schnitt","videoschnitt","upload*","posten","ugc","caption*","ootd","grwm","voiceover*","skript*"],
 familie:["mama","papa","familie*","schwester","amelie","oma","opa"],
 fabian:["fabi","fabian"],
 ferien:["ferien*"]};
// Nur mit einem dieser Wörter zählt „Geburtstag" als Familienleben.
const FAMILY_NAMES=["mama","papa","familie*","schwester","amelie","oma","opa"];
// Stichwörter, die Persönlich eindeutig machen (kein „?").
const PERSONAL=["arzt","ärztin","hausarzt","zahnarzt","ortho*","orthopäde","augen*","zahn*","friseur","frisör","gym","sport*","akad","lernen","lerneinheit","klinik*","universitätsklinikum","derm*","physio*","therapie*","impf*","yoga","laufen","training","fitness","einkauf*","putzen","aufräumen"];
const PREFIX={arbeit:"arbeit",content:"content",familie:"familie",fabi:"fabian",privat:"persoenlich",ferien:"ferien"};
const STOP=["termin","bei","beim","mit","und","der","die","das","für","von","zum","zur","dem","den","ein","eine","ca","mein","meine","meinen","meinem","meiner","dein","deine","unser","unsere","nach","vor","aus","auf","ins","über","heute","morgen","herr","herrn","frau"];

// Text für den Vergleich: klein, ohne Emojis und Sonderzeichen.
const clean=t=>String(t||"").replace(/[^\p{L}\p{N}\s:]/gu," ").replace(/\s+/g," ").trim();
const words=t=>clean(t).toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
const hit=(ws,kw)=>kw.some(k=>{const stem=k.endsWith("*"),w=k.replace("*","");return ws.some(x=>stem?x.startsWith(w):x===w)});

function categorize(ev,user){user=user||{};
 const manual=user.manual||{},rules=user.rules||{},ws=words(ev.title);
 if(ev.source==="fabi")return{cat:"fabian",why:"quelle",unsure:false};
 if(ev.source==="familie")return{cat:"familie",why:"quelle",unsure:false};
 const key=ev.key||ev.id;
 if(key&&manual[key])return{cat:manual[key],why:"manuell",unsure:false};
 const pre=clean(ev.title).toLowerCase().match(/^(arbeit|content|familie|fabi|privat|ferien)\s*:/);
 if(pre)return{cat:PREFIX[pre[1]],why:"präfix",unsure:false};
 for(const w of ws)if(rules[w])return{cat:rules[w],why:"nutzerregel",word:w,unsure:false};
 for(const c of["arbeit","content","familie","fabian","ferien"]){
  if(c==="familie"&&ws.includes("geburtstag")&&!hit(ws,FAMILY_NAMES))continue;
  if(hit(ws,KW[c]))return{cat:c,why:"stichwort",unsure:false}}
 if(ws.includes("geburtstag")&&hit(ws,FAMILY_NAMES))return{cat:"familie",why:"stichwort",unsure:false};
 return{cat:"persoenlich",why:"standard",unsure:!hit(ws,PERSONAL)}}

// Vorschlag für „Immer so für ‚Wort'?": das erste aussagekräftige Wort des Titels.
function suggestWord(title){const t=clean(title).replace(/^(arbeit|content|familie|fabi|privat|ferien)\s*:/i,"");
 const w=(t.toLowerCase().match(/[\p{L}]+/gu)||[]).find(x=>x.length>=4&&!STOP.includes(x));return w||""}

root.Kategorien={categorize,suggestWord,KW,PERSONAL};
if(typeof module!=="undefined")module.exports=root.Kategorien;
})(typeof window!=="undefined"?window:globalThis);
