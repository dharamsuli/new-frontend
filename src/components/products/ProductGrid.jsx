import React from "react";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, onQuickView }) {
  if (!products?.length) {
    return (
      <div className="rounded-[28px] bg-white p-8 text-center text-sm text-slate-500 shadow-lg shadow-emerald-100">
        No products found in this section yet.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id || product.id} product={product} onQuickView={onQuickView} />
      ))}
    </div>
  );
}

export default ProductGrid;
