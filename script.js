'use strict';
const WHATSAPP_NUMBER = '5511920193443';
const whatsappUrl = message => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
document.querySelectorAll('[data-wa]').forEach(link => {
  link.href = whatsappUrl(link.dataset.wa);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});
document.getElementById('year').textContent = new Date().getFullYear();
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
function setMenu(open, returnFocus = false) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileNav.hidden = !open;
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => setMenu(mobileNav.hidden));
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) setMenu(false, true);
});
document.addEventListener('click', event => {
  if (!mobileNav.hidden && !event.target.closest('.header')) setMenu(false);
});
const desktop = matchMedia('(min-width: 761px)');
desktop.addEventListener('change', () => setMenu(false));

// Only prepare a message: the visitor reviews it and sends it in WhatsApp.
document.getElementById('recommendation').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const purpose = data.get('purpose');
  const budget = data.get('budget');
  const message = `Olá, BGTech Store! Quero orientação para escolher um dispositivo para ${purpose}.${budget ? ` Meu investimento previsto: ${budget}.` : ' Ainda quero entender as opções de investimento.'} Podemos conversar sobre modelos e condições de encomenda?`;
  const link = document.createElement('a');
  link.href = whatsappUrl(message);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.click();
  document.getElementById('form-feedback').textContent = 'Mensagem preparada. Revise os detalhes e envie no WhatsApp.';
});

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const reveals = [...document.querySelectorAll('.reveal')];
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.08});
  document.documentElement.classList.add('motion-ready');
  reveals.forEach(element => observer.observe(element));
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      reveals.forEach(element => element.classList.add('visible'));
      observer.disconnect();
    }
  });
}

// One animation frame per scroll, transform-only motion, static mobile chapter.
const hero = document.querySelector('.hero');
const heroDevice = document.querySelector('.hero-device');
const manifesto = document.querySelector('.manifesto');
const clamp = value => Math.min(1, Math.max(0, value));
let framePending = false;
function renderMotion() {
  framePending = false;
  if (reducedMotion.matches) return;
  const heroRect = hero.getBoundingClientRect();
  if (heroRect.bottom > 0) {
    const progress = clamp(-heroRect.top / heroRect.height);
    heroDevice.style.setProperty('--hero-y', `${progress * 35}px`);
    heroDevice.style.setProperty('--hero-rotate', `${-6 + progress * 6}deg`);
  }
  const rect = manifesto.getBoundingClientRect();
  if (rect.bottom > 0 && rect.top < innerHeight) {
    const progress = clamp((innerHeight - rect.top) / (rect.height + innerHeight));
    manifesto.style.setProperty('--progress', String(progress));
    manifesto.style.setProperty('--orb-y', `${progress * 110}px`);
  }
}
function scheduleMotion() {
  if (!framePending && !reducedMotion.matches) {
    framePending = true;
    requestAnimationFrame(renderMotion);
  }
}
addEventListener('scroll', scheduleMotion, {passive: true});
addEventListener('resize', scheduleMotion);
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    heroDevice.style.removeProperty('--hero-y');
    heroDevice.style.removeProperty('--hero-rotate');
    manifesto.style.removeProperty('--orb-y');
  } else scheduleMotion();
});
scheduleMotion();
