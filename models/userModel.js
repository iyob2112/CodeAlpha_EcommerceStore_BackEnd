const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name is required
      trim: true, // Removes extra spaces
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "", // Default empty string if no profile pic
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER", "SELLER"], // Restrict roles
      default: "user",
    },
    phoneNumber: {
      type: String,
      match: [/^\+?\d{10,15}$/, "Invalid phone number format"], // Optional phone validation
    },
    location: {
      type: String,
    },
    verificationCode: String,
    codeExpires: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Create the user model
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;

// const mongoose = require('mongoose')

// const userSchema = new mongoose.Schema({
//     name : String,
//     email : {
//         type : String,
//         unique : true,
//         required : true
//     },
//     password : String,
//     profilePic : String,
//     role : String,
// },{
//     timestamps : true,
//     toJSON: {
//         transform(doc, ret) {
//             delete ret.password;
//             return ret;
//         }}
// })

// const userModel =  mongoose.model("User",userSchema)

// module.exports = userModel
