import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/api";

export function useProducts(options = {}) {
  const query = useQuery({
    queryKey: ["products", options.category || "all"],
    queryFn: async () => {
      const search = new URLSearchParams();
      if (options.category && options.category !== "all") {
        search.set("category", options.category);
      }

      const response = await apiRequest(`/products${search.toString() ? `?${search}` : ""}`);
      return response.products ?? [];
    }
  });

  const products = useMemo(() => {
    let list = [...(query.data ?? [])];

    if (options.sort === "priceLow") {
      list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    }

    if (options.sort === "priceHigh") {
      list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }

    if (options.limit) {
      list = list.slice(0, options.limit);
    }

    return list;
  }, [options.limit, options.sort, query.data]);

  return {
    products,
    isLoading: query.isLoading,
    error: query.error
  };
}
