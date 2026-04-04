// client/api/create-order.js
import Razorpay from "razorpay";

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    console.error("Missing Razorpay env vars");
    return res
      .status(500)
      .json({ success: false, message: "Server missing Razorpay config" });
  }

  try {
    const { amount } = req.body || {};

    if (!amount || typeof amount !== "number") {
      return res.status(400).json({
        success: false,
        message: "Amount is required (number in paise)",
      });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture:1
    });

    console.log("Razorpay order created:", order.id);

    // ✅ THIS MUST BE 200, NOT 404
    return res.status(200).json({
      success: true,
      razorpayOrderId: order.id,
    });
  } catch (err) {
    console.error("create-order server error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while creating order",
    });
  }
}