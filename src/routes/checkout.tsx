import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreditCard, Landmark, Wallet, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — Atlas & Co" },
      {
        name: "description",
        content:
          "Enter your delivery details and choose a payment method to complete your Atlas & Co order securely.",
      },
      { property: "og:title", content: "Secure Checkout — Atlas & Co" },
      { property: "og:description", content: "Complete your order in a few steps." },
    ],
  }),
  component: Checkout,
});

const schema = z.object({
  fullName: z.string().min(3, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter a 10-digit phone number"),
  address: z.string().min(8, "Enter your street address"),
  city: z.string().min(2, "Enter your city"),
  state: z.string().min(2, "Enter your state"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Enter a 6-digit PIN code"),
  payment: z.enum(["card", "upi", "netbanking", "cod"]),
});

type FormValues = z.infer<typeof schema>;

const paymentOptions = [
  { value: "card", label: "Credit / Debit Card", icon: CreditCard },
  { value: "upi", label: "UPI", icon: Wallet },
  { value: "netbanking", label: "Net Banking", icon: Landmark },
  { value: "cod", label: "Cash on Delivery", icon: Banknote },
] as const;

function Checkout() {
  const { cartDetailed, subtotal, savings, delivery, total, placeOrder } = useStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { payment: "card" },
  });

  const payment = watch("payment");

  if (cartDetailed.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-4xl">Nothing to check out</h1>
        <p className="mt-3 text-muted-foreground">
          Add a few pieces to your cart before placing an order.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/shop">Go to shop</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = (values: FormValues) => {
    placeOrder({
      id: `ATL-${Math.floor(100000 + Math.random() * 900000)}`,
      name: values.fullName,
      email: values.email,
      address: `${values.address}, ${values.city}, ${values.state} ${values.pincode}`,
      total,
      payment: paymentOptions.find((p) => p.value === values.payment)!.label,
      items: cartDetailed.map((i) => ({
        name: i.product.name,
        qty: i.qty,
        size: i.size,
        price: i.product.price * i.qty,
      })),
      placedAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    });
    navigate({ to: "/order-confirmation" });
  };

  const field = (
    name: keyof FormValues,
    label: string,
    placeholder: string,
    type = "text",
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} type={type} placeholder={placeholder} {...register(name)} />
      {errors[name] && <p className="text-xs text-sale">{errors[name]?.message}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl">Checkout</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]"
      >
        <div className="space-y-10">
          <section className="rounded-lg border border-border p-6">
            <h2 className="text-2xl">Customer information</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {field("fullName", "Full name", "Arjun Verma")}
              {field("email", "Email", "arjun@example.com", "email")}
              {field("phone", "Phone", "9876543210")}
            </div>
          </section>

          <section className="rounded-lg border border-border p-6">
            <h2 className="text-2xl">Shipping address</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                {field("address", "Street address", "12 Turner Road, Bandra West")}
              </div>
              {field("city", "City", "Mumbai")}
              {field("state", "State", "Maharashtra")}
              {field("pincode", "PIN code", "400050")}
            </div>
          </section>

          <section className="rounded-lg border border-border p-6">
            <h2 className="text-2xl">Payment method</h2>
            <RadioGroup
              value={payment}
              onValueChange={(v) => setValue("payment", v as FormValues["payment"])}
              className="mt-6 grid gap-3 sm:grid-cols-2"
            >
              {paymentOptions.map((opt) => (
                <Label
                  key={opt.value}
                  htmlFor={`pay-${opt.value}`}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-4 transition-colors hover:border-foreground has-[[data-state=checked]]:border-foreground has-[[data-state=checked]]:bg-accent"
                >
                  <RadioGroupItem id={`pay-${opt.value}`} value={opt.value} />
                  <opt.icon className="size-4" />
                  <span className="text-sm font-normal">{opt.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </section>
        </div>

        <aside className="h-fit rounded-lg border border-border bg-surface p-6 lg:sticky lg:top-32">
          <h2 className="text-2xl">Order summary</h2>
          <ul className="mt-5 space-y-3">
            {cartDetailed.map((i) => (
              <li key={i.id} className="flex justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  {i.product.name} · {i.size} × {i.qty}
                </span>
                <span>{formatPrice(i.product.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-5" />
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Discount</dt>
              <dd className="text-sale">− {formatPrice(savings)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd>{delivery === 0 ? "Free" : formatPrice(delivery)}</dd>
            </div>
          </dl>
          <Separator className="my-5" />
          <div className="flex items-baseline justify-between">
            <span className="font-medium">Total</span>
            <span className="text-2xl font-semibold">{formatPrice(total)}</span>
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
            Place Order
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Demo checkout — no payment is actually processed.
          </p>
        </aside>
      </form>
    </div>
  );
}
