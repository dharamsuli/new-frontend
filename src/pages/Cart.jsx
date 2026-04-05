import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { formatINR } from "../utils/currency";
import { resolveProductImage } from "../lib/productImages";

const coupons = {
  NOOKNATIVE50: { code: "NOOKNATIVE50", minSubtotal: 60000, discount: 5000 },
  NOOKNATIVE120: { code: "NOOKNATIVE120", minSubtotal: 120000, discount: 12000 }
};

export function CartPage() {
  const { items, subtotal, removeItem, updateQty, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState(
    typeof window !== "undefined" ? localStorage.getItem("nook_native_coupon") || "" : ""
  );

  const shippingFee = subtotal >= 50000 ? 0 : 4000;
  const selectedCoupon = couponCode ? coupons[couponCode] : null;
  const appliedCoupon = useMemo(() => {
    if (!selectedCoupon || subtotal < selectedCoupon.minSubtotal) return null;
    return selectedCoupon;
  }, [selectedCoupon, subtotal]);
  const discount = appliedCoupon?.discount || 0;
  const total = Math.max(0, subtotal + shippingFee - discount);

  useEffect(() => {
    if (!couponCode || !selectedCoupon || subtotal >= selectedCoupon.minSubtotal) {
      return;
    }

    setCouponCode("");
    localStorage.removeItem("nook_native_coupon");
    toast.error(`${selectedCoupon.code} needs a cart subtotal of ${formatINR(selectedCoupon.minSubtotal)}`);
  }, [couponCode, selectedCoupon, subtotal]);

  if (!items.length) {
    return (
      <div className="rounded-[28px] bg-white p-10 text-center shadow-lg shadow-emerald-100">
        <p className="text-lg font-semibold text-slate-900">Your basket is empty.</p>
        <Link to="/category/all" className="mt-4 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr,0.8fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-slate-900">Your cart</h1>
          <button type="button" onClick={clearCart} className="text-sm font-semibold text-rose-600">
            Clear cart
          </button>
        </div>

        {items.map((item) => (
          <div key={`${item.id}-${item.selectedVariantId || "default"}`} className="flex gap-4 rounded-[28px] bg-white p-5 shadow-lg shadow-emerald-100">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,_#ecfdf5,_#fff7ed)]">
              <img src={resolveProductImage(item.image || item.images?.[0]?.url)} alt={item.title} className="h-full w-full object-cover" />
            </div>

            <div className="flex flex-1 flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                  <p className="text-sm text-slate-500">{formatINR(item.price)} each</p>
                </div>
                <button type="button" onClick={() => removeItem(item.id, item.selectedVariantId || null)} className="text-sm text-rose-600">
                  Remove
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
                  <button type="button" onClick={() => updateQty(item.id, item.qty - 1, item.selectedVariantId || null)} className="px-4 py-2">
                    -
                  </button>
                  <span className="px-4 text-sm font-semibold">{item.qty}</span>
                  <button type="button" onClick={() => updateQty(item.id, item.qty + 1, item.selectedVariantId || null)} className="px-4 py-2">
                    +
                  </button>
                </div>
                <p className="text-lg font-semibold text-slate-900">{formatINR(item.price * item.qty)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-5 rounded-[32px] bg-white p-6 shadow-lg shadow-emerald-100">
        <h2 className="text-xl font-semibold text-slate-900">Summary</h2>

        <div className="rounded-[24px] bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Coupons</p>
          <div className="mt-3 flex gap-2">
            <input value={couponInput} onChange={(event) => setCouponInput(event.target.value)} className="input" placeholder="NOOKNATIVE50" />
            <button
              type="button"
              onClick={() => {
                const code = couponInput.trim().toUpperCase();
                const coupon = coupons[code];

                if (!coupon) {
                  toast.error("Invalid coupon code");
                  return;
                }

                if (subtotal < coupon.minSubtotal) {
                  toast.error(`Add ${formatINR(coupon.minSubtotal - subtotal)} more to use ${code}`);
                  return;
                }

                setCouponCode(code);
                localStorage.setItem("nook_native_coupon", code);
                toast.success(`${code} applied`);
              }}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Apply
            </button>
          </div>
          <p className="mt-3 text-sm text-slate-500">NOOKNATIVE50: Rs.50 off above Rs.600</p>
          <p className="text-sm text-slate-500">NOOKNATIVE120: Rs.120 off above Rs.1200</p>
          {appliedCoupon ? (
            <p className="mt-2 text-sm font-medium text-emerald-700">
              {appliedCoupon.code} is active for this cart.
            </p>
          ) : null}
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? "Free" : formatINR(shippingFee)}</span></div>
          <div className="flex justify-between text-emerald-700"><span>Discount</span><span>- {formatINR(discount)}</span></div>
          <div className="flex justify-between border-t border-slate-100 pt-3 text-lg font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!user) {
              toast.error("Please log in first");
              navigate("/account");
              return;
            }
            if (user.role !== "customer") {
              toast.error("Only customer accounts can place COD orders");
              return;
            }
            navigate("/checkout");
          }}
          className="w-full rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
        >
          Continue to checkout
        </button>

        <p className="text-sm text-slate-500">Only cash on delivery is available on Nook and Native.</p>
      </div>
    </div>
  );
}

export default CartPage;
