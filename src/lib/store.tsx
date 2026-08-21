import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "./products";

export type CartItem = {
  id: string;
  productId: string;
  size: string;
  color: string;
  qty: number;
};

export type Order = {
  id: string;
  name: string;
  email: string;
  address: string;
  total: number;
  items: { name: string; qty: number; size: string; price: number }[];
  payment: string;
  placedAt: string;
};

type StoreValue = {
  cart: CartItem[];
  wishlist: string[];
  lastOrder: Order | null;
  addToCart: (productId: string, size: string, color: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  moveToCart: (productId: string) => void;
  placeOrder: (order: Order) => void;
  cartCount: number;
  subtotal: number;
  savings: number;
  delivery: number;
  total: number;
  cartDetailed: (CartItem & { product: Product })[];
};

const StoreContext = createContext<StoreValue | null>(null);

const CART_KEY = "atlas-cart";
const WISH_KEY = "atlas-wishlist";
const ORDER_KEY = "atlas-last-order";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(read<CartItem[]>(CART_KEY, []));
    setWishlist(read<string[]>(WISH_KEY, []));
    setLastOrder(read<Order | null>(ORDER_KEY, null));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);
  useEffect(() => {
    if (hydrated && lastOrder)
      window.localStorage.setItem(ORDER_KEY, JSON.stringify(lastOrder));
  }, [lastOrder, hydrated]);

  const value = useMemo<StoreValue>(() => {
    const cartDetailed = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? { ...item, product } : null;
      })
      .filter(Boolean) as (CartItem & { product: Product })[];

    const subtotal = cartDetailed.reduce((s, i) => s + i.product.price * i.qty, 0);
    const savings = cartDetailed.reduce(
      (s, i) => s + (i.product.mrp - i.product.price) * i.qty,
      0,
    );
    const delivery = subtotal === 0 || subtotal >= 2499 ? 0 : 99;

    return {
      cart,
      wishlist,
      lastOrder,
      cartDetailed,
      subtotal,
      savings,
      delivery,
      total: subtotal + delivery,
      cartCount: cart.reduce((s, i) => s + i.qty, 0),
      addToCart: (productId, size, color, qty = 1) =>
        setCart((prev) => {
          const id = `${productId}__${size}__${color}`;
          const existing = prev.find((i) => i.id === id);
          if (existing)
            return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
          return [...prev, { id, productId, size, color, qty }];
        }),
      removeFromCart: (id) => setCart((prev) => prev.filter((i) => i.id !== id)),
      setQty: (id, qty) =>
        setCart((prev) =>
          prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i)),
        ),
      clearCart: () => setCart([]),
      toggleWishlist: (productId) =>
        setWishlist((prev) =>
          prev.includes(productId)
            ? prev.filter((p) => p !== productId)
            : [...prev, productId],
        ),
      isWishlisted: (productId) => wishlist.includes(productId),
      moveToCart: (productId) => {
        const product = products.find((p) => p.id === productId);
        if (!product) return;
        const size = product.sizes[Math.floor(product.sizes.length / 2)]!;
        const color = product.colors[0]!.name;
        const id = `${productId}__${size}__${color}`;
        setCart((prev) =>
          prev.find((i) => i.id === id)
            ? prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
            : [...prev, { id, productId, size, color, qty: 1 }],
        );
        setWishlist((prev) => prev.filter((p) => p !== productId));
      },
      placeOrder: (order) => {
        setLastOrder(order);
        setCart([]);
      },
    };
  }, [cart, wishlist, lastOrder]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
