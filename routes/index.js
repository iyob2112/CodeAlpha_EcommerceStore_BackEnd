


const express = require("express");
const router = express.Router();

const userSignUpController = require("../controller/user/userSignUp");
const userSignInController = require("../controller/user/userSignIn");
const userDetailsController = require("../controller/user/userDetails");
const authToken = require("../middleware/authToken");
const userLogout = require("../controller/user/userLogout");
const allUsers = require("../controller/user/allUsers");
const { updateUser, deleteUser } = require("../controller/user/updateUser");
const UploadProductController = require("../controller/product/uploadProduct");
const getProductController = require("../controller/product/getProduct");
const updateProductController = require("../controller/product/updateProduct");
const getCategoryProduct = require("../controller/product/getCategoryProductOne");
const getCategoryWiseProduct = require("../controller/product/getCategoryWiseProduct");
const getProductDetails = require("../controller/product/getProductDetails");
const addToCartController = require("../controller/user/addToCartController");
const countAddToCartProduct = require("../controller/user/countAddToCartProduct");
const addToCartViewProduct = require("../controller/user/addToCartViewProduct");
const updateAddToCartProduct = require("../controller/user/updateAddToCartProduct");
const deleteAddToCartProduct = require("../controller/user/deleteAddToCartProduct");
const searchProduct = require("../controller/product/searchProduct");
const filterProductController = require("../controller/product/filterProduct");
const updateProfile = require("../controller/user/updateProfile");
const {
  sendVerificationCode,
  resetPassword,
} = require("../controller/user/sendVerificationCode ");
// const { resetPassword } = require("../controller/user/resetPassword");
const { allsellers } = require("../controller/user/allSellers");
const productsbysellerId = require("../controller/product/productController");
const fetchOrders = require("../controller/user/fetchOrders");
const {
  createOrder,
  getOrders,
  cancelOrder,
  deliveredOrder,
  deleteOrder
} = require("../controller/user/order.controller");
const getProductByUserController = require("../controller/product/getProductByUserController");
const deleteProductController = require("../controller/product/deleteProductController");
const { restrictTo } = require("../controller/authController");

const {
  initializePayment,
  verifyPayment,
} = require("../controller/paymentController");
router.post("/signup", userSignUpController);
router.post("/signin", userSignInController);
router.get("/user-details", authToken, userDetailsController);
router.get("/userLogout", userLogout);

//admin panel
router.get("/all-user", authToken, restrictTo("ADMIN"), allUsers);
router.post("/update-user", authToken, restrictTo("ADMIN"), updateUser);
router.delete("/delete-user/:id", authToken, restrictTo("ADMIN"), deleteUser);
router.post("/update-user/:id", authToken, updateUser)

//product
router.post("/upload-product", authToken, UploadProductController);
router.get("/get-product", getProductController);
router.post("/update-product", authToken, updateProductController);
router.get("/get-categoryProduct", getCategoryProduct);
router.post("/category-product", getCategoryWiseProduct);
router.post("/product-details", getProductDetails);
router.get("/search", searchProduct);
router.post("/filter-product", filterProductController);

//user add to cart
router.post("/addtocart", authToken, addToCartController);
router.get("/countAddToCartProduct", authToken, countAddToCartProduct);
router.get("/view-card-product", authToken, addToCartViewProduct);
router.post("/update-cart-product", authToken, updateAddToCartProduct);
router.post("/delete-cart-product", authToken, deleteAddToCartProduct);

// ###############################################################
router.post("/forgot-password", sendVerificationCode);
router.post("/reset-password", resetPassword);
router.get("/sellers", allsellers);
router.get("/productsbyseller/:sellerId", productsbysellerId.getSellerProducts);
router.get("/all-orders", authToken, fetchOrders);
router.post("/orders", createOrder);
router.get("/orders/:userId", getOrders);
router.post("/cancel/:orderId", authToken, cancelOrder);
router.get("/user/:userId", getProductByUserController);
router.delete("/product/:productId", deleteProductController);

// ###############################################################
router.put("/update-profile", authToken, updateProfile);

router.delete("/delete-order/:id", authToken, deleteOrder);
router.put("/delivered-order/:id", authToken, deliveredOrder);
// ###############################################################

router.post("/initialize", initializePayment);

router.get("/verify/:tx_ref", verifyPayment);
// ###############################################################
module.exports = router;
