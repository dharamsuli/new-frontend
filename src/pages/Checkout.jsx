import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { formatINR } from "../utils/currency";
import { placeOrder } from "../utils/orders";
import gsap from "gsap";
import { TbUser, TbPhone, TbMapPin, TbArrowRight, TbCoin } from "react-icons/tb";

const coupons = {
  NOOKNATIVE50:  { code: "NOOKNATIVE50",  minSubtotal: 60000,  discount: 5000  },
  NOOKNATIVE120: { code: "NOOKNATIVE120", minSubtotal: 120000, discount: 12000 },
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const rootRef = useRef(null);

  const storedCoupon = typeof window !== "undefined" ? localStorage.getItem("nook_native_coupon") || "" : "";
  const shippingFee  = subtotal >= 50000 ? 0 : 4000;

  const appliedCoupon = useMemo(() => {
    const coupon = coupons[storedCoupon];
    return coupon && subtotal >= coupon.minSubtotal ? coupon : null;
  }, [storedCoupon, subtotal]);

  useEffect(() => {
    if (!storedCoupon || appliedCoupon) return;
    localStorage.removeItem("nook_native_coupon");
  }, [appliedCoupon, storedCoupon]);

  const total = Math.max(0, subtotal + shippingFee - (appliedCoupon?.discount || 0));

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      fullName:     user?.name  || "",
      phone:        user?.phone || "",
      addressLine1: "",
      addressLine2: "",
      city:         "",
      state:        "",
      postalCode:   "",
    },
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".checkout-fade",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.09, ease: "power3.out" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const onSubmit = async (values) => {
    try {
      const order = await placeOrder({
        items: items.map((item) => ({ productId: item.id, qty: item.qty })),
        couponCode: appliedCoupon?.code || "",
        shippingAddress: values,
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
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-orange-50 flex items-center justify-center">
        <p className="text-sm text-slate-400">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-orange-50">
      <div className="mx-auto max-w-6xl px-5 py-10">

        {/* Header */}
        <div className="checkout-fade mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Checkout</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-800" style={{ letterSpacing: "-0.02em" }}>
            Delivery details
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr,0.8fr]">

          {/* ── Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="checkout-fade space-y-4">

            {/* Personal info */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <TbUser size={15} className="text-emerald-600" />
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Personal</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.fullName?.message}>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                    autoComplete="name"
                    {...register("fullName", { required: "Full name is required" })}
                  />
                </Field>
                <Field label="Phone" error={errors.phone?.message}>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                    autoComplete="tel"
                    {...register("phone", { required: "Phone is required" })}
                  />
                </Field>
              </div>
            </div>

            {/* Address */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <TbMapPin size={15} className="text-emerald-600" />
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Delivery address</p>
              </div>

              <Field label="Address line 1" error={errors.addressLine1?.message}>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                  autoComplete="address-line1"
                  {...register("addressLine1", { required: "Address is required" })}
                />
              </Field>

              <Field label="Address line 2">
                <input
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                  autoComplete="address-line2"
                  {...register("addressLine2")}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="City" error={errors.city?.message}>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                    autoComplete="address-level2"
                    {...register("city", { required: "City is required" })}
                  />
                </Field>
                <Field label="State" error={errors.state?.message}>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                    autoComplete="address-level1"
                    {...register("state", { required: "State is required" })}
                  />
                </Field>
                <Field label="Postal code" error={errors.postalCode?.message}>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                    autoComplete="postal-code"
                    {...register("postalCode", { required: "Postal code is required" })}
                  />
                </Field>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 hover:gap-3 disabled:opacity-60"
            >
              {isSubmitting ? "Placing order..." : (<>Place COD order <TbArrowRight size={15} /></>)}
            </button>
          </form>

          {/* ── Order Summary ── */}
          <div className="checkout-fade space-y-4">

            {/* Items */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Order summary</p>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{item.title}</p>
                      <p className="text-xs text-slate-400">Qty {item.qty}</p>
                    </div>
                    <p className="font-semibold text-slate-800 flex-shrink-0">{formatINR(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <span className={`font-medium ${shippingFee === 0 ? "text-emerald-600" : "text-slate-800"}`}>
                  {shippingFee === 0 ? "Free" : formatINR(shippingFee)}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Coupon</span>
                  <span className="font-medium">− {formatINR(appliedCoupon.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-800">Total</span>
                <span className="text-lg font-bold text-slate-900">{formatINR(total)}</span>
              </div>
            </div>

            {/* COD notice */}
            <div className="flex gap-3 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
              <TbCoin size={17} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-6">
                Cash on delivery only. Please keep the exact amount ready at delivery time.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-slate-600 text-xs">{label}</span>
      {children}
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </label>
  );
}

export default CheckoutPage;