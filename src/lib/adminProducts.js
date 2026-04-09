import { API_BASE, apiRequest } from "./api";

export async function fetchVendorProducts() {
  const response = await apiRequest("/vendor/products");
  return response.products ?? [];
}

export async function uploadProductImages(files) {
  const token = typeof window !== "undefined" ? localStorage.getItem("nook_native_token") : null;
  const formData = new FormData();

  for (const file of files) {
    formData.append("images", file);
  }

  const response = await fetch(`${API_BASE}/vendor/images`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || "Image upload failed.");
  }

  return payload;
}

export async function saveProduct(product) {
  const method = product.id ? "PATCH" : "POST";
  const path = product.id ? `/vendor/products/${product.id}` : "/vendor/products";

  const response = await apiRequest(path, {
    method,
    body: JSON.stringify(product)
  });

  return response.product;
}
