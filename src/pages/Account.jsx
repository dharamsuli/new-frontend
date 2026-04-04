import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function AccountPage() {
  const navigate = useNavigate();
  const { user, signUp, login, logout, loading } = useAuth();
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("customer");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    storeName: ""
  });

  const isSignup = mode === "signup";

  if (user) {
    return (
      <div className="space-y-6">
        <section className="rounded-[32px] bg-white p-8 shadow-lg shadow-emerald-100">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Account</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{user.name}</h1>
          <p className="mt-2 text-sm text-slate-500">
            Signed in as {user.role}. {user.storeName ? `Store: ${user.storeName}` : "Customer account ready for COD orders."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {user.role === "customer" ? (
              <Link to="/orders" className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white">
                View orders
              </Link>
            ) : (
              <Link to="/vendor" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                Open vendor dashboard
              </Link>
            )}
            <button type="button" onClick={() => { logout(); navigate("/account"); }} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">
              Log out
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[0.95fr,1.05fr]">
      <section className="rounded-[32px] bg-[linear-gradient(135deg,_rgba(22,163,74,0.95),_rgba(245,158,11,0.85))] p-8 text-white shadow-2xl shadow-emerald-200">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">Join Nook and Native</p>
        <h1 className="mt-3 text-4xl font-semibold">Customer and vendor accounts in one place.</h1>
        <div className="mt-6 space-y-3 text-sm text-white/85">
          <p>Customers can browse produce, apply site coupons, and place COD orders.</p>
          <p>Vendors can register, log in, add products with static images, and manage their order statuses.</p>
          <p>Passwords are stored in hashed form on the Node + Mongo backend.</p>
        </div>
      </section>

      <section className="rounded-[32px] bg-white p-8 shadow-lg shadow-emerald-100">
        <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1 text-sm">
          <button type="button" onClick={() => setMode("login")} className={`rounded-full px-4 py-2 font-semibold ${mode === "login" ? "bg-white shadow" : "text-slate-500"}`}>
            Login
          </button>
          <button type="button" onClick={() => setMode("signup")} className={`rounded-full px-4 py-2 font-semibold ${mode === "signup" ? "bg-white shadow" : "text-slate-500"}`}>
            Sign up
          </button>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              if (isSignup) {
                await signUp({ ...form, role });
                toast.success("Account created");
              } else {
                await login({ email: form.email, password: form.password });
                toast.success("Logged in");
              }
            } catch (error) {
              toast.error(error.message);
            }
          }}
        >
          {isSignup && (
            <>
              <div className="flex gap-2 rounded-full bg-slate-100 p-1 text-sm">
                <button type="button" onClick={() => setRole("customer")} className={`rounded-full px-4 py-2 font-semibold ${role === "customer" ? "bg-white shadow" : "text-slate-500"}`}>
                  Customer
                </button>
                <button type="button" onClick={() => setRole("vendor")} className={`rounded-full px-4 py-2 font-semibold ${role === "vendor" ? "bg-white shadow" : "text-slate-500"}`}>
                  Vendor
                </button>
              </div>

              <Field label="Full name">
                <input className="input" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
              </Field>

              <Field label="Phone">
                <input className="input" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
              </Field>

              {role === "vendor" && (
                <Field label="Store name">
                  <input className="input" value={form.storeName} onChange={(event) => setForm((current) => ({ ...current, storeName: event.target.value }))} />
                </Field>
              )}
            </>
          )}

          <Field label="Email">
            <input className="input" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          </Field>

          <Field label="Password">
            <input className="input" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
          </Field>

          <button type="submit" disabled={loading} className="w-full rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white">
            {loading ? "Please wait..." : isSignup ? "Create account" : "Log in"}
          </button>
        </form>
      </section>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export default AccountPage;
