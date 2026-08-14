/* =========================================================
   WEBROO — MAIN JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   1. DOM ELEMENTS
   ========================================================= */

const navToggle = document.getElementById("nav-toggle");
const mobileMenu = document.getElementById("mobile-menu");

const mobileLinks = document.querySelectorAll(".mobile-link");

const allAnchorLinks = document.querySelectorAll(
  'a[href^="#"]'
);


/* =========================================================
   2. MOBILE NAVIGATION
   ========================================================= */

function openMobileMenu() {
  if (!navToggle || !mobileMenu) {
    return;
  }

  navToggle.setAttribute(
    "aria-expanded",
    "true"
  );

  navToggle.setAttribute(
    "aria-label",
    "Close navigation menu"
  );

  mobileMenu.classList.add("active");

  mobileMenu.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "menu-open"
  );
}


function closeMobileMenu() {
  if (!navToggle || !mobileMenu) {
    return;
  }

  navToggle.setAttribute(
    "aria-expanded",
    "false"
  );

  navToggle.setAttribute(
    "aria-label",
    "Open navigation menu"
  );

  mobileMenu.classList.remove("active");

  mobileMenu.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "menu-open"
  );
}


function toggleMobileMenu() {
  if (!mobileMenu) {
    return;
  }

  const isOpen =
    mobileMenu.classList.contains("active");

  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}


/* =========================================================
   3. MOBILE MENU BUTTON
   ========================================================= */

if (navToggle) {
  navToggle.addEventListener(
    "click",
    toggleMobileMenu
  );
}


/* =========================================================
   4. CLOSE MENU AFTER CLICKING A LINK
   ========================================================= */

mobileLinks.forEach((link) => {

  link.addEventListener(
    "click",
    () => {
      closeMobileMenu();
    }
  );

});


/* =========================================================
   5. ESCAPE KEY
   ========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {
      closeMobileMenu();
    }

  }
);


/* =========================================================
   6. CLICK OUTSIDE MOBILE MENU
   ========================================================= */

document.addEventListener(
  "click",
  (event) => {

    if (!mobileMenu || !navToggle) {
      return;
    }

    const clickedInsideMenu =
      mobileMenu.contains(event.target);

    const clickedToggle =
      navToggle.contains(event.target);

    if (
      mobileMenu.classList.contains("active") &&
      !clickedInsideMenu &&
      !clickedToggle
    ) {
      closeMobileMenu();
    }

  }
);


/* =========================================================
   7. CLOSE MOBILE MENU WHEN WINDOW RESIZES
   ========================================================= */

window.addEventListener(
  "resize",
  () => {

    if (
      window.innerWidth > 1000 &&
      mobileMenu &&
      mobileMenu.classList.contains("active")
    ) {
      closeMobileMenu();
    }

  }
);


/* =========================================================
   8. SMOOTH INTERNAL NAVIGATION
   ========================================================= */

allAnchorLinks.forEach((link) => {

  link.addEventListener(
    "click",
    (event) => {

      const href =
        link.getAttribute("href");

      if (
        !href ||
        href === "#" ||
        href === "#!"
      ) {
        return;
      }

      const target =
        document.querySelector(href);

      if (!target) {
        return;
      }

      event.preventDefault();

      closeMobileMenu();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }
  );

});


/* =========================================================
   9. DEMO PROFILE LINKS
   ========================================================= */

const demoProfileLinks =
  document.querySelectorAll(
    '.expert-card a[href="#"]'
  );


demoProfileLinks.forEach((link) => {

  link.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      const expertCard =
        link.closest(".expert-card");

      if (!expertCard) {
        return;
      }

      const expertName =
        expertCard.querySelector(
          ".expert-name"
        );

      if (expertName) {

        const name =
          expertName.textContent.trim();

        showMessage(
          `${name}'s profile will be available soon.`
        );

      }

    }
  );

});


/* =========================================================
   10. TEMPORARY MESSAGE
   ========================================================= */

function showMessage(message) {

  const existingMessage =
    document.querySelector(
      ".webroo-message"
    );

  if (existingMessage) {
    existingMessage.remove();
  }


  const messageBox =
    document.createElement("div");

  messageBox.className =
    "webroo-message";

  messageBox.textContent =
    message;


  messageBox.style.position =
    "fixed";

  messageBox.style.left =
    "50%";

  messageBox.style.bottom =
    "25px";

  messageBox.style.transform =
    "translateX(-50%)";

  messageBox.style.zIndex =
    "9999";

  messageBox.style.padding =
    "13px 20px";

  messageBox.style.borderRadius =
    "10px";

  messageBox.style.background =
    "#121925";

  messageBox.style.color =
    "#ffffff";

  messageBox.style.border =
    "1px solid rgba(255,255,255,0.12)";

  messageBox.style.boxShadow =
    "0 15px 40px rgba(0,0,0,0.35)";

  messageBox.style.fontSize =
    "14px";

  messageBox.style.fontWeight =
    "600";


  document.body.appendChild(
    messageBox
  );


  setTimeout(() => {

    messageBox.style.opacity =
      "0";

    messageBox.style.transition =
      "opacity 0.3s ease";

  }, 2200);


  setTimeout(() => {

    messageBox.remove();

  }, 2600);

}


/* =========================================================
   11. SCROLL REVEAL
   ========================================================= */

const revealElements =
  document.querySelectorAll(
    ".feature-card, .category-card, .expert-card, .timeline-step, .trust-card"
  );


if (
  "IntersectionObserver" in window
) {

  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "is-visible"
          );

          observer.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.12
      }
    );


  revealElements.forEach(
    (element) => {

      element.classList.add(
        "reveal"
      );

      revealObserver.observe(
        element
      );

    }
  );

}


/* =========================================================
   12. ACTIVE NAVIGATION
   ========================================================= */

const sections =
  document.querySelectorAll(
    "main section[id]"
  );

const desktopNavLinks =
  document.querySelectorAll(
    ".nav-links a"
  );


if (
  "IntersectionObserver" in window
) {

  const sectionObserver =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            const sectionId =
              entry.target.id;

            desktopNavLinks.forEach(
              (link) => {

                link.classList.remove(
                  "active"
                );

                if (
                  link.getAttribute(
                    "href"
                  ) === `#${sectionId}`
                ) {

                  link.classList.add(
                    "active"
                  );

                }

              }
            );

          }
        );

      },
      {
        rootMargin:
          "-25% 0px -65% 0px"
      }
    );


  sections.forEach(
    (section) => {

      sectionObserver.observe(
        section
      );

    }
  );

}


/* =========================================================
   13. UPDATE CURRENT YEAR
   ========================================================= */

const footerYear =
  document.querySelector(
    ".footer-note p"
  );


if (footerYear) {

  const currentYear =
    new Date().getFullYear();

  footerYear.textContent =
    `© ${currentYear} WEBROO. All rights reserved.`;

}


/* =========================================================
   14. INITIALIZE
   ========================================================= */

function initializeWEBROO() {

  if (mobileMenu) {

    mobileMenu.setAttribute(
      "aria-hidden",
      "true"
    );

  }

  if (navToggle) {

    navToggle.setAttribute(
      "aria-expanded",
      "false"
    );

  }

}


initializeWEBROO();
