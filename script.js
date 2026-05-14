/* global document, window, IntersectionObserver, setTimeout, clearTimeout */

(function () {
  'use strict';

  /* =========================================================
     1. HEADER — scroll state
  ========================================================= */
  const header = document.getElementById('header');

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // apply on initial load

  /* =========================================================
     2. BURGER MENU
  ========================================================= */
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');

  const closeMenu = () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    burger.classList.add('open');
    nav.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close when nav link is clicked
  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* =========================================================
     3. ACTIVE NAV LINK ON SCROLL
  ========================================================= */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.remove('active'));
        const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      });
    },
    { rootMargin: '-50% 0px -45% 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* =========================================================
     4. SCROLL REVEAL
  ========================================================= */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* =========================================================
     5. TICKET MODAL
  ========================================================= */
  const modal        = document.getElementById('ticketModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose   = document.getElementById('modalClose');
  const modalVenue   = document.getElementById('modalVenue');
  const modalDate    = document.getElementById('modalDate');
  const modalForm    = document.getElementById('modalForm');

  const openModal = (venue, date) => {
    modalVenue.textContent = venue;
    modalDate.textContent  = date;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
    modalForm.reset();
  };

  document.querySelectorAll('.btn--ticket').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.venue, btn.dataset.date);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const successMsg = document.createElement('p');
    successMsg.textContent = '✓ Дякуємо! Квиток зарезервовано. Деталі надійдуть на вашу пошту.';
    successMsg.style.cssText = 'color:#4ec878;font-size:.875rem;font-weight:600;margin-top:.5rem';
    modalForm.replaceWith(successMsg);
    setTimeout(closeModal, 2800);
  });

  /* =========================================================
     6. CONTACT FORM VALIDATION
  ========================================================= */
  const contactForm   = document.getElementById('contactForm');
  const nameInput     = document.getElementById('name');
  const emailInput    = document.getElementById('email');
  const messageInput  = document.getElementById('message');
  const nameError     = document.getElementById('nameError');
  const emailError    = document.getElementById('emailError');
  const messageError  = document.getElementById('messageError');
  const formSuccess   = document.getElementById('formSuccess');

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showError = (input, errorEl, msg) => {
    errorEl.textContent = msg;
    input.classList.add('invalid');
  };

  const clearError = (input, errorEl) => {
    errorEl.textContent = '';
    input.classList.remove('invalid');
  };

  const validateName = () => {
    const v = nameInput.value.trim();
    if (!v) { showError(nameInput, nameError, "Ім'я обов'язкове"); return false; }
    if (v.length < 2) { showError(nameInput, nameError, "Мінімум 2 символи"); return false; }
    clearError(nameInput, nameError);
    return true;
  };

  const validateEmail = () => {
    const v = emailInput.value.trim();
    if (!v) { showError(emailInput, emailError, 'Email обов\'язковий'); return false; }
    if (!EMAIL_REGEX.test(v)) { showError(emailInput, emailError, 'Введіть коректний email'); return false; }
    clearError(emailInput, emailError);
    return true;
  };

  const validateMessage = () => {
    const v = messageInput.value.trim();
    if (!v) { showError(messageInput, messageError, 'Повідомлення обов\'язкове'); return false; }
    if (v.length < 10) { showError(messageInput, messageError, 'Мінімум 10 символів'); return false; }
    clearError(messageInput, messageError);
    return true;
  };

  // Live validation after first interaction
  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  messageInput.addEventListener('blur', validateMessage);

  nameInput.addEventListener('input', () => {
    if (nameInput.classList.contains('invalid')) validateName();
  });
  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('invalid')) validateEmail();
  });
  messageInput.addEventListener('input', () => {
    if (messageInput.classList.contains('invalid')) validateMessage();
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const ok = [validateName(), validateEmail(), validateMessage()].every(Boolean);
    if (!ok) return;

    // Success
    contactForm.reset();
    [nameInput, emailInput, messageInput].forEach((el) => el.classList.remove('invalid'));
    [nameError, emailError, messageError].forEach((el) => { el.textContent = ''; });
    formSuccess.hidden = false;
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => { formSuccess.hidden = true; }, 5000);
  });

  /* =========================================================
     7. SMOOTH SCROLL FOR ANCHOR LINKS
  ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
