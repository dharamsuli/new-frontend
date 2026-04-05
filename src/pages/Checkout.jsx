import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { formatINR } from "../utils/currency";
import { placeOrder } from "../utils/orders";

const coupons = {
  NOOKNATIVE50: { code: "NOOKNATIVE50", minSubtotal: 60000, discount: 5000 },
  NOOKNATIVE120: { code: "NOOKNATIVE120", minSubtotal: 120000, discount: 12000 }
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const storedCoupon = typeof window !== "undefined" ? localStorage.getItem("nook_native_coupon") || "" : "";
  const shippingFee = subtotal >= 50000 ? 0 : 4000;

  const appliedCoupon = useMemo(() => {
    const coupon = coupons[storedCoupon];
    return coupon && subtotal >= coupon.minSubtotal ? coupon : null;
  }, [storedCoupon, subtotal]);

  useEffect(() => {
    if (!storedCoupon || appliedCoupon) {
      return;
    }

    localStorage.removeItem("nook_native_coupon");
  }, [appliedCoupon, storedCoupon]);

  const total = Math.max(0, subtotal + shippingFee - (appliedCoupon?.discount || 0));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      fullName: user?.name || "",
      phone: user?.phone || "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: ""
    }
  });

  const onSubmit = async (values) => {
    try {
      const order = await placeOrder({
        items: items.map((item) => ({
          productId: item.id,
          qty: item.qty
        })),
        couponCode: appliedCoupon?.code || "",
        shippingAddress: values
      });

      localStorage.removeItem("nook_native_coupon");
      clearCart();
      toast.success(`Order ${order.orderNumber} placed with COD`);
      navigate("/orders");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!items.length) {
    return <p className="text-sm text-slate-500">Your cart is empty.</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-[32px] bg-white p-6 shadow-lg shadow-emerald-100">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Checkout</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Cash on delivery</h1>
          <p className="mt-2 text-sm text-slate-500">We only collect the essential delivery details needed to fulfill your order.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={errors.fullName?.message}>
            <input className="input" autoComplete="name" {...register("fullName", { required: "Full name is required" })} />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <input className="input" autoComplete="tel" {...register("phone", { required: "Phone is required" })} />
          </Field>
        </div>

        <Field label="Address line 1" error={errors.addressLine1?.message}>
          <input className="input" autoComplete="address-line1" {...register("addressLine1", { required: "Address is required" })} />
        </Field>

        <Field label="Address line 2">
          <input className="input" autoComplete="address-line2" {...register("addressLine2")} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="City" error={errors.city?.message}>
            <input className="input" autoComplete="address-level2" {...register("city", { required: "City is required" })} />
          </Field>
          <Field label="State" error={errors.state?.message}>
            <input className="input" autoComplete="address-level1" {...register("state", { required: "State is required" })} />
          </Field>
          <Field label="Postal code" error={errors.postalCode?.message}>
            <input className="input" autoComplete="postal-code" {...register("postalCode", { required: "Postal code is required" })} />
          </Field>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white">
          {isSubmitting ? "Placing order..." : "Place COD order"}
        </button>
      </form>

      <div className="space-y-4 rounded-[32px] bg-white p-6 shadow-lg shadow-emerald-100">
        <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>

        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 text-sm">
            <div>
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="text-slate-500">Qty {item.qty}</p>
            </div>
            <p className="font-semibold text-slate-900">{formatINR(item.price * item.qty)}</p>
          </div>
        ))}

        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? "Free" : formatINR(shippingFee)}</span></div>
          <div className="flex justify-between text-emerald-700"><span>Coupon</span><span>- {formatINR(appliedCoupon?.discount || 0)}</span></div>
          <div className="flex justify-between border-t border-slate-100 pt-3 text-lg font-semibold text-slate-900"><span>Total</span><span>{formatINR(total)}</span></div>
        </div>

        <p className="rounded-[24px] bg-amber-50 p-4 text-sm text-amber-800">
          Payment method is COD only. Please keep the exact amount ready at delivery time.
        </p>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  );
}

export default CheckoutPage;
