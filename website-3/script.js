/* =====================================================
   W O R L | Anwälte — Site Behaviour
   ===================================================== */

(function () {
    'use strict';

    const sections = Array.from(document.querySelectorAll('.page'));
    const sectionIds = sections.map(s => s.id);
    const navLinks = Array.from(document.querySelectorAll('.nav-link[data-target]'));
    const dots = Array.from(document.querySelectorAll('.dot[data-target]'));
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');
    const header = document.getElementById('header');
    const btnUp = document.getElementById('btnUp');
    const btnDown = document.getElementById('btnDown');

    let currentIndex = 0;
    let isAnimating = false;

    // -------- Init: show first section --------
    function init() {
        if (!sections.length) return;
        sections[0].classList.add('is-active');
        updateUI();
    }

    // -------- Navigation --------
    function goTo(index) {
        if (isAnimating) return;
        if (index < 0 || index >= sections.length) return;
        if (index === currentIndex) return;

        isAnimating = true;
        const current = sections[currentIndex];
        const next = sections[index];

        current.classList.add('is-leaving');
        current.classList.remove('is-active');
        next.classList.add('is-active');

        currentIndex = index;
        updateUI();

        // Reset leaving state after transition
        setTimeout(() => {
            current.classList.remove('is-leaving');
            isAnimating = false;
        }, 900);
    }

    function goById(id) {
        const idx = sectionIds.indexOf(id);
        if (idx !== -1) goTo(idx);
    }

    function goNext() { goTo(currentIndex + 1); }
    function goPrev() { goTo(currentIndex - 1); }

    // -------- UI sync --------
    function updateUI() {
        // Dots
        dots.forEach((d, i) => d.classList.toggle('is-active', i === currentIndex));
        // Nav links
        navLinks.forEach((l) => l.classList.toggle('is-active', l.dataset.target === sectionIds[currentIndex]));
        // Up/down buttons
        btnUp.classList.toggle('is-disabled', currentIndex === 0);
        btnDown.classList.toggle('is-disabled', currentIndex === sections.length - 1);
        btnUp.disabled = currentIndex === 0;
        btnDown.disabled = currentIndex === sections.length - 1;
        // Header state
        header.classList.toggle('is-scrolled', currentIndex > 0);
        // Hash (without scroll jump)
        try {
            const newHash = '#' + sectionIds[currentIndex];
            if (location.hash !== newHash) history.replaceState(null, '', newHash);
        } catch (e) { /* sandboxed */ }
    }

    // -------- Event wiring --------
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileNav();
            goById(link.dataset.target);
        });
    });

    dots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            goById(dot.dataset.target);
        });
    });

    // Buttons / dots / logos that use data-target
    document.querySelectorAll('[data-target]').forEach((el) => {
        if (el.classList.contains('nav-link') || el.classList.contains('dot')) return;
        el.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileNav();
            goById(el.dataset.target);
        });
    });

    btnUp.addEventListener('click', goPrev);
    btnDown.addEventListener('click', goNext);

    // -------- Mobile nav --------
    function closeMobileNav() {
        mainNav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    navToggle.addEventListener('click', () => {
        const open = mainNav.classList.toggle('is-open');
        navToggle.classList.toggle('is-open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    });

    // -------- Keyboard --------
    let wheelLock = false;
    const wheelCooldown = 900;

    window.addEventListener('wheel', (e) => {
        if (mainNav.classList.contains('is-open')) return;
        if (wheelLock || isAnimating) return;
        if (Math.abs(e.deltaY) < 20) return;
        wheelLock = true;
        setTimeout(() => { wheelLock = false; }, wheelCooldown);
        if (e.deltaY > 0) goNext();
        else goPrev();
    }, { passive: true });

    // Touch swipe
    let touchStartY = null;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchend', (e) => {
        if (touchStartY === null) return;
        const dy = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(dy) > 50) {
            if (dy > 0) goNext(); else goPrev();
        }
        touchStartY = null;
    }, { passive: true });

    // Keyboard arrows + page up/down
    window.addEventListener('keydown', (e) => {
        if (e.target.matches('input, textarea, select')) return;
        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                goNext();
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                goPrev();
                break;
            case 'Home':
                e.preventDefault();
                goTo(0);
                break;
            case 'End':
                e.preventDefault();
                goTo(sections.length - 1);
                break;
            case 'Escape':
                closeMobileNav();
                break;
        }
    });

    // -------- Resize (recompute active) --------
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // ensure current section visible
            const active = sections[currentIndex];
            if (!active.classList.contains('is-active')) {
                active.classList.add('is-active');
            }
        }, 100);
    });

    // -------- Deep link --------
    function syncFromHash() {
        const id = (location.hash || '').replace('#', '');
        if (!id) return;
        const idx = sectionIds.indexOf(id);
        if (idx > 0) goTo(idx);
    }

    window.addEventListener('hashchange', syncFromHash);

    init();
    // Initial sync (slight delay so init animations settle)
    setTimeout(syncFromHash, 50);
})();
