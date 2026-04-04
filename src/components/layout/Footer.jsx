import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-emerald-100 bg-white/90">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-slate-700 sm:grid-cols-3 sm:px-6 lg:px-8">
        <div>
          <p className="text-lg font-semibold text-slate-900">Nook and Native</p>
          <p className="mt-2 text-sm text-slate-600">
            Fruits, vegetables, and herbs with simple COD checkout and vendor-ready order management.
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-900">Explore</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/category/all">All products</Link>
            <Link to="/category/fruits">Fruits</Link>
            <Link to="/category/vegetables">Vegetables</Link>
            <Link to="/orders">My orders</Link>
          </div>
        </div>

        <div>
          <p className="font-semibold text-slate-900">Support</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact</Link>
            <p className="text-sm text-slate-500">Payment method: Cash on Delivery only</p>
            <p className="text-sm text-slate-500">Coupon: NOOKNATIVE50</p>
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-100 px-4 py-4 text-center text-xs text-slate-500">
        © {year} Nook and Native. Fresh produce, vendor-friendly tools, and COD ordering.
      </div>
    </footer>
  );
}

export default Footer;
