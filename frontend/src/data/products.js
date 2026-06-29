// Static catalog data for Moobits — Phase 1
export const WHATSAPP_NUMBER = "6283894855149";

export const buildWaLink = (productName, lang = "id") => {
  const msg =
    lang === "id"
      ? `Halo Moobits, aku mau order ${productName} ya.`
      : `Hello Moobits, I would like to order ${productName}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

export const buildGenericWa = (lang = "id") => {
  const msg =
    lang === "id"
      ? "Halo Moobits, aku mau order ya."
      : "Hello Moobits, I would like to order.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

const COOKIE_IMAGES = {
  classic_og:
    "https://customer-assets.emergentagent.com/job_2d886d91-6abb-40c6-9e2f-b68641f5a7ed/artifacts/8s8pnu10_The%20Classic%20OG%20Cookies.png",
  velvet_crush:
    "https://customer-assets.emergentagent.com/job_2d886d91-6abb-40c6-9e2f-b68641f5a7ed/artifacts/ks3xrubv_The%20Velvet%20Crush%20Cookies.png",
  matcha:
    "https://customer-assets.emergentagent.com/job_2d886d91-6abb-40c6-9e2f-b68641f5a7ed/artifacts/swvvr9td_The%20Matcha%20Cookies.png",
  blue_monstiez:
    "https://customer-assets.emergentagent.com/job_2d886d91-6abb-40c6-9e2f-b68641f5a7ed/artifacts/ao9drma2_The%20Blue%20Monstiez%20Cookies.png",
};

export const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_2d886d91-6abb-40c6-9e2f-b68641f5a7ed/artifacts/faqatn4h_Logo%20Moobits.png";

const BOLU_IMAGES = {
  ketan_hitam_lumer:
    "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/lrn3thnd_Bolu%20Mini%20Ketan%20Hitam%20Isian%20Keju%20Lumer.png",
  ketan_hitam_parut:
    "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/hnz942qf_Bolu%20Mini%20Ketan%20Hitam%20Topping%20Keju%20Parut.png",
  redvelvet_lumer:
    "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/eaag6i5n_Bolu%20Mini%20Red%20Velvet%20Isian%20Keju%20Lumer.png",
  redvelvet_parut:
    "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/lm6bcgjz_Bolu%20Mini%20Red%20Velvet%20Topping%20Keju%20Parut.png",
  pandan_lumer:
    "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/9ranplh2_Bolu%20Mini%20Pandan%20Isian%20Keju%20Lumer.png",
  pandan_parut:
    "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/w9sjxxyk_Bolu%20Mini%20Pandan%20Topping%20Keju%20Parut.png",
};

const BOLU_BIG_IMAGES = {
  ketan_hitam:
    "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/ly3jrmjj_Bolu%20Ketan%20Hitam%20Isian%20Keju%20Lumer.png",
  pandan:
    "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/fwllb8fc_Bolu%20Pandan%20Isian%20Keju%20Lumer.png",
};

const BROWNIES_IMAGES = {
  keju_full:
    "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/5vhizhqd_Brownies%20Ketan%20Hitam%20Topping%20Keju%20Parut%20Full.png",
  half_half:
    "https://customer-assets.emergentagent.com/job_moobits-launch/artifacts/34986dvy_Brownies%20Ketan%20Hitam%20Topping%2050%25%20Keju%20Parut%2050%25%20Chocochips.png",
};

// Each product: id, name, category, image (or illustration key), labels, price, discountPct, size,
// descId, descEn, textureId, textureEn, accent (hex)
export const products = [
  // ===== COOKIES =====
  {
    id: "classic-og",
    name: "The Classic OG",
    category: "Cookies",
    image: COOKIE_IMAGES.classic_og,
    labels: ["New Menu"],
    price: 10000,
    bestFor: ["Self Treat", "Teman Ngopi", "Gift"],
    discountPct: 20,
    size: "Ø ±10 cm",
    accent: "#8D5B4C",
    descId:
      "Classic chocolate chip cookie dengan rasa buttery manis yang familiar, simple, dan selalu aman jadi comfort snack.",
    descEn:
      "Classic chocolate chip cookie with a buttery sweet taste that feels familiar, simple, and comforting.",
    textureId: ["Chewy", "Soft inside", "Slightly crisp outside"],
    textureEn: ["Chewy", "Soft inside", "Slightly crisp outside"],
  },
  {
    id: "velvet-crush",
    name: "The Velvet Crush",
    category: "Cookies",
    image: COOKIE_IMAGES.velvet_crush,
    labels: ["New Menu"],
    price: 12000,
    bestFor: ["Self Treat", "Teman Ngopi", "Gift"],
    discountPct: 20,
    size: "Ø ±10 cm",
    accent: "#9B2C2C",
    descId:
      "Red velvet cookie dengan rasa manis lembut, warna bold, dan white chips yang bikin setiap gigitan terasa creamy.",
    descEn:
      "Red velvet cookie with a soft sweet flavor, bold color, and white chips that make every bite feel creamy.",
    textureId: ["Soft chewy", "Moist", "Creamy bites"],
    textureEn: ["Soft chewy", "Moist", "Creamy bites"],
  },
  {
    id: "matcha-cookies",
    name: "The Matcha Cookies",
    category: "Cookies",
    image: COOKIE_IMAGES.matcha,
    labels: ["New Menu"],
    price: 12000,
    bestFor: ["Self Treat", "Teman Ngopi", "Gift"],
    discountPct: 20,
    size: "Ø ±10 cm",
    accent: "#86A789",
    descId:
      "Cookie matcha dengan rasa earthy yang kalem, dipadukan white chips dan almond slices untuk gigitan yang lebih premium.",
    descEn:
      "Matcha cookie with a calm earthy flavor, paired with white chips and almond slices for a more premium bite.",
    textureId: ["Chewy", "Soft", "Light almond crunch"],
    textureEn: ["Chewy", "Soft", "Light almond crunch"],
  },
  {
    id: "blue-monstiez",
    name: "The Blue Monstiez",
    category: "Cookies",
    image: COOKIE_IMAGES.blue_monstiez,
    labels: ["New Menu"],
    price: 12000,
    bestFor: ["Self Treat", "Teman Ngopi", "Gift"],
    discountPct: 20,
    size: "Ø ±10 cm",
    accent: "#3B82F6",
    descId:
      "Cookie biru playful dengan rasa manis creamy dan tampilan fun, cocok buat kamu yang suka sweet treats unik.",
    descEn:
      "A playful blue cookie with a creamy sweet taste and a fun look, made for anyone who loves unique sweet treats.",
    textureId: ["Chewy", "Soft", "Chunky", "Playful bites"],
    textureEn: ["Chewy", "Soft", "Chunky", "Playful bites"],
  },

  // ===== BOLU MINI =====
  {
    id: "bm-ketan-hitam-lumer",
    name: "Bolu Mini Ketan Hitam Isian Keju Lumer",
    shortName: "Bolu Mini Ketan Hitam · Keju Lumer",
    category: "Bolu Mini",
    image: BOLU_IMAGES.ketan_hitam_lumer,
    labels: ["Best Seller", "Recommended"],
    price: 5000,
    bestFor: ["Self Treat", "Arisan", "Snack Box"],
    discountPct: 0,
    accent: "#3A2A2E",
    descId:
      "Bolu mini ketan hitam yang moist dan legit, dengan isian keju lumer yang gurih creamy di dalamnya.",
    descEn:
      "Moist black sticky rice mini bolu with creamy melted cheese filling inside.",
    textureId: ["Moist", "Soft", "Lumer"],
    textureEn: ["Moist", "Soft", "Lumer"],
  },
  {
    id: "bm-ketan-hitam-parut",
    name: "Bolu Mini Ketan Hitam Topping Keju Parut",
    shortName: "Bolu Mini Ketan Hitam · Keju Parut",
    category: "Bolu Mini",
    image: BOLU_IMAGES.ketan_hitam_parut,
    labels: [],
    price: 5000,
    bestFor: ["Self Treat", "Arisan", "Snack Box"],
    discountPct: 0,
    accent: "#3A2A2E",
    descId:
      "Bolu mini ketan hitam dengan topping keju parut yang gurih dan melimpah, cocok buat pencinta manis-gurih.",
    descEn:
      "Soft black sticky rice mini bolu with generous grated cheese topping for a sweet and savory bite.",
    textureId: ["Soft", "Moist", "Cheesy topping"],
    textureEn: ["Soft", "Moist", "Cheesy topping"],
  },
  {
    id: "bm-redvelvet-lumer",
    name: "Bolu Mini Red Velvet Isian Keju Lumer",
    shortName: "Bolu Mini Red Velvet · Keju Lumer",
    category: "Bolu Mini",
    image: BOLU_IMAGES.redvelvet_lumer,
    labels: [],
    price: 5000,
    bestFor: ["Self Treat", "Arisan", "Snack Box"],
    discountPct: 0,
    accent: "#9B2C2C",
    descId:
      "Bolu mini red velvet dengan warna cantik, rasa manis lembut, dan isian keju lumer yang creamy.",
    descEn:
      "Soft red velvet mini bolu with a lovely color, gentle sweetness, and creamy melted cheese filling.",
    textureId: ["Soft", "Moist", "Creamy lumer"],
    textureEn: ["Soft", "Moist", "Creamy lumer"],
  },
  {
    id: "bm-redvelvet-parut",
    name: "Bolu Mini Red Velvet Topping Keju Parut",
    shortName: "Bolu Mini Red Velvet · Keju Parut",
    category: "Bolu Mini",
    image: BOLU_IMAGES.redvelvet_parut,
    labels: [],
    price: 5000,
    bestFor: ["Self Treat", "Arisan", "Snack Box"],
    discountPct: 0,
    accent: "#9B2C2C",
    descId:
      "Bolu mini red velvet dengan topping keju parut yang bikin rasanya lebih gurih dan balance.",
    descEn:
      "Red velvet mini bolu with grated cheese topping for a balanced sweet and savory flavor.",
    textureId: ["Soft", "Moist", "Cheesy"],
    textureEn: ["Soft", "Moist", "Cheesy"],
  },
  {
    id: "bm-pandan-lumer",
    name: "Bolu Mini Pandan Isian Keju Lumer",
    shortName: "Bolu Mini Pandan · Keju Lumer",
    category: "Bolu Mini",
    image: BOLU_IMAGES.pandan_lumer,
    labels: ["Best Seller", "Recommended"],
    price: 5000,
    bestFor: ["Self Treat", "Arisan", "Snack Box"],
    discountPct: 0,
    accent: "#86A789",
    descId:
      "Bolu mini pandan wangi dengan isian keju lumer yang gurih creamy, fresh, dan comforting.",
    descEn:
      "Fragrant pandan mini bolu with creamy melted cheese filling, fresh and comforting in every bite.",
    textureId: ["Soft", "Moist", "Fragrant", "Lumer"],
    textureEn: ["Soft", "Moist", "Fragrant", "Lumer"],
  },
  {
    id: "bm-pandan-parut",
    name: "Bolu Mini Pandan Topping Keju Parut",
    shortName: "Bolu Mini Pandan · Keju Parut",
    category: "Bolu Mini",
    image: BOLU_IMAGES.pandan_parut,
    labels: [],
    price: 5000,
    bestFor: ["Self Treat", "Arisan", "Snack Box"],
    discountPct: 0,
    accent: "#86A789",
    descId:
      "Bolu mini pandan dengan aroma pandan yang lembut dan topping keju parut yang gurih.",
    descEn:
      "Soft pandan mini bolu with a gentle pandan aroma and savory grated cheese topping.",
    textureId: ["Soft", "Moist", "Cheesy topping"],
    textureEn: ["Soft", "Moist", "Cheesy topping"],
  },

  // ===== BOLU BIG =====
  {
    id: "bb-ketan-hitam-lumer",
    name: "Bolu BIG Ketan Hitam Isian Keju Lumer",
    shortName: "Bolu BIG Ketan Hitam · Keju Lumer",
    category: "Bolu BIG",
    image: BOLU_BIG_IMAGES.ketan_hitam,
    labels: [],
    price: 45000,
    bestFor: ["Sharing", "Acara Keluarga", "Ulang Tahun"],
    discountPct: 0,
    accent: "#3A2A2E",
    descId:
      "Bolu ketan hitam ukuran besar dengan tekstur moist dan isian keju lumer yang cocok untuk sharing.",
    descEn:
      "Large black sticky rice bolu with a moist texture and creamy melted cheese filling, perfect for sharing.",
    textureId: ["Moist", "Soft", "Lumer", "Rich"],
    textureEn: ["Moist", "Soft", "Lumer", "Rich"],
  },
  {
    id: "bb-pandan-lumer",
    name: "Bolu BIG Pandan Isian Keju Lumer",
    shortName: "Bolu BIG Pandan · Keju Lumer",
    category: "Bolu BIG",
    image: BOLU_BIG_IMAGES.pandan,
    labels: [],
    price: 45000,
    bestFor: ["Sharing", "Acara Keluarga", "Ulang Tahun"],
    discountPct: 0,
    accent: "#86A789",
    descId:
      "Bolu pandan ukuran besar dengan aroma pandan yang wangi dan isian keju lumer yang creamy.",
    descEn:
      "Large pandan bolu with a soft fragrant cake base and creamy melted cheese filling.",
    textureId: ["Soft", "Moist", "Fragrant", "Creamy"],
    textureEn: ["Soft", "Moist", "Fragrant", "Creamy"],
  },

  // ===== BROWNIES =====
  {
    id: "br-keju-full",
    name: "Brownies Ketan Hitam Topping Keju Parut Full",
    shortName: "Brownies · Keju Parut Full",
    category: "Brownies",
    image: BROWNIES_IMAGES.keju_full,
    labels: [],
    price: 35000,
    bestFor: ["Sharing", "Meeting", "Arisan"],
    discountPct: 0,
    accent: "#FCD34D",
    descId:
      "Brownies ketan hitam dengan topping keju parut full, cocok buat pencinta brownies manis-gurih.",
    descEn:
      "Black sticky rice brownies with full grated cheese topping for a rich sweet and savory taste.",
    textureId: ["Moist", "Dense", "Soft", "Cheesy"],
    textureEn: ["Moist", "Dense", "Soft", "Cheesy"],
  },
  {
    id: "br-half-half",
    name: "Brownies Ketan Hitam Topping ½ Keju Parut + ½ Choco Chips",
    shortName: "Brownies · ½ Keju + ½ Choco",
    category: "Brownies",
    image: BROWNIES_IMAGES.half_half,
    illustration: "brownies-half",
    labels: [],
    price: 35000,
    bestFor: ["Sharing", "Meeting", "Arisan"],
    discountPct: 0,
    accent: "#8D5B4C",
    descId:
      "Brownies ketan hitam dengan dua topping dalam satu loyang: setengah keju parut dan setengah choco chips.",
    descEn:
      "Black sticky rice brownies with two toppings in one: half grated cheese and half choco chips.",
    textureId: ["Moist", "Dense", "Cheesy", "Chocolatey"],
    textureEn: ["Moist", "Dense", "Cheesy", "Chocolatey"],
  },
];

export const CATEGORIES = ["Cookies", "Bolu Mini", "Bolu BIG", "Brownies"];

// 4-Variant Cookie Bundle (Promo 2) — not in catalog grid, only addable from a dedicated CTA.
export const COOKIE_BUNDLE = {
  id: "bundle-cookies-4",
  name: "Bundling Cookies 4 Varian",
  nameEn: "4-Variant Cookie Bundle",
  category: "Cookies",
  isBundle: true,
  image:
    "https://customer-assets.emergentagent.com/job_2d886d91-6abb-40c6-9e2f-b68641f5a7ed/artifacts/faqatn4h_Logo%20Moobits.png",
  // Composition (1 of each cookie)
  contents: ["classic-og", "velvet-crush", "matcha-cookies", "blue-monstiez"],
  originalPrice: 46000, // 10000 + 12000 + 12000 + 12000
  bundleDiscountPct: 10,
  bundlePrice: 41400,
  accent: "#8D5B4C",
  descId:
    "Satu set lengkap 4 varian cookies Moobits. Diskon 10% untuk paket bundling.",
  descEn:
    "A complete set of all 4 Moobits cookie variants. 10% off bundle promo.",
  textureId: ["1× Classic OG", "1× Velvet Crush", "1× Matcha", "1× Blue Monstiez"],
  textureEn: ["1× Classic OG", "1× Velvet Crush", "1× Matcha", "1× Blue Monstiez"],
};

export const formatIDR = (n) => `Rp${n.toLocaleString("id-ID")}`;

// Compute discounted unit price for a regular product (not a bundle).
export const unitPrice = (product) => {
  if (product.isBundle) return product.bundlePrice;
  if (product.discountPct > 0) {
    return Math.round(product.price * (1 - product.discountPct / 100));
  }
  return product.price;
};

// Returns formatted invoice number based on a daily counter stored in localStorage.
export const generateInvoiceNumber = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const dateKey = `${y}${m}${d}`;
  const counterKey = `moobits_invoice_counter_${dateKey}`;
  let n = 1;
  try {
    const stored = parseInt(localStorage.getItem(counterKey) || "0", 10);
    n = (isNaN(stored) ? 0 : stored) + 1;
    localStorage.setItem(counterKey, String(n));
  } catch (e) {
    n = 1;
  }
  return `MBT-${dateKey}-${String(n).padStart(3, "0")}`;
};
