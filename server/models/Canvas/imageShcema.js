const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  url: String,
  startX: Number,
  startY: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  canvas: { type: mongoose.Schema.Types.ObjectId, ref: "Canvas" },
});

const Image = mongoose.model("Image",imageSchema)

export default Image