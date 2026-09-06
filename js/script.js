document.addEventListener('DOMContentLoaded', () => {

    // ===== Scroll Reveal =====
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('revealed');

            // Stagger children
            const items = entry.target.querySelectorAll('.stagger');
            items.forEach((item, i) => {
                item.style.transitionDelay = `${i * 0.1}s`;
                requestAnimationFrame(() => {
                    item.classList.add('revealed');
                });
            });

            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    reveals.forEach(el => observer.observe(el));

    // ===== Cursor Spotlight =====
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        // Desktop: follow mouse, fade out when idle
        let ticking = false;
        let idleTimer = null;

        // Start hidden
        document.body.style.setProperty('--glow-opacity', '0');

        const showGlow = () => {
            document.body.style.setProperty('--glow-opacity', '1');
        };

        const hideGlow = () => {
            document.body.style.setProperty('--glow-opacity', '0');
        };

        const resetIdleTimer = () => {
            if (idleTimer) clearTimeout(idleTimer);
            showGlow();
            idleTimer = setTimeout(hideGlow, 2000);
        };

        document.addEventListener('mousemove', (e) => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                document.body.style.setProperty('--mouse-x', e.clientX + 'px');
                document.body.style.setProperty('--mouse-y', e.clientY + 'px');
                ticking = false;
            });
            resetIdleTimer();
        });

        document.addEventListener('mouseleave', () => {
            if (idleTimer) clearTimeout(idleTimer);
            hideGlow();
            // Move off-screen after fade
            setTimeout(() => {
                document.body.style.setProperty('--mouse-x', '-1000px');
                document.body.style.setProperty('--mouse-y', '-1000px');
            }, 800);
        });

        document.addEventListener('mouseenter', (e) => {
            document.body.style.setProperty('--mouse-x', e.clientX + 'px');
            document.body.style.setProperty('--mouse-y', e.clientY + 'px');
            showGlow();
            resetIdleTimer();
        });
    } else {
        // Mobile: show on touch, smooth fade out after release
        let fadeTimer = null;

        // Start hidden on mobile
        document.body.style.setProperty('--glow-opacity', '0');
        document.body.style.setProperty('--mouse-x', '-1000px');
        document.body.style.setProperty('--mouse-y', '-1000px');

        document.addEventListener('touchstart', (e) => {
            if (fadeTimer) {
                clearTimeout(fadeTimer);
                fadeTimer = null;
            }

            const touch = e.touches[0];
            // Set position first, then fade in
            document.body.style.setProperty('--mouse-x', touch.clientX + 'px');
            document.body.style.setProperty('--mouse-y', touch.clientY + 'px');
            // Small delay so position is set before opacity transition starts
            requestAnimationFrame(() => {
                document.body.style.setProperty('--glow-opacity', '1');
            });
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            requestAnimationFrame(() => {
                document.body.style.setProperty('--mouse-x', touch.clientX + 'px');
                document.body.style.setProperty('--mouse-y', touch.clientY + 'px');
            });
        }, { passive: true });

        document.addEventListener('touchend', () => {
            // Fade out smoothly after a pause
            fadeTimer = setTimeout(() => {
                document.body.style.setProperty('--glow-opacity', '0');
                // Move off-screen only after CSS transition finishes
                fadeTimer = setTimeout(() => {
                    document.body.style.setProperty('--mouse-x', '-1000px');
                    document.body.style.setProperty('--mouse-y', '-1000px');
                }, 1000);
            }, 800);
        }, { passive: true });
    }

    // ===== Mobile Burger Menu =====
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // ===== Smooth Scroll for Nav Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});