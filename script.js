// Sucre Brûlé – landing page behaviour (no libraries)
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  // ---------- Header turns solid after scrolling ----------
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Mobile menu ----------
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    header.classList.toggle('nav-open', open);
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 720) setMenu(false);
  });

  // ---------- Reveal on scroll ----------
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Instagram placeholder (no real link yet) ----------
  document.querySelectorAll('[data-placeholder]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  // ---------- Newsletter form (demo: nothing is sent) ----------
  var form = document.getElementById('signup-form');
  var status = document.getElementById('form-status');

  function setError(input, errorId, message) {
    var box = document.getElementById(errorId);
    box.textContent = message;
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', errorId);
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
    return !message;
  }

  function validate() {
    var name = form.elements.name;
    var email = form.elements.email;
    var consent = form.elements.consent;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());

    var results = [
      setError(name, 'error-name', name.value.trim() ? '' : 'Please enter your first name.'),
      setError(email, 'error-email',
        !email.value.trim() ? 'Please enter your email address.' :
        (emailOk ? '' : 'Please enter a valid email address, like name@example.com.')),
      setError(consent, 'error-consent', consent.checked ? '' : 'Please tick the box to give your consent.')
    ];
    return results.every(Boolean);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = '';

    if (!validate()) {
      var firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
      return;
    }

    // MAILERLITE: the real submit goes here once the MailerLite form exists.
    // For now this is a demo, so no data leaves the page.
    var first = form.elements.name.value.trim();
    status.className = 'form-status is-success';
    status.textContent = 'Thank you, ' + first + '! This is a demo form, so nothing has been sent yet.';
    form.reset();
  });

  // Clear an error as soon as the visitor fixes the field
  ['name', 'email', 'consent'].forEach(function (field) {
    var input = form.elements[field];
    input.addEventListener(field === 'consent' ? 'change' : 'input', function () {
      if (input.getAttribute('aria-invalid') === 'true') validate();
    });
  });
})();
