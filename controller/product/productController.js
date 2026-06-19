const Product = require("../../models/productModel"); // Ensure correct import

// Get all products for a specific seller
const getSellerProducts = async (req, res) => {
  try {
    const { sellerId } = req.params; // Ensure sellerId is from params

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    const products = await Product.find({ sellerId });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this seller" });
    }

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getSellerProducts };
