async function authorized(expectedUserId) {
  const auth=window.AetheraAuth;
  if(!auth?.getClient||!auth?.getSession)throw Error('Authentication unavailable');
  const session=await auth.getSession();
  if(session?.error)throw Error(session.error.message||'Session error');
  const user=session?.data?.user;
  if(!user?.id||user.id!==expectedUserId||auth.getUser()?.id!==expectedUserId)throw Error('Account changed or session expired');
  const neon=auth.getClient();if(!neon)throw Error('Neon is not configured');
  return neon;
}
async function getCloudBooks(){
  const id=window.AetheraAuth?.getUser()?.id;
  const neon=await authorized(id);
  const {data,error}=await neon.from('aethera_books').select('id,title,updated_at').order('updated_at',{ascending:false});
  if(error)throw Error(error.message||'Cloud retrieval failed');
  return {count:data?.length||0,books:data||[]};
}
async function uploadBooks(books,assets,owner){
  if(!Array.isArray(books))throw Error('Invalid books');
  let count=0;
  for(const book of books){
    const neon=await authorized(owner);
    if(!book?.id||!Array.isArray(book.pages))throw Error('Invalid book');
    const refs=new Set();
    // Preserve all uploaded attachments by storing them with the first book;
    // these are per-account backups, not a public asset store.
    const bookAssets=count===0?assets:{};
    const {error}=await neon.from('aethera_books').upsert({
      id:book.id,user_id:owner,title:book.title||'Untitled',
      pages:{format:'aethera-cloud-v1',book,assets:bookAssets},
      updated_at:new Date(book.updated||Date.now()).toISOString()
    },{onConflict:'id'});
    if(error)throw Error(error.message||'Cloud upload failed');
    count++;
  }
  return {count};
}
async function downloadBooks(owner){
  const neon=await authorized(owner);
  const {data,error}=await neon.from('aethera_books').select('id,title,pages,updated_at');
  if(error)throw Error(error.message||'Cloud download failed');
  await authorized(owner);
  const books=[],assets={};
  for(const row of data||[]){
    const payload=row.pages;
    if(payload?.format==='aethera-cloud-v1'&&payload.book?.id===row.id&&Array.isArray(payload.book.pages)){
      books.push(payload.book);Object.assign(assets,payload.assets||{});
    }else if(Array.isArray(payload)){
      books.push({id:row.id,title:row.title,pages:payload,updated:Date.parse(row.updated_at)||Date.now()});
    }
  }
  return {books,assets};
}
window.AetheraCloud=Object.freeze({getBooks:getCloudBooks,uploadBooks,downloadBooks});
