const Order = require('../../models/OrderModel');
const Cart = require('../../models/cartProduct');

// Create order function
const createOrder = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        // Fetch user's cart items and populate product details
        const cartItems = await Cart.find({ userId }).populate("productId");
        console.log("Cart Items:", cartItems); // Debugging

        if (!cartItems.length) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        // Calculate total amount
        const totalAmount = cartItems.reduce((sum, item) => {
            if (!item.productId) return sum; // Skip missing products
            return sum + (item.quantity * item.productId.price);
        }, 0);

        // Create order
        const order = new Order({
            userId,
            products: cartItems
                .filter(item => item.productId) // Filter out invalid products
                .map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity,
                    price: item.productId.price,
                })),
            totalAmount,
        });

        await order.save();

        // Clear the cart after placing the order
        await Cart.deleteMany({ userId });

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            data: order,
        });

    } catch (error) {
        console.error("Error creating order:", error); // Log the error
        res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message,
        });
    }
};

// Get all orders for a specific user
const getOrders = async (req, res) => {
    try {
        const { userId } = req.params; // Fetch userId from request params

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        // Find orders by userId and populate product details in the orders
        const orders = await Order.find({ userId }).populate('products.productId');

        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: "No orders found for this user.",
            });
        }

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error); // Log the error
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message,
        });
    }
};
// NEW: Cancel order functionconst
const cancelOrder = async (req, res) => {
    try {
        if (!req.userId) {  // Change this line
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }

        const { orderId } = req.params;
        const userId = req.userId;  // Change this line

        console.log("User ID from request:", userId);
        console.log("Order ID from request:", orderId);

        const order = await Order.findOne({ _id: orderId, userId });
        // const order = await Order.deleteOne({ _id: orderId, userId });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found or unauthorized" });
        }

        order.status = "cancelled";
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order,
        });

    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ success: false, message: "Failed to cancel order", error: error.message });
    }
};
const deliveredOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: "Delivered",
      },
      { new: true }
    );

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Order deleted",
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};


module.exports = { createOrder, getOrders , cancelOrder, deliveredOrder, deleteOrder };
