const Canvas = require("../../models/Canvas/canvasSchema");
const User = require("../../models/userSchema");

const addNewCanvas = async (req, res) => {
  const { creator, canvasName, data } = req.body;
  try {
    const user = await User.findById(creator.userId);
    if (!user) {
      return res.status(400).send("User not found");
    }
    const canvas = await Canvas.create({
      canvasName,
      data,
      collaborators: [creator.userId],
    });

    if (canvas) {
      await canvas.save();
      await user.createdCanvases.push(canvas._id);
      await user.save();
      res.status(201).json({
        success: true,
        canvasId: canvas._id,
      });
    } else {
      res.status(400).send("Invalid canvas data");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = addNewCanvas;
