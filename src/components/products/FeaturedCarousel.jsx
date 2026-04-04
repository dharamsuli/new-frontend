// src/components/products/FeaturedCarousel.jsx
import React, { useRef } from "react";
import ProductCard from "./ProductCard";

export function FeaturedCarousel({ products, onAddToCart, onQuickView }) {
  const scrollRef = useRef(null);

  const scrollBy = (direction) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const amount = container.clientWidth * 0.8; // 80% of visible width

    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  if (!products?.length) return null;

  return (
    <div className="relative">
      {/* Desktop arrows */}
      <button
        type="button"
        onClick={() => scrollBy("prev")}
        className="pointer-events-auto absolute left-0 top-1/2 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white px-2 py-1 text-lg shadow-sm hover:border-indigo-500 hover:text-indigo-600 md:inline-flex"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollBy("next")}
        className="pointer-events-auto absolute right-0 top-1/2 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white px-2 py-1 text-lg shadow-sm hover:border-indigo-500 hover:text-indigo-600 md:inline-flex"
      >
        ›
      </button>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-4 overflow-x-auto pb-2 md:px-6"
      >
        {products.map((p) => (
          <div key={p.id} className="w-64 flex-shrink-0">
            <ProductCard
              product={p}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedCarousel;
