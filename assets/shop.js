/* ══════════════════════════════
   IM Sportswear — Shop JS
   ══════════════════════════════ */

document.getElementById('year').textContent = new Date().getFullYear();

const PRODUCTS = [
  {
    id: 'tennis-tee',
    name: 'Tennis Tee',
    subtitle: 'Dryfit Performance',
    cats: ['tenis', 'hombre', 'mujer'],
    price: 25990,
    link: 'https://pay.sumup.com/b2c/QOFL4KD7',
    desc: 'Polera técnica dryfit de alta performance. Tejido transpirable de secado rápido, diseñada para el movimiento libre. Corte deportivo con acabados premium. Disponible en Hombre y Mujer.',
    variants: {
      Mujer:  { Negro: {XS:2,M:3,L:3}, Navy: {M:3,L:3}, Blanco: {M:3,L:3} },
      Hombre: { Negro: {L:3,XL:3}, Navy: {L:3} }
    }
  },
  {
    id: 'calza-dua',
    name: 'Calza Larga DUA',
    subtitle: 'Running Mujer',
    cats: ['running', 'mujer'],
    price: 22990,
    link: 'https://pay.sumup.com/b2c/QULM76D1',
    desc: 'Calza de compresión larga para running y entrenamiento. Tejido dryfit de 4 vías de elasticidad, costuras planas anti-roce. Diseñada para máximo confort en cada kilómetro.',
    variants: {
      Mujer: { Negro: {S:2,M:3,L:3} }
    }
  },
  {
    id: 'peto-dryfit',
    name: 'Peto Dryfit',
    subtitle: 'Running Mujer',
    cats: ['running', 'mujer'],
    price: 17990,
    link: 'https://pay.sumup.com/b2c/QSJ3UCPD',
    desc: 'Peto deportivo dryfit de alto rendimiento. Escote deportivo con espalda descubierta para mayor movilidad. Ideal para running, entrenamiento y yoga.',
    variants: {
      Mujer: { Negro: {XS:1,M:3,L:3,XL:3} }
    }
  },
  {
    id: 'gorro-osaka',
    name: 'Gorro Osaka',
    subtitle: 'Lifestyle Accesorios',
    cats: ['accesorios', 'urban'],
    price: 14990,
    link: 'https://pay.sumup.com/b2c/QLSBEB6S',
    desc: 'Gorro estructurado de perfil medio con logo IM bordado al frente. Cierre ajustable trasero. Inspirado en la estética del tenis clásico con acabado moderno.',
    variants: {
      Unisex: { Blanco: {'Única':3}, Burdeo: {'Única':3}, Negro: {'Única':3} }
    }
  }
];

function clp(n) {
  return '$' + n.toLocaleString('es-CL');
}

function allColors(p) {
  const cols = new Set();
  Object.values(p.variants).forEach(g => Object.keys(g).forEach(c => cols.add(c)));
  return [...cols];
}

function totalStock(p) {
  return Object.values(p.variants).reduce((a,g) =>
    a + Object.values(g).reduce((b,sizes) =>
      b + Object.values(sizes).reduce((c,n)=>c+n,0),0),0);
}

/* ══════════════════════════════
   LISTING PAGE
   ══════════════════════════════ */
const grid = document.getElementById('product-grid');

if (grid) {
  PRODUCTS.forEach(p => {
    const tot = totalStock(p);
    const colors = allColors(p);
    const card = document.createElement('div');
    card.className = 'product-card-item';
    card.dataset.cats = JSON.stringify(p.cats);

    card.innerHTML = `
      <a href="/producto?id=${p.id}" class="card-img">
        <div class="card-img-placeholder">
          <span>IM</span>
          <span>${p.subtitle}</span>
        </div>
        <span class="card-badge ${tot===0?'out':'new'}">${tot===0?'Agotado':'Nuevo'}</span>
      </a>
      <div class="card-colors">
        ${colors.map(c=>`<span class="c-dot" data-c="${c}" title="${c}"></span>`).join('')}
      </div>
      <p class="card-cat">${p.subtitle}</p>
      <p class="card-name">${p.name}</p>
      <p class="card-price">${clp(p.price)}</p>
      <a class="card-link" href="/producto?id=${p.id}">
        Ver producto
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </a>
    `;
    grid.appendChild(card);
  });

  // Category filter
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.cat;
      let visible = 0;
      document.querySelectorAll('.product-card-item').forEach(c => {
        const cats = JSON.parse(c.dataset.cats||'[]');
        const show = f==='all' || cats.includes(f);
        c.classList.toggle('hidden', !show);
        if (show) visible++;
      });
      const empty = document.getElementById('grid-empty');
      if (empty) empty.style.display = visible===0 ? 'block' : 'none';
    });
  });
}

/* ══════════════════════════════
   PDP — Product Detail Page
   ══════════════════════════════ */
const pdpLayout = document.getElementById('pdp-layout');

if (pdpLayout) {
  const params = new URLSearchParams(window.location.search);
  const pid = params.get('id');
  const p = PRODUCTS.find(x => x.id === pid);

  if (!p) {
    pdpLayout.innerHTML = '<p style="padding:80px 0;text-align:center;color:var(--muted)">Producto no encontrado.</p>';
  } else {
    // Update page title & breadcrumb
    document.title = p.name + ' — IM Sportswear';
    const bc = document.getElementById('pdp-bc-product');
    if (bc) bc.textContent = p.name;

    const generos = Object.keys(p.variants);
    const multiG = generos.length > 1;
    const s = { genero: generos.length===1 ? generos[0] : null, color: null, talla: null };

    pdpLayout.innerHTML = `
      <div class="pdp-media">
        <div class="pdp-img-main">
          <div class="pdp-img-placeholder">
            <span class="im-mark">IM</span>
            <span class="prod-name-ghost">${p.name}</span>
          </div>
        </div>
      </div>

      <div class="pdp-info">
        <p class="pdp-eyebrow">${p.subtitle}</p>
        <h1 class="pdp-name">${p.name}</h1>
        <p class="pdp-price">${clp(p.price)}</p>
        <p class="pdp-desc">${p.desc}</p>

        <div class="pdp-variants">
          ${multiG ? `
          <div class="pdp-var-row" id="pdp-row-g">
            <div class="pdp-var-label">Género <strong id="lbl-g">—</strong></div>
            <div class="pdp-var-opts">
              ${generos.map(g=>`<button class="pdp-v-btn" data-g="${g}">${g}</button>`).join('')}
            </div>
          </div>` : ''}

          <div class="pdp-var-row">
            <div class="pdp-var-label">Color <strong id="lbl-c">—</strong></div>
            <div class="pdp-var-opts" id="pdp-color-opts"></div>
          </div>

          <div class="pdp-var-row" id="pdp-row-t" style="display:none">
            <div class="pdp-var-label">Talla <strong id="lbl-t">—</strong></div>
            <div class="pdp-var-opts" id="pdp-talla-opts"></div>
          </div>
        </div>

        <p class="pdp-stock" id="pdp-stock"></p>

        <a class="pdp-buy pending" id="pdp-btn" href="${p.link}" target="_blank" rel="noopener noreferrer">
          Selecciona opciones
        </a>

        <div class="pdp-shipping">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          Despacho en 5 días hábiles · Envío gratis sobre $50.000
        </div>
      </div>
    `;

    function getColors() {
      const g = s.genero || generos[0];
      return Object.keys(p.variants[g]||{});
    }
    function getSizes() {
      const g = s.genero || generos[0];
      return (g && s.color && p.variants[g]&&p.variants[g][s.color]) ? p.variants[g][s.color] : {};
    }

    function renderColors() {
      const wrap = document.getElementById('pdp-color-opts');
      wrap.innerHTML = getColors().map(c => {
        const g = s.genero||generos[0];
        const tot = Object.values(p.variants[g][c]).reduce((a,b)=>a+b,0);
        return `<button class="pdp-color-btn ${s.color===c?'sel':''}" data-color="${c}" title="${c}" ${tot===0?'disabled':''}></button>`;
      }).join('');
      wrap.querySelectorAll('.pdp-color-btn').forEach(b=>{
        b.addEventListener('click',()=>{ s.color=b.dataset.color; s.talla=null; update(); });
      });
    }

    function renderTallas() {
      const row = document.getElementById('pdp-row-t');
      const wrap = document.getElementById('pdp-talla-opts');
      const sizes = getSizes();
      const keys = Object.keys(sizes);
      if (!s.color||keys.length===0){ row.style.display='none'; return; }
      if (keys.length===1&&keys[0]==='Única'){ s.talla='Única'; row.style.display='none'; return; }
      row.style.display='';
      wrap.innerHTML = keys.map(t=>
        `<button class="pdp-v-btn ${s.talla===t?'sel':''}" data-t="${t}" ${sizes[t]===0?'disabled':''}>${t}</button>`
      ).join('');
      wrap.querySelectorAll('.pdp-v-btn').forEach(b=>{
        b.addEventListener('click',()=>{ s.talla=b.dataset.t; update(); });
      });
    }

    function renderStock() {
      const el = document.getElementById('pdp-stock');
      if (!s.talla){ el.textContent=''; el.className='pdp-stock'; return; }
      const qty = getSizes()[s.talla]||0;
      if (qty===0){ el.className='pdp-stock out'; el.textContent='Sin stock en esta talla'; }
      else if (qty<=2){ el.className='pdp-stock low'; el.textContent=`Últimas ${qty} unidades`; }
      else { el.className='pdp-stock ok'; el.textContent='Disponible'; }
    }

    function renderBtn() {
      const btn = document.getElementById('pdp-btn');
      const qty = s.talla ? (getSizes()[s.talla]||0) : 1;
      if (!s.color||!s.talla){ btn.textContent='Selecciona opciones'; btn.className='pdp-buy pending'; return; }
      if (qty===0){ btn.textContent='Agotado'; btn.className='pdp-buy sold-out'; return; }
      btn.textContent=`Comprar — ${clp(p.price)}`; btn.className='pdp-buy';
    }

    function update() {
      const lg=document.getElementById('lbl-g');
      const lc=document.getElementById('lbl-c');
      const lt=document.getElementById('lbl-t');
      if(lg) lg.textContent=s.genero||'—';
      if(lc) lc.textContent=s.color||'—';
      if(lt) lt.textContent=s.talla||'—';
      document.querySelectorAll('.pdp-v-btn[data-g]').forEach(b=>b.classList.toggle('sel',b.dataset.g===s.genero));
      renderColors(); renderTallas(); renderStock(); renderBtn();
    }

    if (multiG) {
      document.querySelectorAll('.pdp-v-btn[data-g]').forEach(b=>{
        b.addEventListener('click',()=>{ s.genero=b.dataset.g; s.color=null; s.talla=null; update(); });
      });
    }
    renderColors(); update();
  }
}

// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('site-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded')==='true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('is-open', !open);
  });
}
