import { apiRequest } from "./api";

export async function fetchVendorProducts() {
  const response = await apiRequest("/vendor/products");
  return response.products ?? [];
}

export async function fetchStaticImages() {
  const response = await apiRequest("/products/static-images");
  return response.images ?? [];
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
