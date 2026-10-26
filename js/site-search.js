(() => {
 'use strict';
 const trigger=document.querySelector('.symba-search-trigger');
 if(!trigger)return;
 const fa=document.documentElement.lang==='fa';
 const words=fa?{title:'جست‌وجو در سیمبا',hint:'مثلاً ESP، پروژه‌ها یا سرمایه انسانی',start:'برای جست‌وجو، کلمه موردنظر را وارد کنید.',loading:'در حال آماده‌سازی جست‌وجو…',empty:'نتیجه‌ای پیدا نشد. عبارت دیگری امتحان کنید.',error:'جست‌وجو بارگذاری نشد. دوباره امتحان کنید.',close:'بستن جست‌وجو',count:n=>`${n} نتیجه`,more:'برای نتایج دقیق‌تر، عبارت بیشتری وارد کنید.'}:{title:'Search SYMBA',hint:'Try ESP, projects or human capital',start:'Enter a word to search across the website.',loading:'Preparing search…',empty:'No results found. Try another word.',error:'Search could not load. Please try again.',close:'Close search',count:n=>`${n} results`,more:'Type a more specific phrase to narrow the results.'};
 const dialog=document.createElement('dialog');dialog.id='symba-search-dialog';dialog.className='symba-search-dialog';dialog.dir=fa?'rtl':'ltr';dialog.setAttribute('aria-labelledby','symba-search-title');
 dialog.innerHTML='<div class="symba-search-top"><h2 id="symba-search-title"></h2><button type="button" class="symba-search-close">×</button></div><form class="symba-search-form" role="search"><label for="symba-search-input" class="symba-search-label"></label><input type="search" id="symba-search-input" autocomplete="off" spellcheck="false" maxlength="160" aria-describedby="symba-search-status"></form><p id="symba-search-status" role="status" aria-live="polite"></p><ul class="symba-search-results" aria-label="Search results"></ul>';
 document.body.appendChild(dialog);
 const input=dialog.querySelector('input'),status=dialog.querySelector('[role="status"]'),list=dialog.querySelector('ul'),close=dialog.querySelector('.symba-search-close');
 dialog.querySelector('h2').textContent=words.title;dialog.querySelector('label').textContent=words.hint;input.placeholder=fa?'جست‌وجو…':'Search…';close.setAttribute('aria-label',words.close);list.setAttribute('aria-label',fa?'نتایج جست‌وجو':'Search results');
 const normalize=value=>String(value).normalize('NFKC').toLocaleLowerCase().replace(/[يى]/g,'ی').replace(/ك/g,'ک').replace(/[\u064b-\u065f\u0670]/g,'').replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[\u200c\u200d]/g,' ').replace(/\s+/g,' ').trim();
 let data=null,pending=null,timer;
 const ensureIndex=()=>{
  if(data)return Promise.resolve(data);
  if(pending)return pending;
  pending=fetch('/data/site-search-index.json?v=20261021-2').then(r=>{if(!r.ok)throw Error('Search index unavailable');return r.json();}).then(rows=>{
   data=rows.map(r=>({...r,hay:normalize([r.title,r.page,r.section,r.text].join(' ')),titleHay:normalize(r.title)}));return data;
  }).finally(()=>{pending=null;});return pending;
 };
 const highlight=(node,text,query)=>{
  // Literal text nodes: queries and indexed content are never interpreted as HTML.
  const pos=text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
  if(pos<0||!query){node.textContent=text;return;}
  node.append(document.createTextNode(text.slice(0,pos)));const mark=document.createElement('mark');mark.textContent=text.slice(pos,pos+query.length);node.append(mark,document.createTextNode(text.slice(pos+query.length)));
 };
 const render=()=>{
  list.replaceChildren();const query=input.value.trim(),terms=normalize(query).split(' ').filter(Boolean);
  if(!terms.length){status.textContent=words.start;return;}
  if(!data){status.textContent=words.loading;return;}
  const results=data.filter(r=>terms.every(t=>r.hay.includes(t))).map(r=>({r,score:(r.lang===(fa?'fa':'en')?50:0)+terms.reduce((n,t)=>n+(r.titleHay.includes(t)?10:0),0)})).sort((a,b)=>b.score-a.score).map(x=>x.r);
  status.textContent=results.length?words.count(results.length)+(results.length>40?' — '+words.more:''):words.empty;
  results.slice(0,40).forEach(r=>{
   const li=document.createElement('li'),a=document.createElement('a'),path=document.createElement('span'),title=document.createElement('strong'),snippet=document.createElement('span');
   a.href=r.url;a.lang=r.lang;a.dir=r.lang==='fa'?'rtl':'ltr';path.className='symba-search-path';path.textContent=`${r.page} › ${r.section} · ${r.lang.toUpperCase()}`;
   highlight(title,r.title,query);
   const low=r.text.toLocaleLowerCase(),at=low.indexOf(query.toLocaleLowerCase()),start=Math.max(0,at-55);let excerpt=r.text.slice(start,start+190);if(start)excerpt='…'+excerpt;if(start+190<r.text.length)excerpt+='…';
   snippet.className='symba-search-snippet';highlight(snippet,excerpt,query);a.append(path,title,snippet);a.addEventListener('click',()=>dialog.close());li.appendChild(a);list.appendChild(li);
  });
 };
 const open=async()=>{
  if(dialog.open)return;dialog.showModal();document.body.classList.add('symba-search-open');trigger.setAttribute('aria-expanded','true');input.focus();render();
  try{await ensureIndex();if(dialog.open)render();}catch{if(dialog.open)status.textContent=words.error;}
 };
 trigger.setAttribute('aria-expanded','false');trigger.addEventListener('click',open);close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.classList.remove('symba-search-open');trigger.setAttribute('aria-expanded','false');trigger.focus();});
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(render,100);});
 dialog.querySelector('form').addEventListener('submit',event=>{event.preventDefault();list.querySelector('a')?.click();});
 dialog.addEventListener('keydown',event=>{
  if(!['ArrowDown','ArrowUp'].includes(event.key))return;
  const links=[...list.querySelectorAll('a')];if(!links.length)return;event.preventDefault();const i=links.indexOf(document.activeElement);
  if(event.key==='ArrowDown')links[(i+1)%links.length].focus();else if(i<=0)input.focus();else links[i-1].focus();
 });
 document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();open();}});
 // Gallery results select the requested category, then retain the section anchor.
 const applyCategory=()=>{const cat=new URLSearchParams(location.search).get('category');if(!cat)return;const button=[...document.querySelectorAll('.filter-button[data-category]')].find(b=>b.dataset.category===cat);button?.click();};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyCategory);else applyCategory();
})();
