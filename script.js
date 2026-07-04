/* ============================================
   BIRTHDAY WEBSITE - script.js
   For: Cherry Ann M. Casinto
   From: Hanz Dee Dalmino
   ============================================ */

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

/* ============================================
   DOM ELEMENT REFERENCES
   ============================================ */
const DOM = {
    // Navigation
    mainNav:            document.getElementById('mainNav'),
    navToggle:          document.getElementById('navToggle'),
    mobileMenu:         document.getElementById('mobileMenu'),
    mobileMenuClose:    document.getElementById('mobileMenuClose'),
    mobileMenuLinks:    document.querySelectorAll('.mobile-menu a'),

    // Hero
    celebrateBtn:       document.getElementById('celebrateBtn'),
    confettiCanvas:     document.getElementById('confettiCanvas'),
    scrollIndicator:    document.getElementById('scrollIndicator'),

    // Floating Hearts
    floatingHeartsContainer: document.getElementById('floatingHearts'),

    // Wishes Form
    wishesForm:         document.getElementById('wishesForm'),
    wishName:           document.getElementById('wishName'),
    wishMessage:        document.getElementById('wishMessage'),
    thankYouMessage:    document.getElementById('thankYouMessage'),
    sendAnotherBtn:     document.getElementById('sendAnotherBtn'),

    // Custom Alert
    customAlert:        document.getElementById('customAlert'),
    alertTitle:         document.getElementById('alertTitle'),
    alertMessage:       document.getElementById('alertMessage'),
    alertCloseBtn:      document.getElementById('alertCloseBtn'),

    // Celebration Overlay
    celebrationOverlay:   document.getElementById('celebrationOverlay'),
    closeCelebrationBtn:  document.getElementById('closeCelebrationBtn'),
    balloonCanvas:        document.getElementById('balloonCanvas'),

    // Back To Top
    backToTop:          document.getElementById('backToTop'),

    // Reveal elements
    revealElements:     document.querySelectorAll(
        '.letter-card, .memory-card, .celebration-wrapper, ' +
        '.wishes-form-wrapper, .carousel-container'
    ),

    // Carousel
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

/**
 * Pad a number with leading zero if needed
 * @param {number} num
 * @returns {string}
 */
const padNumber = (num) => String(num).padStart(2, '0');

/**
 * Show a custom alert modal
 * @param {string} title
 * @param {string} message
 */
const showAlert = (title, message) => {
    DOM.alertTitle.textContent   = title;
    DOM.alertMessage.textContent = message;
    DOM.customAlert.classList.add('active');
    document.body.style.overflow = 'hidden';
};

/**
 * Hide the custom alert modal
 */
const hideAlert = () => {
    DOM.customAlert.classList.remove('active');
    document.body.style.overflow = '';
};

/**
 * Generate a random number between min and max
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const randomBetween = (min, max) => Math.random() * (max - min) + min;

/**
 * Pick a random item from an array
 * @param {Array} arr
 * @returns {*}
 */
const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ============================================
   NAVIGATION
   ============================================ */
const Navigation = (() => {

    let mobileOverlay = null;

    /**
     * Create a mobile overlay element
     */
    const createOverlay = () => {
        mobileOverlay = document.createElement('div');
        mobileOverlay.classList.add('mobile-menu-overlay');
        document.body.appendChild(mobileOverlay);
        mobileOverlay.addEventListener('click', closeMobileMenu);
    };

    /**
     * Open the mobile menu
     */
    const openMobileMenu = () => {
        DOM.mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    /**
     * Close the mobile menu
     */
    const closeMobileMenu = () => {
        DOM.mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    /**
     * Handle scroll - add/remove scrolled class to nav
     */
    const handleScroll = () => {
        if (window.scrollY > 50) {
            DOM.mainNav.classList.add('scrolled');
        } else {
            DOM.mainNav.classList.remove('scrolled');
        }
    };

    /**
     * Initialize navigation
     */
    const init = () => {
        createOverlay();

        DOM.navToggle.addEventListener('click', openMobileMenu);
        DOM.mobileMenuClose.addEventListener('click', closeMobileMenu);

        // Close mobile menu when any link is clicked
        DOM.mobileMenuLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Nav links smooth scroll
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
        handleScroll(); // Run on init
    };

    return { init };

})();

/* ============================================
   FLOATING HEARTS BACKGROUND
   ============================================ */
const FloatingHearts = (() => {

    const heartSymbols = ['❤', '♥', '💕', '💗', '💖', '💓', '💞'];

    /**
     * Create a single floating heart element
     */
    const createHeart = () => {
        if (!DOM.floatingHeartsContainer) return;

        const heart      = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.textContent = randomFrom(heartSymbols);

        const size     = randomBetween(14, 30);
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

        // Remove and recreate heart after animation completes
        const totalTime = (duration + delay) * 1000;
        setTimeout(() => {
            heart.remove();
            createHeart();
        }, totalTime);
    };

    /**
     * Initialize floating hearts
     */
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

            // Reset if out of bounds or fully transparent
            if (this.y > this.canvasHeight + 50 || this.opacity <= 0) {
                this.reset();
            }
        }

        /**
         * Draw a heart shape on canvas
         * @param {CanvasRenderingContext2D} ctx
         */
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

        /**
         * Draw a circle shape on canvas
         * @param {CanvasRenderingContext2D} ctx
         */
        drawCircle(ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.restore();
        }

        /**
         * Draw a rectangle shape on canvas
         * @param {CanvasRenderingContext2D} ctx
         */
        drawRect(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fillRect(-this.size * 0.5, -this.size * 0.3, this.size, this.size * 0.6);
            ctx.restore();
        }

        /**
         * Draw the particle based on its shape
         * @param {CanvasRenderingContext2D} ctx
         */
        draw(ctx) {
            if (this.shape === 'heart')  { this.drawHeart(ctx); }
            if (this.shape === 'circle') { this.drawCircle(ctx); }
            if (this.shape === 'rect')   { this.drawRect(ctx); }
        }
    }

    /**
     * Resize the canvas to match the hero section
     */
    const resizeCanvas = () => {
        if (!DOM.confettiCanvas) return;
        const hero = document.getElementById('hero');
        DOM.confettiCanvas.width  = hero.offsetWidth;
        DOM.confettiCanvas.height = hero.offsetHeight;
    };

    /**
     * Main animation loop
     */
    const animate = () => {
        if (!isRunning) return;

        ctx.clearRect(0, 0, DOM.confettiCanvas.width, DOM.confettiCanvas.height);

        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });

        animFrame = requestAnimationFrame(animate);
    };

    /**
     * Stop and clean up confetti
     */
    const stop = () => {
        isRunning = false;
        cancelAnimationFrame(animFrame);
        if (ctx) {
            ctx.clearRect(0, 0, DOM.confettiCanvas.width, DOM.confettiCanvas.height);
        }
        particles = [];
    };

    /**
     * Start the confetti animation
     */
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

        // Auto stop after duration
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

        /**
         * Draw a heart-shaped balloon
         * @param {CanvasRenderingContext2D} ctx
         */
        draw(ctx) {
            const r = this.radius;

            ctx.save();
            ctx.globalAlpha = this.opacity;

            // Draw string
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

            // Draw heart balloon
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            ctx.moveTo(0, -r * 0.4);
            ctx.bezierCurveTo( r * 0.9, -r * 1.2,  r * 1.5,  r * 0.2,  0,  r * 0.9);
            ctx.bezierCurveTo(-r * 1.5,  r * 0.2, -r * 0.9, -r * 1.2,  0, -r * 0.4);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();

            // Shine effect
            ctx.beginPath();
            ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.25, r * 0.15, -0.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            ctx.fill();

            ctx.restore();
        }
    }

    /**
     * Resize the balloon canvas
     */
    const resizeCanvas = () => {
        if (!DOM.balloonCanvas) return;
        DOM.balloonCanvas.width  = window.innerWidth;
        DOM.balloonCanvas.height = window.innerHeight;
    };

    /**
     * Animation loop for balloons
     */
    const animate = () => {
        ctx.clearRect(0, 0, DOM.balloonCanvas.width, DOM.balloonCanvas.height);
        balloons.forEach(b => {
            b.update();
            b.draw(ctx);
        });
        animFrame = requestAnimationFrame(animate);
    };

    /**
     * Stop the balloon animation
     */
    const stop = () => {
        cancelAnimationFrame(animFrame);
        if (ctx) {
            ctx.clearRect(0, 0, DOM.balloonCanvas.width, DOM.balloonCanvas.height);
        }
        balloons = [];
    };

    /**
     * Start the balloon celebration
     */
    const start = () => {
        if (!DOM.balloonCanvas) return;
        resizeCanvas();
        ctx = DOM.balloonCanvas.getContext('2d');

        balloons = Array.from(
            { length: 30 },
            () => new Balloon(DOM.balloonCanvas.width, DOM.balloonCanvas.height)
        );

        // Stagger balloon starting positions
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

    /**
     * Show the celebration overlay with animations
     */
    const show = () => {
        DOM.celebrationOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        CelebrationAnimation.start();
        ConfettiAnimation.start();
    };

    /**
     * Hide the celebration overlay
     */
    const hide = () => {
        DOM.celebrationOverlay.classList.remove('active');
        document.body.style.overflow = '';
        CelebrationAnimation.stop();
    };

    /**
     * Initialize celebration events
     */
    const init = () => {
        if (DOM.celebrateBtn) {
            DOM.celebrateBtn.addEventListener('click', show);
        }

        if (DOM.closeCelebrationBtn) {
            DOM.closeCelebrationBtn.addEventListener('click', hide);
        }

        // Close on overlay background click
        DOM.celebrationOverlay.addEventListener('click', (e) => {
            if (e.target === DOM.celebrationOverlay) {
                hide();
            }
        });

        // Close on Escape key
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

    // Hardcoded wishes from family
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

    /**
     * Get initials from name for avatar
     * @param {string} name
     * @returns {string}
     */
    const getInitials = (name) => {
        const parts = name.split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    /**
     * Load wishes from localStorage
     */
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
        // If no stored wishes, use hardcoded ones
        wishes = HARDCODED_WISHES.map(w => ({ ...w }));
        saveWishes();
    };

    /**
     * Save wishes to localStorage
     */
    const saveWishes = () => {
        try {
            localStorage.setItem('cherryWishes', JSON.stringify(wishes));
        } catch (e) {
            // Storage unavailable (private browsing, etc.) — safe to ignore
        }
    };

    /**
     * Add a new wish
     * @param {string} name
     * @param {string} message
     */
    const addWish = (name, message) => {
        wishes.push({
            name: name.trim(),
            message: message.trim(),
            relation: 'Friend'
        });
        saveWishes();
        renderCarousel();
        // Go to the new slide
        goToSlide(wishes.length - 1);
    };

    /**
     * Create a slide element
     * @param {object} wish
     * @param {number} index
     * @returns {HTMLElement}
     */
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
            <p class="slide-message">"${escapeHtml(wish.message)}"</p>
            <div class="slide-hearts">
                <i class="fas fa-heart"></i>
                <i class="fas fa-heart"></i>
                <i class="fas fa-heart"></i>
            </div>
        `;

        return slide;
    };

    /**
     * Simple HTML escaping
     * @param {string} str
     * @returns {string}
     */
    const escapeHtml = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    /**
     * Render the carousel
     */
    const renderCarousel = () => {
        if (!DOM.carouselTrack) return;

        // Clear track
        DOM.carouselTrack.innerHTML = '';

        // Create slides
        wishes.forEach((wish, index) => {
            const slide = createSlide(wish, index);
            DOM.carouselTrack.appendChild(slide);
        });

        // Update dots
        renderDots();

        // Update counter
        if (DOM.totalSlidesSpan) {
            DOM.totalSlidesSpan.textContent = wishes.length;
        }

        // Go to current slide
        goToSlide(currentIndex);
    };

    /**
     * Render dots
     */
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

    /**
     * Go to a specific slide
     * @param {number} index
     */
    const goToSlide = (index) => {
        if (wishes.length === 0) return;

        // Wrap around
        if (index < 0) index = wishes.length - 1;
        if (index >= wishes.length) index = 0;

        currentIndex = index;

        // Move track
        if (DOM.carouselTrack) {
            DOM.carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        // Update dots
        const dots = DOM.carouselDots.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        // Update counter
        if (DOM.currentSlideSpan) {
            DOM.currentSlideSpan.textContent = currentIndex + 1;
        }
    };

    /**
     * Go to next slide
     */
    const nextSlide = () => {
        goToSlide(currentIndex + 1);
    };

    /**
     * Go to previous slide
     */
    const prevSlide = () => {
        goToSlide(currentIndex - 1);
    };

    /**
     * Start auto-play
     */
    const startAutoPlay = () => {
        if (wishes.length <= 1) return;
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
        autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
    };

    /**
     * Reset auto-play
     */
    const resetAutoPlay = () => {
        startAutoPlay();
    };

    /**
     * Pause auto-play
     */
    const pauseAutoPlay = () => {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    };

    /**
     * Initialize the carousel
     */
    const init = () => {
        loadWishes();
        renderCarousel();

        // Event listeners
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

        // Pause on hover
        const container = document.getElementById('wishCarousel');
        if (container) {
            container.addEventListener('mouseenter', pauseAutoPlay);
            container.addEventListener('mouseleave', startAutoPlay);
            // Touch support
            container.addEventListener('touchstart', pauseAutoPlay, { passive: true });
            container.addEventListener('touchend', startAutoPlay, { passive: true });
        }

        // Keyboard navigation
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

    /**
     * Add a new wish from form
     * @param {string} name
     * @param {string} message
     */
    const addWishFromForm = (name, message) => {
        addWish(name, message);
    };

    return { init, addWishFromForm };

})();

/* ============================================
   WISHES FORM
   ============================================ */
const WishesForm = (() => {

    /**
     * Handle form submission
     * @param {Event} e
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        const name    = DOM.wishName.value.trim();
        const message = DOM.wishMessage.value.trim();

        if (!name || !message) {
            showAlert(
                'Oops! 💕',
                'Please fill in your name and a love note for Cherry Ann!'
            );
            return;
        }

        // Add wish to carousel
        WishCarousel.addWishFromForm(name, message);

        // Show thank you overlay within the form
        DOM.thankYouMessage.classList.add('active');

        // Also show the sweet alert
        setTimeout(() => {
            showAlert(
                'Love Sent! 💌',
                `Thank you, ${name}! Your love note has been sent! ` +
                `Cherry Ann's heart is full. 💕`
            );
        }, 500);

        // Reset the form
        DOM.wishesForm.reset();
    };

    /**
     * Handle "Send Another" button click
     */
    const handleSendAnother = () => {
        DOM.thankYouMessage.classList.remove('active');
    };

    /**
     * Initialize the form
     */
    const init = () => {
        if (DOM.wishesForm) {
            DOM.wishesForm.addEventListener('submit', handleSubmit);
        }

        if (DOM.sendAnotherBtn) {
            DOM.sendAnotherBtn.addEventListener('click', handleSendAnother);
        }

        // Alert close button
        if (DOM.alertCloseBtn) {
            DOM.alertCloseBtn.addEventListener('click', hideAlert);
        }

        // Close alert on background click
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

    /**
     * Handle scroll visibility
     */
    const handleScroll = () => {
        if (window.scrollY > CONFIG.scrollThreshold) {
            DOM.backToTop.classList.add('visible');
        } else {
            DOM.backToTop.classList.remove('visible');
        }
    };

    /**
     * Scroll back to top
     */
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    /**
     * Initialize back to top
     */
    const init = () => {
        if (!DOM.backToTop) return;

        DOM.backToTop.addEventListener('click', scrollToTop);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Run on init
    };

    return { init };

})();

/* ============================================
   SCROLL REVEAL ANIMATION
   ============================================ */
const ScrollReveal = (() => {

    /**
     * Add reveal class to all target elements
     */
    const prepareElements = () => {
        DOM.revealElements.forEach((el) => {
            el.classList.add('reveal');
        });

        // Also add to section headers and other elements
        document.querySelectorAll(
            '.section-header, .letter-card, .memory-card, ' +
            '.celebration-container, .wish-card, .wishes-form'
        ).forEach(el => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
            }
        });
    };

    /**
     * Check which elements are in viewport and reveal them
     */
    const checkReveal = () => {
        const elements = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;

        elements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < windowHeight - CONFIG.revealOffset;

            if (isVisible && !el.classList.contains('revealed')) {
                // Stagger animation for grid items
                const delay = el.closest('.memories-grid, .carousel-track')
                    ? index * 100
                    : 0;

                setTimeout(() => {
                    el.classList.add('revealed');
                }, delay);
            }
        });
    };

    /**
     * Initialize scroll reveal with IntersectionObserver if supported
     */
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
            // Fallback for older browsers
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

    /**
     * Handle mouse move for tilt effect
     * @param {MouseEvent} e
     */
    const handleMouseMove = (e) => {
        if (!heroContent) return;

        const hero = document.getElementById('hero');
        const rect = hero.getBoundingClientRect();

        // Only apply when hero is in view
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

    /**
     * Reset hero content tilt when mouse leaves
     */
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

    /**
     * Initialize parallax effect
     * (Skip on touch devices)
     */
    const init = () => {
        if (window.matchMedia('(hover: hover)').matches) {
            document.addEventListener('mousemove', handleMouseMove, { passive: true });
            document.addEventListener('mouseleave', handleMouseLeave);
        }
    };

    return { init };

})();

/* ============================================
   MEMORY CARDS INTERACTION
   ============================================ */
const MemoryCards = (() => {

    /**
     * Add touch support for hover effect on mobile
     */
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

    /**
     * Add click sparkle effect on memory cards
     */
    const initClickEffect = () => {
        const cards = document.querySelectorAll('.memory-card');

        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                createSparkle(e.clientX, e.clientY);
            });
        });
    };

    /**
     * Create a sparkle effect at a given position
     * @param {number} x
     * @param {number} y
     */
    const createSparkle = (x, y) => {
        const hearts = ['💕', '💗', '💖', '❤', '💓'];

        for (let i = 0; i < 6; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = randomFrom(hearts);
            sparkle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                font-size: ${randomBetween(16, 28)}px;
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
            `;

            document.body.appendChild(sparkle);

            // Animate in random direction
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

    /**
     * Initialize memory card interactions
     */
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

    /**
     * Hide scroll indicator after user scrolls
     */
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
            // Recalculate balloon canvas size if celebration is open
            if (DOM.celebrationOverlay.classList.contains('active')) {
                if (DOM.balloonCanvas) {
                    DOM.balloonCanvas.width  = window.innerWidth;
                    DOM.balloonCanvas.height = window.innerHeight;
                }
            }

            // Recalculate confetti canvas
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
    const hearts = ['💕', '💗', '💖', '❤️', '✨'];

    const createCursorSparkle = (x, y) => {
        const now = Date.now();
        if (now - lastSparkleTime < 120) return; // Throttle
        lastSparkleTime = now;

        const el = document.createElement('span');
        el.textContent = randomFrom(hearts);
        el.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
            font-size: ${randomBetween(12, 20)}px;
            transform: translate(-50%, -50%);
            user-select: none;
        `;

        document.body.appendChild(el);

        el.animate([
            {
                opacity: 1,
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

    /**
     * Initialize cursor sparkle on desktop only
     */
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

    /**
     * Create a loading screen
     */
    const createLoader = () => {
        const loader = document.createElement('div');
        loader.id = 'pageLoader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-heart">💖</div>
                <p class="loader-text">Preparing something special...</p>
                <p class="loader-name">For Cherry Ann 🎂</p>
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

        const style = document.createElement('style');
        style.textContent = `
            .loader-content {
                text-align: center;
                color: white;
            }
            .loader-heart {
                font-size: 4rem;
                animation: loaderPulse 1s ease-in-out infinite;
                display: block;
                margin-bottom: 20px;
            }
            .loader-text {
                font-family: 'Poppins', sans-serif;
                font-size: 1rem;
                color: #FFB6C1;
                margin-bottom: 8px;
            }
            .loader-name {
                font-family: 'Dancing Script', cursive;
                font-size: 2rem;
                color: #FFD700;
            }
            @keyframes loaderPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.3); }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(loader);
        document.body.style.overflow = 'hidden';

        return loader;
    };

    /**
     * Initialize page load animation
     */
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
            link.classList.remove('active-nav');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active-nav');
            }
        });
    };

    const init = () => {
        window.addEventListener('scroll', update, { passive: true });

        // Add active nav style dynamically
        const style = document.createElement('style');
        style.textContent = `
            .nav-links a.active-nav {
                color: var(--deep-rose) !important;
            }
            .nav-links a.active-nav::after {
                width: 100% !important;
            }
        `;
        document.head.appendChild(style);
    };

    return { init };

})();

/* ============================================
   TOUCH HOVER STYLE FOR MEMORY CARDS
   ============================================ */
const TouchHoverStyle = (() => {
    const init = () => {
        const style = document.createElement('style');
        style.textContent = `
            .memory-card.touch-hover .memory-card-overlay {
                opacity: 1;
            }
            .memory-card.touch-hover .memory-card-overlay i {
                transform: scale(1);
            }
            .memory-card.touch-hover {
                transform: translateY(-8px) scale(1.02);
            }
        `;
        document.head.appendChild(style);
    };
    return { init };
})();

/* ============================================
   MAIN INITIALIZER
   ============================================ */
const App = (() => {

    /**
     * Initialize all modules
     */
    const init = () => {
        // Page loader first
        PageLoad.init();

        // Core functionality
        Navigation.init();
        FloatingHearts.init();
        BackToTop.init();
        ScrollReveal.init();
        ScrollIndicator.init();
        Celebration.init();
        WishesForm.init();
        WishCarousel.init();

        // Interactions
        MemoryCards.init();
        ParallaxEffect.init();
        SparkleCursor.init();
        ActiveNavLink.init();

        // Style helpers
        TouchHoverStyle.init();

        // Window resize
        ResizeHandler.init();

        console.log(
            '%c💕 Happy Birthday, Cherry Ann! 💕',
            'color: #E75480; font-size: 20px; font-weight: bold; ' +
            'font-family: Georgia, serif; padding: 8px;'
        );
        console.log(
            '%cMade with infinite love by Hanz Dee Dalmino ❤️',
            'color: #FFD700; font-size: 14px; font-family: Georgia, serif;'
        );
    };

    return { init };

})();

/* ============================================
   START THE APP
   ============================================ */
document.addEventListener('DOMContentLoaded', App.init);
