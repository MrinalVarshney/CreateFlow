const express = require("express");
const passport = require("passport");
const {generateToken} = require("../utils/generateToken");
const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/login/failed", (req, res) => {
  console.log("failure");
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/login/failed",
  }),
  (req, res) => {
    let user = req.user;
    const token  = generateToken(user._id)
    res.cookie('username', user.username);
    res.cookie('email', user.email);
    res.cookie('pic', user.pic);
    res.cookie('verified', user.verified);
    res.cookie('signedUpWithCustomMethod', user.signedUpWithCustomMethod);
    res.cookie('token',token ,{ secure: true });
    res.redirect(process.env.CLIENT_HOME_PAGE_URL);
  }
);

module.exports = router;
