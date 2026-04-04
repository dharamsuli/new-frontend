// api/verify-payment.js
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      console.error("Missing RAZORPAY_KEY_SECRET");
      return res.status(500).json({
        success: false,
        message: "Server misconfigured: missing Razorpay secret",
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("verify-payment: missing fields", req.body);
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      console.error("Invalid signature", {
        expectedSignature,
        razorpay_signature,
      });

      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("verify-payment error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error verifying payment",
    });
  }
}