const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

// Transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "iyobmw01@gmail.com", // use your email
    pass: "gqrl rxjc xthr bwyx", // use app-specific password (Gmail)
  },
});

// Send verification code
const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.findOneAndUpdate(
    { email },
    {
      email,
      verificationCode: code,
      codeExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
    },
    { upsert: true, new: true }
  );
  console.log("user", user);

  try {
    await transporter.sendMail({
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}`,
    });

    res.json({ success: true, message: "Verification code sent." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  if (
    user.verificationCode !== verificationCode ||
    new Date() > user.codeExpires
  ) {
    return res.json({ success: false, message: "Invalid or expired code" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.verificationCode = null;
  user.codeExpires = null;

  await user.save();
  res.json({ success: true, message: "Password reset successful" });
};

module.exports = {
  sendVerificationCode,
  resetPassword,
};
