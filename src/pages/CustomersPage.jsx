import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TbShoppingBag, TbLayoutDashboard, TbTag, TbArrowRight } from "react-icons/tb";
import { GiShop } from "react-icons/gi";

gsap.registerPlugin(ScrollTrigger);

const points = [
  {
    Icon: TbShoppingBag,
    title: "For Customers",
    desc: "Browse the full produce catalog, add to cart, and place COD orders — no payment gateway needed.",
  },
  {
    Icon: TbLayoutDashboard,
    title: "For Vendors",
    desc: "Register separately, manage your own product listings, and update order statuses from your dashboard.",
  },
  {
    Icon: TbTag,
    title: "Store Coupons",
    desc: "Site-wide coupons use your own branding — NOOKNATIVE50 and NOOKNATIVE120 are ready to use.",
  },
];

export default function CustomersPage() {
  const rootRef   = useRef(null);
  const cardsRef  = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cust-hero-fade",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" }
      );
      gsap.fromTo(
        ".point-card",
        { opacity: 0, y: 22 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 85%", once: true },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-orange-50">

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden rounded-3xl mx-4 mt-6 md:mx-8 md:mt-8 shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1400&h=450&fit=crop"
          alt="Fresh market vendors"
          className="h-60 w-full object-cover object-center md:h-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14">
          <div className="cust-hero-fade flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-300 mb-3">
            <GiShop size={14} /> Nook and Native
          </div>
          <h1 className="cust-hero-fade text-3xl md:text-5xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
            Built for customers<br />and vendors.
          </h1>
          <p className="cust-hero-fade mt-3 max-w-md text-sm text-white/70 md:text-base">
            A clean storefront with separate roles, COD checkout, and your own coupons.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-14 space-y-12">

        {/* ── Point cards ── */}
        <section ref={cardsRef}>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-2">Why Nook and Native</p>
          <h2 className="text-2xl font-bold text-slate-800 mb-8" style={{ letterSpacing: "-0.02em" }}>
            Everything in one place
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {points.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="point-card rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md hover:-translate-y-0.5 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Icon size={19} className="text-emerald-600" />
                </div>
                <p className="font-semibold text-slate-800 text-sm">{title}</p>
                <p className="text-xs leading-6 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA strip ── */}
        <section className="cust-hero-fade rounded-2xl bg-emerald-600 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
          <div>
            <p className="font-bold text-white text-sm">Ready to get started?</p>
            <p className="text-xs text-emerald-100 mt-0.5">Create an account or browse the catalog.</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/account"
              className="flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-50 hover:gap-2.5"
            >
              Login / Register <TbArrowRight size={13} />
            </Link>
            <Link
              to="/category/all"
              className="flex items-center gap-1.5 rounded-full border border-white/30 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10"
            >
              Browse produce
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}