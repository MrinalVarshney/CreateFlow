const User = require("../../models/userSchema")

const getSearchUsers = async(req,res) =>{
    const {userName} = req.query;
    try{
        if(!userName){
            res.status(400).send("Please enter userName")
        } 
        const searchedUsers = await User.find({ username: { $regex: userName, $options: "i" } })
        console.log(searchedUsers)
        res.status(200).json({searchResults:searchedUsers})
    }catch(error){
        console.log(error.message)
        res.status(500).send("Internal server error")
    }

}

module.exports = getSearchUsers