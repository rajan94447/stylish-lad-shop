import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { QuickView } from "@/components/QuickView";
import { discountPercent, formatPrice, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted, addToCart } = useStore();
  const [quickView, setQuickView] = useState(false);
  const wished = isWishlisted(product.id);
  const off = discountPercent(product);

  return (
    <>
      <article className="group card-hover relative flex flex-col overflow-hidden rounded-lg border border-border bg-card">
        <div className="relative aspect-4/5 overflow-hidden bg-surface">
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            aria-label={product.name}
            className="block h-full w-full"
          >
            <img
              src={product.images[0]}
              alt={`${product.brand} ${product.name}`}
              loading="lazy"
              width={900}
              height={1100}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
          </Link>

          {off > 0 && (
            <span className="label-xs absolute left-3 top-3 rounded-full bg-sale px-2.5 py-1 text-sale-foreground">
              {off}% off
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              toggleWishlist(product.id);
              toast(wished ? "Removed from wishlist" : "Added to wishlist");
            }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/90 backdrop-blur transition-colors hover:bg-background"
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                wished ? "fill-sale text-sale" : "text-foreground",
              )}
            />
          </button>

          <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => {
                addToCart(
                  product.id,
                  product.sizes[Math.floor(product.sizes.length / 2)],
                  product.colors[0].name,
                );
                toast.success("Added to cart");
              }}
            >
              <ShoppingBag className="size-4" /> Add to Cart
            </Button>
            <Button
              size="sm"
              variant="secondary"
              aria-label="Quick view"
              onClick={() => setQuickView(true)}
            >
              <Eye className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="label-xs text-muted-foreground">{product.brand}</p>
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            className="text-sm font-medium leading-snug hover:underline"
          >
            {product.name}
          </Link>
          <StarRating rating={product.rating} count={product.reviews} />
          <div className="mt-auto flex items-baseline gap-2 pt-1">
            <span className="text-base font-semibold">{formatPrice(product.price)}</span>
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.mrp)}
            </span>
            <span className="text-xs font-medium text-sale">{off}% off</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Sizes: {product.sizes.join(" · ")}
          </p>
        </div>
      </article>

      <QuickView product={product} open={quickView} onOpenChange={setQuickView} />
    </>
  );
}
