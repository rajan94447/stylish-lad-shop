import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — Latest Boys' Fashion | Atlas & Co" },
      {
        name: "description",
        content:
          "The newest drops in boys' fashion: fresh tees, shirts, hoodies, denim and party wear added this season.",
      },
      { property: "og:title", content: "New Arrivals — Latest Boys' Fashion" },
      {
        property: "og:description",
        content: "Fresh styles added to the Atlas & Co range this season.",
      },
    ],
  }),
  component: NewArrivals,
});

function NewArrivals() {
  const list = [...products]
    .filter((p) => p.tags.includes("new"))
    .sort((a, b) => b.addedOn - a.addedOn);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="label-xs text-muted-foreground">Just landed</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">New arrivals</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        {list.length} new styles added this season, from lightweight layers to evening
        shirting.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
