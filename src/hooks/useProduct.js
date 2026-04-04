import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/api";

export function useProduct(slug) {
  const query = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await apiRequest(`/products/${slug}`);
      return response.product;
    },
    enabled: Boolean(slug)
  });

  return {
    product: query.data,
    isLoading: query.isLoading,
    error: query.error
  };
}

export default useProduct;
