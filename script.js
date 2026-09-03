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

// Cinematic 3D scroll experience
const cinematic = document.querySelector('.cinematic');
const cinematicSticky = document.querySelector('.cinematic-sticky');

if (cinematic && cinematicSticky && !reduceMotion) {
  const phone = cinematic.querySelector('.phone-device');
  const tablet = cinematic.querySelector('.tablet-device');
  const watch = cinematic.querySelector('.watch-device');
  const copyA = cinematic.querySelector('.cine-copy-a');
  const copyB = cinematic.querySelector('.cine-copy-b');
  const copyC = cinematic.querySelector('.cine-copy-c');
  const cue = cinematic.querySelector('.scroll-cue');
  const exitWash = cinematic.querySelector('.cine-exit-wash');
  const glowA = cinematic.querySelector('.cine-glow-a');
  const glowB = cinematic.querySelector('.cine-glow-b');

  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, value) => {
    const t = clamp((value - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  const phaseOpacity = (startIn, endIn, startOut, endOut, p) => {
    const fadeIn = smooth(startIn, endIn, p);
    const fadeOut = 1 - smooth(startOut, endOut, p);
    return clamp(fadeIn * fadeOut);
  };

  let ticking = false;

  function renderCinematic() {
    ticking = false;
    const rect = cinematic.getBoundingClientRect();
    const scrollable = Math.max(1, cinematic.offsetHeight - window.innerHeight);
    const p = clamp(-rect.top / scrollable);
    const active = rect.top <= 82 && rect.bottom > Math.min(window.innerHeight, 180);

    cinematic.style.setProperty('--cine-p', p.toFixed(4));
    document.body.classList.toggle('cinematic-active', active);

    const a = phaseOpacity(0, 0.04, 0.22, 0.34, p);
    const b = phaseOpacity(0.27, 0.38, 0.54, 0.66, p);
    const c = smooth(0.60, 0.74, p) * (1 - smooth(0.96, 1, p) * 0.35);

    copyA.style.opacity = a.toFixed(3);
    copyB.style.opacity = b.toFixed(3);
    copyC.style.opacity = c.toFixed(3);

    const copyShiftA = lerp(0, -38, smooth(0.15, 0.34, p));
    const copyShiftB = lerp(34, -18, smooth(0.27, 0.66, p));
    const copyShiftC = lerp(36, 0, smooth(0.60, 0.78, p));

    if (window.innerWidth > 720) {
      copyA.style.transform = `translateY(calc(-50% + ${copyShiftA}px))`;
      copyB.style.transform = `translateY(calc(-50% + ${copyShiftB}px))`;
      copyC.style.transform = `translateY(calc(-50% + ${copyShiftC}px))`;
    } else {
      copyA.style.transform = `translateY(${copyShiftA * .45}px)`;
      copyB.style.transform = `translateY(${copyShiftB * .45}px)`;
      copyC.style.transform = `translateY(${copyShiftC * .45}px)`;
    }

    const deviceT = smooth(0.04, 0.76, p);
    const finale = smooth(0.66, 0.94, p);
    const mobile = window.innerWidth <= 720;

    const phoneScale = mobile ? lerp(.76, 1.03, deviceT) : lerp(.72, 1.10, deviceT);
    const phoneX = mobile ? lerp(105, 0, deviceT) : lerp(175, -28, deviceT);
    const phoneY = mobile ? lerp(-48, -8, deviceT) : lerp(95, -10, deviceT);
    const phoneRotY = lerp(-58, 12, deviceT) - finale * 9;
    const phoneRotX = lerp(18, -4, deviceT);
    const phoneRotZ = lerp(12, -4, deviceT) + finale * 2;
    phone.style.transform = `translate3d(${phoneX}px,${phoneY}px,${lerp(-110, 135, deviceT)}px) rotateY(${phoneRotY}deg) rotateX(${phoneRotX}deg) rotateZ(${phoneRotZ}deg) scale(${phoneScale})`;
    phone.style.opacity = clamp(smooth(0.03, 0.18, p) * (1 - smooth(.97, 1, p) * .25)).toFixed(3);

    const tabletT = smooth(0.13, 0.70, p);
    const tabletX = mobile ? lerp(-150, -64, tabletT) : lerp(-315, -160, tabletT);
    const tabletY = mobile ? lerp(75, 16, tabletT) : lerp(145, 36, tabletT);
    tablet.style.transform = `translate3d(${tabletX}px,${tabletY}px,${lerp(-320, -125, tabletT)}px) rotateY(${lerp(62, 30, tabletT)}deg) rotateX(${lerp(-16, -5, tabletT)}deg) rotateZ(${lerp(-15, -5, tabletT)}deg) scale(${lerp(.78, 1, tabletT)})`;
    tablet.style.opacity = (smooth(.10, .28, p) * lerp(.35, .78, tabletT)).toFixed(3);

    const watchT = smooth(0.24, 0.76, p);
    const watchX = mobile ? lerp(125, 42, watchT) : lerp(235, 75, watchT);
    const watchY = mobile ? lerp(160, 82, watchT) : lerp(230, 115, watchT);
    watch.style.transform = `translate3d(${watchX}px,${watchY}px,${lerp(-185, -20, watchT)}px) rotateY(${lerp(-60, -18, watchT)}deg) rotateX(${lerp(26, 9, watchT)}deg) rotateZ(${lerp(24, 8, watchT)}deg) scale(${lerp(.72, 1, watchT)})`;
    watch.style.opacity = (smooth(.20, .36, p) * lerp(.28, .78, watchT)).toFixed(3);

    const stagePush = mobile ? lerp(0, -18, finale) : lerp(0, 34, finale);
    const stageScale = mobile ? lerp(1, .94, finale) : lerp(1, .96, finale);
    if (mobile) {
      cinematic.querySelector('.device-stage').style.transform = `translate(-50%,calc(-50% + ${stagePush}px)) scale(${stageScale})`;
    } else {
      cinematic.querySelector('.device-stage').style.transform = `translateY(calc(-50% + ${stagePush}px)) scale(${stageScale})`;
    }

    glowA.style.transform = `translate3d(${lerp(-45, 75, p)}px,${lerp(0, -80, p)}px,0) scale(${lerp(1, 1.15, p)})`;
    glowB.style.transform = `translate3d(${lerp(55, -95, p)}px,${lerp(20, -45, p)}px,0) scale(${lerp(.95, 1.2, p)})`;
    cue.style.opacity = String(1 - smooth(.03, .15, p));
    exitWash.style.opacity = String(smooth(.89, 1, p));
  }

  function requestCinematicRender() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(renderCinematic);
    }
  }

  window.addEventListener('scroll', requestCinematicRender, { passive: true });
  window.addEventListener('resize', requestCinematicRender);
  renderCinematic();
} else if (cinematic) {
  document.body.classList.remove('cinematic-active');
}
