import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { formatINR } from "../utils/currency";
import { resolveProductImage } from "../lib/productImages";
import gsap from "gsap";
import { TbTrash, TbTag, TbShoppingBag, TbArrowRight, TbTruck } from "react-icons/tb";

const coupons = {
  NOOKNATIVE50:  { code: "NOOKNATIVE50",  minSubtotal: 60000,  discount: 5000  },
  NOOKNATIVE120: { code: "NOOKNATIVE120", minSubtotal: 120000, discount: 12000 },
};

export function CartPage() {
  const { items, subtotal, removeItem, updateQty, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const rootRef = useRef(null);

  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState(
    typeof window !== "undefined" ? localStorage.getItem("nook_native_coupon") || "" : ""
  );

  const shippingFee    = subtotal >= 50000 ? 0 : 4000;
  const selectedCoupon = couponCode ? coupons[couponCode] : null;
  const appliedCoupon  = useMemo(() => {
    if (!selectedCoupon || subtotal < selectedCoupon.minSubtotal) return null;
    return selectedCoupon;
  }, [selectedCoupon, subtotal]);
  const discount = appliedCoupon?.discount || 0;
  const total    = Math.max(0, subtotal + shippingFee - discount);

  useEffect(() => {
    if (!couponCode || !selectedCoupon || subtotal >= selectedCoupon.minSubtotal) return;
    setCouponCode("");
    localStorage.removeItem("nook_native_coupon");
    toast.error(`${selectedCoupon.code} needs a cart subtotal of ${formatINR(selectedCoupon.minSubtotal)}`);
  }, [couponCode, selectedCoupon, subtotal]);

  useEffect(() => {
    if (!items.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cart-item",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power3.out" }
      );
      gsap.fromTo(
        ".cart-summary",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.55, ease: "power3.out", delay: 0.15 }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleRemove = (id, variantId) => {
    const el = document.getElementById(`cart-item-${id}-${variantId || "default"}`);
    if (el) {
      gsap.to(el, {
        opacity: 0, x: -20, height: 0, marginBottom: 0, padding: 0,
        duration: 0.3, ease: "power2.in",
        onComplete: () => removeItem(id, variantId || null),
      });
    } else {
      removeItem(id, variantId || null);
    }
  };

  // ── Empty state ──
  if (!items.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-orange-50 flex items-center justify-center px-5">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
            <TbShoppingBag size={28} className="text-emerald-600" />
          </div>
          <p className="text-lg font-bold text-slate-800" style={{ letterSpacing: "-0.01em" }}>
            Your basket is empty
          </p>
          <p className="text-sm text-slate-400">Add some fresh produce to get started.</p>
          <Link
            to="/category/all"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 hover:gap-3"
          >
            Shop produce <TbArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-orange-50">
      <div className="mx-auto max-w-6xl px-5 py-10">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-800" style={{ letterSpacing: "-0.02em" }}>
              Your cart
            </h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-500 transition-all hover:bg-rose-50"
          >
            <TbTrash size={13} /> Clear all
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr,0.8fr]">

          {/* ── Cart Items ── */}
          <div className="space-y-3">
            {items.map((item) => {
              const key = `${item.id}-${item.selectedVariantId || "default"}`;
              return (
                <div
                  id={`cart-item-${key}`}
                  key={key}
                  className="cart-item flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md"
                >
                  {/* Image */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-emerald-50">
                    <img
                      src={resolveProductImage(item.image || item.images?.[0]?.url)}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-semibold text-slate-800 leading-snug">{item.title}</h2>
                        <p className="mt-0.5 text-xs text-slate-400">{formatINR(item.price)} each</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id, item.selectedVariantId)}
                        className="flex-shrink-0 rounded-full p-1.5 text-slate-300 transition-all hover:bg-rose-50 hover:text-rose-500"
                      >
                        <TbTrash size={15} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Qty stepper */}
                      <div className="inline-flex items-center rounded-full border border-slate-200 bg-white text-sm">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty - 1, item.selectedVariantId || null)}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-emerald-700 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm font-semibold text-slate-800">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty + 1, item.selectedVariantId || null)}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-emerald-700 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-bold text-slate-800">{formatINR(item.price * item.qty)}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Free shipping nudge */}
            {shippingFee > 0 && (
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200">
                <TbTruck size={17} className="text-emerald-600 flex-shrink-0" />
                <p className="text-xs text-emerald-700 font-medium">
                  Add {formatINR(50000 - subtotal)} more for free shipping
                </p>
              </div>
            )}
          </div>

          {/* ── Summary Panel ── */}
          <div className="cart-summary space-y-4">

            {/* Coupon box */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100">
              <div className="flex items-center gap-2 mb-3">
                <TbTag size={15} className="text-emerald-600" />
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Coupon</p>
              </div>
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="NOOKNATIVE50"
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    const code = couponInput.trim().toUpperCase();
                    const coupon = coupons[code];
                    if (!coupon) { toast.error("Invalid coupon code"); return; }
                    if (subtotal < coupon.minSubtotal) {
                      toast.error(`Add ${formatINR(coupon.minSubtotal - subtotal)} more to use ${code}`);
                      return;
                    }
                    setCouponCode(code);
                    localStorage.setItem("nook_native_coupon", code);
                    toast.success(`${code} applied`);
                  }}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-emerald-700"
                >
                  Apply
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-xs text-slate-400">NOOKNATIVE50 — ₹50 off above ₹600</p>
                <p className="text-xs text-slate-400">NOOKNATIVE120 — ₹120 off above ₹1200</p>
              </div>
              {appliedCoupon && (
                <p className="mt-2.5 text-xs font-semibold text-emerald-600">
                  ✓ {appliedCoupon.code} applied
                </p>
              )}
            </div>

            {/* Price breakdown */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Summary</p>

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
              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Discount</span>
                  <span className="font-medium">− {formatINR(discount)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-800">Total</span>
                <span className="text-lg font-bold text-slate-900">{formatINR(total)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              type="button"
              onClick={() => {
                if (!user) { toast.error("Please log in first"); navigate("/account"); return; }
                if (user.role !== "customer") { toast.error("Only customer accounts can place COD orders"); return; }
                navigate("/checkout");
              }}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 hover:gap-3"
            >
              Continue to checkout <TbArrowRight size={15} />
            </button>

            <p className="text-center text-xs text-slate-400">
              Cash on delivery only · No online payment
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CartPage;