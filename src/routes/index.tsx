import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { categories, categoryImages, products } from "@/lib/products";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atlas & Co — Premium Boys' Fashion & Clothing Online" },
      {
        name: "description",
        content:
          "Discover premium boys' fashion: new arrivals, trending styles and best sellers in tees, shirts, hoodies, denim and formal wear.",
      },
      { property: "og:title", content: "Atlas & Co — Premium Boys' Fashion Online" },
      {
        property: "og:description",
        content: "New arrivals, trending styles and best sellers for boys and young men.",
      },
    ],
  }),
  component: Home,
});

const featured = products.filter((p) => p.tags.includes("trending")).slice(0, 4);
const newArrivals = [...products]
  .filter((p) => p.tags.includes("new"))
  .sort((a, b) => b.addedOn - a.addedOn)
  .slice(0, 4);
const bestSellers = [...products]
  .filter((p) => p.tags.includes("bestseller"))
  .sort((a, b) => b.popularity - a.popularity)
  .slice(0, 4);

function Section({
  title,
  subtitle,
  to,
  search,
  children,
}: {
  title: string;
  subtitle: string;
  to: string;
  search?: Record<string, string>;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-xs text-muted-foreground">{subtitle}</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">{title}</h2>
        </div>
        <Button asChild variant="ghost" className="group">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link to={to as any} search={search as any}>
            View all
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">{children}</div>
    </section>
  );
}

function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="fade-up">
            <p className="label-xs text-muted-foreground">Season 06 · Everyday Icons</p>
            <h1 className="mt-4 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              Sharp fits for
              <br />
              the next generation
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              Considered fabrics, honest pricing and silhouettes built for boys and young
              men who care how things fit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/shop">
                  Shop Now <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/new-arrivals">New Arrivals</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Truck className="size-4" /> Free shipping over ₹2,499
              </span>
              <span className="flex items-center gap-2">
                <RefreshCw className="size-4" /> 30-day returns
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4" /> Secure checkout
              </span>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl bg-background shadow-[var(--shadow-lift)]">
            <img
              src={hero}
              alt="Young man wearing a white tee and beige overshirt"
              width={1920}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="label-xs text-muted-foreground">Featured collections</p>
        <h2 className="mt-2 text-3xl sm:text-4xl">Shop by category</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 8).map((c) => (
            <Link
              key={c}
              to="/shop"
              search={{ category: c }}
              className="group card-hover relative overflow-hidden rounded-lg border border-border"
            >
              <div className="aspect-3/4 overflow-hidden bg-surface">
                <img
                  src={categoryImages[c]}
                  alt={c}
                  loading="lazy"
                  width={900}
                  height={1100}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-background/90 px-4 py-3 backdrop-blur">
                <span className="text-sm font-medium">{c}</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Section title="New arrivals" subtitle="Just landed" to="/new-arrivals">
        {newArrivals.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </Section>

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 rounded-xl border border-border bg-background p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <p className="label-xs text-sale">Limited time</p>
              <h2 className="mt-3 text-4xl">Up to 40% off the essentials drop</h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Restocked tees, hoodies and denim at their lowest prices this season. Use
                code <span className="font-semibold text-foreground">ATLAS40</span> at
                checkout.
              </p>
              <Button asChild size="lg" className="mt-7">
                <Link to="/offers">Explore offers</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {products
                .filter((p) => p.tags.includes("offer"))
                .slice(0, 2)
                .map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
            </div>
          </div>
        </div>
      </section>

      <Section title="Trending styles" subtitle="Moving fast" to="/shop">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </Section>

      <Section title="Best sellers" subtitle="Loved by thousands" to="/shop">
        {bestSellers.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </Section>
    </div>
  );
}
