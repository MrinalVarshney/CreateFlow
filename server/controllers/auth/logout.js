const User = require("../../models/userSchema")

const logout = async (req,res) => {
    const userId = req.query.userId;
    console.log("userId",userId)
    await User.findOneAndUpdate({_id:userId},{$set:{isUserLogin:false}})
    res.status(200).send("User logged out successfully")
}

module.exports = logout
