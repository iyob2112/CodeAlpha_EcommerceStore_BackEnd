const productModel = require("../../models/productModel");

const getProductByUserController = async (req, res) => {
    try {
        const userId = req.params.userId;

        const userProducts = await productModel.find({ sellerId: userId }).sort({ createdAt: -1 });

        res.json({
            message: "User's Products",
            success: true,
            error: false,
            data: userProducts
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = getProductByUserController;
