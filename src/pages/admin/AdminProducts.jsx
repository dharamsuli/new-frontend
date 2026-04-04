import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { fetchStaticImages, fetchVendorProducts, saveProduct } from "../../lib/adminProducts";
import { useAdminGuard } from "../../hooks/useAdminGuard";
import { formatINR } from "../../utils/currency";
import { resolveProductImage } from "../../lib/productImages";

const emptyForm = {
  title: "",
  slug: "",
  category: "fruits",
  unit: "1 kg",
  price: "",
  compareAtPrice: "",
  stock: "",
  image: "",
  shortDescription: "",
  description: "",
  badges: "",
  isPublished: true
};

export function AdminProducts() {
  const { isAdmin } = useAdminGuard();
  const { productId } = useParams();
  const [products, setProducts] = useState([]);
  const [imageOptions, setImageOptions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [vendorProducts, staticImages] = await Promise.all([
        fetchVendorProducts(),
        fetchStaticImages()
      ]);
      setProducts(vendorProducts);
      setImageOptions(staticImages);
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

    setForm({
      id: editingProduct._id,
      title: editingProduct.title,
      slug: editingProduct.slug,
      category: editingProduct.category,
      unit: editingProduct.unit,
      price: editingProduct.price,
      compareAtPrice: editingProduct.compareAtPrice || "",
      stock: editingProduct.stock,
      image: editingProduct.image,
      shortDescription: editingProduct.shortDescription || "",
      description: editingProduct.description || "",
      badges: (editingProduct.badges || []).join(", "),
      isPublished: editingProduct.isPublished
    });
  }, [editingProduct]);

  if (!isAdmin) {
    return <p className="text-sm text-rose-600">Vendor access required.</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-slate-900">Vendor products</h1>
          <Link to="/vendor/products" className="text-sm font-semibold text-emerald-700">
            New product
          </Link>
        </div>

        <div className="space-y-3">
          {products.map((product) => (
            <Link key={product._id} to={`/vendor/products/${product._id}`} className="flex items-center gap-4 rounded-[28px] bg-white p-4 shadow-lg shadow-emerald-100">
              <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,_#ecfdf5,_#fff7ed)] p-3">
                <img src={resolveProductImage(product.image)} alt={product.title} className="h-full w-full object-contain" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-slate-900">{product.title}</p>
                <p className="text-sm text-slate-500">{product.category} • {product.unit}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold text-slate-900">{formatINR(product.price)}</p>
                <p className="text-slate-500">{product.stock} in stock</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-[32px] bg-white p-6 shadow-lg shadow-emerald-100">
        <h2 className="text-2xl font-semibold text-slate-900">{editingProduct ? "Edit product" : "Create product"}</h2>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setSaving(true);
            try {
              const saved = await saveProduct({
                ...form,
                price: Number(form.price),
                compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
                stock: Number(form.stock),
                badges: form.badges
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              });

              const refreshed = await fetchVendorProducts();
              setProducts(refreshed);
              setForm({
                id: saved._id,
                title: saved.title,
                slug: saved.slug,
                category: saved.category,
                unit: saved.unit,
                price: saved.price,
                compareAtPrice: saved.compareAtPrice || "",
                stock: saved.stock,
                image: saved.image,
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
          <Field label="Title">
            <input className="input" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value, slug: event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }))} />
          </Field>
          <Field label="Slug">
            <input className="input" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select className="input" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="leafy">Leafy</option>
                <option value="herbs">Herbs</option>
              </select>
            </Field>
            <Field label="Unit">
              <input className="input" value={form.unit} onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value }))} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Price (paise)">
              <input className="input" type="number" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} />
            </Field>
            <Field label="Compare at price">
              <input className="input" type="number" value={form.compareAtPrice} onChange={(event) => setForm((current) => ({ ...current, compareAtPrice: event.target.value }))} />
            </Field>
            <Field label="Stock">
              <input className="input" type="number" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))} />
            </Field>
          </div>
          <Field label="Static image">
            <select className="input" value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}>
              <option value="">Select an image</option>
              {imageOptions.map((option) => (
                <option key={option.image} value={option.image}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          {form.image ? (
            <div className="rounded-[24px] bg-slate-50 p-4">
              <p className="mb-3 text-sm font-medium text-slate-700">Selected image preview</p>
              <div className="flex h-32 w-32 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,_#ecfdf5,_#fff7ed)] p-3">
                <img src={resolveProductImage(form.image)} alt="Selected product" className="h-full w-full object-contain" />
              </div>
            </div>
          ) : null}
          <Field label="Short description">
            <input className="input" value={form.shortDescription} onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))} />
          </Field>
          <Field label="Description">
            <textarea className="w-full rounded-[24px] border border-slate-200 px-4 py-3 text-sm" rows={4} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          </Field>
          <Field label="Badges (comma separated)">
            <input className="input" value={form.badges} onChange={(event) => setForm((current) => ({ ...current, badges: event.target.value }))} />
          </Field>
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={form.isPublished} onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))} />
            Published
          </label>
          <button type="submit" disabled={saving} className="w-full rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white">
            {saving ? "Saving..." : "Save product"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
