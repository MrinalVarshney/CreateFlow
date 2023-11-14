const passwordToken = require("../../models/passwordTokenSchema");
const User = require("../../models/userSchema");
const hashPassword = require("../../utils/hashPassword");

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  console.log(token, password)
  if (!token) {
    return res
      .status(400)
      .send("Invalid password reset link ! Please try again");
  }
  if (!password) {
    return res.status(400).send("Password is required");
  }
  try {
    const pass = await passwordToken.findOne({ token: token });
    const userId = await pass.userId;
    const hashedPassword =await hashPassword(password);
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    await passwordToken.deleteOne({ token: token })
    if (updatedUser) {
      return res.status(200).json({ updated: true });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Server Error");
  }
};


module.exports = resetPassword