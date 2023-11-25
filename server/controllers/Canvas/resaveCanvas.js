const Canvas = require("../../models/Canvas/canvasSchema");

const resaveCanvas = async (req, res) => {
  const { canvasId, canvasData } = req.body;
  try {
    const canvas = await Canvas.findById(canvasId);
    if (!canvas) {
      return res.status(400).send("Canvas not found");
    }
    canvas.canvasData = canvasData;
    await canvas.save();
    res.status(201).json({
      success: true,
      canvasId: canvas._id,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};


module.exports = resaveCanvas;