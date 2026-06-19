const express = require("express");
const router = express.Router();
const User = require("../../models/userModel"); // Assuming you have a User model
const authMiddleware = require("../../middleware/authToken"); // Optional authentication middleware

// Get all sellers
const allsellers =async (req, res) => {
    try {
        // Fetch users where role is "seller"
        // const sellers = await User.find({ role: "ADMIN" }).select("id name email");
        const sellers = await User.find({ role: { $in: ["SELLER", "ADMIN"] } }).select("id name email");
        
        if (!sellers.length) {
            return res.status(404).json({ success: false, message: "No sellers founddd." });
        }

        res.json({ success: true, data: sellers });
    } catch (error) {
        console.error("Error fetching sellers:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
};

// Correct way to export the router
module.exports = { allsellers};
