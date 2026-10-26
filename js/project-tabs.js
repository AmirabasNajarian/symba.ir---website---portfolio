/* Enhance existing project cards without copying or replacing their content. */
(() => {
 const section=document.querySelector('#services');
 const container=section?.querySelector('.slideshow-container');
 if(!container)return;
 const cards=[...container.querySelectorAll('.service-slide')];
 if(!cards.length)return;
 const fa=document.documentElement.lang==='fa';
 const labels=fa?['خدمات ESP','واحد اسکید','منیفولد و جداکننده','آب‌زدایی لاگون']:['ESP Services','Skid Unit','Manifold & Separator','Lagoon Dewatering'];
 const keys=['esp','skid','manifold','lagoon'];
 const layout=document.createElement('div');layout.className='symba-project-layout';
 const tabs=document.createElement('div');tabs.className='symba-project-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label',fa?'دسته‌بندی پروژه‌ها':'Project categories');tabs.setAttribute('aria-orientation','vertical');
 container.before(layout);layout.append(tabs,container);section.classList.add('symba-projects');
 const buttons=cards.map((card,i)=>{
  const button=document.createElement('button');button.type='button';button.className='symba-project-tab';button.id='project-tab-'+i;button.setAttribute('role','tab');button.setAttribute('aria-controls','project-panel-'+i);button.title=card.querySelector('h2')?.textContent.trim()||'';
  const number=document.createElement('span');number.className='symba-project-tab__number';number.textContent=String(i+1).padStart(2,'0');number.setAttribute('aria-hidden','true');
  const label=document.createElement('span');label.textContent=labels[i]||button.title;button.append(number,label);tabs.append(button);
  card.id='project-panel-'+i;card.setAttribute('role','tabpanel');card.setAttribute('aria-labelledby',button.id);card.tabIndex=0;
  button.addEventListener('click',()=>select(i));
  button.addEventListener('keydown',e=>{
   let next=i;
   if(e.key==='ArrowDown'||e.key==='ArrowRight')next=(i+1)%cards.length;
   else if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=(i-1+cards.length)%cards.length;
   else if(e.key==='Home')next=0;else if(e.key==='End')next=cards.length-1;else return;
   e.preventDefault();select(next);buttons[next].focus();
  });return button;
 });
 function select(index){
  cards.forEach((card,i)=>{card.hidden=i!==index;card.classList.toggle('is-selected',i===index);buttons[i].setAttribute('aria-selected',String(i===index));buttons[i].tabIndex=i===index?0:-1;});
 }
 select(Math.max(0,keys.indexOf(new URLSearchParams(location.search).get('project'))));
 const mobile=matchMedia('(max-width: 700px)');
 const orientation=()=>tabs.setAttribute('aria-orientation',mobile.matches?'horizontal':'vertical');mobile.addEventListener('change',orientation);orientation();
})();
