/* =========================================================
   WEBROO
   MAIN JAVASCRIPT
   ========================================================= */

"use strict";


/* ================= MOBILE MENU ================= */

const navToggle =
  document.getElementById("nav-toggle");

const mobileMenu =
  document.getElementById("mobile-menu");


if (navToggle && mobileMenu) {

  navToggle.addEventListener(
    "click",
    function () {

      const isOpen =
        mobileMenu.classList.contains("active");

      if (isOpen) {

        mobileMenu.classList.remove("active");

        navToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        navToggle.setAttribute(
          "aria-label",
          "Open menu"
        );

      } else {

        mobileMenu.classList.add("active");

        navToggle.setAttribute(
          "aria-expanded",
          "true"
        );

        navToggle.setAttribute(
          "aria-label",
          "Close menu"
        );

      }

    }
  );

}


/* ================= MOBILE LINKS ================= */

const mobileLinks =
  document.querySelectorAll(
    ".mobile-nav a"
  );


mobileLinks.forEach(
  function (link) {

    link.addEventListener(
      "click",
      function () {

        if (mobileMenu) {
          mobileMenu.classList.remove(
            "active"
          );
        }

        if (navToggle) {

          navToggle.setAttribute(
            "aria-expanded",
            "false"
          );

          navToggle.setAttribute(
            "aria-label",
            "Open menu"
          );

        }

      }
    );

  }
);


/* ================= ESCAPE KEY ================= */

document.addEventListener(
  "keydown",
  function (event) {

    if (event.key === "Escape") {

      if (mobileMenu) {
        mobileMenu.classList.remove(
          "active"
        );
      }

      if (navToggle) {

        navToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        navToggle.setAttribute(
          "aria-label",
          "Open menu"
        );

      }

    }

  }
);


/* ================= CLOSE MENU ON RESIZE ================= */

window.addEventListener(
  "resize",
  function () {

    if (
      window.innerWidth > 1000
    ) {

      if (mobileMenu) {
        mobileMenu.classList.remove(
          "active"
        );
      }

      if (navToggle) {

        navToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        navToggle.setAttribute(
          "aria-label",
          "Open menu"
        );

      }

    }

  }
);


/* ================= PROFILE BUTTONS ================= */

const profileButtons =
  document.querySelectorAll(
    ".profile-button"
  );


profileButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        const name =
          button.getAttribute(
            "data-name"
          );

        showMessage(
          name +
          "'s full profile will be available soon."
        );

      }
    );

  }
);


/* ================= PROJECT BUTTON ================= */

const projectButton =
  document.getElementById(
    "project-button"
  );


if (projectButton) {

  projectButton.addEventListener(
    "click",
    function () {

      showMessage(
        "Project posting will be available in the next WEBROO version."
      );

    }
  );

}


/* ================= MESSAGE ================= */

function showMessage(message) {

  const oldMessage =
    document.querySelector(
      ".site-message"
    );

  if (oldMessage) {
    oldMessage.remove();
  }


  const messageElement =
    document.createElement(
      "div"
    );

  messageElement.className =
    "site-message";

  messageElement.textContent =
    message;


  document.body.appendChild(
    messageElement
  );


  requestAnimationFrame(
    function () {

      messageElement.classList.add(
        "show"
      );

    }
  );


  setTimeout(
    function () {

      messageElement.classList.remove(
        "show"
      );

      setTimeout(
        function () {

          messageElement.remove();

        },
        300
      );

    },
    2500
  );

}


/* ================= CURRENT YEAR ================= */

const yearElement =
  document.getElementById(
    "year"
  );


if (yearElement) {

  yearElement.textContent =
    new Date().getFullYear();

}


/* ================= CLOSE MENU WHEN CLICKING OUTSIDE ================= */

document.addEventListener(
  "click",
  function (event) {

    if (
      !mobileMenu ||
      !navToggle
    ) {
      return;
    }


    const clickedMenu =
      mobileMenu.contains(
        event.target
      );

    const clickedButton =
      navToggle.contains(
        event.target
      );


    if (
      mobileMenu.classList.contains(
        "active"
      ) &&
      !clickedMenu &&
      !clickedButton
    ) {

      mobileMenu.classList.remove(
        "active"
      );

      navToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      navToggle.setAttribute(
        "aria-label",
        "Open menu"
      );

    }

  }
);


/* ================= PAGE LOADED ================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    document.body.classList.add(
      "page-loaded"
    );

  }
);
