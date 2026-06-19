const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");

async function updateProfile(req, res) {
  try {
    const userId = req.userId; // from auth middleware

    const { name, email, password, location, phoneNumber } = req.body;

    // find current user
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    // prepare update object
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(location && { location }),
      ...(phoneNumber && { phoneNumber }),
    };

    // 🔐 handle password separately
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    // update user
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password"); // hide password

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });

  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({
      message: err.message || "Something went wrong",
      success: false,
      error: true,
    });
  }
}

module.exports = updateProfile;