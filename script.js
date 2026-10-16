(() => {
  'use strict';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = document.querySelector('.menu-btn');
  const menu = document.querySelector('#mobile-menu');
  function setMenu(open, returnFocus = false) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.hidden = !open;
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => setMenu(menu.hidden));
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) setMenu(false, true);
  });
  const mobile = matchMedia('(max-width: 800px)');
  mobile.addEventListener('change', () => { if (!mobile.matches) setMenu(false); });
  document.querySelectorAll('[data-wa]').forEach(link => {
    link.href = `https://wa.me/5511920193443?text=${encodeURIComponent(link.dataset.wa)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
  document.querySelector('#year').textContent = new Date().getFullYear();

  // Real CSS geometry: two faces, side rails, top and bottom. No external 3D runtime.
  const phone = document.querySelector('.phone-assembly');
  const rotation = document.querySelector('#rotation');
  const rotateButton = document.querySelector('#rotate-device');
  function rotate(value) {
    phone.style.setProperty('--rotation', `${value}deg`);
    rotation.value = value;
    rotation.setAttribute('aria-valuetext', `${value} graus`);
    rotateButton.innerHTML = value > 90 ? 'Ver traseira <span aria-hidden="true">↻</span>' : 'Ver frente <span aria-hidden="true">↻</span>';
  }
  rotation.addEventListener('input', () => rotate(Number(rotation.value)));
  rotateButton.addEventListener('click', () => rotate(Number(rotation.value) > 90 ? -24 : 160));
  rotate(-24);

  const reveals = document.querySelectorAll('.reveal');
  let observer;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
  }
  function configureMotion() {
    document.body.classList.toggle('motion-ready', !motion.matches && Boolean(observer));
    reveals.forEach(item => { if (!motion.matches && observer) observer.observe(item); else item.classList.add('visible'); });
    if (motion.matches) { phone.style.removeProperty('--phone-shift'); phone.style.removeProperty('--phone-lean'); }
  }
  configureMotion();
  motion.addEventListener('change', configureMotion);

  const hero = document.querySelector('.hero');
  let framePending = false;
  function updateScene() {
    framePending = false;
    if (motion.matches) return;
    const rect = hero.getBoundingClientRect();
    if (rect.bottom < 0) return;
    const progress = Math.max(0, Math.min(1, -rect.top / hero.offsetHeight));
    phone.style.setProperty('--phone-shift', `${-progress * 48}px`);
    phone.style.setProperty('--phone-lean', `${12 - progress * 16}deg`);
  }
  window.addEventListener('scroll', () => {
    if (!framePending && !motion.matches) { framePending = true; requestAnimationFrame(updateScene); }
  }, { passive: true });
})();
