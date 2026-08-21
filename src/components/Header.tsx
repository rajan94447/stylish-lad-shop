import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/categories", label: "Categories" },
  { to: "/offers", label: "Offers" },
] as const;

export function Header() {
  const { cartCount, wishlist } = useStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/shop", search: { q: query.trim() || undefined } });
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg">
      <p className="label-xs bg-foreground py-2 text-center text-background">
        Free shipping on orders over ₹2,499 · Easy 30-day returns
      </p>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="font-display text-2xl tracking-tight"
            >
              ATLAS&nbsp;<span className="text-muted-foreground">&amp; CO</span>
            </Link>
            <nav className="mt-8 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent"
                  activeProps={{ className: "bg-accent font-medium" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent"
              >
                My Account
              </Link>
            </nav>
            <form onSubmit={submit} className="mt-6">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                aria-label="Search products"
              />
            </form>
          </SheetContent>
        </Sheet>

        <Link to="/" className="font-display text-2xl leading-none tracking-tight">
          ATLAS&nbsp;<span className="text-muted-foreground">&amp; CO</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden w-64 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <Button asChild variant="ghost" size="icon" className="md:hidden" aria-label="Search">
            <Link to="/shop">
              <Search className="size-5" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Wishlist">
            <Link to="/wishlist" className="relative">
              <Heart className="size-5" />
              {wishlist.length > 0 && <Badge value={wishlist.length} />}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Shopping cart">
            <Link to="/cart" className="relative">
              <ShoppingBag className="size-5" />
              {cartCount > 0 && <Badge value={cartCount} />}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Account">
            <Link to="/account">
              <User className="size-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Badge({ value }: { value: number }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-sale text-[10px] font-semibold text-sale-foreground">
      {value}
    </span>
  );
}
