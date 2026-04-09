import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid } from "../components/products/ProductGrid";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PiPlantFill,PiAppleLogo,  PiLeafFill } from "react-icons/pi";
import { TbCarrot } from "react-icons/tb";
import { GiHerbsBundle } from "react-icons/gi";
import { LuSprout } from "react-icons/lu";

gsap.registerPlugin(ScrollTrigger);

const filters = [
  { slug: "all",        label: "All",          Icon: PiPlantFill   },
  { slug: "fruits",     label: "Fruits",       Icon: PiAppleLogo     },
  { slug: "vegetables", label: "Vegetables",   Icon: TbCarrot      },
  { slug: "leafy",      label: "Leafy Greens", Icon: PiLeafFill    },
  { slug: "herbs",      label: "Herbs",        Icon: GiHerbsBundle },
];

export function Category() {
  const { categorySlug = "all" } = useParams();
  const navigate = useNavigate();
  const [sort, setSort] = useState("featured");
  const { products, isLoading } = useProducts({
    category: categorySlug,
    sort: sort === "featured" ? undefined : sort,
  });

  const filtersRef  = useRef(null);
  const productsRef = useRef(null);

  const currentFilter = useMemo(
    () => filters.find((f) => f.slug === categorySlug) || filters[0],
    [categorySlug]
  );

  // Pills entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cat-pill",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: "power3.out", delay: 0.1 }
      );
    }, filtersRef);
    return () => ctx.revert();
  }, []);

  // Products reveal
  useEffect(() => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".product-item",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: {
            trigger: productsRef.current,
            start: "top 88%",
            toggleActions: "play none none reset",
          },
        }
      );
    }, productsRef);
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [categorySlug, isLoading]);

  const handleFilterClick = (slug) => {
    if (slug === categorySlug) return;
    gsap.to(".product-item", {
      opacity: 0,
      y: -8,
      duration: 0.18,
      stagger: 0.03,
      onComplete: () => navigate(`/category/${slug}`),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto px-5 py-10 space-y-8">

        {/* Filter Pills */}
        <nav ref={filtersRef} className="flex flex-wrap gap-2">
          {filters.map(({ slug, label, Icon }) => {
            const active = slug === categorySlug;
            return (
              <button
                key={slug}
                type="button"
                onClick={() => handleFilterClick(slug)}
                className={`cat-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200
                  ${active
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "bg-white border-gray-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600"
                  }`}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Heading */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-500 mb-1 font-semibold">
              Browse
            </p>
            <h1 className="text-3xl font-bold text-slate-800" style={{ letterSpacing: "-0.02em" }}>
              {currentFilter.label}
            </h1>
          </div>
          {!isLoading && products.length > 0 && (
            <p className="text-sm text-slate-400">{products.length} items</p>
          )}
        </div>

        <div className="h-px bg-emerald-100 w-full" />

        {/* Products */}
        <div ref={productsRef}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
              <p className="text-sm text-slate-400">Loading fresh products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
              <LuSprout size={40} className="text-emerald-300" />
              <p className="text-slate-500 text-sm">
                No {currentFilter.label.toLowerCase()} available right now.
              </p>
              <button
                onClick={() => navigate("/category/all")}
                className="mt-2 text-sm text-emerald-600 underline underline-offset-2 hover:text-emerald-800 transition-colors"
              >
                Browse everything
              </button>
            </div>
          ) : (
            <ProductGrid
              products={products}
              onQuickView={(product) => {
                gsap.to(".product-item", {
                  opacity: 0,
                  duration: 0.18,
                  stagger: 0.03,
                  onComplete: () => navigate(`/product/${product.slug}`),
                });
              }}
            />
          )}
        </div>

      </div>
    </div>
  );
}

export default Category;