import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { formatINR } from "../utils/currency";
import { createRazorpayOrder, placeOrder, verifyRazorpayPayment } from "../utils/orders";
import gsap from "gsap";
import { TbUser, TbPhone, TbMapPin, TbArrowRight, TbCoin, TbBolt } from "react-icons/tb";

const coupons = {
  NOOKNATIVE50:  { code: "NOOKNATIVE50",  minSubtotal: 60000,  discount: 5000  },
  NOOKNATIVE120: { code: "NOOKNATIVE120", minSubtotal: 120000, discount: 12000 },
};

let razorpayScriptPromise;

function loadRazorpayCheckout() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const rootRef = useRef(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "";
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

  const buildOrderPayload = (values) => ({
    items: items.map((item) => ({ productId: item.id, qty: item.qty })),
    couponCode: appliedCoupon?.code || "",
    shippingAddress: values,
  });

  const finalizeSuccess = (order, message) => {
    localStorage.removeItem("nook_native_coupon");
    clearCart();
    toast.success(message || `Order ${order.orderNumber} placed successfully`);
    navigate("/orders");
  };

  const onSubmitCod = async (values) => {
    try {
      const order = await placeOrder(buildOrderPayload(values));
      finalizeSuccess(order, `Order ${order.orderNumber} placed with cash on delivery`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitRazorpay = async (values) => {
    if (!razorpayKeyId) {
      toast.error("Add VITE_RAZORPAY_KEY_ID in client/.env to enable online payments.");
      return;
    }

    setProcessingPayment(true);

    try {
      const scriptLoaded = await loadRazorpayCheckout();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Unable to load Razorpay checkout right now.");
      }

      const payload = buildOrderPayload(values);
      const { razorpayOrder, amount, currency } = await createRazorpayOrder(payload);

      const razorpay = new window.Razorpay({
        key: razorpayKeyId,
        amount,
        currency,
        name: "Nook and Native",
        description: "Fresh produce order",
        image: "/favicon.png",
        order_id: razorpayOrder.id,
        prefill: {
          name: values.fullName,
          email: user?.email || "",
          contact: values.phone
        },
        notes: {
          address: [values.addressLine1, values.addressLine2, values.city, values.state, values.postalCode].filter(Boolean).join(", ")
        },
        theme: {
          color: "#059669"
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
            toast("Razorpay payment window closed.");
          }
        },
        handler: async (response) => {
          try {
            const order = await verifyRazorpayPayment({
              ...payload,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            finalizeSuccess(order, `Order ${order.orderNumber} placed with Razorpay`);
          } catch (error) {
            toast.error(error.message);
          } finally {
            setProcessingPayment(false);
          }
        }
      });

      razorpay.open();
    } catch (error) {
      setProcessingPayment(false);
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

        <div className="checkout-fade mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Checkout</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-800" style={{ letterSpacing: "-0.02em" }}>
            Delivery details
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr,0.8fr]">
          <form className="checkout-fade space-y-4">
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

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleSubmit(onSubmitCod)}
                disabled={isSubmitting || processingPayment}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 hover:gap-3 disabled:opacity-60"
              >
                {isSubmitting ? "Placing COD order..." : (<>Place COD order <TbArrowRight size={15} /></>)}
              </button>

              <button
                type="button"
                onClick={handleSubmit(onSubmitRazorpay)}
                disabled={isSubmitting || processingPayment}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-slate-900 py-3 text-sm font-semibold text-white shadow-md shadow-slate-200 transition-all hover:bg-slate-800 disabled:opacity-60"
              >
                {processingPayment ? "Opening Razorpay..." : (<>Pay with Razorpay <TbBolt size={15} /></>)}
              </button>
            </div>
          </form>

          <div className="checkout-fade space-y-4">
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
                  <span className="font-medium">- {formatINR(appliedCoupon.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-800">Total</span>
                <span className="text-lg font-bold text-slate-900">{formatINR(total)}</span>
              </div>
            </div>

            <div className="flex gap-3 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
              <TbCoin size={17} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-6">
                Choose cash on delivery or pay online with Razorpay. Add your Razorpay keys in the env files to enable the online button.
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
