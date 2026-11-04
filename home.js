(() => {
  const home = document.querySelector('.home'); if (!home) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const P = window.BG_PRODUCTS || [], K = window.BG_KITS || [];
  const TAXA = 0.1829;
  const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const byId = id => P.find(p => p.id === id);
  const cheapest = p => p.v.filter(v => v[2] != null).sort((a, b) => a[2] - b[2])[0];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  requestAnimationFrame(() => home.classList.add('ready'));

  // Preços vindos do catálogo
  document.querySelectorAll('.h-price[data-id]').forEach(el => {
    const p = byId(el.dataset.id), v = p && cheapest(p);
    el.innerHTML = v ? `A partir de <b>${brl(v[2])}</b> no Pix <small>ou 12x de ${brl(v[3] / 12)}</small>` : '';
  });
  document.querySelectorAll('.h-kit[data-kit]').forEach(el => {
    const k = K.find(x => x.id === el.dataset.kit); if (!k) return;
    let pix = 0, desc = 0;
    for (const it of k.itens) {
      if (it.acc) { pix += it.pix; desc += it.pix * k.desc; continue; }
      const list = (it.ids ? it.ids.map(byId) : P.filter(p => p.cat === it.cat)).filter(Boolean);
      const best = list.map(cheapest).filter(Boolean).sort((a, b) => a[2] - b[2])[0]; if (!best) continue;
      pix += best[2]; desc += best[4] != null ? Math.min(best[2] * k.desc, best[4]) : best[2] * k.desc;
    }
    el.querySelector('.h-kit-price').innerHTML = `A partir de <b>${brl(pix - desc)}</b> no Pix · economize ${Math.round(k.desc * 100)}%`;
  });

  // Kits: peças se juntam quando aparecem
  const kits = document.querySelectorAll('.h-kit, .h-and');
  if (reduce || !('IntersectionObserver' in window)) kits.forEach(k => k.classList.add('in'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .35 });
    kits.forEach(k => io.observe(k));
  }
  if (reduce) return;

  // Abertura: aparelhos se abrem em leque ao rolar
  const hero = document.querySelector('.h-hero');
  const phones = [...document.querySelectorAll('.h-ph')];
  // Lançamentos fixos
  const launch = document.querySelector('.h-launch');
  const slides = [...document.querySelectorAll('.h-slide')];
  const shots = [...document.querySelectorAll('.h-shot')];
  const dots = [...document.querySelectorAll('.h-dots span')];
  const colorImgs = [...shots[0].querySelectorAll('img')];
  const colorName = document.querySelector('.h-color');
  const ring = document.querySelector('.h-ring');
  let cur = -1, curColor = -1, ticking = false;

  function frame() {
    ticking = false;
    // abertura
    const hr = hero.getBoundingClientRect();
    const hp = clamp(-hr.top / Math.max(1, hr.height));
    phones.forEach((ph, i) => {
      const dir = i - 1;
      ph.style.setProperty('--sx', `${dir * hp * 38}%`);
      ph.style.setProperty('--sy', `${hp * (i === 1 ? -40 : 30)}px`);
      ph.style.setProperty('--sr', `${1 + hp * 1.2}`);
      ph.style.setProperty('--ss', `${1 - hp * 0.12}`);
    });
    // lançamentos
    const lr = launch.getBoundingClientRect();
    const lp = clamp(-lr.top / Math.max(1, launch.offsetHeight - innerHeight));
    const idx = Math.min(2, Math.floor(lp * 3));
    if (idx !== cur) {
      cur = idx;
      slides.forEach((s, i) => s.classList.toggle('is-on', i === idx));
      shots.forEach((s, i) => s.classList.toggle('is-on', i === idx));
      dots.forEach((d, i) => d.classList.toggle('is-on', i === idx));
    }
    // cores do iPhone 18 Pro mudam enquanto rola o primeiro trecho
    const local = clamp(lp * 3);
    const ci = Math.min(colorImgs.length - 1, Math.floor(local * colorImgs.length));
    if (ci !== curColor) {
      curColor = ci;
      colorImgs.forEach((im, i) => im.classList.toggle('is-on', i === ci));
      colorName.textContent = colorImgs[ci].dataset.c;
    }
    const seg = (lp * 3) % 1;
    shots[idx].querySelectorAll('img').forEach(im => im.style.setProperty('--rot', `${(seg - .5) * -8}deg`));
    ring.style.setProperty('--ring', (0.9 + Math.sin(seg * Math.PI) * 0.18).toFixed(3));
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', req, { passive: true }); addEventListener('resize', req); frame();
})();
