import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
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

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" onClick={closeMobile}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-lg font-bold text-white shadow-lg shadow-emerald-200">
              NN
            </div>
            <div>
              <p className="text-lg font-semibold">Nook and Native</p>
              <p className="text-xs text-slate-500">Fresh produce marketplace</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ""}`}>
              Home
            </NavLink>
            <NavLink to="/category/all" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ""}`}>
              All Products
            </NavLink>
            <NavLink to="/category/fruits" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ""}`}>
              Fruits
            </NavLink>
            <NavLink to="/category/vegetables" className={({ isActive }) => `${navLinkBase} ${isActive ? navLinkActive : ""}`}>
              Vegetables
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

          <div className="flex items-center gap-3 md:hidden">
            <Link to="/cart" className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
              Cart {itemCount}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold"
            >
              Menu
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
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
                    `rounded-2xl px-4 py-3 text-sm font-medium ${isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-50 text-slate-700"}`
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
                    `rounded-2xl px-4 py-3 text-sm font-medium ${isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-50 text-slate-700"}`
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
                    `rounded-2xl px-4 py-3 text-sm font-medium ${isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-50 text-slate-700"}`
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
