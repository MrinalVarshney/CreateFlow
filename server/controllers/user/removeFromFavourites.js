const User = require("../../models/userSchema");

const removeFromFavourites = async (req, res) => {
  const { canvasId, userId } = req.query;
  console.log("CanvasId userId", canvasId,userId)
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).send("User not found");
    }
    user.favourites.pull(canvasId);
    await user.save();
    console.log(user)
    return res.status(200).json({ favourites: user.favourites });
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Server error");
  }
};

module.exports = removeFromFavourites;
