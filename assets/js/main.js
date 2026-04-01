(() => {
  // Random hero phrase
  const phrases = [
    "Know thyself.",
    "The unexamined life is not worth living.",
    "I know that I know nothing.",
    "Man is the measure of all things.",
    "Everything flows.",
    "No man ever steps in the same river twice.",
    "The only true wisdom is knowing you know nothing.",
    "Wisdom begins in wonder.",
    "Let no one ignorant of geometry enter.",
    "Give me a lever long enough and I shall move the world.",
    "Eureka!",
    "The life which is unexamined is not worth living.",
    "Excellence is not an act, but a habit.",
    "We are what we repeatedly do.",
    "There is nothing permanent except change.",
    "The energy of the mind is the essence of life.",
    "He who is not a good servant will not be a good master.",
    "To perceive is to suffer.",
    "Happiness depends upon ourselves.",
    "Well begun is half done.",
  ];
  const heroPhrase = document.getElementById("hero-phrase");
  if (heroPhrase) {
    heroPhrase.textContent = phrases[Math.floor(Math.random() * phrases.length)];
  }

  // Scroll reveal
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll("[data-reveal]").forEach((el, i) => {
    // Stagger cards in the work grid
    if (el.closest(".work-grid")) {
      el.style.transitionDelay = `${i * 0.08}s`;
    }
    revealObserver.observe(el);
  });

  // Nav scroll state
  const header = document.getElementById("site-header");
  let ticking = false;

  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });

  // Active nav section tracking
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
})();
