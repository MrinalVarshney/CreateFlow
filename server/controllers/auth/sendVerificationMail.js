const User = require("../../models/userSchema");
const { generateToken } = require("../../utils/generateToken");
const sendMail = require("../../utils/sendMail");
const verificationToken = require("../../models/verifyTokenSchema");

const sendVerificationMail = async(req,res)=>{
    const {mail,username,password} = req.body;
    try{
        var user = await User.findOne({email:mail.toLowerCase()});
        if(user && user.signedUpWithCustomMethod && user.verified){
            res.status(400).send("Email already registered ! Please login")
        }
        else{
            const token = generateToken(username)

            if(!user){
                user = await User.create({
                    username,
                    email: mail.toLowerCase(),
                    password: password,
                    signedUpWithCustomMethod: true,
                    verified:false
                });
            }

            await verificationToken.create({
                token:token,
                userId:user._id,
            })
            console.log(mail)
            const link = process.env.BASE_URL+"/verify-email/?token="+token
            await sendMail(mail,"Verify your email",link);
            res.status(200).send("Verification mail sent successfully")
        }
    }catch(error){
        res.status(500).send("Server Error");
        console.log(error.message);
    }
}

module.exports = sendVerificationMail