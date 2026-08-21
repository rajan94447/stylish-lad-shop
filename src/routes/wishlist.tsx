import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPrice, getProduct } from "@/lib/products";
import { useStore } from "@/lib/store";
import { StarRating } from "@/components/StarRating";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — Atlas & Co" },
      {
        name: "description",
        content:
          "Everything you have saved for later at Atlas & Co. Move wishlist items straight into your cart.",
      },
      { property: "og:title", content: "Your Wishlist — Atlas & Co" },
      { property: "og:description", content: "Saved styles, ready when you are." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist, toggleWishlist, moveToCart } = useStore();
  const items = wishlist.map(getProduct).filter(Boolean);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <Heart className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-6 text-4xl">Your wishlist is empty</h1>
        <p className="mt-3 text-muted-foreground">
          Tap the heart on any product to save it here for later.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/shop">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl">Wishlist</h1>
      <p className="mt-3 text-sm text-muted-foreground">{items.length} saved styles</p>

      <ul className="mt-10 space-y-4">
        {items.map((p) => (
          <li key={p!.id} className="flex gap-4 rounded-lg border border-border p-4 sm:gap-6">
            <Link
              to="/product/$id"
              params={{ id: p!.id }}
              className="w-24 shrink-0 overflow-hidden rounded-md bg-surface sm:w-28"
            >
              <img
                src={p!.images[0]}
                alt={p!.name}
                loading="lazy"
                width={900}
                height={1100}
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="flex flex-1 flex-col">
              <p className="label-xs text-muted-foreground">{p!.brand}</p>
              <Link
                to="/product/$id"
                params={{ id: p!.id }}
                className="mt-1 font-medium hover:underline"
              >
                {p!.name}
              </Link>
              <div className="mt-2">
                <StarRating rating={p!.rating} count={p!.reviews} />
              </div>
              <p className="mt-2 font-semibold">{formatPrice(p!.price)}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                <Button
                  size="sm"
                  onClick={() => {
                    moveToCart(p!.id);
                    toast.success("Moved to cart");
                  }}
                >
                  Move to Cart
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    toggleWishlist(p!.id);
                    toast("Removed from wishlist");
                  }}
                >
                  <Trash2 className="size-4" /> Remove
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
