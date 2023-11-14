const sendMail = require("../../utils/sendMail");
const User =  require("../../models/userSchema")
const generateRandomPassword = require("../../utils/generateRandomPassword")
const passwordToken = require("../../models/passwordTokenSchema")

const forgotPassword = async (req, res) => {
    const {mail} = req.body;
    console.log(mail)
    try{
        const user =await User.findOne({email:mail})
        if(!user){
            return res.status(400).send("Invalid email ! Please enter a valid email")
        }
        console.log("User found")
        console.log(user)
        const token =await passwordToken.create({
            userId:user._id,
            token:generateRandomPassword(12)
        })
        const url = `${process.env.BASE_URL}/reset-password/?token=${token.token}`
        await sendMail(mail,"Password Reset",url)
        res.status(200).json({verified:true,email:mail})
    }catch(error){
        res.status(500).send("Server Error")
        console.log("Server error",error.message)
    }
}

module.exports = forgotPassword