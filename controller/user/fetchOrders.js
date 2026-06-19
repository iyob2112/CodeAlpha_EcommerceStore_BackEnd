const OrderModel = require("../../models/OrderModel");
const UserModel = require("../../models/userModel"); // This just registers the User model

const fetchOrders = async (req, res) => {
  try {
    
    // Fetch all orders and populate the userId field with user details
    const allOrders = await OrderModel.find().populate("userId",); // populate name and email of user

    if (allOrders.length === 0) {
      return res.status(404).json({
        message: "No orders found.",
        error: true,
        success: false,
      });
    }

    res.json({
      data: allOrders,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = fetchOrders;
