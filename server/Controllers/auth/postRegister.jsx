const User = require("../../models/user");
const generateToken = require("../../utils/generateToken");

const postRegister = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    //Check if email already exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      res.status(400).send("Email already exists !");
    } else {
      const user = await User.create({
        username,
        email: email.toLowerCase(),
        password,
      });
      if (user) {
        res.status(201).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).send("Invalid user data");
      }
    }
  } catch (error) {
    res.status(400).send("Server Error");
  }
};

module.exports = postRegister;
