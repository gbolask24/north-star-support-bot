// HTML renderers for each store view. Pure functions: state in, string out.
// All interactivity is wired via data-* attributes handled in store.ts.

import { FILTERS, money, Product, productById, PRODUCTS, related, Motif } from './catalog';
import { CartLine, count, subtotal } from './cart';
import { Route } from './router';

// ---- product artwork -------------------------------------------------------

const MOTIF_SVG: Record<Motif, string> = {
  tent: `<path class="a1" d="M100 18 L178 104 L22 104 Z" /><path class="a2" d="M100 18 L136 104 L64 104 Z" /><path class="a3" d="M100 40 L118 104 L82 104 Z" /><rect class="ground" x="10" y="104" width="180" height="4" rx="2" />`,
  pack: `<rect class="a1" x="64" y="30" width="72" height="74" rx="14" /><rect class="a2" x="78" y="66" width="44" height="38" rx="8" /><path class="a3" d="M76 30 Q100 8 124 30" fill="none" stroke-width="8" /><rect class="a3" x="92" y="44" width="16" height="6" rx="3" />`,
  jacket: `<path class="a1" d="M78 26 Q100 14 122 26 L150 44 L138 70 L128 58 L128 104 L72 104 L72 58 L62 70 L50 44 Z" /><path class="a3" d="M96 30 L104 30 L104 104 L96 104 Z" /><circle class="a2" cx="100" cy="24" r="10" />`,
  tee: `<path class="a1" d="M74 30 L92 22 Q100 30 108 22 L126 30 L142 46 L128 60 L124 52 L124 100 L76 100 L76 52 L72 60 L58 46 Z" /><rect class="a3" x="97" y="26" width="6" height="74" rx="3" />`,
  rain: `<path class="a2" d="M60 52 Q60 30 84 30 Q92 12 116 16 Q140 20 140 40 Q160 42 158 60 Q156 76 136 76 L66 76 Q48 74 48 62 Q48 54 60 52 Z" /><line class="rain" x1="76" y1="88" x2="70" y2="102" /><line class="rain" x1="102" y1="88" x2="96" y2="102" /><line class="rain" x1="128" y1="88" x2="122" y2="102" />`,
  bag: `<rect class="a1" x="46" y="42" width="108" height="46" rx="23" /><rect class="a2" x="46" y="42" width="40" height="46" rx="20" /><path class="a3" d="M96 50 L96 80" stroke-width="6" fill="none" />`,
  poles: `<line class="pole" x1="78" y1="20" x2="88" y2="104" /><line class="pole" x1="122" y1="20" x2="112" y2="104" /><circle class="a2" cx="78" cy="20" r="8" /><circle class="a2" cx="122" cy="20" r="8" /><path class="a3" d="M80 84 L96 84 M104 84 L120 84" stroke-width="6" fill="none" />`,
  chair: `<path class="a1" d="M56 34 L92 82 L64 104 Z" /><path class="a1" d="M144 34 L108 82 L136 104 Z" /><path class="a2" d="M60 38 Q100 62 140 38 L128 74 Q100 92 72 74 Z" /><rect class="ground" x="40" y="104" width="120" height="4" rx="2" />`,
};

export function art(motif: Motif, size: 'card' | 'hero' = 'card'): string {
  const cls = size === 'hero' ? 'card-art art-hero' : 'card-art';
  return `<div class="${cls}" aria-hidden="true"><svg viewBox="0 0 200 120">${MOTIF_SVG[motif]}</svg></div>`;
}

// ---- shared bits ------------------------------------------------------------

function productCard(p: Product): string {
  return `
  <article class="card reveal">
    <a class="card-link" href="#/product/${p.id}" aria-label="View ${p.name}">
      ${art(p.motif)}
      <h3>${p.name}</h3>
      <p>${p.blurb}</p>
    </a>
    <div class="card-buy">
      <span class="price">${money(p.price)}</span>
      <button type="button" class="btn-mini" data-add="${p.id}">Add to cart</button>
    </div>
  </article>`;
}

// ---- views ------------------------------------------------------------------

export function homeView(): string {
  const featured = ['firefly-2p', 'aurora-parka', 'longhaul-65', 'monsoon-hardshell']
    .map((id) => productById(id))
    .filter((p): p is Product => p !== null);
  return `
  <section class="hero" id="top">
    <svg class="hero-sky" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g class="constellation">
        <circle cx="140" cy="80" r="2.5" /><circle cx="260" cy="140" r="1.8" />
        <circle cx="380" cy="70" r="2.2" /><circle cx="520" cy="150" r="1.6" />
        <circle cx="660" cy="60" r="2.4" /><circle cx="800" cy="130" r="1.8" />
        <circle cx="930" cy="70" r="2.1" /><circle cx="1060" cy="150" r="1.7" />
        <path d="M140 80 L260 140 L380 70 L520 150 L660 60 L800 130 L930 70 L1060 150" />
      </g>
      <g class="ridge"><path d="M0 420 L0 330 L180 250 L340 320 L520 210 L700 310 L880 240 L1040 300 L1200 250 L1200 420 Z" /></g>
      <g class="ridge ridge-near"><path d="M0 420 L0 370 L220 300 L430 360 L640 280 L860 350 L1080 300 L1200 330 L1200 420 Z" /></g>
    </svg>
    <div class="hero-inner">
      <p class="eyebrow">Outfitting North American trails since 2012</p>
      <h1>Gear for the<br />trail ahead.</h1>
      <p class="hero-sub">
        Apparel and camping gear tested in real weather, backed by real support.
        Our team answers in seconds, day or night.
      </p>
      <div class="hero-actions">
        <button type="button" class="btn btn-blaze" data-open-chat>💬 Chat with support</button>
        <a class="btn btn-ghost" href="#/shop">Browse gear</a>
      </div>
    </div>
  </section>

  <section class="shop-section">
    <div class="section-head">
      <h2>Trail-tested favorites</h2>
      <p>A taste of the catalog. Our support bot knows every collection, ask it anything.</p>
    </div>
    <div class="card-grid">
      ${featured.map(productCard).join('')}
    </div>
    <p class="center-cta"><a class="btn btn-pine" href="#/shop">Shop all gear →</a></p>
  </section>

  <section class="why" id="why">
    <div class="why-item reveal"><h3>30-day returns</h3><p>Unused items in original packaging. No drama, no fine print.</p></div>
    <div class="why-item reveal"><h3>Fast shipping</h3><p>Standard in 3-5 business days, expedited in 1-2.</p></div>
    <div class="why-item reveal"><h3>Real support</h3><p>Instant answers from our bot, and a human whenever you want one.</p></div>
  </section>`;
}

export function shopView(filter: string): string {
  const active = FILTERS.some((f) => f.id === filter) ? filter : 'all';
  const items =
    active === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.activityId === active);
  return `
  <section class="page">
    <div class="section-head">
      <h2>Shop all gear</h2>
      <p>${items.length} trail-tested item${items.length === 1 ? '' : 's'}${active === 'all' ? '' : ' for ' + FILTERS.find((f) => f.id === active)!.label.replace(/^\S+ /, '')}</p>
    </div>
    <nav class="filter-bar" aria-label="Filter products">
      ${FILTERS.map(
        (f) =>
          `<a class="filter-chip${f.id === active ? ' is-active' : ''}" href="#/shop/${f.id === 'all' ? '' : f.id}">${f.label}</a>`,
      ).join('')}
    </nav>
    <div class="card-grid">${items.map(productCard).join('')}</div>
  </section>`;
}

export function productView(id: string): string {
  const p = productById(id);
  if (!p) {
    return `<section class="page center"><h2>Trail not found</h2><p>That product wandered off the map.</p><p><a class="btn btn-pine" href="#/shop">Back to the shop</a></p></section>`;
  }
  const rel = related(p);
  return `
  <section class="page product-page">
    <p class="breadcrumb"><a href="#/shop">Shop</a> / <a href="#/shop/${p.activityId}">${cap(p.activityId)}</a> / ${p.name}</p>
    <div class="product-layout">
      <div class="product-art reveal">${art(p.motif, 'hero')}</div>
      <div class="product-info">
        <p class="eyebrow-dark">${p.category}</p>
        <h2>${p.name}</h2>
        <p class="product-price">${money(p.price)}</p>
        <p class="product-detail">${p.detail}</p>
        <ul class="product-perks">
          <li>🚚 Standard shipping 3-5 business days (expedited 1-2)</li>
          <li>↩️ 30-day returns, unused, in original packaging</li>
        </ul>
        <div class="product-actions">
          <button type="button" class="btn btn-blaze" data-add="${p.id}">Add to cart</button>
          <button type="button" class="btn btn-outline" data-ask="I'm looking for ${p.category.toLowerCase()}">🧭 Ask the bot about this</button>
        </div>
      </div>
    </div>
    ${
      rel.length
        ? `<div class="section-head related-head"><h2>Pairs well with</h2></div>
           <div class="card-grid">${rel.map(productCard).join('')}</div>`
        : ''
    }
  </section>`;
}

const FAQS: { q: string; a: string; ask: string }[] = [
  {
    q: 'How do I track my order?',
    a: 'Ask our support bot to track your order and give it your order number from your confirmation email. Demo tip for reviewers: try order numbers 111, 222, and 333 to see each status, or any other number to see how an unknown order is handled.',
    ask: "Where's my order?",
  },
  {
    q: 'What is your return policy?',
    a: 'We offer 30-day returns. Items must be unused and in their original packaging. Exchanges work the same way, just pick "exchange" on the returns page.',
    ask: 'What is your return policy?',
  },
  {
    q: 'How do exchanges work?',
    a: 'Exchanges follow the same policy as returns: 30 days, unused items, original packaging. Start on the returns page, pick "exchange", and choose the size or color you want instead.',
    ask: 'What is your exchange policy?',
  },
  {
    q: 'How fast is shipping?',
    a: 'Standard shipping takes 3-5 business days. Expedited shipping takes 1-2 business days.',
    ask: 'How long does shipping take?',
  },
  {
    q: 'Can you help me pick the right gear?',
    a: 'Absolutely. The support bot asks a couple of quick questions about your adventure and points you to the right collection.',
    ask: 'Can you recommend some gear?',
  },
  {
    q: 'Can I talk to a real person?',
    a: 'Any time. Ask the bot for a live agent and it hands you off to our (simulated) support teammate Riley, and you can return to the bot whenever you like.',
    ask: 'Talk to a live agent',
  },
];

export function faqView(): string {
  return `
  <section class="page page-narrow">
    <div class="section-head">
      <h2>FAQ & Support</h2>
      <p>Quick answers, and a bot that knows all of them by heart.</p>
    </div>
    <div class="faq-list">
      ${FAQS.map(
        (f) => `
      <details class="faq-item reveal">
        <summary>${f.q}</summary>
        <div class="faq-body">
          <p>${f.a}</p>
          <button type="button" class="btn-mini btn-mini-ghost" data-ask="${f.ask.replace(/"/g, '&quot;')}">💬 Ask the bot</button>
        </div>
      </details>`,
      ).join('')}
    </div>
    <div class="support-cta reveal">
      <h3>Still stuck?</h3>
      <p>The North Star Support Bot replies instantly, 24/7.</p>
      <button type="button" class="btn btn-blaze" data-open-chat>💬 Chat with support</button>
    </div>
  </section>`;
}

export function aboutView(): string {
  return `
  <section class="page page-narrow about-page">
    <div class="section-head"><h2>About North Star</h2><p>Find your way outside.</p></div>
    <div class="about-body reveal">
      <p>North Star Outfitters started in 2012 with a pickup truck, a tent that leaked, and a promise: outdoor gear should be honest. Since then we've outfitted hikers, campers, and powder chasers across North America with gear we test the hard way, in real weather, on real trails.</p>
      <p>We believe support should feel like a good trail sign: clear, quick, and exactly where you need it. That's why our support bot answers in seconds and a human is always one tap away.</p>
      <p class="about-note">⭐ North Star Outfitters is a fictional store built to showcase the North Star Support Bot. No real products, orders, or payments.</p>
    </div>
  </section>`;
}

export function cartView(lines: CartLine[]): string {
  if (lines.length === 0) {
    return `
    <section class="page page-narrow center">
      <div class="section-head"><h2>Your pack is empty</h2><p>Nothing in the cart yet. The trail is calling.</p></div>
      <p><a class="btn btn-pine" href="#/shop">Browse gear</a></p>
    </section>`;
  }
  const rows = lines
    .map((l) => {
      const p = productById(l.id);
      if (!p) return '';
      return `
      <div class="cart-row reveal">
        <a href="#/product/${p.id}" class="cart-thumb">${art(p.motif)}</a>
        <div class="cart-row-info">
          <a href="#/product/${p.id}"><strong>${p.name}</strong></a>
          <span class="cart-cat">${p.category}</span>
        </div>
        <div class="qty-stepper" aria-label="Quantity for ${p.name}">
          <button type="button" data-qty="${p.id}:${l.qty - 1}" aria-label="Decrease quantity">−</button>
          <span>${l.qty}</span>
          <button type="button" data-qty="${p.id}:${l.qty + 1}" aria-label="Increase quantity">+</button>
        </div>
        <span class="cart-line-price">${money(p.price * l.qty)}</span>
        <button type="button" class="cart-remove" data-remove="${p.id}" aria-label="Remove ${p.name}">✕</button>
      </div>`;
    })
    .join('');
  const total = subtotal(lines, (id) => productById(id)?.price ?? 0);
  return `
  <section class="page page-narrow">
    <div class="section-head"><h2>Your pack (${count(lines)})</h2><p>Demo cart, no real checkout.</p></div>
    <div class="cart-list">${rows}</div>
    <div class="cart-summary reveal">
      <div class="cart-total"><span>Subtotal</span><strong>${money(total)}</strong></div>
      <p class="cart-shipnote">🚚 Standard shipping 3-5 business days · Expedited 1-2</p>
      <div class="cart-actions">
        <button type="button" class="btn btn-blaze" data-checkout>Checkout</button>
        <button type="button" class="btn btn-outline" data-ask="How long does shipping take?">Ask about shipping</button>
      </div>
    </div>
  </section>`;
}

export function renderRoute(route: Route, lines: CartLine[]): { html: string; title: string } {
  switch (route.name) {
    case 'home':
      return { html: homeView(), title: 'North Star Outfitters | Gear for the trail ahead' };
    case 'shop':
      return { html: shopView(route.filter), title: 'Shop | North Star Outfitters' };
    case 'product': {
      const p = productById(route.id);
      return { html: productView(route.id), title: `${p ? p.name : 'Not found'} | North Star Outfitters` };
    }
    case 'faq':
      return { html: faqView(), title: 'FAQ & Support | North Star Outfitters' };
    case 'about':
      return { html: aboutView(), title: 'About | North Star Outfitters' };
    case 'cart':
      return { html: cartView(lines), title: 'Your pack | North Star Outfitters' };
  }
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
