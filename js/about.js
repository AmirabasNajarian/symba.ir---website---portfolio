// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            // Also add 'visible' class for map elements
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// // Header background on scroll
// window.addEventListener('scroll', () => {
//     const header = document.querySelector('header');
//     if (window.scrollY > 100) {
//         header.style.background = 'rgba(0, 0, 0, 0.95)';
//     } else {
//         header.style.background = 'rgba(26, 26, 26, 0.95)';
//     }
// });

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add mouse parallax effect to hero section with photo
const hero = document.querySelector('.hero');
if (hero) {
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { offsetWidth, offsetHeight } = hero;
        const x = (clientX / offsetWidth) * 100;
        const y = (clientY / offsetHeight) * 100;
        
        // Create a subtle parallax overlay effect without changing the background image
        hero.style.setProperty('--mouse-x', `${x}%`);
        hero.style.setProperty('--mouse-y', `${y}%`);
    });
}

// Add stagger animation to product cards
const productCards = document.querySelectorAll('.product-card');
productCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Add stagger animation to service items
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.2}s`;
});

// Add counter animation for stats
const statNumbers = document.querySelectorAll('.stat-number');
const animateCounters = () => {
    statNumbers.forEach((stat) => {
        const target = parseInt(stat.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current) + (stat.textContent.includes('+') ? '+' : '') + (stat.textContent.includes('%') ? '%' : '');
                setTimeout(updateCounter, 20);
            } else {
                stat.textContent = target + (stat.textContent.includes('+') ? '+' : '') + (stat.textContent.includes('%') ? '%' : '');
            }
        };
        
        updateCounter();
    });
};

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.disconnect();
        }
    });
});

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Video controls
const video = document.getElementById('heroVideo');
const toggleBtn = document.getElementById('videoToggle');

if (video && toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            toggleBtn.textContent = '⏸';
        } else {
            video.pause();
            toggleBtn.textContent = '▶';
        }
    });
}

// Map functionality - Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page with a map
    const mapElement = document.getElementById('world-map');
    if (!mapElement) {
        return; // No map on this page, skip map initialization
    }

    // Initialize the map
    const map = L.map('world-map', {
        center: [35, 55],
        zoom: 2.5,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
        attributionControl: false
    });


    // Local vector basemap: no remote tile server or API key.
    mapElement.style.background = "#222222";
    map.setMinZoom(2);
    map.setMaxZoom(10);

    // Office locations with real coordinates
    const offices = [
        // Iran offices
        {
            name: "Tehran",
            country: "Iran",
            coords: [35.6892, 51.3890],
            type: "headquarters",
            flag: "🇮🇷",
            details: "Head Office<br/>Strategic Operations Center",
            description: "SYMBA Group Headquarters"
        },
        {
            name: "Dezful", 
            country: "Iran",
            coords: [32.3847, 48.4081],
            type: "warehouse",
            flag: "🇮🇷",
            details: "Warehousing Facility<br/>6,000 sq m storage",
            description: "Main Warehousing Center"
        },
        {
            name: "Mahshahr",
            country: "Iran", 
            coords: [30.4522, 49.1956],
            type: "manufacturing",
            flag: "🇮🇷",
            details: "Manufacturing Plant<br/>40 ESPs per month capacity",
            description: "Manufacturing Excellence Center"
        },
        {
            name: "Dasht-e Abbas",
            country: "Iran",
            coords: [30.9756, 49.0039],
            type: "logistics",
            flag: "🇮🇷",
            details: "Logistics Hub<br/>24/7 Operations",
            description: "Logistics & Distribution Center"
        },
        // International offices
        {
            name: "Moscow",
            country: "Russia",
            coords: [55.7558, 37.6176],
            type: "office",
            flag: "🇷🇺",
            details: "Regional Office<br/>Engineering Systems LLC",
            description: "Russia Operations"
        },
        {
            name: "Dubai",
            country: "UAE",
            coords: [25.2048, 55.2708],
            type: "hub",
            flag: "🇦🇪",
            details: "Dubai Silicon Oasis<br/>Regional Hub",
            description: "Middle East Regional Hub"
        },
        {
            name: "Astana",
            country: "Kazakhstan",
            coords: [51.1694, 71.4491],
            type: "office",
            flag: "🇰🇿",
            details: "Regional Representative<br/>Central Asia Operations",
            description: "Kazakhstan Representative"
        },
        {
            name: "Juba",
            country: "South Sudan",
            coords: [4.8594, 31.5713],
            type: "office",
            flag: "🇸🇸",
            details: "Regional Representative<br/>African Operations",
            description: "South Sudan Representative"
        },
        {
            name: "Hong Kong",
            country: "Hong Kong",
            coords: [22.3193, 114.1694],
            type: "hub",
            flag: "🇭🇰",
            details: "Asia Pacific Hub<br/>Regional Coordination",
            description: "Asia Pacific Operations"
        }
    ];

    // Create custom icons
    function createCustomIcon(office) {
        const iconClass = office.type === 'headquarters' ? 'headquarters' : '';
        return L.divIcon({
            html: `<div class="custom-marker ${iconClass}"></div>`,
            className: 'custom-div-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10]
        });
    }

    // Add markers to map
    const markers = [];

    offices.forEach(office => {
        const marker = L.marker(office.coords, {
            icon: createCustomIcon(office)
        }).addTo(map);

        markers.push(marker); // store marker

        // Create popup content
        const popupContent = `
            <div class="popup-title">${office.flag} ${office.name}, ${office.country}</div>
            <div class="popup-details">${office.details}</div>
        `;

        marker.bindPopup(popupContent, {
            closeButton: false,
            autoClose: true,
            closeOnClick: false,
            className: 'custom-popup'
        });

        // Add hover effects - show popup on mouseover
        marker.on('mouseover', function() {
            this.openPopup();
        });

        // Hide popup when mouse leaves
        marker.on('mouseout', function() {
            this.closePopup();
        });
    });

    // Proper way to fit map to show all markers
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));

    // Add staggered animation delays for office cards
    document.querySelectorAll('.office-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Map interaction enhancements
    map.on('popupopen', function(e) {
        // Center map on opened popup
        map.panTo(e.popup.getLatLng());

        // Convert the country flag emoji inside the dynamic Leaflet popup
        // to a consistent Twemoji flag image on desktop and mobile.
        const popupElement = e.popup.getElement();

        if (popupElement && window.twemoji) {
            twemoji.parse(popupElement, {
                base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
                folder: "svg",
                ext: ".svg"
            });
        }
    });

    // Load country borders GeoJSON
    fetch("/data/world-countries.geojson?v=20261018-1")
    .then(res => {
        if (!res.ok) throw new Error(`Map data request failed: ${res.status}`);
        return res.json();
    })
    .then(data => {
        L.geoJSON(data, {
            interactive: false,
            style: {
                color: "#EF7A2D",   // SYMBA Desert
                weight: 1.5,        // thickness
                opacity: 0.9,
                fillColor: "#222222",
                fillOpacity: 1
            }
        }).addTo(map);
    })
    .catch(error => {
        console.log('Could not load country borders:', error);
        // Map will still work without borders
    });
});


// Mobile menu toggle functionality
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

// Keep the highlighted navigation item in sync with the current section.
function updateAboutNavigationState() {
    const activeLabel = window.location.hash.toLowerCase() === '#services'
        ? 'services'
        : 'about';

    document.querySelectorAll('#navMenu a').forEach((link) => {
        link.classList.toggle(
            'active',
            link.textContent.trim().toLowerCase() === activeLabel
        );
    });
}

updateAboutNavigationState();
window.addEventListener('hashchange', updateAboutNavigationState);

navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('header')) {
        navMenu.classList.remove('show');
    }
});







// Fade About video hero while scrolling
const aboutHero = document.querySelector('.video-hero');
const aboutHeroFadeLayers = aboutHero
    ? aboutHero.querySelectorAll(
        '.hero-video, .video-overlay, .hero-content, .video-control'
    )
    : [];

function updateAboutHeroFade() {
    if (!aboutHero) return;

    const heroHeight = aboutHero.offsetHeight;
    const scrolled = Math.max(
        0,
        -aboutHero.getBoundingClientRect().top
    );

    const fadeStart = heroHeight * 0.05;
    const fadeEnd = heroHeight * 0.55;

    let progress =
        (scrolled - fadeStart) /
        (fadeEnd - fadeStart);

    progress = Math.min(Math.max(progress, 0), 1);

    const smoothProgress =
        progress * progress * (3 - 2 * progress);

    const layerOpacity = String(1 - smoothProgress);

    aboutHeroFadeLayers.forEach((layer) => {
        layer.style.opacity = layerOpacity;
    });

    aboutHero.style.pointerEvents =
        smoothProgress > 0.95 ? 'none' : 'auto';
}

window.addEventListener(
    'scroll',
    updateAboutHeroFade,
    { passive: true }
);

window.addEventListener(
    'resize',
    updateAboutHeroFade
);

updateAboutHeroFade();

// Show the success card only after a real successful form redirect.
document.addEventListener('DOMContentLoaded', () => {
    const statusMessage = document.getElementById('form-success-message');
    if (!statusMessage) return;

    const closeButton = statusMessage.querySelector('.form-status-close');
    const url = new URL(window.location.href);
    const wasSent = url.searchParams.get('message') === 'sent';

    const hideStatus = () => {
        statusMessage.classList.remove('show');
        statusMessage.hidden = true;
        statusMessage.setAttribute('aria-hidden', 'true');
    };

    // Always start hidden. This also protects against stale CSS/browser cache.
    hideStatus();

    if (wasSent) {
        statusMessage.hidden = false;
        statusMessage.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => statusMessage.classList.add('show'));

        // Remove ?message=sent immediately so refreshing the page does not show it again.
        url.searchParams.delete('message');
        url.hash = 'contact';
        window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
    }

    closeButton?.addEventListener('click', hideStatus);
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
