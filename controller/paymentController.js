const axios = require("axios");
const Order = require("../models/OrderModel");
const Cart = require("../models/cartProduct");
const initializePayment = async (req, res) => {
  try {
    const { amount, email, name, userId, products } = req.body;

    const tx_ref = "tx-" + Date.now() + "-" + userId;

    // Save order FIRST (pending)
const order = await Order.create({
  userId,
  products,
  totalAmount: amount,
  email,
  tx_ref,
  status: "pending",
  paymentStatus: "pending",
});

console.log("ORDER CREATED:", order);

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount,
        currency: "ETB",
        email,
        first_name: name,
        tx_ref,

        return_url: "https://amit-shop21.vercel.app/payment-success",

        callback_url: "https://amit-shop-back-end-1.onrender.com/api/verify/" + tx_ref,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    res.json({
      checkout_url: response.data.data.checkout_url,
    });

  } catch (error) {
    console.log(error.response?.data || error);
    res.status(500).json({ message: "Payment failed" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const tx_ref = req.params.tx_ref;

    console.log("VERIFY HIT:", tx_ref);

    // 1. Verify with Chapa
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    console.log("CHAPA RESPONSE:", response.data);

    if (response.data.status === "success") {

      // 2. Find order
      const order = await Order.findOne({ tx_ref });

      if (!order) {
        console.log("Order not found:", tx_ref);
        return res.redirect("https://amit-shop21.vercel.app/payment-failed");
      }

      // 3. Update order
      order.paymentStatus = "paid";
      order.status = "confirmed";
      await order.save();

      console.log("Order updated");

      // 4. Clear cart
      await Cart.deleteMany({ userId: order.userId });

      console.log("Cart cleared");

      return res.redirect("https://amit-shop21.vercel.app/payment-success");
    }

    return res.redirect("https://amit-shop21.vercel.app/payment-failed");

  } catch (error) {
    console.log("VERIFY ERROR:", error.response?.data || error.message);

    return res.redirect("https://amit-shop21.vercel.app/payment-failed");
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
};