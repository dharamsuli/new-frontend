import React from "react";

export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-5 rounded-[32px] bg-white p-8 text-sm leading-7 text-slate-700 shadow-lg shadow-emerald-100">
      <h1 className="text-3xl font-semibold text-slate-900">About Nook and Native</h1>
      <p>
        Nook and Native is now a fruits-and-vegetables storefront built around simple browsing, clean checkout, and a proper backend for customer and vendor accounts.
      </p>
      <p>
        We only keep the main order details needed to fulfill COD purchases: customer contact, delivery address, product snapshot, totals, and order status.
      </p>
      <p>
        Vendors can register, log in, manage their own product listings, and update order statuses from their dashboard. Customer and vendor passwords are stored in hashed form through the Node and Mongo setup.
      </p>
      <p>
        Payment mode is cash on delivery only. Razorpay and UPI checkout have been removed from this website.
      </p>
    </div>
  );
}

export default AboutPage;
