const User = require("../../models/userSchema");

const getPendingInvitations = async (req,res)=>{
    const {userId} = req.query;
    try{
        const user = await User.findById(userId).populate({
            path: "invitations",
            populate: {
              path: "sender receiver",
              select: "email username", // select the fields you want to populate
            },
          });
        console.log(user)
        if(!user){
            return res.status(400).send("User not found");
        }
        const invitations = user.invitations;
        res.status(200).json(invitations);
    }
    catch(error){
        res.status(500).send("Internal Server Error");
    }
}

module.exports = getPendingInvitations