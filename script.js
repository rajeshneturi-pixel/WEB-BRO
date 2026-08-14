/* ==========================================
   WEBROO PLATFORM INTERACTIVE LOGIC
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  console.log('WEBROO platform script initialized successfully.');
  // DOM Element References
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const toastContainer = document.getElementById('toast-container');
  const toastButtons = document.querySelectorAll('.btn-toast');
  const navLinks = document.querySelectorAll('.nav-link');
  /* ------------------------------------------
     1. Sticky Navbar Scroll Effect
     ------------------------------------------ */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  /* ------------------------------------------
     2. Mobile Hamburger Menu Toggle
     ------------------------------------------ */
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    // Close menu when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('active')) {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
  /* ------------------------------------------
     3. Smooth Anchor Link Scrolling & Auto-close Menu
     ------------------------------------------ */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
