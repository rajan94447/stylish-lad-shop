import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Minus, Plus, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/StarRating";
import { ProductCard } from "@/components/ProductCard";
import {
  discountPercent,
  formatPrice,
  getProduct,
  products,
  reviewsFor,
} from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { name: product.name, brand: product.brand, description: product.description };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable — Atlas & Co" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} by ${loaderData.brand} — Atlas & Co`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const product = getProduct(id)!;
  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  const [image, setImage] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(product.colors[0]!.name);
  const [qty, setQty] = useState(1);

  const wished = isWishlisted(product.id);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .concat(products.filter((p) => p.brand === product.brand && p.id !== product.id))
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, 4);

  const handleAdd = () => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    addToCart(product.id, size, color, qty);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" search={{ category: product.category }} className="hover:text-foreground">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          <div className="flex gap-3 sm:flex-col">
            {product.images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setImage(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  "size-20 overflow-hidden rounded-md border bg-surface transition-all",
                  image === i ? "border-foreground" : "border-border hover:border-foreground/50",
                )}
              >
                <img
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  loading="lazy"
                  width={900}
                  height={1100}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden rounded-xl border border-border bg-surface">
            <img
              src={product.images[image]}
              alt={product.name}
              width={900}
              height={1100}
              className="aspect-4/5 w-full object-cover"
            />
          </div>
        </div>

        <div>
          <p className="label-xs text-muted-foreground">{product.brand}</p>
          <h1 className="mt-2 text-4xl">{product.name}</h1>
          <div className="mt-3">
            <StarRating rating={product.rating} count={product.reviews} />
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
            <span className="text-base text-muted-foreground line-through">
              {formatPrice(product.mrp)}
            </span>
            <span className="text-base font-medium text-sale">
              {discountPercent(product)}% off
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>

          <Separator className="my-7" />

          <div className="space-y-3">
            <p className="label-xs text-muted-foreground">
              Size {size ? `— ${size}` : "(select one)"}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={cn(
                    "min-w-12 rounded-md border px-3.5 py-2 text-sm transition-colors",
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

          <div className="mt-6 space-y-3">
            <p className="label-xs text-muted-foreground">Colour — {color}</p>
            <div className="flex gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  aria-label={c.name}
                  onClick={() => setColor(c.name)}
                  style={{ backgroundColor: c.hex }}
                  className={cn(
                    "size-8 rounded-full border border-border transition-all",
                    color === c.name && "ring-2 ring-foreground ring-offset-2",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <p className="label-xs text-muted-foreground">Quantity</p>
            <div className="inline-flex items-center rounded-md border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                className="grid size-10 place-items-center transition-colors hover:bg-accent"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((v) => Math.min(10, v + 1))}
                className="grid size-10 place-items-center transition-colors hover:bg-accent"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="flex-1" onClick={handleAdd}>
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={() => {
                toggleWishlist(product.id);
                toast(wished ? "Removed from wishlist" : "Saved to wishlist");
              }}
            >
              <Heart className={cn("size-4", wished && "fill-sale text-sale")} />
              {wished ? "In Wishlist" : "Add to Wishlist"}
            </Button>
          </div>

          <div className="mt-8 space-y-2 rounded-lg border border-border bg-surface p-5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Truck className="size-4" /> Delivered in 3–5 business days · Free over ₹2,499
            </p>
            <p className="flex items-center gap-2">
              <RotateCcw className="size-4" /> 30-day free returns and size exchanges
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="size-4" /> 1-year stitching warranty
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl">Description</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {product.description} Machine wash cold with like colours, tumble dry low and
              warm iron if needed. The model is 6'0" and wears a size{" "}
              {product.sizes[Math.floor(product.sizes.length / 2)]}.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-3xl">Customer reviews</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {reviewsFor(product).map((r) => (
            <article key={r.name} className="rounded-lg border border-border p-5">
              <StarRating rating={r.rating} />
              <p className="mt-3 text-sm leading-relaxed">{r.text}</p>
              <p className="mt-4 text-xs text-muted-foreground">
                {r.name} · {r.date}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl">You may also like</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
