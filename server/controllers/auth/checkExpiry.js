const passwordToken = require("../../models/passwordTokenSchema");

const checkExpiry = async (req, res) => {
  const token = req.query.token;
  if(!token){
    return res.status(400).send("Invalid password reset link ! Please try again");
  }
  try {
    const pass = await passwordToken.findOne({ token: token });
    console.log(pass)
    if (!pass) {
      return res
        .status(400)
        .send("Invalid password reset link ! Please try again");
    }
    else if (pass.used) {
      return res
        .status(400)
        .send("This link has already been used ! Please try again");
    }
    const currentDate = new Date();
    const expirationDate = new Date(pass.expiresAt);
    if (currentDate > expirationDate) {
      return res.status(400).send("This link has expired ! Please try again");
    }
    await passwordToken.findOneAndUpdate(
        { token: token },
        { $set: { used: true } }
      );
    res.status(200).json({ verified: true });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};


module.exports = checkExpiry;