// const bcrypt = require('bcryptjs');
// const User = require('../../models/userModel');

// const resetPassword = async (req, res) => {
//   const { email, verificationCode, newPassword } = req.body;

//   // Find the user by email
//   const user = await User.findOne({ email, resetCode: verificationCode, resetCodeExpiry: { $gt: Date.now() } });

//   if (!user) {
//     return res.status(400).json({ error: 'Invalid or expired verification code' });
//   }

//   // Hash the new password
//   const hashedPassword = await bcrypt.hash(newPassword, 12);

//   // Update the password and clear the reset code
//   user.password = hashedPassword;
//   user.resetCode = undefined;
//   user.resetCodeExpiry = undefined;
//   await user.save();

//   res.json({ success: true, message: 'Password has been reset successfully' });
// };

// module.exports = { resetPassword };
