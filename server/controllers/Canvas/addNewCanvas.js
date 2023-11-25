const Canvas = require("../../models/Canvas/canvasSchema");
const User = require("../../models/userSchema");

const addNewCanvas = async (req, res) => {
  const { creatorId, canvasName, canvasData } = req.body;
  if(creatorId==="" || canvasName==="" || canvasData===""){
    return res.status(400).send("Invalid data")
  }
  try {
    const user = await User.findById(creatorId);
    if (!user) {
      return res.status(400).send("User not found");
    }
    const canvas = await Canvas.create({
      canvasName,
      canvasData,
      contributors: [creatorId],
    });

    if (canvas) {
      await canvas.save();
      await user.createdCanvases.push(canvas._id);
      await user.save();
      res.status(201).json({
        _id: canvas._id,
        canvasName: canvas.canvasName,
        canvasData: canvas.canvasData,
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
