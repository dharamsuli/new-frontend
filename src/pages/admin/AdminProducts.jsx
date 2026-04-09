import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { fetchVendorProducts, saveProduct, uploadProductImages } from "../../lib/adminProducts";
import { useAdminGuard } from "../../hooks/useAdminGuard";
import { formatINR } from "../../utils/currency";
import { resolveProductImage } from "../../lib/productImages";

const emptyForm = {
  title: "",
  slug: "",
  category: "",
  unit: "1 kg",
  price: "",
  compareAtPrice: "",
  stock: "",
  image: "",
  images: [],
  shortDescription: "",
  description: "",
  badges: "",
  isPublished: true
};

function toRupeeInput(value) {
  if (value === null || value === undefined || value === "") return "";
  return String(Number(value) / 100);
}

function toPaiseValue(value) {
  if (value === null || value === undefined || value === "") return null;
  return Math.round(Number(value) * 100);
}

function normalizeImages(images, fallbackImage = "") {
  const next = [];

  for (const value of [...(Array.isArray(images) ? images : []), fallbackImage]) {
    const normalized = String(value || "").trim();
    if (!normalized || next.includes(normalized)) {
      continue;
    }
    next.push(normalized);
  }

  return next;
}

export function AdminProducts() {
  const { isAdmin } = useAdminGuard();
  const { productId } = useParams();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function load() {
      const vendorProducts = await fetchVendorProducts();
      setProducts(vendorProducts);
    }
    if (isAdmin) {
      load().catch((error) => toast.error(error.message));
    }
  }, [isAdmin]);

  const editingProduct = useMemo(
    () => products.find((product) => product._id === productId),
    [productId, products]
  );

  useEffect(() => {
    if (!editingProduct) {
      setForm(emptyForm);
      return;
    }

    const images = normalizeImages(editingProduct.images, editingProduct.image);

    setForm({
      id: editingProduct._id,
      title: editingProduct.title,
      slug: editingProduct.slug,
      category: editingProduct.category,
      unit: editingProduct.unit,
      price: toRupeeInput(editingProduct.price),
      compareAtPrice: toRupeeInput(editingProduct.compareAtPrice),
      stock: editingProduct.stock,
      image: images[0] || "",
      images,
      shortDescription: editingProduct.shortDescription || "",
      description: editingProduct.description || "",
      badges: (editingProduct.badges || []).join(", "),
      isPublished: editingProduct.isPublished
    });
  }, [editingProduct]);

  async function handleFileUpload(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setUploadingImage(true);
    try {
      const uploaded = await uploadProductImages(files);
      setForm((current) => {
        const images = normalizeImages([...current.images, ...(uploaded.images || [])], current.image);
        return {
          ...current,
          image: images[0] || "",
          images
        };
      });
      toast.success(`${files.length} image${files.length > 1 ? "s" : ""} uploaded`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploadingImage(false);
    }
  }

  function removeImage(imageToRemove) {
    setForm((current) => {
      const images = current.images.filter((image) => image !== imageToRemove);
      return {
        ...current,
        image: images[0] || "",
        images
      };
    });
  }

  function setPrimaryImage(imageToPromote) {
    setForm((current) => {
      const images = [imageToPromote, ...current.images.filter((image) => image !== imageToPromote)];
      return {
        ...current,
        image: images[0] || "",
        images
      };
    });
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        Vendor access required.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px,1fr]">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products</h1>
            <p className="mt-0.5 text-sm text-slate-400">{products.length} items listed</p>
          </div>
          <Link
            to="/vendor/products"
            className="flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-800"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            New
          </Link>
        </div>

        <div className="space-y-2">
          {products.map((product) => {
            const previewImage = product.images?.[0] || product.image;
            return (
              <Link
                key={product._id}
                to={`/vendor/products/${product._id}`}
                className={`group flex items-center gap-3 rounded-2xl border p-3 transition-all duration-150 ${
                  product._id === productId
                    ? "border-emerald-200 bg-emerald-50 shadow-sm"
                    : "border-transparent bg-white shadow-sm shadow-slate-100 hover:border-slate-200 hover:shadow-md"
                }`}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-orange-50">
                  <img src={resolveProductImage(previewImage)} alt={product.title} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{product.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400 capitalize">{product.category} · {product.unit}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{formatINR(product.price)}</p>
                  <p className={`mt-0.5 text-xs font-medium ${product.stock < 10 ? "text-rose-500" : "text-slate-400"}`}>
                    {product.stock} left
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-100/60">
        <div className="border-b border-slate-100 px-7 py-5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {editingProduct ? "Edit product" : "Create product"}
          </h2>
          <p className="mt-0.5 text-sm text-slate-400">
            {editingProduct ? `Editing "${editingProduct.title}"` : "Fill in the details to add a new product"}
          </p>
        </div>

        <form
          className="divide-y divide-slate-50"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!form.images.length) {
              toast.error("Please upload at least one product image first");
              return;
            }
            setSaving(true);
            try {
              const saved = await saveProduct({
                ...form,
                image: form.images[0],
                images: form.images,
                price: toPaiseValue(form.price),
                compareAtPrice: toPaiseValue(form.compareAtPrice),
                stock: Number(form.stock),
                badges: form.badges.split(",").map((item) => item.trim()).filter(Boolean)
              });
              const refreshed = await fetchVendorProducts();
              setProducts(refreshed);
              const images = normalizeImages(saved.images, saved.image);
              setForm({
                id: saved._id,
                title: saved.title,
                slug: saved.slug,
                category: saved.category,
                unit: saved.unit,
                price: toRupeeInput(saved.price),
                compareAtPrice: toRupeeInput(saved.compareAtPrice),
                stock: saved.stock,
                image: images[0] || "",
                images,
                shortDescription: saved.shortDescription || "",
                description: saved.description || "",
                badges: (saved.badges || []).join(", "),
                isPublished: saved.isPublished
              });
              toast.success("Product saved");
            } catch (error) {
              toast.error(error.message);
            } finally {
              setSaving(false);
            }
          }}
        >
          <div className="px-7 py-6 space-y-4">
            <SectionLabel icon="??" title="Basic Info" />
            <Field label="Product Title">
              <input
                className="field-input"
                placeholder="e.g. Organic Alphonso Mangoes"
                value={form.title}
                onChange={(e) => setForm((c) => ({
                  ...c,
                  title: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
                }))}
              />
            </Field>
            <Field label="URL Slug">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">/p/</span>
                <input
                  className="field-input pl-10"
                  placeholder="organic-alphonso-mangoes"
                  value={form.slug}
                  onChange={(e) => setForm((c) => ({ ...c, slug: e.target.value }))}
                />
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <input
                  className="field-input"
                  placeholder="e.g. Fruits, Vegetables, Leafy Greens"
                  value={form.category}
                  onChange={(e) => setForm((c) => ({ ...c, category: e.target.value }))}
                />
              </Field>
              <Field label="Unit">
                <input className="field-input" placeholder="1 kg" value={form.unit} onChange={(e) => setForm((c) => ({ ...c, unit: e.target.value }))} />
              </Field>
            </div>
          </div>

          <div className="px-7 py-6 space-y-4">
            <SectionLabel icon="??" title="Pricing & Stock" />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Price (Rs)">
                <input className="field-input" type="number" step="0.01" placeholder="49" value={form.price} onChange={(e) => setForm((c) => ({ ...c, price: e.target.value }))} />
              </Field>
              <Field label="Compare at Price (Rs)">
                <input className="field-input" type="number" step="0.01" placeholder="59" value={form.compareAtPrice} onChange={(e) => setForm((c) => ({ ...c, compareAtPrice: e.target.value }))} />
              </Field>
              <Field label="Stock">
                <input className="field-input" type="number" placeholder="50" value={form.stock} onChange={(e) => setForm((c) => ({ ...c, stock: e.target.value }))} />
              </Field>
            </div>
          </div>

          <div className="px-7 py-6 space-y-4">
            <SectionLabel icon="IMG" title="Product Images" />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const files = e.dataTransfer.files;
                if (files?.length) handleFileUpload(files);
              }}
              className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10 transition-all duration-200 ${
                dragOver
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/50"
              }`}
            >
              {uploadingImage ? (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                    <svg className="animate-spin h-7 w-7 text-emerald-600" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-emerald-700">Uploading images...</p>
                </>
              ) : (
                <>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${dragOver ? "bg-emerald-200" : "bg-white shadow-md shadow-slate-100"}`}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-emerald-600">
                      <path d="M14 18V10M14 10L10.5 13.5M14 10L17.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 22H20C21.1 22 22 21.1 22 20V8C22 6.9 21.1 6 20 6H8C6.9 6 6 6.9 6 8V20C6 21.1 6.9 22 8 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M6 17.5L9.5 14L12.5 17L16 13L22 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700">
                      {dragOver ? "Drop images to upload" : "Click to upload or drag & drop multiple images"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">PNG, JPG, WEBP up to 5MB each</p>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                    Choose Files
                  </span>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={async (e) => {
                  const files = e.target.files;
                  await handleFileUpload(files);
                  e.target.value = "";
                }}
              />
            </div>

            {form.images.length > 0 && (
              <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{form.images.length} image{form.images.length > 1 ? "s" : ""} selected</p>
                    <p className="mt-0.5 text-xs text-slate-400">The first image will be used as the cover image across the store.</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {form.images.map((image, index) => (
                    <div key={image} className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
                      <div className="aspect-square overflow-hidden bg-gradient-to-br from-emerald-50 to-orange-50">
                        <img src={resolveProductImage(image)} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                      </div>
                      <div className="space-y-2 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                            {index === 0 ? "Cover image" : `Image ${index + 1}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeImage(image)}
                            className="text-xs font-medium text-rose-500 hover:text-rose-600"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="truncate text-xs text-slate-400">{image}</p>
                        {index > 0 ? (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(image)}
                            className="w-full rounded-full border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                          >
                            Make cover image
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-7 py-6 space-y-4">
            <SectionLabel icon="??" title="Content" />
            <Field label="Short Description">
              <input
                className="field-input"
                placeholder="One-line tagline shown on cards"
                value={form.shortDescription}
                onChange={(e) => setForm((c) => ({ ...c, shortDescription: e.target.value }))}
              />
            </Field>
            <Field label="Full Description">
              <textarea
                className="field-input resize-none"
                rows={4}
                placeholder="Detailed product description..."
                value={form.description}
                onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))}
              />
            </Field>
            <Field label="Badges">
              <input
                className="field-input"
                placeholder="Organic, Seasonal, Farm Fresh"
                value={form.badges}
                onChange={(e) => setForm((c) => ({ ...c, badges: e.target.value }))}
              />
              <p className="text-xs text-slate-400">Separate multiple badges with commas</p>
            </Field>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-b-3xl bg-slate-50/80 px-7 py-5">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700 select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={form.isPublished}
                  onChange={(e) => setForm((c) => ({ ...c, isPublished: e.target.checked }))}
                />
                <div className={`h-5 w-9 rounded-full transition-colors ${form.isPublished ? "bg-emerald-500" : "bg-slate-300"}`} />
                <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isPublished ? "translate-x-4" : ""}`} />
              </div>
              {form.isPublished ? "Published" : "Draft"}
            </label>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="flex items-center gap-2 rounded-full bg-emerald-700 px-7 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7.5L5.5 11L12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .field-input {
          width: 100%;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          padding: 10px 14px;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .field-input:focus {
          border-color: #059669;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(5,150,105,0.10);
        }
        .field-input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
}

function SectionLabel({ icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-base">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</span>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

export default AdminProducts;
