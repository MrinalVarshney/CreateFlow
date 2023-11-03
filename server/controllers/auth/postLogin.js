const User = require("../../models/userSchema");
const {generateToken} = require("../../utils/generateToken");

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(400).send("Email not registered");
    } else if (user && (await user.matchPassword(password))) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
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
