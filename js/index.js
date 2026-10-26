        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Header background on scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

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

        // Products slideshow functionality
        const productsSlides = document.querySelector('.products-slides');
        const productSlideItems = productsSlides
            ? Array.from(productsSlides.querySelectorAll('.product-slide'))
            : [];
        const productsNavDots = Array.from(
            document.querySelectorAll('.products-nav-dot')
        );

        let currentProductSlide = 0;
        let isDragging = false;
        let dragStartX = 0;
        let startScrollLeft = 0;
        let productsAutoAdvance = null;

        /*
         * Calculate each slide position from its real rendered location.
         * This accounts for max-width, gap, padding and mobile widths.
         */
        function getProductSlideTargetLeft(index) {
            if (!productsSlides || productSlideItems.length === 0) {
                return 0;
            }

            const safeIndex = Math.max(
                0,
                Math.min(index, productSlideItems.length - 1)
            );

            const containerRect = productsSlides.getBoundingClientRect();
            const firstSlideRect = productSlideItems[0].getBoundingClientRect();
            const targetSlideRect =
                productSlideItems[safeIndex].getBoundingClientRect();

            const firstSlideLeft =
                firstSlideRect.left -
                containerRect.left +
                productsSlides.scrollLeft;

            const targetSlideLeft =
                targetSlideRect.left -
                containerRect.left +
                productsSlides.scrollLeft;

            const requestedLeft = targetSlideLeft - firstSlideLeft;
            const maximumLeft =
                productsSlides.scrollWidth - productsSlides.clientWidth;

            return Math.max(0, Math.min(requestedLeft, maximumLeft));
        }

        function updateProductsNavDots() {
            productsNavDots.forEach((dot, index) => {
                const isActive = index === currentProductSlide;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-current', isActive ? 'true' : 'false');
            });
        }

        function goToProductSlide(index, behavior = 'smooth') {
            if (!productsSlides || productSlideItems.length === 0) {
                return;
            }

            currentProductSlide = Math.max(
                0,
                Math.min(index, productSlideItems.length - 1)
            );

            productsSlides.scrollTo({
                left: getProductSlideTargetLeft(currentProductSlide),
                behavior
            });

            updateProductsNavDots();
        }

        function getNearestProductSlideIndex() {
            if (!productsSlides || productSlideItems.length === 0) {
                return 0;
            }

            const currentLeft = productsSlides.scrollLeft;
            let nearestIndex = 0;
            let nearestDistance = Number.POSITIVE_INFINITY;

            productSlideItems.forEach((slide, index) => {
                const distance = Math.abs(
                    currentLeft - getProductSlideTargetLeft(index)
                );

                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestIndex = index;
                }
            });

            return nearestIndex;
        }

        // Products navigation dots
        productsNavDots.forEach((dot, index) => {
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
            dot.setAttribute('aria-label', `Show product ${index + 1}`);

            dot.addEventListener('click', () => {
                goToProductSlide(index);
            });

            dot.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    goToProductSlide(index);
                }
            });
        });

        // Products keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (!event.target.closest('.products')) {
                return;
            }

            if (
                event.key === 'ArrowLeft' &&
                currentProductSlide > 0
            ) {
                event.preventDefault();
                goToProductSlide(currentProductSlide - 1);
            } else if (
                event.key === 'ArrowRight' &&
                currentProductSlide < productSlideItems.length - 1
            ) {
                event.preventDefault();
                goToProductSlide(currentProductSlide + 1);
            }
        });

        // Keep the active dot in sync with manual scrolling and dragging
        let productScrollFrame = null;

        if (productsSlides) {
            productsSlides.addEventListener('scroll', () => {
                if (productScrollFrame !== null) {
                    cancelAnimationFrame(productScrollFrame);
                }

                productScrollFrame = requestAnimationFrame(() => {
                    const newSlide = getNearestProductSlideIndex();

                    if (newSlide !== currentProductSlide) {
                        currentProductSlide = newSlide;
                        updateProductsNavDots();
                    }

                    productScrollFrame = null;
                });
            });

            productsSlides.addEventListener('pointerdown', (event) => {
                // Links and buttons must remain clickable.
                if (event.target.closest('a, button')) {
                    return;
                }

                isDragging = true;
                dragStartX = event.clientX;
                startScrollLeft = productsSlides.scrollLeft;

                productsSlides.setPointerCapture(event.pointerId);
                productsSlides.classList.add('dragging');
                stopProductsAutoAdvance();
            });

            productsSlides.addEventListener('pointermove', (event) => {
                if (!isDragging) {
                    return;
                }

                event.preventDefault();

                const distance = event.clientX - dragStartX;
                productsSlides.scrollLeft = startScrollLeft - distance;
            });

            productsSlides.addEventListener('pointerup', (event) => {
                if (!isDragging) {
                    return;
                }

                isDragging = false;

                if (productsSlides.hasPointerCapture(event.pointerId)) {
                    productsSlides.releasePointerCapture(event.pointerId);
                }

                productsSlides.classList.remove('dragging');
                currentProductSlide = getNearestProductSlideIndex();
                goToProductSlide(currentProductSlide);
                startProductsAutoAdvance();
            });

            productsSlides.addEventListener('pointercancel', (event) => {
                isDragging = false;

                if (productsSlides.hasPointerCapture(event.pointerId)) {
                    productsSlides.releasePointerCapture(event.pointerId);
                }

                productsSlides.classList.remove('dragging');
                currentProductSlide = getNearestProductSlideIndex();
                updateProductsNavDots();
                startProductsAutoAdvance();
            });
        }

        function stopProductsAutoAdvance() {
            if (productsAutoAdvance !== null) {
                clearInterval(productsAutoAdvance);
                productsAutoAdvance = null;
            }
        }

        function startProductsAutoAdvance() {
            stopProductsAutoAdvance();

            if (productSlideItems.length <= 1) {
                return;
            }

            productsAutoAdvance = setInterval(() => {
                const nextSlide =
                    currentProductSlide < productSlideItems.length - 1
                        ? currentProductSlide + 1
                        : 0;

                goToProductSlide(nextSlide);
            }, 10000);
        }

        if (productsSlides) {
            productsSlides.addEventListener(
                'mouseenter',
                stopProductsAutoAdvance
            );

            productsSlides.addEventListener(
                'mouseleave',
                startProductsAutoAdvance
            );
        }

        window.addEventListener('resize', () => {
            goToProductSlide(currentProductSlide, 'auto');
        });

        updateProductsNavDots();
        startProductsAutoAdvance();

        // Add mouse parallax effect to hero section with photo
        const hero = document.querySelector('.hero');
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { offsetWidth, offsetHeight } = hero;
            const x = (clientX / offsetWidth) * 100;
            const y = (clientY / offsetHeight) * 100;
            
            // Create a subtle parallax overlay effect without changing the background image
            const overlay = hero.querySelector('::before') || hero;
            hero.style.setProperty('--mouse-x', `${x}%`);
            hero.style.setProperty('--mouse-y', `${y}%`);
        });

        // Project cards use the shared fade-in animation.

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

        // Mobile menu functionality
        function toggleMobileMenu() {
            const navLinks = document.querySelector('.nav-links');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            
            navLinks.classList.toggle('active');
            if (menuBtn) menuBtn.classList.toggle('active');
        }

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                const navLinks = document.querySelector('.nav-links');
                const menuBtn = document.querySelector('.mobile-menu-btn');
                
                navLinks.classList.remove('active');
                if (menuBtn) menuBtn.classList.remove('active');
            });
        });

                // Mobile menu toggle functionality
        const navToggle = document.getElementById("navToggle");
        const navMenu = document.getElementById("navMenu");

        // Highlight Projects when this page is opened at its projects section.
        function updateHomeNavigationState() {
            const activeLabel = window.location.hash.toLowerCase() === '#services'
                ? 'projects'
                : 'home';

            document.querySelectorAll('#navMenu a').forEach((link) => {
                link.classList.toggle(
                    'active',
                    link.textContent.trim().toLowerCase() === activeLabel
                );
            });
        }

        updateHomeNavigationState();
        window.addEventListener('hashchange', updateHomeNavigationState);

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

        // Project Gallery Filter
        const galleryFilterButtons = document.querySelectorAll('.gallery-filter .filter-btn');
        const galleryProjectItems = document.querySelectorAll('.gallery-grid .gallery-item');
        const FILTER_ANIMATION_MS = 300;

        galleryFilterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const selectedFilter = button.dataset.filter;

                galleryFilterButtons.forEach((filterButton) => {
                    const isActive = filterButton === button;
                    filterButton.classList.toggle('active', isActive);
                    filterButton.setAttribute('aria-pressed', String(isActive));
                });

                galleryProjectItems.forEach((item) => {
                    const categories = (item.dataset.category || '')
                        .split(/\s+/)
                        .filter(Boolean);

                    const shouldShow =
                        selectedFilter === 'all' ||
                        categories.includes(selectedFilter);

                    if (shouldShow) {
                        item.classList.remove('hidden');

                        requestAnimationFrame(() => {
                            item.classList.remove('is-filtered-out');
                        });
                    } else {
                        item.classList.add('is-filtered-out');

                        window.setTimeout(() => {
                            const activeFilter =
                                document.querySelector('.gallery-filter .filter-btn.active')
                                    ?.dataset.filter;

                            const currentCategories = (item.dataset.category || '')
                                .split(/\s+/)
                                .filter(Boolean);

                            const stillShouldBeHidden =
                                activeFilter !== 'all' &&
                                !currentCategories.includes(activeFilter);

                            if (stillShouldBeHidden) {
                                item.classList.add('hidden');
                            }
                        }, FILTER_ANIMATION_MS);
                    }
                });
            });
        });

        galleryFilterButtons.forEach((button) => {
            button.setAttribute(
                'aria-pressed',
                String(button.classList.contains('active'))
            );
        });

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


// Fade the entire Home hero while scrolling.
const homeHero = document.querySelector('.hero');

function updateHeroFade() {
    if (!homeHero) return;

    const heroHeight = homeHero.offsetHeight;
    const scrolled = Math.max(0, -homeHero.getBoundingClientRect().top);
    const fadeStart = heroHeight * 0.05;
    const fadeEnd = heroHeight * 0.55;
    let progress = (scrolled - fadeStart) / (fadeEnd - fadeStart);
    progress = Math.min(Math.max(progress, 0), 1);
    const smoothProgress = progress * progress * (3 - 2 * progress);

    homeHero.style.opacity = String(1 - smoothProgress);
    homeHero.style.pointerEvents = smoothProgress > 0.95 ? 'none' : 'auto';
}

window.addEventListener('scroll', updateHeroFade, { passive: true });
window.addEventListener('resize', updateHeroFade);
updateHeroFade();
