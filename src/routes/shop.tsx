import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductCard } from "@/components/ProductCard";
import {
  allColors,
  brands,
  categories,
  formatPrice,
  products,
  type Category,
} from "@/lib/products";
import { cn } from "@/lib/utils";

type ShopSearch = { q?: string; category?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
    category:
      typeof search.category === "string" && search.category ? search.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop All Boys' Clothing — Atlas & Co" },
      {
        name: "description",
        content:
          "Browse the full Atlas & Co range for boys and young men. Filter by category, size, colour, brand and price.",
      },
      { property: "og:title", content: "Shop All Boys' Clothing — Atlas & Co" },
      {
        property: "og:description",
        content: "Filter and sort the full Atlas & Co boys' fashion range.",
      },
    ],
  }),
  component: Shop,
});

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38"];
const MAX_PRICE = 12000;

function Shop() {
  const { q, category } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });

  const [search, setSearch] = useState(q ?? "");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [brandList, setBrandList] = useState<string[]>([]);
  const [price, setPrice] = useState<number[]>([0, MAX_PRICE]);
  const [sort, setSort] = useState("popularity");

  const selectedCategory = (category ?? "All") as Category | "All";
  const term = (q ?? search).trim().toLowerCase();

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const results = useMemo(() => {
    let list = products.filter((p) => {
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      if (term && !`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(term))
        return false;
      if (sizes.length && !p.sizes.some((s) => sizes.includes(s))) return false;
      if (colors.length && !p.colors.some((c) => colors.includes(c.name))) return false;
      if (brandList.length && !brandList.includes(p.brand)) return false;
      if (p.price < price[0] || p.price > price[1]) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "newest") return b.addedOn - a.addedOn;
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return b.popularity - a.popularity;
    });
    return list;
  }, [selectedCategory, term, sizes, colors, brandList, price, sort]);

  const setCategory = (value: string) =>
    navigate({
      search: (prev) => ({ ...prev, category: value === "All" ? undefined : value }),
    });

  const clearAll = () => {
    setSizes([]);
    setColors([]);
    setBrandList([]);
    setPrice([0, MAX_PRICE]);
    setSearch("");
    navigate({ search: {} });
  };

  const filters = (
    <div className="space-y-8">
      <div>
        <p className="label-xs text-muted-foreground">Category</p>
        <div className="mt-3 flex flex-col gap-1">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-accent",
                selectedCategory === c && "bg-foreground text-background hover:bg-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="label-xs text-muted-foreground">Size</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(sizes, setSizes, s)}
              className={cn(
                "min-w-11 rounded-md border px-2.5 py-1.5 text-sm transition-colors",
                sizes.includes(s)
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="label-xs text-muted-foreground">Colour</p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {allColors.map((c) => (
            <button
              key={c.name}
              type="button"
              aria-label={c.name}
              onClick={() => toggle(colors, setColors, c.name)}
              style={{ backgroundColor: c.hex }}
              className={cn(
                "size-7 rounded-full border border-border transition-all",
                colors.includes(c.name) && "ring-2 ring-foreground ring-offset-2",
              )}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="label-xs text-muted-foreground">Brand</p>
        <div className="mt-3 space-y-2.5">
          {brands.map((b) => (
            <div key={b} className="flex items-center gap-2.5">
              <Checkbox
                id={`brand-${b}`}
                checked={brandList.includes(b)}
                onCheckedChange={() => toggle(brandList, setBrandList, b)}
              />
              <Label htmlFor={`brand-${b}`} className="text-sm font-normal">
                {b}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="label-xs text-muted-foreground">Price range</p>
        <Slider
          className="mt-5"
          value={price}
          min={0}
          max={MAX_PRICE}
          step={100}
          onValueChange={setPrice}
        />
        <p className="mt-3 text-sm text-muted-foreground">
          {formatPrice(price[0])} — {formatPrice(price[1])}
        </p>
      </div>

      <Button variant="outline" className="w-full" onClick={clearAll}>
        <X className="size-4" /> Clear filters
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="label-xs text-muted-foreground">Shop</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">
        {selectedCategory === "All" ? "All products" : selectedCategory}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? "product" : "products"} available
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <form
              className="relative min-w-0 flex-1"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({
                  search: (prev) => ({ ...prev, q: search.trim() || undefined }),
                });
              }}
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, brands, categories"
                aria-label="Search products"
                className="pl-9"
              />
            </form>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="size-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto p-6">
                <SheetTitle className="mb-6 font-display text-2xl">Filters</SheetTitle>
                {filters}
              </SheetContent>
            </Sheet>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-48" aria-label="Sort products">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {results.length === 0 ? (
            <div className="mt-16 rounded-lg border border-dashed border-border py-20 text-center">
              <h2 className="text-2xl">No products match those filters</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try widening your price range or clearing a filter.
              </p>
              <Button className="mt-6" onClick={clearAll}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
