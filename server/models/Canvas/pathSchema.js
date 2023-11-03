const mongoose = require("mongoose");

const pathSchema = mongoose.Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    color: { type: String, required: true },
    thickness: { type: Number, required: true },
    creator: {type:mongoose.Schema.Types.ObjectId, ref: 'User' },
    canvas: {type:mongoose.Schema.Types.ObjectId, ref: 'Canvas'}
  },
  {
    timeStamps: true,
  }
);

const Path = mongoose.model("Path", pathSchema);

export default Path
