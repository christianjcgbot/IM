document.getElementById('year').textContent = new Date().getFullYear();

const PRODUCTS = [
  {
    id: 'tennis-tee',
    name: 'Tennis Tee',
    subtitle: 'Dryfit Performance',
    price: 25990,
    link: 'https://pay.sumup.com/b2c/QOFL4KD7',
    cats: ['mujer', 'hombre', 'performance'],
    variants: {
      Mujer: {
        Negro:  { XS: 2, M: 3, L: 3 },
        Navy:   { M: 3, L: 3 },
        Blanco: { M: 3, L: 3 }
      },
      Hombre: {
        Negro: { L: 3, XL: 3 },
        Navy:  { L: 3 }
      }
    }
  },
  {
    id: 'gorro-osaka',
    name: 'Gorro Osaka',
    subtitle: 'Lifestyle Cap',
    price: 14990,
    link: 'https://pay.sumup.com/b2c/QLSBEB6S',
    cats: ['unisex', 'lifestyle'],
    variants: {
      Unisex: {
        Blanco: { 'Única': 3 },
        Burdeo: { 'Única': 3 },
        Negro:  { 'Única': 3 }
      }
    }
  },
  {
    id: 'calza-dua',
    name: 'Calza Larga DUA',
    subtitle: 'Performance',
    price: 22990,
    link: 'https://pay.sumup.com/b2c/QULM76D1',
    cats: ['mujer', 'performance'],
    variants: {
      Mujer: {
        Negro: { S: 2, M: 3, L: 3 }
      }
    }
  },
  {
    id: 'peto-dryfit',
    name: 'Peto Dryfit',
    subtitle: 'Performance',
    price: 17990,
    link: 'https://pay.sumup.com/b2c/QSJ3UCPD',
    cats: ['mujer', 'performance'],
    variants: {
      Mujer: {
        Negro: { XS: 1, M: 3, L: 3, XL: 3 }
      }
    }
  }
];

function clp(n) {
  return '$' + n.toLocaleString('es-CL');
}

function totalVariantStock(colorMap) {
  return Object.values(colorMap).reduce((a, sizes) =>
    a + Object.values(sizes).reduce((b, s) => b + s, 0), 0);
}

function buildCard(p) {
  const generos = Object.keys(p.variants);
  const multiGenero = generos.length > 1;
  const totalStock = generos.reduce((a, g) => a + totalVariantStock(p.variants[g]), 0);

  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.cats = JSON.stringify(p.cats);

  const s = { genero: generos.length === 1 ? generos[0] : null, color: null, talla: null };

  card.innerHTML = `
    <div class="product-img-wrap">
      <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--beige);">
        <span style="font-family:var(--font-display);font-size:2rem;letter-spacing:-0.02em;color:rgba(24,41,61,0.2);">IM</span>
      </div>
      <span class="product-badge ${totalStock === 0 ? 'badge-out' : ''}">${totalStock === 0 ? 'Agotado' : 'Nuevo'}</span>
    </div>
    <p class="product-subtitle">${p.subtitle}</p>
    <p class="product-name">${p.name}</p>
    <p class="product-price">${clp(p.price)}</p>

    ${multiGenero ? `
    <div class="variant-row" id="row-genero-${p.id}">
      <div class="variant-row-label">Género <strong class="lbl-g">—</strong></div>
      <div class="variant-opts">
        ${generos.map(g => `<button class="v-btn" data-g="${g}">${g}</button>`).join('')}
      </div>
    </div>` : ''}

    <div class="variant-row">
      <div class="variant-row-label">Color <strong class="lbl-c">—</strong></div>
      <div class="variant-opts color-opts-${p.id}"></div>
    </div>

    <div class="variant-row talla-row-${p.id}" style="display:none">
      <div class="variant-row-label">Talla <strong class="lbl-t">—</strong></div>
      <div class="variant-opts talla-opts-${p.id}"></div>
    </div>

    <p class="stock-msg" id="smsg-${p.id}"></p>
    <a class="btn-comprar pending" id="btn-${p.id}" href="${p.link}" target="_blank" rel="noopener">Selecciona opciones</a>
  `;

  function getColors() {
    const g = s.genero || generos[0];
    return Object.keys(p.variants[g] || {});
  }

  function getSizes() {
    const g = s.genero || generos[0];
    return (g && s.color && p.variants[g][s.color]) ? p.variants[g][s.color] : {};
  }

  function renderColors() {
    const wrap = card.querySelector(`.color-opts-${p.id}`);
    const colors = getColors();
    wrap.innerHTML = colors.map(c => {
      const tot = Object.values(p.variants[s.genero || generos[0]][c]).reduce((a,b)=>a+b,0);
      return `<button class="color-btn ${s.color===c?'sel':''}" data-color="${c}" title="${c}" ${tot===0?'disabled':''}></button>`;
    }).join('');
    wrap.querySelectorAll('.color-btn').forEach(b => {
      b.addEventListener('click', () => { s.color = b.dataset.color; s.talla = null; update(); });
    });
  }

  function renderTallas() {
    const row = card.querySelector(`.talla-row-${p.id}`);
    const wrap = card.querySelector(`.talla-opts-${p.id}`);
    const sizes = getSizes();
    const keys = Object.keys(sizes);
    if (!s.color || keys.length === 0) { row.style.display = 'none'; return; }
    if (keys.length === 1 && keys[0] === 'Única') { s.talla = 'Única'; row.style.display = 'none'; return; }
    row.style.display = '';
    wrap.innerHTML = keys.map(t =>
      `<button class="v-btn ${s.talla===t?'sel':''}" data-t="${t}" ${sizes[t]===0?'disabled':''}>${t}</button>`
    ).join('');
    wrap.querySelectorAll('.v-btn').forEach(b => {
      b.addEventListener('click', () => { s.talla = b.dataset.t; update(); });
    });
  }

  function renderStock() {
    const el = card.querySelector(`#smsg-${p.id}`);
    if (!s.talla) { el.textContent = ''; el.className = 'stock-msg'; return; }
    const qty = getSizes()[s.talla] || 0;
    if (qty === 0) { el.className = 'stock-msg out'; el.textContent = 'Sin stock en esta talla'; }
    else if (qty <= 2) { el.className = 'stock-msg low'; el.textContent = `Últimas ${qty} unidades`; }
    else { el.className = 'stock-msg'; el.textContent = 'Disponible'; }
  }

  function renderBtn() {
    const btn = card.querySelector(`#btn-${p.id}`);
    const sizes = getSizes();
    const qty = s.talla ? (sizes[s.talla] || 0) : 1;
    if (!s.color || !s.talla) {
      btn.textContent = 'Selecciona opciones';
      btn.className = 'btn-comprar pending';
      return;
    }
    if (qty === 0) {
      btn.textContent = 'Agotado';
      btn.className = 'btn-comprar disabled';
      return;
    }
    btn.textContent = `Comprar — ${clp(p.price)}`;
    btn.className = 'btn-comprar';
  }

  function update() {
    const lg = card.querySelector('.lbl-g');
    const lc = card.querySelector('.lbl-c');
    const lt = card.querySelector('.lbl-t');
    if (lg) lg.textContent = s.genero || '—';
    if (lc) lc.textContent = s.color || '—';
    if (lt) lt.textContent = s.talla || '—';
    card.querySelectorAll('.v-btn[data-g]').forEach(b => b.classList.toggle('sel', b.dataset.g === s.genero));
    renderColors();
    renderTallas();
    renderStock();
    renderBtn();
  }

  if (multiGenero) {
    card.querySelectorAll('.v-btn[data-g]').forEach(b => {
      b.addEventListener('click', () => { s.genero = b.dataset.g; s.color = null; s.talla = null; update(); });
    });
  }

  renderColors();
  update();
  return card;
}

// Filters
document.querySelectorAll('.filter-pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    let visible = 0;
    document.querySelectorAll('.product-card').forEach(c => {
      const cats = JSON.parse(c.dataset.cats || '[]');
      const show = f === 'all' || cats.includes(f);
      c.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    const empty = document.getElementById('shop-empty');
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
  });
});

// Render products
const grid = document.getElementById('shop-grid');
PRODUCTS.forEach(p => grid.appendChild(buildCard(p)));

// Mobile menu (same as main site)
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('site-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('is-open', !open);
  });
}
