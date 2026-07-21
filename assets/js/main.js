

(function() {
  "use strict";

  /**
   * Auto-update years of experience on resume
   */
  const yearsExpEl = document.querySelector('#years-exp');
  if (yearsExpEl) {
    const startDate = new Date(yearsExpEl.dataset.startDate);
    const years = Math.floor((Date.now() - startDate) / (1000 * 60 * 60 * 24 * 365.25));
    yearsExpEl.textContent = `${years}+`;
  }

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    const isOpen = document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
    headerToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
  headerToggleBtn.addEventListener('click', headerToggle);
  headerToggleBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      headerToggle();
    }
  });

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function aosInit() {
    AOS.init({
      duration: prefersReducedMotion ? 0 : 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      disable: prefersReducedMotion
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    if (prefersReducedMotion) {
      selectTyped.textContent = typed_strings[0];
    } else {
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000
      });
    }
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);


  document.addEventListener('DOMContentLoaded', function () {
  // intenta por id y por action de Formspree como fallback
  const form = document.querySelector('#contact-form, form[action*="formspree.io/f/mdkllyqa"]');
  if (!form) return; // si esta página no tiene el form, salir sin error

  const loading = form.querySelector('.loading');
  const okMsg   = form.querySelector('.sent-message');
  const errMsg  = form.querySelector('.error-message');
  const submit  = form.querySelector('button[type="submit"]');

  const show = (el, on) => el && (el.style.display = on ? 'block' : 'none');
  const setBusy = (on) => submit && (submit.disabled = on);

  // estado inicial
  show(loading, false); show(okMsg, false); show(errMsg, false);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    show(loading, true); show(okMsg, false); show(errMsg, false); setBusy(true);

    try {
      const data = new FormData(form);
      // honeypot
      if (data.get('_gotcha')) {
        show(loading, false); show(okMsg, true); form.reset(); setBusy(false); return;
      }

      const res  = await fetch('https://formspree.io/f/mdkllyqa', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.ok !== false) {
        if (json.next) { window.location = json.next; return; } // respeta _next
        show(loading, false); show(okMsg, true); form.reset();
      } else {
        show(loading, false);
        if (errMsg) errMsg.textContent = (json.errors && json.errors[0]?.message) || 'There was a problem sending your message.';
        show(errMsg, true);
      }
    } catch (err) {
      show(loading, false);
      if (errMsg) errMsg.textContent = 'Network error. Please try again.';
      show(errMsg, true);
    } finally {
      setBusy(false);
    }
  });
});



})();

