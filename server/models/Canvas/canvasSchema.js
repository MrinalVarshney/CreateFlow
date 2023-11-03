const mongoose = require("mongoose")

const canvasSchema = mongoose.Schema(
    {
        canvasName: {type: String, required: true},
        contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true
    }
);

const Canvas = mongoose.model("Canvas", canvasSchema);

export default Canvas;