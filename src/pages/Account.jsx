import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import gsap from "gsap";
import {
  TbUser, TbMail, TbLock, TbPhone, TbBuildingStore,
  TbArrowRight, TbShoppingBag, TbLayoutDashboard, TbLogout
} from "react-icons/tb";
import { PiPlantFill } from "react-icons/pi";

const initialForm = { name: "", email: "", phone: "", password: "", storeName: "" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AccountPage() {
  const navigate = useNavigate();
  const { user, signUp, login, logout, loading } = useAuth();
  const [mode, setMode]   = useState("login");
  const [role, setRole]   = useState("customer");
  const [form, setForm]   = useState(initialForm);
  const [errors, setErrors] = useState({});
  const rootRef = useRef(null);
  const isSignup = mode === "signup";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".acc-fade",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: "power3.out" }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [user]);

  const updateField = (field, value) => {
    setForm((c) => ({ ...c, [field]: field === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value }));
    setErrors((c) => { if (!c[field]) return c; const n = { ...c }; delete n[field]; return n; });
  };

  const validateForm = () => {
    const e = {};
    if (isSignup && !form.name.trim())                              e.name      = "Full name is required.";
    if (isSignup && !form.phone.trim())                             e.phone     = "Phone number is required.";
    else if (isSignup && !/^\d{10}$/.test(form.phone))             e.phone     = "Must be exactly 10 digits.";
    if (isSignup && role === "vendor" && !form.storeName.trim())    e.storeName = "Store name is required.";
    if (!form.email.trim())                                         e.email     = "Email is required.";
    else if (!emailPattern.test(form.email.trim()))                 e.email     = "Enter a valid email.";
    if (!form.password.trim())                                      e.password  = "Password is required.";
    else if (isSignup && form.password.trim().length < 6)          e.password  = "Minimum 6 characters.";
    return e;
  };

  const inputCls = (field) =>
    `w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all
    focus:ring-2 focus:ring-emerald-100
    ${errors[field] ? "border-rose-300 focus:border-rose-400" : "border-slate-200 focus:border-emerald-400"}`;

  // ── Logged in ──
  if (user) {
    return (
      <div ref={rootRef} className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-orange-50 flex items-center justify-center px-5 py-16">
        <div className="acc-fade w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-emerald-100 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <TbUser size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">{user.role}</p>
              <h1 className="text-xl font-bold text-slate-800 mt-0.5" style={{ letterSpacing: "-0.01em" }}>
                {user.name}
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-500 leading-6">
            {user.storeName
              ? `Store: ${user.storeName}`
              : "Customer account ready for COD orders."}
          </p>

          <div className="h-px bg-slate-100" />

          <div className="flex flex-col gap-3">
            {user.role === "customer" ? (
              <Link
                to="/orders"
                className="flex items-center justify-between rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 group"
              >
                <div className="flex items-center gap-2">
                  <TbShoppingBag size={16} /> View orders
                </div>
                <TbArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link
                to="/vendor"
                className="flex items-center justify-between rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-900 group"
              >
                <div className="flex items-center gap-2">
                  <TbLayoutDashboard size={16} /> Vendor dashboard
                </div>
                <TbArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
            <button
              type="button"
              onClick={() => { logout(); navigate("/account"); }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50"
            >
              <TbLogout size={16} /> Log out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Auth ──
  return (
    <div ref={rootRef} className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-orange-50">
      <div className="mx-auto grid max-w-5xl gap-6 px-5 py-12 md:grid-cols-[0.95fr,1.05fr] md:items-start">

        {/* Left panel */}
        <div className="acc-fade rounded-2xl overflow-hidden shadow-md">
          <img
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=400&fit=crop"
            alt="Fresh produce market"
            className="h-44 w-full object-cover"
          />
          <div className="bg-emerald-700 p-6 text-white space-y-4">
            <div className="flex items-center gap-2">
              <PiPlantFill size={16} className="text-emerald-300" />
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Nook and Native</p>
            </div>
            <h2 className="text-2xl font-bold leading-snug" style={{ letterSpacing: "-0.02em" }}>
              Customer and vendor accounts in one place.
            </h2>
            <div className="space-y-2 text-sm text-emerald-100">
              <p>Customers browse produce, apply coupons, and place COD orders.</p>
              <p>Vendors manage product listings and order statuses from their dashboard.</p>
              <p>Passwords are hashed on the Node + Mongo backend.</p>
            </div>
          </div>
        </div>

        {/* Right panel - form */}
        <div className="acc-fade rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100 space-y-5">

          {/* Mode toggle */}
          <div className="flex gap-1 rounded-full bg-slate-100 p-1 text-sm">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setErrors({}); }}
                className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all capitalize
                  ${mode === m ? "bg-white shadow text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const errs = validateForm();
              if (Object.keys(errs).length) { setErrors(errs); toast.error("Please fix the highlighted fields."); return; }
              try {
                if (isSignup) {
                  await signUp({ ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password.trim(), storeName: form.storeName.trim(), role });
                  toast.success("Account created");
                } else {
                  await login({ email: form.email.trim(), password: form.password.trim() });
                  toast.success("Logged in");
                }
              } catch (err) { toast.error(err.message); }
            }}
          >
            {/* Role toggle (signup only) */}
            {isSignup && (
              <div className="flex gap-1 rounded-full bg-slate-100 p-1 text-sm">
                {["customer", "vendor"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setRole(r); setErrors((c) => { const n = { ...c }; delete n.storeName; return n; }); }}
                    className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all capitalize
                      ${role === r ? "bg-white shadow text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            {isSignup && (
              <Field label="Full name" error={errors.name} Icon={TbUser}>
                <input className={inputCls("name")} value={form.name} onChange={(e) => updateField("name", e.target.value)} autoComplete="name" />
              </Field>
            )}

            {isSignup && (
              <Field label="Phone" error={errors.phone} Icon={TbPhone}>
                <input className={inputCls("phone")} value={form.phone} onChange={(e) => updateField("phone", e.target.value)} autoComplete="tel" inputMode="numeric" maxLength={10} placeholder="10-digit number" />
              </Field>
            )}

            {isSignup && role === "vendor" && (
              <Field label="Store name" error={errors.storeName} Icon={TbBuildingStore}>
                <input className={inputCls("storeName")} value={form.storeName} onChange={(e) => updateField("storeName", e.target.value)} autoComplete="organization" />
              </Field>
            )}

            <Field label="Email" error={errors.email} Icon={TbMail}>
              <input className={inputCls("email")} type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} autoComplete="email" />
            </Field>

            <Field label="Password" error={errors.password} Icon={TbLock}>
              <input className={inputCls("password")} type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} autoComplete={isSignup ? "new-password" : "current-password"} />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 hover:gap-3 disabled:opacity-60"
            >
              {loading ? "Please wait..." : isSignup ? "Create account" : "Log in"}
              {!loading && <TbArrowRight size={15} />}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

function Field({ label, error, Icon, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        {Icon && <Icon size={13} className="text-emerald-500" />}
        {label}
      </span>
      {children}
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </label>
  );
}

export default AccountPage;