// src/utils/inventory.js
const KEY = "inventoryOverrides";

function readInv() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; }
  catch { return {}; }
}
function writeInv(inv) {
  localStorage.setItem(KEY, JSON.stringify(inv));
}

// merges "sold/stock=0" into mock products
export function applyInventoryToProduct(p) {
  const inv = readInv();
  const over = inv[p.id];
  if (!over) return p;
  return { ...p, ...over };
}

// call this after payment
export function decrementStockForOrder(items=[]) {
  const inv = readInv();
  items.forEach(i => {
    inv[i.id] = { stock: 0, isSold: true };
  });
  writeInv(inv);
}