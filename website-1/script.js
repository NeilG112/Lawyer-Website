/* ========================================
   W O R L | Anwälte — Site Behaviors
   ======================================== */

(function () {
    'use strict';

    // -------- Header scroll effect --------
    const header = document.getElementById('header');
    let lastScroll = 0;

    function onScroll() {
        const y = window.scrollY;
        if (y > 30) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
        lastScroll = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // -------- Mobile nav --------
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');

    function closeNav() {
        nav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', function () {
        const isOpen = nav.classList.toggle('is-open');
        navToggle.classList.toggle('is-open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', closeNav);
    });

    // Close on escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
    });

    // -------- Smooth scroll with header offset --------
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;
            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const headerHeight = header.offsetHeight;
            const y = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
            window.scrollTo({ top: y, behavior: 'smooth' });
        });
    });

    // -------- Reveal on scroll --------
    const revealEls = document.querySelectorAll(
        '.section-header, .about-text, .about-image, .service-card, .team-card, .contact-info, .contact-form, .footer-brand, .footer-cols'
    );
    revealEls.forEach(function (el) { el.classList.add('reveal'); });

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    // -------- Contact form --------
    const form = document.getElementById('contact-form');
    const successBox = document.getElementById('form-success');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();

            if (!name || !email || !message) {
                alert('Bitte füllen Sie alle Pflichtfelder aus.');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                return;
            }

            // Compose a mailto fallback so the request actually reaches the firm
            const subject = form.subject.value.trim() || 'Anfrage über die Website';
            const phone = form.phone.value.trim();
            const body = [
                'Name: ' + name,
                'E-Mail: ' + email,
                phone ? 'Telefon: ' + phone : null,
                '',
                'Nachricht:',
                message
            ].filter(Boolean).join('\n');

            const mailto = 'mailto:kanzlei@worl-anwaelte.de'
                + '?subject=' + encodeURIComponent(subject)
                + '&body=' + encodeURIComponent(body);

            if (successBox) {
                successBox.hidden = false;
                successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            form.reset();

            // Trigger mail client
            setTimeout(function () { window.location.href = mailto; }, 250);
        });
    }

    // -------- Dynamic year --------
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
