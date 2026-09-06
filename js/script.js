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

    // ===== Cursor Spotlight (Desktop) =====
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        // Desktop: follow mouse
        let ticking = false;
        document.addEventListener('mousemove', (e) => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                document.body.style.setProperty('--mouse-x', e.clientX + 'px');
                document.body.style.setProperty('--mouse-y', e.clientY + 'px');
                ticking = false;
            });
        });

        document.addEventListener('mouseleave', () => {
            document.body.style.setProperty('--mouse-x', '-1000px');
            document.body.style.setProperty('--mouse-y', '-1000px');
        });
    } else {
        // Mobile: show on touch, fade out after release
        let fadeTimer = null;

        // Start hidden on mobile
        document.body.style.setProperty('--glow-opacity', '0');

        document.addEventListener('touchstart', (e) => {
            if (fadeTimer) {
                clearTimeout(fadeTimer);
                fadeTimer = null;
            }

            const touch = e.touches[0];
            document.body.style.setProperty('--mouse-x', touch.clientX + 'px');
            document.body.style.setProperty('--mouse-y', touch.clientY + 'px');
            document.body.style.setProperty('--glow-opacity', '1');
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            requestAnimationFrame(() => {
                document.body.style.setProperty('--mouse-x', touch.clientX + 'px');
                document.body.style.setProperty('--mouse-y', touch.clientY + 'px');
            });
        }, { passive: true });

        document.addEventListener('touchend', () => {
            // Wait a bit, then fade out
            fadeTimer = setTimeout(() => {
                document.body.style.setProperty('--glow-opacity', '0');
                // After fade completes, move off-screen
                setTimeout(() => {
                    document.body.style.setProperty('--mouse-x', '-1000px');
                    document.body.style.setProperty('--mouse-y', '-1000px');
                }, 800);
            }, 600);
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
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
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