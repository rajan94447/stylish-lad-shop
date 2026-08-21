import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/products";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <p className="font-display text-2xl">
            ATLAS&nbsp;<span className="text-muted-foreground">&amp; CO</span>
          </p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Modern wardrobe essentials for boys and young men — considered fabrics, honest
            pricing and fits that actually work.
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Customer care · care@atlasandco.example · Mon–Sat, 9am–7pm IST
          </p>
        </div>
        <div>
          <p className="label-xs text-muted-foreground">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c}>
                <Link
                  to="/shop"
                  search={{ category: c }}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label-xs text-muted-foreground">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/new-arrivals", label: "New Arrivals" },
              { to: "/offers", label: "Offers" },
              { to: "/categories", label: "Categories" },
              { to: "/wishlist", label: "Wishlist" },
              { to: "/cart", label: "Cart" },
              { to: "/account", label: "My Account" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Atlas &amp; Co. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
