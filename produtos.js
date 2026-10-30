(() => {
  const PRODUCTS = window.BG_PRODUCTS || [];
  const NUMBER = typeof WHATSAPP_NUMBER !== 'undefined' ? WHATSAPP_NUMBER : '5511920193443';
  const CATS = [
    { id: 'iphone', label: 'iPhone', sub: 'Encontre o seu.' },
    { id: 'watch', label: 'Apple Watch', sub: 'Saúde e treino no pulso.' },
    { id: 'ipad', label: 'iPad', sub: 'Leve, versátil e poderoso.' },
    { id: 'mac', label: 'Mac', sub: 'Para estudar, trabalhar e criar.' }
  ];
  const CAT = Object.fromEntries(CATS.map(c => [c.id, c]));
  const FALLBACK = { iphone: 'assets/smartphone-fallback.png', watch: 'assets/smartwatch-bgtech-v42.png', ipad: 'assets/tablet-clean-v41.png', mac: 'assets/macbook-fallback.png' };
  const HEX = {"Azul":"#7a9cc9","Preto":"#2b2c30","Meia-noite":"#2c3340","Prateado":"#e3e4e6","Ultramarino":"#5a6fe6","Verde-acinzentado":"#7fb1ac","Estelar":"#f3ece0","Rosa":"#f4bfcc","Deserto":"#c8a985","Titânio natural":"#bab4aa","Dourado":"#e8d6aa","Lavanda":"#cdc1ea","Verde":"#adc9a9","Laranja-cósmico":"#e9783a","Azul-intenso":"#2a3f66","Glacial":"#cfe0ee","Bordô":"#6b1f2e","Ouro-rosa":"#e8c4b8","Preto-espacial":"#2a2b2e","Preto brilhante":"#111113","Cinza-espacial":"#6a6b70","Roxo":"#ab97d4","Blush":"#f0c9c0","Índigo":"#3b3f7a","Cítrico":"#e3e07a","Azul-céu":"#a8c6e2"};
  const OPT_TITLE = {
    iphone: 'Armazenamento. <span>Quanto espaço você precisa?</span>',
    ipad: 'Armazenamento. <span>Quanto espaço você precisa?</span>',
    watch: 'Modelo e tamanho. <span>Qual fica melhor no seu pulso?</span>',
    mac: 'Configuração. <span>Chip, memória e armazenamento.</span>'
  };

  const $ = id => document.getElementById(id);
  const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const base = p => p.foto ? `assets/produtos/${p.foto}.webp` : FALLBACK[p.cat];
  const img = (p, c) => p.fotos ? `assets/produtos/cores/${p.fotos[c] || p.fotos[Object.keys(p.fotos)[0]]}` : base(p);
  const sizeOf = s => { const last = String(s).split(/[\/·]/).pop().trim(); const n = parseFloat(last) || 0; return /TB/.test(last) ? n * 1024 : n; };
  const optsOf = p => [...new Set(p.v.map(v => v[0]))].sort((a, b) => sizeOf(a) - sizeOf(b) || a.localeCompare(b));
  const colorsOf = p => [...new Set(p.v.map(v => v[1]))];
  const priced = p => p.v.filter(v => v[2] != null);
  const minOf = list => list.length ? list.reduce((m, v) => v[2] < m[2] ? v : m) : null;
  const dot = c => `<span class="dot" style="background:${HEX[c] || '#bbb'}"></span>`;
  const esc = s => String(s).replace(/"/g, '&quot;');

  /* ---------- Vitrine ---------- */
  function card(p) {
    const m = minOf(priced(p));
    return `<a class="st-card" href="#${p.id}">
      <span class="st-new">${p.novo ? 'Novo' : ''}</span>
      <h3>${p.nome}</h3>
      <p class="st-tag">${p.tag}</p>
      <div class="st-media"><img src="${img(p, m && m[1])}" alt="${esc(p.nome)}" loading="lazy" /></div>
      <div class="st-swatch-row">${colorsOf(p).map(c => p.fotos && p.fotos[c] ? `<span class="dot" data-src="${img(p, c)}" style="background:${HEX[c] || '#bbb'}"></span>` : dot(c)).join('')}</div>
      <div class="st-foot">
        <span class="st-price">${m ? `A partir de ${brl(m[2])}<small>ou 12x de ${brl(m[3] / 12)}</small>` : `Preço sob consulta<small>fale com a BGTech</small>`}</span>
        <span class="st-buy">${m ? 'Comprar' : 'Consultar'}</span>
      </div>
    </a>`;
  }
  $('st-sections').innerHTML = CATS.map(c => {
    const list = PRODUCTS.filter(p => p.cat === c.id);
    if (!list.length) return '';
    return `<section class="st-sec" id="sec-${c.id}">
      <div class="st-sec-head"><h2>${c.label}. <span>${c.sub}</span></h2></div>
      <div class="st-row">${list.slice().reverse().map(card).join('')}</div>
    </section>`;
  }).join('');
  // Passar o mouse na bolinha troca a foto do card
  document.addEventListener('mouseover', e => {
    const d = e.target.closest('.st-card .dot[data-src]'); if (!d) return;
    const im = d.closest('.st-card').querySelector('.st-media img'); if (im.getAttribute('src') !== d.dataset.src) im.src = d.dataset.src;
  });
  document.querySelectorAll('.st-updated').forEach(el => el.textContent = window.BG_UPDATED || '');

  /* ---------- Página do produto ---------- */
  let cur = null, sel = {};
  const find = (o, c) => cur.v.find(v => v[0] === o && v[1] === c);

  function showProduct(p) {
    cur = p;
    const best = minOf(priced(p)) || p.v[0];
    sel = { o: best[0], c: best[1] };
    document.title = `Comprar ${p.nome} | BGTech Store`;
    $('bp-name').textContent = `Comprar ${p.nome}`;
    $('bp-new').hidden = !p.novo;
    $('bp-crumb-cat').textContent = CAT[p.cat].label;
    $('bp-crumb-cat').href = `/produtos#sec-${p.cat}`;
    const m = minOf(priced(p));
    $('bp-from').innerHTML = m ? `A partir de <b>${brl(m[2])}</b> no Pix <small>ou 12x de ${brl(m[3] / 12)}</small>` : 'Preço sob consulta';
    $('bp-img').src = img(p, sel.c); $('bp-img').alt = p.nome;
    $('bp-opt-title').innerHTML = OPT_TITLE[p.cat];
    $('bp-bar-name').textContent = p.nome;
    const rel = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(-6).reverse();
    $('bp-related').innerHTML = (rel.length ? rel : PRODUCTS.filter(x => x.id !== p.id).slice(0, 6)).map(card).join('');
    render(true);
  }

  // Aproxima a foto no aparelho da cor escolhida
  function focusColor(instant) {
    const im = $('bp-img');
    if (cur.fotos) {
      const src = img(cur, sel.c);
      im.style.transform = 'none';
      $('bp-caption').textContent = cur.fotos[sel.c] ? `${cur.nome} em ${sel.c}` : 'Foto ilustrativa. Cor confirmada no atendimento.';
      if (im.getAttribute('src') === src) return;
      if (instant) { im.src = src; return; }
      const next = new Image(); next.src = src;
      $('bp-stage').classList.add('swap');
      next.decode().catch(() => {}).then(() => setTimeout(() => { im.src = src; im.alt = `${cur.nome} em ${sel.c}`; $('bp-stage').classList.remove('swap'); }, 160));
      return;
    }
    const x = cur.pos && cur.pos[sel.c];
    if (x == null) { im.style.transform = 'none'; $('bp-caption').textContent = cur.pos ? 'Foto ilustrativa. Cor confirmada no atendimento.' : ''; return; }
    const z = 1 + ((cur.z || 1.6) - 1) * 0.55;
    const lim = (1 - 1 / z) / 2;
    const shift = Math.max(-lim, Math.min(lim, 0.5 - x));
    if (instant) { im.style.transition = 'none'; requestAnimationFrame(() => { im.style.transition = ''; }); }
    im.style.transform = `scale(${z}) translateX(${(shift * 100).toFixed(2)}%)`;
    $('bp-caption').textContent = `${cur.nome} em ${sel.c}`;
  }

  function render(first) {
    const p = cur;
    // Cores
    $('bp-swatches').innerHTML = colorsOf(p).map(c => {
      const v = find(sel.o, c);
      const ok = v && v[2] != null;
      return `<button type="button" class="bp-sw${ok ? '' : ' off'}" role="radio" aria-checked="${c === sel.c}" aria-label="${esc(c)}${ok ? '' : ' (consultar)'}" title="${esc(c)}" data-c="${esc(c)}"><span style="background:${HEX[c] || '#bbb'}"></span></button>`;
    }).join('');
    $('bp-color-name').innerHTML = `Cor: <b>${sel.c}</b>`;

    // Configurações
    const opts = optsOf(p);
    $('bp-step-opt').hidden = opts.length === 1 && !opts[0];
    $('bp-options').innerHTML = opts.map(o => {
      const v = find(o, sel.c) || minOf(p.v.filter(x => x[0] === o && x[2] != null));
      const has = v && v[2] != null;
      const avail = p.v.some(x => x[0] === o && x[1] === sel.c);
      return `<button type="button" class="bp-opt${has && avail ? '' : ' off'}" role="radio" aria-checked="${o === sel.o}" data-o="${esc(o)}">
        <span><b>${o || 'Único'}</b>${avail ? '' : `<small>não disponível em ${sel.c}</small>`}</span>
        <span class="bp-opt-price">${has ? `${brl(v[2])}<small>ou 12x de ${brl(v[3] / 12)}</small>` : 'Consultar'}</span>
      </button>`;
    }).join('');

    // Resumo e WhatsApp
    const v = find(sel.o, sel.c);
    const has = v && v[2] != null;
    const conf = [sel.o, sel.c].filter(Boolean).join(' · ');
    $('bp-sum-line').innerHTML = `<b>${p.nome}</b> · ${conf}`;
    $('bp-pix').textContent = has ? brl(v[2]) : 'Consultar';
    $('bp-card').innerHTML = has ? `ou no cartão<b>12x de ${brl(v[3] / 12)}</b>total ${brl(v[3])}` : 'Valor confirmado<br>no atendimento';
    const msg = `Olá, BGTech Store! Vi no site e quero encomendar:\n\n*${p.nome}*\n• Configuração: ${sel.o || '—'}\n• Cor: ${sel.c}\n• Valor no site: ${has ? `${brl(v[2])} no Pix ou 12x de ${brl(v[3] / 12)}` : 'consultar'}\n\nPode confirmar disponibilidade e prazo?`;
    const url = `https://wa.me/${NUMBER}?text=${encodeURIComponent(msg)}`;
    $('bp-cta').href = url; $('bp-bar-cta').href = url;
    $('bp-cta-text').textContent = has ? 'Pedir pelo WhatsApp' : 'Consultar pelo WhatsApp';
    $('bp-bar-price').textContent = has ? brl(v[2]) : 'Consultar';
    $('bp-bar-cta').textContent = has ? 'Pedir' : 'Consultar';
    focusColor(first);
  }

  $('bp-swatches').addEventListener('click', e => {
    const b = e.target.closest('.bp-sw'); if (!b) return;
    sel.c = b.dataset.c;
    if (!find(sel.o, sel.c)) { const alt = minOf(cur.v.filter(v => v[1] === sel.c && v[2] != null)) || cur.v.find(v => v[1] === sel.c); sel.o = alt[0]; }
    render(false);
  });
  $('bp-options').addEventListener('click', e => {
    const b = e.target.closest('.bp-opt'); if (!b) return;
    sel.o = b.dataset.o;
    if (!find(sel.o, sel.c)) { const alt = minOf(cur.v.filter(v => v[0] === sel.o && v[2] != null)) || cur.v.find(v => v[0] === sel.o); sel.c = alt[1]; }
    render(false);
  });
  $('bp-swatches').addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const bs = [...$('bp-swatches').children]; const i = bs.findIndex(b => b.dataset.c === sel.c);
    const n = bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length];
    n.click(); $('bp-swatches').querySelector(`[data-c="${n.dataset.c}"]`)?.focus(); e.preventDefault();
  });

  /* ---------- Foto ampliada ---------- */
  const openZoom = () => { $('zoom-img').src = $('bp-img').src; $('zoom-img').alt = $('bp-img').alt; $('zoom').hidden = false; $('zoom-close').focus(); };
  $('bp-img').addEventListener('click', openZoom);
  $('bp-zoom').addEventListener('click', openZoom);
  $('zoom').addEventListener('click', () => { $('zoom').hidden = true; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $('zoom').hidden = true; });

  /* ---------- Rotas: /produtos e /produtos#id ---------- */
  const baseTitle = document.title;
  function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    const p = PRODUCTS.find(x => x.id === id);
    $('view-list').hidden = !!p; $('view-product').hidden = !p;
    document.body.classList.toggle('on-product', !!p);
    if (p) { showProduct(p); window.scrollTo(0, 0); }
    else {
      document.title = baseTitle;
      if (id) document.getElementById(id)?.scrollIntoView();
    }
  }
  window.addEventListener('hashchange', route);
  route();
})();
