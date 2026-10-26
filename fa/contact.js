document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (toggle && menu) toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('show');
    toggle.setAttribute('aria-expanded', String(open));
  });

  const fileInput = document.getElementById('resume');
  const fileLabel = document.getElementById('file-label');
  if (fileInput && fileLabel) fileInput.addEventListener('change', () => {
    fileLabel.textContent = fileInput.files[0]?.name || 'فایل رزومه را انتخاب کنید';
  });

  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const banner = document.getElementById('form-status');
  const title = document.getElementById('status-title');
  const text = document.getElementById('status-text');
  const messages = {
    message_sent: ['پیام با موفقیت ارسال شد', 'سپاسگزاریم. پیام شما دریافت شد.'],
    application_sent: ['درخواست شما دریافت شد', 'سپاسگزاریم. رزومه شما با موفقیت و به‌صورت امن ارسال شد.'],
    invalid: ['لطفاً فرم را بررسی کنید', 'بخشی از اطلاعات وارد نشده یا نامعتبر است.'],
    file_invalid: ['فایل رزومه پذیرفته نشد', 'لطفاً یک فایل PDF، DOC یا DOCX با حجم حداکثر ۵ مگابایت بارگذاری کنید.'],
    server_error: ['ارسال انجام نشد', 'لطفاً بعداً دوباره تلاش کنید یا از طریق ایمیل با ما تماس بگیرید.']
  };
  if (status && messages[status] && banner && title && text) {
    title.textContent = messages[status][0]; text.textContent = messages[status][1];
    banner.hidden = false;
    if (!status.endsWith('_sent')) banner.classList.add('is-error');
    history.replaceState({}, '', `${location.pathname}${location.hash}`);
  }
  document.getElementById('status-close')?.addEventListener('click', () => { banner.hidden = true; });
});

/* SYMBA: upgrade legacy internal-page navigation to the shared dropdown header. */
(() => {
  const nav = document.getElementById('navMenu');
  if (!nav || nav.classList.contains('symba-nav')) return;
  const fa = document.documentElement.lang === 'fa' || document.documentElement.dir === 'rtl';
  const template = document.createElement('template');
  template.innerHTML = fa ? "<nav class=\"nav-links symba-nav\" id=\"navMenu\" aria-label=\"مسیریابی اصلی\"><div class=\"symba-nav-group\"><a href=\"/fa/\">صفحه اصلی</a><button class=\"symba-submenu-toggle\" type=\"button\" aria-expanded=\"false\" aria-controls=\"symba-submenu-0\" aria-label=\"صفحه اصلی\"><span aria-hidden=\"true\">⌄</span></button><div class=\"symba-submenu\" id=\"symba-submenu-0\"><a href=\"/fa/#services\">پروژه‌ها</a><a href=\"/fa/#products\">محصولات ما</a><a href=\"/fa/#whats-new\">تازه‌ها</a></div></div><div class=\"symba-nav-group\"><a href=\"/fa/about/\">درباره ما</a><button class=\"symba-submenu-toggle\" type=\"button\" aria-expanded=\"false\" aria-controls=\"symba-submenu-1\" aria-label=\"درباره ما\"><span aria-hidden=\"true\">⌄</span></button><div class=\"symba-submenu\" id=\"symba-submenu-1\"><a href=\"/fa/about/#services\">خدمات</a><a href=\"/fa/about/#global-presence\">حضور جهانی</a><a href=\"/fa/about/#hr\">سرمایه انسانی</a></div></div><a href=\"/fa/gallery/\">گالری</a><a href=\"/fa/contact/\">تماس با ما</a></nav>" : "<nav class=\"nav-links symba-nav\" id=\"navMenu\" aria-label=\"Primary navigation\"><div class=\"symba-nav-group\"><a href=\"/\">Home</a><button class=\"symba-submenu-toggle\" type=\"button\" aria-expanded=\"false\" aria-controls=\"symba-submenu-0\" aria-label=\"Home\"><span aria-hidden=\"true\">\u2304</span></button><div class=\"symba-submenu\" id=\"symba-submenu-0\"><a href=\"/#services\">Projects</a><a href=\"/#products\">Our Products</a><a href=\"/#whats-new\">What\u2019s New</a></div></div><div class=\"symba-nav-group\"><a href=\"/about.html\" class=\"active\" aria-current=\"page\">About</a><button class=\"symba-submenu-toggle\" type=\"button\" aria-expanded=\"false\" aria-controls=\"symba-submenu-1\" aria-label=\"About\"><span aria-hidden=\"true\">\u2304</span></button><div class=\"symba-submenu\" id=\"symba-submenu-1\"><a href=\"/about.html#services\">Services</a><a href=\"/about.html#global-presence\">Global Presence</a><a href=\"/about.html#hr\">HR</a></div></div><a href=\"/gallery.html\">Gallery</a><a href=\"/contact.html\">Contact</a></nav>";
  const updated = template.content.firstElementChild;
  nav.innerHTML = updated.innerHTML;
  nav.classList.add('symba-nav');
  nav.setAttribute('aria-label', updated.getAttribute('aria-label'));
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = '/css/navigation-dropdown.css?v=20261018-3';
  document.head.appendChild(css);
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('show', 'open');
    document.getElementById('navToggle')?.setAttribute('aria-expanded', 'false');
  }));
  const presence = document.querySelector('.global-presence');
  if (presence && !presence.id) presence.id = 'global-presence';
(() => {
  'use strict';
  const nav = document.querySelector('.symba-nav');
  if (!nav) return;
  const groups = [...nav.querySelectorAll('.symba-nav-group')];
  const syncCurrent = () => {
    const path = location.pathname.replace(/\/index\.html$/, '/');
    const isHome = ['/', '/index.html', '/fa/', '/fa/index.html'].includes(path);
    const isAbout = /\/about(?:\.html|\/)?$/.test(path);
    groups.forEach((group, index) => {
      const current = index === 0 ? isHome : isAbout;
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

  const sync = () => {
    nav.querySelectorAll(':scope > a').forEach(link => {
      const current = new URL(link.href).pathname.replace(/\/index\.html$/, '/') === location.pathname.replace(/\/index\.html$/, '/');
      link.classList.toggle('active', current);
      if (current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };
  sync();
  window.addEventListener('load', sync);
})();
