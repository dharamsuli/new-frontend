import apples from "../assets/products/apples.svg";
import bananas from "../assets/products/bananas.svg";
import carrots from "../assets/products/carrots.svg";
import coriander from "../assets/products/coriander.svg";
import cucumbers from "../assets/products/cucumbers.svg";
import lemons from "../assets/products/lemons.svg";
import mangoes from "../assets/products/mangoes.svg";
import onions from "../assets/products/onions.svg";
import oranges from "../assets/products/oranges.svg";
import potatoes from "../assets/products/potatoes.svg";
import spinach from "../assets/products/spinach.svg";
import tomatoes from "../assets/products/tomatoes.svg";

const PRODUCT_IMAGE_MAP = {
  "apples.svg": apples,
  "bananas.svg": bananas,
  "carrots.svg": carrots,
  "coriander.svg": coriander,
  "cucumbers.svg": cucumbers,
  "lemons.svg": lemons,
  "mangoes.svg": mangoes,
  "onions.svg": onions,
  "oranges.svg": oranges,
  "potatoes.svg": potatoes,
  "spinach.svg": spinach,
  "tomatoes.svg": tomatoes
};

export function resolveProductImage(image) {
  if (!image) return "";

  const normalized = String(image).split("/").pop();
  return PRODUCT_IMAGE_MAP[normalized] || image;
}

export const PRODUCT_IMAGE_OPTIONS = Object.entries(PRODUCT_IMAGE_MAP).map(
  ([fileName, src]) => ({
    fileName,
    src
  })
);
