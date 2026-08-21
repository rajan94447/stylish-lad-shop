import tshirt from "@/assets/tshirt.jpg";
import shirt from "@/assets/shirt.jpg";
import hoodie from "@/assets/hoodie.jpg";
import jacket from "@/assets/jacket.jpg";
import jeans from "@/assets/jeans.jpg";
import trousers from "@/assets/trousers.jpg";
import shorts from "@/assets/shorts.jpg";
import ethnic from "@/assets/ethnic.jpg";
import formal from "@/assets/formal.jpg";
import party from "@/assets/party.jpg";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  description: string;
  tags: ("new" | "trending" | "bestseller" | "offer")[];
  popularity: number;
  addedOn: number;
};

export const categories = [
  "T-Shirts",
  "Shirts",
  "Hoodies",
  "Jackets",
  "Jeans",
  "Trousers",
  "Shorts",
  "Ethnic Wear",
  "Casual Wear",
  "Formal Wear",
  "Party Wear",
] as const;

export type Category = (typeof categories)[number];

export const categoryImages: Record<Category, string> = {
  "T-Shirts": tshirt,
  Shirts: shirt,
  Hoodies: hoodie,
  Jackets: jacket,
  Jeans: jeans,
  Trousers: trousers,
  Shorts: shorts,
  "Ethnic Wear": ethnic,
  "Casual Wear": tshirt,
  "Formal Wear": formal,
  "Party Wear": party,
};

const NEUTRALS = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#f7f7f5" },
  { name: "Grey", hex: "#9a9a9a" },
  { name: "Navy", hex: "#1c2a44" },
  { name: "Beige", hex: "#d9cbb5" },
  { name: "Olive", hex: "#5c6046" },
];

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const WAIST_SIZES = ["28", "30", "32", "34", "36", "38"];

type Seed = {
  name: string;
  brand: string;
  category: Category;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  tags: Product["tags"];
  colors?: number[];
  desc: string;
};

const seeds: Seed[] = [
  { name: "Essential Heavyweight Tee", brand: "NORTHLANE", category: "T-Shirts", price: 899, mrp: 1499, rating: 4.6, reviews: 214, tags: ["bestseller", "offer"], desc: "A 240 GSM combed-cotton tee with a structured drape and a clean ribbed collar that keeps its shape wash after wash." },
  { name: "Relaxed Boxy Tee", brand: "URBN MILE", category: "T-Shirts", price: 749, mrp: 1299, rating: 4.4, reviews: 168, tags: ["new", "offer"], desc: "Boxy shoulders and a slightly cropped hem make this the easiest layering tee in the drawer." },
  { name: "Pima Cotton Crew Tee", brand: "ATELIER 9", category: "T-Shirts", price: 1199, mrp: 1799, rating: 4.7, reviews: 302, tags: ["trending"], desc: "Long-staple Pima cotton, garment dyed for a soft matte finish and a barely-there weight." },
  { name: "Oxford Button-Down Shirt", brand: "NORTHLANE", category: "Shirts", price: 1699, mrp: 2599, rating: 4.5, reviews: 191, tags: ["bestseller"], desc: "Classic oxford weave with a soft button-down collar. Wears sharp untucked and cleans up tucked." },
  { name: "Linen Blend Summer Shirt", brand: "COAST & CO", category: "Shirts", price: 1899, mrp: 2999, rating: 4.3, reviews: 124, tags: ["new", "offer"], desc: "A breathable linen-cotton blend cut with a relaxed body for hot afternoons." },
  { name: "Textured Resort Shirt", brand: "URBN MILE", category: "Shirts", price: 1499, mrp: 2199, rating: 4.2, reviews: 88, tags: ["trending"], desc: "Subtle dobby texture and a camp collar for an easy off-duty look." },
  { name: "Oversized Fleece Hoodie", brand: "BLOK STUDIO", category: "Hoodies", price: 2199, mrp: 3499, rating: 4.8, reviews: 421, tags: ["bestseller", "trending", "offer"], desc: "Brushed-back fleece with a double-layer hood and heavy drawcords. Built for cold mornings." },
  { name: "Midweight Zip Hoodie", brand: "NORTHLANE", category: "Hoodies", price: 2499, mrp: 3299, rating: 4.4, reviews: 156, tags: ["new"], desc: "A cleaner take on the zip hoodie with a slim body and matte hardware." },
  { name: "Nylon Bomber Jacket", brand: "BLOK STUDIO", category: "Jackets", price: 3499, mrp: 5499, rating: 4.7, reviews: 268, tags: ["bestseller", "offer"], desc: "Water-resistant nylon shell, ribbed trims and a utility sleeve pocket. A year-round layer." },
  { name: "Quilted Overshirt Jacket", brand: "ATELIER 9", category: "Jackets", price: 3999, mrp: 5999, rating: 4.5, reviews: 97, tags: ["new", "trending"], desc: "Lightly quilted and cut like a shirt, so it layers under a coat without bulk." },
  { name: "Slim Fit Stretch Jeans", brand: "DENIM ROW", category: "Jeans", price: 1999, mrp: 3199, rating: 4.5, reviews: 344, tags: ["bestseller", "offer"], desc: "Comfort-stretch denim with a mid rise and a tapered leg that holds its shape all day." },
  { name: "Straight Leg Rigid Jeans", brand: "DENIM ROW", category: "Jeans", price: 2399, mrp: 3499, rating: 4.3, reviews: 142, tags: ["trending"], desc: "A rigid 13oz denim built to fade with wear. Straight through the thigh, clean at the hem." },
  { name: "Tailored Chino Trousers", brand: "ATELIER 9", category: "Trousers", price: 2099, mrp: 2999, rating: 4.6, reviews: 187, tags: ["bestseller"], desc: "Pressed cotton twill chinos with a tapered leg and a hidden comfort waistband." },
  { name: "Pleated Wide Trousers", brand: "COAST & CO", category: "Trousers", price: 2499, mrp: 3799, rating: 4.2, reviews: 76, tags: ["new", "offer"], desc: "Single-pleat front and a wide, fluid leg for a relaxed modern silhouette." },
  { name: "Cotton Twill Shorts", brand: "URBN MILE", category: "Shorts", price: 1099, mrp: 1799, rating: 4.4, reviews: 133, tags: ["offer"], desc: "A clean 7-inch inseam short in soft twill with an elasticated back waist." },
  { name: "Active Jersey Shorts", brand: "NORTHLANE", category: "Shorts", price: 899, mrp: 1399, rating: 4.1, reviews: 64, tags: ["new"], desc: "Lightweight jersey with a drawcord waist and deep side pockets." },
  { name: "Classic Cotton Kurta", brand: "MITHILA", category: "Ethnic Wear", price: 1899, mrp: 2999, rating: 4.6, reviews: 209, tags: ["bestseller", "offer"], desc: "A festive-ready kurta in breathable cotton with a mandarin collar and side slits." },
  { name: "Silk Blend Festive Kurta", brand: "MITHILA", category: "Ethnic Wear", price: 3299, mrp: 4799, rating: 4.7, reviews: 118, tags: ["trending"], desc: "Soft silk blend with a subtle sheen and tonal placket buttons for occasion wear." },
  { name: "Everyday Casual Set", brand: "URBN MILE", category: "Casual Wear", price: 2299, mrp: 3499, rating: 4.3, reviews: 91, tags: ["new", "offer"], desc: "A matched tee and short set in a soft washed cotton. Throw it on and go." },
  { name: "Weekend Knit Co-ord", brand: "COAST & CO", category: "Casual Wear", price: 2799, mrp: 3999, rating: 4.4, reviews: 72, tags: ["trending"], desc: "Ribbed knit top and easy trouser, cut from the same yarn for a seamless look." },
  { name: "Two Piece Formal Suit", brand: "ATELIER 9", category: "Formal Wear", price: 7499, mrp: 11999, rating: 4.8, reviews: 156, tags: ["bestseller", "offer"], desc: "A half-canvassed suit in fine wool blend with natural shoulders and a clean two-button front." },
  { name: "Slim Formal Blazer", brand: "ATELIER 9", category: "Formal Wear", price: 4999, mrp: 7499, rating: 4.5, reviews: 84, tags: ["trending"], desc: "A standalone blazer that pairs as easily with denim as it does with tailored trousers." },
  { name: "Satin Party Shirt", brand: "BLOK STUDIO", category: "Party Wear", price: 1999, mrp: 3299, rating: 4.4, reviews: 147, tags: ["new", "offer", "trending"], desc: "Liquid-smooth satin with a spread collar. Built for evenings that run long." },
  { name: "Textured Evening Shirt", brand: "COAST & CO", category: "Party Wear", price: 2299, mrp: 3499, rating: 4.2, reviews: 69, tags: ["new"], desc: "A tonal jacquard shirt that catches light without shouting about it." },
];

function sizesFor(category: Category) {
  return category === "Jeans" || category === "Trousers" || category === "Shorts"
    ? WAIST_SIZES
    : APPAREL_SIZES;
}

export const products: Product[] = seeds.map((s, i) => {
  const base = categoryImages[s.category];
  const alt = [tshirt, shirt, hoodie, jacket, jeans, trousers, shorts, ethnic, formal, party];
  return {
    id: s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    name: s.name,
    brand: s.brand,
    category: s.category,
    price: s.price,
    mrp: s.mrp,
    rating: s.rating,
    reviews: s.reviews,
    sizes: sizesFor(s.category),
    colors: [NEUTRALS[i % 6], NEUTRALS[(i + 2) % 6], NEUTRALS[(i + 4) % 6]],
    images: [base, alt[(i + 3) % alt.length], alt[(i + 6) % alt.length]],
    description: s.desc,
    tags: s.tags,
    popularity: s.reviews * s.rating,
    addedOn: seeds.length - i,
  };
});

export const brands = Array.from(new Set(products.map((p) => p.brand))).sort();

export const allColors = NEUTRALS;

export function discountPercent(p: Product) {
  return Math.round(((p.mrp - p.price) / p.mrp) * 100);
}

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export const reviewsFor = (p: Product) => [
  {
    name: "Aarav Mehta",
    rating: 5,
    date: "12 Jun 2026",
    text: `Fit is exactly as described. The ${p.name.toLowerCase()} feels far more expensive than what I paid.`,
  },
  {
    name: "Kabir Shah",
    rating: 4,
    date: "02 Jun 2026",
    text: "Great quality and fast delivery. Sizing runs slightly relaxed, so consider one size down.",
  },
  {
    name: "Rohan Iyer",
    rating: 5,
    date: "24 May 2026",
    text: "Third order from this brand. Stitching and fabric are consistently excellent.",
  },
];
