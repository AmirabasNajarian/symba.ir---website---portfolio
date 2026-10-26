(() => {
 const fa=document.documentElement.lang==='fa';
 document.querySelectorAll('.symba-news__photo-grid').forEach(root=>{
 const slides=[...root.querySelectorAll(':scope > a')];if(slides.length<2)return;
 let current=0,playing=!matchMedia('(prefers-reduced-motion:reduce)').matches,hover=false,visible=false,timer;
 root.classList.add('is-carousel');root.setAttribute('role','region');root.setAttribute('aria-roledescription','carousel');root.setAttribute('aria-label',fa?'تصاویر نصب ESP':'ESP installation photographs');
 const controls=document.createElement('div');controls.className='news-carousel-controls';
 const count=document.createElement('span');count.className='news-carousel-count';
 function button(label,text,action){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',label);b.textContent=text;b.addEventListener('click',action);return b;}
 const play=button('', '',()=>{playing=!playing;refresh();});
 const prev=button(fa?'عکس قبلی':'Previous photograph','←',()=>{playing=false;show(current-1);});
 const next=button(fa?'عکس بعدی':'Next photograph','→',()=>{playing=false;show(current+1);});
 controls.append(play,count,prev,next);root.prepend(controls);
 const thumbs=document.createElement('div');thumbs.className='news-carousel-thumbs';thumbs.setAttribute('role','group');thumbs.setAttribute('aria-label',fa?'انتخاب عکس':'Choose photograph');
 const picks=slides.map((s,i)=>{const b=button((fa?'نمایش عکس ':'Show photograph ')+(i+1),'',()=>{playing=false;show(i);});const img=s.querySelector('img').cloneNode();img.alt='';b.append(img);thumbs.append(b);return b;});root.append(thumbs);
 function refresh(){clearTimeout(timer);play.textContent=playing?'Ⅱ':'▶';play.setAttribute('aria-label',playing?(fa?'توقف پخش خودکار':'Pause slideshow'):(fa?'شروع پخش خودکار':'Play slideshow'));root.setAttribute('aria-live',playing?'off':'polite');if(playing&&!hover&&visible&&!document.hidden)timer=setTimeout(()=>show(current+1),5000);}
 function show(index){current=(index+slides.length)%slides.length;slides.forEach((s,i)=>{s.classList.toggle('is-active',i===current);s.setAttribute('aria-hidden',String(i!==current));s.tabIndex=i===current?0:-1;picks[i].setAttribute('aria-pressed',String(i===current));});count.textContent=String(current+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');refresh();}
 root.addEventListener('mouseenter',()=>{hover=true;refresh();});root.addEventListener('mouseleave',()=>{hover=false;refresh();});
 root.addEventListener('focusin',e=>{if(e.target!==play){playing=false;refresh();}});
 root.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();playing=false;show(current+(e.key==='ArrowRight'?1:-1));}});
 let startX;root.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;},{passive:true});root.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-startX;if(Math.abs(delta)>45){playing=false;show(current+(delta<0?1:-1));}},{passive:true});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh();},{threshold:.2}).observe(root);document.addEventListener('visibilitychange',refresh);show(0);
 });
})();
