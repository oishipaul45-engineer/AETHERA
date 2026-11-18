(()=>{'use strict';if(window.__AETHERA_INFINITE__)return;window.__AETHERA_INFINITE__=true;
const TYPES=['Memory','Letter','Voice','Time Capsule','Dream','Map','Drawing','Timeline','Secret','Interactive','Music','Keepsake'];const emojis=['📷','✉️','🎙️','⌛','🌙','📍','🎨','🗓️','🔐','✨','🎵','🎟️'];let dbName='aethera_infinite_v1';let libraryOwner=null;let db,books=[],active=null,page=0,editing=-1,mode='Memory',fileData=null,drawCanvas=null,painting=false,unlockSession=new Set(),sound=true;
const $=id=>document.getElementById(id);const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2);const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const fmt=d=>{try{return new Date(d).toLocaleDateString()}catch{return d}};
function dbOpen(){return new Promise((resolve,reject)=>{const requestedName=dbName;const req=indexedDB.open(requestedName,1);req.onupgradeneeded=()=>{const d=req.result;d.createObjectStore('books',{keyPath:'id'});d.createObjectStore('assets',{keyPath:'id'})};req.onsuccess=()=>{if(requestedName!==dbName||!libraryOwner){req.result.close();reject(Error('Account changed during database opening'));return}db=req.result;resolve()};req.onerror=()=>reject(req.error)})}function assertPrivateLibrary(){const u=window.AetheraAuth?.getUser();if(!u?.id||u.id!==libraryOwner||!db||db.name!==window.AetheraLibraryStorage.getPrivateDatabaseName(u.id))throw Error('Sign in to your private library first.')}function store(name,method,val){return new Promise((resolve,reject)=>{try{assertPrivateLibrary()}catch(e){reject(e);return}const t=db.transaction(name,'readwrite');const r=t.objectStore(name)[method](val);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}async function load(){assertPrivateLibrary();books=await new Promise((resolve,reject)=>{const r=db.transaction('books').objectStore('books').getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});books.sort((a,b)=>b.updated-a.updated);if(active)active=books.find(b=>b.id===active.id)||null;drawList()}async function save(){assertPrivateLibrary();if(!active)return;active.updated=Date.now();await store('books','put',active);await load();draw()};async function asset(blob){assertPrivateLibrary();const id=uid();await store('assets','put',{id,blob});return id}async function getAsset(id){assertPrivateLibrary();return new Promise(resolve=>{const r=db.transaction('assets').objectStore('assets').get(id);r.onsuccess=()=>resolve(r.result?.blob||null);r.onerror=()=>resolve(null)})}let urls=[];function cleanUrls(){urls.forEach(u=>URL.revokeObjectURL(u));urls=[]}async function src(id){const b=await getAsset(id);if(!b)return '';const u=URL.createObjectURL(b);urls.push(u);return u}
function beep(){if(!sound)return;try{const a=new (window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.setValueAtTime(360,a.currentTime);o.frequency.exponentialRampToValueAtTime(180,a.currentTime+.15);g.gain.setValueAtTime(.025,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.19);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.2);o.onended=()=>a.close()}catch{}}
const root=document.createElement('div');root.id='aethera-infinite-root';root.innerHTML=`<div class="ai-shell"><aside class="ai-side"><h2>✧ Infinite Books</h2><small>AETHERA · your living archive</small><button id="ai-new">＋ Create a book</button><button id="ai-import">↥ Import backup</button><button id="ai-export">↧ Export backup</button><button id="ai-cloud-upload">☁ Upload cloud backup</button><button id="ai-cloud-download">☁ Restore cloud books</button><button id="ai-sound">♪ Page sound: on</button><button id="ai-close" class="ai-close">✕ Return to library</button><h3>My Books</h3><div class="ai-list" id="ai-books"></div><small>Stored in this browser. Export backups regularly.</small></aside><main class="ai-main"><header class="ai-head"><div><small>THE LIBRARY OF UNSPOKEN THINGS</small><h2 id="ai-title">Your stories begin here</h2></div><div><button id="ai-rename">Rename</button> <button id="ai-delete-book">Delete book</button></div></header><section class="ai-book-area"><div class="ai-book" id="ai-book"><div class="ai-sheet ai-left" id="ai-left"></div><div class="ai-sheet ai-right" id="ai-right"></div></div></section><nav class="ai-actions"><button id="ai-prev">← Previous</button><span id="ai-counter">No book selected</span><button id="ai-next">Next →</button><button class="ai-primary" id="ai-add">＋ Add a page</button><button id="ai-edit">Edit page</button><button id="ai-remove">Delete page</button></nav><div class="ai-toast" id="ai-toast"></div></main></div><section class="ai-editor" id="ai-editor"><h3 id="ai-editor-title">Create a page</h3><div id="ai-editor-body"></div></section>`;const launch=document.createElement('button');launch.id='aethera-infinite-launch';launch.textContent='✧ My Infinite Books';document.body.append(launch,root);
const toast=s=>{$('ai-toast').textContent=s;};const ensure=()=>{if(!active){toast('Create or select a book first.');return false}return true};function drawList(){$('ai-books').innerHTML=books.map(b=>`<button data-book="${esc(b.id)}" class="${active?.id===b.id?'ai-selected':''}">📖 ${esc(b.title)} <small>(${b.pages.length} pages)</small></button>`).join('')||'<small>No books yet. Create your first one.</small>'}function pageObj(){return active?.pages[page]};function turn(next){if(!ensure())return;if(next<0||next>=active.pages.length)return;const book=$('ai-book');const leaf=document.createElement('div');leaf.className='ai-flip';book.append(leaf);setTimeout(()=>leaf.remove(),760);page=next;beep();draw()}
async function draw(){cleanUrls();$('ai-title').textContent=active?.title||'Your stories begin here';$('ai-counter').textContent=active?`${active.pages.length?page+1:0} / ${active.pages.length}`:'No book selected';$('ai-left').innerHTML=`<small>✦ AETHERA ✦</small><h3>${esc(active?.title||'The Infinite Book')}</h3><p>${active?'Every page holds a universe.':'Create a book, then add your first memory.'}</p><div class="ai-page-number">✧</div>`;const p=pageObj();$('ai-right').innerHTML=p?await renderPage(p):'<h3>A blank page</h3><p>Press “Add a page” to begin your story.</p>';drawList()}
async function renderPage(p){const isLocked=p.type==='Time Capsule'&&p.date&&new Date(p.date).getTime()>Date.now();const isSecret=p.type==='Secret'&&!unlockSession.has(p.id);if(isLocked)return `<h3>⌛ ${esc(p.title)}</h3><p>This memory opens on ${esc(fmt(p.date))}.</p><div class="ai-page-number">Sealed in time</div>`;if(isSecret)return `<h3>🔐 ${esc(p.title)}</h3><p>A sealed page. Enter its passphrase to reveal it.</p><input id="ai-pass" type="password" placeholder="Passphrase" style="width:100%;padding:9px"><button class="ai-reveal" id="ai-unseal" data-id="${esc(p.id)}">Unseal</button><div class="ai-page-number">Private</div>`;let media='';if(p.assetId){const u=await src(p.assetId);if(u){if(p.mediaType?.startsWith('image/'))media=`<img src="${u}" alt="Saved memory">`;else if(p.mediaType?.startsWith('audio/'))media=`<audio controls src="${u}"></audio>`;else if(p.mediaType?.startsWith('video/'))media=`<video controls src="${u}"></video>`;else media=`<a href="${u}" download="${esc(p.fileName||'keepsake')}">Download attached keepsake</a>`}}if(p.type==='Drawing'&&p.drawing)media=`<img src="${p.drawing}" alt="Drawing">`+media;if(p.type==='Map'&&p.link){let url;try{url=new URL(p.link);if(!['https:','http:'].includes(url.protocol))url=null}catch{url=null}if(url)media+=`<p><a href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">📍 Open saved place</a></p>`}if(p.type==='Music'&&p.link){let url;try{url=new URL(p.link);if(!['https:','http:'].includes(url.protocol))url=null}catch{url=null}if(url)media+=`<p><a href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">♫ Open song or playlist</a></p>`}if(p.type==='Interactive')media+=`<button class="ai-choice" data-reveal="${esc(p.id)}">✨ Reveal a hidden thought</button><p id="ai-reveal-${esc(p.id)}" hidden>${esc(p.extra||'A little magic, just for you.')}</p>`;return `<small>${esc(p.type)} · ${esc(fmt(p.created))}</small><h3>${esc(p.title||'Untitled page')}</h3>${media}<p>${esc(p.text)}</p><div class="ai-page-number">${page+1}</div>`}
function closeEditor(){$('ai-editor').classList.remove('ai-show');fileData=null;drawCanvas=null}function editor(){if(!ensure())return;const p=editing>=0?active.pages[editing]:null;mode=p?.type||'Memory';$('ai-editor-title').textContent=p?'Edit this page':'Add a magical page';$('ai-editor').classList.add('ai-show');$('ai-editor-body').innerHTML=`<div class="ai-grid">${TYPES.map((t,i)=>`<button data-type="${t}" style="${mode===t?'background:#c5a1b9':''}">${emojis[i]} ${t}</button>`).join('')}</div><label>Page title</label><input id="ai-page-title" maxlength="160" value="${esc(p?.title||'')}"><label>Words, caption, or description</label><textarea id="ai-text" maxlength="50000" placeholder="What would you like to remember?">${esc(p?.text||'')}</textarea><div id="ai-special"></div><div class="ai-editor-buttons"><button class="ai-primary" id="ai-save-page">Save page</button><button id="ai-cancel">Cancel</button></div><p class="ai-note">Media is stored locally in your browser. Large files may exceed browser storage limits.</p>`;special(p);$('ai-editor-body').querySelectorAll('[data-type]').forEach(btn=>{btn.onclick=function(e){e.preventDefault();e.stopPropagation();mode=this.dataset.type;special(null);$('ai-editor-body').querySelectorAll('[data-type]').forEach(b=>{b.style.background=b===this?'#c5a1b9':''})}})}function special(p){const s=$('ai-special');const date=mode==='Time Capsule'?`<label>Unlock date</label><input type="datetime-local" id="ai-date" value="${esc(p?.date||'')}">`:'';const secret=mode==='Secret'?`<label>Page passphrase</label><input type="password" id="ai-secret" placeholder="${p?'Leave blank to keep existing passphrase':'Choose a passphrase'}"><p class="ai-note">This is a local access gate, not encryption.</p>`:'';const link=['Map','Music'].includes(mode)?`<label>${mode==='Map'?'Map URL':'Music / playlist URL'}</label><input type="url" id="ai-link" value="${esc(p?.link||'')}">`:'';const extra=mode==='Interactive'?`<label>Hidden reveal text</label><textarea id="ai-extra">${esc(p?.extra||'')}</textarea>`:'';const drawing=mode==='Drawing'?`<label>Draw on your page</label><canvas id="ai-draw" class="ai-draw" width="700" height="260"></canvas><button id="ai-clear" type="button">Clear drawing</button>`:'';const file=mode!=='Drawing'?`<label>Attach ${mode==='Voice'?'audio or a recording':mode==='Memory'?'photograph or video':'a file (optional)'}</label><input id="ai-file" type="file" accept="${mode==='Voice'?'audio/*':mode==='Memory'?'image/*,video/*':'*/*'}">${mode==='Voice'?'<button id="ai-record" type="button">🎙 Start recording</button><span id="ai-record-status"></span>':''}`:'';s.innerHTML=date+secret+link+extra+drawing+file;if(mode==='Drawing'){drawCanvas=$('ai-draw');const ctx=drawCanvas.getContext('2d');ctx.lineWidth=3;ctx.lineCap='round';ctx.strokeStyle='#714c68';if(p?.drawing){const im=new Image();im.onload=()=>ctx.drawImage(im,0,0,drawCanvas.width,drawCanvas.height);im.src=p.drawing}drawCanvas.onpointerdown=e=>{painting=true;drawCanvas.setPointerCapture(e.pointerId);const r=drawCanvas.getBoundingClientRect();ctx.beginPath();ctx.moveTo((e.clientX-r.left)*drawCanvas.width/r.width,(e.clientY-r.top)*drawCanvas.height/r.height)};drawCanvas.onpointermove=e=>{if(!painting)return;const r=drawCanvas.getBoundingClientRect();ctx.lineTo((e.clientX-r.left)*drawCanvas.width/r.width,(e.clientY-r.top)*drawCanvas.height/r.height);ctx.stroke()};drawCanvas.onpointerup=()=>painting=false;$('ai-clear').onclick=()=>ctx.clearRect(0,0,drawCanvas.width,drawCanvas.height)}if(mode==='Voice')$('ai-record').onclick=record}
let recorder=null,chunks=[],stream=null;async function record(){const b=$('ai-record');if(recorder?.state==='recording'){recorder.stop();b.textContent='🎙 Start recording';return}try{stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=()=>{fileData=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});$('ai-record-status').textContent=' Recording ready';stream.getTracks().forEach(t=>t.stop())};recorder.start();b.textContent='■ Stop recording';$('ai-record-status').textContent=' Recording...'}catch(e){alert('Microphone permission unavailable: '+e.message)}}
async function savePage(){if(!ensure())return;const old=editing>=0?active.pages[editing]:null;const p={...old,id:old?.id||uid(),type:mode,title:$('ai-page-title').value.trim()||'Untitled page',text:$('ai-text').value,created:old?.created||Date.now()};if(mode==='Time Capsule')p.date=$('ai-date')?.value||'';if(mode==='Secret'){const pass=$('ai-secret')?.value||'';if(!old?.passHash&&!pass){alert('Choose a passphrase for this secret page.');return}if(pass)p.passHash=await hash(pass);unlockSession.delete(p.id)}if(['Map','Music'].includes(mode))p.link=$('ai-link')?.value||'';if(mode==='Interactive')p.extra=$('ai-extra')?.value||'';if(mode==='Drawing'&&drawCanvas)p.drawing=drawCanvas.toDataURL('image/png');const f=$('ai-file')?.files?.[0];if(f||fileData){const blob=f||fileData;p.assetId=await asset(blob);p.mediaType=blob.type;p.fileName=f?.name||'voice-recording.webm'}if(editing>=0){active.pages[editing]=p;page=editing}else{active.pages.push(p);page=active.pages.length-1}closeEditor();await save();toast('Your page has been saved ✨')}
async function hash(s){const bytes=new TextEncoder().encode(s);const digest=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('')}
async function makeBook(){const title=prompt('Name your new book:','The Things I Never Said');if(!title?.trim())return;active={id:uid(),title:title.trim(),pages:[],updated:Date.now()};page=0;await save();toast('A new book has appeared on your shelf ✨')}
async function exportAll(){assertPrivateLibrary();const data={version:1,books,assets:[]};const tx=db.transaction('assets');const r=tx.objectStore('assets').getAll();const assets=await new Promise(resolve=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>resolve([])});for(const a of assets){const base64=await new Promise(resolve=>{const fr=new FileReader();fr.onload=()=>resolve(fr.result);fr.readAsDataURL(a.blob)});data.assets.push({id:a.id,data:base64})}const b=new Blob([JSON.stringify(data)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='aethera-infinite-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);toast('Backup downloaded')}
async function importAll(){assertPrivateLibrary();const owner=libraryOwner;const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.onchange=async()=>{try{if(owner!==libraryOwner)throw Error('Account changed');assertPrivateLibrary();const data=JSON.parse(await input.files[0].text());if(data.version!==1||!Array.isArray(data.books)||!Array.isArray(data.assets))throw Error('Invalid backup');if(!confirm('Import books from this backup? Existing books with matching IDs will be overwritten.'))return;for(const a of data.assets){assertPrivateLibrary();const blob=await(await fetch(a.data)).blob();await store('assets','put',{id:a.id,blob})}for(const b of data.books){assertPrivateLibrary();if(!b.id||!Array.isArray(b.pages))continue;await store('books','put',b)}await load();toast('Backup imported')}catch(e){alert('Import failed: '+e.message)}};input.click()}
root.addEventListener('click',async e=>{const t=e.target.closest('button');if(!t)return;try{assertPrivateLibrary()}catch(err){root.classList.remove('ai-open');window.AetheraAuth?.open?.();return}if(t.dataset.book){active=books.find(b=>b.id===t.dataset.book);page=0;draw();return}if(t.dataset.type){mode=t.dataset.type;special(editing>=0?active.pages[editing]:null);root.querySelectorAll('[data-type]').forEach(b=>b.style.background=b.dataset.type===mode?'#c5a1b9':'');return}if(t.dataset.reveal){const el=$('ai-reveal-'+t.dataset.reveal);if(el)el.hidden=!el.hidden;return}if(t.id==='ai-unseal'){const p=pageObj();if(p&&await hash($('ai-pass').value)===p.passHash){unlockSession.add(p.id);draw()}else alert('Incorrect passphrase');return}switch(t.id){case'ai-close':root.classList.remove('ai-open');break;case'ai-new':await makeBook();break;case'ai-prev':turn(page-1);break;case'ai-next':turn(page+1);break;case'ai-add':editing=-1;editor();break;case'ai-edit':if(pageObj()){editing=page;editor()}break;case'ai-remove':if(pageObj()&&confirm('Delete this page permanently?')){active.pages.splice(page,1);page=Math.max(0,Math.min(page,active.pages.length-1));await save()}break;case'ai-save-page':try{await savePage()}catch(e){alert('Could not save: '+e.message)}break;case'ai-cancel':closeEditor();break;case'ai-rename':if(ensure()){const v=prompt('Book title:',active.title);if(v?.trim()){active.title=v.trim();await save()}}break;case'ai-delete-book':if(ensure()&&confirm('Delete this entire book and all its pages?')){await store('books','delete',active.id);active=null;page=0;await load();draw()}break;case'ai-export':await exportAll();break;case'ai-cloud-upload':await uploadCloudBackup();break;case'ai-cloud-download':await downloadCloudBackup();break;case'ai-import':await importAll();break;case'ai-sound':sound=!sound;t.textContent='♪ Page sound: '+(sound?'on':'off');break;}});
launch.onclick=()=>{
  const user=window.AetheraAuth?.getUser();

  if(!user?.id || !db || libraryOwner!==user.id){
    if(!user?.id){
      window.AetheraAuth?.requireLogin?.(()=>{
        switchPrivateLibrary();
      });
    }else{
      toast('Your private library is loading. Please try again.');
    }
    return;
  }

  root.classList.add('ai-open');
  draw();
};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('ai-open')){if($('ai-editor').classList.contains('ai-show'))closeEditor();else root.classList.remove('ai-open')}});
// Integration: keep the existing 3D scene untouched. Clicking its existing books still works as before;
// the launcher opens the full editable library without interfering with pointer controls.

// Cloud transfer is explicit: no background upload, overwrite, or legacy-database migration.
async function readCloudAssets(){
  assertPrivateLibrary();
  const rows=await new Promise((resolve,reject)=>{const r=db.transaction('assets','readonly').objectStore('assets').getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
  const out={};
  for(const row of rows){assertPrivateLibrary();out[row.id]=await new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>resolve(fr.result);fr.onerror=()=>reject(fr.error);fr.readAsDataURL(row.blob)})}
  return out;
}
async function uploadCloudBackup(){
  try{
    assertPrivateLibrary();const owner=libraryOwner;
    if(!confirm('Upload your private books and attachments to your Neon account? This may use substantial cloud storage. Existing cloud books with matching IDs will be updated. Export a JSON backup first.'))return;
    const cloud=window.AetheraCloud;if(!cloud?.uploadBooks)throw Error('Cloud service not ready');
    const snapshot=books.map(b=>structuredClone(b));const assets=await readCloudAssets();
    if(owner!==libraryOwner)throw Error('Account changed during upload');
    const result=await cloud.uploadBooks(snapshot,assets,owner);
    toast('Cloud backup uploaded: '+result.count+' books');
  }catch(e){alert('Cloud upload failed: '+e.message)}
}
async function downloadCloudBackup(){
  try{
    assertPrivateLibrary();const owner=libraryOwner;
    const cloud=window.AetheraCloud;if(!cloud?.downloadBooks)throw Error('Cloud service not ready');
    const result=await cloud.downloadBooks(owner);
    if(owner!==libraryOwner)throw Error('Account changed during download');
    if(!result.books.length){toast('No cloud books found for this account.');return}
    if(!confirm('Restore '+result.books.length+' cloud books into this account? Matching book IDs will be overwritten locally. Export your local JSON backup first.'))return;
    for(const [id,data] of Object.entries(result.assets)){
      assertPrivateLibrary();if(owner!==libraryOwner)throw Error('Account changed');
      const blob=await(await fetch(data)).blob();await store('assets','put',{id,blob});
    }
    for(const b of result.books){
      assertPrivateLibrary();if(owner!==libraryOwner)throw Error('Account changed');
      await store('books','put',b);
    }
    await load();draw();toast('Restored '+result.books.length+' cloud books');
  }catch(e){alert('Cloud restore failed: '+e.message)}
}

let libraryGeneration=0;

async function switchPrivateLibrary(){
  const generation=++libraryGeneration;

  libraryOwner=null;
  if(db){
    db.close();
    db=null;
  }

  books=[];
  active=null;
  page=0;
  editing=-1;
  unlockSession.clear();

  root.classList.remove('ai-open');
  closeEditor();
  cleanUrls();
  draw();

  let user=window.AetheraAuth?.getUser();

  if(!user?.id){
    try{
      const session=await window.AetheraAuth?.getSession?.();
      user=session?.data?.user || session?.user || null;
    }catch(error){
      console.warn('AETHERA session unavailable',error);
    }
  }

  if(generation!==libraryGeneration)return;
  if(!user?.id || window.AetheraAuth?.getUser()?.id!==user.id)return;

  libraryOwner=user.id;
  dbName=window.AetheraLibraryStorage.getPrivateDatabaseName(user.id);

  try{
    await dbOpen();

    if(generation!==libraryGeneration){
      db?.close();
      db=null;
      libraryOwner=null;
      return;
    }

    await load();

    if(generation!==libraryGeneration)return;

    draw();
  }catch(error){
    if(generation!==libraryGeneration)return;
    libraryOwner=null;
    toast('Private library unavailable: '+error.message);
    console.error('AETHERA private library',error);
  }
}

window.addEventListener('aethera:signin',switchPrivateLibrary);
window.addEventListener('aethera:signout',()=>{libraryOwner=null;switchPrivateLibrary()});

switchPrivateLibrary();
})();
