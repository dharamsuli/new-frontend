// src/hooks/useCart.js
import { useCartContext } from "../context/CartContext";

export function useCart() {
  return useCartContext();
}

export default useCart;
