(() => {
  const PRODUCTS = window.BG_PRODUCTS || [];
  const NUMBER = typeof WHATSAPP_NUMBER !== 'undefined' ? WHATSAPP_NUMBER : '5511920193443';
  const CAT_LABEL = { iphone: 'iPhone', watch: 'Apple Watch', ipad: 'iPad', mac: 'Mac' };
  const FALLBACK = { iphone: 'assets/smartphone-fallback.png', watch: 'assets/smartwatch-bgtech-v42.png', ipad: 'assets/tablet-clean-v41.png', mac: 'assets/macbook-fallback.png' };
  const HEX = {"Azul":"#6f93c4","Preto":"#1d1f24","Meia-noite":"#232a36","Prateado":"#d9dbdf","Ultramarino":"#5a6fe6","Verde-acinzentado":"#7fb1ac","Estelar":"#f1e9db","Rosa":"#f2b8c6","Deserto":"#c8a985","Titânio natural":"#bab4aa","Dourado":"#e6d2a2","Lavanda":"#c8bbe8","Verde":"#a8c9a8","Laranja-cósmico":"#e9783a","Azul-intenso":"#24395f","Glacial":"#d7e6f1","Bordô":"#6b1f2e","Ouro-rosa":"#e8c4b8","Preto-espacial":"#2a2b2e","Preto brilhante":"#0d0d0f","Cinza-espacial":"#6a6b70","Roxo":"#a893d2","Blush":"#f0c9c0","Índigo":"#3b3f7a","Cítrico":"#e3e07a","Azul-céu":"#a8c6e2"};

  const $ = id => document.getElementById(id);
  const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const img = p => p.foto ? `assets/produtos/${p.foto}.webp` : FALLBACK[p.cat];
  const sizeOf = s => { const last = s.split(/[\/·]/).pop().trim(); const n = parseFloat(last); return /TB/.test(last) ? n * 1024 : n; };
  const optsOf = p => [...new Set(p.v.map(v => v[0]))].sort((a, b) => sizeOf(a) - sizeOf(b) || a.localeCompare(b));
  const colorsOf = p => [...new Set(p.v.map(v => v[1]))];
  const priced = p => p.v.filter(v => v[2] != null);
  const dot = c => `<span class="p-dot" style="background:${HEX[c] || '#bbb'}"></span>`;

  // Grade
  let cat = 'all';
  const grid = $('shop-grid');
  function drawGrid() {
    grid.innerHTML = PRODUCTS.filter(p => cat === 'all' || p.cat === cat).map(p => {
      const ok = priced(p); const min = ok.length ? Math.min(...ok.map(v => v[2])) : null;
      const opts = optsOf(p).filter(Boolean);
      return `<button type="button" class="p-card" data-id="${p.id}">
        <div class="p-media"><img src="${img(p)}" alt="${p.nome}" loading="lazy" /></div>
        <div class="p-body">
          <span class="card-kicker">${CAT_LABEL[p.cat].toUpperCase()}</span>
          <h3>${p.nome}</h3>
          <span class="p-opts">${opts.length ? opts.join(' · ') : p.tag}</span>
          <div class="p-dots">${colorsOf(p).map(dot).join('')}</div>
          <div class="p-foot">
            <div class="p-price">${min ? `<small>a partir de</small><strong>${brl(min)}</strong>` : `<small>preço</small><strong>Consultar</strong>`}</div>
            <span class="p-go">Ver opções →</span>
          </div>
        </div></button>`;
    }).join('');
  }
  document.querySelectorAll('.shop-chip').forEach(b => b.addEventListener('click', () => {
    cat = b.dataset.cat;
    document.querySelectorAll('.shop-chip').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    drawGrid();
  }));
  grid.addEventListener('click', e => { const c = e.target.closest('.p-card'); if (c) openProduct(c.dataset.id, true); });

  // Detalhe do produto
  let cur = null, sel = {}, lastFocus = null;
  const find = (o, c) => cur.v.find(v => v[0] === o && v[1] === c);
  function openProduct(id, push) {
    cur = PRODUCTS.find(p => p.id === id); if (!cur) return;
    lastFocus = document.activeElement;
    const cheapest = [...priced(cur)].sort((a, b) => a[2] - b[2])[0] || cur.v[0];
    sel = { o: cheapest[0], c: cheapest[1] };
    $('pd-img').src = img(cur); $('pd-img').alt = cur.nome;
    $('pd-name').textContent = cur.nome; $('pd-tag').textContent = cur.tag;
    renderProduct();
    $('pd').hidden = false; document.body.classList.add('pd-open'); $('pd-close').focus();
    if (push && location.hash !== '#' + id) history.pushState(null, '', '#' + id);
  }
  function closeProduct(fromHistory) {
    if ($('pd').hidden) return;
    $('pd').hidden = true; $('zoom').hidden = true; document.body.classList.remove('pd-open');
    if (!fromHistory && location.hash) history.pushState(null, '', location.pathname);
    lastFocus?.focus?.();
  }
  function renderProduct() {
    const opts = optsOf(cur);
    $('pd-opt-group').hidden = opts.length === 1 && !opts[0];
    $('pd-opts').innerHTML = opts.map(o => {
      const any = cur.v.some(v => v[0] === o && v[2] != null);
      return `<button type="button" class="pd-chip${any ? '' : ' soldout'}" data-o="${o}" aria-pressed="${o === sel.o}">${o}</button>`;
    }).join('');
    const cols = cur.v.filter(v => v[0] === sel.o).map(v => v[1]);
    if (!cols.includes(sel.c)) sel.c = (cur.v.find(v => v[0] === sel.o && v[2] != null) || cur.v.find(v => v[0] === sel.o))[1];
    $('pd-colors').innerHTML = cols.map(c => {
      const v = find(sel.o, c);
      return `<button type="button" class="pd-chip${v[2] != null ? '' : ' soldout'}" data-c="${c}" aria-pressed="${c === sel.c}">${dot(c)}${c}</button>`;
    }).join('');
    $('pd-color-name').textContent = sel.c;
    const v = find(sel.o, sel.c); const has = v && v[2] != null;
    $('pd-pix').textContent = has ? brl(v[2]) : 'Consultar';
    $('pd-card').innerHTML = has ? `ou no cartão em até 12x<b>12x de ${brl(v[3] / 12)}</b>total ${brl(v[3])}` : 'Valor confirmado<br>no atendimento';
    const conf = sel.o ? `${sel.o} · ${sel.c}` : sel.c;
    const msg = `Olá, BGTech Store! Vi no site e quero encomendar:\n\n*${cur.nome}*\n• Configuração: ${sel.o || '—'}\n• Cor: ${sel.c}\n• Valor no site: ${has ? `${brl(v[2])} no Pix ou 12x de ${brl(v[3] / 12)}` : 'consultar'}\n\nPode confirmar disponibilidade e prazo?`;
    $('pd-wa').href = `https://wa.me/${NUMBER}?text=${encodeURIComponent(msg)}`;
    $('pd-wa').textContent = has ? `Pedir ${conf} pelo WhatsApp` : 'Consultar pelo WhatsApp';
  }
  $('pd-opts').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { sel.o = b.dataset.o; renderProduct(); } });
  $('pd-colors').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { sel.c = b.dataset.c; renderProduct(); } });
  $('pd-close').addEventListener('click', () => closeProduct(false));
  $('pd').addEventListener('click', e => { if (e.target.id === 'pd') closeProduct(false); });

  // Foto ampliada
  const openZoom = () => { $('zoom-img').src = $('pd-img').src; $('zoom-img').alt = $('pd-img').alt; $('zoom').hidden = false; $('zoom-close').focus(); };
  $('pd-img').addEventListener('click', openZoom); $('pd-zoom').addEventListener('click', openZoom);
  $('zoom').addEventListener('click', () => { $('zoom').hidden = true; $('pd-zoom').focus(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!$('zoom').hidden) { $('zoom').hidden = true; return; }
    closeProduct(false);
  });

  // Link direto: /produtos#iphone-17-pro
  function fromHash() { const id = decodeURIComponent(location.hash.slice(1)); if (id && PRODUCTS.some(p => p.id === id)) openProduct(id, false); else closeProduct(true); }
  window.addEventListener('popstate', fromHash);

  const upd = $('shop-updated'); if (upd) upd.textContent = window.BG_UPDATED || '';
  drawGrid(); fromHash();
})();
