
document.addEventListener('DOMContentLoaded', () => {

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('js-reveal-fade');
        observer.observe(section);
    });

    const contentBlocks = document.querySelectorAll('._5yhCRQ, .gKovOQ, .zFkK8A');
    contentBlocks.forEach(block => {
        block.classList.add('js-reveal-slide-up');
        observer.observe(block);
    });

    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src') || '';
        const mustFloat = src.includes('car') ||
            src.includes('cash') ||
            src.includes('img_14') ||
            src.includes('img_15');
        if (mustFloat) {
            img.classList.add('js-anim-float');
        } else if (!src.includes('cesped')) {
            img.classList.add('js-reveal-zoom');
        }
        observer.observe(img);
    });

    const grassImages = document.querySelectorAll('img[src*="cesped"]');
    const swayClasses = ['js-grass-sway', 'js-grass-sway-slow', 'js-grass-sway-strong'];

    grassImages.forEach((grass, i) => {
        const variant = swayClasses[i % swayClasses.length];
        grass.classList.add(variant);
        const delay = (Math.random() * 2).toFixed(2);
        const durationOffset = (2.5 + Math.random() * 3).toFixed(2);
        grass.style.animationDelay = delay + 's';
        grass.style.animationDuration = durationOffset + 's';
    });

    const canvas = document.createElement('canvas');
    canvas.id = 'bear-particles';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let W, H;

    function resizeCanvas() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const PARTICLE_COUNT = 50;
    const particles = [];

    class Particle {
        constructor() { this.reset(); }

        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.radius = Math.random() * 2.5 + 0.8;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = -Math.random() * 0.3 - 0.1;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.opacityDirection = Math.random() > 0.5 ? 1 : -1;
            this.opacitySpeed = Math.random() * 0.008 + 0.003;
            this.sinOffset = Math.random() * Math.PI * 2;
            this.sinSpeed = Math.random() * 0.02 + 0.01;
            const colors = [
                '255, 223, 120',
                '255, 245, 200',
                '200, 230, 255',
                '255, 200, 150',
                '180, 220, 255',
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update(time) {
            this.x += this.speedX + Math.sin(time * this.sinSpeed + this.sinOffset) * 0.3;
            this.y += this.speedY;
            this.opacity += this.opacityDirection * this.opacitySpeed;
            if (this.opacity >= 0.8) { this.opacity = 0.8; this.opacityDirection = -1; }
            if (this.opacity <= 0.05) { this.opacity = 0.05; this.opacityDirection = 1; }
            if (this.y < -10) { this.y = H + 10; this.x = Math.random() * W; }
            if (this.x < -20) this.x = W + 20;
            if (this.x > W + 20) this.x = -20;
        }

        draw() {
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 4);
            gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
            gradient.addColorStop(0.4, `rgba(${this.color}, ${this.opacity * 0.4})`);
            gradient.addColorStop(1, `rgba(${this.color}, 0)`);
            ctx.fillStyle = gradient;
            ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    let animTime = 0;
    function animateParticles() {
        ctx.clearRect(0, 0, W, H);
        animTime++;
        particles.forEach(p => { p.update(animTime); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    const vignette = document.createElement('div');
    vignette.id = 'bear-vignette';
    document.body.appendChild(vignette);
    setTimeout(() => vignette.classList.add('active'), 500);

    const heroBg = document.getElementById('LBgkHTXL2NXQjMqP');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (heroBg) {
        if (isTouchDevice) {
            heroBg.classList.add('js-camera-breathe');
        } else {
            heroBg.classList.add('js-parallax-layer');
            document.addEventListener('mousemove', (e) => {
                const mx = (e.clientX / window.innerWidth - 0.5) * 2;
                const my = (e.clientY / window.innerHeight - 0.5) * 2;
                const tx = -mx * 8;
                const ty = -my * 5;
                heroBg.style.transform = `translate(${tx}px, ${ty - 151.52}px) scale(1.01)`;
            });
        }
    }

    const sectionBgs = document.querySelectorAll('.rGeu6w');
    function handleScrollParallax() {
        sectionBgs.forEach((section, i) => {
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            const offset = (sectionCenter - viewportCenter) * 0.02;
            const bgImg = section.querySelector('._0xkaeQ');
            if (bgImg && i > 0) {
                bgImg.style.transform = bgImg.style.transform
                    ? bgImg.style.transform.replace(/translateY\([^)]*\)/, `translateY(${offset}px)`)
                    : `translateY(${offset}px)`;
            }
        });
    }

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => { handleScrollParallax(); scrollTicking = false; });
            scrollTicking = true;
        }
    });

    const buttonLinks = document.querySelectorAll('a.a_GcMg');
    let btnCount = 0;

    buttonLinks.forEach(link => {
        const textBlock = link.closest('._0xkaeQ');
        if (!textBlock) return;

        const parentGroup = textBlock.parentElement;
        if (!parentGroup) return;


        const shape = parentGroup.querySelector('.m1aeoQ');
        if (!shape) return;

        btnCount++;

        link.addEventListener('mouseenter', () => {
            shape.classList.add('js-btn-hover');
        });
        link.addEventListener('mouseleave', () => {
            shape.classList.remove('js-btn-hover');
            shape.classList.remove('js-btn-active');
        });

        link.addEventListener('mousedown', () => {
            shape.classList.add('js-btn-active');
        });
        link.addEventListener('mouseup', () => {
            shape.classList.remove('js-btn-active');
        });
    });

    const sectionEls = document.querySelectorAll('section.rGeu6w');
    sectionEls.forEach((sec, i) => {
        if (i < sectionEls.length - 1) {
            sec.classList.add('js-gradient-separator');
        }
    });

    if (!isTouchDevice) {
        const trailCanvas = document.createElement('canvas');
        trailCanvas.id = 'bear-cursor-trail';
        document.body.appendChild(trailCanvas);

        const tCtx = trailCanvas.getContext('2d');
        let tW, tH;

        function resizeTrail() {
            tW = trailCanvas.width = window.innerWidth;
            tH = trailCanvas.height = window.innerHeight;
        }
        resizeTrail();
        window.addEventListener('resize', resizeTrail);

        const trail = [];
        const TRAIL_LENGTH = 18;

        document.addEventListener('mousemove', (e) => {
            trail.push({
                x: e.clientX,
                y: e.clientY,
                alpha: 1,
                radius: 2.5 + Math.random() * 2
            });
            if (trail.length > TRAIL_LENGTH) trail.shift();
        });

        function animateTrail() {
            tCtx.clearRect(0, 0, tW, tH);

            trail.forEach((dot) => {
                dot.alpha -= 0.045;
                if (dot.alpha <= 0) return;

                tCtx.beginPath();
                const grad = tCtx.createRadialGradient(
                    dot.x, dot.y, 0,
                    dot.x, dot.y, dot.radius * 3
                );
                grad.addColorStop(0, `rgba(66, 153, 225, ${dot.alpha * 0.8})`);
                grad.addColorStop(0.4, `rgba(99, 179, 237, ${dot.alpha * 0.4})`);
                grad.addColorStop(1, `rgba(66, 153, 225, 0)`);
                tCtx.fillStyle = grad;
                tCtx.arc(dot.x, dot.y, dot.radius * 3, 0, Math.PI * 2);
                tCtx.fill();
            });

            while (trail.length > 0 && trail[0].alpha <= 0) trail.shift();
            requestAnimationFrame(animateTrail);
        }
        animateTrail();
    }

    const progressBar = document.createElement('div');
    progressBar.id = 'bear-scroll-progress';
    document.body.appendChild(progressBar);

    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'bear-back-to-top';
    backToTopBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 4l8 8h-6v8h-4v-8H4l8-8z"/></svg>';
    document.body.appendChild(backToTopBtn);

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const bodyEl = document.body;

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                handleScrollParallax();

                const scrollable = document.documentElement.scrollHeight - window.innerHeight;
                const scrolled = window.scrollY;
                const progress = Math.min((scrolled / scrollable) * 100, 100);
                progressBar.style.width = scrollable > 0 ? progress + '%' : '0%';

                if (scrolled > 600) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }

                const hueShift = (progress / 100) * 35;

                const allBgs = document.querySelectorAll('.bFnJ2A');
                allBgs.forEach(bg => {
                    if (!bg.closest('.m1aeoQ')) {
                        bg.style.filter = `hue-rotate(${hueShift}deg)`;
                    }
                });

                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    const tiltImages = document.querySelectorAll('img:not([src*="cesped"]):not([src*="img_12"])');
    tiltImages.forEach(img => {
        img.classList.add('js-tilt-3d');

        img.addEventListener('mousemove', (e) => {
            if (isTouchDevice) return;
            const rect = img.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            img.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        img.addEventListener('mouseleave', () => {
            img.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    const parentSections = document.querySelectorAll('section.rGeu6w');
    parentSections.forEach(section => {
        const childrenToReveal = section.querySelectorAll('._5yhCRQ, .gKovOQ, .zFkK8A');
        childrenToReveal.forEach((child, index) => {
            child.classList.add('js-stagger-child');
            child.style.transitionDelay = `${index * 0.15}s`;
            observer.observe(child);
        });
    });

    const easterEggLogo = document.querySelector('img[src*="img_12.png"]');
    if (easterEggLogo) {
        easterEggLogo.addEventListener('click', () => {
            easterEggLogo.classList.remove('js-logo-easter-egg');
            void easterEggLogo.offsetWidth;
            easterEggLogo.classList.add('js-logo-easter-egg');

            if (window.particles) {
                const rect = easterEggLogo.getBoundingClientRect();
                for (let i = 0; i < 15; i++) {
                    const p = new Particle();
                    p.x = rect.left + rect.width / 2;
                    p.y = rect.top + rect.height / 2;
                    p.speedX = (Math.random() - 0.5) * 8;
                    p.speedY = (Math.random() - 0.5) * 8;
                    particles.push(p);
                }
            }
        });
    }


    function applySmartScaling() {
        const targetWidth = 1905;
        const scaleWidth = window.innerWidth;
        const wrapper = document.querySelector('.yIDCqA') || document.body;

        if (scaleWidth < targetWidth) {
            const zoomLevel = scaleWidth / targetWidth;
            wrapper.style.zoom = zoomLevel;
            document.documentElement.style.overflowX = 'hidden';
        } else {
            wrapper.style.zoom = 1;
            document.documentElement.style.overflowX = 'hidden';
        }
    }

    applySmartScaling();
    window.addEventListener('resize', applySmartScaling);

    console.log(`🐻 Bear Effects v5.1 Restored Loaded:
  • ${grassImages.length} grass elements swaying
  • ${PARTICLE_COUNT} particles active
  • Cursor trail: active
  • Observers: complete`);
});
