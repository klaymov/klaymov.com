document.addEventListener('DOMContentLoaded', () => {

    // ===== Theme Toggle =====
    const toggle = document.querySelector('.theme-toggle');

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

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
                // Trigger on next frame so delay applies
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
});