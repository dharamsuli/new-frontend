import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TbLeaf, TbTruck, TbLock, TbCoin } from "react-icons/tb";
import { GiShop } from "react-icons/gi";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    Icon: TbLeaf,
    title: "Fresh Produce",
    desc: "Fruits and vegetables sourced from reliable farms, listed by verified vendors.",
  },
  {
    Icon: TbTruck,
    title: "Simple Delivery",
    desc: "We only store what's needed — contact, address, product snapshot, and order status.",
  },
  {
    Icon: TbLock,
    title: "Secure Accounts",
    desc: "Customer and vendor passwords are hashed. No plain-text credentials, ever.",
  },
  {
    Icon: TbCoin,
    title: "COD Only",
    desc: "Cash on delivery. No Razorpay, no UPI — just pay when your order arrives.",
  },
];

export function AboutPage() {
  const rootRef    = useRef(null);
  const pillarsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-hero-fade",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: "power3.out" }
      );

      gsap.fromTo(
        ".pillar-card",
        { opacity: 0, y: 22 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out",
          scrollTrigger: {
            trigger: pillarsRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".about-img",
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1, scale: 1, duration: 0.7, ease: "power2.out",
          scrollTrigger: {
            trigger: ".about-img",
            start: "top 88%",
            once: true,
          },
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
          src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1400&h=500&fit=crop"
          alt="Fresh grocery store"
          className="h-64 w-full object-cover object-center md:h-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14">
          <div className="about-hero-fade flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-300 mb-3">
            <GiShop size={15} /> Our Story
          </div>
          <h1 className="about-hero-fade text-3xl md:text-5xl font-bold text-white leading-tight" style={{ letterSpacing: "-0.02em" }}>
            Nook and Native
          </h1>
          <p className="about-hero-fade mt-3 max-w-lg text-sm text-white/75 md:text-base">
            A fruits-and-vegetables storefront built around simple browsing, clean checkout, and a proper backend.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-14 space-y-16">

        {/* ── Story ── */}
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">What we do</p>
            <h2 className="text-2xl font-bold text-slate-800 md:text-3xl" style={{ letterSpacing: "-0.02em" }}>
              Fresh produce,<br />without the noise.
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              Nook and Native connects customers with local vendors selling fruits and vegetables. Browse by category, add to cart, and check out — cash on delivery, nothing more.
            </p>
            <p className="text-sm leading-7 text-slate-600">
              Vendors can register, log in, manage their own product listings, and update order statuses from their dashboard. The backend is Node and Mongo — lean and purposeful.
            </p>
          </div>
          <div className="about-img overflow-hidden rounded-2xl shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=550&fit=crop"
              alt="Fresh market produce"
              className="h-64 w-full object-cover md:h-72"
            />
          </div>
        </section>

        {/* ── Pillars ── */}
        <section ref={pillarsRef}>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-2">How it works</p>
          <h2 className="text-2xl font-bold text-slate-800 mb-8" style={{ letterSpacing: "-0.02em" }}>
            Built on four principles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="pillar-card flex gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Icon size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{title}</p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom image strip ── */}
        <section className="about-img grid grid-cols-3 gap-3">
          {[
            "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1557844352-761f2565b576?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400&h=300&fit=crop",
          ].map((src, i) => (
            <div key={i} className="overflow-hidden rounded-xl shadow-sm">
              <img src={src} alt="produce" className="h-28 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-36" />
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}

export default AboutPage;