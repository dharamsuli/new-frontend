import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { resolveProductImage } from "../lib/productImages";
import { fetchOrdersForUser } from "../utils/orders";
import { formatINR } from "../utils/currency";

export function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!user || user.role !== "customer") {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchOrdersForUser();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="rounded-[28px] bg-white p-8 text-sm shadow-lg shadow-emerald-100">
        Please <Link to="/account" className="font-semibold text-emerald-700">log in</Link> to view your orders.
      </div>
    );
  }

  if (user.role !== "customer") {
    return (
      <div className="rounded-[28px] bg-white p-8 text-sm shadow-lg shadow-emerald-100">
        Vendor accounts should use the <Link to="/vendor" className="font-semibold text-emerald-700">vendor dashboard</Link>.
      </div>
    );
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading your orders...</p>;
  }

  if (!orders.length) {
    return (
      <div className="rounded-[28px] bg-white p-8 text-center shadow-lg shadow-emerald-100">
        <p className="text-lg font-semibold text-slate-900">No orders yet.</p>
        <Link to="/category/all" className="mt-4 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold text-slate-900">My orders</h1>
      {orders.map((order) => (
        <article key={order._id} className="rounded-[28px] bg-white p-6 shadow-lg shadow-emerald-100">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">{order.orderNumber}</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">{order.status}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {new Date(order.createdAt).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-[24px] bg-slate-50 px-4 py-3 text-sm">
              <p>Total: <span className="font-semibold text-slate-900">{formatINR(order.total)}</span></p>
              <p>Payment: COD</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
            {order.items.map((item) => (
            <div key={`${order._id}-${item.productId}`} className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img
                      src={resolveProductImage(item.image)}
                      alt={item.title}
                      className="h-16 w-16 rounded-[18px] object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-slate-100 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Item
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-slate-500">Qty {item.qty} • {item.unit}</p>
                  </div>
                </div>
                <p className="font-semibold text-slate-900">{formatINR(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export default OrderHistoryPage;
