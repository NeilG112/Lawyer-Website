// ===================================
// W O R L | Anwälte — Interactions
// ===================================

// Nav scroll effect
const nav = document.getElementById('nav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    lastScroll = y;
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
}

// Reveal-on-scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    const targets = document.querySelectorAll(
        '.pillar, .lawyer, .service, .banner-content, .section-header, .lead, .quote, .contact-info, .contact-form'
    );
    targets.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
});

// Smooth anchor offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1) {
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - 56;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    });
});

// Parallax for hero background (subtle)
const heroBgImg = document.querySelector('.hero-bg img');
if (heroBgImg) {
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
            heroBgImg.style.transform = `scale(1) translateY(${y * 0.3}px)`;
        }
    });
}
