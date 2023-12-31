const User = require("../../models/userSchema");
const {generateToken} = require("../../utils/generateToken");

const postRegister = async (req, res) => {
  const { mail, password, username } = req.body;
  console.log(req.body)
  try {
    //Check if email already exists
    console.log(mail)
    const user1 = await User.findOne({ username: username });
    if(user1){
      res.status(400).send("Username already exists ! Please choose another username")
    }

    const user = await User.findOne({ email: mail.toLowerCase() });
    if (user && user.signedUpWithCustomMethod) {
      res.status(400).send("Email already exists !");
    } 
    else {
      console.log(req.body);
      const user = await User.create({
        username,
        email: mail.toLowerCase(),
        password,
        signedUpWithCustomMethod: true,
        verified:true
      });
      if (user) {
        res.status(201).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          verified: user.verified,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).send("Invalid user data");
      }
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Server Error");
  }
};

module.exports = postRegister;
