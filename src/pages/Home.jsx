import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/products/ProductCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TbArrowRight, TbLeaf, TbTruck, TbCoin } from "react-icons/tb";
import { PiPlantFill } from "react-icons/pi";
import { FaAppleAlt } from "react-icons/fa";
import { GiHerbsBundle } from "react-icons/gi";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    slug: "fruits",
    label: "Fruits",
    blurb: "Sweet seasonal picks and everyday staples.",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&h=400&fit=crop",
  },
  {
    slug: "vegetables",
    label: "Vegetables",
    blurb: "Kitchen-ready vegetables for daily meals.",
    image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&h=400&fit=crop",
  },
  {
    slug: "leafy",
    label: "Leafy Greens",
    blurb: "Fresh greens for soups, salads, and smoothies.",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=400&fit=crop",
  },
  {
    slug: "herbs",
    label: "Herbs",
    blurb: "Flavor boosters for finishing and garnish.",
    image: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=600&h=400&fit=crop",
  },
];

const stats = [
  { number: "500+", label: "Fresh Products" },
  { number: "100+", label: "Local Vendors"  },
  { number: "10k+", label: "Customers"      },
  { number: "COD",  label: "Only Payment"   },
];

export function Home() {
  const navigate = useNavigate();
  const { products, isLoading } = useProducts({ limit: 8 });
  const rootRef       = useRef(null);
  const categoriesRef = useRef(null);
  const productsRef   = useRef(null);
  const statsRef      = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero stagger
      gsap.fromTo(
        ".hero-fade",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.13, ease: "power3.out" }
      );

      // Stats
      gsap.fromTo(
        ".stat-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 88%", once: true },
        }
      );

      // Category cards
      gsap.fromTo(
        ".category-card",
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: categoriesRef.current, start: "top 82%", once: true },
        }
      );

      // Product cards
      gsap.fromTo(
        ".product-card-wrapper",
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out",
          scrollTrigger: { trigger: productsRef.current, start: "top 84%", once: true },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-clip bg-gradient-to-b from-emerald-50 via-white to-orange-50">

      {/* ── Hero ── */}
      <section
        className="relative w-screen overflow-hidden"
        style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=1080&fit=crop"
            alt="Fresh produce"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-emerald-950/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/50 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl space-y-6 text-white">
            <div className="hero-fade inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
              <TbLeaf size={13} />
              Fresh produce · COD only
            </div>

            <h1 className="hero-fade text-4xl font-bold leading-[1.1] md:text-6xl lg:text-7xl" style={{ letterSpacing: "-0.03em" }}>
              Nook and Native —
              <span className="block text-yellow-300">farm to doorstep.</span>
            </h1>

            <p className="hero-fade text-base text-white/80 md:text-lg">
              Fresh fruits &amp; vegetables, vendor marketplace, and COD checkout — all in one clean storefront.
            </p>

            <div className="hero-fade flex flex-wrap gap-3 pt-2">
              <Link
                to="/category/all"
                className="group flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-emerald-900 transition-all hover:bg-yellow-300 hover:gap-3"
              >
                Shop all produce <TbArrowRight size={16} />
              </Link>
              <Link
                to="/account"
                className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Login / Register
              </Link>
            </div>

            {/* Trust badges */}
            <div className="hero-fade flex flex-wrap gap-4 pt-4">
              {[
                { Icon: TbLeaf,  text: "Farm-sourced" },
                { Icon: TbTruck, text: "Daily delivery" },
                { Icon: TbCoin,  text: "COD accepted"  },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-white/70">
                  <Icon size={14} className="text-emerald-400" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full">
            <path
              fill="#f0fdf4"
              d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            />
          </svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section ref={statsRef} className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {stats.map(({ number, label }) => (
            <div
              key={label}
              className="stat-item rounded-2xl bg-white px-4 py-6 text-center shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md"
            >
              <p className="text-2xl font-bold text-emerald-700 md:text-3xl">{number}</p>
              <p className="mt-1 text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section ref={categoriesRef} className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Browse</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-800 md:text-4xl" style={{ letterSpacing: "-0.02em" }}>
            Shop by category
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="category-card group relative overflow-hidden rounded-2xl shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-900/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-bold">{cat.label}</h3>
                  <p className="mt-0.5 text-xs text-white/75">{cat.blurb}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-yellow-300 transition-all group-hover:gap-2.5">
                    Shop now <TbArrowRight size={13} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section
        ref={productsRef}
        className="relative w-screen bg-white py-12 md:py-16"
        style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      >
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Featured</p>
              <h2 className="mt-1 text-3xl font-bold text-slate-800 md:text-4xl" style={{ letterSpacing: "-0.02em" }}>
                Fresh picks
              </h2>
            </div>
            <Link
              to="/category/all"
              className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-all hover:gap-2.5 hover:text-emerald-800"
            >
              See all <TbArrowRight size={15} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-gray-100 p-4">
                  <div className="mb-3 h-44 rounded-xl bg-gray-200" />
                  <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <div key={product._id || product.id} className="product-card-wrapper">
                  <ProductCard product={product} onQuickView={() => navigate(`/product/${product.slug}`)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section
        className="relative w-screen bg-emerald-800 py-14 text-white"
        style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      >
        <div className="mx-auto max-w-xl px-5 text-center">
          <GiHerbsBundle size={32} className="mx-auto mb-4 text-emerald-400" />
          <h3 className="text-2xl font-bold md:text-3xl" style={{ letterSpacing: "-0.02em" }}>
            Stay fresh
          </h3>
          <p className="mt-2 text-sm text-emerald-200">
            New arrivals and seasonal specials, straight to your inbox.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-full bg-white/10 px-5 py-2.5 text-sm text-white placeholder:text-white/40 outline-none ring-1 ring-white/20 focus:ring-yellow-400 transition-all"
            />
            <button className="rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-emerald-900 transition-all hover:bg-yellow-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;