import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { TbMail, TbPhone, TbLayoutDashboard, TbArrowRight } from "react-icons/tb";
import { GiShop } from "react-icons/gi";

const contacts = [
  {
    Icon: TbMail,
    label: "Email",
    value: "support@nookandnative.local",
    href: "mailto:support@nookandnative.local",
  },
  {
    Icon: TbPhone,
    label: "Phone",
    value: "+91 90000 00000",
    href: "tel:+919000000000",
  },
];

export default function Contact() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-fade",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-orange-50">

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden rounded-3xl mx-4 mt-6 md:mx-8 md:mt-8 shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=1400&h=400&fit=crop"
          alt="Fresh market"
          className="h-56 w-full object-cover object-center md:h-72"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14">
          <div className="contact-fade flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-300 mb-3">
            <GiShop size={14} /> Nook and Native
          </div>
          <h1 className="contact-fade text-3xl md:text-5xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
            Get in touch
          </h1>
          <p className="contact-fade mt-2 text-sm text-white/70 md:text-base">
            We're here for order support, vendor setup, or anything else.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-14 space-y-6">

        {/* ── Contact cards ── */}
        {contacts.map(({ Icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            className="contact-fade flex items-center gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-100 transition-all hover:shadow-md hover:-translate-y-0.5 group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Icon size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">{value}</p>
            </div>
            <TbArrowRight
              size={16}
              className="ml-auto text-slate-300 transition-all group-hover:text-emerald-500 group-hover:translate-x-1"
            />
          </a>
        ))}

        {/* ── Vendor / Order support ── */}
        <div className="contact-fade rounded-2xl bg-emerald-600 p-6 text-white shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <TbLayoutDashboard size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Vendor or order support?</p>
              <p className="mt-1 text-xs text-emerald-100 leading-6">
                Use the account portal and vendor dashboard built into the site — manage listings, check order statuses, and update your profile all in one place.
              </p>
              <Link
                to="/account"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-50 hover:gap-2.5"
              >
                Go to account <TbArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}