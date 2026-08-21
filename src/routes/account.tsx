import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Package, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Atlas & Co" },
      {
        name: "description",
        content:
          "Your Atlas & Co account: recent order, saved wishlist items and the contents of your cart.",
      },
      { property: "og:title", content: "My Account — Atlas & Co" },
      { property: "og:description", content: "Orders, wishlist and cart in one place." },
    ],
  }),
  component: Account;
});

function Account() {
  const { lastOrder, wishlist, cartCount, total } = useStore();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-4">
        <div className="grid size-14 place-items-center rounded-full bg-surface">
          <User className="size-6" />
        </div>
        <div>
          <h1 className="text-4xl">My account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {lastOrder ? lastOrder.email : "Guest shopper"}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link
          to="/wishlist"
          className="card-hover rounded-lg border border-border p-6 transition-colors"
        >
          <Heart className="size-5" />
          <p className="mt-4 text-2xl font-semibold">{wishlist.length}</p>
          <p className="text-sm text-muted-foreground">Saved items</p>
        </Link>
        <Link
          to="/cart"
          className="card-hover rounded-lg border border-border p-6 transition-colors"
        >
          <ShoppingBag className="size-5" />
          <p className="mt-4 text-2xl font-semibold">{cartCount}</p>
          <p className="text-sm text-muted-foreground">
            In cart · {formatPrice(total)}
          </p>
        </Link>
        <div className="rounded-lg border border-border p-6">
          <Package className="size-5" />
          <p className="mt-4 text-2xl font-semibold">{lastOrder ? 1 : 0}</p>
          <p className="text-sm text-muted-foreground">Recent orders</p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl">Order history</h2>
        {lastOrder ? (
          <div className="mt-5 rounded-lg border border-border p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{lastOrder.id}</p>
                <p className="text-sm text-muted-foreground">
                  Placed {lastOrder.placedAt} · {lastOrder.payment}
                </p>
              </div>
              <p className="text-lg font-semibold">{formatPrice(lastOrder.total)}</p>
            </div>
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              {lastOrder.items.map((i) => (
                <li key={`${i.name}-${i.size}`}>
                  {i.name} · Size {i.size} × {i.qty}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-5">
              <Link to="/order-confirmation">View confirmation</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground">You have not placed an order yet.</p>
            <Button asChild className="mt-5">
              <Link to="/shop">Browse the collection</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
