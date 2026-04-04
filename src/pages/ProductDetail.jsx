import React, { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../hooks/useCart";
import { formatINR } from "../utils/currency";
import { resolveProductImage } from "../lib/productImages";

export function ProductDetail() {
  const { slug } = useParams();
  const { product, isLoading } = useProduct(slug);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-sm text-rose-600">This product is not available right now.</p>;
  }

  const maxQty = Math.max(1, Number(product.stock || 0));
  const soldOut = Number(product.stock || 0) <= 0;
  const imageSrc = resolveProductImage(product.image);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,0.9fr]">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,_#ecfdf5,_#fff7ed)] p-8 shadow-xl shadow-emerald-100">
        <img src={imageSrc} alt={product.title} className="mx-auto h-[360px] w-full object-contain" />
      </div>

      <div className="space-y-6 rounded-[32px] bg-white/90 p-8 shadow-xl shadow-emerald-100">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {product.category}
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {product.unit}
            </span>
          </div>
          <h1 className="text-4xl font-semibold text-slate-900">{product.title}</h1>
          <p className="text-base text-slate-600">{product.description}</p>
        </div>

        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold text-slate-900">{formatINR(product.price)}</span>
          {product.compareAtPrice ? (
            <span className="text-lg text-slate-400 line-through">{formatINR(product.compareAtPrice)}</span>
          ) : null}
        </div>

        <div className="grid gap-3 rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
          <p>{product.shortDescription}</p>
          <p>Vendor: {product.vendorName || "Nook and Native"}</p>
          <p>{soldOut ? "Currently out of stock." : `${product.stock} packs ready for dispatch.`}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
            <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} className="px-4 py-3">
              -
            </button>
            <span className="px-4 text-sm font-semibold">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((value) => Math.min(maxQty, value + 1))}
              className="px-4 py-3"
              disabled={soldOut}
            >
              +
            </button>
          </div>

          <button
            type="button"
            disabled={soldOut}
            onClick={() => {
              addItem(product, qty);
              toast.success("Added to cart");
            }}
            className="flex-1 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {soldOut ? "Out of stock" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
