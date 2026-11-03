(() => {
  const KITS = window.BG_KITS || [];
  const PRODUCTS = window.BG_PRODUCTS || [];
  const U = window.BG_UI; if (!U || !KITS.length) return;
  const { img, brl, HEX, optsOf, colorsOf, minOf, priced, NUMBER, esc } = U;
  const TAXA = 0.1829;
  const $ = id => document.getElementById(id);
  const byId = id => PRODUCTS.find(p => p.id === id);
  const listFor = it => it.ids ? it.ids.map(byId).filter(Boolean) : PRODUCTS.filter(p => p.cat === it.cat);
  const cheapest = p => minOf(priced(p)) || p.v[0];
  // desconto do item no kit, sem passar do limite (iPhones nunca abaixo do custo)
  const itemDesc = (v, rate) => { const d = v[2] * rate; return v[4] != null ? Math.min(d, v[4]) : d; };

  /* ---------- Vitrine: fileira de kits ---------- */
  function kitStart(k) {
    // combinação mais barata possível
    let pix = 0, desc = 0, imgs = [], ok = true;
    for (const it of k.itens) {
      if (it.acc) { pix += it.pix; desc += it.pix * k.desc; continue; }
      const list = listFor(it).filter(p => priced(p).length);
      const best = list.map(p => [p, cheapest(p)]).sort((a, b) => a[1][2] - b[1][2])[0];
      if (!best) { ok = false; continue; }
      pix += best[1][2]; desc += itemDesc(best[1], k.desc); imgs.push(img(best[0], best[1][1]));
    }
    return { pix: Math.round(pix - desc), full: pix, imgs, ok };
  }
  function kitCard(k) {
    const s = kitStart(k);
    const pics = k.itens.filter(i => !i.acc).map(i => { const p = byId(i.padrao) || listFor(i).filter(x => priced(x).length).slice(-1)[0]; return p ? img(p, cheapest(p)[1]) : ''; });
    return `<a class="st-card kit-card" href="#${k.id}">
      <span class="st-new">Kit · economize ${Math.round(k.desc * 100)}%</span>
      <h3>${k.nome}</h3>
      <p class="st-tag">${k.tag}</p>
      <div class="st-media kit-media">${pics.map((u, i) => `<img src="${u}" alt="" loading="lazy" class="kit-pic kit-pic-${i}" />`).join('')}</div>
      <div class="st-foot">
        <span class="st-price">A partir de ${brl(s.pix)}<small>ou 12x de ${brl(s.pix / (1 - TAXA) / 12)}</small></span>
        <span class="st-buy">Montar kit</span>
      </div>
    </a>`;
  }
  const secs = $('st-sections');
  if (secs) secs.insertAdjacentHTML('afterbegin', `<section class="st-sec" id="sec-kits">
      <div class="st-sec-head"><h2>Kits Apple. <span>Monte o seu e economize.</span></h2>
        <div class="st-arrows"><button type="button" class="st-arrow" data-dir="-1" aria-label="Ver anteriores">‹</button><button type="button" class="st-arrow" data-dir="1" aria-label="Ver próximos">›</button></div></div>
      <div class="st-row">${KITS.map(kitCard).join('')}</div>
    </section>`);
  const nav = document.querySelector('.st-cats');
  if (nav) nav.insertAdjacentHTML('afterbegin', `<a href="#sec-kits"><img src="${img(byId('iphone-17-pro') || PRODUCTS[0], 'Laranja-cósmico')}" alt="" /><span>Kits</span></a>`);

  /* ---------- Página do kit ---------- */
  let kit = null, state = [];
  function initState(k) {
    state = k.itens.map(it => {
      if (it.acc) return { acc: true };
      const list = listFor(it).filter(p => priced(p).length);
      const p = byId(it.padrao) || list.slice(-1)[0] || listFor(it)[0];
      const v = cheapest(p);
      return { pid: p.id, o: v[0], c: v[1] };
    });
  }
  function variant(st) { const p = byId(st.pid); return p.v.find(v => v[0] === st.o && v[1] === st.c); }

  function render() {
    const k = kit;
    let pix = 0, desc = 0, missing = false; const lines = [], pics = [];
    const blocks = k.itens.map((it, i) => {
      const st = state[i];
      if (it.acc) {
        pix += it.pix; desc += it.pix * k.desc;
        lines.push(`• ${it.label}: ${it.nota}`);
        return `<section class="kit-step"><h2><span class="kit-n">${i + 1}</span>${it.label}</h2>
          <div class="kit-acc"><p>${it.nota}</p><b>${brl(it.pix)}</b></div></section>`;
      }
      const p = byId(st.pid), v = variant(st), has = v && v[2] != null;
      if (has) { pix += v[2]; desc += itemDesc(v, k.desc); } else missing = true;
      pics.push(img(p, st.c));
      lines.push(`• ${p.nome} · ${[st.o, st.c].filter(Boolean).join(' · ')}${has ? ` (${brl(v[2])})` : ' (consultar)'}`);
      const opts = optsOf(p);
      return `<section class="kit-step" data-i="${i}"><h2><span class="kit-n">${i + 1}</span>${it.label}</h2>
        <label class="kit-label" for="kit-m-${i}">Modelo</label>
        <select class="kit-select" id="kit-m-${i}" data-i="${i}">${listFor(it).map(x => `<option value="${x.id}"${x.id === p.id ? ' selected' : ''}>${x.nome}${priced(x).length ? ` · a partir de ${brl(cheapest(x)[2])}` : ' · consultar'}</option>`).join('')}</select>
        ${opts.length > 1 || opts[0] ? `<span class="kit-label">Configuração</span><div class="kit-chips">${opts.map(o => { const w = p.v.find(x => x[0] === o && x[2] != null); return `<button type="button" class="kit-chip${w ? '' : ' off'}" data-i="${i}" data-o="${esc(o)}" aria-pressed="${o === st.o}">${o}</button>`; }).join('')}</div>` : ''}
        <span class="kit-label">Cor: <b>${st.c}</b></span>
        <div class="bp-swatches">${colorsOf(p).map(c => { const w = p.v.find(x => x[0] === st.o && x[1] === c); return `<button type="button" class="bp-sw${w && w[2] != null ? '' : ' off'}" role="radio" aria-checked="${c === st.c}" aria-label="${esc(c)}" title="${esc(c)}" data-i="${i}" data-c="${esc(c)}"><span style="background:${HEX[c] || '#bbb'}"></span></button>`; }).join('')}</div>
        <p class="kit-item-price">${has ? brl(v[2]) : 'Consultar'}</p>
      </section>`;
    }).join('');
    const total = Math.round(pix - desc), save = pix - total, card = total / (1 - TAXA);
    const msg = `Olá, BGTech Store! Quero montar o *${k.nome}*:\n\n${lines.join('\n')}\n\n• Valor do kit no site: ${missing ? 'consultar' : `${brl(total)} no Pix ou 12x de ${brl(card / 12)}`}\n\nPode confirmar disponibilidade e prazo?`;
    const url = `https://wa.me/${NUMBER}?text=${encodeURIComponent(msg)}`;
    $('view-kit').innerHTML = `
      <div class="bp-top">
        <nav class="bp-crumbs" aria-label="Você está em"><a href="/produtos">Produtos</a><span>›</span><a href="/produtos#sec-kits">Kits</a></nav>
        <span class="bp-new">Kit · economize ${Math.round(k.desc * 100)}%</span>
        <h1>${k.nome}</h1>
        <p class="bp-from">${k.tag}</p>
      </div>
      <div class="bp-grid">
        <div class="bp-gallery"><div class="bp-stage kit-stage">${pics.map((u, i) => `<img src="${u}" alt="" class="kit-pic kit-pic-${i}" />`).join('')}</div>
          <p class="bp-caption">Fotos ilustrativas de cada item na cor escolhida.</p></div>
        <div class="bp-config">${blocks}
          <section class="bp-summary" aria-live="polite">
            <p class="bp-sum-line"><b>Seu kit</b></p>
            <ul class="kit-lines">${lines.map(l => `<li>${l.slice(2)}</li>`).join('')}</ul>
            <div class="bp-sum-price">
              <div><small>${missing ? 'Kit' : `De <s>${brl(pix)}</s> por`}</small><strong>${missing ? 'Consultar' : brl(total)}</strong><small>${missing ? '' : `no Pix · você economiza ${brl(save)}`}</small></div>
              <div class="bp-sum-card">${missing ? 'Valor confirmado<br>no atendimento' : `ou no cartão<b>12x de ${brl(card / 12)}</b>`}</div>
            </div>
            <a class="bp-cta" href="${url}" target="_blank" rel="noopener noreferrer">Pedir kit pelo WhatsApp</a>
            <ul class="bp-perks"><li>Sem cadastro e sem pagamento no site</li><li>Disponibilidade e prazo confirmados na conversa</li></ul>
          </section>
        </div>
      </div>
      <div class="bp-bar"><div><small>${k.nome}</small><strong>${missing ? 'Consultar' : brl(total)}</strong></div><a class="bp-cta" href="${url}" target="_blank" rel="noopener noreferrer">Pedir</a></div>`;
  }

  const view = $('view-kit');
  view.addEventListener('change', e => {
    const s = e.target.closest('.kit-select'); if (!s) return;
    const i = +s.dataset.i, p = byId(s.value), v = cheapest(p);
    state[i] = { pid: p.id, o: v[0], c: v[1] }; render();
  });
  view.addEventListener('click', e => {
    const ch = e.target.closest('.kit-chip'), sw = e.target.closest('.bp-sw');
    if (!ch && !sw) return;
    const b = ch || sw, i = +b.dataset.i, st = state[i], p = byId(st.pid);
    if (ch) { st.o = ch.dataset.o; if (!p.v.find(v => v[0] === st.o && v[1] === st.c)) st.c = (minOf(p.v.filter(v => v[0] === st.o && v[2] != null)) || p.v.find(v => v[0] === st.o))[1]; }
    else { st.c = sw.dataset.c; if (!p.v.find(v => v[0] === st.o && v[1] === st.c)) st.o = (minOf(p.v.filter(v => v[1] === st.c && v[2] != null)) || p.v.find(v => v[1] === st.c))[0]; }
    render();
  });

  function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    const k = KITS.find(x => x.id === id);
    view.hidden = !k; document.body.classList.toggle('on-kit', !!k);
    if (k) { kit = k; initState(k); render(); document.title = `${k.nome} | BGTech Store`; window.scrollTo(0, 0); }
  }
  window.addEventListener('hashchange', route);
  route();
})();
