import React from "react";

export default function Contact() {
  return (
    <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-lg shadow-emerald-100">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Contact</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">Get in touch</h1>
      <div className="mt-6 space-y-4 text-sm text-slate-600">
        <p>Email: support@nookandnative.local</p>
        <p>Phone: +91 90000 00000</p>
        <p>For vendor setup or order support, use the account portal and vendor dashboard included in the site.</p>
      </div>
    </div>
  );
}
