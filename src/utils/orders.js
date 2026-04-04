import { apiRequest } from "../lib/api";

export async function placeOrder(order) {
  const response = await apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify(order)
  });

  return response.order;
}

export async function fetchOrdersForUser() {
  const response = await apiRequest("/orders/my");
  return response.orders ?? [];
}

export async function fetchVendorOrders() {
  const response = await apiRequest("/vendor/orders");
  return response.orders ?? [];
}

export async function updateVendorOrderStatus(orderId, status) {
  const response = await apiRequest(`/vendor/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });

  return response.order;
}
