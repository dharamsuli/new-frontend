import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchVendorOrders, updateVendorOrderStatus } from "../../utils/orders";
import { formatINR } from "../../utils/currency";
import { useAdminGuard } from "../../hooks/useAdminGuard";

const statuses = ["Pending", "Confirmed", "Packed", "Out for Delivery", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const { isAdmin } = useAdminGuard();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;

    fetchVendorOrders()
      .then(setOrders)
      .catch((error) => toast.error(error.message));
  }, [isAdmin]);

  if (!isAdmin) {
    return <p className="text-sm text-rose-600">Vendor access required.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold text-slate-900">Vendor orders</h1>

      {orders.map((order) => (
        <article key={order._id} className="rounded-[28px] bg-white p-6 shadow-lg shadow-emerald-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">{order.orderNumber}</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">{order.customerName}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {order.customerPhone} • {order.shippingAddress?.city}, {order.shippingAddress?.state}
              </p>
            </div>

            <div className="rounded-[24px] bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-900">{formatINR(order.total)}</p>
              <p className="text-slate-500">Payment: COD</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
            {order.items.map((item) => (
              <div key={`${order._id}-${item.productId}`} className="flex items-center justify-between gap-4 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-slate-500">Qty {item.qty} • {item.unit}</p>
                </div>
                <p className="font-semibold text-slate-900">{formatINR(item.price * item.qty)}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Current status: <span className="font-semibold text-slate-900">{order.status}</span>
            </p>
            <select
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm"
              value={order.status}
              onChange={async (event) => {
                try {
                  const updated = await updateVendorOrderStatus(order._id, event.target.value);
                  setOrders((current) => current.map((entry) => (entry._id === updated._id ? updated : entry)));
                  toast.success("Order status updated");
                } catch (error) {
                  toast.error(error.message);
                }
              }}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </article>
      ))}
    </div>
  );
}
