import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { formatINR } from "../../utils/currency";
import { resolveProductImage } from "../../lib/productImages";

export function ProductCard({ product, onQuickView }) {
  const soldOut = (product.stock ?? 0) <= 0;
  const imageSrc = resolveProductImage(product.image);

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      className="overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-lg shadow-emerald-100"
    >
      <Link to={`/product/${product.slug}`} className="block bg-[linear-gradient(135deg,_#ecfdf5,_#fff7ed)] p-6">
        <img src={imageSrc} alt={product.title} className="mx-auto h-40 w-full object-contain" />
      </Link>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {product.category}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{product.title}</h3>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            {product.unit}
          </span>
        </div>

        <p className="text-sm text-slate-600">{product.shortDescription}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-900">{formatINR(product.price)}</span>
            {product.compareAtPrice ? (
              <span className="text-sm text-slate-400 line-through">{formatINR(product.compareAtPrice)}</span>
            ) : null}
          </div>
          <span className={`text-xs font-semibold ${soldOut ? "text-rose-600" : "text-emerald-700"}`}>
            {soldOut ? "Out of stock" : `${product.stock} left`}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onQuickView?.(product)}
          className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          View details
        </button>
      </div>
    </motion.article>
  );
}

export default ProductCard;
