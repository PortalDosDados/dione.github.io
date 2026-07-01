const navbar = document.querySelector('.navbar');
const revealItems = document.querySelectorAll('.reveal');
const countItems = document.querySelectorAll('[data-count]');

const setActiveLink = () => {
  const scrollPosition = window.scrollY + 120;
  const sections = document.querySelectorAll('main section[id]');

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-link').forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${section.id}`);
      });
    }
  });
};

const handleScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  setActiveLink();
};

const animateCounters = () => {
  countItems.forEach((item) => {
    const target = Number(item.dataset.count);
    const suffix = item.dataset.suffix || '';
    const prefix = item.dataset.prefix || '';
    const duration = 1400;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);
      item.textContent = `${prefix}${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        item.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(updateCounter);
  });
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('stats-grid')) {
          animateCounters();
        }
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => revealObserver.observe(item));

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  handleScroll();
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
