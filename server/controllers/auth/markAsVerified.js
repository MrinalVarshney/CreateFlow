const verificationToken = require("../../models/verifyTokenSchema");
const User = require("../../models/userSchema");

const markAsVerified = async (req, res) => {
  const token = req.query.token;
  if (!token) {
    console.log("Invalid verification link ! Please try again")
    return res.status(400).send("Invalid verification link ! Please try again");
  }
  try {
    const savedToken = await verificationToken.findOne({ token: token });
    if (!savedToken) {
      return res
        .status(400)
        .send("Invalid verification link ! Please try again");
    } else if (savedToken.used) {
      return res.status(400).send("User already registered");
    }
    await verificationToken.findOneAndUpdate({token:token},{$set:{used:true}});
    const currentDate = new Date();
    const expirationDate = new Date(savedToken.expiresAt);
    if (currentDate > expirationDate) {
      return res.status(400).send("This link has expired ! Please try again");
    }
    console.log(savedToken.userId)
    const user = await User.findOne({ _id: savedToken.userId });
    if (!user) {
      return res
        .status(400)
        .send("Invalid verification link ! Please try again");
    }
    await User.findOneAndUpdate({ _id: savedToken.userId }, { $set:{ verified: true },$set: { isUserLogin: true } })
    await verificationToken.deleteOne({ token: token });
    return res.status(200).json({username:user.username,email:user.email,verified:true,token:token,_id:user._id});
  } catch (error) {
    console.log("Error in markAsVerified", error.message)
    res.status(500).send("Server Error");
  }
};


module.exports = markAsVerified;