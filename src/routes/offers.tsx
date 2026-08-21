import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { discountPercent, products } from "@/lib/products";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers & Discounts on Boys' Clothing | Atlas & Co" },
      {
        name: "description",
        content:
          "Save up to 40% on boys' fashion. Discounted tees, hoodies, denim, suits and party wear with free shipping over ₹2,499.",
      },
      { property: "og:title", content: "Offers & Discounts on Boys' Clothing" },
      {
        property: "og:description",
        content: "Season discounts of up to 40% across the Atlas & Co range.",
      },
    ],
  }),
  component: Offers,
});

function Offers() {
  const list = [...products]
    .filter((p) => p.tags.includes("offer"))
    .sort((a, b) => discountPercent(b) - discountPercent(a));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-border bg-surface p-8 sm:p-12">
        <p className="label-xs text-sale">Limited time</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Up to 40% off</h1>
        <p className="mt-4 max-w-lg text-muted-foreground">
          Season markdowns across every category. Apply code{" "}
          <span className="font-semibold text-foreground">ATLAS40</span> at checkout for an
          extra 10% off orders above ₹4,999.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
