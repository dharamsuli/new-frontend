import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const CartContext = createContext(null);
const CART_KEY = "nook_native_cart_v1";

function loadInitialCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadInitialCart());

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const clampQty = (qty, stock) => {
    const max = stock != null ? stock : 999;
    return Math.max(1, Math.min(qty, max));
  };

  const addItem = (product, qty = 1, selectedVariantId = null) => {
    const productId = product._id || product.id;

    setItems((previous) => {
      const current = Array.isArray(previous) ? previous : [];
      const stock = Number(product.stock ?? 1);
      const existingIndex = current.findIndex(
        (item) =>
          item.id === productId &&
          (item.selectedVariantId ?? null) === (selectedVariantId ?? null)
      );

      if (existingIndex >= 0) {
        const next = [...current];
        next[existingIndex] = {
          ...next[existingIndex],
          qty: clampQty(next[existingIndex].qty + qty, stock)
        };
        return next;
      }

      return [
        ...current,
        {
          id: productId,
          title: product.title,
          price: product.price,
          qty: clampQty(qty, stock),
          stock,
          unit: product.unit,
          image: product.images?.[0] || product.image,
          selectedVariantId
        }
      ];
    });
  };

  const removeItem = (id, selectedVariantId = null) => {
    setItems((previous) =>
      previous.filter(
        (item) =>
          !(
            item.id === id &&
            (item.selectedVariantId ?? null) === (selectedVariantId ?? null)
          )
      )
    );
  };

  const updateQty = (id, newQty, selectedVariantId = null) => {
    setItems((previous) =>
      previous.map((item) => {
        const matches =
          item.id === id &&
          (item.selectedVariantId ?? null) === (selectedVariantId ?? null);

        if (!matches) return item;

        return {
          ...item,
          qty: clampQty(newQty, item.stock)
        };
      })
    );
  };

  const clearCart = () => setItems([]);

  const { subtotal, itemCount } = useMemo(() => {
    let subtotalValue = 0;
    let countValue = 0;

    for (const item of items) {
      subtotalValue += (item.price ?? 0) * (item.qty ?? 0);
      countValue += item.qty ?? 0;
    }

    return {
      subtotal: subtotalValue,
      itemCount: countValue
    };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        itemCount,
        addItem,
        removeItem,
        updateQty,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used inside CartProvider");
  }
  return context;
}

export default CartContext;
