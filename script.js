const WHATSAPP_NUMBER = '5511920193443';

const menuButton = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

function setMenu(open) {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute('aria-expanded', String(open));
  mobileMenu.hidden = !open;
  document.body.classList.toggle('menu-open', open);
}

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  setMenu(!open);
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenu(false);
});

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll('[data-wa]').forEach(link => {
  const message = link.dataset.wa || 'Olá BGTech Store!';
  link.href = whatsappUrl(message);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = document.querySelectorAll('.reveal');

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach(el => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

  revealElements.forEach(el => observer.observe(el));
}

document.querySelectorAll('img[data-fallback]').forEach(img => {
  img.addEventListener('error', () => {
    const fallback = document.createElement('div');
    fallback.className = 'image-fallback';
    fallback.textContent = img.dataset.fallback || 'Produto';
    img.replaceWith(fallback);
  }, { once: true });
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
