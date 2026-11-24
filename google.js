// Google-Zugang: Anmeldung (Token nur im Speicher), Kalender lesen, Einstellungen in Drive appDataFolder.
// Kein Client-Secret, kein Server. Nur die öffentliche Client-ID aus config.js.

window.TerminGoogle=(()=>{
const CFG=window.TERMIN_CONFIG||{};
const TZ="Europe/Berlin";
const SCOPE=["https://www.googleapis.com/auth/calendar.readonly","https://www.googleapis.com/auth/calendar.events","https://www.googleapis.com/auth/tasks","https://www.googleapis.com/auth/drive.appdata"].join(" ");
const CAL="https://www.googleapis.com/calendar/v3";
const DRIVE="https://www.googleapis.com/drive/v3/files";
const UPLOAD="https://www.googleapis.com/upload/drive/v3/files";
let token=null,exp=0,client=null,onOk=null,onFail=null,fileId=null;

const hasId=()=>!!CFG.CLIENT_ID&&!/^DEINE/.test(CFG.CLIENT_ID)&&/\.apps\.googleusercontent\.com$/.test(CFG.CLIENT_ID);
const flag=()=>{try{return localStorage.getItem("ta-consent")==="1"}catch(e){return false}};
const setFlag=v=>{try{v?localStorage.setItem("ta-consent","1"):localStorage.removeItem("ta-consent")}catch(e){}};
const fail=(code,msg,status)=>Object.assign(new Error(msg||code),{code,status});

// Als Home-Bildschirm-App (iPhone) funktionieren Popups nicht zuverlässig. Dort meldet sich die App per Weiterleitung an.
const redirectMode=()=>navigator.standalone===true||(window.matchMedia&&matchMedia("(display-mode: standalone)").matches);
function fromRedirect(){const h=location.hash;if(!/access_token=|error=/.test(h))return null;
 const p=new URLSearchParams(h.slice(1));history.replaceState(null,"",location.pathname+location.search);
 let st=null;try{st=localStorage.getItem("ta-state");localStorage.removeItem("ta-state")}catch(e){}
 if(p.get("error"))return p.get("error")==="access_denied"?"denied":"closed";
 if(!st||p.get("state")!==st||!p.get("access_token"))return"closed";
 token=p.get("access_token");exp=Date.now()+(Number(p.get("expires_in"))||3600)*1000-60000;setFlag(true);return"ok"}
function init(ok,bad){onOk=ok;onFail=bad;
 if(!hasId())return bad(fail("noid"));
 const r=fromRedirect();if(r==="ok")return ok();if(r)return bad(fail(r));
 if(redirectMode()){if(flag())signIn(true);return}
 if(!(window.google&&google.accounts&&google.accounts.oauth2))return bad(fail("nolib"));
 client=google.accounts.oauth2.initTokenClient({client_id:CFG.CLIENT_ID,scope:SCOPE,
  callback:r=>{if(!r||r.error)return bad(fail(r&&r.error==="access_denied"?"denied":"closed"));
   token=r.access_token;exp=Date.now()+(Number(r.expires_in)||3600)*1000-60000;setFlag(true);onOk()},
  error_callback:()=>bad(fail("closed"))});
 if(flag())signIn(true)}
function signIn(silent){
 if(redirectMode()){const st=Array.from(crypto.getRandomValues(new Uint8Array(12)),b=>b.toString(16).padStart(2,"0")).join("");
  try{localStorage.setItem("ta-state",st)}catch(e){}
  const q=new URLSearchParams({client_id:CFG.CLIENT_ID,redirect_uri:location.origin+location.pathname,response_type:"token",scope:SCOPE,state:st,include_granted_scopes:"true"});
  if(!silent)q.set("prompt","consent");location.href="https://accounts.google.com/o/oauth2/v2/auth?"+q;return}
 if(client)client.requestAccessToken({prompt:silent?"":"consent"})}
function signOut(){try{if(token)google.accounts.oauth2.revoke(token,()=>{})}catch(e){}token=null;exp=0;fileId=null;setFlag(false)}
const signedIn=()=>!!token&&Date.now()<exp;

async function api(url,opt={}){
 if(!signedIn()){if(flag()&&client)signIn(true);throw fail("auth")}
 let r;try{r=await fetch(url,{...opt,headers:{Authorization:`Bearer ${token}`,...(opt.headers||{})}})}catch(e){throw fail("net")}
 if(r.status===401){token=null;throw fail("auth")}
 if(!r.ok){let m="";try{m=(await r.json()).error.message}catch(x){}throw fail("http",m||`Fehler ${r.status}`,r.status)}
 return r.status===204?null:r.json()}

async function calendars(){const d=await api(`${CAL}/users/me/calendarList?minAccessRole=reader&maxResults=250`);
 return(d.items||[]).map(c=>({id:c.id,name:c.summaryOverride||c.summary||c.id,primary:!!c.primary}))}
async function events(calId,from,to){let out=[],page="";
 for(let i=0;i<4;i++){const q=new URLSearchParams({timeMin:from.toISOString(),timeMax:to.toISOString(),singleEvents:"true",orderBy:"startTime",maxResults:"250",timeZone:TZ});if(page)q.set("pageToken",page);
  const d=await api(`${CAL}/calendars/${encodeURIComponent(calId)}/events?${q}`);out=out.concat(d.items||[]);page=d.nextPageToken;if(!page)break}
 return out}

// Ändert einen Termin (z. B. den Titel mit ✓ als erledigt). Braucht den Scope calendar.events.
async function patchEvent(calId,eventId,body){return api(`${CAL}/calendars/${encodeURIComponent(calId)}/events/${encodeURIComponent(eventId)}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})}

async function loadSettings(){
 const l=await api(`${DRIVE}?spaces=appDataFolder&q=${encodeURIComponent("name='settings.json'")}&fields=files(id)`);
 fileId=l.files&&l.files[0]?l.files[0].id:null;if(!fileId)return{};
 const d=await api(`${DRIVE}/${fileId}?alt=media`);return d&&typeof d==="object"?d:{}}
async function saveSettings(obj){const body=JSON.stringify(obj);
 if(fileId)return api(`${UPLOAD}/${fileId}?uploadType=media`,{method:"PATCH",headers:{"Content-Type":"application/json"},body});
 const b="ta"+Date.now();
 const multi=`--${b}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify({name:"settings.json",parents:["appDataFolder"]})}\r\n--${b}\r\nContent-Type: application/json\r\n\r\n${body}\r\n--${b}--`;
 const f=await api(`${UPLOAD}?uploadType=multipart&fields=id`,{method:"POST",headers:{"Content-Type":`multipart/related; boundary=${b}`},body:multi});fileId=f.id}

return{init,signIn,signOut,signedIn,hasId,remembered:flag,calendars,events,patchEvent,loadSettings,saveSettings}})();
