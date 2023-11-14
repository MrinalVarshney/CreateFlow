const postLogin = require("./postLogin");
const postRegister = require("./postRegister");
const forgotPassword = require("./forgotPassword");
const checkExpiry = require("./checkExpiry");
const resetPassword = require("./resetPassword");
const sendVerificationMail = require("./sendVerificationMail");
const markAsVerified = require("./markAsVerified");

module.exports = {
  postLogin,
  postRegister,
  forgotPassword,
  checkExpiry,
  resetPassword, 
  sendVerificationMail,
  markAsVerified
};

