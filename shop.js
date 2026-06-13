// =====================================================================
// LuvEco shop logic
// Renders product sections from products.js and runs the basket.
// Basket persists in the browser via localStorage.
// =====================================================================

(function () {
  "use strict";

  const ACCENT_VARS = {
    magenta: "var(--color-accent-magenta)",
    mustard: "var(--color-accent-mustard)",
    coral:   "var(--color-accent-coral)",
    sage:    "var(--color-accent-sage)",
    teal:    "var(--color-accent-teal)"
  };

  const gbp = n => "£" + n.toFixed(2);
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  // ---------------- RENDER PRODUCT SECTIONS ----------------
  function renderSections() {
    const host = document.getElementById("shop-sections");
    let html = "";

    CATEGORY_ORDER.forEach(cat => {
      const items = PRODUCTS.filter(p => p.category === cat);
      if (!items.length) return;
      const id = slug(cat);

      html += `
      <section class="product-section" id="${id}">
        <div class="container">
          <header class="section-header">
            <h2>${cat}</h2>
            <p class="section-intro">${CATEGORY_INTROS[cat] || ""}</p>
          </header>
          <ul class="product-grid" role="list">
            ${items.map(cardHTML).join("")}
          </ul>
        </div>
      </section>`;
    });

    host.innerHTML = html;

    // Wire the placeholder fallback for missing photos
    host.querySelectorAll(".product-photo img").forEach(img => {
      img.addEventListener("error", () => {
        img.closest(".product-photo").classList.add("photo-missing");
        img.remove();
      });
    });

    // Wire add-to-bag buttons
    host.querySelectorAll("[data-add]").forEach(btn => {
      btn.addEventListener("click", () => {
        addToCart(btn.getAttribute("data-add"));
        btn.textContent = "Added ✓";
        setTimeout(() => { btn.textContent = "Add to bag"; }, 1200);
      });
    });
  }

  function cardHTML(p) {
    const accent = ACCENT_VARS[p.accent] || "var(--color-brand-primary)";
    return `
    <li class="product-card" style="--card-accent:${accent}">
      <div class="product-photo">
        <img src="${p.image}" alt="${p.name} — hand-block-printed cotton" loading="lazy">
        <div class="photo-placeholder" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="6" y="10" width="36" height="28" rx="3"/>
            <circle cx="17" cy="20" r="4"/>
            <path d="M6 33 L18 24 L28 32 L36 26 L42 30"/>
          </svg>
          <p>Photo coming<br><span>${p.image}</span></p>
        </div>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="product-blurb">${p.blurb}</p>
        <div class="product-buy">
          <span class="product-price">${gbp(p.price)}</span>
          <button class="btn btn-small" data-add="${p.id}">Add to bag</button>
        </div>
      </div>
    </li>`;
  }

  // ---------------- CART ----------------
  const CART_KEY = "luveco-cart";

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch { return {}; }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  }
  function addToCart(id) {
    const cart = getCart();
    cart[id] = (cart[id] || 0) + 1;
    saveCart(cart);
    openCart();
  }
  function setQty(id, qty) {
    const cart = getCart();
    if (qty <= 0) delete cart[id];
    else cart[id] = qty;
    saveCart(cart);
  }

  function renderCart() {
    const cart = getCart();
    const list = document.getElementById("cart-items");
    const ids = Object.keys(cart);
    let subtotal = 0;

    if (!ids.length) {
      list.innerHTML = `<li class="cart-empty">Your basket is empty.<br><a href="#tote-bags" id="cart-continue">Continue shopping</a></li>`;
    } else {
      list.innerHTML = ids.map(id => {
        const p = PRODUCTS.find(x => x.id === id);
        if (!p) return "";
        const qty = cart[id];
        subtotal += p.price * qty;
        return `
        <li class="cart-item">
          <div class="cart-item-info">
            <p class="cart-item-name">${p.name}</p>
            <p class="cart-item-price">${gbp(p.price)}</p>
          </div>
          <div class="cart-item-qty">
            <button data-dec="${id}" aria-label="Reduce quantity">−</button>
            <span>${qty}</span>
            <button data-inc="${id}" aria-label="Increase quantity">+</button>
          </div>
          <p class="cart-item-line">${gbp(p.price * qty)}</p>
        </li>`;
      }).join("");
    }

    document.getElementById("cart-subtotal").textContent = gbp(subtotal);

    // Free delivery progress
    const deliveryEl = document.getElementById("cart-delivery");
    if (subtotal === 0) {
      deliveryEl.textContent = "";
    } else if (subtotal >= FREE_DELIVERY_THRESHOLD) {
      deliveryEl.textContent = "You've unlocked free UK delivery ✓";
      deliveryEl.classList.add("delivery-unlocked");
    } else {
      const gap = FREE_DELIVERY_THRESHOLD - subtotal;
      deliveryEl.textContent = `Spend ${gbp(gap)} more for free UK delivery`;
      deliveryEl.classList.remove("delivery-unlocked");
    }

    // Cart count badge
    const count = ids.reduce((n, id) => n + cart[id], 0);
    const badge = document.getElementById("cart-count");
    badge.textContent = count;
    badge.hidden = count === 0;

    // Wire qty buttons
    list.querySelectorAll("[data-inc]").forEach(b =>
      b.addEventListener("click", () => setQty(b.getAttribute("data-inc"), (getCart()[b.getAttribute("data-inc")] || 0) + 1)));
    list.querySelectorAll("[data-dec]").forEach(b =>
      b.addEventListener("click", () => setQty(b.getAttribute("data-dec"), (getCart()[b.getAttribute("data-dec")] || 0) - 1)));
    const cont = document.getElementById("cart-continue");
    if (cont) cont.addEventListener("click", closeCart);
  }

  // ---------------- DRAWER ----------------
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");

  function openCart() {
    drawer.hidden = false;
    overlay.hidden = false;
    requestAnimationFrame(() => {
      drawer.classList.add("open");
      overlay.classList.add("open");
    });
  }
  function closeCart() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    setTimeout(() => { drawer.hidden = true; overlay.hidden = true; }, 300);
  }

  document.getElementById("cart-open").addEventListener("click", openCart);
  document.getElementById("cart-close").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });

  // Checkout — honest about what's wired and what isn't
  document.getElementById("checkout-btn").addEventListener("click", () => {
    document.getElementById("checkout-note").hidden = false;
  });

  // Newsletter — demo only until connected to an email service
  document.getElementById("newsletter-form").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("newsletter-note").hidden = false;
    e.target.reset();
  });

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Go
  renderSections();
  renderCart();
})();
