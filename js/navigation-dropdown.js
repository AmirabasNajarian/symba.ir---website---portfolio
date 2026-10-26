(() => {
  'use strict';
  const nav = document.querySelector('.symba-nav');
  if (!nav) return;

  const categories = {"en": [["mahshahr", "Mahshahr Workshop"], ["lagoon", "Lagoon (Evaporation Pond)"], ["aban", "ABAN Separator Repair"], ["esp-installation", "ESP Installation"], ["wp", "WP ESP Projects"], ["cmk", "CMK ESP Projects"], ["dezful", "Warehouse Dezful"], ["tehran", "Tehran Office"], ["moscow", "Moscow Office"]], "fa": [["mahshahr", "کارگاه ماهشهر"], ["lagoon", "لاگون (حوضچه تبخیر نمک زدایی)"], ["aban", "تعمیر تفکیک گر آبان"], ["esp-installation", "نصب ESP"], ["wp", "پروژه‌های ESP پایدار غرب"], ["cmk", "پروژه‌های ESP چشمه‌خوش"], ["dezful", "انبار دزفول"], ["tehran", "دفتر تهران"], ["moscow", "دفتر مسکو"]]};
  const fa = document.documentElement.lang === 'fa';
  const galleryLink = [...nav.querySelectorAll(':scope > a')].find(a => /\/gallery(?:\.html|\/)?$/.test(new URL(a.href).pathname));
  if (galleryLink) {
    const group = document.createElement('div'); group.className = 'symba-nav-group symba-gallery-group';
    galleryLink.before(group); group.append(galleryLink);
    const toggle = document.createElement('button'); toggle.className='symba-submenu-toggle'; toggle.type='button';
    toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-controls','symba-gallery-submenu');
    toggle.setAttribute('aria-label',fa?'دسته‌بندی گالری':'Gallery categories');
    const arrow=document.createElement('span');arrow.setAttribute('aria-hidden','true');arrow.textContent='⌄';toggle.append(arrow);
    const menu=document.createElement('div');menu.className='symba-submenu symba-gallery-submenu';menu.id='symba-gallery-submenu';
    categories[fa?'fa':'en'].forEach(([key,label])=>{
      const link=document.createElement('a');link.textContent=label;
      link.href=(fa?'/fa/gallery/':'/gallery.html')+'?category='+encodeURIComponent(key)+'#project-gallery';
      menu.append(link);
    });group.append(toggle,menu);
  }

  // Keep the company introduction first in every About dropdown.
  nav.querySelectorAll('.symba-nav-group').forEach(group => {
    const primary = group.querySelector(':scope > a');
    const menu = group.querySelector('.symba-submenu');
    if (!primary || !menu || !/\/about(?:\.html|\/)?$/.test(new URL(primary.href).pathname)) return;
    let link = menu.querySelector('a[href$="#about-company"]');
    if (!link) link = document.createElement('a');
    link.textContent = fa ? 'درباره شرکت' : 'About the Company';
    const destination = new URL(primary.href);
    destination.hash = 'about-company';
    link.href = destination.pathname + destination.search + destination.hash;
    menu.prepend(link);
  });

  const groups = [...nav.querySelectorAll('.symba-nav-group')];
  const syncCurrent = () => {
    const path = location.pathname.replace(/\/index\.html$/, '/');
    const isHome = ['/', '/index.html', '/fa/', '/fa/index.html'].includes(path);
    const isAbout = /\/about(?:\.html|\/)?$/.test(path);
    groups.forEach((group, index) => {
      const current = group.classList.contains('symba-gallery-group') ? /\/gallery(?:\.html|\/)?$/.test(path) : index === 0 ? isHome : isAbout;
      group.classList.toggle('is-current', current);
      const link = group.querySelector('a');
      link.classList.toggle('active', current);
      if (current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };
  syncCurrent();
  window.addEventListener('load', syncCurrent);
  window.addEventListener('hashchange', () => queueMicrotask(syncCurrent));
  const setOpen = (group, open) => {
    group.classList.toggle('is-open', open);
    group.querySelector('.symba-submenu-toggle').setAttribute('aria-expanded', String(open));
  };
  const closeAll = () => groups.forEach(group => setOpen(group, false));
  groups.forEach(group => {
    const toggle = group.querySelector('.symba-submenu-toggle');
    toggle.addEventListener('mouseenter', () => {
      if (matchMedia('(hover: hover)').matches) {
        closeAll();
        setOpen(group, true);
      }
    });
    group.addEventListener('mouseleave', () => {
      if (matchMedia('(hover: hover)').matches) setOpen(group, false);
    });
    toggle.addEventListener('click', () => {
      const open = !group.classList.contains('is-open');
      closeAll();
      setOpen(group, open);
    });
    toggle.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        closeAll();
        setOpen(group, true);
        group.querySelector('.symba-submenu a')?.focus();
      }
    });
    group.addEventListener('focusout', event => {
      if (!group.contains(event.relatedTarget)) setOpen(group, false);
    });
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.symba-nav-group')) closeAll();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const group = groups.find(item => item.classList.contains('is-open'));
      if (group && group.contains(document.activeElement)) group.querySelector('button').focus();
      closeAll();
    }
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeAll));
  document.getElementById('navToggle')?.addEventListener('click', closeAll);
})();
