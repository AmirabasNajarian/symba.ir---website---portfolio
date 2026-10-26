(() => {
  'use strict';

  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.textContent = isOpen ? '✕' : '☰';
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '☰';
      });
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  let cards=[...document.querySelectorAll('.gallery-card')];const originals=cards.map(c=>c.cloneNode(true)),filters=[...document.querySelectorAll('.filter-button')],grid=document.getElementById('galleryGrid'),heading=document.getElementById('galleryTitle');const names={mahshahr:'کارگاه ماهشهر',lagoon:'لاگون (حوضچه تبخیر)',aban:'تعمیر سپراتور آبان','esp-installation':'نصب ESP',wp:'پروژه‌های ESP پایدار غرب',cmk:'پروژه‌های ESP چشمه‌خوش',dezful:'انبار دزفول',tehran:'دفتر تهران',moscow:'دفتر مسکو'};
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeButton = document.getElementById('lightboxClose');
  const prevButton = document.getElementById('lightboxPrev');
  const nextButton = document.getElementById('lightboxNext');
  let currentIndex = 0;

  const showImage = index => {
    currentIndex = (index + cards.length) % cards.length;
    const card = cards[currentIndex];
    lightboxImage.src = card.dataset.full;
    lightboxImage.alt = card.querySelector('img')?.alt || '';
    lightboxTitle.textContent = card.dataset.title || '';
    lightboxCaption.textContent = card.dataset.caption || '';
  };

  const openLightbox = index => {
    showImage(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    cards[currentIndex]?.focus();
  };

  const prepareCard = card => {
    card.classList.add('visible');
    const image = card.querySelector('img');
    if (image) {
      image.loading = 'eager';
      const source = image.getAttribute('src');
      if (source) image.src = source;
    }
    return card;
  };

  const bind = () => {
    cards = [...grid.querySelectorAll('.gallery-card')];
    cards.forEach((card, index) => {
      prepareCard(card);
      card.addEventListener('click', () => openLightbox(index));
    });
  };

  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(filter => {
      filter.classList.toggle('active', filter === button);
      filter.setAttribute('aria-selected', String(filter === button));
    });

    const category = button.dataset.category;
    heading.textContent = names[category];
    grid.setAttribute('aria-label', `${names[category]} گالری تصاویر`);
    grid.replaceChildren();
    grid.className = category === 'mahshahr'
      ? 'gallery-grid gallery-grid--mahshahr'
      : category === 'aban'
        ? 'gallery-grid gallery-grid--aban'
        : category === 'esp-installation'
          ? 'gallery-grid gallery-grid--esp-installation'
        : category === 'wp'
          ? 'gallery-grid gallery-grid--wp'
        : category === 'tehran'
          ? 'gallery-grid gallery-grid--tehran'
        : 'gallery-grid';

    if (category === 'mahshahr') {
      originals.forEach(card => grid.appendChild(prepareCard(card.cloneNode(true))));
    } else if (category === 'dezful') {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'gallery-card reveal visible';
      card.style.cssText = 'grid-column:1 / -1;width:100%;height:clamp(260px,42vw,620px)';
      card.dataset.full = 'https://symba.ir/images/dezful-warehouse-about-page.png';
      card.dataset.title = 'انبار دزفول';
      card.dataset.caption = '';
      card.innerHTML = '<img src="https://symba.ir/images/dezful-warehouse-about-page.png" alt="انبار دزفول" loading="eager">';
      grid.appendChild(card);
    } else if (category === 'lagoon') {
      const lagoonCard = document.createElement('button');
      lagoonCard.type = 'button';
      lagoonCard.className = 'gallery-card reveal visible';
      lagoonCard.style.cssText = 'grid-column:1 / -1;width:100%;height:clamp(260px,42vw,620px)';
      lagoonCard.dataset.full = 'https://symba.ir/images/lagoon-gallery.webp';
      lagoonCard.dataset.title = 'لاگون (حوضچه تبخیر)';
      lagoonCard.dataset.caption = '';
      lagoonCard.innerHTML = '<img src="https://symba.ir/images/lagoon-gallery.webp" alt="لاگون (حوضچه تبخیر)" loading="eager">';
      grid.appendChild(lagoonCard);
    } else if (category === 'aban') {
      const abanCard = document.createElement('button');
      abanCard.type = 'button';
      abanCard.className = 'gallery-card gallery-card--aban reveal visible';
      abanCard.dataset.full = 'https://symba.ir/images/aban_manifold.webp';
      abanCard.dataset.title = 'نوسازی منیفولد آبان';
      abanCard.dataset.caption = 'نوسازی و بازسازی سامانه منیفولد میدان نفتی آبان با هدف بهبود قابلیت اطمینان عملیاتی، کنترل جریان و عملکرد بلندمدت.';
      abanCard.innerHTML = '<img src="https://symba.ir/images/aban_manifold.webp" alt="ABAN modernization manifold project by SYMBA" loading="eager"><span class="card-overlay"><strong>نوسازی منیفولد میدان نقتی آبان</strong><small>پروژه نوسازی</small></span>';
      grid.appendChild(abanCard);
    } else if (category === 'esp-installation') {
      const espInstallationCards = [
        { className: 'gallery-card--esp-site', image: 'https://symba.ir/images/esp_installation_gallery.webp', title: 'نصب ESP', label: 'عملیات میدانی', caption: 'عملیات نصب ESP در محل چاه توسط متخصصان میدانی SYMBA.' },
        { className: 'gallery-card--esp-workshop gallery-card--esp-no-text', image: 'https://symba.ir/images/esp_installation_gallery03.webp', title: '', label: '', caption: '', alt: 'SYMBA ESP component inspection operation' },
        { className: 'gallery-card--esp-control', image: 'https://symba.ir/images/control_esp_installation.webp', title: 'نصب ESP Control', label: 'کنترل سامانه', caption: 'پیکربندی سامانه، کنترل‌های فنی و صحه‌گذاری عملیاتی در زمان راه‌اندازی ESP.' },
        { className: 'gallery-card--esp-portrait gallery-card--esp-no-text', image: 'https://symba.ir/images/esp_installation_gallery02.webp', title: '', label: '', caption: '', alt: 'SYMBA ESP field operation' },
        { className: 'gallery-card--esp-testing', image: 'https://symba.ir/images/testing_esp_installation.webp', title: 'نصب ESP Testing', label: 'آزمون میدانی', caption: 'آزمون میدانی و بررسی فنی پیش از راه‌اندازی نهایی سامانه ESP.' },
        { className: 'gallery-card--esp-climate', image: 'https://symba.ir/images/climate_box_gallery.webp', title: 'محفظه Climate box', label: 'حفاظت تجهیزات', caption: 'نصب و بازرسی محفظه Climate box برای حفاظت از تجهیزات حیاتی ESP.' },
        { className: 'gallery-card--esp-extraction gallery-card--esp-no-text', image: 'https://symba.ir/images/esp_extraction_gallery.webp', title: '', label: '', caption: '', alt: 'SYMBA ESP extraction operation' },
        { className: 'gallery-card--esp-assembly gallery-card--esp-no-text', image: 'https://symba.ir/images/esp_installtion_gallery01.webp', title: '', label: '', caption: '', alt: 'SYMBA ESP field operation' },
        { className: 'gallery-card--esp-preparation gallery-card--esp-no-text', image: 'https://symba.ir/images/esp_installation_gallery04.webp', title: '', label: '', caption: '', alt: 'SYMBA ESP field operation' }
      ];

      espInstallationCards.forEach(item => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = `gallery-card gallery-card--esp ${item.className} reveal visible`;
        card.dataset.full = item.image;
        card.dataset.title = item.title;
        card.dataset.caption = item.caption;
        const overlay = item.title
          ? `<span class="card-overlay"><strong>${item.title}</strong><small>${item.label}</small></span>`
          : '';
        card.innerHTML = `<img src="${item.image}" alt="${item.alt || `${item.title} by SYMBA`}" loading="eager">${overlay}`;
        grid.appendChild(card);
      });
    } else if (category === 'wp') {
      const wpCards = [
        { className: 'gallery-card--wp-overview', image: 'https://symba.ir/images/electric_submersible_pumps_installation_WestPaydar_gallery.webp', title: 'نصب ESP پایدار غرب', label: 'عملیات سرچاهی', caption: 'نصب هماهنگ پمپ های الکتریکی درون‌چاهی در چاه پایدار غرب با پشتیبانی متخصصان میدانی SYMBA، تجهیزات بالابری و سامانه اختصاصی مهار کابل ESP.', alt: 'Electric submersible pump installation with drilling rig and crane at West Paydar oil field' },
        { className: 'gallery-card--wp-climate', image: 'https://symba.ir/images/climatebox_installation_WestPaydar_gallery.webp', title: 'نصب و راه اندازی محفظه Climate box', label: 'حفاظت الکتریکی', caption: 'تکنسین‌های SYMBA محفظه الکتریکی Climate box را برای حفاظت از تجهیزات حیاتی توان و کنترل ESP در شرایط سخت میدانی نصب می‌کنند.', alt: 'SYMBA technician installing climate box for ESP electrical equipment at West Paydar oil field' },
        { className: 'gallery-card--wp-assembly', image: 'https://symba.ir/images/electirc_submersible_pumps_assembling_WestPaydar_gallery.webp', title: 'مونتاژ رشته ESP', label: 'عملیات دقیق میدانی', caption: 'مونتاژ و هم‌راستاسازی دقیق اجزای پمپ های الکتریکی درون‌چاهی پیش از راندن رشته ESP در چاه پایدار غرب.', alt: 'SYMBA field engineer assembling electric submersible pump components at West Paydar wellsite' },
        { className: 'gallery-card--wp-wellhead', image: 'https://symba.ir/images/Oil_well_project_WestPaydar_gallery.webp', title: ' آماده‌سازی  تصحیلات سرچاه', label: 'پروژه پایدار غرب', caption: 'آماده‌سازی و بازرسی میدانی تصحیلات سرچاه پایدار غرب پیش از نصب و راه‌اندازی نهایی ESP.', alt: 'SYMBA oil field specialists preparing wellhead equipment for West Paydar ESP project' }
      ];

      wpCards.forEach(item => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = `gallery-card gallery-card--wp ${item.className} reveal visible`;
        card.dataset.full = item.image;
        card.dataset.title = item.title;
        card.dataset.caption = item.caption;
        card.innerHTML = `<img src="${item.image}" alt="${item.alt}" loading="eager"><span class="card-overlay"><strong>${item.title}</strong><small>${item.label}</small></span>`;
        grid.appendChild(card);
      });
    } else if (category === 'tehran') {
      const tehranCards = [
        { className: 'gallery-card--tehran-exterior', image: 'https://symba.ir/images/Nasl-commercial-office.webp', title: 'ساختمان اداری نسل', label: 'ساختمان دفتر تهران', caption: 'ورودی و نمای معاصر ساختمان اداری نسل، محل فعالیت دفتر تهران SYMBA.', alt: 'Exterior entrance of ساختمان اداری نسل building housing SYMBA Tehran office in Elahiyeh, Tehran' },
        { className: 'gallery-card--tehran-featured', image: 'https://symba.ir/images/Tehran_office_openoffice.webp', title: 'فضای کار مشارکتی', label: 'فضای کار باز', caption: 'فضای کاری باز و مدرن برای تقویت همکاری، ارتباط و کار تیمی کارآمد.' },
        { className: 'gallery-card--tehran-meeting', image: 'https://symba.ir/images/Tehran_office_meetingroom.webp', title: 'جلسه و همکاری', label: 'اتاق جلسه', caption: 'محیطی حرفه‌ای برای جلسات متمرکز، هماهنگی پروژه و تصمیم‌گیری اثربخش.' },
        { className: 'gallery-card--tehran-main', image: 'https://symba.ir/images/Tehran_office_main.webp', title: 'دفتر مرکزی تهران', label: 'دفتر مرکزی', caption: 'دفتر مرکزی تهران SYMBA؛ محیطی مدرن و حرفه‌ای برای هم‌افزایی تیم‌ها.' }
      ];

      tehranCards.forEach(item => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = `gallery-card gallery-card--tehran ${item.className} reveal visible`;
        card.dataset.full = item.image;
        card.dataset.title = item.title;
        card.dataset.caption = item.caption;
        card.innerHTML = `<img src="${item.image}" alt="${item.alt || `${item.title} at SYMBA دفتر تهران`}" loading="eager"><span class="card-overlay"><strong>${item.title}</strong><small>${item.label}</small></span>`;
        grid.appendChild(card);
      });
    } else {
      const emptyState = document.createElement('div');
      emptyState.className = 'gallery-empty';
      emptyState.innerHTML = '<div><strong>' + names[category] + '</strong><p>تصاویر پروژه‌های این بخش به‌زودی افزوده می‌شوند.</p></div>';
      grid.appendChild(emptyState);
    }

    bind();
  }));

  bind();
  closeButton.addEventListener('click', closeLightbox);
  prevButton.addEventListener('click', () => showImage(currentIndex - 1));
  nextButton.addEventListener('click', () => showImage(currentIndex + 1));

  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', event => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
  });
})();

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
