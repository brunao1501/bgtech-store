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

// Cinematic scroll experience
const cinematic = document.querySelector('.cinematic');
const cinematicSticky = document.querySelector('.cinematic-sticky');

if (cinematic && cinematicSticky && !reduceMotion) {
  const showcase = cinematic.querySelector('.showcase-device');
  const copyA = cinematic.querySelector('.cine-copy-a');
  const copyB = cinematic.querySelector('.cine-copy-b');
  const copyC = cinematic.querySelector('.cine-copy-c');
  const cue = cinematic.querySelector('.scroll-cue');
  const exitWash = cinematic.querySelector('.cine-exit-wash');
  const glowA = cinematic.querySelector('.cine-glow-a');
  const glowB = cinematic.querySelector('.cine-glow-b');
  const chipA = cinematic.querySelector('.chip-a');
  const chipB = cinematic.querySelector('.chip-b');

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
    const mobile = window.innerWidth <= 720;

    cinematic.style.setProperty('--cine-p', p.toFixed(4));
    document.body.classList.toggle('cinematic-active', active);

    const a = phaseOpacity(0, 0.04, 0.22, 0.34, p);
    const b = phaseOpacity(0.27, 0.38, 0.54, 0.66, p);
    const c = smooth(0.60, 0.74, p) * (1 - smooth(0.96, 1, p) * 0.35);

    copyA.style.opacity = a.toFixed(3);
    copyB.style.opacity = b.toFixed(3);
    copyC.style.opacity = c.toFixed(3);

    const copyShiftA = lerp(0, -34, smooth(0.15, 0.34, p));
    const copyShiftB = lerp(30, -16, smooth(0.27, 0.66, p));
    const copyShiftC = lerp(32, 0, smooth(0.60, 0.78, p));

    if (!mobile) {
      copyA.style.transform = `translateY(calc(-50% + ${copyShiftA}px))`;
      copyB.style.transform = `translateY(calc(-50% + ${copyShiftB}px))`;
      copyC.style.transform = `translateY(calc(-50% + ${copyShiftC}px))`;
    } else {
      copyA.style.transform = `translateY(${copyShiftA * .35}px)`;
      copyB.style.transform = `translateY(${copyShiftB * .35}px)`;
      copyC.style.transform = `translateY(${copyShiftC * .35}px)`;
    }

    const t = smooth(0.03, 0.84, p);
    const finale = smooth(0.64, 0.94, p);
    const scale = mobile ? lerp(.88, 1.02, t) : lerp(.86, 1.06, t);
    const x = mobile ? lerp(24, -8, t) : lerp(95, -18, t);
    const y = mobile ? lerp(-8, 10, t) : lerp(42, -12, t);
    const rot = mobile ? lerp(2.5, -1, t) : lerp(5, -2.5, t);

    showcase.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rot}deg) scale(${scale - finale * .035})`;
    showcase.style.opacity = clamp(smooth(0.02, 0.13, p) * (1 - smooth(.985, 1, p) * .22)).toFixed(3);

    if (chipA && chipB) {
      chipA.style.transform = `translate3d(0,${lerp(12, -8, t)}px,0)`;
      chipB.style.transform = `translate3d(0,${lerp(-8, 10, t)}px,0)`;
      chipA.style.opacity = String(clamp(smooth(.08, .28, p) * .95));
      chipB.style.opacity = String(clamp(smooth(.18, .42, p) * .9));
    }

    const stagePush = mobile ? lerp(0, -10, finale) : lerp(0, 22, finale);
    const stageScale = mobile ? lerp(1, .97, finale) : lerp(1, .98, finale);
    const stage = cinematic.querySelector('.device-stage');
    if (mobile) {
      stage.style.transform = `translate(-50%,calc(-50% + ${stagePush}px)) scale(${stageScale})`;
    } else {
      stage.style.transform = `translateY(calc(-50% + ${stagePush}px)) scale(${stageScale})`;
    }

    glowA.style.transform = `translate3d(${lerp(-40, 68, p)}px,${lerp(0, -70, p)}px,0) scale(${lerp(1, 1.12, p)})`;
    glowB.style.transform = `translate3d(${lerp(50, -82, p)}px,${lerp(18, -38, p)}px,0) scale(${lerp(.96, 1.17, p)})`;
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
