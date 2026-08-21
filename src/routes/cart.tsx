import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Shopping Cart — Atlas & Co" },
      {
        name: "description",
        content:
          "Review the items in your Atlas & Co cart, adjust sizes and quantities, and continue to secure checkout.",
      },
      { property: "og:title", content: "Your Shopping Cart — Atlas & Co" },
      { property: "og:description", content: "Review your bag and check out securely." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cartDetailed, setQty, removeFromCart, subtotal, savings, delivery, total } =
    useStore();

  if (cartDetailed.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-6 text-4xl">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">
          Browse the collection and add a few essentials to get started.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/shop">Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl">Shopping cart</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {cartDetailed.length} {cartDetailed.length === 1 ? "item" : "items"} in your bag
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          {cartDetailed.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-lg border border-border p-4 sm:gap-6"
            >
              <Link
                to="/product/$id"
                params={{ id: item.product.id }}
                className="w-24 shrink-0 overflow-hidden rounded-md bg-surface sm:w-28"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  loading="lazy"
                  width={900}
                  height={1100}
                  className="h-full w-full object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col">
                <p className="label-xs text-muted-foreground">{item.product.brand}</p>
                <Link
                  to="/product/$id"
                  params={{ id: item.product.id }}
                  className="mt-1 font-medium hover:underline"
                >
                  {item.product.name}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  Size {item.size} · {item.color}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
                  <div className="inline-flex items-center rounded-md border border-border">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="grid size-9 place-items-center transition-colors hover:bg-accent"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-9 text-center text-sm font-medium">{item.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="grid size-9 place-items-center transition-colors hover:bg-accent"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-sale"
                  >
                    <Trash2 className="size-4" /> Remove
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {formatPrice(item.product.price * item.qty)}
                </p>
                <p className="text-xs text-muted-foreground line-through">
                  {formatPrice(item.product.mrp * item.qty)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-lg border border-border bg-surface p-6 lg:sticky lg:top-32">
          <h2 className="text-2xl">Order summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Discount</dt>
              <dd className="text-sale">− {formatPrice(savings)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd>{delivery === 0 ? "Free" : formatPrice(delivery)}</dd>
            </div>
          </dl>
          <Separator className="my-5" />
          <div className="flex items-baseline justify-between">
            <span className="font-medium">Total</span>
            <span className="text-2xl font-semibold">{formatPrice(total)}</span>
          </div>
          {delivery > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Add {formatPrice(2499 - subtotal)} more for free delivery.
            </p>
          )}
          <Button asChild size="lg" className="mt-6 w-full">
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full">
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
