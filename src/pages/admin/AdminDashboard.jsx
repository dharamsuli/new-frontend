import React from "react";
import { Link } from "react-router-dom";
import { useAdminGuard } from "../../hooks/useAdminGuard";
import { useAuth } from "../../hooks/useAuth";

export function AdminDashboard() {
  const { isAdmin } = useAdminGuard();
  const { user } = useAuth();

  if (!isAdmin) {
    return <p className="text-sm text-rose-600">Vendor access required.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-white p-8 shadow-lg shadow-emerald-100">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Admin dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Welcome {user?.storeName || user?.name}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your produce catalog, track orders, and review registered users from one place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <LinkCard to="/vendor/products" title="Manage products" description="Create or update static-image produce listings." />
        <LinkCard to="/vendor/orders" title="Manage orders" description="Track COD orders and update fulfillment status." />
        <LinkCard to="/vendor/users" title="Registered users" description="See customers and vendors who signed up." />
      </div>
    </div>
  );
}

function LinkCard({ title, description, to }) {
  return (
    <Link to={to} className="rounded-[28px] bg-white p-6 shadow-lg shadow-emerald-100 transition hover:-translate-y-1">
      <p className="text-xl font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </Link>
  );
}
