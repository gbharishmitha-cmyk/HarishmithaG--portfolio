/* Harishmitha G portfolio — Vanilla JavaScript */
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = [...document.querySelectorAll(".nav-link")];
  const backToTop = document.getElementById("back-to-top");
  const currentYear = document.getElementById("current-year");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile navigation
  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navLinks.classList.toggle("open", !isOpen);
  });
  navItems.forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", event => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });

  // Dynamic footer year
  currentYear.textContent = new Date().getFullYear();

  // Typing effect
  const typingText = document.getElementById("typing-text");
  const phrases = ["Full Stack Development", "Web Technologies", "Artificial Intelligence", "Creative Problem Solving"];
  if (typingText && !reducedMotion) {
    let phraseIndex = 0, characterIndex = phrases[0].length, deleting = true;
    function typeLoop() {
      const phrase = phrases[phraseIndex];
      if (deleting) {
        characterIndex--;
        typingText.textContent = phrase.slice(0, Math.max(0, characterIndex));
        if (characterIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          window.setTimeout(typeLoop, 450);
          return;
        }
      } else {
        const nextPhrase = phrases[phraseIndex];
        characterIndex++;
        typingText.textContent = nextPhrase.slice(0, characterIndex);
        if (characterIndex >= nextPhrase.length) {
          deleting = true;
          window.setTimeout(typeLoop, 1500);
          return;
        }
      }
      window.setTimeout(typeLoop, deleting ? 38 : 65);
    }
    window.setTimeout(typeLoop, 1700);
  }

  // Scroll reveal. The fallback keeps content visible if IntersectionObserver is unavailable.
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach(element => revealObserver.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add("is-visible"));
  }

  // Active navigation and back-to-top button
  const sections = [...document.querySelectorAll("main section[id]")];
  function updateScrollUI() {
    const marker = window.scrollY + 150;
    let activeId = "home";
    sections.forEach(section => {
      if (section.offsetTop <= marker) activeId = section.id;
    });
    navItems.forEach(link => {
      const active = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    backToTop.classList.toggle("visible", window.scrollY > 500);
  }
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));

  // Certificate image modal
  const modal = document.getElementById("certificate-modal");
  const modalImage = document.getElementById("modal-image");
  const modalTitle = document.getElementById("modal-title");
  let lastFocusedElement = null;

  function openModal(imagePath, title) {
    lastFocusedElement = document.activeElement;
    modalImage.src = imagePath;
    modalImage.alt = title;
    modalTitle.textContent = title;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modal.querySelector(".modal-close").focus();
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalImage.src = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  }
  document.querySelectorAll("[data-image]").forEach(button => {
    button.addEventListener("click", () => openModal(button.dataset.image, button.dataset.title || "Certificate preview"));
  });
  modal.querySelectorAll("[data-close-modal]").forEach(element => element.addEventListener("click", closeModal));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  // Contact form: validate and open the visitor's email app. No backend is claimed.
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const formData = new FormData(contactForm);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const subject = String(formData.get("subject")).trim();
    const message = String(formData.get("message")).trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:gbharishmitha@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    formStatus.textContent = "Opening your email app with a drafted message. You still need to send it there.";
    window.location.href = mailto;
  });
});
