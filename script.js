/**
 * script.js — WEBROO interactions
 * - Mobile menu toggle + accessible focus trap
 * - Close on Escape / click-outside / resize
 * - Respect prefers-reduced-motion
 * - Simple IntersectionObserver-based reveal (safe fallback)
 *
 * Place this file next to index.html and style.css.
 */

(function () {
  'use strict';

  // --- Helpers ---
  const qs = (selector, ctx = document) => (ctx ? ctx.querySelector(selector) : null);
  const qsa = (selector, ctx = document) => (ctx ? Array.from(ctx.querySelectorAll(selector)) : []);
  const isVisible = el => !!(el && el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  const supportsIntersectionObserver = 'IntersectionObserver' in window;

  // --- Elements (guarded) ---
  const navToggle = qs('#nav-toggle');
  const mobileMenu = qs('#mobile-menu');
  const pageMain = qs('#main');
  const root = document.documentElement;

  // mobile links inside menu (safe)
  const mobileLinks = mobileMenu ? qsa('.mobile-link, .mobile-ctas a', mobileMenu) : [];

  // --- Motion preference ---
  const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = () => prefersReducedMotionQuery.matches;

  function applyReducedMotionToUI() {
    if (prefersReducedMotion()) {
      root.classList.add('reduced-motion');
      // disable smooth scroll if applied by CSS / HTML
      try { root.style.scrollBehavior = 'auto'; } catch (e) { /* ignore */ }
    } else {
      root.classList.remove('reduced-motion');
      try { root.style.scrollBehavior = ''; } catch (e) { /* ignore */ }
    }
  }

  // initialize preference and listen for changes
  applyReducedMotionToUI();
  if (prefersReducedMotionQuery.addEventListener) {
    prefersReducedMotionQuery.addEventListener('change', applyReducedMotionToUI);
  } else if (prefersReducedMotionQuery.addListener) {
    prefersReducedMotionQuery.addListener(applyReducedMotionToUI);
  }

  // --- Mobile menu state ---
  let lastFocusedElementBeforeMenu = null;
  let focusableInMenu = [];
  let firstFocusable = null;
  let lastFocusable = null;
  let menuKeyHandler = null;

  function updateAriaMenu(open) {
    if (navToggle) navToggle.setAttribute('aria-expanded', String(Boolean(open)));
    if (mobileMenu) mobileMenu.setAttribute('aria-hidden', String(!open));
  }

  function collectFocusable(container) {
    if (!container) return [];
    const els = container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
    return Array.from(els).filter(el => !el.hasAttribute('disabled') && isVisible(el));
  }

  function trapFocus(container) {
    focusableInMenu = collectFocusable(container);
    if (focusableInMenu.length === 0) {
      // ensure the container is focusable
      container.setAttribute('tabindex', '-1');
      container.focus();
      return;
    }
    firstFocusable = focusableInMenu[0];
    lastFocusable = focusableInMenu[focusableInMenu.length - 1];
    // focus the first element for keyboard users
    firstFocusable.focus();

    menuKeyHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      } else if (e.key === 'Escape' || e.key === 'Esc') {
        closeMobileMenu();
      }
    };
    container.addEventListener('keydown', menuKeyHandler);
  }

  function releaseFocusTrap(container) {
    if (!container) return;
    if (menuKeyHandler) {
      container.removeEventListener('keydown', menuKeyHandler);
      menuKeyHandler = null;
    }
    if (container.hasAttribute('tabindex')) container.removeAttribute('tabindex');
    focusableInMenu = [];
    firstFocusable = lastFocusable = null;
  }

  function openMobileMenu() {
    if (!mobileMenu || !navToggle) return;
    lastFocusedElementBeforeMenu = document.activeElement;
    mobileMenu.classList.add('active');
    // update ARIA
    updateAriaMenu(true);
    // prevent body scroll (small screens)
    document.body.style.overflow = 'hidden';
    trapFocus(mobileMenu);
  }

  function closeMobileMenu() {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.classList.remove('active');
    updateAriaMenu(false);
    releaseFocusTrap(mobileMenu);
    // restore body scroll
    document.body.style.overflow = '';
    // restore focus
    try {
      if (lastFocusedElementBeforeMenu && typeof lastFocusedElementBeforeMenu.focus === 'function') {
        lastFocusedElementBeforeMenu.focus();
      } else {
        navToggle.focus();
      }
    } catch (e) { /* ignore focus errors */ }
  }

  // Toggle handler
  function toggleMobileMenu() {
    if (!mobileMenu || !navToggle) return;
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) closeMobileMenu();
    else openMobileMenu();
  }

  // Click outside to close
  function onPointerDown(e) {
    if (!mobileMenu || !mobileMenu.classList.contains('active')) return;
    // if click/tap outside menu and not on toggle, close
    if (!mobileMenu.contains(e.target) && e.target !== navToggle && !navToggle.contains(e.target)) {
      closeMobileMenu();
    }
  }

  // Ensure aria attributes exist (sanity)
  function ensureAriaDefaults() {
    if (navToggle && !navToggle.hasAttribute('aria-expanded')) navToggle.setAttribute('aria-expanded', 'false');
    if (navToggle && !navToggle.hasAttribute('aria-controls') && mobileMenu) navToggle.setAttribute('aria-controls', mobileMenu.id || 'mobile-menu');
    if (mobileMenu && !mobileMenu.hasAttribute('aria-hidden')) mobileMenu.setAttribute('aria-hidden', 'true');
  }

  // Close on resize if layout switches to desktop
  let resizeTimeout = null;
  function onResize() {
    // Debounce
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // if viewport becomes large (desktop nav visible in CSS at ~1000px), close menu
      if (window.innerWidth > 1000 && mobileMenu && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    }, 120);
  }

  // Close menu when any mobile link is clicked (allow navigation then close)
  function initMobileLinkHandlers() {
    if (!mobileLinks || mobileLinks.length === 0) return;
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        // small delay to allow anchor navigation/scroll
        setTimeout(closeMobileMenu, 120);
      });
    });
  }

  // --- Scroll reveal (IntersectionObserver) ---
  function initReveal() {
    if (prefersReducedMotion()) return; // skip reveals if reduced-motion

    const revealSelector = [
      '.feature-card',
      '.category-card',
      '.expert-card',
      '.timeline-step',
      '.trust-card',
      '.hero-card'
    ].join(',');

    const nodes = qsa(revealSelector);
    if (nodes.length === 0 || !supportsIntersectionObserver) {
      // fallback: reveal all immediately
      nodes.forEach(n => n.classList.add('is-revealed'));
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add('is-revealed');
          // resume animations if they were paused in CSS
          el.style.animationPlayState = '';
        } else {
          // pause to save CPU (optional)
          el.style.animationPlayState = 'paused';
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12
    });

    nodes.forEach(n => {
      // start paused so reveal happens when entering view
      try { n.style.animationPlayState = 'paused'; } catch (e) { /* ignore */ }
      obs.observe(n);
    });

    // Make sure hero floats respect reduced-motion
    const floats = qsa('.float-a, .float-b, .float-c');
    floats.forEach(f => {
      f.style.animationPlayState = prefersReducedMotion() ? 'paused' : '';
    });
  }

  // --- Initialization ---
  function init() {
    ensureAriaDefaults();

    if (navToggle) {
      navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMobileMenu();
      });
    }

    // close on global Escape as well
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Escape' || e.key === 'Esc') && mobileMenu && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    // click/tap outside to close
    document.addEventListener('pointerdown', onPointerDown);

    // close on resize if needed
    window.addEventListener('resize', onResize);

    initMobileLinkHandlers();

    // init reveal animations
    initReveal();

    // apply reduced motion UI changes (class toggles etc.)
    applyReducedMotionToUI();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
