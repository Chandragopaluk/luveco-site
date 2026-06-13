// =====================================================================
// LuvEco shop logic v2 — colour-world category bands + basket
// =====================================================================
(function () {
  "use strict";

  const gbp = n => "£" + n.toFixed(2);
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

  // Map each category to a colour world + a warm headline + intro
  const WORLDS = {
    "Tote bags":         { world:"world-magenta", eyebrow:"Carry it everywhere", head:"Totes with a story",        intro:"Roomy, reversible and quilted by hand. The one bag you'll reach for every single day." },
    "Washable slippers": { world:"world-coral",   eyebrow:"Happy feet",          head:"Slippers to live in",       intro:"Soft cotton, fully washable, light enough to fold into your weekender. Home comfort, anywhere." },
    "Sunglasses cases":  { world:"world-teal",    eyebrow:"Little luxuries",     head:"Cases that spark joy",      intro:"Quilted protection in prints too pretty to hide at the bottom of your bag." },
    "Travel pouches":    { world:"world-mustard", eyebrow:"Tidy in style",       head:"Pouches for everything",    intro:"For make-up, cables, snacks, small chaos. The pretty fix for a messy handbag." },
    "Bag charms":        { world:"world-sage",    eyebrow:"Under £20",           head:"Charms & little gifts",     intro:"A small piece of Jaipur to hang from any bag — and the easiest gift to say yes to." }
  };

  function renderSections() {
    const host = document.getElementById("shop-sections");
    let html = "";
    CATEGORY_ORDER.forEach((cat, idx) => {
      const items = PRODUCTS.filter(p => p.category === cat);
      if (!items.length) return;
      const w = WORLDS[cat] || { world:"world-magenta", eyebrow:"Shop", head:cat, intro:"" };
      const flip = idx % 2 === 1 ? " flip" : "";
      html += `
      <section class="cat-band ${w.world}${flip}" id="${slug(cat)}">
        <div class="container">
          <div class="cat-head">
            <p class="eyebrow">${w.eyebrow}</p>
            <h2>${w.head}</h2>
            <p>${w.intro}</p>
            <a href="#${slug(cat)}" class="link-underline">See all ${cat.toLowerCase()}</a>
          </div>
          <ul class="cat-products" role="list">
            ${items.map(cardHTML).join("")}
          </ul>
        </div>
      </section>`;
    });
    host.innerHTML = html;

    host.querySelectorAll(".pcard-photo").forEach(ph => ph.classList.add("photo-missing"));
    host.querySelectorAll(".pcard-photo img").forEach(img => {
      img.addEventListener("load", () => img.closest(".pcard-photo").classList.remove("photo-missing"));
      img.addEventListener("error", () => img.remove());
    });
    host.querySelectorAll("[data-add]").forEach(btn => {
      btn.addEventListener("click", () => {
        addToCart(btn.getAttribute("data-add"));
        const orig = btn.textContent;
        btn.textContent = "Added ✓";
        setTimeout(() => { btn.textContent = orig; }, 1200);
      });
    });
  }

  function cardHTML(p) {
    const tag = p.price < 20 ? `<span class="pcard-tag">Under £20</span>` : "";
    return `
    <li class="pcard">
      <div class="pcard-photo">
        ${tag}
        <img src="${p.image}" alt="${p.name} — hand-block-printed cotton" loading="lazy">
        <div class="pcard-ph" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="6" y="10" width="36" height="28" rx="3"/><circle cx="17" cy="20" r="4"/><path d="M6 33 L18 24 L28 32 L36 26 L42 30"/>
          </svg>
          <p>Photo coming</p>
          <span>${p.image}</span>
        </div>
      </div>
      <div class="pcard-info">
        <h3>${p.name}</h3>
        <p class="pcard-blurb">${p.blurb}</p>
        <div class="pcard-buy">
          <span class="pcard-price">${gbp(p.price)}</span>
          <button class="btn btn-small" data-add="${p.id}">Add to bag</button>
        </div>
      </div>
    </li>`;
  }

  // ---------------- CART ----------------
  const CART_KEY = "luveco-cart";
  function getCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch { return {}; } }
  function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); renderCart(); }
  function addToCart(id){ const c=getCart(); c[id]=(c[id]||0)+1; saveCart(c); openCart(); }
  function setQty(id,q){ const c=getCart(); if(q<=0) delete c[id]; else c[id]=q; saveCart(c); }

  function renderCart() {
    const cart = getCart();
    const list = document.getElementById("cart-items");
    const ids = Object.keys(cart);
    let subtotal = 0;
    if (!ids.length) {
      list.innerHTML = `<li class="cart-empty">Your basket is empty.<a href="#tote-bags" id="cart-continue">Start shopping</a></li>`;
    } else {
      list.innerHTML = ids.map(id => {
        const p = PRODUCTS.find(x => x.id === id);
        if (!p) return "";
        const qty = cart[id]; subtotal += p.price * qty;
        return `
        <li class="cart-item">
          <div>
            <p class="cart-item-name">${p.name}</p>
            <p class="cart-item-price">${gbp(p.price)}</p>
          </div>
          <div class="cart-item-qty">
            <button data-dec="${id}" aria-label="Reduce quantity">−</button>
            <span>${qty}</span>
            <button data-inc="${id}" aria-label="Increase quantity">+</button>
          </div>
          <p class="cart-item-line">${gbp(p.price*qty)}</p>
        </li>`;
      }).join("");
    }
    document.getElementById("cart-subtotal").textContent = gbp(subtotal);
    const d = document.getElementById("cart-delivery");
    if (subtotal === 0) { d.textContent=""; d.classList.remove("unlocked"); }
    else if (subtotal >= FREE_DELIVERY_THRESHOLD) { d.textContent="You've unlocked free UK delivery ✓"; d.classList.add("unlocked"); }
    else { d.textContent=`Spend ${gbp(FREE_DELIVERY_THRESHOLD-subtotal)} more for free UK delivery`; d.classList.remove("unlocked"); }
    const count = ids.reduce((n,id)=>n+cart[id],0);
    const badge = document.getElementById("cart-count");
    badge.textContent = count; badge.hidden = count === 0;
    list.querySelectorAll("[data-inc]").forEach(b => b.addEventListener("click", () => setQty(b.getAttribute("data-inc"), (getCart()[b.getAttribute("data-inc")]||0)+1)));
    list.querySelectorAll("[data-dec]").forEach(b => b.addEventListener("click", () => setQty(b.getAttribute("data-dec"), (getCart()[b.getAttribute("data-dec")]||0)-1)));
    const cont = document.getElementById("cart-continue");
    if (cont) cont.addEventListener("click", closeCart);
  }

  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  function openCart(){ drawer.hidden=false; overlay.hidden=false; requestAnimationFrame(()=>{ drawer.classList.add("open"); overlay.classList.add("open"); }); }
  function closeCart(){ drawer.classList.remove("open"); overlay.classList.remove("open"); setTimeout(()=>{ drawer.hidden=true; overlay.hidden=true; },300); }
  document.getElementById("cart-open").addEventListener("click", openCart);
  document.getElementById("cart-close").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });
  document.getElementById("checkout-btn").addEventListener("click", () => { document.getElementById("checkout-note").hidden = false; });
  document.getElementById("newsletter-form").addEventListener("submit", e => { e.preventDefault(); document.getElementById("newsletter-note").hidden = false; e.target.reset(); });
  document.getElementById("year").textContent = new Date().getFullYear();

  renderSections();
  renderCart();
})();
