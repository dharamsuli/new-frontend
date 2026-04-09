import React, { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../hooks/useCart";
import { formatINR } from "../utils/currency";
import { resolveProductImage } from "../lib/productImages";

export function ProductDetail() {
  const { slug } = useParams();
  const { product, isLoading } = useProduct(slug);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  if (isLoading) {
    return (
      <div className="pd-page">
        <div className="pd-skeleton-img" />
        <div className="pd-skeleton-text" />
        <style>{styles}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-page">
        <p className="pd-error">This product is not available right now.</p>
        <style>{styles}</style>
      </div>
    );
  }

  const maxQty = Math.max(1, Number(product.stock || 0));
  const soldOut = Number(product.stock || 0) <= 0;
  const imageSrc = resolveProductImage(product.image);

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="pd-page">
      {/* ── Page header label (matches screenshot) ── */}
      <p className="pd-page-label">PRODUCT OVERVIEW</p>

      <div className="pd-grid">
        {/* ── LEFT: Image ── */}
        <div className="pd-image-wrap">
          <img
            src={imageSrc}
            alt={product.title}
            className="pd-image"
          />
        </div>

        {/* ── RIGHT: Details ── */}
        <div className="pd-details">

          {/* Wishlist heart */}
          <button
            className="pd-wish-btn"
            onClick={() => setWishlisted((v) => !v)}
            aria-label="Wishlist"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? "#64748b" : "none"} stroke="#94a3b8" strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Category */}
          <p className="pd-category">{(product.category || "").toUpperCase()}</p>

          {/* Title */}
          <h1 className="pd-title">{product.title}</h1>

          {/* Price row */}
          <div className="pd-price-row">
            {product.compareAtPrice ? (
              <span className="pd-price-compare">{formatINR(product.compareAtPrice)}</span>
            ) : null}
            <span className="pd-price-main">{formatINR(product.price)}</span>
            {soldOut ? (
              <span className="pd-badge pd-badge-oos">✕ Out of Stock</span>
            ) : (
              <span className="pd-badge pd-badge-stock">✓ In Stock</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="pd-desc-block">
              <p className="pd-desc-label">DESCRIPTION</p>
              <p className="pd-desc-text">{product.description}</p>
            </div>
          )}

          {/* Divider */}
          <hr className="pd-divider" />

          {/* Size / Price / Quantity header */}
          <p className="pd-variants-header">SIZE / PRICE / QUANTITY / TOTAL</p>

          {/* Single variant row (expandable pattern matching screenshot) */}
          <div className="pd-variant-row pd-variant-selected">
            <div className="pd-variant-top">
              <div className="pd-variant-left">
                <div className="pd-checkbox pd-checkbox-checked" />
                <span className="pd-variant-label">{product.unit}</span>
                {discount ? (
                  <span className="pd-discount-pill">{discount}% OFF</span>
                ) : null}
              </div>
              <div className="pd-variant-right">
                <span className="pd-variant-price">{formatINR(product.price)}</span>
                {product.compareAtPrice ? (
                  <span className="pd-variant-compare">{formatINR(product.compareAtPrice)}</span>
                ) : null}
              </div>
            </div>

            {/* Quantity row */}
            <div className="pd-qty-row">
              <span className="pd-qty-label">QUANTITY</span>
              <div className="pd-qty-controls">
                <button
                  className="pd-qty-btn"
                  onClick={() => setQty((v) => Math.max(1, v - 1))}
                  disabled={soldOut}
                >−</button>
                <span className="pd-qty-val">{qty}</span>
                <button
                  className="pd-qty-btn"
                  onClick={() => setQty((v) => Math.min(maxQty, v + 1))}
                  disabled={soldOut}
                >+</button>
              </div>
            </div>
          </div>

          {/* Vendor row */}
          <div className="pd-meta-row">
            <span className="pd-meta-key">Vendor</span>
            <span className="pd-meta-val">{product.vendorName || "Nook and Native"}</span>
          </div>
          {product.badges?.length > 0 && (
            <div className="pd-badges">
              {product.badges.map((b) => (
                <span key={b} className="pd-tag">{b}</span>
              ))}
            </div>
          )}

          {/* CTA */}
          <button
            type="button"
            disabled={soldOut}
            onClick={() => {
              addItem(product, qty);
              toast.success("Added to cart");
            }}
            className="pd-add-btn"
          >
            {soldOut ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .pd-page {
    background: linear-gradient(180deg, #f2fbf4 0%, #ecf8ef 100%);
    min-height: 100vh;
    padding: 40px 32px;
    font-family: 'Georgia', 'Times New Roman', serif;
  }

  .pd-page-label {
    font-size: 11px;
    font-family: 'Helvetica Neue', sans-serif;
    letter-spacing: 0.2em;
    color: #2d5a41;
    margin-bottom: 28px;
    font-weight: 400;
  }

  .pd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    align-items: start;
  }

  @media (max-width: 768px) {
    .pd-grid { grid-template-columns: 1fr; gap: 32px; }
    .pd-page { padding: 24px 16px; }
  }

  /* ── Image ── */
  .pd-image-wrap {
    background: linear-gradient(180deg, #ffffff 0%, #f6fcf7 100%);
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(45, 106, 79, 0.08);
    line-height: 0;
  }

  .pd-image {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
    max-height: 520px;
  }

  /* ── Details ── */
  .pd-details {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .pd-wish-btn {
    position: absolute;
    top: 0;
    right: 0;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  .pd-wish-btn:hover { opacity: 1; }

  .pd-category {
    font-size: 10px;
    font-family: 'Helvetica Neue', sans-serif;
    letter-spacing: 0.18em;
    color: #888;
    font-weight: 400;
    margin: 0;
  }

  .pd-title {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
    line-height: 1.2;
    font-family: 'Georgia', serif;
  }

  /* Price */
  .pd-price-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .pd-price-compare {
    font-size: 15px;
    color: #aaa;
    text-decoration: line-through;
    font-family: 'Helvetica Neue', sans-serif;
  }

  .pd-price-main {
    font-size: 18px;
    font-weight: 700;
    color: #2d6a4f;
    font-family: 'Helvetica Neue', sans-serif;
  }

  .pd-badge {
    font-size: 11px;
    font-family: 'Helvetica Neue', sans-serif;
    font-weight: 500;
    border-radius: 99px;
    padding: 3px 12px;
    letter-spacing: 0.02em;
  }

  .pd-badge-stock {
    background: #d4edda;
    color: #2d6a4f;
  }

  .pd-badge-oos {
    background: #fde8e8;
    color: #c0392b;
  }

  /* Description */
  .pd-desc-block { display: flex; flex-direction: column; gap: 6px; }

  .pd-desc-label {
    font-size: 10px;
    font-family: 'Helvetica Neue', sans-serif;
    letter-spacing: 0.16em;
    color: #aaa;
  }

  .pd-desc-text {
    font-size: 14px;
    color: #444;
    line-height: 1.6;
    font-family: 'Helvetica Neue', sans-serif;
    margin: 0;
  }

  .pd-divider {
    border: none;
    border-top: 1px solid #dcecdf;
    margin: 0;
  }

  /* Variants */
  .pd-variants-header {
    font-size: 10px;
    font-family: 'Helvetica Neue', sans-serif;
    letter-spacing: 0.14em;
    color: #999;
    margin: 0;
  }

  .pd-variant-row {
    border: 1px solid #dcecdf;
    border-radius: 4px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #ffffff;
  }

  .pd-variant-selected {
    border-color: #b7d8c0;
    background: #f4fbf6;
  }

  .pd-variant-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pd-variant-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pd-checkbox {
    width: 16px;
    height: 16px;
    border: 1.5px solid #aaa;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .pd-checkbox-checked {
    background: #2d6a4f;
    border-color: #2d6a4f;
    position: relative;
  }

  .pd-checkbox-checked::after {
    content: '';
    position: absolute;
    left: 3px;
    top: 1px;
    width: 8px;
    height: 5px;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: rotate(-45deg);
  }

  .pd-variant-label {
    font-size: 13px;
    color: #333;
    font-family: 'Helvetica Neue', sans-serif;
  }

  .pd-discount-pill {
    font-size: 10px;
    font-family: 'Helvetica Neue', sans-serif;
    font-weight: 600;
    background: #2d6a4f;
    color: #fff;
    border-radius: 99px;
    padding: 2px 10px;
    letter-spacing: 0.04em;
  }

  .pd-variant-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pd-variant-price {
    font-size: 14px;
    font-weight: 700;
    color: #2d6a4f;
    font-family: 'Helvetica Neue', sans-serif;
  }

  .pd-variant-compare {
    font-size: 13px;
    color: #bbb;
    text-decoration: line-through;
    font-family: 'Helvetica Neue', sans-serif;
  }

  /* Quantity */
  .pd-qty-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 1px solid #e2efe5;
  }

  .pd-qty-label {
    font-size: 10px;
    letter-spacing: 0.14em;
    color: #aaa;
    font-family: 'Helvetica Neue', sans-serif;
  }

  .pd-qty-controls {
    display: flex;
    align-items: center;
    gap: 0;
    border: 1px solid #d4e8dc;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
  }

  .pd-qty-btn {
    width: 34px;
    height: 34px;
    background: #f6fbf7;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #555;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }
  .pd-qty-btn:hover:not(:disabled) { background: #e9f5ec; }
  .pd-qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .pd-qty-val {
    width: 44px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    font-family: 'Helvetica Neue', sans-serif;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    line-height: 34px;
  }

  /* Meta */
  .pd-meta-row {
    display: flex;
    gap: 12px;
    font-size: 13px;
    font-family: 'Helvetica Neue', sans-serif;
    color: #666;
  }
  .pd-meta-key { color: #aaa; }
  .pd-meta-val { color: #444; }

  /* Badges */
  .pd-badges { display: flex; gap: 8px; flex-wrap: wrap; }
  .pd-tag {
    font-size: 11px;
    font-family: 'Helvetica Neue', sans-serif;
    border: 1px solid #d4e8dc;
    color: #2d6a4f;
    border-radius: 99px;
    padding: 3px 12px;
    background: #f0faf4;
  }

  /* CTA */
  .pd-add-btn {
    margin-top: 8px;
    width: 100%;
    padding: 14px;
    background: #2d6a4f;
    color: #fff;
    font-size: 13px;
    font-family: 'Helvetica Neue', sans-serif;
    letter-spacing: 0.12em;
    font-weight: 500;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .pd-add-btn:hover:not(:disabled) { background: #24553f; }
  .pd-add-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Skeletons */
  .pd-skeleton-img {
    width: 100%;
    height: 420px;
    background: #e8e4dc;
    border-radius: 4px;
    animation: pd-pulse 1.4s ease-in-out infinite;
  }
  .pd-skeleton-text {
    height: 24px;
    width: 200px;
    background: #e8e4dc;
    border-radius: 4px;
    margin-top: 16px;
    animation: pd-pulse 1.4s ease-in-out infinite;
  }
  @keyframes pd-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .pd-error {
    font-size: 14px;
    color: #c0392b;
    font-family: 'Helvetica Neue', sans-serif;
  }
`;

export default ProductDetail;

