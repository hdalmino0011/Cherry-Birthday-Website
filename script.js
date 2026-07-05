'use strict';

/* ============================================
   CONSTANTS & CONFIGURATION
   ============================================ */
const CONFIG = {
    floatingHeartsCount: 20,
    confettiCount: 150,
    confettiDuration: 6000,
    scrollThreshold: 300,
    revealOffset: 100,
};

const COLORS = {
    softPink: '#FFB6C1',
    deepRose: '#E75480',
    warmCoral: '#FF7F50',
    brightGold: '#FFD700',
    lavender: '#DDA0DD',
    deepNavy: '#1A1A2E',
    white: '#FFFFFF',
};

/* Reusable icon glyphs (Font Awesome classes) instead of emoji characters,
   so every "heart" moment in the UI stays visually consistent. */
const HEART_ICON_CLASSES = ['fa-heart', 'fa-heart-circle-check', 'fa-heart-pulse'];

/* ============================================
   DOM ELEMENT REFERENCES
   ============================================ */
const DOM = {
    mainNav:            document.getElementById('mainNav'),
    navToggle:          document.getElementById('navToggle'),
    mobileMenu:         document.getElementById('mobileMenu'),
    mobileMenuClose:    document.getElementById('mobileMenuClose'),
    mobileMenuLinks:    document.querySelectorAll('.mobile-menu a'),

    celebrateBtn:       document.getElementById('celebrateBtn'),
    confettiCanvas:     document.getElementById('confettiCanvas'),
    scrollIndicator:    document.getElementById('scrollIndicator'),

    floatingHeartsContainer: document.getElementById('floatingHearts'),

    wishesForm:         document.getElementById('wishesForm'),
    wishName:           document.getElementById('wishName'),
    wishMessage:        document.getElementById('wishMessage'),
    thankYouMessage:    document.getElementById('thankYouMessage'),
    sendAnotherBtn:     document.getElementById('sendAnotherBtn'),

    customAlert:        document.getElementById('customAlert'),
    alertTitle:         document.getElementById('alertTitle'),
    alertMessage:       document.getElementById('alertMessage'),
    alertCloseBtn:      document.getElementById('alertCloseBtn'),

    celebrationOverlay:   document.getElementById('celebrationOverlay'),
    closeCelebrationBtn:  document.getElementById('closeCelebrationBtn'),
    balloonCanvas:        document.getElementById('balloonCanvas'),

    backToTop:          document.getElementById('backToTop'),

    memoryLightbox:      document.getElementById('memoryLightbox'),
    lightboxBackdrop:    document.getElementById('lightboxBackdrop'),
    lightboxClose:       document.getElementById('lightboxClose'),
    lightboxPrev:        document.getElementById('lightboxPrev'),
    lightboxNext:        document.getElementById('lightboxNext'),
    lightboxImage:       document.getElementById('lightboxImage'),
    lightboxPlaceholder: document.getElementById('lightboxPlaceholder'),
    lightboxTitle:       document.getElementById('lightboxTitle'),
    lightboxSubtitle:    document.getElementById('lightboxSubtitle'),
    lightboxCurrent:     document.getElementById('lightboxCurrent'),
    lightboxTotal:       document.getElementById('lightboxTotal'),

    revealElements:     document.querySelectorAll(
        '.letter-card, .memory-card, .celebration-wrapper, ' +
        '.wishes-form-wrapper, .carousel-container'
    ),

    carouselTrack:      document.getElementById('carouselTrack'),
    carouselPrev:       document.getElementById('carouselPrev'),
    carouselNext:       document.getElementById('carouselNext'),
    carouselDots:       document.getElementById('carouselDots'),
    currentSlideSpan:   document.getElementById('currentSlide'),
    totalSlidesSpan:    document.getElementById('totalSlides'),
};

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
const showAlert = (title, message) => {
    DOM.alertTitle.textContent   = title;
    DOM.alertMessage.textContent = message;
    DOM.customAlert.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const hideAlert = () => {
    DOM.customAlert.classList.remove('active');
    document.body.style.overflow = '';
};

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

/* ============================================
   NAVIGATION
   ============================================ */
const Navigation = (() => {

    let mobileOverlay = null;

    const createOverlay = () => {
        mobileOverlay = document.createElement('div');
        mobileOverlay.classList.add('mobile-menu-overlay');
        document.body.appendChild(mobileOverlay);
        mobileOverlay.addEventListener('click', closeMobileMenu);
    };

    const openMobileMenu = () => {
        DOM.mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
        DOM.mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    const handleScroll = () => {
        if (window.scrollY > 50) {
            DOM.mainNav.classList.add('scrolled');
        } else {
            DOM.mainNav.classList.remove('scrolled');
        }
    };

    const init = () => {
        createOverlay();

        DOM.navToggle.addEventListener('click', openMobileMenu);
        DOM.mobileMenuClose.addEventListener('click', closeMobileMenu);

        DOM.mobileMenuLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const navHeight = DOM.mainNav.offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth',
                    });
                }
            });
        });

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    };

    return { init };

})();

/* ============================================
   FLOATING HEARTS BACKGROUND
   ============================================ */
const FloatingHearts = (() => {

    const createHeart = () => {
        if (!DOM.floatingHeartsContainer) return;

        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = `<i class="fas ${randomFrom(HEART_ICON_CLASSES)}"></i>`;

        const size     = randomBetween(14, 28);
        const leftPos  = randomBetween(0, 100);
        const duration = randomBetween(12, 25);
        const delay    = randomBetween(0, 15);

        heart.style.cssText = `
            font-size: ${size}px;
            left: ${leftPos}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;

        DOM.floatingHeartsContainer.appendChild(heart);

        const totalTime = (duration + delay) * 1000;
        setTimeout(() => {
            heart.remove();
            createHeart();
        }, totalTime);
    };

    const init = () => {
        for (let i = 0; i < CONFIG.floatingHeartsCount; i++) {
            createHeart();
        }
    };

    return { init };

})();

/* ============================================
   CONFETTI ANIMATION (Hero Section)
   ============================================ */
const ConfettiAnimation = (() => {

    let ctx         = null;
    let particles   = [];
    let animFrame   = null;
    let isRunning   = false;

    const confettiColors = [
        COLORS.softPink,
        COLORS.deepRose,
        COLORS.warmCoral,
        COLORS.brightGold,
        COLORS.lavender,
        COLORS.white,
    ];

    const shapes = ['heart', 'circle', 'rect'];

    class Particle {
        constructor(canvasWidth, canvasHeight) {
            this.canvasWidth  = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.reset();
        }

        reset() {
            this.x       = randomBetween(0, this.canvasWidth);
            this.y       = randomBetween(-100, -10);
            this.size    = randomBetween(8, 16);
            this.color   = randomFrom(confettiColors);
            this.shape   = randomFrom(shapes);
            this.speedX  = randomBetween(-2, 2);
            this.speedY  = randomBetween(2, 5);
            this.gravity = randomBetween(0.05, 0.15);
            this.angle   = randomBetween(0, Math.PI * 2);
            this.spin    = randomBetween(-0.1, 0.1);
            this.opacity = 1;
            this.fade    = randomBetween(0.005, 0.015);
        }

        update() {
            this.x       += this.speedX;
            this.speedY  += this.gravity;
            this.y       += this.speedY;
            this.angle   += this.spin;
            this.opacity -= this.fade;

            if (this.y > this.canvasHeight + 50 || this.opacity <= 0) {
                this.reset();
            }
        }

        drawHeart(ctx) {
            const s = this.size;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.beginPath();
            ctx.moveTo(0, -s * 0.5);
            ctx.bezierCurveTo( s * 0.8, -s * 1.2,  s * 1.4,  s * 0.2,  0,  s * 0.9);
            ctx.bezierCurveTo(-s * 1.4,  s * 0.2, -s * 0.8, -s * 1.2,  0, -s * 0.5);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.restore();
        }

        drawCircle(ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.restore();
        }

        drawRect(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fillRect(-this.size * 0.5, -this.size * 0.3, this.size, this.size * 0.6);
            ctx.restore();
        }

        draw(ctx) {
            if (this.shape === 'heart')  { this.drawHeart(ctx); }
            if (this.shape === 'circle') { this.drawCircle(ctx); }
            if (this.shape === 'rect')   { this.drawRect(ctx); }
        }
    }

    const resizeCanvas = () => {
        if (!DOM.confettiCanvas) return;
        const hero = document.getElementById('hero');
        DOM.confettiCanvas.width  = hero.offsetWidth;
        DOM.confettiCanvas.height = hero.offsetHeight;
    };

    const animate = () => {
        if (!isRunning) return;

        ctx.clearRect(0, 0, DOM.confettiCanvas.width, DOM.confettiCanvas.height);

        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });

        animFrame = requestAnimationFrame(animate);
    };

    const stop = () => {
        isRunning = false;
        cancelAnimationFrame(animFrame);
        if (ctx) {
            ctx.clearRect(0, 0, DOM.confettiCanvas.width, DOM.confettiCanvas.height);
        }
        particles = [];
    };

    const start = () => {
        if (isRunning) stop();
        if (!DOM.confettiCanvas) return;

        resizeCanvas();
        ctx = DOM.confettiCanvas.getContext('2d');
        isRunning = true;

        particles = Array.from(
            { length: CONFIG.confettiCount },
            () => new Particle(DOM.confettiCanvas.width, DOM.confettiCanvas.height)
        );

        animate();

        setTimeout(stop, CONFIG.confettiDuration);
    };

    return { start, stop };

})();

/* ============================================
   BALLOON / HEART CELEBRATION ANIMATION
   ============================================ */
const CelebrationAnimation = (() => {

    let ctx       = null;
    let balloons  = [];
    let animFrame = null;

    const balloonColors = [
        COLORS.softPink,
        COLORS.deepRose,
        COLORS.warmCoral,
        COLORS.brightGold,
        COLORS.lavender,
    ];

    class Balloon {
        constructor(canvasWidth, canvasHeight) {
            this.canvasWidth  = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.reset();
        }

        reset() {
            this.x       = randomBetween(50, this.canvasWidth - 50);
            this.y       = this.canvasHeight + randomBetween(50, 200);
            this.radius  = randomBetween(20, 45);
            this.color   = randomFrom(balloonColors);
            this.speedY  = randomBetween(1.5, 3.5);
            this.speedX  = randomBetween(-0.8, 0.8);
            this.wobble  = randomBetween(0, Math.PI * 2);
            this.wobbleSpeed = randomBetween(0.02, 0.05);
            this.opacity = randomBetween(0.7, 1);
            this.stringLen = randomBetween(30, 60);
        }

        update() {
            this.y       -= this.speedY;
            this.wobble  += this.wobbleSpeed;
            this.x       += Math.sin(this.wobble) * 0.8 + this.speedX;

            if (this.y < -this.radius * 2 - this.stringLen) {
                this.reset();
            }
        }

        draw(ctx) {
            const r = this.radius;

            ctx.save();
            ctx.globalAlpha = this.opacity;

            ctx.beginPath();
            ctx.moveTo(this.x, this.y + r);
            ctx.quadraticCurveTo(
                this.x + 10,
                this.y + r + this.stringLen * 0.5,
                this.x,
                this.y + r + this.stringLen
            );
            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            ctx.lineWidth   = 1.5;
            ctx.stroke();

            ctx.translate(this.x, this.y);
            ctx.beginPath();
            ctx.moveTo(0, -r * 0.4);
            ctx.bezierCurveTo( r * 0.9, -r * 1.2,  r * 1.5,  r * 0.2,  0,  r * 0.9);
            ctx.bezierCurveTo(-r * 1.5,  r * 0.2, -r * 0.9, -r * 1.2,  0, -r * 0.4);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();

            ctx.beginPath();
            ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.25, r * 0.15, -0.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.fill();

            ctx.restore();
        }
    }

    const resizeCanvas = () => {
        if (!DOM.balloonCanvas) return;
        DOM.balloonCanvas.width  = window.innerWidth;
        DOM.balloonCanvas.height = window.innerHeight;
    };

    const animate = () => {
        ctx.clearRect(0, 0, DOM.balloonCanvas.width, DOM.balloonCanvas.height);
        balloons.forEach(b => {
            b.update();
            b.draw(ctx);
        });
        animFrame = requestAnimationFrame(animate);
    };

    const stop = () => {
        cancelAnimationFrame(animFrame);
        if (ctx) {
            ctx.clearRect(0, 0, DOM.balloonCanvas.width, DOM.balloonCanvas.height);
        }
        balloons = [];
    };

    const start = () => {
        if (!DOM.balloonCanvas) return;
        resizeCanvas();
        ctx = DOM.balloonCanvas.getContext('2d');

        balloons = Array.from(
            { length: 30 },
            () => new Balloon(DOM.balloonCanvas.width, DOM.balloonCanvas.height)
        );

        balloons.forEach((b) => {
            b.y = DOM.balloonCanvas.height + randomBetween(0, 600);
        });

        animate();
    };

    return { start, stop };

})();

/* ============================================
   CELEBRATION OVERLAY
   ============================================ */
const Celebration = (() => {

    const show = () => {
        DOM.celebrationOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        CelebrationAnimation.start();
        ConfettiAnimation.start();
    };

    const hide = () => {
        DOM.celebrationOverlay.classList.remove('active');
        document.body.style.overflow = '';
        CelebrationAnimation.stop();
    };

    const init = () => {
        if (DOM.celebrateBtn) {
            DOM.celebrateBtn.addEventListener('click', show);
        }

        if (DOM.closeCelebrationBtn) {
            DOM.closeCelebrationBtn.addEventListener('click', hide);
        }

        DOM.celebrationOverlay.addEventListener('click', (e) => {
            if (e.target === DOM.celebrationOverlay) {
                hide();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (DOM.celebrationOverlay.classList.contains('active')) {
                    hide();
                }
                if (DOM.customAlert.classList.contains('active')) {
                    hideAlert();
                }
            }
        });
    };

    return { init, show, hide };

})();

/* ============================================
   WISHES CAROUSEL
   ============================================ */
const WishCarousel = (() => {

    let wishes = [];
    let currentIndex = 0;
    let autoPlayInterval = null;
    const AUTO_PLAY_DELAY = 5000;

    const HARDCODED_WISHES = [
        {
            name: 'Baby Heart',
            message: 'Happy Birthday ate Cherry I love you so much and buy me cotton candies okay',
            relation: 'Little Sister'
        },
        {
            name: 'Maria Teresa Dalmino',
            message: 'Happy Birthday Cherry, amping and God Bless you!',
            relation: 'Hanz\'s Mom'
        },
        {
            name: 'Edgar Dalmino',
            message: 'Happy Birthday indae Cherry, pray to God always and amping!',
            relation: 'Hanz\'s Father'
        }
    ];

    const getInitials = (name) => {
        const parts = name.split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const loadWishes = () => {
        let stored = null;
        try {
            stored = localStorage.getItem('cherryWishes');
        } catch (e) {
            stored = null;
        }

        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    wishes = parsed;
                    return;
                }
            } catch (e) {
                // Fall through to hardcoded
            }
        }
        wishes = HARDCODED_WISHES.map(w => ({ ...w }));
        saveWishes();
    };

    const saveWishes = () => {
        try {
            localStorage.setItem('cherryWishes', JSON.stringify(wishes));
        } catch (e) {
            // Storage unavailable (private browsing, etc.) — safe to ignore
        }
    };

    const addWish = (name, message) => {
        wishes.push({
            name: name.trim(),
            message: message.trim(),
            relation: 'Friend'
        });
        saveWishes();
        renderCarousel();
        goToSlide(wishes.length - 1);
    };

    const createSlide = (wish, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.dataset.index = index;

        const initials = getInitials(wish.name);

        slide.innerHTML = `
            <div class="slide-header">
                <div class="slide-avatar">${initials}</div>
                <div>
                    <div class="slide-name">${escapeHtml(wish.name)}</div>
                    <div class="slide-relation">${escapeHtml(wish.relation)}</div>
                </div>
            </div>
            <p class="slide-message">${escapeHtml(wish.message)}</p>
            <div class="slide-hearts">
                <i class="fas fa-heart"></i>
                <i class="fas fa-heart"></i>
                <i class="fas fa-heart"></i>
            </div>
        `;

        return slide;
    };

    const renderCarousel = () => {
        if (!DOM.carouselTrack) return;

        DOM.carouselTrack.innerHTML = '';

        wishes.forEach((wish, index) => {
            const slide = createSlide(wish, index);
            DOM.carouselTrack.appendChild(slide);
        });

        renderDots();

        if (DOM.totalSlidesSpan) {
            DOM.totalSlidesSpan.textContent = wishes.length;
        }

        goToSlide(currentIndex);
    };

    const renderDots = () => {
        if (!DOM.carouselDots) return;

        DOM.carouselDots.innerHTML = '';

        wishes.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to wish ${index + 1}`);
            if (index === currentIndex) {
                dot.classList.add('active');
            }
            dot.dataset.index = index;
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoPlay();
            });
            DOM.carouselDots.appendChild(dot);
        });
    };

    const goToSlide = (index) => {
        if (wishes.length === 0) return;

        if (index < 0) index = wishes.length - 1;
        if (index >= wishes.length) index = 0;

        currentIndex = index;

        if (DOM.carouselTrack) {
            DOM.carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        const dots = DOM.carouselDots.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        if (DOM.currentSlideSpan) {
            DOM.currentSlideSpan.textContent = currentIndex + 1;
        }
    };

    const nextSlide = () => {
        goToSlide(currentIndex + 1);
    };

    const prevSlide = () => {
        goToSlide(currentIndex - 1);
    };

    const startAutoPlay = () => {
        if (wishes.length <= 1) return;
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
        autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
    };

    const resetAutoPlay = () => {
        startAutoPlay();
    };

    const pauseAutoPlay = () => {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    };

    const init = () => {
        loadWishes();
        renderCarousel();

        if (DOM.carouselPrev) {
            DOM.carouselPrev.addEventListener('click', () => {
                prevSlide();
                resetAutoPlay();
            });
        }

        if (DOM.carouselNext) {
            DOM.carouselNext.addEventListener('click', () => {
                nextSlide();
                resetAutoPlay();
            });
        }

        const container = document.getElementById('wishCarousel');
        if (container) {
            container.addEventListener('mouseenter', pauseAutoPlay);
            container.addEventListener('mouseleave', startAutoPlay);
            container.addEventListener('touchstart', pauseAutoPlay, { passive: true });
            container.addEventListener('touchend', startAutoPlay, { passive: true });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoPlay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoPlay();
            }
        });

        startAutoPlay();
    };

    const addWishFromForm = (name, message) => {
        addWish(name, message);
    };

    return { init, addWishFromForm };

})();

/* ============================================
   WISHES FORM
   ============================================ */
const WishesForm = (() => {

    const handleSubmit = (e) => {
        e.preventDefault();

        const name    = DOM.wishName.value.trim();
        const message = DOM.wishMessage.value.trim();

        if (!name || !message) {
            showAlert(
                'Almost there',
                'Please fill in your name and a love note for Cherry Ann.'
            );
            return;
        }

        WishCarousel.addWishFromForm(name, message);

        DOM.thankYouMessage.classList.add('active');

        setTimeout(() => {
            showAlert(
                'Love Sent',
                `Thank you, ${name}. Your love note has been sent. ` +
                `Cherry Ann's heart is full.`
            );
        }, 500);

        DOM.wishesForm.reset();
    };

    const handleSendAnother = () => {
        DOM.thankYouMessage.classList.remove('active');
    };

    const init = () => {
        if (DOM.wishesForm) {
            DOM.wishesForm.addEventListener('submit', handleSubmit);
        }

        if (DOM.sendAnotherBtn) {
            DOM.sendAnotherBtn.addEventListener('click', handleSendAnother);
        }

        if (DOM.alertCloseBtn) {
            DOM.alertCloseBtn.addEventListener('click', hideAlert);
        }

        DOM.customAlert.addEventListener('click', (e) => {
            if (e.target === DOM.customAlert) {
                hideAlert();
            }
        });
    };

    return { init };

})();

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
const BackToTop = (() => {

    const handleScroll = () => {
        if (window.scrollY > CONFIG.scrollThreshold) {
            DOM.backToTop.classList.add('visible');
        } else {
            DOM.backToTop.classList.remove('visible');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const init = () => {
        if (!DOM.backToTop) return;

        DOM.backToTop.addEventListener('click', scrollToTop);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    };

    return { init };

})();

/* ============================================
   SCROLL REVEAL ANIMATION
   ============================================ */
const ScrollReveal = (() => {

    const prepareElements = () => {
        DOM.revealElements.forEach((el) => {
            el.classList.add('reveal');
        });

        document.querySelectorAll(
            '.section-header, .letter-card, .memory-card, ' +
            '.celebration-container, .wish-card, .wishes-form'
        ).forEach(el => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
            }
        });
    };

    const checkReveal = () => {
        const elements = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;

        elements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < windowHeight - CONFIG.revealOffset;

            if (isVisible && !el.classList.contains('revealed')) {
                const delay = el.closest('.memories-grid, .carousel-track')
                    ? index * 100
                    : 0;

                setTimeout(() => {
                    el.classList.add('revealed');
                }, delay);
            }
        });
    };

    const init = () => {
        prepareElements();

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry, index) => {
                        if (entry.isIntersecting) {
                            const delay = entry.target.closest(
                                '.memories-grid, .carousel-track'
                            ) ? index * 80 : 0;

                            setTimeout(() => {
                                entry.target.classList.add('revealed');
                            }, delay);

                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -80px 0px',
                }
            );

            document.querySelectorAll('.reveal').forEach(el => {
                observer.observe(el);
            });
        } else {
            window.addEventListener('scroll', checkReveal, { passive: true });
            checkReveal();
        }
    };

    return { init };

})();

/* ============================================
   PARALLAX / MOUSE TILT EFFECT (Hero)
   ============================================ */
const ParallaxEffect = (() => {

    const heroContent = document.querySelector('.hero-content');

    const handleMouseMove = (e) => {
        if (!heroContent) return;

        const hero = document.getElementById('hero');
        const rect = hero.getBoundingClientRect();

        if (rect.bottom < 0 || rect.top > window.innerHeight) return;

        const centerX = rect.width  / 2;
        const centerY = rect.height / 2;
        const mouseX  = e.clientX - rect.left;
        const mouseY  = e.clientY - rect.top;

        const tiltX = ((mouseY - centerY) / centerY) * -6;
        const tiltY = ((mouseX - centerX) / centerX) *  6;

        heroContent.style.transform = `
            perspective(1000px)
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
            translateZ(10px)
        `;
        heroContent.style.transition = 'transform 0.1s ease';
    };

    const handleMouseLeave = () => {
        if (!heroContent) return;
        heroContent.style.transform = `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            translateZ(0px)
        `;
        heroContent.style.transition = 'transform 0.5s ease';
    };

    const init = () => {
        if (window.matchMedia('(hover: hover)').matches) {
            document.addEventListener('mousemove', handleMouseMove, { passive: true });
            document.addEventListener('mouseleave', handleMouseLeave);
        }
    };

    return { init };

})();

/* ============================================
   MEMORY PHOTO LIGHTBOX
   ============================================ */
const MemoryLightbox = (() => {

    let photos = [];
    let currentIndex = 0;
    let lastFocusedEl = null;

    const collectPhotos = () => {
        const cards = document.querySelectorAll('.memory-card');
        photos = Array.from(cards).map(card => {
            const img      = card.querySelector('.memory-card-image img');
            const heading  = card.querySelector('.memory-card-caption h3');
            const subtext  = card.querySelector('.memory-card-caption p');
            return {
                src:   img ? img.getAttribute('src') : '',
                alt:   img ? img.getAttribute('alt') : '',
                title: heading ? heading.textContent : '',
                sub:   subtext ? subtext.textContent : '',
                failed: img ? img.classList.contains('img-failed') : false,
            };
        });

        if (DOM.lightboxTotal) {
            DOM.lightboxTotal.textContent = photos.length;
        }
    };

    const renderSlide = () => {
        if (photos.length === 0) return;
        const photo = photos[currentIndex];

        DOM.lightboxImage.src = photo.src;
        DOM.lightboxImage.alt = photo.alt;
        DOM.lightboxImage.classList.remove('img-failed');

        DOM.lightboxTitle.textContent    = photo.title;
        DOM.lightboxSubtitle.textContent = photo.sub;
        DOM.lightboxCurrent.textContent  = currentIndex + 1;
    };

    const handleImageError = () => {
        DOM.lightboxImage.classList.add('img-failed');
    };

    const open = (index, triggerEl) => {
        if (photos.length === 0) collectPhotos();
        currentIndex = index;
        lastFocusedEl = triggerEl || document.activeElement;

        renderSlide();

        DOM.memoryLightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        DOM.lightboxClose.focus();
    };

    const close = () => {
        DOM.memoryLightbox.classList.remove('active');
        document.body.style.overflow = '';
        if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
            lastFocusedEl.focus();
        }
    };

    const next = () => {
        if (photos.length === 0) return;
        currentIndex = (currentIndex + 1) % photos.length;
        renderSlide();
    };

    const prev = () => {
        if (photos.length === 0) return;
        currentIndex = (currentIndex - 1 + photos.length) % photos.length;
        renderSlide();
    };

    const bindCardTriggers = () => {
        const cards = document.querySelectorAll('.memory-card');
        cards.forEach((card, index) => {
            card.addEventListener('click', () => open(index, card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open(index, card);
                }
            });
        });
    };

    const init = () => {
        if (!DOM.memoryLightbox) return;

        collectPhotos();
        bindCardTriggers();

        DOM.lightboxImage.addEventListener('error', handleImageError);
        DOM.lightboxClose.addEventListener('click', close);
        DOM.lightboxBackdrop.addEventListener('click', close);
        DOM.lightboxNext.addEventListener('click', next);
        DOM.lightboxPrev.addEventListener('click', prev);

        document.addEventListener('keydown', (e) => {
            if (!DOM.memoryLightbox.classList.contains('active')) return;

            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        });

        let touchStartX = 0;
        DOM.memoryLightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });

        DOM.memoryLightbox.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchEndX - touchStartX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? prev() : next();
            }
        }, { passive: true });
    };

    return { init };

})();

/* ============================================
   MEMORY CARDS INTERACTION
   ============================================ */
const MemoryCards = (() => {

    const initTouchSupport = () => {
        const cards = document.querySelectorAll('.memory-card');

        cards.forEach(card => {
            card.addEventListener('touchstart', () => {
                card.classList.add('touch-hover');
            }, { passive: true });

            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.classList.remove('touch-hover');
                }, 800);
            }, { passive: true });
        });
    };

    const initClickEffect = () => {
        const cards = document.querySelectorAll('.memory-card');

        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                createSparkle(e.clientX, e.clientY);
            });
        });
    };

    const createSparkle = (x, y) => {
        for (let i = 0; i < 6; i++) {
            const sparkle = document.createElement('i');
            sparkle.className = `fas ${randomFrom(HEART_ICON_CLASSES)}`;
            sparkle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                font-size: ${randomBetween(14, 22)}px;
                color: var(--deep-rose);
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
            `;

            document.body.appendChild(sparkle);

            const angle   = randomBetween(0, Math.PI * 2);
            const distance = randomBetween(60, 130);
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            sparkle.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 },
            ], {
                duration: 1000,
                easing: 'ease-out',
                fill: 'forwards',
            });

            setTimeout(() => sparkle.remove(), 1100);
        }
    };

    const init = () => {
        initTouchSupport();
        initClickEffect();
    };

    return { init };

})();

/* ============================================
   SCROLL INDICATOR
   ============================================ */
const ScrollIndicator = (() => {

    const init = () => {
        if (!DOM.scrollIndicator) return;

        const hide = () => {
            if (window.scrollY > 50) {
                DOM.scrollIndicator.style.opacity = '0';
                DOM.scrollIndicator.style.pointerEvents = 'none';
            } else {
                DOM.scrollIndicator.style.opacity = '1';
                DOM.scrollIndicator.style.pointerEvents = 'auto';
            }
        };

        window.addEventListener('scroll', hide, { passive: true });
    };

    return { init };

})();

/* ============================================
   WINDOW RESIZE HANDLER
   ============================================ */
const ResizeHandler = (() => {

    let resizeTimer = null;

    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (DOM.celebrationOverlay.classList.contains('active')) {
                if (DOM.balloonCanvas) {
                    DOM.balloonCanvas.width  = window.innerWidth;
                    DOM.balloonCanvas.height = window.innerHeight;
                }
            }

            if (DOM.confettiCanvas) {
                const hero = document.getElementById('hero');
                if (hero) {
                    DOM.confettiCanvas.width  = hero.offsetWidth;
                    DOM.confettiCanvas.height = hero.offsetHeight;
                }
            }
        }, 250);
    };

    const init = () => {
        window.addEventListener('resize', handleResize, { passive: true });
    };

    return { init };

})();

/* ============================================
   SPARKLE CURSOR (Optional romantic effect)
   ============================================ */
const SparkleCursor = (() => {

    let lastSparkleTime = 0;

    const createCursorSparkle = (x, y) => {
        const now = Date.now();
        if (now - lastSparkleTime < 120) return;
        lastSparkleTime = now;

        const el = document.createElement('i');
        el.className = `fas ${randomFrom(HEART_ICON_CLASSES)}`;
        el.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
            font-size: ${randomBetween(11, 17)}px;
            color: var(--deep-rose);
            transform: translate(-50%, -50%);
            user-select: none;
        `;

        document.body.appendChild(el);

        el.animate([
            {
                opacity: 0.9,
                transform: `translate(-50%, -50%) scale(1) translateY(0px)`
            },
            {
                opacity: 0,
                transform: `translate(-50%, -50%) scale(0.5) translateY(-${randomBetween(30, 60)}px)`
            }
        ], {
            duration: 700,
            easing: 'ease-out',
            fill: 'forwards',
        });

        setTimeout(() => el.remove(), 750);
    };

    const init = () => {
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            document.addEventListener('mousemove', (e) => {
                createCursorSparkle(e.clientX, e.clientY);
            }, { passive: true });
        }
    };

    return { init };

})();

/* ============================================
   PAGE LOAD ANIMATION
   ============================================ */
const PageLoad = (() => {

    const createLoader = () => {
        const loader = document.createElement('div');
        loader.id = 'pageLoader';
        loader.innerHTML = `
            <div class="loader-content">
                <i class="fas fa-heart loader-heart"></i>
                <p class="loader-text">Preparing something special...</p>
                <p class="loader-name">For Cherry Ann</p>
            </div>
        `;
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1A1A2E, #2D1B30, #E75480);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            transition: opacity 0.8s ease, transform 0.8s ease;
        `;

        document.body.appendChild(loader);
        document.body.style.overflow = 'hidden';

        return loader;
    };

    const init = () => {
        const loader = createLoader();

        const finishLoad = () => {
            setTimeout(() => {
                loader.style.opacity   = '0';
                loader.style.transform = 'scale(1.05)';
                document.body.style.overflow = '';

                setTimeout(() => {
                    loader.remove();
                }, 800);
            }, 1200);
        };

        if (document.readyState === 'complete') {
            finishLoad();
        } else {
            window.addEventListener('load', finishLoad);
        }
    };

    return { init };

})();

/* ============================================
   ACTIVE NAVIGATION LINK ON SCROLL
   ============================================ */
const ActiveNavLink = (() => {

    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const update = () => {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;

            if (window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle(
                'active-nav',
                link.getAttribute('href') === `#${currentSection}`
            );
        });
    };

    const init = () => {
        window.addEventListener('scroll', update, { passive: true });
        update();
    };

    return { init };

})();

/* ============================================
   MAIN INITIALIZER
   ============================================ */
const App = (() => {

    const init = () => {
        PageLoad.init();

        Navigation.init();
        FloatingHearts.init();
        BackToTop.init();
        ScrollReveal.init();
        ScrollIndicator.init();
        Celebration.init();
        WishesForm.init();
        WishCarousel.init();

        MemoryCards.init();
        MemoryLightbox.init();
        ParallaxEffect.init();
        SparkleCursor.init();
        ActiveNavLink.init();

        ResizeHandler.init();

        console.log(
            '%cHappy Birthday, Cherry Ann!',
            'color: #E75480; font-size: 20px; font-weight: bold; ' +
            'font-family: Georgia, serif; padding: 8px;'
        );
        console.log(
            '%cMade with infinite love by Hanz Dee Dalmino',
            'color: #FFD700; font-size: 14px; font-family: Georgia, serif;'
        );
    };

    return { init };

})();

/* ============================================
   START THE APP
   ============================================ */
document.addEventListener('DOMContentLoaded', App.init);
