// const jwt = require('jsonwebtoken')
// const { promisify } = require('util')
// // const AppError = require('../utils/appError')
// const User = require('../models/userModel')
// // const sendResetEmail = require('./../utils/passwordResetEmail')
// // const sendVerifyEmail = require('../utils/verficationEmail')

// // async function authToken(req,res,next){
// //     try{
// //         const token = req.cookies?.token

// //         console.log("token",token)
// //         if(!token){
// //             return res.status(200).json({
// //                 message : "Please Login...!",
// //                 error : true,
// //                 success : false
// //             })
// //         }

// //         jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
// //             console.log(err)
// //             console.log("decoded",decoded)
            
// //             if(err){
// //                 console.log("error auth", err)
// //             }

// //             req.userId = decoded?._id

// //             next()
// //         });


// //     }catch(err){
// //         res.status(400).json({
// //             message : err.message || err,
// //             data : [],
// //             error : true,
// //             success : false
// //         })
// //     }
// // }

// exports.protect = async (req, res, next) => {
//     try{
//         // const token = req.cookies?.token
//                 let token;

// if (
//   req.headers.authorization &&
//   req.headers.authorization.startsWith("Bearer")
// ) {
//   token = req.headers.authorization.split(" ")[1];
// } else if (req.cookies?.token) {
//   token = req.cookies.token;
// }

//         console.log("token",token)
//         if(!token){
//             return res.status(200).json({
//                 message : "Please Login...!",
//                 error : true,
//                 success : false
//             })
//         }

//         const decodedToken = jwt.decode(token)

//         if (!decodedToken) {
//             return res.status(200).json({
//                 message : "Please Login...!",
//                 error : true,
//                 success : false
//             })
//         }

//         if (decodedToken.exp < Date.now() / 1000) {
//             return res.status(200).json({
//                 message : 'Session expired! Please login again.',
//                 error : true,
//                 success : false
//             })
//         }

//         const currentTimestamp = Math.floor(Date.now() / 1000) // Get current timestamp in seconds
//         if (decodedToken.expiresIn && decodedToken.expiresIn < currentTimestamp) {
//             return res.status(200).json({
//                 message : 'Session expired! Please login again.',
//                 error : true,
//                 success : false
//             })
//         }

//         jwt.verify(token, process.env.TOKEN_SECRET_KEY, async function(err, decoded) {
//             console.log(err)
//             console.log("decoded",decoded)

//             if(err){
//                 console.log("error auth", err)
//             }
//             const currentUser = await User.findById(decoded._id)
            
//             if (currentUser.changedPasswordAfter(decoded.iat)) {
//                 return res.status(200).json({
//                     message : 'Password recently changed! Please login again.',
//                     error : true,
//                     success : false
//                 })
//               }

//             req.userId = decoded?._id

//             next()
//         });


//     }catch(err){
//         res.status(400).json({
//             message : err.message || err,
//             data : [],
//             error : true,
//             success : false
//         })
//     }
// }

// exports.restrictTo = (...roles) => {
//   // passing values in middleware ...closure concept
    
//   return async (req, res, next) => {
//     const currentUser = await User.findById(req.userId)
//     if (!roles.includes(currentUser.role)) {
//         return res.status(403).json({
//             message : 'you don`t have permission to perform this action',
//             error : true,
//             success : false
//         })
//     }
//     next()
//   }
// }

// // exports.forgotPassword = async (req, res, next) => {
// //   // 1.get user from posted email

// //   const user = await User.findOne({ 
// //     email: req.body.email
// //   })

// //   if (!user) {
// //       return res.status(401).json({
// //           message : 'User doesn`t exists.',
// //           error : true,
// //           success : false
// //       })
// //   }

// //   //2. generate the random verification

// //   const resetCode = user.createCode()
// //   user.save({validateBeforeSave: false})

// //   // Also send short reset code to mobile phone

// //   const message = ''
// //   try {
// //     await sendResetEmail({
// //       name: user.name,
// //       email: user.email,
// //       subject: 'Your password reset code (valid for 10 minutes)',
// //       message,
// //       code: resetCode
// //     })

// //     return res.status(401).json({
// //         message : 'Code sent to email.',
// //         error : true,
// //         success : false
// //     })
// //   } catch (err) {
// //     user.code = undefined
// //     user.codeExpiry = undefined
// //     await user.save({ validateBeforeSave: false })

// //     // return next(new AppError('There was an error while sending the email. Try again later'), 500)
// //     return res.status(500).json({
// //         message : 'There was an error while sending the email. Try again later',
// //         error : true,
// //         success : false
// //     })
// //   }
// // }

// // exports.resetPassword = async (req, res, next) => {
// //   //1. Get user based on the token

// //   const resetCode = req.body.code
// //   const {email} = req.body
// //   const user = await User.findOne({email: email})

// //   if(user.codeExpirs < Date.now()) {
// //     user.code = ""
// //     user.codeExpiry = undefined
// //     await user.save({ validateBeforeSave: false })
// //       return res.status(401).json({
// //           message : 'Password reset code expired! Please try again.',
// //           error : true,
// //           success : false
// //       })
// //   }

// //   if (!resetCode) {
// //       return res.status(401).json({
// //           message : 'Please provide the password reset code.',
// //           error : true,
// //           success : false
// //       })
// //   }

// //   if (!(resetCode === user.code)) {
// //       return res.status(401).json({
// //           message : 'The password reset code is not correct!',
// //           error : true,
// //           success : false
// //       })
// //   }

// //   user.password = req.body.password
// //   user.passwordConfirm = req.body.passwordConfirm
// //   user.code = undefined
// //   user.codeExpirey = undefined
// //   await user.save()

// // }

// // exports.updatePassword = async (req, res, next) => {
// //   //1. get user from collection

// //   const user = await User.findById(req.user.id).select('+password')

// //   //2. check if posted current password is correct
// //   const correct = await user.correctPassword(req.body.oldPassword, user.password)
// //   if (!user || !correct) {
// //       return res.status(500).json({
// //           message : 'Your old password is wrong.',
// //           error : true,
// //           success : false
// //       })
// //   }

// //   //3. if correct ,update password

// //   user.password = req.body.password
// //   user.passwordConfirm = req.body.passwordConfirm
// //   await user.save()

// // }

// // module.exports = authToken




const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authToken = async (req, res, next) => {
  try {
    let token;

    // Read token from HEADER or COOKIE
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
        error: true,
        success: false,
      });
    }

    // Verify token (also checks expiration)
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
        error: true,
        success: false,
      });
    }

    req.userId = user._id;
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: true,
      success: false,
    });
  }
};
const restrictTo = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: "Please login first",
          error: true,
          success: false,
        });
      }
      
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(401).json({
          message: "User not found",
          error: true,
          success: false,
        });
      }
      
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message: "Access denied. Insufficient permissions.",
          error: true,
          success: false,
        });
      }
      
      req.user = user; // Attach full user object if needed
      next();
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        error: true,
        success: false,
      });
    }
  };
};
module.exports = { authToken, restrictTo };