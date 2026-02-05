function initAnimations() {
    if (typeof gsap === 'undefined') {
        setTimeout(initAnimations, 100);
        return;
    }

    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    function initKonamiCode() {
        const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'l', 'i', 'n', 'o'];
        let codeIndex = 0;

        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === secretCode[codeIndex].toLowerCase()) {
                codeIndex++;
                if (codeIndex === secretCode.length) {
                    activateSecretMode();
                    codeIndex = 0;
                }
            } else {
                codeIndex = 0;
            }
        });

        function activateSecretMode() {
            
            if (document.body.classList.contains('konami-active')) return;

            const overlay = document.createElement('div');
            overlay.className = 'konami-overlay';
            overlay.innerHTML = `
                <div class="konami-toast">
                    <h3>YOU ARE A HACKER</h3>
                    <p>How did you find this?</p>
                    <button class="btn-dismiss">back</button>
                </div>
            `;
            document.body.appendChild(overlay);

            document.body.classList.add('konami-active');

            setTimeout(() => overlay.classList.add('show'), 50);

            createConfetti();

            const dismissBtn = overlay.querySelector('.btn-dismiss');
            dismissBtn.addEventListener('click', () => {
                overlay.classList.remove('show');
                document.body.classList.remove('konami-active');
                setTimeout(() => overlay.remove(), 300);
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('show');
                    document.body.classList.remove('konami-active');
                    setTimeout(() => overlay.remove(), 300);
                }
            });
        }

        function createConfetti() {
            const colors = ['#0066FF', '#00AAFF', '#FF0066', '#FFAA00', '#00FF66'];
            for (let i = 0; i < 100; i++) {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: ${Math.random() * 10 + 5}px;
                    height: ${Math.random() * 10 + 5}px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: 50%;
                    left: 50%;
                    pointer-events: none;
                    z-index: 10002;
                    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                `;
                document.body.appendChild(confetti);

                gsap.to(confetti, {
                    x: (Math.random() - 0.5) * window.innerWidth,
                    y: (Math.random() - 0.5) * window.innerHeight + 200,
                    rotation: Math.random() * 720,
                    opacity: 0,
                    duration: 2 + Math.random(),
                    ease: 'power2.out',
                    onComplete: () => confetti.remove()
                });
            }
        }
    }

    function initHeroNameScramble() {
        const heroName = document.querySelector('.hero-name');
        if (!heroName) return;

        const originalText = heroName.getAttribute('data-text') || heroName.textContent;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let interval;

        function runScramble() {
            let iteration = 0;
            clearInterval(interval);

            interval = setInterval(() => {
                heroName.textContent = originalText
                    .split('')
                    .map((letter, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        if (letter === ' ') return ' ';
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iteration >= originalText.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 40);
        }

        heroName.addEventListener('mouseenter', runScramble);

        setTimeout(runScramble, 1300);
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        const themeToggle = document.getElementById('themeToggle');
        const themeToggleMobile = document.getElementById('themeToggleMobile');

        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        }

        if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
        if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);
    }

    function initPreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                initHeroAnimations();
            }, 1200); 
        });

        if (document.readyState === 'complete') {
            setTimeout(() => {
                preloader.classList.add('hidden');
                initHeroAnimations();
            }, 1200);
        }
    }

    function initScrollProgress() {
        const progressBar = document.getElementById('scrollProgress');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = progress + '%';
        });
    }

    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function initHeaderScroll() {
        const header = document.getElementById('siteHeader');
        if (!header) return;

        let lastScrollY = 0;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.scrollY;

            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            if (scrollY > 300) {
                if (scrollY > lastScrollY && scrollY - lastScrollY > 10) {
                    header.classList.add('hidden');
                } else if (scrollY < lastScrollY && lastScrollY - scrollY > 10) {
                    header.classList.remove('hidden');
                }
            } else {
                header.classList.remove('hidden');
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    function initTiltCards() {
        if (window.innerWidth <= 768) return;

        const cards = document.querySelectorAll('.tilt-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 15; 
                const rotateY = (centerX - x) / 15;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    function initHeroAnimations() {
        const tl = gsap.timeline();

        const headerHome = document.querySelector('.header-home');
        const headerActions = document.querySelector('.header-actions');
        if (headerHome) {
            tl.from(headerHome, {
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out'
            });
        }
        if (headerActions) {
            tl.from(headerActions, {
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, '<');
        }

        const heroName = document.querySelector('.hero-name');
        if (heroName) {
            tl.from(heroName, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.3');
        }

        const heroNavLinks = document.querySelectorAll('.hero-nav-link');
        if (heroNavLinks.length > 0) {
            tl.from(heroNavLinks, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power3.out'
            }, '-=0.4');
        }

        const storySection = document.querySelector('.story-section');
        if (storySection) {
            tl.from(storySection.querySelector('h1'), {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.3');

            tl.from(storySection.querySelectorAll('p'), {
                opacity: 0,
                y: 20,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out'
            }, '-=0.5');

            const ctaGroup = storySection.querySelector('.cta-group');
            if (ctaGroup) {
                tl.from(ctaGroup, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5,
                    ease: 'power3.out'
                }, '-=0.3');
            }
        }

        const portfolioSection = document.querySelector('.portfolio-section');
        if (portfolioSection) {
            const sectionHeader = portfolioSection.querySelector('.section-header');
            if (sectionHeader) {
                tl.from(sectionHeader, {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    ease: 'power3.out'
                }, '-=0.3');
            }
        }
    }

    function initScrollAnimations() {
        
        gsap.utils.toArray('.project-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                },
                y: 40,
                opacity: 0,
                duration: 0.7,
                ease: 'power3.out',
                delay: i * 0.08
            });
        });

        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 90%'
                },
                y: 25,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        gsap.utils.toArray('.contact-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%'
                },
                y: 30,
                opacity: 0,
                duration: 0.5,
                ease: 'power3.out',
                delay: i * 0.08
            });
        });

        gsap.utils.toArray('.skill-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 92%'
                },
                y: 25,
                opacity: 0,
                scale: 0.95,
                duration: 0.5,
                ease: 'power2.out',
                delay: i * 0.04
            });
        });

        const footer = document.querySelector('.site-footer');
        if (footer) {
            gsap.from(footer.querySelector('.footer-content'), {
                scrollTrigger: {
                    trigger: footer,
                    start: 'top 95%'
                },
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out'
            });
        }
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    function initPageTransitions() {
        
        if (!document.querySelector('.page-transition')) {
            const transitionEl = document.createElement('div');
            transitionEl.className = 'page-transition';
            document.body.appendChild(transitionEl);
        }

        const transition = document.querySelector('.page-transition');
        const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"])');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('javascript:')) {
                    e.preventDefault();

                    gsap.to(transition, {
                        scaleY: 1,
                        transformOrigin: 'bottom',
                        duration: 0.4,
                        ease: 'power3.inOut',
                        onComplete: () => {
                            window.location.href = href;
                        }
                    });
                }
            });
        });

        window.addEventListener('pageshow', () => {
            gsap.to(transition, {
                scaleY: 0,
                transformOrigin: 'top',
                duration: 0.4,
                ease: 'power3.inOut',
                delay: 0.05
            });
        });
    }

    function init() {
        
        initTheme();
        initPreloader();
        initScrollProgress();
        initBackToTop();
        initHeaderScroll();
        initTiltCards();
        initScrollAnimations();
        initSmoothScroll();
        initPageTransitions();

        initHeroNameScramble();
        initKonamiCode();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

initAnimations();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered:', registration.scope);
            })
            .catch((error) => {
                console.log('SW registration failed:', error);
            });
    });
}
