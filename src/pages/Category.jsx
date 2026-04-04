import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid } from "../components/products/ProductGrid";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const filters = [
  { slug: "all", label: "All", icon: "🌾", color: "from-gray-500 to-gray-600" },
  { slug: "fruits", label: "Fruits", icon: "🍎", color: "from-red-500 to-orange-500" },
  { slug: "vegetables", label: "Vegetables", icon: "🥕", color: "from-green-600 to-emerald-500" },
  { slug: "leafy", label: "Leafy Greens", icon: "🥬", color: "from-lime-500 to-green-600" },
  { slug: "herbs", label: "Herbs", icon: "🌿", color: "from-emerald-500 to-teal-500" }
];

export function Category() {
  const { categorySlug = "all" } = useParams();
  const navigate = useNavigate();
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const { products, isLoading } = useProducts({
    category: categorySlug,
    sort: sort === "featured" ? undefined : sort
  });
  
  const headerRef = useRef(null);
  const filtersRef = useRef(null);
  const productsRef = useRef(null);
  
  const title = useMemo(() => {
    const current = filters.find((item) => item.slug === categorySlug);
    return current ? current.label : "All";
  }, [categorySlug]);
  
  const currentCategory = useMemo(() => {
    return filters.find((item) => item.slug === categorySlug) || filters[0];
  }, [categorySlug]);
  
  useEffect(() => {
    // Kill existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Header animation
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
    
    // Filters animation
    gsap.fromTo(".filter-button",
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: "back.out(0.5)",
        scrollTrigger: {
          trigger: filtersRef.current,
          start: "top 90%",
          toggleActions: "play none none reset"
        }
      }
    );
    
    // Products animation
    gsap.fromTo(".product-item",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: productsRef.current,
          start: "top 85%",
          toggleActions: "play none none reset"
        }
      }
    );
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [categorySlug]); // Re-run when category changes
  
  // Refresh when products load
  useEffect(() => {
    if (!isLoading && products.length > 0) {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [isLoading, products]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div ref={headerRef} className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl shadow-emerald-100 p-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
                Browse fresh produce
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-4xl">{currentCategory.icon}</span>
                <h2 className="text-3xl font-semibold text-slate-800">
                  {title}
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {products.length} {products.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-all"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  gsap.fromTo(".product-item",
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 }
                  );
                }}
                className="rounded-full border-2 border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all cursor-pointer hover:border-emerald-300"
              >
                <option value="featured">⭐ Featured</option>
                <option value="priceLow">💰 Price low to high</option>
                <option value="priceHigh">💎 Price high to low</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Filters Section */}
        <div ref={filtersRef} className={`${showFilters ? 'block' : 'hidden lg:block'} transition-all duration-300`}>
          <div className="rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg shadow-emerald-100 p-6">
            <h3 className="text-sm font-semibold text-slate-600 mb-4 flex items-center gap-2">
              <span>🔍</span> Filter by category
            </h3>
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter.slug}
                  type="button"
                  onClick={() => {
                    navigate(`/category/${filter.slug}`);
                    gsap.fromTo(".product-item",
                      { opacity: 0, y: 20 },
                      { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 }
                    );
                  }}
                  className="filter-button group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105"
                >
                  <span className={`relative z-10 flex items-center gap-2 ${
                    filter.slug === categorySlug ? 'text-white' : 'text-slate-700'
                  }`}>
                    <span className="text-lg">{filter.icon}</span>
                    {filter.label}
                  </span>
                  <div className={`absolute inset-0 transition-transform duration-300 ${
                    filter.slug === categorySlug 
                      ? `bg-gradient-to-r ${filter.color} scale-100` 
                      : 'bg-slate-100 scale-0 group-hover:scale-100'
                  }`}></div>
                  {filter.slug === categorySlug && (
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div ref={productsRef}>
          {isLoading ? (
            <div className="rounded-3xl bg-white/80 backdrop-blur-sm p-12 text-center shadow-xl">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
              </div>
              <p className="mt-4 text-slate-600 font-medium">Loading fresh products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl bg-white/80 backdrop-blur-sm p-12 text-center shadow-xl">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No products found</h3>
              <p className="text-slate-600 mb-4">
                We couldn't find any {title.toLowerCase()} in our collection right now.
              </p>
              <button
                onClick={() => navigate('/category/all')}
                className="rounded-full bg-emerald-600 px-6 py-2 text-white font-semibold hover:bg-emerald-700 transition-all"
              >
                Browse all products
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-semibold text-emerald-600">{products.length}</span> fresh items
                </p>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-300"></div>
                  ))}
                </div>
              </div>
              <ProductGrid 
                products={products} 
                onQuickView={(product) => {
                  gsap.to(".product-item", {
                    opacity: 0,
                    duration: 0.2,
                    onComplete: () => {
                      navigate(`/product/${product.slug}`);
                    }
                  });
                }} 
              />
            </>
          )}
        </div>
        
        {/* Seasonal Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-green-600 p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎯</div>
              <div>
                <h3 className="text-xl font-bold">Seasonal Specials</h3>
                <p className="text-emerald-100">Get the best deals on fresh seasonal produce</p>
              </div>
            </div>
            <button className="rounded-full bg-white px-6 py-2.5 font-semibold text-emerald-700 transition-all hover:bg-emerald-50 hover:scale-105">
              View Offers →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;