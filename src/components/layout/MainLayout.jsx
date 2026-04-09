import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import nookNativeLogo from "../../assets/nook-nativelogo.png";
import Footer from "./Footer";

const navLinkBase =
  "rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700";
const navLinkActive = "bg-emerald-100 text-emerald-800";

export function MainLayout() {
  const { pathname } = useLocation();
  const { itemCount } = useCart();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);

  const banners = useMemo(
    () => [
      "NOOKNATIVE50: Rs.50 off above Rs.600 on farm fresh picks.",
      "COD only. Fresh fruits, vegetables, and herbs delivered across India."
    ],
    []
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((current) => (current + 1) % banners.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [banners.length]);

  const closeMobile = () => setMobileOpen(false);
  const isHomePage = pathname === "/";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7e8,_#f3faef_35%,_#eef8ff_100%)] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/85 backdrop-blur">
        <div className="bg-gradient-to-r from-emerald-700 via-lime-600 to-amber-500 px-4 py-2 text-center text-xs font-semibold text-white">
          {banners[activeBanner]}
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={closeMobile}>
            <img
              src={nookNativeLogo}
              alt="Nook and Native logo"
              className="h-12 w-12 shrink-0 rounded-[16px] object-cover shadow-lg shadow-emerald-200 sm:h-14 sm:w-14 md:h-16 md:w-16"
            />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold sm:text-lg">Nook and Native</p>
              <p className="hidden text-xs text-slate-500 sm:block">Fresh produce marketplace</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ""}`}>
              Home
            </NavLink>
            <NavLink to="/category/all" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ""}`}>
              All Products
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ""}`}>
              About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ""}`}>
              Contact
            </NavLink>
            <NavLink to="/customers" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ""}`}>
              Why Us
            </NavLink>
            <NavLink to="/account" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ""}`}>
              {user ? "Account" : "Login"}
            </NavLink>
            {user?.role === "customer" && (
              <NavLink to="/orders" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ""}`}>
                Orders
              </NavLink>
            )}
            {user?.role === "vendor" && (
              <NavLink to="/vendor" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ""}`}>
                Admin
              </NavLink>
            )}
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Cart
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{itemCount}</span>
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-200"
            >
              <span>Cart</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px]">{itemCount}</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-white text-slate-700 shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <path d="M6 6L18 18M18 6L6 18" />
                ) : (
                  <>
                    <path d="M4 7H20" />
                    <path d="M4 12H20" />
                    <path d="M4 17H20" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-emerald-100 bg-white/95 px-4 py-4 shadow-lg shadow-emerald-100/40 backdrop-blur md:hidden">
            <div className="mb-4 rounded-[24px] bg-[linear-gradient(135deg,_#f0fdf4,_#ecfdf5,_#fefce8)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Browse</p>
              <p className="mt-1 text-sm text-slate-600">Shop fresh produce, check your account, and track orders from one menu.</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                ["/", "Home"],
                ["/category/all", "All Products"],
                ["/category/fruits", "Fruits"],
                ["/category/vegetables", "Vegetables"],
                ["/about", "About"],
                ["/contact", "Contact"],
                ["/customers", "Why Us"],
                ["/account", user ? "Account" : "Login"]
              ].map(([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `rounded-[20px] px-4 py-3 text-sm font-medium shadow-sm transition ${
                      isActive
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              {user?.role === "customer" && (
                <NavLink
                  to="/orders"
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `rounded-[20px] px-4 py-3 text-sm font-medium shadow-sm transition ${
                      isActive
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    }`
                  }
                >
                  Orders
                </NavLink>
              )}
              {user?.role === "vendor" && (
                <NavLink
                  to="/vendor"
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `rounded-[20px] px-4 py-3 text-sm font-medium shadow-sm transition ${
                      isActive
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    }`
                  }
                >
                  Admin Dashboard
                </NavLink>
              )}
            </div>
          </div>
        )}
      </header>

      <main className={isHomePage ? "py-0" : "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
