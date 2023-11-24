const express = require("express")
const router =  express.Router()
const authController = require("../controllers/auth/authController")


router.post("/register",authController.postRegister)
router.post("/login",authController.postLogin)
router.post("/recover",authController.forgotPassword)
router.get("/check-expiry",authController.checkExpiry)
router.post("/reset-password",authController.resetPassword)
router.post("/send-verification-mail",authController.sendVerificationMail)
router.get("/verify-email",authController.markAsVerified)
router.get("/logout", authController.userLogout)

module.exports = router