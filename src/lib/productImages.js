import carrot from "../assets/carrot.jpg";
import cauliflower from "../assets/cauliflower.webp";
import grocery from "../assets/grocery.avif";
import leaves from "../assets/leaves.jpg";
import tomato from "../assets/tomato.avif";

const PRODUCT_IMAGE_MAP = {
  "carrot.jpg": carrot,
  "cauliflower.webp": cauliflower,
  "grocery.avif": grocery,
  "leaves.jpg": leaves,
  "tomato.avif": tomato,
  "apples.svg": grocery,
  "bananas.svg": grocery,
  "carrots.svg": carrot,
  "coriander.svg": leaves,
  "cucumbers.svg": grocery,
  "lemons.svg": grocery,
  "mangoes.svg": grocery,
  "onions.svg": grocery,
  "oranges.svg": grocery,
  "potatoes.svg": grocery,
  "spinach.svg": leaves,
  "tomatoes.svg": tomato
};

export function resolveProductImage(image) {
  if (!image) return "";

  const normalized = String(image).split("/").pop();
  return PRODUCT_IMAGE_MAP[normalized] || image;
}

export const PRODUCT_IMAGE_OPTIONS = Object.entries(PRODUCT_IMAGE_MAP)
  .filter(([fileName]) => ["carrot.jpg", "cauliflower.webp", "grocery.avif", "leaves.jpg", "tomato.avif"].includes(fileName))
  .map(([fileName, src]) => ({
    fileName,
    src
  }));
