import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/products/ProductCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    slug: "fruits",
    label: "Fruits",
    blurb: "Sweet seasonal picks and everyday staples.",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&h=400&fit=crop",
    color: "from-orange-500 to-red-500"
  },
  {
    slug: "vegetables",
    label: "Vegetables",
    blurb: "Kitchen-ready vegetables for daily meals.",
    image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&h=400&fit=crop",
    color: "from-green-600 to-emerald-500"
  },
  {
    slug: "leafy",
    label: "Leafy Greens",
    blurb: "Fresh greens for soups, salads, and smoothies.",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=400&fit=crop",
    color: "from-lime-500 to-green-600"
  },
  {
    slug: "herbs",
    label: "Herbs",
    blurb: "Flavor boosters for finishing and garnish.",
    image: "https://images.unsplash.com/photo-1594515973685-2ed3257ec4ac?w=600&h=400&fit=crop",
    color: "from-amber-600 to-yellow-500"
  }
];

export function Home() {
  const navigate = useNavigate();
  const { products, isLoading } = useProducts({ limit: 8 });

  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const categoriesRef = useRef(null);
  const productsRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-fade",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out"
        }
      );

      gsap.fromTo(
        ".category-card",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: "top 82%",
            once: true
          }
        }
      );

      gsap.fromTo(
        ".product-card-wrapper",
        { opacity: 0, y: 24, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: productsRef.current,
            start: "top 84%",
            once: true
          }
        }
      );

      gsap.fromTo(
        ".stat-item",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 88%",
            once: true
          }
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen overflow-x-clip bg-gradient-to-b from-emerald-50 via-white to-orange-50">
      <section
        ref={heroRef}
        className="relative min-h-screen w-screen overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-900 text-white"
        style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=1080&fit=crop"
            alt="Fresh produce background"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-emerald-950/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/75 via-emerald-900/45 to-transparent" />
        </div>

        <div className="relative z-10 w-full px-5 py-16 md:px-8 md:py-20 lg:px-12 lg:py-24">
          <div className="grid min-h-screen items-center gap-12 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-8">
              <div className="hero-fade inline-flex rounded-full bg-white/20 px-6 py-2 text-sm font-semibold uppercase tracking-[0.25em] backdrop-blur-sm">
                Fresh produce. COD only.
              </div>

              <div className="space-y-6">
                <h1 className="hero-fade max-w-4xl text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
                  Nook and Native brings
                  <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    fruits & vegetables
                  </span>
                  to your doorstep.
                </h1>

                <p className="hero-fade max-w-2xl text-lg text-white/90 md:text-xl">
                  Fresh produce, vendor registration, and a proper Node + Mongo backend in one clean storefront.
                </p>
              </div>

              <div className="hero-fade flex flex-wrap gap-4">
                <Link
                  to="/category/all"
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 text-base font-semibold text-emerald-900 transition-all hover:scale-105 hover:shadow-xl"
                >
                  <span className="relative z-10">Shop all produce</span>
                  <div className="absolute inset-0 translate-y-full bg-gradient-to-r from-yellow-500 to-orange-600 transition-transform duration-300 group-hover:translate-y-0" />
                </Link>

                <Link
                  to="/account"
                  className="rounded-full border-2 border-white/30 px-8 py-4 text-base font-semibold backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/10"
                >
                  Customer or vendor login
                </Link>
              </div>
            </div>

            <div className="hero-fade grid gap-4 rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              {[
                { icon: "Apples", text: "Fresh fruits from reliable farm sources" },
                { icon: "Secure", text: "Vendor registration with hashed credentials" },
                { icon: "COD", text: "COD-only checkout and lean order storage" },
                { icon: "Static", text: "Static catalog imagery for fast loading" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group flex items-center gap-4 rounded-2xl bg-white/10 p-4 transition-all hover:scale-[1.02] hover:bg-white/20"
                >
                  <span className="min-w-14 rounded-full bg-white/15 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em]">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path
              fill="#fefce8"
              fillOpacity="1"
              d="M0,256L48,240C96,224,192,192,288,192C384,192,480,224,576,234.7C672,245,768,235,864,208C960,181,1056,139,1152,128C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </section>

      <section ref={statsRef} className="relative z-10 -mt-16 mb-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { number: "500+", label: "Fresh Products", icon: "Produce" },
              { number: "100+", label: "Local Vendors", icon: "Vendors" },
              { number: "10k+", label: "Happy Customers", icon: "Customers" },
              { number: "100%", label: "COD Service", icon: "COD" }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="stat-item rounded-2xl bg-white p-6 text-center shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-emerald-700">{stat.number}</div>
                <div className="mt-2 text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={categoriesRef} className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Shop by Category</p>
          <h2 className="mt-3 text-4xl font-bold text-slate-800 md:text-5xl">Explore Our Fresh Collection</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Discover nature&apos;s finest produce, carefully selected for your daily needs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="category-card group relative overflow-hidden rounded-3xl shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70`} />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-90">{category.slug}</p>
                  <h3 className="mt-2 text-2xl font-bold">{category.label}</h3>
                  <p className="mt-1 text-sm opacity-90">{category.blurb}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3">
                    Shop Now <span>{"->"}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        ref={productsRef}
        className="relative w-screen bg-gradient-to-b from-white to-emerald-50 py-16"
        style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Featured Produce</p>
              <h2 className="mt-2 text-4xl font-bold text-slate-800 md:text-5xl">Fresh picks from the catalog</h2>
              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Hand-picked selection of the freshest fruits and vegetables available.
              </p>
            </div>
            <Link
              to="/category/all"
              className="group inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:gap-3 hover:bg-emerald-700"
            >
              See all products
              <span className="text-lg">{"->"}</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-3xl bg-white p-6 shadow-xl">
                  <div className="mb-4 h-48 rounded-2xl bg-gray-200" />
                  <div className="mb-3 h-6 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <div key={product._id || product.id} className="product-card-wrapper">
                  <ProductCard product={product} onQuickView={() => navigate(`/product/${product.slug}`)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        className="relative w-screen bg-gradient-to-r from-emerald-800 to-green-800 py-20 text-white"
        style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      >
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <h3 className="mb-4 text-3xl font-bold md:text-4xl">Get Fresh Updates</h3>
            <p className="mb-8 text-emerald-100">
              Subscribe to get notified about new arrivals, seasonal specials, and exclusive offers.
            </p>
            <form className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full px-6 py-3 text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button className="rounded-full bg-yellow-400 px-8 py-3 font-semibold text-emerald-900 transition-all hover:scale-105 hover:bg-yellow-300">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
