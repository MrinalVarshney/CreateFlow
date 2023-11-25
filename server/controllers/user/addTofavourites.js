const User = require("../../models/userSchema");
const Canvas = require("../../models/Canvas/canvasSchema");

const addToFavourites = async (req, res) => {
  const { canvasId, userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).send("User not found");
    }
    const canvas = await Canvas.findById(canvasId);
    if (!canvas) {
      res.status(400).send("Canvas not found");
    }
    user.favourites.push(canvasId);
    await user.save();
    return res.status(200).json({favourites:user.favourites})
  } catch (error) {
    res.status(500).send("Internal Server error");
  }
};

module.exports = addToFavourites;
