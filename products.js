// =====================================================================
// LuvEco product catalogue
// =====================================================================
// EDIT THIS FILE to change products, names, prices, and photos.
// You never need to touch index.html to update the shop.
//
// To add your real photos:
//   1. Put the photo in the  src/products/  folder
//   2. Set "image" below to the filename, e.g. "products/rose-tote.jpg"
//   3. Refresh the page
//
// Until a photo exists, the card shows a styled placeholder
// with the product's accent colour.
// =====================================================================

const PRODUCTS = [
  // ---------------- TOTE BAGS ----------------
  {
    id: "tote-marigold",
    name: "Marigold Garden Tote",
    category: "Tote bags",
    price: 42.00,
    image: "products/tote-marigold.jpg",
    accent: "mustard",
    blurb: "Reversible quilted cotton, hand-printed in marigold and forest green."
  },
  {
    id: "tote-rose",
    name: "Jaipur Rose Tote",
    category: "Tote bags",
    price: 42.00,
    image: "products/tote-rose.jpg",
    accent: "magenta",
    blurb: "Deep rose florals on cream, hand-quilted with an inside pocket."
  },
  {
    id: "tote-indigo",
    name: "Indigo Vine Tote",
    category: "Tote bags",
    price: 45.00,
    image: "products/tote-indigo.jpg",
    accent: "teal",
    blurb: "Trailing vine print in indigo and teal. Magnetic closure."
  },

  // ---------------- SLIPPERS ----------------
  {
    id: "slippers-coral",
    name: "Coral Bloom Slippers",
    category: "Washable slippers",
    price: 24.00,
    image: "products/slippers-coral.jpg",
    accent: "coral",
    blurb: "Soft quilted cotton slippers, fully machine washable."
  },
  {
    id: "slippers-sage",
    name: "Sage Leaf Slippers",
    category: "Washable slippers",
    price: 24.00,
    image: "products/slippers-sage.jpg",
    accent: "sage",
    blurb: "Botanical leaf print on soft sage. Light enough for travel."
  },

  // ---------------- SUNGLASSES CASES ----------------
  {
    id: "case-magenta",
    name: "Magenta Buti Sunglasses Case",
    category: "Sunglasses cases",
    price: 14.00,
    image: "products/case-magenta.jpg",
    accent: "magenta",
    blurb: "Quilted protection in a classic buti print. No plastic, anywhere."
  },
  {
    id: "case-teal",
    name: "Teal Paisley Sunglasses Case",
    category: "Sunglasses cases",
    price: 14.00,
    image: "products/case-teal.jpg",
    accent: "teal",
    blurb: "Hand-printed paisley with a soft padded lining."
  },

  // ---------------- TRAVEL POUCHES ----------------
  {
    id: "pouch-mustard",
    name: "Mustard Trellis Travel Pouch",
    category: "Travel pouches",
    price: 18.00,
    image: "products/pouch-mustard.jpg",
    accent: "mustard",
    blurb: "For toiletries, cables, small chaos. Zip closure, washable."
  },
  {
    id: "pouch-coral",
    name: "Coral Blossom Pouch Set",
    category: "Travel pouches",
    price: 28.00,
    image: "products/pouch-coral.jpg",
    accent: "coral",
    blurb: "Set of two nesting pouches in hand-printed coral blossom."
  },

  // ---------------- BAG CHARMS ----------------
  {
    id: "charm-sage",
    name: "Block-Print Bag Charm",
    category: "Bag charms",
    price: 9.00,
    image: "products/charm-sage.jpg",
    accent: "sage",
    blurb: "A small piece of Jaipur to hang from any bag. Cotton tassel."
  }
];

// Display order of category sections on the homepage
const CATEGORY_ORDER = [
  "Tote bags",
  "Washable slippers",
  "Sunglasses cases",
  "Travel pouches",
  "Bag charms"
];

// One-line intro per category, shown under the section heading
const CATEGORY_INTROS = {
  "Tote bags": "Quilted, reversible, carried for a decade.",
  "Washable slippers": "Soft cotton for the house or the holiday.",
  "Sunglasses cases": "Quilted protection. No plastic.",
  "Travel pouches": "For toiletries, cables, small chaos.",
  "Bag charms": "Small block-printed pieces, big personality."
};

// Free UK delivery threshold (£)
const FREE_DELIVERY_THRESHOLD = 50;
