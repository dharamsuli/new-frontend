import React from "react";

const points = [
  "Customer accounts can browse the produce catalog and place COD orders.",
  "Vendor accounts can register separately and manage products plus order statuses.",
  "Site coupons use your own branding only, including NOOKNATIVE50 and NOOKNATIVE120."
];

export default function CustomersPage() {
  return (
    <div className="space-y-6 rounded-[32px] bg-white p-8 shadow-lg shadow-emerald-100">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Why Nook and Native</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Built for customers and vendors</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {points.map((point) => (
          <div key={point} className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
            {point}
          </div>
        ))}
      </div>
    </div>
  );
}
