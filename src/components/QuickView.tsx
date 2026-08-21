import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { discountPercent, formatPrice, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function QuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addToCart } = useStore();
  const [size, setSize] = useState(product.sizes[Math.floor(product.sizes.length / 2)]);
  const [color, setColor] = useState(product.colors[0].name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="aspect-4/5 bg-surface">
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              width={900}
              height={1100}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-4 p-6">
            <DialogHeader className="space-y-1 text-left">
              <p className="label-xs text-muted-foreground">{product.brand}</p>
              <DialogTitle className="font-display text-2xl">{product.name}</DialogTitle>
              <DialogDescription className="line-clamp-3">
                {product.description}
              </DialogDescription>
            </DialogHeader>

            <StarRating rating={product.rating} count={product.reviews} />

            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold">{formatPrice(product.price)}</span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.mrp)}
              </span>
              <span className="text-sm font-medium text-sale">
                {discountPercent(product)}% off
              </span>
            </div>

            <div className="space-y-2">
              <p className="label-xs text-muted-foreground">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={cn(
                      "min-w-11 rounded-md border px-3 py-1.5 text-sm transition-colors",
                      size === s
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="label-xs text-muted-foreground">Colour — {color}</p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    aria-label={c.name}
                    onClick={() => setColor(c.name)}
                    style={{ backgroundColor: c.hex }}
                    className={cn(
                      "size-7 rounded-full border transition-all",
                      color === c.name
                        ? "ring-2 ring-foreground ring-offset-2"
                        : "border-border",
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-2 pt-2">
              <Button
                onClick={() => {
                  addToCart(product.id, size, color);
                  toast.success("Added to cart");
                  onOpenChange(false);
                }}
              >
                Add to Cart
              </Button>
              <Button asChild variant="outline">
                <Link
                  to="/product/$id"
                  params={{ id: product.id }}
                  onClick={() => onOpenChange(false)}
                >
                  View full details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
