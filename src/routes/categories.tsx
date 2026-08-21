import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { categories, categoryImages, products } from "@/lib/products";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Boys' Clothing Ranges | Atlas & Co" },
      {
        name: "description",
        content:
          "Browse every Atlas & Co category: t-shirts, shirts, hoodies, jackets, jeans, trousers, shorts, ethnic, casual, formal and party wear.",
      },
      { property: "og:title", content: "Categories — Boys' Clothing Ranges" },
      {
        property: "og:description",
        content: "Eleven curated categories of boys' and young men's fashion.",
      },
    ],
  }),
  component: Categories,
});

function Categories() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="label-xs text-muted-foreground">Browse</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">All categories</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Eleven edits covering everything from everyday tees to occasion tailoring.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => {
          const count = products.filter((p) => p.category === c).length;
          return (
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
                <span>
                  <span className="block text-sm font-medium">{c}</span>
                  <span className="text-xs text-muted-foreground">{count} styles</span>
                </span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
