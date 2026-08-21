import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Atlas & Co" },
      {
        name: "description",
        content: "Your Atlas & Co order is confirmed. Track delivery details and shop more.",
      },
      { property: "og:title", content: "Order Confirmed — Atlas & Co" },
      { property: "og:description", content: "Thanks for shopping with Atlas & Co." },
    ],
  }),
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const { lastOrder } = useStore();

  if (!lastOrder) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-4xl">No recent order</h1>
        <p className="mt-3 text-muted-foreground">
          Once you place an order, the confirmation will appear here.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/shop">Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="fade-up rounded-xl border border-border p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto size-12" />
        <h1 className="mt-6 text-4xl">Order confirmed</h1>
        <p className="mt-3 text-muted-foreground">
          Thanks, {lastOrder.name}. We have emailed the receipt to {lastOrder.email}.
        </p>

        <div className="mt-8 rounded-lg bg-surface p-6 text-left">
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Order number</span>
            <span className="font-medium">{lastOrder.id}</span>
          </div>
          <div className="mt-2 flex flex-wrap justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Placed on</span>
            <span>{lastOrder.placedAt}</span>
          </div>
          <div className="mt-2 flex flex-wrap justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Payment</span>
            <span>{lastOrder.payment}</span>
          </div>
          <Separator className="my-4" />
          <ul className="space-y-2 text-sm">
            {lastOrder.items.map((i) => (
              <li key={`${i.name}-${i.size}`} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {i.name} · {i.size} × {i.qty}
                </span>
                <span>{formatPrice(i.price)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <div className="flex justify-between font-medium">
            <span>Total paid</span>
            <span>{formatPrice(lastOrder.total)}</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Shipping to {lastOrder.address}. Expected delivery in 3–5 business days.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/shop">Continue shopping</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/account">View account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
