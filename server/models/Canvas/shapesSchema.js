const mongoose = require("mongoose");

const shapesSchema = mongoose.Schema({
  type: { types: String },
  startX: { type: Number },
  startY: { type: Number },
  endX: { type: Number },
  endY: { type: Number },
  color: { type: String, default: "black" },
  thickness: { types: Number, default: 1 },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  canvas: { type: mongoose.Schema.Types.ObjectId, ref: "Canvas" },
},{
    timeStamps:true,
});

const Shapes = mongoose.model("Shapes", shapesSchema)

export default Shapes