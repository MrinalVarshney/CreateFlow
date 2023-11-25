const User = require("../../models/userSchema");
const { generateToken } = require("../../utils/generateToken");

const postLogin = async (req, res) => {
  const { mail, password } = req.body;
  try {
    const user = await User.findOne({ email: mail.toLowerCase() });
    if (!user) {
      res.status(400).send("Email not registered");
    } 
    else if (user.isUserLogin) {
      res.status(400).send("Account already logged in from another device");
    } else if (user && (await user.matchPassword(password))) {
      await user.updateOne({ isUserLogin: true });
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
        bio: user.bio,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).send("Invalid password");
    }
  } catch (error) {
    res.status(500).send("Server Error");
    console.log(error.message);
  }
};

module.exports = postLogin;
