const productModel = require("../../models/productModel");

const deleteProductController = async (req, res) => {
  try {
    const { productId } = req.params;
    await productModel.findByIdAndDelete(productId);

    res.json({
      message: "Product deleted successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Failed to delete product",
      success: false,
      error: true,
    });
  }
};

module.exports = deleteProductController;
