const User = require("../../models/userSchema");

const getAllCanvas = async (req, res) => {
  const {userId} = req.query;
  try {
    const user = await User.findById(userId).populate("createdCanvases").populate("favourites");
    if (!user) {
      return res.status(400).send("User not found");
    }
    const createdCanvases = user.createdCanvases;
    const favourites = user.favourites;
    return res.status(200).json({createdCanvases:createdCanvases, favourites:favourites});
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = getAllCanvas;
