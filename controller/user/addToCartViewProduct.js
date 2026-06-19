const addToCartModel = require("../../models/cartProduct"); // Ensure correct path
const Product = require("../../models/productModel"); // Ensure Product model is registered

const addToCartViewProduct = async (req, res) => {
    try {
        const currentUser = req.userId;

        if (!currentUser) {
            return res.status(400).json({
                message: "User ID is required",
                error: true,
                success: false
            });
        }

        const allProduct = await addToCartModel.find({ userId: currentUser })
            .populate("productId");

        res.status(200).json({
            data: allProduct,
            success: true,
            error: false
        });

    } catch (err) {
        console.error("Error fetching cart items:", err);
        res.status(500).json({
            message: err.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};

module.exports = addToCartViewProduct;
